# 🌅 Aurora

**Aplicativo mobile moderno desenvolvido em React Native com Expo e TypeScript**

Aurora é um projeto estruturado de forma modular e escalável, projetado para facilitar a colaboração entre desenvolvedores e manter a qualidade do código através de boas práticas de desenvolvimento.

---

## 📋 Índice

- [🚀 Início Rápido](#início-rápido)
- [📦 Tecnologias](#tecnologias)
- [📂 Estrutura do Projeto](#estrutura-do-projeto)
- [⚙️ Configuração](#configuração)
- [🔧 Scripts Disponíveis](#scripts-disponíveis)
- [🔄 Fluxo de Desenvolvimento](#fluxo-de-desenvolvimento)
- [📌 Padrão de Commits](#padrão-de-commits)
- [✅ Boas Práticas](#boas-práticas)
- [👥 Equipe](#equipe)
- [🤝 Contribuindo](#contribuindo)
- [📄 Licença](#licença)
- [🆘 Suporte](#suporte)

---

## 🚀 Início Rápido

### Pré-requisitos

Certifique-se de ter as seguintes ferramentas instaladas:

- **Node.js** v18+ ([Download](https://nodejs.org/))
- **Git** ([Download](https://git-scm.com/))
- **Expo CLI** (instalação automática via npx)

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
│   │   └── ...
│   ├── screens/     # Telas principais do app
│   │   ├── Home/
│   │   ├── Login/
│   │   └── ...
│   ├── services/    # Serviços e APIs
│   ├── utils/       # Funções utilitárias
│   └── types/       # Definições de tipos TypeScript
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

### 3. Enviando para Revisão

```bash
# Suba sua branch
git push origin feat/nome-da-feature

# Abra um Pull Request para main
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
<tipo>: <descrição>

[corpo opcional]
[rodapé opcional]
```

### Tipos de Commit

| Tipo | Descrição | Exemplo |
|------|-----------|---------|
| `feat` | Nova funcionalidade | `feat: adicionar tela de login` |
| `fix` | Correção de bug | `fix: corrigir validação de email` |
| `docs` | Documentação | `docs: atualizar README` |
| `style` | Formatação/estilo | `style: corrigir indentação` |
| `refactor` | Refatoração | `refactor: otimizar componente Button` |
| `test` | Testes | `test: adicionar testes para Login` |
| `chore` | Tarefas administrativas | `chore: atualizar dependências` |
| `perf` | Melhoria de performance | `perf: otimizar carregamento de imagens` |

### Exemplos de Commits

```bash
git commit -m "feat: implementar autenticação com JWT"
git commit -m "fix: corrigir crash na tela de perfil"
git commit -m "docs: adicionar documentação da API"
git commit -m "refactor: extrair lógica de validação para hook customizado"
```

---

## ✅ Boas Práticas

### 📝 Código

- **Nomenclatura**: Use `camelCase` para variáveis e funções, `PascalCase` para componentes
- **Tipagem**: Sempre use TypeScript com tipagem forte (`interface` ou `type`)
- **Estrutura**: Mantenha componentes pequenos e focados em uma responsabilidade
- **Comentários**: Documente código complexo e decisões importantes

### 🗂️ Organização

- **Componentes reutilizáveis** → `src/components/`
- **Telas específicas** → `src/screens/`
- **Lógica de negócio** → `src/services/` ou hooks customizados
- **Utilitários** → `src/utils/`

### 🔄 Async/Await

```typescript
// ✅ Preferido
const fetchData = async () => {
  try {
    const response = await api.getData();
    return response.data;
  } catch (error) {
    console.error('Erro:', error);
  }
};

// ❌ Evitar
const fetchData = () => {
  return api.getData()
    .then(response => response.data)
    .catch(error => console.error('Erro:', error));
};
```

### 🧩 Separação de Responsabilidades

- **Telas**: Apenas layout e estado local
- **Componentes**: Interface e comportamento específico
- **Services**: Comunicação com APIs
- **Utils**: Funções auxiliares puras

---

## 👥 Equipe

Conheça a equipe por trás do Aurora:

| Avatar | Nome | Papel | GitHub |
|--------|------|-------|--------|
| 👨‍💻 | **Fulano Silva** | Tech Lead | [@fulano](https://github.com/fulano) |
| 👩‍💻 | **Ciclana Santos** | Frontend Developer | [@ciclano](https://github.com/ciclano) |
| 👨‍💻 | **Beltrano Costa** | Mobile Developer | [@beltrano](https://github.com/beltrano) |
| 👩‍💻 | **Ana Souza** | UI/UX Developer | [@usuario4](https://github.com/usuario4) |
| 👨‍💻 | **Carlos Lima** | Backend Integration | [@usuario5](https://github.com/usuario5) |

---

## 🤝 Contribuindo

Contribuições são sempre bem-vindas! Para contribuir:

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feat/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'feat: adicionar AmazingFeature'`)
4. Push para a branch (`git push origin feat/AmazingFeature`)
5. Abra um Pull Request

---

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

---

## 🆘 Suporte

Encontrou algum problema ou tem dúvidas?

- 🐛 **Bugs**: Abra uma [issue](https://github.com/seu-usuario/aurora/issues)
- 💬 **Discussões**: Use as [discussions](https://github.com/seu-usuario/aurora/discussions)
- 📧 **Email**: contato@aurora-app.com

---

<div align="center">

**Feito com ❤️ pela equipe Aurora**

[⬆ Voltar ao topo](#-aurora)

</div>
