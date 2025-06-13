# 🌅 Aurora

Projeto em React Native com Expo e TypeScript. Estrutura simples, modular e voltada para colaboração entre desenvolvedores.

---

## 🚀 Como rodar o projeto

### ⚙️ Pré-requisitos

- Node.js (v18 ou superior)
- Git
- [Expo CLI](https://expo.dev/) *(não precisa estar instalado globalmente)*

### 🔄 Clonando e rodando

```bash
git clone git@github.com:seu-usuario/aurora.git
cd aurora
npm install
npx expo start
Você pode abrir o app com o Expo Go ou emulador Android/iOS.

📂 Estrutura de Pastas
bash
Copy
Edit
src/
├── app/         # Arquivo principal (ex: src/app/index.tsx)
├── components/  # Componentes reutilizáveis
└── screens/     # Telas principais do app
📌 Padrão de Commits
Use o formato:

makefile
Copy
Edit
<tipo>: descrição
Tipos:

feat: nova funcionalidade

fix: correção de bug

docs: documentação

style: formatação (sem alteração funcional)

refactor: refatoração de código

test: adição ou alteração de testes

chore: tarefas administrativas/configurações

Exemplos:

bash
Copy
Edit
git commit -m "feat: adicionar tela de login"
git commit -m "fix: corrigir bug na navegação"
git commit -m "docs: atualizar README"
🔁 Fluxo de Desenvolvimento
Crie uma nova branch:

bash
Copy
Edit
git checkout -b feat/nome-da-feature
Faça commits objetivos e frequentes.

Suba a branch:

bash
Copy
Edit
git push origin feat/nome-da-feature
Abra um Pull Request para main.

Aguarde revisão e merge.

✅ Boas práticas
Use camelCase para arquivos, funções e variáveis.

Componentes reutilizáveis → src/components

Telas → src/screens

Lógica de navegação e inicialização → src/app

Prefira async/await a .then()

Evite lógica de negócio nas telas

Use tipagem forte com type ou interface

Comente partes importantes do código

Crie um .env com segredos, e adicione um .env.example

📦 Variáveis de Ambiente
Crie um arquivo .env na raiz:

ini
Copy
Edit
API_URL=https://suaapi.com
ENV=development
Crie também um .env.example para referência dos devs.

🛠️ Scripts úteis
bash
Copy
Edit
npm start        # Inicia o Expo
npm run android  # Abre no emulador Android
npm run ios      # Abre no emulador iOS (Mac)
npm run web      # Abre no navegador
👥 Equipe
@fulano

@ciclano

@beltrano

@usuario4

@usuario5
