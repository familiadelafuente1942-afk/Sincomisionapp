export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) return res.status(500).json({ error: "Falta ANTHROPIC_API_KEY" });
  try {
    const { system, messages, max_tokens } = req.body || {};
    const r = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-api-key": key, "anthropic-version": "2023-06-01" },
      body: JSON.stringify({
        model: "claude-sonnet-4-5",
        max_tokens: Math.min(max_tokens || 1000, 1500),
        system, messages,
        tools: [{ type: "web_search_20250305", name: "web_search" }],
      }),
    });
    res.status(r.status).json(await r.json());
  } catch (e) {
    res.status(500).json({ error: "proxy_error" });
  }
}
