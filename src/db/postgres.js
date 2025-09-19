import pg from 'pg';
const pool = new pg.Pool({ connectionString: process.env.POSTGRES_URL });

export async function ping(){
  const { rows } = await pool.query('SELECT version() as version, NOW() as now');
  return { ok:true, db:'postgres', version: rows[0].version, now: rows[0].now };
}