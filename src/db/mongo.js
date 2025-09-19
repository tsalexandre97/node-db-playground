import { MongoClient } from 'mongodb';

const url =
  process.env.MONGO_URL ||
  (process.env.MONGO_HOST &&
    `mongodb://${process.env.MONGO_USERNAME || 'root'}:${process.env.MONGO_PASSWORD || 'root'}@${process.env.MONGO_HOST}:${process.env.MONGO_PORT || 27017}/?authSource=admin`);

if (!url || !(url.startsWith('mongodb://') || url.startsWith('mongodb+srv://'))) {
  throw new Error('MONGO_URL não definida ou inválida. Verifique seu .env na raiz do projeto.');
}

console.log('[mongo] usando', url.replace(/\/\/.*?:.*?@/,'//<redacted>@'));
const client = new MongoClient(url);

let connected = false;
async function ensure() { if (!connected) { await client.connect(); connected = true; } }

export async function ping() {
  await ensure();
  const ping = await client.db('admin').command({ ping: 1 });
  return { ok: true, db: 'mongo', ping };
}
