/* istanbul ignore file */
const config = require('../../../Commons/config');
const { Pool } = require('pg');

const testConfig = {
  host: process.env.PGHOST_TEST,
  port: process.env.PGPORT_TEST,
  user: process.env.PGUSER_TEST,
  password: process.env.PGPASSWORD_TEST,
  database: process.env.PGDATABASE_TEST,
};

const pool = process.env.NODE_ENV === 'test' ? new Pool(testConfig) : new Pool(config.database);

module.exports = pool;