# Hub Maximiza - Backend API

## Configuração

1. **Instalar dependências:**
```bash
npm install
```

2. **Configurar variáveis de ambiente:**
Crie um arquivo `.env` na raiz do backend com o seguinte conteúdo:
```
# Configurações do Servidor
PORT=5000
NODE_ENV=development

# Configurações do Banco de Dados
DATABASE_URL=postgres://postgres:T1fpOr8Kw7KQEpU781gm9NWy7#@144.126.137.156:5432/hub?sslmode=disable

# Configurações de Autenticação
JWT_SECRET=hub_maximiza_secret_key_2024
JWT_EXPIRE=7d

# Configurações de CORS
FRONTEND_URL=http://localhost:3000
```

3. **Inicializar banco de dados:**
```bash
npm run init-db
```
Isso criará todas as tabelas necessárias e um usuário admin padrão:
- Email: admin@hubmaximiza.com
- Senha: admin123

4. **Executar o servidor:**

Para desenvolvimento (com hot reload):
```bash
npm run dev
```

Para produção:
```bash
npm start
```

## Estrutura da API

### Rotas de Autenticação
- `POST /api/auth/login` - Login de usuário
- `POST /api/auth/register` - Registrar novo usuário (admin only)
- `GET /api/auth/me` - Obter dados do usuário autenticado
- `POST /api/auth/logout` - Fazer logout

### Rotas de Usuários
- `GET /api/users` - Listar usuários (admin)
- `GET /api/users/:id` - Buscar usuário por ID
- `PUT /api/users/:id` - Atualizar usuário (admin)
- `PUT /api/users/:id/solutions` - Atualizar soluções do usuário (admin)
- `DELETE /api/users/:id` - Deletar usuário (admin)

### Rotas de Municípios
- `GET /api/municipalities` - Listar municípios
- `GET /api/municipalities/:id` - Buscar município por ID
- `POST /api/municipalities` - Criar município (admin)
- `PUT /api/municipalities/:id` - Atualizar município (admin)
- `DELETE /api/municipalities/:id` - Deletar município (admin)

### Rotas de Soluções
- `GET /api/solutions` - Listar soluções
- `GET /api/solutions/:id` - Buscar solução por ID
- `POST /api/solutions` - Criar solução (admin)
- `PUT /api/solutions/:id` - Atualizar solução (admin)
- `DELETE /api/solutions/:id` - Deletar solução (admin)
- `POST /api/solutions/:id/access` - Registrar acesso a uma solução

### Rotas do Dashboard
- `GET /api/dashboard/stats` - Estatísticas gerais (admin)
- `GET /api/dashboard/charts` - Dados para gráficos (admin)
- `GET /api/dashboard/online-users` - Usuários online (admin)
- `GET /api/dashboard/recent-activities` - Atividades recentes (admin)
- `GET /api/dashboard/user-dashboard` - Dashboard do usuário comum

## Autenticação

A API usa JWT (JSON Web Tokens) para autenticação. Para acessar rotas protegidas, inclua o token no header:

```
Authorization: Bearer <seu_token_jwt>
```

## Banco de Dados

O sistema usa PostgreSQL com as seguintes tabelas principais:
- `users` - Usuários do sistema
- `municipalities` - Municípios cadastrados
- `solutions` - Soluções educacionais
- `user_solutions` - Relação entre usuários e soluções
- `access_logs` - Logs de acesso
- `active_sessions` - Sessões ativas

## Desenvolvimento

Para adicionar novas rotas ou funcionalidades:

1. Crie o arquivo de rota em `/routes`
2. Implemente a lógica no arquivo
3. Importe e use a rota em `server.js`
4. Teste usando Postman ou similar

## Segurança

- Senhas são hasheadas com bcrypt
- Tokens JWT expiram em 7 dias
- CORS configurado para aceitar apenas o frontend autorizado
- Validação de entrada com express-validator
