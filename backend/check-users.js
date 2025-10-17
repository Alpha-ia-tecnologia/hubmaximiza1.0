const pool = require('./config/database');

async function checkUsers() {
  try {
    console.log('🔍 Verificando usuários no banco de dados...\n');
    
    const result = await pool.query('SELECT id, name, email, role FROM users ORDER BY id');
    
    console.log('👥 Usuários encontrados:');
    console.table(result.rows);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Erro ao verificar usuários:', error);
    process.exit(1);
  }
}

checkUsers();
