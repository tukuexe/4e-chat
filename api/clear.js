import { sql } from '@vercel/postgres';
const OWNER = '6142816761';
export default async (req, res) => {
  if (req.method !== 'POST') return res.status(405).end();
  const { key } = JSON.parse(req.body || '{}');
  if (key !== OWNER) return res.status(403).json({ error: 'forbidden' });
  await sql`DELETE FROM chat`;
  res.json({ ok: true });
};
