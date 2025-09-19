import Redis from 'ioredis';
const redis = new Redis(process.env.REDIS_URL);
export async function ping(){
  const pong = await redis.ping();
  return { ok:true, db:'redis', pong };
}