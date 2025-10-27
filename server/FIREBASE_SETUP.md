# 🔥 Configuração do Firebase Admin SDK

## ⚠️ IMPORTANTE: Diferença entre Client SDK e Admin SDK

As credenciais que você forneceu são do **Firebase Client SDK** (usadas no frontend):
```javascript
const firebaseConfig = {
  apiKey: "AIzaSyDeABR2p5kDU7pYXW_VhzPxTki85F0vl04",
  authDomain: "aurora-login-f8398.firebaseapp.com",
  projectId: "aurora-login-f8398",
  // ...
};
```

O **backend precisa do Firebase Admin SDK**, que usa credenciais diferentes (Service Account).

---

## 📥 Como obter o Service Account Key

### Passo 1: Acesse o Firebase Console

1. Vá para: https://console.firebase.google.com/
2. Selecione o projeto **aurora-login-f8398**

### Passo 2: Acesse as Configurações do Projeto

1. Clique no ícone de **engrenagem ⚙️** ao lado de "Project Overview"
2. Clique em **"Project settings"** (Configurações do projeto)

### Passo 3: Vá para Service Accounts

1. Clique na aba **"Service accounts"** no topo
2. Você verá a opção **"Firebase Admin SDK"**

### Passo 4: Gere a Chave Privada

1. Clique no botão **"Generate new private key"** (Gerar nova chave privada)
2. Uma janela de confirmação aparecerá
3. Clique em **"Generate key"**
4. Um arquivo JSON será baixado automaticamente

### Passo 5: Salve o arquivo no projeto

1. Renomeie o arquivo baixado para `serviceAccountKey.json`
2. Mova o arquivo para a pasta `/server` do projeto:
   ```
   Aurora/
   └── server/
       ├── serviceAccountKey.json  ← Coloque aqui
       ├── app.js
       ├── package.json
       └── ...
   ```

### Passo 6: Configure a variável de ambiente

Abra o arquivo `/server/.env` e descomente/adicione a linha:

```env
# Descomente esta linha:
GOOGLE_APPLICATION_CREDENTIALS=./serviceAccountKey.json
```

---

## ✅ Verificação

Após configurar, o arquivo `.env` deve estar assim:

```env
# Server Configuration
PORT=3000
NODE_ENV=development

# Firebase Configuration (Client SDK)
FIREBASE_API_KEY=AIzaSyDeABR2p5kDU7pYXW_VhzPxTki85F0vl04
FIREBASE_AUTH_DOMAIN=aurora-login-f8398.firebaseapp.com
FIREBASE_PROJECT_ID=aurora-login-f8398
FIREBASE_STORAGE_BUCKET=aurora-login-f8398.firebasestorage.app
FIREBASE_MESSAGING_SENDER_ID=13804949485
FIREBASE_APP_ID=1:13804949485:web:a90e834dfc5282b59ae1e4
FIREBASE_MEASUREMENT_ID=G-4QQW10Y38H

# Firebase Admin SDK (IMPORTANTE!)
GOOGLE_APPLICATION_CREDENTIALS=./serviceAccountKey.json
```

---

## 🚀 Inicie o servidor

```bash
cd server
npm install
npm run dev
```

Se tudo estiver correto, você verá:

```
🔑 Usando Service Account Key
✅ Firebase conectado com sucesso (Singleton Pattern)
📋 Project ID: aurora-login-f8398
```

---

## 🔒 Segurança

**⚠️ NUNCA faça commit do arquivo `serviceAccountKey.json`!**

O arquivo `.gitignore` já está configurado para ignorá-lo:

```gitignore
# Firebase credentials
serviceAccountKey.json
```

---

## 🆘 Troubleshooting

### Erro: "GOOGLE_APPLICATION_CREDENTIALS not found"
- Verifique se o caminho está correto no `.env`
- Certifique-se de que o arquivo `serviceAccountKey.json` está na pasta `/server`

### Erro: "Permission denied"
- Verifique se o Service Account tem as permissões necessárias no Firebase Console
- Acesse: Firebase Console > Project Settings > Service Accounts > Permissions

### Aviso: "Rodando sem credenciais completas"
- O servidor rodará, mas algumas funcionalidades podem não funcionar
- Baixe o Service Account Key para funcionamento completo

---

## 📚 Mais Informações

- [Documentação Firebase Admin SDK](https://firebase.google.com/docs/admin/setup)
- [Service Accounts no Google Cloud](https://cloud.google.com/iam/docs/service-accounts)

---

**Desenvolvido pela Equipe Aurora** ❤️
