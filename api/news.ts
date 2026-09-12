import { envelope, json, readPublicTable } from "../server/live-api.js";

export const config = { runtime: "edge" };

export default async function handler() {
  const [news, media] = await Promise.all([
    readPublicTable("news", "select=id,slug,category,title,excerpt,body,tags,published_at,hero_media_id&status=eq.published&order=published_at.desc"),
    readPublicTable("media", "select=id,storage_path,external_url&status=eq.published"),
  ]);
  type MediaRow = { id: string; storage_path: string | null; external_url: string | null };
  const mediaById = new Map((media.data as MediaRow[]).map(m => [m.id, m]));
  const data = (news.data as { hero_media_id: string | null }[]).map(item => {
    const hero = item.hero_media_id ? mediaById.get(item.hero_media_id) : undefined;
    return {
      ...item,
      hero_media_url: hero?.storage_path ? null : hero?.external_url ?? null,
      hero_media_storage_path: hero?.storage_path ?? null,
    };
  });
  return json(envelope(data, news.configured));
}
