import { envelope, json, readPublicTable } from "../server/live-api.js";

export const config = { runtime: "edge" };

export default async function handler() {
  const [players, media] = await Promise.all([
    readPublicTable("players", "select=*&status=eq.published&order=full_name.asc"),
    readPublicTable("media", "select=*&player_id=not.is.null&status=eq.published"),
  ]);
  const mediaByPlayer = new Map<string, unknown[]>();
  for (const row of media.data as { player_id: string }[]) {
    const list = mediaByPlayer.get(row.player_id) ?? [];
    list.push(row);
    mediaByPlayer.set(row.player_id, list);
  }
  const data = (players.data as { id: string }[]).map(player => ({
    ...player,
    media: mediaByPlayer.get(player.id) ?? [],
  }));
  return json(envelope(data, players.configured));
}
