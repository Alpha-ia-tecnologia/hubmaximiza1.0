const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  host: '144.126.137.156',
  port: 5432,
  database: 'hub',
  user: 'postgres',
  password: 'T1fpOr8Kw7KQEpU781gm9NWy7#',
  ssl: false
});

// Teste de conexão
pool.on('connect', () => {
  console.log('Conectado ao banco de dados PostgreSQL');
});

pool.on('error', (err) => {
  console.error('Erro inesperado no cliente do banco de dados', err);
  process.exit(-1);
});

module.exports = pool;
