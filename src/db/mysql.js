import mysql from 'mysql2/promise';
let pool;
function getPool(){
  if (!pool) pool = mysql.createPool(process.env.MYSQL_URL + '?timezone=Z');
  return pool;
}
export async function ping(){
  const [rows] = await getPool().query('SELECT VERSION() AS version, NOW() AS now');
  return { ok:true, db:'mysql', version: rows[0].version, now: rows[0].now };
}