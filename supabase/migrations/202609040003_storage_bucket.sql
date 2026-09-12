-- Public bucket for player/session/news photos. Public read; writes require
-- an authenticated staff member (admin/editor/scorer per is_team_admin()).

insert into storage.buckets (id, name, public)
values ('media-public', 'media-public', true)
on conflict (id) do nothing;

create policy "public read media-public" on storage.objects
  for select using (bucket_id = 'media-public');

create policy "admin insert media-public" on storage.objects
  for insert with check (bucket_id = 'media-public' and public.is_team_admin());

create policy "admin update media-public" on storage.objects
  for update using (bucket_id = 'media-public' and public.is_team_admin());

create policy "admin delete media-public" on storage.objects
  for delete using (bucket_id = 'media-public' and public.is_team_admin());
