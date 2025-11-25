import { kv } from '@vercel/kv';
const OWNER = '6142816761';
export default async (req, res) => {
  if (req.method !== 'POST') return res.status(405).end();
  const { key } = await req.json();
  if (key !== OWNER) return res.status(403).json({ error: 'forbidden' });
  await kv.del('chat');
  res.json({ ok: true });
};
