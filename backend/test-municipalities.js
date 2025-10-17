const axios = require('axios');

async function testMunicipalities() {
  try {
    console.log('🧪 Testando carregamento de municípios...\n');

    // 1. Fazer login para obter token
    console.log('1. Fazendo login...');
    const loginResponse = await axios.post('http://localhost:5000/api/auth/login', {
      email: 'admin@hubmaximiza.com',
      password: 'admin123'
    });
    
    const token = loginResponse.data.token;
    console.log('✅ Login bem-sucedido');

    // 2. Configurar token
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

    // 3. Buscar municípios
    console.log('\n2. Buscando municípios...');
    const municipalitiesResponse = await axios.get('http://localhost:5000/api/municipalities');
    
    console.log('✅ Municípios carregados:');
    console.table(municipalitiesResponse.data);

    console.log('\n🎉 Teste de municípios concluído com sucesso!');

  } catch (error) {
    console.error('❌ Erro no teste:', error.response?.data || error.message);
  }
}

testMunicipalities();
