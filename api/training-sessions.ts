import { envelope, json, readPublicTable } from "../server/live-api.js";

export const config = { runtime: "edge" };

export default async function handler() {
  const [sessions, reports, media] = await Promise.all([
    readPublicTable("training_sessions", "select=*&order=starts_at.asc"),
    readPublicTable("training_reports", "select=*&status=eq.published"),
    readPublicTable("media", "select=*&session_id=not.is.null&status=eq.published"),
  ]);
  const data = (sessions.data as { id: string }[]).map(session => ({
    ...session,
    report: (reports.data as { session_id: string }[]).find(r => r.session_id === session.id) ?? null,
    media: (media.data as { session_id: string }[]).filter(m => m.session_id === session.id),
  }));
  return json(envelope(data, sessions.configured));
}
