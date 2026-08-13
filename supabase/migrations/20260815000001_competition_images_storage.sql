-- Public bucket for competition images. Uploaded client-side by admins from
-- the drag-and-drop uploader in the competition form (see
-- components/admin/image-dropzone.tsx), then the resulting public URLs are
-- stored in competitions.images (unchanged — still text[]).
insert into storage.buckets (id, name, public)
values ('competition-images', 'competition-images', true)
on conflict (id) do nothing;

-- Anyone can read (bucket is public, but explicit for clarity/defense in depth).
create policy "competition_images_select_public"
  on storage.objects for select
  to anon, authenticated
  using (bucket_id = 'competition-images');

-- Only admins can upload/replace/delete.
create policy "competition_images_insert_admin"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'competition-images' and public.is_admin());

create policy "competition_images_update_admin"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'competition-images' and public.is_admin())
  with check (bucket_id = 'competition-images' and public.is_admin());

create policy "competition_images_delete_admin"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'competition-images' and public.is_admin());
