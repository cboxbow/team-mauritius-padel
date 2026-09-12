import { envelope, json, readPublicTable } from "../../server/live-api.js";

export const config = { runtime: "edge" };

export default async function handler() {
  const result = await readPublicTable("matches", "select=id,court,scheduled_at,status,team_a_id,team_b_id&order=scheduled_at.asc");
  return json(envelope(result.data, result.configured));
}
