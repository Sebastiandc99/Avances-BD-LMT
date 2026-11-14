begin;
create schema if not exists lmt_private;
revoke all on schema lmt_private from public, anon;
grant usage on schema lmt_private to authenticated;
create table lmt_private.devices (
 user_id uuid primary key references auth.users(id) on delete cascade,
 owner_id uuid not null references auth.users(id) on delete cascade,
 created_at timestamptz not null default now(),
 check(user_id<>owner_id)
);
create index devices_owner_idx on lmt_private.devices(owner_id);
create table lmt_private.pairing_codes (
 code_hash bytea primary key,
 issuer_id uuid not null unique references auth.users(id) on delete cascade,
 owner_id uuid not null references auth.users(id) on delete cascade,
 expires_at timestamptz not null,
 used_by uuid references auth.users(id) on delete set null,
 consumed_at timestamptz
);
alter table lmt_private.devices enable row level security;
alter table lmt_private.pairing_codes enable row level security;
revoke all on all tables in schema lmt_private from public, anon, authenticated;

-- These private definer functions manage membership. They require a valid actor,
-- use fixed SQL and cannot accept a target owner from the client.
create function lmt_private.workspace_owner() returns uuid
language sql stable security definer set search_path=''
as $$ select coalesce((select owner_id from lmt_private.devices where user_id=auth.uid()),auth.uid()) $$;
create function public.lmt_workspace_owner() returns uuid
language sql stable security invoker set search_path=''
as $$ select lmt_private.workspace_owner() $$;

create function lmt_private.create_pairing() returns jsonb
language plpgsql security definer set search_path=''
as $$
declare actor uuid:=auth.uid(); owner uuid; code text; expiry timestamptz;
begin
 if actor is null then raise exception 'Falta la sesion del dispositivo.' using errcode='42501'; end if;
 perform pg_advisory_xact_lock(hashtextextended('lmt-actor-'||actor::text,0));
 owner:=lmt_private.workspace_owner();
 code:=upper(encode(extensions.gen_random_bytes(12),'hex'));
 expiry:=now()+interval '10 minutes';
 delete from lmt_private.pairing_codes where issuer_id=actor or expires_at<now();
 insert into lmt_private.pairing_codes(code_hash,issuer_id,owner_id,expires_at)
 values(extensions.digest(code,'sha256'),actor,owner,expiry);
 return jsonb_build_object('code',code,'expires_at',expiry);
end $$;
create function public.lmt_create_pairing() returns jsonb
language sql security invoker set search_path=''
as $$ select lmt_private.create_pairing() $$;

create function lmt_private.pair_device(p_code text) returns uuid
language plpgsql security definer set search_path=''
as $$
declare actor uuid:=auth.uid(); normalized text; invitation lmt_private.pairing_codes%rowtype;
 issuer_owner uuid; current_owner uuid;
begin
 if actor is null then raise exception 'Falta la sesion del dispositivo.' using errcode='42501'; end if;
 normalized:=upper(regexp_replace(coalesce(p_code,''),'[-[:space:]]','','g'));
 if length(normalized)<>24 or normalized !~ '^[A-F0-9]+$' then raise exception 'Codigo invalido o vencido.'; end if;
 perform pg_advisory_xact_lock(hashtextextended('lmt-actor-'||actor::text,0));
 select * into invitation from lmt_private.pairing_codes
 where code_hash=extensions.digest(normalized,'sha256') for update;
 if not found then raise exception 'Codigo invalido o vencido.'; end if;
 current_owner:=lmt_private.workspace_owner();
 if invitation.used_by=actor and current_owner=invitation.owner_id then return current_owner; end if;
 if invitation.expires_at<=clock_timestamp() or invitation.consumed_at is not null then raise exception 'Codigo invalido o vencido.'; end if;
 issuer_owner:=coalesce((select owner_id from lmt_private.devices where user_id=invitation.issuer_id),invitation.issuer_id);
 if issuer_owner<>invitation.owner_id then raise exception 'Genera un codigo nuevo desde el equipo con los avances.'; end if;
 if current_owner<>invitation.owner_id then
  if exists(select 1 from lmt_private.devices where owner_id=actor) then
   raise exception 'Este equipo ya comparte sus avances con otros. Genera el codigo aqui y usalo en el equipo que quieras agregar.';
  end if;
  insert into lmt_private.devices(user_id,owner_id) values(actor,invitation.owner_id)
  on conflict(user_id) do update set owner_id=excluded.owner_id,created_at=now();
 end if;
 update lmt_private.pairing_codes set used_by=actor,consumed_at=clock_timestamp() where code_hash=invitation.code_hash;
 return invitation.owner_id;
end $$;
create function public.lmt_pair_device(p_code text) returns uuid
language sql security invoker set search_path=''
as $$ select lmt_private.pair_device(p_code) $$;

revoke all on all functions in schema lmt_private from public,anon;
grant execute on all functions in schema lmt_private to authenticated;
revoke all on function public.lmt_workspace_owner(),public.lmt_create_pairing(),public.lmt_pair_device(text) from public,anon;
grant execute on function public.lmt_workspace_owner(),public.lmt_create_pairing(),public.lmt_pair_device(text) to authenticated;

alter policy lmt_read_own on public.lmt_events using (
 user_id=(select auth.uid()) or user_id=(select lmt_private.workspace_owner())
);
alter policy lmt_insert_own on public.lmt_events with check (
 user_id=(select auth.uid()) or user_id=(select lmt_private.workspace_owner())
);
alter policy lmt_photo_read on storage.objects using (
 bucket_id='lmt-photos' and (storage.foldername(name))[1] in ((select auth.uid())::text,(select lmt_private.workspace_owner())::text)
);
alter policy lmt_photo_insert on storage.objects with check (
 bucket_id='lmt-photos' and (storage.foldername(name))[1] in ((select auth.uid())::text,(select lmt_private.workspace_owner())::text)
 and storage.filename(name) ~ '^[a-f0-9-]{36}$'
);
CREATE OR REPLACE FUNCTION public.lmt_append_event(p_event jsonb)
 RETURNS text
 LANGUAGE plpgsql
 SET search_path TO ''
AS $function$
declare
 u uuid; s text:=p_event->>'spanId'; v integer; b integer;
 existing jsonb; photo text; parts text[]; max_span integer;
begin
 if auth.uid() is null then raise exception 'Falta la sesion del dispositivo.' using errcode='42501'; end if;
 perform pg_advisory_xact_lock(hashtextextended('lmt-actor-'||auth.uid()::text,0));
 u:=lmt_private.workspace_owner();
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
end $function$;

create function public.lmt_append_workspace_event(p_event jsonb,p_owner uuid) returns text
language plpgsql security invoker set search_path=''
as $$ begin
 if auth.uid() is null then raise exception 'Falta la sesion del dispositivo.' using errcode='42501'; end if;
 perform pg_advisory_xact_lock(hashtextextended('lmt-actor-'||auth.uid()::text,0));
 if p_owner is distinct from lmt_private.workspace_owner() then raise exception 'La vinculacion de este equipo cambio. Actualiza la conexion antes de guardar.'; end if;
 return public.lmt_append_event(p_event);
end $$;
revoke all on function public.lmt_append_workspace_event(jsonb,uuid) from public,anon;
grant execute on function public.lmt_append_workspace_event(jsonb,uuid) to authenticated;
commit;
