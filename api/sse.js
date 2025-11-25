import { kv } from '@vercel/kv';
let clients = [];
export default async (req, res) => {
  if (req.method !== 'GET') return res.status(405).end();
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive',
    'Access-Control-Allow-Origin': '*'
  });
  const id = Date.now();
  clients.push({ id, res });
  req.on('close', () => { clients = clients.filter(c => c.id !== id); });
};
export function broadcast(data) {
  clients.forEach(c => c.res.write(`data: ${JSON.stringify(data)}\n\n`));
}
