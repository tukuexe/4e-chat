import { kv } from '@vercel/kv';
export default async (req, res) => {
  const raw = await kv.lrange('chat', 0, -1);
  const msgs = raw.map(x => JSON.parse(x));
  res.json(msgs.reverse());
};
