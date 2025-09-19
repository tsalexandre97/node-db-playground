// src/server.js
import express from 'express';
import * as pgdb from './db/postgres.js';
import * as mysqldb from './db/mysql.js';
import * as mongodb from './db/mongo.js';
import * as redisdb from './db/redis.js';
import * as mssqldb from './db/mssql.js';

export async function createServer() {
  const app = express();
  app.use(express.json());

  app.get('/health', (req, res) => res.json({ ok: true }));

  app.get('/db/postgres/ping', async (req, res) => {
    try { res.json(await pgdb.ping()); } catch (e) { res.status(500).json(err(e)); }
  });
  app.get('/db/mysql/ping', async (req, res) => {
    try { res.json(await mysqldb.ping()); } catch (e) { res.status(500).json(err(e)); }
  });
  app.get('/db/mongo/ping', async (req, res) => {
    try { res.json(await mongodb.ping()); } catch (e) { res.status(500).json(err(e)); }
  });
  app.get('/db/redis/ping', async (req, res) => {
    try { res.json(await redisdb.ping()); } catch (e) { res.status(500).json(err(e)); }
  });
  app.get('/db/mssql/ping', async (req, res) => {
    try { res.json(await mssqldb.ping()); } catch (e) { res.status(500).json(err(e)); }
  });

  return app;
}

function err(e) {
  return { ok: false, name: e.name, message: e.message };
}