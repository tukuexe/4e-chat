import { kv } from '@vercel/kv';
export default async (req, res) => {
  if (req.method !== 'POST') return res.status(405).end();
  const { u, m, t } = await req.json();
  if (!u || !m || !t) return res.status(400).json({ error: 'missing field' });
  const entry = { u, m, t };
  await kv.lpush('chat', JSON.stringify(entry));
  // broadcast to online clients
  await fetch(`${process.env.VERCEL_URL}/api/broadcast`, {
    method: 'POST', body: JSON.stringify(entry), headers: { 'Content-Type': 'application/json' }
  }).catch(() => {});
  res.json({ ok: true });
};
