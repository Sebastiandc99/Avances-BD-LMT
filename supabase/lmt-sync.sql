-- Independent Avances BD LMT project. No original PDF/DWG files are stored here.
create table public.lmt_events (
 seq bigint generated always as identity unique,
 user_id uuid not null references auth.users(id) on delete cascade,
 id uuid not null,
 span_id text not null check (span_id ~ '^(L|FP)-[0-9]{3}-[0-9]{3}$'),
 version integer not null check(version>0),
 payload jsonb not null check(jsonb_typeof(payload)='object' and octet_length(payload::text)<=15000),
 received_at timestamptz not null default now(),
 primary key(user_id,id),
 unique(user_id,span_id,version)
);
alter table public.lmt_events enable row level security;
revoke all on public.lmt_events from anon, authenticated;
grant select,insert on public.lmt_events to authenticated;
grant usage on sequence public.lmt_events_seq_seq to authenticated;
create policy lmt_read_own on public.lmt_events for select to authenticated using ((select auth.uid())=user_id);
create policy lmt_insert_own on public.lmt_events for insert to authenticated with check ((select auth.uid())=user_id);

create function public.lmt_append_event(p_event jsonb) returns text
language plpgsql security invoker set search_path='' as $$
declare
 u uuid:=auth.uid(); s text:=p_event->>'spanId'; v integer; b integer;
 existing jsonb; photo text; parts text[]; max_span integer;
begin
 if u is null then raise exception 'Iniciá sesión.' using errcode='42501'; end if;
 if jsonb_typeof(p_event)<>'object' or octet_length(p_event::text)>15000 then raise exception 'Registro inválido'; end if;
 parts:=regexp_match(s,'^(L|FP)-([0-9]{3})-([0-9]{3})$');
 if parts is null then raise exception 'Vano inválido'; end if;
 max_span:=case when parts[1]='L' then 219 else 18 end;
 if parts[2]::int<1 or parts[3]::int<>parts[2]::int+1 or parts[3]::int>max_span then raise exception 'Vano inválido'; end if;
 v:=(p_event->>'version')::int; b:=(p_event->>'baseVersion')::int;
 if v is null or b is null or b<0 or v<>b+1
 or (p_event->>'id') is null or (p_event->>'id')::uuid is null
 or coalesce(p_event->>'status','') not in ('pendiente','ejecucion','terminado','observaciones')
 or coalesce(p_event->>'installed','') !~ '^[0-9]+$'
 or (p_event->>'installed')::int>1000
 or (p_event->>'status'='pendiente' and (p_event->>'installed')::int<>0)
 or jsonb_typeof(p_event->'photos') is distinct from 'array'
 or jsonb_array_length(p_event->'photos')>8
 or jsonb_typeof(p_event->'notes') is distinct from 'string' or length(p_event->>'notes')>4000
 or jsonb_typeof(p_event->'responsible') is distinct from 'string' or length(p_event->>'responsible')>120
 or jsonb_typeof(p_event->'author') is distinct from 'string' or length(p_event->>'author')>320
 or jsonb_typeof(p_event->'date') is distinct from 'string'
 or (p_event->>'date'<>'' and ((p_event->>'date')::date<'2020-01-01'::date or (p_event->>'date')::date>(now() at time zone 'America/Argentina/Salta')::date))
 or coalesce(p_event->>'createdAt','')='' or (p_event->>'createdAt')::timestamptz is null
 then raise exception 'Datos del avance inválidos'; end if;
 -- One transaction per user/span, including simultaneous writes from two devices.
 perform pg_advisory_xact_lock(hashtextextended(u::text||s,0));
 select payload into existing from public.lmt_events where user_id=u and id=(p_event->>'id')::uuid;
 if found then return case when existing=p_event then 'saved' else 'conflict' end; end if;
 if (select coalesce(max(version),0) from public.lmt_events where user_id=u and span_id=s)<>b then return 'conflict'; end if;
 for photo in select jsonb_array_elements_text(p_event->'photos') loop
  if photo::uuid is null or not exists(select 1 from storage.objects where bucket_id='lmt-photos' and name=u::text||'/'||photo) then raise exception 'Foto sin subir'; end if;
 end loop;
 insert into public.lmt_events(user_id,id,span_id,version,payload) values(u,(p_event->>'id')::uuid,s,v,p_event);
 return 'saved';
end $$;
revoke all on function public.lmt_append_event(jsonb) from public,anon;
grant execute on function public.lmt_append_event(jsonb) to authenticated;

insert into storage.buckets(id,name,public,file_size_limit,allowed_mime_types)
 values('lmt-photos','lmt-photos',false,12582912,array['image/jpeg','image/png','image/webp']);
create policy lmt_photo_read on storage.objects for select to authenticated using(bucket_id='lmt-photos' and (storage.foldername(name))[1]=(select auth.uid())::text);
create policy lmt_photo_insert on storage.objects for insert to authenticated with check(bucket_id='lmt-photos' and (storage.foldername(name))[1]=(select auth.uid())::text and storage.filename(name) ~ '^[a-f0-9-]{36}$');
