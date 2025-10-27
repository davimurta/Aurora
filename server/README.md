# 🚀 Aurora Backend Server

Backend Node.js + Express para o aplicativo **Aurora** - Plataforma de Saúde Mental que conecta pacientes e psicólogos.

---

## 👥 Integrantes

- **Nome**: [Adicionar nome]
- **Matrícula**: [Adicionar matrícula]
- **Nome**: [Adicionar nome]
- **Matrícula**: [Adicionar matrícula]
- **Nome**: [Adicionar nome]
- **Matrícula**: [Adicionar matrícula]

---

## 📋 Funcionalidades

### Autenticação e Usuários
- ✅ Cadastro de pacientes e psicólogos
- ✅ Login com email/senha
- ✅ Logout
- ✅ Reset de senha
- ✅ Diferenciação de perfis (paciente/psicólogo)
- ✅ Aprovação de psicólogos

### Posts/Artigos
- ✅ Criação de posts (psicólogos)
- ✅ Listagem de posts publicados
- ✅ Busca por categoria e tags
- ✅ Sistema de likes e visualizações
- ✅ Publicação/despublicação de posts

### Sistema de Eventos
- ✅ Logging automático de eventos
- ✅ Notificações em tempo real
- ✅ Métricas e analytics

---

## 🏗️ Arquitetura

### MVC (Model-View-Controller)

```
server/
├── src/
│   ├── config/
│   │   └── firebase.js          # Singleton: Conexão Firebase
│   ├── models/
│   │   ├── User.js              # Model de Usuário
│   │   └── Post.js              # Model de Post
│   ├── repositories/
│   │   ├── UserRepository.js    # Repository: Acesso a dados de usuários
│   │   └── PostRepository.js    # Repository: Acesso a dados de posts
│   ├── services/
│   │   └── AuthService.js       # Service: Lógica de negócios de autenticação
│   ├── controllers/
│   │   ├── userController.js    # Controller: Requisições de usuários
│   │   └── postController.js    # Controller: Requisições de posts
│   ├── routes/
│   │   ├── userRoutes.js        # Rotas de usuários
│   │   └── postRoutes.js        # Rotas de posts
│   └── patterns/
│       ├── UserFactory.js       # Factory: Criação de usuários
│       ├── AuthStrategy.js      # Strategy: Estratégias de autenticação
│       └── EventObserver.js     # Observer: Sistema de eventos
├── app.js                       # Aplicação principal Express
├── package.json                 # Dependências
└── README.md                    # Este arquivo
```

---

## 🎨 Padrões de Projeto (GoF)

### 1️⃣ **Singleton Pattern**
- **Arquivo**: `src/config/firebase.js`
- **Propósito**: Garante uma única instância da conexão Firebase
- **Benefícios**: Economia de recursos, consistência nas operações

```javascript
const firebase = FirebaseConnection.getInstance();
```

### 2️⃣ **Repository Pattern**
- **Arquivos**: `src/repositories/UserRepository.js`, `PostRepository.js`
- **Propósito**: Abstrai o acesso a dados do Firestore
- **Benefícios**: Separação de responsabilidades, facilita testes, mudança de banco transparente

```javascript
const userRepo = new UserRepository();
const user = await userRepo.findById(userId);
```

### 3️⃣ **Factory Method Pattern**
- **Arquivo**: `src/patterns/UserFactory.js`
- **Propósito**: Cria diferentes tipos de usuários (Paciente, Psicólogo)
- **Benefícios**: Encapsula lógica de criação, facilita extensão

```javascript
const user = UserFactory.createUser({ userType: 'paciente', ...data });
```

### 4️⃣ **Strategy Pattern**
- **Arquivo**: `src/patterns/AuthStrategy.js`
- **Propósito**: Define múltiplas estratégias de autenticação
- **Estratégias**: Email/Password, Anonymous, Token
- **Benefícios**: Flexibilidade para trocar algoritmos em runtime

```javascript
const authContext = new AuthContext();
authContext.setStrategy('email-password');
const result = await authContext.authenticate(credentials);
```

### 5️⃣ **Observer Pattern**
- **Arquivo**: `src/patterns/EventObserver.js`
- **Propósito**: Notifica múltiplos observers sobre eventos do sistema
- **Observers**: LoggerObserver, NotificationObserver, AnalyticsObserver
- **Benefícios**: Desacoplamento, sistema de eventos extensível

```javascript
const eventSystem = EventSystem.getInstance();
await eventSystem.emit('user.created', userData);
```

---

## 🛠️ Instalação e Execução

### Pré-requisitos
- Node.js >= 18.0.0
- npm >= 9.0.0
- Conta Firebase com projeto configurado

### 1. Instalar dependências

```bash
cd server
npm install
```

### 2. Configurar Firebase

**Opção A: Application Default Credentials (Recomendado)**

1. Baixe o arquivo de credenciais do Firebase Console:
   - Acesse Firebase Console > Project Settings > Service Accounts
   - Clique em "Generate New Private Key"
   - Salve como `serviceAccountKey.json` na pasta `server/`

2. Configure a variável de ambiente:
```bash
export GOOGLE_APPLICATION_CREDENTIALS="./serviceAccountKey.json"
```

**Opção B: Variáveis de Ambiente**

Crie um arquivo `.env` na pasta `server/`:

```env
PORT=3000
NODE_ENV=development
FIREBASE_PROJECT_ID=seu-project-id
```

### 3. Iniciar o servidor

**Modo Desenvolvimento (com auto-reload):**
```bash
npm run dev
```

**Modo Produção:**
```bash
npm start
```

O servidor estará rodando em: `http://localhost:3000`

---

## 📡 Rotas da API

### Base URL: `http://localhost:3000/api`

### 🔐 Autenticação

| Método | Rota | Descrição |
|--------|------|-----------|
| POST | `/register` | Cadastra novo usuário |
| POST | `/login` | Autentica usuário |
| POST | `/logout` | Desloga usuário |
| POST | `/reset-password` | Envia email de reset |

### 👤 Usuários

| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/users/:id` | Busca usuário por ID |
| GET | `/psychologists` | Lista psicólogos aprovados |
| POST | `/psychologists/:id/approve` | Aprova psicólogo |

### 📝 Posts

| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/posts` | Lista posts publicados |
| GET | `/posts/:id` | Busca post por ID |
| POST | `/posts` | Cria novo post |
| PUT | `/posts/:id` | Atualiza post |
| DELETE | `/posts/:id` | Remove post |
| POST | `/posts/:id/publish` | Publica post |
| POST | `/posts/:id/like` | Registra like no post |
| GET | `/posts/author/:authorId` | Lista posts de um autor |

---

## 📤 Exemplos de Requisições

### Cadastrar Paciente

```bash
curl -X POST http://localhost:3000/api/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "paciente@example.com",
    "password": "senha123",
    "displayName": "João Silva",
    "userType": "paciente",
    "idade": 25,
    "genero": "Masculino",
    "telefone": "11999999999"
  }'
```

### Login

```bash
curl -X POST http://localhost:3000/api/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "paciente@example.com",
    "password": "senha123"
  }'
```

### Criar Post

```bash
curl -X POST http://localhost:3000/api/posts \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Como lidar com a ansiedade",
    "content": "Conteúdo completo do artigo...",
    "authorId": "user123",
    "authorName": "Dr. Maria Santos",
    "category": "ansiedade",
    "tags": ["ansiedade", "terapia", "saúde mental"]
  }'
```

### Listar Posts

```bash
curl http://localhost:3000/api/posts
```

---

## 🧪 Testes

Para testar o servidor:

1. Inicie o servidor: `npm run dev`
2. Acesse `http://localhost:3000` para ver o health check
3. Use ferramentas como Postman, Insomnia ou cURL para testar as rotas

---

## 🔧 Tecnologias Utilizadas

- **Node.js** - Runtime JavaScript
- **Express** - Framework web minimalista
- **Firebase Admin SDK** - Backend-as-a-Service
  - Authentication
  - Firestore (NoSQL)
  - Storage
- **CORS** - Habilitação de requisições cross-origin
- **Morgan** - Logger HTTP
- **Nodemon** - Auto-reload em desenvolvimento

---

## 📚 Estrutura de Dados

### Usuário (User)
```javascript
{
  uid: string,
  email: string,
  displayName: string,
  userType: 'paciente' | 'psicologo',
  isActive: boolean,
  createdAt: Date,
  updatedAt: Date,

  // Se paciente:
  idade: number,
  genero: string,
  telefone: string,

  // Se psicólogo:
  crp: string,
  especialidade: string,
  bio: string,
  isApproved: boolean
}
```

### Post
```javascript
{
  id: string,
  title: string,
  content: string,
  excerpt: string,
  authorId: string,
  authorName: string,
  category: string,
  tags: string[],
  imageUrl: string,
  published: boolean,
  views: number,
  likes: number,
  createdAt: Date,
  updatedAt: Date
}
```

---

## 🐛 Troubleshooting

### Erro: "Firebase não conectado"
- Verifique se o arquivo `serviceAccountKey.json` está na pasta correta
- Confirme que as credenciais do Firebase estão corretas

### Erro: "Port already in use"
- Altere a porta no arquivo `.env` ou mate o processo na porta 3000:
```bash
lsof -ti:3000 | xargs kill -9
```

### Erro: "Cannot find module"
- Reinstale as dependências:
```bash
rm -rf node_modules package-lock.json
npm install
```

---

## 📝 Licença

MIT

---

## 🤝 Contribuições

Contribuições são bem-vindas! Abra uma issue ou pull request.

---

## 📞 Contato

Para dúvidas ou sugestões, entre em contato com a equipe Aurora.

---

**Desenvolvido com ❤️ pela Equipe Aurora**
