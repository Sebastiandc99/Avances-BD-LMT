begin;
-- Run after device-pairing.sql, only for the single shared LMT pilot.
-- Abort if the existing shared project cannot be identified unambiguously.
create table lmt_private.shared_workspace (
  singleton boolean primary key default true check (singleton),
  owner_id uuid not null references auth.users(id) on delete restrict
);
alter table lmt_private.shared_workspace enable row level security;
revoke all on lmt_private.shared_workspace from public, anon, authenticated;

do $$
declare
  project_owner uuid;
begin
  select distinct e.user_id into strict project_owner from public.lmt_events as e;
  if not exists (select 1 from lmt_private.devices where owner_id = project_owner)
     or exists (select 1 from lmt_private.devices where owner_id <> project_owner) then
    raise exception 'Revisar la obra a compartir: las vinculaciones no identifican una única obra con avances.';
  end if;
  insert into lmt_private.shared_workspace(owner_id) values (project_owner);
end $$;

-- The existing event and photo policies and save RPC all use this resolver.
-- No membership insertion, copy of progress, or client-supplied owner is needed.
create or replace function lmt_private.workspace_owner() returns uuid
language sql stable security definer set search_path = ''
as $$
  select owner_id from lmt_private.shared_workspace
  where singleton and (select auth.uid()) is not null
$$;
revoke all on function lmt_private.workspace_owner() from public, anon;
grant execute on function lmt_private.workspace_owner() to authenticated;
commit;
