# Hub Maximiza - Sistema de Soluções Educacionais

## 📚 Sobre o Projeto

O Hub Maximiza é uma plataforma completa de gestão de soluções educacionais, desenvolvida para a Maximiza Soluções Educacionais. O sistema permite o gerenciamento centralizado de municípios, usuários e acesso às diversas ferramentas educacionais oferecidas pela empresa.

## 🚀 Principais Funcionalidades

### Landing Page
- Apresentação institucional da empresa
- Informações sobre as soluções oferecidas (SALF, SAG, Pensamento Computacional)
- Lista de municípios atendidos
- Seção de contato

### Sistema de Autenticação
- Login seguro com email e senha
- Recuperação de senha
- Diferentes níveis de acesso (Admin/Usuário)

### Painel Administrativo
- **Gestão de Municípios**: CRUD completo de municípios atendidos
- **Gestão de Soluções**: Cadastro e gerenciamento de soluções educacionais
- **Gestão de Usuários**: 
  - Cadastro de novos usuários
  - Atribuição de municípios
  - Controle de acesso às soluções
  - Ativação/desativação de contas

### Painel do Usuário
- Dashboard personalizado com cards das soluções disponíveis
- Acesso direto às ferramentas educacionais liberadas
- Área de perfil para alteração de senha

## 🎨 Identidade Visual

O sistema segue a identidade visual da Maximiza:
- **Cor Primária (Azul Escuro)**: #0c2c68
- **Cor Secundária (Azul Ciano)**: #00a9e8
- **Cor de Fundo**: #FFFFFF
- **Cor de Texto**: #333333
- **Cor de Suporte**: #F4F6F8

## 💻 Tecnologias Utilizadas

- **React** 18.2.0
- **React Router DOM** 6.20.0
- **Styled Components** 6.1.1
- **React Icons** 4.12.0
- **React Hook Form** 7.48.2
- **React Toastify** 9.1.3
- **Axios** 1.6.2

## 🔧 Instalação e Configuração

### Pré-requisitos
- Node.js (versão 14 ou superior)
- NPM ou Yarn

### Passo a passo

1. Clone o repositório:
```bash
git clone https://github.com/seu-usuario/hub-maximiza.git
cd hub-maximiza
```

2. Instale as dependências:
```bash
npm install
```

3. Inicie o servidor de desenvolvimento:
```bash
npm start
```

4. Acesse o sistema em: `http://localhost:3000`

## 🔑 Credenciais de Demonstração

Para testar o sistema, use as seguintes credenciais:

### Administrador
- **Email**: admin@maximiza.com.br
- **Senha**: admin123

### Usuário
- **Email**: usuario@maximiza.com.br
- **Senha**: user123

## 📁 Estrutura do Projeto

```
src/
├── components/
│   └── PrivateRoute.js        # Componente de proteção de rotas
├── contexts/
│   └── AuthContext.js          # Contexto de autenticação
├── pages/
│   ├── admin/
│   │   ├── MunicipalityManagement.js
│   │   ├── SolutionManagement.js
│   │   └── UserManagement.js
│   ├── AdminDashboard.js      # Dashboard administrativo
│   ├── ForgotPassword.js       # Recuperação de senha
│   ├── LandingPage.js          # Página inicial pública
│   ├── Login.js                # Página de login
│   ├── UserDashboard.js        # Dashboard do usuário
│   └── UserProfile.js          # Perfil do usuário
├── App.js                      # Componente principal
├── index.js                    # Ponto de entrada
└── index.css                   # Estilos globais
```

## 🌟 Principais Soluções

### SALF - Sistema de Avaliação de Fluência
Plataforma completa para avaliação e acompanhamento da fluência em leitura dos alunos.

### SAG - Sistema de Avaliação e Gerenciamento
Sistema integrado para gestão completa do desempenho escolar.

### Material de Pensamento Computacional
Conteúdo estruturado da educação infantil ao 9º ano para desenvolvimento de habilidades computacionais.

## 🏙️ Municípios Atendidos

- São José de Ribamar - MA
- São Bento - MA
- Santa Rita - MA
- Bacabeira - MA

## 📱 Responsividade

O sistema é totalmente responsivo e otimizado para:
- Desktop (1920x1080 e superiores)
- Tablets (768px - 1024px)
- Smartphones (320px - 767px)

## 🔒 Segurança

- Autenticação baseada em tokens
- Rotas protegidas por níveis de acesso
- Validação de formulários
- Sanitização de inputs

## 🚀 Deploy

Para fazer o build de produção:

```bash
npm run build
```

Os arquivos otimizados serão gerados na pasta `build/`.

## 📞 Suporte

Para suporte ou dúvidas sobre o sistema:
- Email: contato@maximiza.com.br
- Telefone: (98) 3333-3333

## 📄 Licença

Este projeto é propriedade da Maximiza Soluções Educacionais. Todos os direitos reservados.

---

Desenvolvido com ❤️ para transformar a educação através da tecnologia.
