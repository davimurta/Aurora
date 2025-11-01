# 🌅 Aurora

**Aplicativo mobile de saúde mental desenvolvido em React Native com Expo e TypeScript**

Aurora é uma plataforma que conecta pacientes e psicólogos, oferecendo ferramentas para registro de bem-estar, acompanhamento emocional e recursos educativos. Desenvolvido com foco na experiência do usuário e na qualidade do código através de boas práticas de desenvolvimento.

---

## 📋 Índice

- [🚀 Início Rápido](#-início-rápido)
- [📦 Tecnologias](#-tecnologias)
- [📂 Estrutura do Projeto](#-estrutura-do-projeto)
- [⚙️ Configuração](#️-configuração)
- [🔧 Scripts Disponíveis](#-scripts-disponíveis)
- [✅ Status do Desenvolvimento](#-status-do-desenvolvimento)
- [🎯 Funcionalidades](#-funcionalidades)
- [🔄 Fluxo de Desenvolvimento](#-fluxo-de-desenvolvimento)
- [📌 Padrão de Commits](#-padrão-de-commits)
- [✨ Boas Práticas](#-boas-práticas)
- [👥 Equipe](#-equipe)

---

## 🚀 Início Rápido

### Pré-requisitos

Certifique-se de ter as seguintes ferramentas instaladas:

- **Node.js** v18+ ([Download](https://nodejs.org/))
- **Git** ([Download](https://git-scm.com/))
- **Expo CLI** (instalação automática via npx)
- **Conta Firebase** para autenticação

### Instalação

1. **Clone o repositório**
   ```bash
   git clone git@github.com:seu-usuario/aurora.git
   cd aurora
   ```

2. **Instale as dependências do CLIENT**
   ```bash
   cd client
   npm install
   ```

3. **Instale as dependências do SERVER**
   ```bash
   cd ../server
   npm install
   ```

4. **Configure as variáveis de ambiente**
   ```bash
   # Na raiz do projeto
   cd ..
   cp .env.example .env
   # Edite o arquivo .env com suas configurações
   ```

5. **Execute o BACKEND**
   ```bash
   cd server
   npm run dev
   ```

6. **Execute o FRONTEND (em outro terminal)**
   ```bash
   cd client
   npm run web     # Para web
   # ou
   npm start       # Para mobile (Expo)
   ```

7. **Abra o app**
   - **Web**: Abrirá automaticamente no navegador
   - **Expo Go**: Escaneie o QR code com o app Expo Go
   - **Emulador**: Pressione `a` para Android ou `i` para iOS

---

## 📦 Tecnologias

### Frontend (Client)
| Tecnologia | Versão | Descrição |
|------------|--------|-----------|
| React Native | Latest | Framework para desenvolvimento mobile |
| Expo Router | Latest | Sistema de navegação baseado em arquivos |
| TypeScript | Latest | Superset do JavaScript com tipagem estática |
| Firebase Client SDK | Latest | Autenticação e serviços |
| Axios | Latest | Cliente HTTP |

### Backend (Server)
| Tecnologia | Versão | Descrição |
|------------|--------|-----------|
| Node.js | v18+ | Ambiente de execução JavaScript |
| Express.js | Latest | Framework web minimalista |
| Firebase Admin SDK | Latest | Gerenciamento de usuários e auth |
| Firestore | Latest | Banco de dados NoSQL |

---

## 📂 Estrutura do Projeto

```
aurora/
├── client/                      # Frontend React Native + Expo
│   ├── src/
│   │   ├── app/                 # Rotas do Expo Router
│   │   │   ├── app/             # Rotas protegidas (após login)
│   │   │   ├── auth/            # Rotas de autenticação
│   │   │   ├── _layout.tsx      # Layout raiz
│   │   │   └── index.tsx        # Entrada (SplashScreen)
│   │   ├── components/          # Componentes reutilizáveis
│   │   ├── controllers/         # Lógica de negócio
│   │   ├── hooks/               # Custom hooks
│   │   ├── models/              # Modelos de dados
│   │   ├── services/            # APIs e serviços
│   │   ├── theme/               # Tema e estilos
│   │   └── types/               # Tipos TypeScript
│   ├── assets/                  # Imagens e recursos
│   ├── app.json                 # Configuração Expo
│   ├── package.json             # Dependências client
│   └── README.md                # Docs do client
│
├── server/                      # Backend Express.js + Firebase
│   ├── src/
│   │   ├── controllers/         # Controladores de rotas
│   │   ├── models/              # Modelos de dados
│   │   ├── repositories/        # Acesso a dados
│   │   ├── routes/              # Definição de rotas
│   │   ├── services/            # Lógica de negócio
│   │   └── index.js             # Entrada do servidor
│   ├── package.json             # Dependências server
│   └── README.md                # Docs do server
│
├── .env.example                 # Exemplo de variáveis de ambiente
├── .gitignore                   # Arquivos ignorados pelo Git
├── README.md                    # Documentação principal
├── INTEGRATION_GUIDE.md         # Guia de integração
└── FUNCIONALIDADES_IMPLEMENTADAS.md  # Status das features
```

### Diagrama de classes

<img width="1300" height="3540" alt="Untitled diagram _ Mermaid Chart-2025-07-22-143815" src="https://github.com/user-attachments/assets/eb7e72f7-1dbc-4fea-8115-f89749ec694f" />

---

## ⚙️ Configuração

### Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto baseado no `.env.example`:

```ini
# Firebase Configuration
FIREBASE_API_KEY=sua_chave_api_firebase
FIREBASE_AUTH_DOMAIN=seu_projeto.firebaseapp.com
FIREBASE_PROJECT_ID=seu_projeto_id
FIREBASE_STORAGE_BUCKET=seu_projeto.appspot.com
FIREBASE_MESSAGING_SENDER_ID=123456789
FIREBASE_APP_ID=1:123456789:web:abcdef123456

# API Configuration
API_URL=https://suaapi.com
API_KEY=sua_chave_api

# Environment
NODE_ENV=development
ENV=development

# Optional: Analytics, Crashlytics, etc.
ANALYTICS_KEY=sua_chave_analytics
```

> ⚠️ **Importante**: Nunca commite o arquivo `.env` com informações sensíveis!

---

## 🔧 Scripts Disponíveis

### Frontend (client/)
| Script | Comando | Descrição |
|--------|---------|-----------|
| **Desenvolvimento** | `npm start` | Inicia o Metro bundler |
| **Web** | `npm run web` | Executa no navegador |
| **Android** | `npm run android` | Executa no emulador Android |
| **iOS** | `npm run ios` | Executa no emulador iOS (macOS) |
| **Lint** | `npm run lint` | Executa verificação de código |

### Backend (server/)
| Script | Comando | Descrição |
|--------|---------|-----------|
| **Desenvolvimento** | `npm run dev` | Inicia servidor com nodemon |
| **Produção** | `npm start` | Inicia servidor em produção |
| **Test** | `npm test` | Executa testes (se configurado) |

---

## ✅ Status do Desenvolvimento

### Funcionalidades Gerais
- [x] **Login com autenticação** (Firebase)
- [x] **Cadastro de usuários** (pacientes)
- [x] **Cadastro de psicólogos** (com validação de documentos)
- [x] **Diferenciação entre perfis** (paciente/psicólogo)
- [x] **Aceite dos termos e condições** no cadastro

### Funcionalidades do Paciente
- [x] **Registro diário de bem-estar** (emoção, intensidade, descrição)
- [x] **Histórico de registros** com filtros e busca
- [ ] **Gráficos de progresso emocional** (weekly/monthly views)
- [ ] **Notificações de lembrete** personalizáveis
- [x] **Exportar relatório emocional** (PDF)

### Funcionalidades do Psicólogo
- [ ] **Gestão de conteúdo do blog** (CRUD completo)
- [ ] **Editor rico** para matérias (HTML)
- [ ] **Perfil profissional completo** (CRP, formação, biografia)
- [ ] **Upload de documentos** (diploma, CRP, comprovantes)
- [ ] **Dashboard analítico** com métricas

---

## 🎯 20 Funcionalidades

### ⚙ Geral
- **Login Paciente/ Psicólogo**: Permite que usuários existentes entrem no aplicativo usando suas credenciais.
- **Cadastro Paciente/ Psicólogo**: Permite que novos usuários criem uma conta na plataforma.
- **Diferenciação de interface para cada tipo de usuário (Paciente/ Psicólogo)**: Ajusta o design e as telas exibidas de acordo com o tipo de conta (Paciente tem acesso a ferramentas de auto-cuidado; Psicólogo a ferramentas de gestão).
- **Sair da conta Paciente/ Psicólogo**: Permite que o usuário encerre a sessão atual de forma segura.
- **Acesso ao blog**: Permite que todos os usuários leiam artigos e conteúdos postados pelos profissionais.

### 👤 Para Pacientes
- **Exportar relatórios**: Gera um documento (PDF, etc.) com o resumo do histórico emocional e dos registros do paciente em um período.
- **Atividade de respiração**: Oferece um guia visual para exercícios de respiração e relaxamento.
- **Registro diário**: Permite ao paciente documentar pensamentos, eventos e humor ao longo do dia.
- **Anotações diárias**: Oferece um espaço para o paciente escrever reflexões e lembretes.
- **Escala de emoções**: Permite que o paciente classifique seu estado emocional ou intensidade de sentimentos usando uma escala visual (ex: emojis, números).
- **Histórico emocional**: Apresenta uma visão cronológica dos registros, emoções e anotações feitas pelo paciente.
- **Conexão com profissional**: Permite ao paciente vincular sua conta ao perfil de seu psicólogo.
- **Busca**: Permite ao paciente encontrar rapidamente artigos no blog, recursos ou entradas de seu registro.
- **Acesso recursos diários**: Oferece conteúdos curtos e ferramentas de apoio para uso imediato no dia a dia.

### 👨‍⚕️ Para Psicólogos
- **Lista de pacientes**: Apresenta uma tela com todos os pacientes conectados ao perfil do psicólogo.
- **Postar blog/artigo**: Permite ao psicólogo criar e publicar novos conteúdos de texto para o blog do aplicativo.
- **Acesso ao perfil paciente**: Permite que o profissional visualize os dados básicos e o status de conexão de um paciente específico.
- **Acesso ao registro emocional paciente**: Permite ao profissional visualizar as informações de humor, emoções e anotações do paciente.
- **Gerar código de conexão**: Cria um código exclusivo que o paciente utiliza para se conectar ao perfil do psicólogo.
- **Tags/Categorias para posts do blog**: Permite que o psicólogo classifique artigos para facilitar a busca e organização do conteúdo.
- **Formatação do Blog**: Oferece ferramentas de edição (negrito, itálico, listas) para melhorar a apresentação dos artigos postados.

---

## 🔄 Fluxo de Desenvolvimento

### 1. Criando uma Nova Feature

```bash
# Crie uma nova branch a partir da main
git checkout main
git pull origin main
git checkout -b feat/nome-da-feature
```

### 2. Desenvolvendo

- Faça commits pequenos e frequentes
- Siga o [padrão de commits](#-padrão-de-commits)
- Teste suas alterações localmente
- Mantenha o checklist atualizado

### 3. Enviando para Revisão

```bash
# Suba sua branch
git push origin feat/nome-da-feature

# Abra um Pull Request para main
# Atualize o status no checklist se aplicável
# Aguarde revisão e aprovação da equipe
```

### 4. Após Aprovação

- O merge será feito pela equipe
- Delete a branch local após o merge:
  ```bash
  git checkout main
  git pull origin main
  git branch -d feat/nome-da-feature
  ```

---

## 📌 Padrão de Commits

Utilize o formato **Conventional Commits**:

```
<tipo>(<escopo>): <descrição>

[corpo opcional]
[rodapé opcional]
```

### Tipos de Commit

| Tipo | Descrição | Exemplo |
|------|-----------|---------|
| `feat` | Nova funcionalidade | `feat(auth): adicionar login com Firebase` |
| `fix` | Correção de bug | `fix(wellness): corrigir validação de intensidade` |
| `docs` | Documentação | `docs: atualizar checklist no README` |
| `style` | Formatação/estilo | `style: corrigir indentação nos componentes` |
| `refactor` | Refatoração | `refactor(components): otimizar Button component` |
| `test` | Testes | `test(auth): adicionar testes para login` |
| `chore` | Tarefas administrativas | `chore: atualizar dependências do Firebase` |
| `perf` | Melhoria de performance | `perf(charts): otimizar rendering dos gráficos` |

### Exemplos Específicos do Projeto

```bash
git commit -m "feat(auth): implementar cadastro de psicólogo com validação CRP"
git commit -m "fix(wellness): corrigir crash no registro de emoções"
git commit -m "feat(blog): adicionar editor rico para matérias"
git commit -m "docs: marcar login como concluído no checklist"
```

---

## ✨ Boas Práticas

### 📝 Código

- **Nomenclatura**: Use `camelCase` para variáveis e funções, `PascalCase` para componentes
- **Tipagem**: Sempre use TypeScript com tipagem forte (`interface` ou `type`)
- **Estrutura**: Mantenha componentes pequenos e focados em uma responsabilidade
- **Comentários**: Documente código complexo e decisões importantes
- **Validação**: Use Yup ou Joi para validação de forms e dados

### 🗂️ Organização

- **Componentes reutilizáveis** → `src/components/`
- **Telas específicas** → `src/screens/[UserType]/`
- **Lógica de negócio** → `src/services/` ou hooks customizados
- **Utilitários** → `src/utils/`
- **Tipos compartilhados** → `src/types/`

### 🔒 Segurança

- Sempre valide dados do usuário
- Use regras de segurança do Firebase
- Não exponha informações sensíveis
- Implemente rate limiting onde necessário

### 🎨 UI/UX

- Mantenha consistência visual entre telas
- Implemente loading states e error handling
- Considere acessibilidade em todos os componentes

---

## 👥 Equipe

Conheça a equipe por trás do Aurora:  
**Turma: 3A1**

| Matrícula | Nome | Papel | GitHub |
|-----------|------|-------|--------|
| 12300055 | **Davi Murta** | Tech Lead | [@davimurta](https://github.com/davimurta) |
| 12400947 | **Sara Freitas** | UI/UX Designer | [@sahfreitas](https://github.com/sahfreitas) |
| 12302589 | **Maria Fernanda** | FullStack Developer | [@mafemelo](https://github.com/mafemelo) |
| 22402942 | **Samuel Cordeiro** | Backend Developer | [@sam-cordeiro](https://github.com/sam-cordeiro) |
| 12300993 | **João Pedro** | Backend Developer | [@jpfgomes](https://github.com/jpfgomes) |
| 12303127 | **Ronan Porto** | Frontend Developer | [@RonanPorto](https://github.com/RonanPorto) |

---

<div align="center">

**Feito com ❤️ pela equipe Aurora**  
*Cuidando da saúde mental através da tecnologia*

[⬆ Voltar ao topo](#-aurora)

</div>
