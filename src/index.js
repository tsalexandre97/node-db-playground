// src/index.js
import dotenv from 'dotenv';
import expand from 'dotenv-expand';
import { createServer } from './server.js';

expand.expand(dotenv.config());

const app = await createServer();
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`➡️  http://localhost:${port}`));