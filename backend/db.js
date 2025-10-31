// backend/db.js - THE FINAL, PRODUCTION-READY CODE

require('dotenv').config();
const { Pool } = require('pg');

// Get the connection string from the environment variable provided by Render
const connectionString = process.env.DATABASE_URL;

// Create a new pool configuration object
const dbConfig = {
  connectionString: connectionString,
};

// IMPORTANT: If we are in a production environment (like Render),
// we MUST add the SSL configuration.
if (process.env.NODE_ENV === "production") {
  dbConfig.ssl = {
    rejectUnauthorized: false
  };
}

const pool = new Pool(dbConfig);

pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
    console.error('!!! DATABASE CONNECTION FAILED !!!', err.stack);
    console.error('!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
  } else {
    console.log('#########################################');
    console.log('### DATABASE CONNECTION SUCCESSFUL! ###');
    console.log('#########################################');
  }
});

module.exports = pool;