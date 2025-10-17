const fs = require('fs');
const path = require('path');
const pool = require('./database');

async function initDatabase() {
  try {
    console.log('Iniciando criação das tabelas...');
    
    // Ler o arquivo SQL
    const sqlFile = path.join(__dirname, 'create_tables.sql');
    const sql = fs.readFileSync(sqlFile, 'utf8');
    
    // Executar o SQL
    await pool.query(sql);
    
    console.log('Tabelas criadas com sucesso!');
    
    // Criar um usuário admin padrão
    const bcrypt = require('bcryptjs');
    const hashedPassword = await bcrypt.hash('admin123', 10);
    
    // Buscar o ID do primeiro município
    const municipalityResult = await pool.query('SELECT id FROM municipalities LIMIT 1');
    const municipalityId = municipalityResult.rows[0]?.id || null;
    
    // Inserir usuário admin
    await pool.query(
      `INSERT INTO users (name, email, password, role, municipality_id) 
       VALUES ($1, $2, $3, $4, $5) 
       ON CONFLICT (email) DO NOTHING`,
      ['Administrador', 'admin@hubmaximiza.com', hashedPassword, 'admin', municipalityId]
    );
    
    console.log('Usuário admin criado com sucesso!');
    console.log('Email: admin@hubmaximiza.com');
    console.log('Senha: admin123');
    
    process.exit(0);
  } catch (error) {
    console.error('Erro ao inicializar banco de dados:', error);
    process.exit(1);
  }
}

initDatabase();
