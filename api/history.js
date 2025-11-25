import { sql } from '@vercel/postgres';
export default async (req, res) => {
  const rows = await sql`SELECT u, m, t FROM chat ORDER BY t DESC`;
  const msgs = rows.rows.map(r => ({ u: r.u, m: r.m, t: Number(r.t) }));
  res.json(msgs);
};
