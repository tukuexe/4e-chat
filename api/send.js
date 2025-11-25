import { sql } from '@vercel/postgres';
export default async (req, res) => {
  if (req.method !== 'POST') return res.status(405).end();
  const { u, m, t } = JSON.parse(req.body || '{}');
  if (!u || !m || !t) return res.status(400).json({ error: 'missing field' });
  // create table if not exists (first call)
  await sql`CREATE TABLE IF NOT EXISTS chat (u TEXT, m TEXT, t BIGINT)`;
  await sql`INSERT INTO chat (u, m, t) VALUES (${u}, ${m}, ${t})`;
  // broadcast to online clients
  await fetch(`${process.env.VERCEL_URL}/api/broadcast`, {
    method: 'POST', body: JSON.stringify({ u, m, t }), headers: { 'Content-Type': 'application/json' }
  }).catch(() => {});
  res.json({ ok: true });
};
