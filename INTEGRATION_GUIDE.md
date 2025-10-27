# 🔗 Guia de Integração Frontend-Backend

Este guia explica como o frontend React Native se comunica com o backend Node.js/Express.

---

## 📋 O que foi feito

O frontend foi **completamente atualizado** para consumir a API do backend em vez de usar Firebase diretamente.

### Arquivos Criados/Modificados:

| Arquivo | Status | Descrição |
|---------|--------|-----------|
| `src/services/api.ts` | ✅ Criado | Cliente HTTP base com axios |
| `src/services/authApi.ts` | ✅ Criado | Serviço de autenticação (login, registro) |
| `src/services/postsApi.ts` | ✅ Criado | Serviço de posts/artigos |
| `src/models/AuthModelApi.ts` | ✅ Criado | Model adaptado para backend |
| `src/controllers/authController.ts` | ✅ Modificado | Usa AuthModelApi em vez de Firebase |
| `package.json` | ✅ Modificado | Adicionada dependência axios |
| `.env.example` | ✅ Criado | Template de variáveis de ambiente |

---

## 🚀 Como Rodar a Aplicação Completa

### 1. Configure o Backend

```bash
# Entre na pasta do servidor
cd server

# Instale as dependências
npm install

# Configure o Firebase (veja FIREBASE_SETUP.md)
# Baixe o serviceAccountKey.json e coloque em /server

# Configure o .env
cp .env.example .env
# Edite o .env e adicione:
# GOOGLE_APPLICATION_CREDENTIALS=./serviceAccountKey.json

# Inicie o servidor
npm run dev
```

O backend estará rodando em: **http://localhost:3000**

---

### 2. Configure o Frontend

```bash
# Volte para a raiz do projeto
cd ..

# Instale as dependências (incluindo axios)
npm install

# Configure a URL da API
cp .env.example .env
```

Edite o arquivo `.env`:

**Para emulador/simulador:**
```env
EXPO_PUBLIC_API_URL=http://localhost:3000/api
```

**Para dispositivo físico:**
```env
# Descubra seu IP local:
# - Windows: ipconfig
# - Mac/Linux: ifconfig
# Exemplo se seu IP for 192.168.1.100:
EXPO_PUBLIC_API_URL=http://192.168.1.100:3000/api
```

---

### 3. Inicie o Frontend

```bash
# Inicie o Expo
npm start

# Escolha a plataforma:
# - Pressione 'a' para Android
# - Pressione 'i' para iOS
# - Pressione 'w' para Web
```

---

## 🔄 Fluxo de Autenticação

### Antes (Firebase Direto):
```
Frontend → Firebase Auth → Firebase Firestore
```

### Agora (Via Backend):
```
Frontend → Backend API → Firebase Admin SDK → Firestore
```

### Exemplo de Login:

**1. Usuário preenche formulário**
```typescript
// Tela de Login
const { email, password } = form;
await authController.login(email, password);
```

**2. AuthController chama AuthModelApi**
```typescript
// authController.ts
const user = await AuthModel.login(email, password);
```

**3. AuthModelApi faz chamada HTTP**
```typescript
// AuthModelApi.ts
const response = await authApi.login(email, password);
```

**4. authApi usa axios**
```typescript
// authApi.ts
const response = await api.post('/login', { email, password });
```

**5. Backend processa**
```javascript
// backend/src/controllers/userController.js
const result = await authService.login(credentials, strategy);
```

**6. Resposta retorna**
```json
{
  "success": true,
  "user": {
    "uid": "abc123",
    "email": "user@example.com",
    "displayName": "João Silva",
    "userType": "paciente"
  },
  "message": "Login realizado com sucesso"
}
```

---

## 📡 Rotas Disponíveis

### Autenticação
- `POST /api/register` - Cadastro de usuários
- `POST /api/login` - Login
- `POST /api/logout` - Logout
- `POST /api/reset-password` - Reset de senha
- `GET /api/users/:id` - Buscar usuário

### Posts
- `GET /api/posts` - Listar posts publicados
- `GET /api/posts/:id` - Buscar post por ID
- `POST /api/posts` - Criar post
- `PUT /api/posts/:id` - Atualizar post
- `DELETE /api/posts/:id` - Deletar post
- `POST /api/posts/:id/publish` - Publicar post
- `POST /api/posts/:id/like` - Curtir post
- `GET /api/posts/author/:authorId` - Posts de um autor

---

## 🧪 Testando a Integração

### 1. Teste o Backend (isolado)

```bash
# Com o backend rodando, teste as rotas:

# Health check
curl http://localhost:3000

# Registrar usuário
curl -X POST http://localhost:3000/api/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "teste@example.com",
    "password": "senha123",
    "displayName": "Usuário Teste",
    "userType": "paciente",
    "idade": 25,
    "telefone": "11999999999"
  }'

# Login
curl -X POST http://localhost:3000/api/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "teste@example.com",
    "password": "senha123"
  }'
```

### 2. Teste o Frontend (com backend rodando)

1. Inicie o backend: `cd server && npm run dev`
2. Em outro terminal, inicie o frontend: `npm start`
3. Abra o app no emulador/dispositivo
4. Tente fazer login/registro

**Dicas de Debug:**
- Abra o console do navegador (se estiver no web)
- Use React Native Debugger
- Verifique os logs do backend no terminal
- Use Postman/Insomnia para testar as rotas isoladamente

---

## 🔧 Configuração de Rede

### Problema Comum: "Network Error" no dispositivo físico

Se você está rodando em um dispositivo físico e recebe erro de rede:

**Solução:**

1. **Descubra seu IP local:**
   ```bash
   # Windows
   ipconfig
   # Procure por "IPv4 Address"

   # Mac/Linux
   ifconfig
   # Procure por "inet" na interface ativa
   ```

2. **Atualize o .env do frontend:**
   ```env
   EXPO_PUBLIC_API_URL=http://SEU_IP:3000/api
   ```

3. **Certifique-se que backend e dispositivo estão na mesma rede Wi-Fi**

4. **Reinicie o Expo:**
   ```bash
   npm start
   ```

---

## 🐛 Troubleshooting

### Erro: "Cannot connect to API"
- ✅ Backend está rodando? (`cd server && npm run dev`)
- ✅ URL correta no `.env`?
- ✅ Mesmo Wi-Fi (para dispositivo físico)?
- ✅ Firewall bloqueando porta 3000?

### Erro: "Firebase not initialized"
- ✅ `serviceAccountKey.json` está em `/server`?
- ✅ `.env` do servidor configurado?
- ✅ Variável `GOOGLE_APPLICATION_CREDENTIALS` definida?

### Erro: "axios is not defined"
- ✅ Rodou `npm install` após atualizar package.json?
- ✅ Reiniciou o servidor Expo?

### Login não funciona
- ✅ Backend retorna resposta correta? (teste com curl)
- ✅ Verifique console do navegador/dispositivo
- ✅ Verifique logs do backend
- ✅ Usuário existe no Firebase?

---

## 📊 Estrutura de Dados

### UserData (retornado pelo backend)
```typescript
{
  uid: string;
  email: string;
  displayName: string;
  userType: 'paciente' | 'psicologo';
  createdAt: Date;
  isActive: boolean;

  // Se paciente:
  idade?: number;
  genero?: string;
  telefone?: string;

  // Se psicólogo:
  crp?: string;
  especialidade?: string;
  bio?: string;
  isApproved?: boolean;
}
```

### Post (retornado pelo backend)
```typescript
{
  id: string;
  title: string;
  content: string;
  excerpt: string;
  authorId: string;
  authorName: string;
  category: string;
  tags: string[];
  imageUrl: string;
  published: boolean;
  views: number;
  likes: number;
  createdAt: Date;
  updatedAt: Date;
}
```

---

## 🔐 Segurança

### Headers Automáticos
O cliente axios já está configurado para:
- `Content-Type: application/json`
- Timeout de 10 segundos
- Tratamento de erros automático

### Armazenamento Local
Dados do usuário são salvos no AsyncStorage:
- `@aurora:userId` - ID do usuário
- `@aurora:userData` - Dados do usuário

### Logout
Ao fazer logout, todos os dados locais são removidos.

---

## 📚 Próximos Passos

1. **Implementar autenticação com token JWT** (opcional)
2. **Adicionar refresh token** (opcional)
3. **Implementar cache de dados** (react-query/swr)
4. **Adicionar testes E2E**
5. **Deploy do backend** (Heroku, Railway, Render, etc)

---

## 🆘 Precisa de Ajuda?

- Consulte o README.md do backend: `server/README.md`
- Consulte o guia do Firebase: `server/FIREBASE_SETUP.md`
- Verifique os logs do backend e frontend
- Use o Postman para testar as rotas isoladamente

---

**Desenvolvido com ❤️ pela Equipe Aurora**
