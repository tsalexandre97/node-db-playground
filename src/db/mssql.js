import sql from 'mssql';
let pool;
function cfg(){
  const url = new URL(process.env.MSSQL_URL);
  return {
    user: url.username,
    password: url.password,
    server: url.hostname,
    port: Number(url.port || 1433),
    database: url.pathname.replace(/^\//,'' ) || 'master',
    options: { encrypt: false, trustServerCertificate: true }
  };
}
async function ensure(){ if(!pool){ pool = await sql.connect(cfg()); } }
export async function ping(){
  await ensure();
  const r = await pool.request().query('SELECT @@VERSION AS version');
  return { ok:true, db:'mssql', version: r.recordset[0].version };
}