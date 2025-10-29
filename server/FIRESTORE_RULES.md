# 🔒 Configuração das Regras do Firestore

## Problema

Você está recebendo o erro: **"Missing or insufficient permissions"**

Isso acontece porque o Firebase Client SDK (diferente do Admin SDK) respeita as regras de segurança do Firestore.

---

## Solução Rápida (Modo Desenvolvimento)

### 1. Acesse o Firebase Console

Abra seu navegador e vá para:
```
https://console.firebase.google.com/project/aurora-482f9/firestore
```

### 2. Vá para "Rules"

No menu lateral, clique em **"Rules"** (Regras)

### 3. Cole as Regras Abaixo

**OPÇÃO 1: Modo Desenvolvimento (acesso total - USE APENAS PARA TESTES)**

```javascript
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {
    // Permite leitura e escrita em TODOS os documentos
    match /{document=**} {
      allow read, write: true;
    }
  }
}
```

⚠️ **ATENÇÃO**: Essas regras permitem acesso total ao banco. Use apenas para desenvolvimento/testes!

---

**OPÇÃO 2: Regras de Produção (recomendado)**

```javascript
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {

    // Coleção de usuários
    match /users/{userId} {
      // Qualquer um pode criar um usuário (para registro)
      allow create: if true;

      // Apenas o próprio usuário pode ler/atualizar seus dados
      allow read, update, delete: if request.auth != null && request.auth.uid == userId;

      // Admins podem ler todos os usuários
      allow read: if request.auth != null &&
                     get(/databases/$(database)/documents/users/$(request.auth.uid)).data.userType == 'admin';
    }

    // Coleção de posts
    match /posts/{postId} {
      // Qualquer um pode ler posts publicados
      allow read: if resource.data.published == true;

      // Apenas psicólogos autenticados podem criar posts
      allow create: if request.auth != null &&
                       get(/databases/$(database)/documents/users/$(request.auth.uid)).data.userType == 'psicologo';

      // Apenas o autor pode atualizar/deletar seus posts
      allow update, delete: if request.auth != null &&
                               request.auth.uid == resource.data.authorId;
    }

    // Coleção de registros emocionais
    match /emotionalRegisters/{registerId} {
      // Apenas o proprietário pode ler/criar/atualizar seus registros
      allow read, create, update: if request.auth != null &&
                                     request.auth.uid == resource.data.userId;
    }
  }
}
```

### 4. Clique em "Publish" (Publicar)

---

## Por que isso é necessário?

| Firebase Admin SDK | Firebase Client SDK |
|-------------------|-------------------|
| ✅ Acesso irrestrito | ❌ Respeita regras de segurança |
| ✅ Funciona no servidor | ✅ Funciona no servidor e navegador |
| ❌ Precisa service account | ✅ Usa credenciais simples |
| ❌ Problemas de permissão IAM | ✅ Sem problemas de IAM |

Com o **Client SDK**, você tem segurança integrada através das regras do Firestore!

---

## Como Testar

Após configurar as regras, reinicie o servidor e teste novamente:

```bash
# No terminal do servidor
# Pressione Ctrl+C para parar
npm run dev

# Em outro terminal, teste o registro
curl -X POST http://localhost:3000/api/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "teste@aurora.com",
    "password": "senha123456",
    "displayName": "Usuário Teste",
    "userType": "paciente",
    "idade": 25,
    "telefone": "11999999999"
  }'
```

---

## Dica de Desenvolvimento

Durante o desenvolvimento, use as **regras abertas** (OPÇÃO 1).

Antes de colocar em produção, configure as **regras seguras** (OPÇÃO 2).

---

## Mais Informações

Documentação oficial: https://firebase.google.com/docs/firestore/security/get-started
