import { envelope, json, readPublicTable } from "../../server/live-api.js";

export const config = { runtime: "edge" };

export default async function handler() {
  const result = await readPublicTable("standings", "select=id,event_id,team_id,played,won,lost,points&order=points.desc");
  return json(envelope(result.data, result.configured));
}
