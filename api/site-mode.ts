import { envelope, json, readPublicTable } from "../server/live-api.js";

export const config = { runtime: "edge" };

export default async function handler() {
  const result = await readPublicTable("site_settings", "select=mode&limit=1");
  return json(envelope(result.data[0] ?? { mode: "pre_event" }, result.configured));
}
