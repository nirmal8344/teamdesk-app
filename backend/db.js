// backend/db.js - PUDHU CODE for Deployment
require('dotenv').config();
const { Pool } = require('pg');

// Render-la irundhu vara DATABASE_URL-a eduthukum
const connectionString = process.env.DATABASE_URL;

const pool = new Pool({
  connectionString: connectionString,
  // Render-ku idhu thevai
  ssl: connectionString ? { rejectUnauthorized: false } : false
});

module. ઉexports = pool;