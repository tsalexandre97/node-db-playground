# Node DB Playground

[![CI](https://github.com/tsalexandre97/node-db-playground/actions/workflows/ci.yml/badge.svg)](https://github.com/tsalexandre97/node-db-playground/actions)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE)

Mini-projeto para estudar **conexões Node.js com diversos bancos de dados** usando **Docker Compose**. A ideia é ter um app Node central e “plugar” bancos diferentes para praticar do **básico ao avançado**, com foco maior em **MongoDB** e **Redis**.

## ✨ O que tem aqui

- Docker Compose com serviços para **PostgreSQL, MySQL, MongoDB, Redis** e **SQL Server** (opcional).
- App **Express** com endpoints de _ping_ por banco + **labs** práticos de Mongo & Redis.
- Arquivos prontos de `.env.example`, `docker-compose.yml`, `package.json` e **README**.
- Estrutura pensada para ir documentando no GitHub à medida que você aprende.

## 🧭 Estrutura

```
node-db-playground/
├─ docker-compose.yml
├─ .env.example
├─ package.json
├─ README.md
└─ src/
   ├─ index.js
   ├─ server.js
   └─ db/
      ├─ postgres.js
      ├─ mysql.js
      ├─ mongo.js
      ├─ redis.js
      ├─ mssql.js              # opcional
      ├─ mongo_lab.js          # CRUD, índices, TTL
      └─ redis_lab.js          # cache, rate limit, leaderboard
```

## 🚀 Como rodar (modo recomendado)

> **Modo 1 — Node local + bancos no Docker (portas expostas)**

1. Copie variáveis:

   ```bash
   cp .env.example .env
   ```

2. Ajuste o `.env` (exemplo):

   ```env
   PORT=3000
   MONGO_URL=mongodb://root:root@localhost:27018/?authSource=admin
   POSTGRES_URL=postgres://postgres:postgres@localhost:5433/playground
   MYSQL_URL=mysql://app:app@localhost:3307/playground
   REDIS_URL=redis://localhost:6380
   ```

3. Suba os bancos:

   ```bash
   docker compose --profile core up -d
   ```

4. Instale deps e rode o app:

   ```bash
   npm install
   npm run dev
   # abra http://localhost:3000/health
   ```

> **Modo 2 — Tudo no Docker (Node + bancos na mesma rede)**
>
> Use hostnames de serviço no `.env` (mongo, postgres, mysql, redis), remova os `ports` dos bancos e suba com:
>
> ```bash
> docker compose --profile core up -d
> docker compose --profile app up -d
> ```

## 🔌 Endpoints rápidos

- `GET /health` → `{ ok: true }`
- `GET /db/postgres/ping`
- `GET /db/mysql/ping`
- `GET /db/mongo/ping`
- `GET /db/redis/ping`
- `GET /db/mssql/ping` _(se perfil mssql ativo)_

### Mongo — Labs

- `POST /mongo/users` `{ name, email }` → cria usuário (índice único por `email`).
- `GET /mongo/users?q=texto` → lista/busca (regex em `name`/`email`).
- `PUT /mongo/users/:id` → atualiza via `$set`.
- `DELETE /mongo/users/:id` → remove.
- `GET /mongo/users/stats` → agregação por **domínio de e-mail**.
- `POST /mongo/sessions` `{ userId, ttlSec }` → cria sessão com **TTL** por índice `expireAt`.
- `GET /mongo/sessions` → lista sessões.

### Redis — Labs

- `POST /redis/cache/set` `{ key, value, ttlSec }` → **cache** simples (stringify JSON).
- `GET /redis/cache/get?key=` → busca cache.
- `GET /redis/rate-limit?userId=&limit=&window=` → **rate limit** por janela fixa.
- `POST /redis/leaderboard/score` `{ board, userId, delta }` → **leaderboard** com `ZINCRBY`.
- `GET /redis/leaderboard/top?board=&n=` → top N do placar.

## 🧪 Exemplos de uso (cURL)

```bash
# Mongo
curl -sX POST localhost:3000/mongo/users -H 'content-type: application/json' -d '{"name":"Ana","email":"ana@acme.com"}' | jq
curl -s 'localhost:3000/mongo/users?q=gmail' | jq
curl -s localhost:3000/mongo/users/stats | jq

# Redis: cache e rate limit
curl -sX POST localhost:3000/redis/cache/set -H 'content-type: application/json' -d '{"key":"user:42","value":{"name":"Zoe"},"ttlSec":30}' | jq
curl -s 'localhost:3000/redis/cache/get?key=user:42' | jq
for i in {1..7}; do curl -s 'localhost:3000/redis/rate-limit?userId=u1&limit=5&window=10' | jq '.allowed,.remaining'; done

# Redis: leaderboard
curl -sX POST localhost:3000/redis/leaderboard/score -H 'content-type: application/json' -d '{"board":"game","userId":"alice","delta":10}' | jq
curl -sX POST localhost:3000/redis/leaderboard/score -H 'content-type: application/json' -d '{"board":"game","userId":"bob","delta":20}' | jq
curl -s 'localhost:3000/redis/leaderboard/top?board=game&n=2' | jq
```

## 🧠 Conceitos e boas práticas

- **Mongo**: crie índices para campos filtrados/ordenados; use projeções; agregações com `$group`, `$sort`, `$limit`; **TTL** via índice de data (`expireAt`).
- **Redis**: prefira `lazyConnect` para evitar crashes quando o Redis não estiver no ar; `EX` para TTL; use **sorted sets** (`Z*`) para rankings e **INCR/EXPIRE** para rate limit simples.

## 🧰 Scripts úteis

```bash
# Subir bancos
docker compose --profile core up -d
# Subir app (modo Docker)
docker compose --profile app up -d
# Parar tudo
docker compose down
# Logs do app
docker compose logs -f app
```

## 🤖 CI (GitHub Actions)

Este repositório inclui um workflow simples em `.github/workflows/ci.yml` que:

- Instala dependências em **Node 20** e valida que o projeto compila/roda.
- Executa `npm test` (placeholder por enquanto).
- Valida o `docker-compose.yml` com `docker compose config`.

Badge: [![Static Badge](https://img.shields.io/badge/Node.js-ci?label=CI&link=https%3A%2F%2Fgithub.com%2Ftsalexandre97%2Fnode-db-playground%2Factions%2Fworkflows%2Fci.yml)
](https://github.com/tsalexandre97/node-db-playground/actions/workflows/ci.yml)

## 📜 Licença

Código sob **MIT License** — use, modifique e distribua livremente mantendo o aviso de copyright e a licença.

Badge: [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE)

---

### Roadmap (sugestão)

- Redis **Streams** (fila) com **Consumer Groups** + worker.
- MongoDB **Replica Set** para **Transações** e **Change Streams**.
- Cache de leitura com invalidação Redis quando `users` muda no Mongo.

> Feedbacks e PRs são bem-vindos! 😊
