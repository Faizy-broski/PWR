export const COMPETITION_IMAGES_BUCKET = "competition-images";

// Public bucket URLs look like:
//   https://<project>.supabase.co/storage/v1/object/public/<bucket>/<path>
// Extracts the object path back out so we can call storage.remove() by URL.
export function storagePathFromPublicUrl(
  url: string,
  bucket: string = COMPETITION_IMAGES_BUCKET,
): string | null {
  const marker = `/object/public/${bucket}/`;
  const index = url.indexOf(marker);
  if (index === -1) return null;
  return decodeURIComponent(url.slice(index + marker.length));
}
