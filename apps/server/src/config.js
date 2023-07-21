const { Pool } = require('pg');
const Redis = require('ioredis');


require('dotenv').config();


const redis = new Redis({
  port: process.env.REDIS_PORT,
  host: process.env.REDIS_HOST,
  username: process.env.REDIS_USERNAME,
  password: process.env.REDIS_PASSWORD,
  db: 0,
});


const pool = new Pool({
  connectionString: process.env.SUPABASE_URL,
});

module.exports = { pool, redis};
