const axios = require('axios');

const API_BASE_URL = 'http://localhost:5000/api';

async function testAllRoutes() {
  try {
    console.log('🧪 Testando todas as rotas da API...\n');

    // 1. Health check
    console.log('1. GET /api/health');
    try {
      const health = await axios.get(`${API_BASE_URL}/health`);
      console.log('✅', health.data);
    } catch (error) {
      console.log('❌', error.response?.data || error.message);
    }

    // 2. Login
    console.log('\n2. POST /api/auth/login');
    let token = null;
    try {
      const login = await axios.post(`${API_BASE_URL}/auth/login`, {
        email: 'admin@hubmaximiza.com',
        password: 'admin123'
      });
      token = login.data.token;
      console.log('✅ Login bem-sucedido');
    } catch (error) {
      console.log('❌', error.response?.data || error.message);
      return;
    }

    // Configurar token para próximas requisições
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

    // 3. Verificar usuário atual
    console.log('\n3. GET /api/auth/me');
    try {
      const me = await axios.get(`${API_BASE_URL}/auth/me`);
      console.log('✅', me.data.user.name);
    } catch (error) {
      console.log('❌', error.response?.data || error.message);
    }

    // 4. Dashboard stats
    console.log('\n4. GET /api/dashboard/stats');
    try {
      const stats = await axios.get(`${API_BASE_URL}/dashboard/stats`);
      console.log('✅', stats.data);
    } catch (error) {
      console.log('❌', error.response?.data || error.message);
    }

    // 5. Dashboard charts
    console.log('\n5. GET /api/dashboard/charts');
    try {
      const charts = await axios.get(`${API_BASE_URL}/dashboard/charts`);
      console.log('✅ Charts data received');
    } catch (error) {
      console.log('❌', error.response?.data || error.message);
    }

    // 6. Municipalities
    console.log('\n6. GET /api/municipalities');
    try {
      const municipalities = await axios.get(`${API_BASE_URL}/municipalities`);
      console.log('✅', municipalities.data.length, 'municípios');
    } catch (error) {
      console.log('❌', error.response?.data || error.message);
    }

    // 7. Solutions
    console.log('\n7. GET /api/solutions');
    try {
      const solutions = await axios.get(`${API_BASE_URL}/solutions`);
      console.log('✅', solutions.data.length, 'soluções');
    } catch (error) {
      console.log('❌', error.response?.data || error.message);
    }

    // 8. Users
    console.log('\n8. GET /api/users');
    try {
      const users = await axios.get(`${API_BASE_URL}/users`);
      console.log('✅', users.data.length, 'usuários');
    } catch (error) {
      console.log('❌', error.response?.data || error.message);
    }

    // 9. Teste de rota inexistente
    console.log('\n9. GET /api/nonexistent (deve falhar)');
    try {
      const nonexistent = await axios.get(`${API_BASE_URL}/nonexistent`);
      console.log('❌ Esta rota não deveria existir!');
    } catch (error) {
      console.log('✅ Erro esperado:', error.response?.data?.message || error.message);
    }

    console.log('\n🎉 Teste completo!');

  } catch (error) {
    console.error('❌ Erro geral:', error.message);
  }
}

testAllRoutes();
