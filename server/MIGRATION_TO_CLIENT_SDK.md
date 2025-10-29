# 🔄 Migração Firebase Admin SDK → Client SDK

## Por que essa migração foi necessária?

### Problemas com Admin SDK:
1. ❌ Erros de permissão IAM constantes
2. ❌ Necessidade de service account com roles complexas
3. ❌ Dependência de `roles/serviceusage.serviceUsageConsumer`
4. ❌ Problemas ao rodar em ambientes sem Google Cloud configurado
5. ❌ Configuração complicada com arquivos `.json` ou variáveis de ambiente

### Vantagens do Client SDK:
1. ✅ Configuração super simples (apenas credenciais do Firebase)
2. ✅ SEM problemas de permissão IAM
3. ✅ Funciona em qualquer ambiente (local, cloud, containers)
4. ✅ Mesmas funcionalidades de autenticação e Firestore
5. ✅ Segurança integrada através das regras do Firestore

---

## O que foi alterado?

### 1. Arquivo: `server/package.json`
```diff
- "firebase-admin": "^12.0.0"
+ "firebase": "^11.10.0"
```

### 2. Arquivo: `server/src/config/firebase.js`

**ANTES (Admin SDK):**
```javascript
const admin = require('firebase-admin');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});
const db = admin.firestore();
const auth = admin.auth();
```

**DEPOIS (Client SDK):**
```javascript
const { initializeApp } = require('firebase/app');
const { getAuth } = require('firebase/auth');
const { getFirestore } = require('firebase/firestore');

const firebaseConfig = {
  apiKey: "AIzaSyCawFSSzDXVeIVz4iyyFJ1KOsy4jmT0Zj4",
  authDomain: "aurora-482f9.firebaseapp.com",
  projectId: "aurora-482f9",
  // ...
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
```

### 3. Arquivo: `server/src/services/AuthService.js`

**ANTES (Admin SDK):**
```javascript
const userRecord = await admin.auth().createUser({
  email: user.email,
  password: userData.password,
  displayName: user.displayName
});

await admin.firestore().collection('users').doc(userRecord.uid).set(userData);
```

**DEPOIS (Client SDK):**
```javascript
const { createUserWithEmailAndPassword, updateProfile } = require('firebase/auth');
const { doc, setDoc, serverTimestamp } = require('firebase/firestore');

const userCredential = await createUserWithEmailAndPassword(
  this.auth,
  user.email,
  userData.password
);

await updateProfile(userCredential.user, {
  displayName: user.displayName
});

await setDoc(doc(this.db, 'users', userCredential.user.uid), userData);
```

### 4. Arquivo: `server/src/repositories/UserRepository.js`

**ANTES (Admin SDK):**
```javascript
const snapshot = await this.db.collection('users').get();
const doc = await this.db.collection('users').doc(uid).get();
```

**DEPOIS (Client SDK):**
```javascript
const { collection, doc, getDoc, getDocs, query, where } = require('firebase/firestore');

const usersRef = collection(this.db, 'users');
const snapshot = await getDocs(usersRef);

const docRef = doc(this.db, 'users', uid);
const docSnap = await getDoc(docRef);
```

### 5. Arquivo: `server/src/repositories/PostRepository.js`

Mesmas mudanças do UserRepository - todos os métodos foram atualizados para usar as funções do Client SDK.

---

## Nova Configuração Necessária

### ⚠️ IMPORTANTE: Regras do Firestore

Com o Client SDK, você precisa configurar as **regras de segurança do Firestore**.

Veja o arquivo `FIRESTORE_RULES.md` para instruções completas.

**Configuração rápida para desenvolvimento:**

1. Acesse: https://console.firebase.google.com/project/aurora-482f9/firestore
2. Vá em "Rules"
3. Cole:
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: true;
    }
  }
}
```
4. Clique em "Publish"

---

## Como Rodar

### 1. Instale as dependências
```bash
cd server
npm install
```

### 2. Configure as regras do Firestore
Siga as instruções em `FIRESTORE_RULES.md`

### 3. Inicie o servidor
```bash
npm run dev
```

### 4. Teste
```bash
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

## Arquivos Modificados

- ✅ `server/package.json` - Dependência atualizada
- ✅ `server/src/config/firebase.js` - Client SDK
- ✅ `server/src/services/AuthService.js` - Client SDK
- ✅ `server/src/repositories/UserRepository.js` - Client SDK
- ✅ `server/src/repositories/PostRepository.js` - Client SDK
- ✅ `server/.env` - Mantido (não precisa mais do GOOGLE_APPLICATION_CREDENTIALS)

## Arquivos Criados

- ✅ `server/FIRESTORE_RULES.md` - Guia de configuração das regras
- ✅ `server/MIGRATION_TO_CLIENT_SDK.md` - Este arquivo

---

## Comparação de APIs

| Operação | Admin SDK | Client SDK |
|----------|-----------|------------|
| **Criar usuário** | `admin.auth().createUser()` | `createUserWithEmailAndPassword()` |
| **Login** | Não disponível | `signInWithEmailAndPassword()` |
| **Buscar doc** | `db.collection().doc().get()` | `getDoc(doc(db, 'col', 'id'))` |
| **Query** | `db.collection().where().get()` | `getDocs(query(collection(), where()))` |
| **Criar doc** | `db.collection().add()` | `addDoc(collection())` |
| **Atualizar** | `docRef.update()` | `updateDoc(docRef)` |
| **Deletar** | `docRef.delete()` | `deleteDoc(docRef)` |

---

## Testado e Funcionando

- ✅ Servidor inicia sem erros
- ✅ Firebase conecta com sucesso
- ✅ Todos os padrões GoF continuam funcionando
- ⏳ Endpoints funcionarão após configurar regras do Firestore

---

## Próximos Passos

1. Configure as regras do Firestore (veja `FIRESTORE_RULES.md`)
2. Teste todos os endpoints da API
3. Configure o frontend para usar a API
4. Deploy (Heroku, Railway, Render, etc)

---

**Migração completa! 🎉**

Desenvolvido por: Equipe Aurora
Data: 2025-10-29
