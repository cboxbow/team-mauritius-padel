insert into public.teams (id, name, nation) values
  ('00000000-0000-4000-8000-000000000001', 'Team Mauritius', 'Mauritius'),
  ('00000000-0000-4000-8000-000000000002', 'Team La Réunion', 'La Réunion'),
  ('00000000-0000-4000-8000-000000000003', 'Team Madagascar', 'Madagascar')
on conflict (id) do update set name = excluded.name, nation = excluded.nation;

insert into public.events (id, slug, name, starts_at, ends_at, venue, location, status) values
  ('00000000-0000-4000-8000-000000000010', 'island-padel-cup-2026', 'Island Padel Cup 2026', '2026-10-01T00:00:00+04:00', '2026-10-04T23:59:59+04:00', 'Club de Champ Fleuri', 'La Réunion', 'published')
on conflict (slug) do update set starts_at = excluded.starts_at, ends_at = excluded.ends_at, venue = excluded.venue, location = excluded.location;

insert into public.players (id, slug, team_id, full_name, gender, status) values
  ('10000000-0000-4000-8000-000000000001', 'mathieu-vallet', '00000000-0000-4000-8000-000000000001', 'Mathieu Vallet', 'Men', 'published'),
  ('10000000-0000-4000-8000-000000000002', 'amaury-de-beer', '00000000-0000-4000-8000-000000000001', 'Amaury de Beer', 'Men', 'published'),
  ('10000000-0000-4000-8000-000000000003', 'olivier-couacaud', '00000000-0000-4000-8000-000000000001', 'Olivier Couacaud', 'Men', 'published'),
  ('10000000-0000-4000-8000-000000000004', 'jake-lam-hau-ching', '00000000-0000-4000-8000-000000000001', 'Jake Lam Hau Ching', 'Men', 'published'),
  ('10000000-0000-4000-8000-000000000005', 'ryan-wong', '00000000-0000-4000-8000-000000000001', 'Ryan Wong', 'Men', 'published'),
  ('10000000-0000-4000-8000-000000000006', 'simon-koenig', '00000000-0000-4000-8000-000000000001', 'Simon Koenig', 'Men', 'published'),
  ('10000000-0000-4000-8000-000000000007', 'nicolas-legros', '00000000-0000-4000-8000-000000000001', 'Nicolas Legros', 'Men', 'published'),
  ('10000000-0000-4000-8000-000000000011', 'magaly-schaffo', '00000000-0000-4000-8000-000000000001', 'Magaly Schaffo', 'Women', 'published'),
  ('10000000-0000-4000-8000-000000000012', 'marine-giraud', '00000000-0000-4000-8000-000000000001', 'Marine Giraud', 'Women', 'published'),
  ('10000000-0000-4000-8000-000000000013', 'laura-koenig', '00000000-0000-4000-8000-000000000001', 'Laura Koenig', 'Women', 'published'),
  ('10000000-0000-4000-8000-000000000014', 'alice-danjoux', '00000000-0000-4000-8000-000000000001', 'Alice Danjoux', 'Women', 'published'),
  ('10000000-0000-4000-8000-000000000015', 'celine-desvaux-de-marigny', '00000000-0000-4000-8000-000000000001', 'Céline Desvaux de Marigny', 'Women', 'published'),
  ('10000000-0000-4000-8000-000000000016', 'cecile-park', '00000000-0000-4000-8000-000000000001', 'Cécile Park', 'Women', 'published'),
  ('10000000-0000-4000-8000-000000000017', 'kate-foo-kune', '00000000-0000-4000-8000-000000000001', 'Kate Foo Kune', 'Women', 'published')
on conflict (slug) do update set full_name = excluded.full_name, gender = excluded.gender, team_id = excluded.team_id;

insert into public.coaches (id, slug, full_name, role, preparation_approach, tactical_priorities, competition_mindset, status) values
  ('20000000-0000-4000-8000-000000000001', 'adam-auckland', 'Adam Auckland', 'Head Coach', 'Lead the collective preparation and establish a clear competitive identity for Team Mauritius.', 'Pair combinations, match strategy, court positioning, pressure scenarios and competition-day routines.', 'Arrive in La Réunion with clear pair structures, shared tactical references and a united team culture.', 'published')
on conflict (slug) do update set role = excluded.role, preparation_approach = excluded.preparation_approach, tactical_priorities = excluded.tactical_priorities, competition_mindset = excluded.competition_mindset;

insert into public.training_sessions (id, slug, event_id, title, phase, starts_at, ends_at, location, objectives, brunch_after, session_status) values
  ('30000000-0000-4000-8000-000000000001', '06-sep-assess', '00000000-0000-4000-8000-000000000010', 'Assess', 'ASSESS', '2026-09-06T07:00:00+04:00', '2026-09-06T09:00:00+04:00', 'Caña Club', '["Team building","Player assessment","Pressure points"]'::jsonb, true, 'UPCOMING'),
  ('30000000-0000-4000-8000-000000000002', '13-sep-build', '00000000-0000-4000-8000-000000000010', 'Build', 'BUILD', '2026-09-13T07:00:00+04:00', '2026-09-13T09:00:00+04:00', 'Caña Club', '["Pair chemistry","Communication","Tactical patterns"]'::jsonb, true, 'UPCOMING'),
  ('30000000-0000-4000-8000-000000000003', '24-sep-compete', '00000000-0000-4000-8000-000000000010', 'Compete', 'COMPETE', '2026-09-24T12:30:00+04:00', '2026-09-24T14:30:00+04:00', 'Caña Club', '["Match simulation","Competition intensity","Pressure situations"]'::jsonb, false, 'UPCOMING'),
  ('30000000-0000-4000-8000-000000000004', '27-sep-final-camp', '00000000-0000-4000-8000-000000000010', 'Final Camp', 'FINAL CAMP', '2026-09-27T07:00:00+04:00', '2026-09-27T09:00:00+04:00', 'Caña Club', '["Final pairings","Island Cup simulation","Team briefing","Official Team Mauritius photo"]'::jsonb, true, 'UPCOMING')
on conflict (slug) do update set starts_at = excluded.starts_at, ends_at = excluded.ends_at, objectives = excluded.objectives, brunch_after = excluded.brunch_after;
