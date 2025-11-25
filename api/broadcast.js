import { broadcast } from './sse.js';
export default async (req, res) => {
  const data = await req.json();
  broadcast(data);
  res.status(200).end();
};
