# 🚀 Guia de Teste - Hub Maximiza

## ✅ Status do Sistema

### Backend API
- ✅ Servidor rodando na porta 5000
- ✅ Banco de dados PostgreSQL conectado
- ✅ Todas as rotas funcionando
- ✅ Autenticação JWT implementada
- ✅ CORS configurado para http://localhost:3000

### Frontend React
- ✅ Servidor rodando na porta 3000
- ✅ Integração com API configurada
- ✅ AuthContext atualizado

## 🔑 Credenciais de Teste

**Administrador:**
- Email: `admin@hubmaximiza.com`
- Senha: `admin123`

## 📋 Como Testar

### 1. Verificar se os servidores estão rodando

**Backend (porta 5000):**
```bash
cd backend
npm run dev
```

**Frontend (porta 3000):**
```bash
npm start
```

### 2. Testar a API diretamente

Execute no diretório `backend`:
```bash
node test-all-routes.js
```

### 3. Testar o Frontend

1. Abra http://localhost:3000
2. Clique em "Entrar"
3. Use as credenciais do administrador
4. Você deve ser redirecionado para `/admin/dashboard`

## 🐛 Possíveis Problemas e Soluções

### Erro "Rota não encontrada"

**Causa:** O frontend está tentando acessar uma rota da API que não existe.

**Soluções:**
1. Verifique se o backend está rodando na porta 5000
2. Verifique se a URL da API no frontend está correta (`http://localhost:5000/api`)
3. Abra o DevTools do navegador (F12) e verifique a aba Network para ver quais requisições estão falhando

### Erro de CORS

**Causa:** O backend não está permitindo requisições do frontend.

**Solução:** O CORS já está configurado para `http://localhost:3000`. Certifique-se de que o frontend está rodando nesta porta.

### Erro de Autenticação

**Causa:** Token JWT inválido ou expirado.

**Solução:** Limpe o localStorage e faça login novamente:
```javascript
localStorage.clear()
```

## 🔍 Debug Passo a Passo

### 1. Verificar Backend
```bash
curl http://localhost:5000/api/health
```
Deve retornar: `{"status":"OK","message":"Hub Maximiza API está funcionando!"}`

### 2. Testar Login
```powershell
Invoke-RestMethod -Uri "http://localhost:5000/api/auth/login" -Method POST -ContentType "application/json" -Body '{"email":"admin@hubmaximiza.com","password":"admin123"}'
```

### 3. Verificar Logs
- Backend: Verifique o terminal onde o backend está rodando
- Frontend: Abra o DevTools (F12) e verifique o Console

## 📊 Rotas da API Disponíveis

### Autenticação
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Dados do usuário atual
- `POST /api/auth/logout` - Logout

### Dashboard
- `GET /api/dashboard/stats` - Estatísticas gerais
- `GET /api/dashboard/charts` - Dados para gráficos
- `GET /api/dashboard/online-users` - Usuários online
- `GET /api/dashboard/recent-activities` - Atividades recentes

### Administração
- `GET /api/users` - Listar usuários
- `GET /api/municipalities` - Listar municípios
- `GET /api/solutions` - Listar soluções

## 🎯 Próximos Passos

1. **Teste o login no frontend**
2. **Verifique se o dashboard carrega**
3. **Teste as funcionalidades administrativas**
4. **Crie novos usuários e municípios**

Se ainda houver problemas, verifique:
- Console do navegador (F12 → Console)
- Aba Network do DevTools (F12 → Network)
- Logs do terminal do backend
