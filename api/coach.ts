import { envelope, json, readPublicTable } from "../server/live-api.js";

export const config = { runtime: "edge" };

export default async function handler() {
  const result = await readPublicTable("coaches", "select=*&status=eq.published&limit=1");
  return json(envelope(result.data[0] ?? null, result.configured));
}
