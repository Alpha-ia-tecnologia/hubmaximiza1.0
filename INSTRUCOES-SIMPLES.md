# 🚀 Instruções Simples - Hub Maximiza

## ⚡ Inicialização Rápida

### 1. Abrir 2 Terminais

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```
Aguarde ver: "Servidor rodando na porta 5000"

**Terminal 2 - Frontend:**
```bash
npm start
```
Aguarde ver: "Compiled successfully!"

### 2. Acessar o Sistema
- URL: http://localhost:3000 (ou porta mostrada)
- Email: `admin@hubmaximiza.com`
- Senha: `admin123`

## ✅ Sistema Funcionando com Dados Reais

### 📊 Dados do Banco PostgreSQL:
- ✅ **4 Municípios**: São José de Ribamar, São Bento, Santa Rita, Bacabeira
- ✅ **3 Soluções**: SALF, SAG, Pensamento Computacional
- ✅ **1 Usuário Admin**: admin@hubmaximiza.com
- ✅ **Estatísticas em tempo real**

### 🔄 Funcionalidades Conectadas:
- ✅ **Login/Logout** com JWT
- ✅ **Dashboard** com dados reais
- ✅ **Gerenciar Municípios** - CRUD completo
- ✅ **Gerenciar Usuários** - CRUD completo
- ✅ **Gerenciar Soluções** - CRUD completo

## 🛠️ Se Houver Problemas

### Backend não inicia:
```bash
cd backend
node server.js
```

### Erro de conexão:
1. Verifique se ambos os servidores estão rodando
2. Backend: http://localhost:5000/api/health
3. Frontend: http://localhost:3000

### Dados não carregam:
- O sistema agora mostra mensagens claras de erro
- Verifique o console do navegador (F12)
- Use o botão "🔧 Debug API" na tela de login

## 🎯 Tudo Pronto!

O Hub Maximiza está **100% funcional** com dados reais do banco PostgreSQL!
