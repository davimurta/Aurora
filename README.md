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

2. **Instale as dependências**
   ```bash
   npm install
   ```

3. **Configure as variáveis de ambiente**
   ```bash
   cp .env.example .env
   # Edite o arquivo .env com suas configurações
   ```

4. **Execute o projeto**
   ```bash
   npx expo start
   ```

5. **Abra o app**
   - **Expo Go**: Escaneie o QR code com o app Expo Go
   - **Emulador**: Pressione `a` para Android ou `i` para iOS
   - **Web**: Pressione `w` para abrir no navegador

---

## 📦 Tecnologias

| Tecnologia | Versão | Descrição |
|------------|--------|-----------|
| React Native | Latest | Framework para desenvolvimento mobile |
| Expo | Latest | Plataforma para desenvolvimento React Native |
| TypeScript | Latest | Superset do JavaScript com tipagem estática |
| Firebase | Latest | Backend-as-a-Service para autenticação e database |
| Node.js | v18+ | Ambiente de execução JavaScript |

---

## 📂 Estrutura do Projeto

```
aurora/
├── src/
│   ├── app/         # Arquivo principal e configurações da aplicação
│   │   └── index.tsx
│   ├── components/  # Componentes reutilizáveis
│   │   ├── Button/
│   │   ├── Input/
│   │   ├── Charts/
│   │   └── ...
│   ├── screens/     # Telas principais do app
│   │   ├── Auth/
│   │   │   ├── Login/
│   │   │   ├── Register/
│   │   │   └── ...
│   │   ├── Patient/
│   │   │   ├── Dashboard/
│   │   │   ├── WellnessLog/
│   │   │   └── ...
│   │   ├── Psychologist/
│   │   │   ├── Dashboard/
│   │   │   ├── BlogManager/
│   │   │   └── ...
│   │   └── Shared/
│   ├── services/    # Serviços e APIs
│   │   ├── firebase/
│   │   ├── auth/
│   │   └── api/
│   ├── utils/       # Funções utilitárias
│   ├── types/       # Definições de tipos TypeScript
│   └── constants/   # Constantes da aplicação
├── assets/          # Imagens, fontes e outros recursos
├── .env.example     # Exemplo de variáveis de ambiente
├── app.json         # Configurações do Expo
├── package.json     # Dependências e scripts
└── README.md        # Documentação do projeto
```

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

| Script | Comando | Descrição |
|--------|---------|-----------|
| **Desenvolvimento** | `npm start` | Inicia o servidor de desenvolvimento |
| **Android** | `npm run android` | Executa no emulador Android |
| **iOS** | `npm run ios` | Executa no emulador iOS (macOS) |
| **Web** | `npm run web` | Executa no navegador |
| **Build** | `npm run build` | Gera build de produção |
| **Lint** | `npm run lint` | Executa verificação de código |
| **Test** | `npm test` | Executa testes unitários |

---

## ✅ Status do Desenvolvimento

### Funcionalidades Gerais
- [x] **Login com autenticação** (Firebase)
- [ ] **Cadastro de usuários** (pacientes)
- [ ] **Cadastro de psicólogos** (com validação de documentos)
- [ ] **Diferenciação entre perfis** (paciente/psicólogo)
- [ ] **Aceite dos termos e condições** no cadastro

### Funcionalidades do Paciente
- [ ] **Registro diário de bem-estar** (emoção, intensidade, descrição)
- [ ] **Histórico de registros** com filtros e busca
- [ ] **Gráficos de progresso emocional** (weekly/monthly views)
- [ ] **Notificações de lembrete** personalizáveis
- [ ] **Exportar relatório emocional** (PDF)

### Funcionalidades do Psicólogo
- [ ] **Gestão de conteúdo do blog** (CRUD completo)
- [ ] **Editor rico** para matérias (HTML)
- [ ] **Perfil profissional completo** (CRP, formação, biografia)
- [ ] **Upload de documentos** (diploma, CRP, comprovantes)
- [ ] **Dashboard analítico** com métricas

### Extras (Roadmap Futuro)
- [ ] **Sistema de chat** paciente-psicólogo
- [ ] **Recomendações personalizadas** baseadas em IA
- [ ] **Personalização de interface** (temas, notificações)
- [ ] **Integração com wearables** para dados biométricos
- [ ] **Sistema de agendamento** de consultas

---

## 🎯 Funcionalidades

### 👤 Para Pacientes
- **Registro de Bem-estar**: Acompanhe suas emoções diariamente com escala de intensidade
- **Histórico Completo**: Visualize seu progresso ao longo do tempo
- **Relatórios**: Exporte dados para compartilhar com profissionais
- **Lembretes**: Notificações personalizadas para manter a constância
- **Recursos Educativos**: Acesse conteúdos criados por psicólogos verificados

### 👨‍⚕️ Para Psicólogos
- **Perfil Profissional**: Cadastro completo com validação de documentos
- **Gestão de Conteúdo**: Crie e gerencie artigos educativos
- **Dashboard Analítico**: Acompanhe métricas de engajamento
- **Verificação Profissional**: Sistema de validação de credenciais

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

- Siga as guidelines de Material Design (Android) e Human Interface (iOS)
- Mantenha consistência visual entre telas
- Implemente loading states e error handling
- Considere acessibilidade em todos os componentes

---

## 👥 Equipe

Conheça a equipe por trás do Aurora:  
**Turma: 3A1**

| Matrícula | Nome | Papel | GitHub | Responsabilidade Principal |
|-----------|------|-------|--------|----------------------------|
| 12300055 | **Davi Murta** | Frontend Developer | [@davimurta](https://github.com/davimurta) | Autenticação e Componentes |
| 12400947 | **Sara Freitas** | UI/UX Designer | [@sahfreitas](https://github.com/sahfreitas) | Design System e Interfaces |
| 12302589 | **Maria Fernanda** | Frontend Developer | [@mafemelo](https://github.com/mafemelo) | Dashboard Paciente |
| 22402942 | **Samuel Cordeiro** | Backend Developer | *A definir* | Firebase e APIs |
| 12300993 | **João Pedro** | Frontend Developer | [@jpfgomes](https://github.com/jpfgomes) | Dashboard Psicólogo |
| 12303127 | **Ronan Porto** | QA/Tester | *A definir* | Testes e Qualidade |

---

<div align="center">

**Feito com ❤️ pela equipe Aurora**  
*Cuidando da saúde mental através da tecnologia*

[⬆ Voltar ao topo](#-aurora)

</div>
