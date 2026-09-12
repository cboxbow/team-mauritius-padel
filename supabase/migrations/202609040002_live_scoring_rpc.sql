-- Live scoring write path. These run as SECURITY DEFINER (they bypass RLS on the
-- underlying tables), so each one re-checks is_team_admin() itself before writing —
-- that check is the only thing standing between "authenticated" and "can edit scores".
-- Execute is revoked from everyone except the `authenticated` role for the same reason.

create or replace function public.admin_set_match_status(p_match_id uuid, p_status public.match_status)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_previous jsonb;
begin
  if not public.is_team_admin() then
    raise exception 'not authorized';
  end if;

  select to_jsonb(m) into v_previous from public.matches m where id = p_match_id;
  if v_previous is null then
    raise exception 'match not found';
  end if;

  update public.matches set status = p_status, updated_at = now() where id = p_match_id;

  insert into public.score_audit (match_id, actor_user_id, action, previous_state, next_state)
  values (p_match_id, auth.uid(), 'set_status', v_previous, jsonb_build_object('status', p_status));
end;
$$;

create or replace function public.admin_update_live_score(
  p_match_id uuid,
  p_points_a text,
  p_points_b text,
  p_games_a smallint,
  p_games_b smallint,
  p_serving_side text
)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_previous jsonb;
  v_next jsonb;
begin
  if not public.is_team_admin() then
    raise exception 'not authorized';
  end if;
  if p_serving_side is not null and p_serving_side not in ('A', 'B') then
    raise exception 'serving_side must be A or B';
  end if;

  select to_jsonb(ls) into v_previous from public.live_scores ls where match_id = p_match_id;

  insert into public.live_scores (match_id, points_a, points_b, games_a, games_b, serving_side, updated_at, updated_by)
  values (p_match_id, p_points_a, p_points_b, p_games_a, p_games_b, p_serving_side, now(), auth.uid())
  on conflict (match_id) do update set
    points_a = excluded.points_a,
    points_b = excluded.points_b,
    games_a = excluded.games_a,
    games_b = excluded.games_b,
    serving_side = excluded.serving_side,
    updated_at = now(),
    updated_by = auth.uid();

  select to_jsonb(ls) into v_next from public.live_scores ls where match_id = p_match_id;

  insert into public.score_audit (match_id, actor_user_id, action, previous_state, next_state)
  values (p_match_id, auth.uid(), 'update_live_score', v_previous, v_next);
end;
$$;

create or replace function public.admin_record_match_set(
  p_match_id uuid,
  p_set_number smallint,
  p_games_a smallint,
  p_games_b smallint,
  p_winner_side text
)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_previous jsonb;
  v_next jsonb;
begin
  if not public.is_team_admin() then
    raise exception 'not authorized';
  end if;
  if p_winner_side is not null and p_winner_side not in ('A', 'B') then
    raise exception 'winner_side must be A or B';
  end if;

  select to_jsonb(s) into v_previous from public.match_sets s
    where match_id = p_match_id and set_number = p_set_number;

  insert into public.match_sets (match_id, set_number, games_a, games_b, winner_side)
  values (p_match_id, p_set_number, p_games_a, p_games_b, p_winner_side)
  on conflict (match_id, set_number) do update set
    games_a = excluded.games_a,
    games_b = excluded.games_b,
    winner_side = excluded.winner_side;

  select to_jsonb(s) into v_next from public.match_sets s
    where match_id = p_match_id and set_number = p_set_number;

  insert into public.score_audit (match_id, actor_user_id, action, previous_state, next_state)
  values (p_match_id, auth.uid(), 'record_match_set', v_previous, v_next);
end;
$$;

revoke all on function public.admin_set_match_status(uuid, public.match_status) from public;
revoke all on function public.admin_update_live_score(uuid, text, text, smallint, smallint, text) from public;
revoke all on function public.admin_record_match_set(uuid, smallint, smallint, smallint, text) from public;

grant execute on function public.admin_set_match_status(uuid, public.match_status) to authenticated;
grant execute on function public.admin_update_live_score(uuid, text, text, smallint, smallint, text) to authenticated;
grant execute on function public.admin_record_match_set(uuid, smallint, smallint, smallint, text) to authenticated;
