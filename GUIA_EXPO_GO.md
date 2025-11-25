# 📱 Guia de Solução - Erro de Conexão Expo Go

## ❌ Problema Identificado

Você está recebendo o erro: **"Could not connect to development server"**

Identifiquei que há **dois problemas principais**:

### 1. **Dependências não instaladas** ✅ RESOLVIDO
- As dependências do client não estavam instaladas
- ✅ **Solução aplicada:** Executei `npm install` em `/client`

### 2. **Bloqueio de rede/firewall** ⚠️ PRECISA DE ATENÇÃO
- A API do Expo está retornando "Access denied"
- Isso pode ser firewall, proxy ou configuração de rede

---

## 🔧 Soluções Passo a Passo

### **SOLUÇÃO 1: Modo Web (Mais Rápido para Testar)**

Se você só quer testar o app rapidamente, use o navegador:

```bash
cd /home/user/Aurora/client
npm run web
```

Isso abrirá o app no navegador sem precisar de Expo Go.

---

### **SOLUÇÃO 2: Expo Go com LAN (Mesma Rede WiFi)**

Se você e o celular estiverem na **mesma rede WiFi**:

#### Passo 1: Descobrir o IP da sua máquina
```bash
hostname -I | awk '{print $1}'
```

Anote o IP que aparecer (ex: `192.168.1.10`)

#### Passo 2: Iniciar o servidor Expo
```bash
cd /home/user/Aurora/client
npx expo start --host lan
```

#### Passo 3: Conectar manualmente no Expo Go
1. Abra o **Expo Go** no seu celular
2. Toque em **"Enter URL manually"**
3. Digite: `exp://SEU_IP:8081`
   - Exemplo: `exp://192.168.1.10:8081`
4. Aperte Enter

---

### **SOLUÇÃO 3: Usando Emulador Android/iOS**

Se você tiver um emulador instalado:

#### Para Android:
```bash
cd /home/user/Aurora/client
npx expo start --android
```

#### Para iOS (só funciona no macOS):
```bash
cd /home/user/Aurora/client
npx expo start --ios
```

---

### **SOLUÇÃO 4: Resolver o Problema de "Access Denied"**

O erro `"Access denied"` indica que algo está bloqueando a conexão com a API do Expo.

#### Opção A: Verificar Firewall (Linux)
```bash
# Permitir porta 8081
sudo ufw allow 8081/tcp

# Verificar status
sudo ufw status
```

#### Opção B: Usar Expo sem validação de dependências
```bash
cd /home/user/Aurora/client
EXPO_NO_TELEMETRY=1 npx expo start --host lan
```

#### Opção C: Limpar cache completamente
```bash
cd /home/user/Aurora/client
npx expo start --clear --reset-cache
```

---

## 🎯 Recomendação

**Para começar AGORA:**
1. **Teste no navegador primeiro:**
   ```bash
   cd /home/user/Aurora/client
   npm run web
   ```

2. **Se quiser usar o celular:**
   - Descubra seu IP: `hostname -I | awk '{print $1}'`
   - Inicie: `npx expo start --host lan`
   - No Expo Go: Digite manualmente `exp://SEU_IP:8081`

---

## 📝 Comandos Úteis

### Ver processos do Expo rodando:
```bash
ps aux | grep expo
```

### Parar todos os processos do Expo:
```bash
pkill -f expo
```

### Limpar cache do npm:
```bash
cd /home/user/Aurora/client
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

---

## 🆘 Troubleshooting

### QR Code não aparece?
- Use a flag `--host lan` ao iniciar

### Erro "Port 8081 already in use"?
```bash
# Matar processo na porta 8081
lsof -ti:8081 | xargs kill -9
```

### Continua não funcionando?
1. Certifique-se que está na mesma rede WiFi
2. Desative firewall temporariamente para testar
3. Tente reiniciar o computador e o celular
4. Use o modo web como alternativa

---

## ✅ Checklist de Verificação

- [ ] As dependências foram instaladas? (`cd client && npm install`)
- [ ] O servidor está rodando? (`npx expo start`)
- [ ] Computador e celular estão na mesma rede WiFi?
- [ ] O firewall permite a porta 8081?
- [ ] Você consegue acessar `http://localhost:8081` no navegador?

---

**💡 Dica:** Se você só quer desenvolver/testar, use `npm run web` - é mais rápido e não precisa de celular!
