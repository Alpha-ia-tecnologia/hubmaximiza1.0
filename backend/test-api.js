const axios = require('axios');

const API_BASE_URL = 'http://localhost:5000/api';

async function testAPI() {
  try {
    console.log('🚀 Testando API do Hub Maximiza...\n');

    // Teste de saúde
    console.log('1. Testando endpoint de saúde...');
    const healthResponse = await axios.get(`${API_BASE_URL}/health`);
    console.log('✅ Health check:', healthResponse.data);

    // Teste de login
    console.log('\n2. Testando login...');
    const loginResponse = await axios.post(`${API_BASE_URL}/auth/login`, {
      email: 'admin@hubmaximiza.com',
      password: 'admin123'
    });
    console.log('✅ Login bem-sucedido!');
    
    const token = loginResponse.data.token;
    const user = loginResponse.data.user;
    console.log('👤 Usuário:', user.name, '- Role:', user.role);

    // Configurar token para próximas requisições
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

    // Teste de estatísticas
    console.log('\n3. Testando estatísticas do dashboard...');
    const statsResponse = await axios.get(`${API_BASE_URL}/dashboard/stats`);
    console.log('📊 Estatísticas:', statsResponse.data);

    // Teste de municípios
    console.log('\n4. Testando listagem de municípios...');
    const municipalitiesResponse = await axios.get(`${API_BASE_URL}/municipalities`);
    console.log('🏙️ Municípios encontrados:', municipalitiesResponse.data.length);

    // Teste de soluções
    console.log('\n5. Testando listagem de soluções...');
    const solutionsResponse = await axios.get(`${API_BASE_URL}/solutions`);
    console.log('🔧 Soluções encontradas:', solutionsResponse.data.length);

    // Teste de usuários
    console.log('\n6. Testando listagem de usuários...');
    const usersResponse = await axios.get(`${API_BASE_URL}/users`);
    console.log('👥 Usuários encontrados:', usersResponse.data.length);

    console.log('\n🎉 Todos os testes passaram! A API está funcionando corretamente.');

  } catch (error) {
    console.error('❌ Erro no teste:', error.response?.data || error.message);
  }
}

testAPI();
