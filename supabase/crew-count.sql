-- Optional field for older and newer app clients, validated in every insert.
alter table public.lmt_events
add constraint lmt_events_crews_check check (
 case when payload ? 'crews' then
  case when jsonb_typeof(payload->'crews') = 'number' then
   (payload->>'crews')::numeric between 1 and 9007199254740991
   and trunc((payload->>'crews')::numeric) = (payload->>'crews')::numeric
  else false end
 else true end
);
