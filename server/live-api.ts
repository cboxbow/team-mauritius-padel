export const eventContext = {
  event: "Island Padel Cup 2026",
  dates: "2026-10-01/2026-10-04",
  venue: "Club de Champ Fleuri",
  location: "La Réunion",
  nations: ["Mauritius", "La Réunion", "Madagascar"],
};

export async function readPublicTable(table: string, query: string) {
  const baseUrl = process.env.SUPABASE_URL;
  const anonKey = process.env.SUPABASE_ANON_KEY;
  if (!baseUrl || !anonKey) return { configured: false, data: [] as unknown[] };
  try {
    const response = await fetch(`${baseUrl}/rest/v1/${table}?${query}`, {
      headers: { apikey: anonKey, Authorization: `Bearer ${anonKey}` },
    });
    if (!response.ok) return { configured: true, data: [] as unknown[] };
    return { configured: true, data: await response.json() as unknown[] };
  } catch {
    return { configured: true, data: [] as unknown[] };
  }
}

export function json(payload: unknown) {
  return new Response(JSON.stringify(payload), {
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "public, s-maxage=5, stale-while-revalidate=15",
      "access-control-allow-origin": "*",
    },
  });
}

export function envelope(data: unknown, configured: boolean) {
  return { ok: true, source: configured ? "supabase" : "awaiting-connection", generatedAt: new Date().toISOString(), context: eventContext, data };
}
