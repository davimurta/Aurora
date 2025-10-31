# Aurora - Client (React Native + Expo)

Aplicativo mobile da plataforma Aurora para saúde mental.

## Tecnologias

- **React Native** - Framework para desenvolvimento mobile
- **Expo Router** - Navegação baseada em sistema de arquivos
- **TypeScript** - Tipagem estática
- **Firebase Client SDK** - Autenticação
- **Axios** - Cliente HTTP
- **React Native Vector Icons** - Ícones

## Estrutura do Projeto

```
client/
├── src/
│   ├── app/              # Rotas do Expo Router
│   │   ├── app/          # Rotas protegidas do app (após login)
│   │   ├── auth/         # Rotas de autenticação
│   │   ├── _layout.tsx   # Layout raiz
│   │   └── index.tsx     # Entrada do app (SplashScreen)
│   ├── components/       # Componentes reutilizáveis
│   ├── controllers/      # Controladores de lógica de negócio
│   ├── hooks/            # Custom hooks
│   ├── models/           # Modelos de dados
│   ├── services/         # Serviços e APIs
│   ├── theme/            # Configuração de tema
│   └── types/            # Tipos TypeScript
├── assets/               # Imagens e recursos estáticos
├── app.json              # Configuração do Expo
├── package.json          # Dependências do projeto
└── tsconfig.json         # Configuração do TypeScript
```

## Instalação

```bash
# Na pasta client/
cd client

# Instalar dependências
npm install
```

## Executar

### Web
```bash
npm run web
```

### Android
```bash
npm run android
```

### iOS
```bash
npm run ios
```

## Variáveis de Ambiente

Copie `.env.example` na raiz do projeto e configure:

```env
EXPO_PUBLIC_API_URL=http://localhost:3000
EXPO_PUBLIC_FIREBASE_API_KEY=your_key
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your_domain
EXPO_PUBLIC_FIREBASE_PROJECT_ID=your_project
# ... outras configurações Firebase
```

## Proteção de Rotas

O projeto implementa proteção de rotas via `_layout.tsx`:

- **Rotas protegidas** (`/app/app/*`): Requerem autenticação
- **Rotas públicas** (`/auth/*`): Acessíveis sem login
- **SplashScreen** (`/`): Ponto de entrada que verifica autenticação

## Convenções

### Arquivos com Prefixo `_`
Arquivos/pastas que começam com `_` são ignorados pelo Expo Router:
- `_styles.ts` - Arquivos de estilo
- `_components/` - Componentes auxiliares
- `_layout.tsx` - Layouts (exceto quando em diretórios de rota)

### Estrutura de Screens
```
ScreenName/
├── ScreenName.tsx    # Componente principal (default export)
├── _styles.ts        # Estilos
└── _components/      # Componentes específicos da tela
```

## Scripts Disponíveis

```bash
npm start          # Inicia o Metro bundler
npm run web        # Roda no navegador
npm run android    # Roda no Android
npm run ios        # Roda no iOS
npm run lint       # Verifica código com biome
```

## Fluxo de Autenticação

1. **SplashScreen** (`src/app/index.tsx`)
   - Verifica se há usuário logado (AsyncStorage + Firebase)
   - Redireciona para HomeScreen (autenticado) ou LoginScreen (não autenticado)

2. **Login/Registro** (`src/app/auth/*`)
   - Autentica via Firebase Client SDK
   - Sincroniza dados com backend
   - Salva token no AsyncStorage

3. **Rotas Protegidas** (`src/app/app/*`)
   - Verificadas pelo `_layout.tsx`
   - Bloqueia acesso sem autenticação
   - Redireciona para SplashScreen se não autenticado

## Integração com Backend

O cliente se comunica com o backend Express.js através de:
- **Base URL**: `EXPO_PUBLIC_API_URL` (configurado em .env)
- **Serviços**: `src/services/api.ts` (cliente Axios)
- **Endpoints**: authApi, postsApi, registersApi, connectionApi

Veja `INTEGRATION_GUIDE.md` na raiz do projeto para mais detalhes.
