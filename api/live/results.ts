import { envelope, json, readPublicTable } from "../../server/live-api.js";

export const config = { runtime: "edge" };

export default async function handler() {
  const result = await readPublicTable("matches", "select=id,court,scheduled_at,status,team_a_id,team_b_id,winner_team_id,match_sets(*)&status=eq.FINISHED&order=scheduled_at.desc");
  return json(envelope(result.data, result.configured));
}
