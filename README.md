# Aurora

Aplicativo mobile de saúde mental que conecta pacientes e psicólogos, feito com React Native, Expo e TypeScript.

## Sobre o projeto

O Aurora foi desenvolvido como projeto de conclusão do curso técnico, na disciplina de **PITCH**, no Cotemig (turma 3A1).

A ideia é simples: dar ao paciente um espaço para registrar como ele está se sentindo no dia a dia, e dar ao psicólogo uma forma de acompanhar esses registros entre uma sessão e outra. Além disso, o app tem um blog onde os profissionais publicam conteúdo sobre saúde mental.

Foi o nosso primeiro projeto com esse tamanho, feito em grupo e com front e back separados. Aprendemos bastante sobre arquitetura, autenticação, trabalho em equipe e fluxo com Git, mas ainda estávamos em fase de aprendizado. Por isso, o código tem pontos que hoje seriam feitos de outra forma, e o projeto deve ser visto como um registro dessa etapa, não como um produto finalizado.

## O que o app faz

**Para pacientes**

- Registro diário de humor, pensamentos e anotações
- Escala de emoções e histórico emocional
- Exercício guiado de respiração
- Conexão com o psicólogo por meio de um código

**Para psicólogos**

- Lista de pacientes conectados
- Acesso ao registro emocional de cada paciente
- Geração de código de conexão
- Publicação de artigos no blog, com tags e formatação de texto

**Para todos**

- Login e cadastro com interface diferente para cada tipo de usuário
- Leitura do blog

## Tecnologias

| Camada               | Tecnologias                                  |
| -------------------- | -------------------------------------------- |
| Frontend             | React Native, Expo Router, TypeScript, Axios |
| Backend              | Node.js, Express                             |
| Dados e autenticação | Firebase Auth e Firestore                    |

## Estrutura

```
aurora/
├── client/   # App React Native + Expo
├── server/   # API Express + Firebase Admin
└── .env.example
```

### Diagrama de classes

<img width="1300" height="3540" alt="Diagrama de classes do Aurora" src="https://github.com/user-attachments/assets/eb7e72f7-1dbc-4fea-8115-f89749ec694f" />

## Como rodar

Você vai precisar de Node.js 18+, Git e um projeto no Firebase.

```bash
# 1. Clonar
git clone git@github.com:seu-usuario/aurora.git
cd aurora

# 2. Variáveis de ambiente
cp .env.example .env
# preencha o .env com as chaves do seu projeto Firebase

# 3. Backend
cd server
npm install
npm run dev

# 4. Frontend (em outro terminal)
cd client
npm install
npm start        # Expo (mobile)
# ou
npm run web      # navegador
```

Para abrir no celular, escaneie o QR code com o app Expo Go.

> Nunca suba o arquivo `.env` para o repositório.

## Equipe

Turma 3A1, Cotemig.

| Nome            | Papel          | GitHub                                           |
| --------------- | -------------- | ------------------------------------------------ |
| Davi Murta      | Tech Lead      | [@davimurta](https://github.com/davimurta)       |
| Sara Freitas    | UI/UX Designer | [@sahfreitas](https://github.com/sahfreitas)     |
| Maria Fernanda  | Full Stack     | [@mafemelo](https://github.com/mafemelo)         |
| Samuel Cordeiro | Backend        | [@sam-cordeiro](https://github.com/sam-cordeiro) |
| João Pedro      | Backend        | [@jpfgomes](https://github.com/jpfgomes)         |
| Ronan Porto     | Frontend       | [@RonanPorto](https://github.com/RonanPorto)     |
