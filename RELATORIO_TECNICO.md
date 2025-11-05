# 📋 Relatório Técnico - Aurora

**Projeto:** Aurora - Plataforma de Saúde Mental
**Tipo:** Aplicação Mobile (React Native + Expo) + Backend (Express.js)
**Data:** Outubro 2024
**Equipe:** Turma 3A1

---

## 📑 Índice

1. [Arquitetura Geral](#arquitetura-geral)
2. [Frontend (Client)](#frontend-client)
3. [Backend (Server)](#backend-server)
4. [Funcionalidades e Componentes](#funcionalidades-e-componentes)
5. [Fluxo de Dados](#fluxo-de-dados)
6. [Estrutura de Pastas](#estrutura-de-pastas)

---

## 🏗️ Arquitetura Geral

### Stack Tecnológico

#### Frontend
- **React Native** 0.79.2 - Framework mobile
- **Expo Router** 5.0.6 - Navegação file-based
- **TypeScript** 5.8.3 - Tipagem estática
- **Firebase Client SDK** 11.10.0 - Autenticação
- **Axios** 1.6.0 - Cliente HTTP
- **React Native Vector Icons** 10.2.0 - Ícones

#### Backend
- **Node.js** v18+ - Runtime JavaScript
- **Express.js** 4.x - Framework web
- **Firebase Admin SDK** - Gerenciamento de usuários
- **Firestore** - Banco de dados NoSQL

### Padrões Arquiteturais

#### Frontend
- **Custom Hooks** - Reutilização de lógica
- **Controller Pattern** - Separação de lógica de negócio
- **Service Layer** - Comunicação com API
- **Component-Based** - Componentes reutilizáveis

#### Backend
- **MVC** - Model-View-Controller
- **Repository Pattern** - Acesso a dados abstraído
- **RESTful API** - Endpoints padronizados
- **Middleware** - Validação e autenticação

---

## 📱 Frontend (Client)

### Estrutura de Diretórios

```
client/
├── src/
│   ├── app/                    # Rotas do Expo Router
│   ├── components/             # Componentes reutilizáveis
│   ├── controllers/            # Lógica de negócio
│   ├── hooks/                  # Custom hooks
│   ├── models/                 # Modelos de dados
│   ├── services/               # APIs e serviços
│   ├── theme/                  # Configuração de tema
│   └── types/                  # Tipos TypeScript
├── assets/                     # Recursos estáticos
└── package.json                # Dependências
```

---

### 📂 src/app/ - Rotas e Telas

O Expo Router usa sistema de arquivos para definir rotas. Cada arquivo `.tsx` se torna uma rota automaticamente.

#### Convenções de Nomenclatura
- **Arquivos com `_` prefix** - Ignorados pelo router (ex: `_styles.ts`)
- **`index.tsx`** - Rota padrão do diretório
- **`_layout.tsx`** - Layout compartilhado

#### Estrutura de Rotas

```
app/
├── index.tsx                          # Entrada → SplashScreen
├── _layout.tsx                        # Layout raiz
├── +not-found.tsx                     # Página 404
│
├── auth/                              # Rotas de autenticação (públicas)
│   ├── LoginScreen/
│   ├── RegisterScreen/
│   ├── SplashScreen/
│   ├── UserTypeSelectionScreen/
│   ├── UserSignupScreen/
│   └── PsychologistSignupScreen/
│
└── app/                               # Rotas do app (protegidas)
    ├── _layout.tsx                    # Proteção de rotas
    ├── HomeScreen/
    ├── DailyRegisterScreen/
    ├── HistoryRegisterScreen/
    ├── ProfileScreen/
    ├── ClientsList/
    ├── AddArticleScreen/
    └── ...
```

---

### 🔐 Sistema de Autenticação e Navegação

#### **1. Fluxo de Entrada**

**Arquivo:** `src/app/index.tsx`
```typescript
// Ponto de entrada do app
export default function Index() {
  return <SplashScreen />;
}
```

**Arquivo:** `src/app/auth/SplashScreen/SplashScreen.tsx`
- **Responsabilidade:** Verificar autenticação inicial
- **Lógica:**
  1. Mostra logo e animação (2s mínimo)
  2. Verifica se há usuário logado (AsyncStorage + Firebase)
  3. Redireciona:
     - Autenticado → `/app/HomeScreen/HomeScreen`
     - Não autenticado → `/auth/LoginScreen/LoginScreen`

**Dependências:**
- `useAuthController` - Hook de autenticação
- AsyncStorage - Persistência de sessão
- Firebase Auth - Validação de token

---

#### **2. Proteção de Rotas**

**Arquivo:** `src/app/app/_layout.tsx`
- **Responsabilidade:** Proteger todas as rotas em `/app/app/*`
- **Lógica:**
  1. Verifica se usuário está autenticado
  2. Se NÃO autenticado → `<Redirect href="/" />` (volta para SplashScreen)
  3. Se autenticado → Renderiza as rotas filhas
- **Componentes:** Stack navigator do Expo Router

**Código Simplificado:**
```typescript
export default function AppLayout() {
  const { user, loading } = useAuthController();

  if (loading) return <LoadingScreen />;
  if (!user) return <Redirect href="/" />;

  return <Stack screenOptions={{ headerShown: false }} />;
}
```

---

#### **3. Telas de Autenticação**

##### **LoginScreen**
**Arquivo:** `src/app/auth/LoginScreen/LoginScreen.tsx`

**Responsabilidade:**
- Autenticar usuário com email/senha
- Integração Firebase + Backend

**Fluxo:**
1. Usuário insere email e senha
2. Chama `login()` do `useAuthController`
3. Firebase autentica
4. Backend sincroniza dados do usuário
5. Salva sessão no AsyncStorage
6. Redireciona para HomeScreen

**Componentes:**
- TextInput para email/senha
- TouchableOpacity como botão
- Banners de sucesso/erro
- Link para RegisterScreen

**Arquivos relacionados:**
- `LoginScreen.tsx` - Componente principal
- `_styles.ts` - Estilos

---

##### **RegisterScreen**
**Arquivo:** `src/app/auth/RegisterScreen/RegisterScreen.tsx`

**Responsabilidade:**
- Cadastro inicial (email, senha, nome)
- Redireciona para seleção de tipo de usuário

**Fluxo:**
1. Validações (email, senha mín 6 chars)
2. Firebase cria conta
3. Redireciona para `/auth/UserTypeSelectionScreen`

---

##### **UserTypeSelectionScreen**
**Arquivo:** `src/app/auth/UserTypeSelectionScreen/UserTypeSelectionScreen.tsx`

**Responsabilidade:**
- Usuário escolhe: Paciente ou Psicólogo

**Componentes:**
- 2 cards grandes (Paciente / Psicólogo)
- Botão "Voltar" para LoginScreen
- Descrição de cada tipo

**Navegação:**
- Paciente → `/auth/UserSignupScreen/UserSignupScreen`
- Psicólogo → `/auth/PsychologistSignupScreen/PsychologistSignupScreen`

---

##### **UserSignupScreen (Paciente)**
**Arquivo:** `src/app/auth/UserSignupScreen/UserSignupScreen.tsx`

**Campos:**
- Nome completo
- Email
- CPF
- Telefone
- Data de nascimento
- Senha
- Confirmar senha

**Validações:**
- CPF válido
- Telefone formato (XX) XXXXX-XXXX
- Data de nascimento (maior de idade)
- Senhas coincidem

**Fluxo:**
1. Preenche formulário
2. Salva no backend com `userType: 'patient'`
3. Redireciona para LoginScreen

---

##### **PsychologistSignupScreen**
**Arquivo:** `src/app/auth/PsychologistSignupScreen/PsychologistSignupScreen.tsx`

**Campos Adicionais:**
- CRP (Conselho Regional de Psicologia)
- Especialidade
- Anos de experiência
- Formação acadêmica
- Instituição
- Biografia

**Validações:**
- CRP formato XX/XXXXX
- Campos obrigatórios

**Fluxo:**
1. Preenche formulário extenso
2. Salva no backend com `userType: 'psychologist'`
3. Redireciona para LoginScreen

---

### 🏠 Telas Principais do App

#### **1. HomeScreen**
**Arquivo:** `src/app/app/HomeScreen/HomeScreen.tsx`

**Responsabilidade:**
- Dashboard principal para pacientes e psicólogos
- Acesso rápido a recursos

**Componentes:**
```
HomeScreen.tsx (principal)
├── _components/
│   ├── Banner.tsx              # Banner de boas-vindas
│   ├── SearchBar.tsx           # Busca de recursos
│   ├── Section.tsx             # Seção horizontal
│   ├── GridSection.tsx         # Seção em grid
│   ├── ResourceCard.tsx        # Card de recurso
│   ├── RespirationCard.tsx     # Card de respiração
│   └── BlogCard.tsx            # Card de artigo
├── _mockData.ts                # Dados mockados
└── _styles.ts                  # Estilos
```

**Seções:**
1. **Banner** - "Bem-vindo ao nosso espaço de bem-estar"
2. **SearchBar** - Buscar recursos (funcional)
3. **Atividades de Respiração** - Grid de exercícios
4. **Recursos Diários** - Quem Somos, Tutorial, Dicas
5. **Nosso Blog** - Artigos dos psicólogos

**Lógica de Busca:**
```typescript
const filteredData = useMemo(() => {
  if (!searchQuery) return mockData;

  return {
    respirationActivities: mockData.respirationActivities.filter(...),
    dailyResources: mockData.dailyResources.filter(...),
    blogPosts: mockData.blogPosts.filter(...)
  };
}, [searchQuery]);
```

**Navegação:**
- Card clicado → `router.push(rota)`

---

#### **2. DailyRegisterScreen (Registro Emocional)**
**Arquivo:** `src/app/app/DailyRegisterScreen/DailyRegister.tsx`

**Responsabilidade:**
- Paciente registra humor diário
- Principal funcionalidade de tracking emocional

**Funcionalidade:**

**Passo 1: Selecionar Humor**
- 6 opções de mood (muito triste → radiante)
- Representados por ícones e cores

**Passo 2: Intensidade (1-5)**
- 5 botões diretos (1, 2, 3, 4, 5)
- Botões +/- para incrementar/decrementar
- Display circular central mostrando valor
- Cores dinâmicas baseadas na intensidade

**Passo 3: Descrição**
- TextInput multiline (até 500 chars)
- Contador de caracteres

**Validações:**
- Mood obrigatório
- Texto obrigatório (mínimo 1 char)
- Máximo 500 caracteres

**Fluxo:**
1. Usuário preenche formulário
2. Clica "Salvar Registro"
3. Chama `saveRegister()` do hook
4. Dados enviados ao backend
5. **Modal de Sucesso** aparece
6. Formulário é limpo

**Modal de Sucesso:**
```typescript
<Modal visible={showSuccessModal}>
  <Icon name="check-circle" size={64} color="#4ECDC4" />
  <Text>Registro Salvo!</Text>
  <Text>Seu registro emocional foi salvo com sucesso!</Text>
  <Button onPress={() => setShowSuccessModal(false)}>OK</Button>
</Modal>
```

**Arquivos:**
- `DailyRegister.tsx` - Componente principal
- `_styles.ts` - Estilos (inclui estilos do modal)

**Hook Usado:**
- `useEmotionalRegister()` - Salva e busca registros

---

#### **3. HistoryRegisterScreen**
**Arquivo:** `src/app/app/HistoryRegisterScreen/HistoryRegisterScreen.tsx`

**Responsabilidade:**
- Visualizar histórico de registros emocionais
- Gráfico de evolução mensal

**Funcionalidade:**
- Calendário de navegação (mês/ano)
- Gráfico de linha mostrando intensidade ao longo do mês
- Lista de registros do mês
- Filtros e busca

**Componentes:**
- `react-native-chart-kit` - Gráficos
- Lista de cards com registros

**Hook Usado:**
- `useEmotionalRegister()` - Busca registros por mês

---

#### **4. ProfileScreen**
**Arquivo:** `src/app/app/ProfileScreen/ProfileScreen.tsx`

**Responsabilidade:**
- Exibir dados do usuário
- Configurações
- Logout

**Seções:**
1. **Cabeçalho** - Foto + Nome + Tipo
2. **Estatísticas** - Cards com métricas
3. **Configurações** - Lista de opções
4. **Botão Logout** - Vermelho no final

**Opções de Configurações:**
- Notificações
- Privacidade
- Idioma
- Ajuda
- Conectar Paciente/Psicólogo

**Logout:**
```typescript
const handleLogout = async () => {
  await logout(); // Limpa AsyncStorage + Firebase
  router.replace('/auth/LoginScreen/LoginScreen');
};
```

---

#### **5. ClientsList (Psicólogo)**
**Arquivo:** `src/app/app/ClientsList/ClientsList.tsx`

**Responsabilidade:**
- Psicólogo visualiza lista de pacientes conectados

**Funcionalidade:**
1. Busca pacientes conectados no backend
2. Exibe cards com nome e email
3. Ao clicar → Navega para ClientSimulator

**API:**
```typescript
const response = await connectionApi.getMyPatients(user.uid);
// Retorna lista de pacientes
```

**Navegação:**
```typescript
<TouchableOpacity onPress={() =>
  router.push({
    pathname: '/app/ClientSimulator/ClientSimulator',
    params: { clientId: patient.id }
  })
}>
```

---

#### **6. ClientSimulator**
**Arquivo:** `src/app/app/ClientSimulator/ClientSimulator.tsx`

**Responsabilidade:**
- Psicólogo visualiza registros emocionais do paciente

**Funcionalidade:**
- Recebe `clientId` por parâmetro
- Calendário de navegação (mês/ano)
- Gráfico de evolução emocional
- Lista de registros do mês

**Similar ao HistoryRegisterScreen mas:**
- Dados de outro usuário (paciente)
- Somente leitura

**API:**
```typescript
const registers = await connectionApi.getPatientRegisters(
  clientId,
  year,
  month
);
```

---

#### **7. AddArticleScreen (Psicólogo)**
**Arquivo:** `src/app/app/AddArticleScreen/AddArticleScreen.tsx`

**Responsabilidade:**
- Psicólogo cria e publica artigos no blog

**Campos:**
- Título (obrigatório, 3-200 chars)
- Autor (preenche automaticamente com displayName)
- Descrição breve
- Categoria (dropdown: Saúde Mental, Ansiedade, etc)
- Blocos de conteúdo (paragraphs/headings)

**Sistema de Blocos:**
```typescript
interface ContentBlock {
  id: string;
  type: 'paragraph' | 'heading';
  content: string;
  level?: 1 | 2 | 3; // Para headings
}
```

**Ações:**
- "Adicionar Parágrafo" - Adiciona bloco de texto
- "Adicionar Título" - Adiciona heading
- Reordenar blocos (drag-drop futuro)

**Validações:**
- Título obrigatório
- Conteúdo mínimo 10 caracteres
- Descrição obrigatória

**Fluxo:**
1. Preenche formulário
2. Clica "Publicar Matéria"
3. Backend cria post
4. Backend publica automaticamente
5. **Modal de Sucesso** aparece
6. Formulário é limpo

**Modal de Sucesso:**
- Ícone verde de check
- "Matéria Publicada!"
- "Ela já está disponível no blog"

**API:**
```typescript
const response = await postsApi.createPost({ title, content, ... });
await postsApi.publishPost(response.post.id);
```

---

#### **8. PatientConnectScreen**
**Arquivo:** `src/app/app/PatientConnectScreen/PatientConnectScreen.tsx`

**Responsabilidade:**
- Paciente se conecta a um psicólogo via código

**Funcionalidade:**
1. Input para inserir código de 6 dígitos
2. Validação do formato (XXXXXX)
3. Botão "Conectar"
4. Feedback de sucesso/erro

**Fluxo:**
```typescript
const handleConnect = async () => {
  // Validação
  if (codigo.length !== 6) {
    Alert.alert('Erro', 'Código deve ter 6 caracteres');
    return;
  }

  // Conecta ao psicólogo
  await connectionApi.connectToCode(codigo, user.uid);

  // Modal de sucesso
  Alert.alert('Sucesso', 'Conectado ao profissional!');
};
```

**Validações:**
- Código de 6 chars
- Código existe no banco
- Código não expirado (24h)

---

#### **9. ProfessionalConnectScreen**
**Arquivo:** `src/app/app/ProfessionalConnectScreen/ProfessionalConnectScreen.tsx`

**Responsabilidade:**
- Psicólogo gera código para pacientes se conectarem

**Funcionalidade:**
1. Botão "Gerar Código"
2. Código de 6 dígitos aparece
3. Botão "Copiar Código" (usando expo-clipboard)
4. Código expira em 24h

**Fluxo:**
```typescript
const handleGerarCodigo = async () => {
  const response = await connectionApi.generateCode(user.uid);
  setCodigo(response.code);
  // Ex: "A1B2C3"
};

const handleCopiarCodigo = async () => {
  await Clipboard.setStringAsync(codigo);
  setCopiado(true); // Feedback visual
  setTimeout(() => setCopiado(false), 2000);
};
```

**Visual:**
- Código grande e centralizado
- Feedback visual ao copiar ("✓ Copiado!")
- Instrução: "Compartilhe este código com seu paciente"

---

### 🧩 Componentes Reutilizáveis

#### **BottomNavigation**
**Arquivo:** `src/components/BottonNavigation.tsx`

**Responsabilidade:**
- Navegação principal do app (5 tabs)

**Tabs:**
1. **Home** - HomeScreen
2. **Analytics**
   - Paciente → DailyRegisterScreen
   - Psicólogo → ClientsList
3. **Add** (central, destacado)
   - Paciente → HistoryRegisterScreen
   - Psicólogo → AddArticleScreen
4. **Blog** - BlogNavigation
5. **Profile** - ProfileScreen

**Lógica Condicional:**
```typescript
const { userData } = useAuthController();
const isPsychologist = userData?.userType === 'psicologo';

const analyticsRoute = isPsychologist
  ? '/app/ClientsList/ClientsList'
  : '/app/DailyRegisterScreen/DailyRegister';
```

**Indicador de Rota Ativa:**
```typescript
const pathname = usePathname();
const isActive = pathname === route;
```

---

### 🎣 Custom Hooks

#### **useAuthController**
**Arquivo:** `src/hooks/useAuthController.ts`

**Responsabilidade:**
- Gerenciar estado de autenticação global
- Interface entre componentes e AuthController

**Estados:**
```typescript
{
  user: User | null;           // Dados do usuário
  userData: UserData | null;   // Dados estendidos (backend)
  loading: boolean;            // Carregando
  error: string | null;        // Erro
}
```

**Funções:**
```typescript
{
  login(email, password)       // Login
  register(email, pass, name)  // Registro
  logout()                     // Logout
  resetPassword(email)         // Recuperar senha
  getUserData()                // Buscar dados do backend
}
```

**Implementação:**
```typescript
export const useAuthController = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Observer do Firebase Auth
    const unsubscribe = authController.onAuthStateChanged(
      (firebaseUser) => {
        setUser(firebaseUser);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  return { user, loading, login, logout, ... };
};
```

---

#### **useEmotionalRegister**
**Arquivo:** `src/hooks/useEmotionalRegister.ts`

**Responsabilidade:**
- Gerenciar registros emocionais
- Interface para emotionalRegisterController

**Funções:**
```typescript
{
  saveRegister(data)                  // Salvar novo registro
  getRegistersByMonth(year, month)    // Buscar por mês
  hasRegisterForDate(date)            // Verificar se existe registro
  getChartDataByMonth(year, month)    // Dados para gráfico
  getMoodLabel(moodId)                // Label do humor
}
```

**Uso:**
```typescript
const { saveRegister, getChartDataByMonth } = useEmotionalRegister();

// Salvar
await saveRegister({
  selectedMood: 'Bem',
  moodId: 4,
  intensityValue: 80,
  diaryText: 'Hoje foi um bom dia...'
});

// Buscar para gráfico
const chartData = await getChartDataByMonth(2024, 10);
// Retorna: { labels: ['01', '02', ...], data: [60, 80, ...] }
```

---

### 🔧 Controllers

#### **authController**
**Arquivo:** `src/controllers/authController.ts`

**Responsabilidade:**
- Lógica de autenticação centralizada
- Singleton pattern

**Funções Principais:**

**1. Login**
```typescript
async login(email: string, password: string) {
  // 1. Autentica no Firebase
  const userCredential = await signInWithEmailAndPassword(auth, email, password);

  // 2. Busca dados do backend
  const userData = await authApi.getUserById(userCredential.user.uid);

  // 3. Salva sessão localmente
  await AsyncStorage.setItem('userSession', JSON.stringify(userData));

  return userData;
}
```

**2. Register**
```typescript
async register(email: string, password: string, displayName: string) {
  // 1. Cria conta no Firebase
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);

  // 2. Atualiza displayName
  await updateProfile(userCredential.user, { displayName });

  // 3. Cria usuário no backend
  await authApi.createUser({
    uid: userCredential.user.uid,
    email,
    displayName,
    userType: 'patient' // Definido depois
  });

  return userCredential.user;
}
```

**3. Logout**
```typescript
async logout() {
  // 1. Logout Firebase
  await signOut(auth);

  // 2. Limpa AsyncStorage
  await AsyncStorage.removeItem('userSession');
}
```

---

#### **emotionalRegisterController**
**Arquivo:** `src/controllers/emotionalRegister.ts`

**Responsabilidade:**
- Processar dados de registros emocionais
- Preparar dados para gráficos

**Funções:**

**1. getChartDataByMonth**
```typescript
async getChartDataByMonth(userId: string, year: number, month: number) {
  // 1. Busca registros do mês
  const registers = await registersApi.getByMonth(userId, year, month);

  // 2. Processa para formato de gráfico
  const labels = [];
  const data = [];

  for (let day = 1; day <= 31; day++) {
    labels.push(day.toString().padStart(2, '0'));
    const register = registers.find(r => r.date === day);
    data.push(register ? register.intensity : 0);
  }

  return { labels, data };
}
```

**2. getMoodLabel**
```typescript
getMoodLabel(moodId: number): string {
  const moods = {
    1: 'Muito triste',
    2: 'Triste',
    3: 'Neutro',
    4: 'Bem',
    5: 'Muito bem',
    6: 'Radiante'
  };
  return moods[moodId] || 'Desconhecido';
}
```

---

### 🌐 Services (APIs)

#### **api.ts** (Cliente Base)
**Arquivo:** `src/services/api.ts`

**Responsabilidade:**
- Cliente Axios configurado
- Interceptors globais

```typescript
const api = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000/api',
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' }
});

// Interceptor de erro
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response) {
      throw new Error(error.response.data?.message || 'Erro do servidor');
    } else if (error.request) {
      throw new Error('Erro de conexão. Verifique sua internet.');
    }
  }
);
```

---

#### **authApi.ts**
**Arquivo:** `src/services/authApi.ts`

**Endpoints:**

**1. Criar Usuário**
```typescript
POST /api/users
Body: { uid, email, displayName, userType }
```

**2. Buscar Usuário**
```typescript
GET /api/users/:uid
Response: { uid, email, displayName, userType, ... }
```

**3. Atualizar Usuário**
```typescript
PUT /api/users/:uid
Body: { campos a atualizar }
```

---

#### **registersApi.ts**
**Arquivo:** `src/services/registersApi.ts`

**Endpoints:**

**1. Criar Registro**
```typescript
POST /api/registers
Body: {
  userId,
  date: '2024-10-30',
  mood: 'Bem',
  moodId: 4,
  intensity: 80,
  notes: 'Texto do diário'
}
```

**2. Buscar Registros por Mês**
```typescript
GET /api/registers/:userId/:year/:month
Response: [{ id, date, mood, intensity, notes }, ...]
```

---

#### **postsApi.ts**
**Arquivo:** `src/services/postsApi.ts`

**Endpoints:**

**1. Criar Post**
```typescript
POST /api/posts
Body: {
  title,
  content,
  authorId,
  authorName,
  category,
  tags
}
```

**2. Publicar Post**
```typescript
PUT /api/posts/:id/publish
Response: { success: true }
```

**3. Listar Posts**
```typescript
GET /api/posts
Response: [{ id, title, content, author, ... }, ...]
```

---

#### **connectionApi.ts**
**Arquivo:** `src/services/connectionApi.ts`

**Endpoints:**

**1. Gerar Código (Psicólogo)**
```typescript
POST /api/connections/generate-code
Body: { psychologistId }
Response: { code: 'A1B2C3', expiresAt: '...' }
```

**2. Conectar com Código (Paciente)**
```typescript
POST /api/connections/connect
Body: { code, patientId, patientName, patientEmail }
Response: { success: true, psychologistName }
```

**3. Listar Meus Pacientes (Psicólogo)**
```typescript
GET /api/connections/my-patients/:psychologistId
Response: { patients: [{ id, name, email }, ...] }
```

**4. Buscar Registros de Paciente**
```typescript
GET /api/connections/patient-registers/:patientId/:year/:month
Response: [{ date, mood, intensity, notes }, ...]
```

---

### 🎨 Theme System

**Arquivo:** `src/theme/theme.ts`

Usa **@shopify/restyle** para tema consistente.

```typescript
export const theme = {
  colors: {
    primary: '#4ECDC4',
    secondary: '#667eea',
    success: '#6BCF7F',
    danger: '#FF6B6B',
    warning: '#FFD93D',
    text: '#1a1a1a',
    textSecondary: '#7F8C8D',
    background: '#FFFFFF',
    backgroundSecondary: '#F8F9FA',
    border: '#E9ECEF',
  },
  spacing: {
    xs: 4,
    s: 8,
    m: 16,
    l: 24,
    xl: 32,
  },
  borderRadius: {
    s: 8,
    m: 12,
    l: 16,
    xl: 20,
    round: 999,
  },
  // ...
};
```

**Uso:**
```typescript
import { ThemeProvider } from '@shopify/restyle';
import { theme } from '@theme';

<ThemeProvider theme={theme}>
  <App />
</ThemeProvider>
```

---

## 🖥️ Backend (Server)

### Estrutura de Diretórios

```
server/
├── src/
│   ├── controllers/        # Lógica de rotas
│   ├── models/             # Modelos de dados
│   ├── repositories/       # Acesso ao Firestore
│   ├── routes/             # Definição de rotas
│   ├── services/           # Lógica de negócio
│   └── index.js            # Entrada do servidor
└── package.json
```

---

### 📂 Controllers

**Responsabilidade:** Receber requisições, validar dados, chamar services/repositories, retornar respostas.

#### **UserController**
**Arquivo:** `src/controllers/UserController.js`

**Rotas:**
```javascript
POST   /api/users           // Criar usuário
GET    /api/users/:uid      // Buscar por ID
PUT    /api/users/:uid      // Atualizar
DELETE /api/users/:uid      // Deletar
```

**Exemplo:**
```javascript
async create(req, res) {
  const { uid, email, displayName, userType } = req.body;

  // Validação
  if (!uid || !email || !displayName || !userType) {
    return res.status(400).json({
      success: false,
      message: 'Campos obrigatórios faltando'
    });
  }

  // Salva no Firestore
  const user = await userRepository.create({ uid, email, displayName, userType });

  res.status(201).json({ success: true, user });
}
```

---

#### **EmotionalRegisterController**
**Arquivo:** `src/controllers/EmotionalRegisterController.js`

**Rotas:**
```javascript
POST /api/registers              // Criar registro
GET  /api/registers/:userId/:year/:month  // Buscar por mês
GET  /api/registers/:id          // Buscar por ID
```

**Exemplo:**
```javascript
async create(req, res) {
  const { userId, date, mood, moodId, intensity, notes } = req.body;

  // Validações
  if (!userId || !date || !mood || intensity < 0 || intensity > 100) {
    return res.status(400).json({
      success: false,
      message: 'Dados inválidos'
    });
  }

  const register = await registerRepository.create({
    userId,
    date,
    mood,
    moodId,
    intensity,
    notes,
    createdAt: new Date()
  });

  res.status(201).json({ success: true, register });
}
```

---

#### **PostController**
**Arquivo:** `src/controllers/PostController.js`

**Rotas:**
```javascript
POST   /api/posts                // Criar post
GET    /api/posts                // Listar todos
GET    /api/posts/:id            // Buscar por ID
PUT    /api/posts/:id            // Atualizar
DELETE /api/posts/:id            // Deletar
PUT    /api/posts/:id/publish    // Publicar
```

**Validação de Título:**
```javascript
if (title.length > 200) {
  return res.status(400).json({
    success: false,
    message: 'Título muito longo (máximo 200 caracteres)'
  });
}
```

---

#### **ConnectionController**
**Arquivo:** `src/controllers/ConnectionController.js`

**Rotas:**
```javascript
POST /api/connections/generate-code           // Gera código
POST /api/connections/connect                 // Conecta paciente
GET  /api/connections/my-patients/:psychId    // Lista pacientes
GET  /api/connections/patient-registers/:patientId/:year/:month
```

**Lógica de Geração de Código:**
```javascript
async generateCode(req, res) {
  const { psychologistId } = req.body;

  // Gera código de 6 caracteres
  const code = Math.random().toString(36).substring(2, 8).toUpperCase();

  // Salva no Firestore com expiração de 24h
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

  await connectionRepository.create({
    code,
    psychologistId,
    expiresAt,
    createdAt: new Date()
  });

  res.json({ success: true, code, expiresAt });
}
```

---

### 📊 Repositories

**Responsabilidade:** Abstrair acesso ao Firestore, operações CRUD.

#### **UserRepository**
**Arquivo:** `src/repositories/UserRepository.js`

```javascript
class UserRepository {
  constructor() {
    this.collection = firestore.collection('users');
  }

  async create(userData) {
    const docRef = await this.collection.doc(userData.uid).set(userData);
    return userData;
  }

  async findById(uid) {
    const doc = await this.collection.doc(uid).get();
    if (!doc.exists) return null;
    return doc.data();
  }

  async update(uid, data) {
    await this.collection.doc(uid).update(data);
    return { uid, ...data };
  }

  async delete(uid) {
    await this.collection.doc(uid).delete();
  }
}
```

---

#### **EmotionalRegisterRepository**
**Arquivo:** `src/repositories/EmotionalRegisterRepository.js`

**Bug Crítico Corrigido:**
```javascript
// ANTES (ERRADO):
async findByMonth(userId, year, month) {
  const monthPrefix = `${year}-${String(month + 1).padStart(2, '0')}-`;
  // Estava adicionando +1 ao mês!
}

// DEPOIS (CORRETO):
async findByMonth(userId, year, month) {
  const monthPrefix = `${year}-${String(month).padStart(2, '0')}-`;
  // Frontend já envia 1-12, não precisa +1
}
```

---

### 🗂️ Models

**Responsabilidade:** Definir estrutura de dados, validações.

#### **User Model**
**Arquivo:** `src/models/User.js`

```javascript
class User {
  constructor(data) {
    this.uid = data.uid;
    this.email = data.email;
    this.displayName = data.displayName;
    this.userType = data.userType; // 'patient' | 'psychologist'
    this.createdAt = data.createdAt || new Date();
    this.updatedAt = data.updatedAt || new Date();
  }

  toPublic() {
    return {
      uid: this.uid,
      email: this.email,
      displayName: this.displayName,
      userType: this.userType,
    };
  }

  validate() {
    if (!this.uid || !this.email || !this.displayName) {
      throw new Error('Campos obrigatórios faltando');
    }
    if (!['patient', 'psychologist'].includes(this.userType)) {
      throw new Error('Tipo de usuário inválido');
    }
  }
}
```

---

## 🔄 Funcionalidades e Componentes

### 1. Sistema de Autenticação

**Arquivos Envolvidos:**

#### Frontend:
```
src/hooks/useAuthController.ts
src/controllers/authController.ts
src/services/authApi.ts
src/services/firebaseConfig.ts
src/models/AuthModelApi.ts

Telas:
src/app/auth/SplashScreen/
src/app/auth/LoginScreen/
src/app/auth/RegisterScreen/
src/app/auth/UserTypeSelectionScreen/
src/app/auth/UserSignupScreen/
src/app/auth/PsychologistSignupScreen/

Proteção:
src/app/app/_layout.tsx
```

#### Backend:
```
src/controllers/UserController.js
src/repositories/UserRepository.js
src/models/User.js
src/routes/userRoutes.js
```

**Fluxo Completo:**
```
1. Login:
   LoginScreen → useAuthController
   → authController.login()
   → Firebase Auth
   → authApi.getUserById()
   → Backend UserController
   → UserRepository
   → Firestore
   → Retorna dados
   → Salva AsyncStorage
   → Redireciona HomeScreen

2. Proteção de Rotas:
   Usuário tenta acessar /app/HomeScreen
   → AppLayout (_layout.tsx)
   → useAuthController verifica user
   → Se null → <Redirect href="/" />
   → Se válido → Renderiza tela

3. Logout:
   ProfileScreen → handleLogout()
   → authController.logout()
   → signOut(Firebase)
   → AsyncStorage.removeItem()
   → router.replace('/auth/LoginScreen')
```

---

### 2. Registro Emocional Diário

**Arquivos Envolvidos:**

#### Frontend:
```
Telas:
src/app/app/DailyRegisterScreen/DailyRegister.tsx
src/app/app/DailyRegisterScreen/_styles.ts

Hooks:
src/hooks/useEmotionalRegister.ts

Controllers:
src/controllers/emotionalRegister.ts

Services:
src/services/registersApi.ts
src/services/emotionalRegister.ts

Types:
src/types/emotionalRegister.types.ts
```

#### Backend:
```
src/controllers/EmotionalRegisterController.js
src/repositories/EmotionalRegisterRepository.js
src/models/EmotionalRegister.js
src/routes/registerRoutes.js
```

**Fluxo Completo:**
```
1. Criar Registro:
   DailyRegisterScreen (usuário preenche)
   → handleSubmit()
   → useEmotionalRegister.saveRegister()
   → emotionalRegisterController
   → registersApi.create()
   → POST /api/registers
   → Backend EmotionalRegisterController
   → EmotionalRegisterRepository
   → Firestore.collection('registers').add()
   → Retorna sucesso
   → Modal de Sucesso aparece

2. Visualizar Histórico:
   HistoryRegisterScreen
   → useEmotionalRegister.getChartDataByMonth()
   → registersApi.getByMonth()
   → GET /api/registers/:userId/:year/:month
   → Backend EmotionalRegisterController
   → EmotionalRegisterRepository.findByMonth()
   → Firestore query
   → Retorna array de registros
   → Processa para gráfico
   → Renderiza Chart + Lista
```

---

### 3. Sistema de Conexão Paciente-Psicólogo

**Arquivos Envolvidos:**

#### Frontend:
```
Telas:
src/app/app/ProfessionalConnectScreen/
src/app/app/PatientConnectScreen/
src/app/app/ClientsList/
src/app/app/ClientSimulator/

Services:
src/services/connectionApi.ts
```

#### Backend:
```
src/controllers/ConnectionController.js
src/repositories/ConnectionRepository.js
src/models/Connection.js
src/routes/connectionRoutes.js
```

**Fluxo Completo:**
```
1. Psicólogo Gera Código:
   ProfessionalConnectScreen
   → handleGerarCodigo()
   → connectionApi.generateCode(psychologistId)
   → POST /api/connections/generate-code
   → Backend gera código aleatório (6 chars)
   → Salva no Firestore com expiresAt (+24h)
   → Retorna código (ex: "A1B2C3")
   → Exibe na tela
   → handleCopiarCodigo() → Clipboard

2. Paciente Usa Código:
   PatientConnectScreen
   → Insere código "A1B2C3"
   → handleConnect()
   → connectionApi.connectToCode(codigo, patientId, name, email)
   → POST /api/connections/connect
   → Backend valida:
     - Código existe?
     - Não expirou?
     - Busca psychologistId
   → Cria conexão no Firestore:
     {
       psychologistId,
       patientId,
       patientName,
       patientEmail,
       connectedAt: Date.now()
     }
   → Retorna sucesso
   → Modal "Conectado ao profissional X!"

3. Psicólogo Visualiza Pacientes:
   ClientsList
   → useEffect carrega pacientes
   → connectionApi.getMyPatients(psychologistId)
   → GET /api/connections/my-patients/:psychId
   → Backend:
     - Busca connections onde psychologistId = X
     - Para cada connection, busca dados do patient
     - Remove duplicatas
   → Retorna array de pacientes
   → Renderiza lista de cards
   → Ao clicar → Navega para ClientSimulator

4. Psicólogo Visualiza Registros de Paciente:
   ClientSimulator (recebe clientId)
   → connectionApi.getPatientRegisters(clientId, year, month)
   → GET /api/connections/patient-registers/:patientId/:year/:month
   → Backend:
     - Verifica se psicólogo tem acesso ao paciente
     - Busca registros do paciente
   → Retorna registros
   → Renderiza gráfico + lista (somente leitura)
```

---

### 4. Sistema de Blog (Artigos)

**Arquivos Envolvidos:**

#### Frontend:
```
Telas:
src/app/app/AddArticleScreen/        # Psicólogo cria artigo
src/app/app/BlogNavigation/          # Lista de artigos
src/app/app/BlogPostScreen/          # Visualizar artigo

HomeScreen:
src/app/app/HomeScreen/HomeScreen.tsx
src/app/app/HomeScreen/_components/BlogCard.tsx

Services:
src/services/postsApi.ts
```

#### Backend:
```
src/controllers/PostController.js
src/repositories/PostRepository.js
src/models/Post.js
src/routes/postRoutes.js
```

**Fluxo Completo:**
```
1. Criar Artigo:
   AddArticleScreen (psicólogo)
   → Preenche título, descrição, conteúdo (blocos)
   → handleSubmit()
   → postsApi.createPost({ title, content, authorId, ... })
   → POST /api/posts
   → Backend PostController:
     - Valida título (3-200 chars)
     - Valida conteúdo (mínimo 10 chars)
     - Cria post no Firestore
   → postsApi.publishPost(postId)
   → PUT /api/posts/:id/publish
   → Backend atualiza post: { published: true }
   → Retorna sucesso
   → Modal "Matéria Publicada!"

2. Listar Artigos (Home):
   HomeScreen
   → useEffect(() => fetchBlogPosts())
   → postsApi.getAllPosts()
   → GET /api/posts
   → Backend:
     - Busca todos posts onde published = true
     - Ordena por createdAt desc
   → Retorna array de posts
   → Renderiza Section com BlogCard components

3. Visualizar Artigo:
   BlogCard (clicado)
   → router.push('/app/BlogPostScreen/BlogPostScreen', { postId })
   → BlogPostScreen
   → postsApi.getPostById(postId)
   → GET /api/posts/:id
   → Backend retorna post completo
   → Renderiza título, autor, conteúdo formatado
```

---

## 🔄 Fluxo de Dados

### Arquitetura de Comunicação

```
┌──────────────────────────────────────────────────────────┐
│                      FRONTEND (Client)                    │
├──────────────────────────────────────────────────────────┤
│  Screens/Components                                       │
│       ↓                                                   │
│  Custom Hooks (useAuthController, useEmotionalRegister)  │
│       ↓                                                   │
│  Controllers (authController, emotionalRegisterController)│
│       ↓                                                   │
│  Services/APIs (authApi, registersApi, postsApi)         │
│       ↓                                                   │
│  Axios Client (api.ts)                                    │
└──────────────────────────────────────────────────────────┘
                         ↓ HTTP
              ┌────────────────────┐
              │   Express Server   │
              │  (localhost:3000)  │
              └────────────────────┘
                         ↓
┌──────────────────────────────────────────────────────────┐
│                      BACKEND (Server)                     │
├──────────────────────────────────────────────────────────┤
│  Routes (userRoutes, registerRoutes, postRoutes)         │
│       ↓                                                   │
│  Controllers (UserController, RegisterController)         │
│       ↓                                                   │
│  Repositories (UserRepository, RegisterRepository)        │
│       ↓                                                   │
│  Firestore Database                                       │
└──────────────────────────────────────────────────────────┘
```

### Exemplo: Criar Registro Emocional

```
[DailyRegisterScreen]
User preenche formulário
↓
handleSubmit()
↓
[useEmotionalRegister hook]
saveRegister({ mood, intensity, notes })
↓
[emotionalRegisterController]
Prepara dados, valida
↓
[registersApi.create()]
POST http://localhost:3000/api/registers
Body: { userId, date, mood, intensity, notes }
↓
[Express Server - registerRoutes]
router.post('/registers', EmotionalRegisterController.create)
↓
[EmotionalRegisterController]
Valida dados, chama repository
↓
[EmotionalRegisterRepository]
create(data)
↓
[Firestore]
collection('registers').add({
  userId, date, mood, intensity, notes, createdAt
})
↓
Retorna documento criado
↓
[Response: 201]
{ success: true, register: { id, ...data } }
↓
[Frontend]
Modal de Sucesso aparece
Formulário é limpo
```

---

## 📁 Estrutura de Pastas Completa

### Frontend (client/)

```
client/
├── src/
│   ├── app/                                    # Rotas
│   │   ├── index.tsx                           # Entrada
│   │   ├── _layout.tsx                         # Layout raiz
│   │   ├── +not-found.tsx                      # 404
│   │   │
│   │   ├── auth/                               # Autenticação
│   │   │   ├── LoginScreen/
│   │   │   │   ├── LoginScreen.tsx
│   │   │   │   └── _styles.ts
│   │   │   ├── RegisterScreen/
│   │   │   ├── SplashScreen/
│   │   │   ├── UserTypeSelectionScreen/
│   │   │   ├── UserSignupScreen/
│   │   │   └── PsychologistSignupScreen/
│   │   │
│   │   └── app/                                # App protegido
│   │       ├── _layout.tsx                     # Proteção rotas
│   │       ├── HomeScreen/
│   │       │   ├── HomeScreen.tsx
│   │       │   ├── _styles.ts
│   │       │   ├── _mockData.ts
│   │       │   └── _components/
│   │       │       ├── Banner.tsx
│   │       │       ├── SearchBar.tsx
│   │       │       ├── Section.tsx
│   │       │       ├── GridSection.tsx
│   │       │       ├── ResourceCard.tsx
│   │       │       ├── RespirationCard.tsx
│   │       │       └── BlogCard.tsx
│   │       ├── DailyRegisterScreen/
│   │       ├── HistoryRegisterScreen/
│   │       ├── ProfileScreen/
│   │       ├── ClientsList/
│   │       ├── ClientSimulator/
│   │       ├── AddArticleScreen/
│   │       ├── BlogNavigation/
│   │       ├── BlogPostScreen/
│   │       ├── PatientConnectScreen/
│   │       ├── ProfessionalConnectScreen/
│   │       ├── AboutUsScreen/
│   │       ├── TutorialScreen/
│   │       ├── WellnessTipsScreen/
│   │       ├── BreathingActivityScreen/
│   │       ├── NotificationCenterScreen/
│   │       ├── PrivacyScreen/
│   │       ├── LanguageScreen/
│   │       └── HelpScreen/
│   │
│   ├── components/                             # Reutilizáveis
│   │   └── BottonNavigation.tsx
│   │
│   ├── controllers/                            # Lógica negócio
│   │   ├── authController.ts
│   │   └── emotionalRegister.ts
│   │
│   ├── hooks/                                  # Custom hooks
│   │   ├── useAuthController.ts
│   │   └── useEmotionalRegister.ts
│   │
│   ├── models/                                 # Modelos
│   │   ├── AuthModelApi.ts
│   │   └── emotionalRegister.ts
│   │
│   ├── services/                               # APIs
│   │   ├── api.ts                              # Cliente base
│   │   ├── authApi.ts
│   │   ├── registersApi.ts
│   │   ├── postsApi.ts
│   │   ├── connectionApi.ts
│   │   ├── emotionalRegister.ts
│   │   └── firebaseConfig.ts
│   │
│   ├── theme/                                  # Tema
│   │   ├── index.ts
│   │   ├── theme.ts
│   │   ├── colors.ts
│   │   ├── spacing.ts
│   │   ├── borderRadius.ts
│   │   └── boxShadows.ts
│   │
│   └── types/                                  # Tipos
│       ├── auth.types.ts
│       └── emotionalRegister.types.ts
│
├── assets/                                     # Recursos
│   └── images/
│       ├── icon.png
│       ├── splash-icon.png
│       └── ...
│
├── .env                                        # Variáveis ambiente
├── .gitignore
├── app.json                                    # Config Expo
├── package.json
├── tsconfig.json
└── README.md
```

---

### Backend (server/)

```
server/
├── src/
│   ├── controllers/                           # Controllers
│   │   ├── UserController.js
│   │   ├── EmotionalRegisterController.js
│   │   ├── PostController.js
│   │   └── ConnectionController.js
│   │
│   ├── models/                                # Modelos
│   │   ├── User.js
│   │   ├── EmotionalRegister.js
│   │   ├── Post.js
│   │   └── Connection.js
│   │
│   ├── repositories/                          # Repositories
│   │   ├── UserRepository.js
│   │   ├── EmotionalRegisterRepository.js
│   │   ├── PostRepository.js
│   │   └── ConnectionRepository.js
│   │
│   ├── routes/                                # Rotas
│   │   ├── userRoutes.js
│   │   ├── registerRoutes.js
│   │   ├── postRoutes.js
│   │   └── connectionRoutes.js
│   │
│   ├── services/                              # Serviços
│   │   └── firebaseAdmin.js
│   │
│   └── index.js                               # Entrada
│
├── .env                                       # Variáveis ambiente
├── .gitignore
├── package.json
└── README.md
```

---

## 🔧 Variáveis de Ambiente

### Frontend (.env)

```env
EXPO_PUBLIC_API_URL=http://localhost:3000/api
EXPO_PUBLIC_FIREBASE_API_KEY=AIzaSy...
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=aurora-xxx.firebaseapp.com
EXPO_PUBLIC_FIREBASE_PROJECT_ID=aurora-xxx
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=aurora-xxx.appspot.com
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
EXPO_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abc123
```

### Backend (.env)

```env
PORT=3000
FIREBASE_PROJECT_ID=aurora-xxx
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n..."
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxx@aurora-xxx.iam.gserviceaccount.com
```

---

## 🚀 Como Executar

### 1. Instalar Dependências

```bash
# Frontend
cd client
npm install

# Backend
cd ../server
npm install
```

### 2. Configurar Variáveis

```bash
# Raiz do projeto
cp .env.example client/.env
# Editar client/.env com suas credenciais Firebase

# Configurar backend
# Criar server/.env com credenciais Admin SDK
```

### 3. Iniciar Servidores

**Opção 1: Manual**
```bash
# Terminal 1 - Backend
cd server
npm run dev

# Terminal 2 - Frontend
cd client
npm run web
```

**Opção 2: Script Automatizado**
```bash
# Na raiz do projeto
./dev.sh
# Inicia backend e frontend simultaneamente
```

---

## 📊 Métricas do Projeto

### Frontend
- **Telas:** 24 telas completas
- **Componentes:** 30+ componentes reutilizáveis
- **Hooks:** 2 custom hooks
- **Services:** 6 serviços de API
- **Linhas de Código:** ~15.000 linhas

### Backend
- **Endpoints:** 20+ endpoints RESTful
- **Controllers:** 4 controllers
- **Repositories:** 4 repositories
- **Models:** 4 modelos
- **Linhas de Código:** ~3.000 linhas

### Funcionalidades
- ✅ Autenticação completa (login, registro, logout)
- ✅ Proteção de rotas
- ✅ Registro emocional diário
- ✅ Histórico com gráficos
- ✅ Sistema de blog (CRUD)
- ✅ Conexão paciente-psicólogo
- ✅ Perfil de usuário
- ✅ Exercícios de respiração
- ✅ Recursos educativos

---

## 🐛 Bugs Corrigidos Importantes

### 1. Registros Não Aparecendo
**Bug:** Psicólogo não via registros do paciente
**Causa:** `month + 1` no backend (estava buscando mês errado)
**Correção:** Remover o `+1`, frontend já envia 1-12

### 2. Loop Infinito
**Bug:** ClientsList recarregava infinitamente
**Causa:** `useEffect` com `user` object como dependência
**Correção:** Usar `user?.uid` (valor primitivo)

### 3. Pacientes Duplicados
**Bug:** Mesmo paciente aparecia múltiplas vezes
**Causa:** Backend retornava conexões duplicadas
**Correção:** Filtro de duplicatas no frontend

### 4. SearchBar Perdendo Foco
**Bug:** A cada tecla digitada, input perdia foco
**Causa:** SearchBar re-renderizava
**Correção:** `React.memo` + `useCallback`

### 5. Email Não Retornado
**Bug:** Conexão falhava com "email obrigatório"
**Causa:** `User.toPublic()` não retornava email
**Correção:** Adicionar email ao objeto retornado

---

## 📚 Tecnologias e Bibliotecas

### Frontend
```json
{
  "react-native": "0.79.2",
  "expo": "~53.0.9",
  "expo-router": "~5.0.6",
  "typescript": "~5.8.3",
  "axios": "^1.6.0",
  "firebase": "^11.10.0",
  "react-native-vector-icons": "^10.2.0",
  "react-native-chart-kit": "^6.12.0",
  "expo-clipboard": "~7.1.2",
  "@shopify/restyle": "^2.4.5"
}
```

### Backend
```json
{
  "express": "^4.18.2",
  "firebase-admin": "^11.10.1",
  "cors": "^2.8.5",
  "dotenv": "^16.3.1",
  "nodemon": "^3.0.1"
}
```

---

## 👥 Equipe

**Turma 3A1**

- **Davi Murta** - Tech Lead
- **Sara Freitas** - UI/UX Designer
- **Maria Fernanda** - FullStack Developer
- **Samuel Cordeiro** - Backend Developer
- **João Pedro** - Backend Developer
- **Ronan Porto** - Frontend Developer

---

## 📝 Conclusão

O projeto Aurora é uma plataforma completa de saúde mental que demonstra:

1. **Arquitetura Sólida:** Frontend e backend bem estruturados
2. **Boas Práticas:** Separação de responsabilidades, código limpo
3. **Funcionalidades Completas:** Sistema de auth, registro emocional, blog, conexões
4. **UX Bem Pensada:** Modais, navegação intuitiva, feedback visual
5. **Escalabilidade:** Fácil adicionar novos recursos

**Tecnologias Modernas:**
- React Native para mobile multiplataforma
- Expo Router para navegação file-based
- Firebase para auth e database
- Express.js para API RESTful
- TypeScript para type safety

**Pronto para Produção:**
- Proteção de rotas implementada
- Validações no frontend e backend
- Tratamento de erros completo
- Código documentado e organizado

---

**Documento gerado em:** Outubro 2024
**Versão:** 1.0.0
