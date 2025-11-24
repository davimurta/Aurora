# 🌅 Roteiro de Apresentação - Aurora
**Tempo total: 7 minutos**

---

## 📊 **1. INTRODUÇÃO** (45 segundos)

### O que é o Aurora?
- Aplicativo mobile de **saúde mental** desenvolvido em React Native
- Conecta **pacientes e psicólogos** em uma plataforma integrada
- Ferramentas de **registro emocional, acompanhamento e educação**

### Equipe
- 6 desenvolvedores da turma 3A1
- Tech stack: React Native + Expo + Firebase + Node.js

---

## 🏗️ **2. MODELAGEM DE DADOS** (1 minuto e 15 segundos)

### Principais Entidades

#### **User (Usuário)**
- **Atributos comuns:** uid, email, displayName, userType, createdAt
- **Paciente:** idade, gênero, telefone
- **Psicólogo:** CRP, especialidade, bio, isApproved (validação profissional)

#### **EmotionalRegister (Registro Emocional)**
- userId, selectedMood, moodId (1-6), intensityValue (0-100)
- diaryText (até 500 caracteres), date
- Validações robustas para garantir dados consistentes

#### **Connection (Conexão Paciente-Psicólogo)**
- Código de 6 dígitos com expiração de 24h
- Status: pending → active
- Vincula psychologistId ↔ patientId

#### **Post (Artigos do Blog)**
- title, content, excerpt, authorId
- category, tags, published, views, likes
- Criado apenas por psicólogos

### Diagrama de Classes
- Disponível no README com todas as relações e cardinalidades

---

## 🏛️ **3. ARQUITETURA DO SISTEMA** (1 minuto e 30 segundos)

### Arquitetura Cliente-Servidor

#### **Frontend (Client)**
```
React Native + Expo Router
├── TypeScript (tipagem estática)
├── Firebase Client SDK (autenticação)
├── Axios (comunicação HTTP)
└── Estrutura MVC adaptada:
    ├── Models: Definição de dados
    ├── Controllers: Lógica de negócio
    └── Views: Componentes React
```

#### **Backend (Server)**
```
Node.js + Express.js
├── Firebase Admin SDK (gestão de usuários)
├── Firestore (banco NoSQL)
├── Arquitetura em camadas:
    ├── Routes: Endpoints da API
    ├── Controllers: Orquestração
    ├── Services: Lógica de negócio
    ├── Repositories: Acesso a dados
    └── Models: Validação e transformação
```

### Fluxo de Dados
1. **Cliente** envia requisição HTTP (Axios)
2. **Firebase Auth** valida o token do usuário
3. **Express Router** direciona para o controller
4. **Service Layer** processa a lógica de negócio
5. **Repository** interage com Firestore
6. **Resposta JSON** retorna ao cliente

### Segurança
- Autenticação via Firebase Authentication
- Tokens JWT validados no backend
- Regras de segurança do Firestore
- Validação de dados em todas as camadas

---

## 🎯 **4. CASOS DE USO** (2 minutos)

### **Caso de Uso 1: Registro Emocional Diário**

**Ator:** Paciente

**Fluxo Principal:**
1. Paciente acessa a tela "Registro Diário"
2. Seleciona uma **emoção** (escala de 1 a 6: muito triste → radiante)
3. Ajusta a **intensidade** (slider 0-100%)
4. Escreve **anotação** sobre o dia (até 500 caracteres)
5. Sistema valida os dados:
   - moodId entre 1-6 ✓
   - intensityValue entre 0-100 ✓
   - diaryText obrigatório e ≤ 500 chars ✓
6. Salva no Firestore associado ao userId e data atual
7. Registro aparece no **histórico emocional** com gráficos

**Benefícios:**
- Paciente monitora padrões emocionais
- Psicólogo acessa o histórico para melhor acompanhamento
- Dados estruturados permitem análises e insights

---

### **Caso de Uso 2: Conexão Paciente-Psicólogo**

**Atores:** Psicólogo + Paciente

**Fluxo Principal:**
1. **Psicólogo** clica em "Gerar Código de Conexão"
2. Sistema cria código único de 6 dígitos
3. Código expira em 24 horas (segurança)
4. Status inicial: `pending`
5. Psicólogo compartilha o código com o paciente
6. **Paciente** insere o código na tela "Conectar com Profissional"
7. Sistema valida:
   - Código existe ✓
   - Não expirou ✓
   - Ainda não foi usado ✓
8. Vincula patientId ao connection
9. Status muda para `active`
10. Psicólogo vê o paciente na "Lista de Pacientes"
11. Psicólogo agora pode acessar o histórico emocional do paciente

**Fluxo Alternativo:**
- Se código expirado: mensagem de erro + solicitar novo código
- Se código inválido: mensagem "Código não encontrado"

**Benefícios:**
- Conexão segura e controlada
- Paciente mantém controle sobre quem acessa seus dados
- Expiração previne uso indevido

---

## 📋 **5. REQUISITOS** (1 minuto)

### Requisitos Funcionais (RF)

**RF01 - Autenticação**
- Login e cadastro diferenciado para Paciente e Psicólogo
- Validação de CRP para psicólogos

**RF02 - Registro Emocional**
- Pacientes registram humor, intensidade e anotações diárias
- Histórico visual com gráficos

**RF03 - Conexão**
- Sistema de códigos para vincular paciente-psicólogo
- Psicólogo acessa dados apenas de pacientes conectados

**RF04 - Blog Educativo**
- Psicólogos publicam artigos com tags e categorias
- Todos os usuários podem ler

**RF05 - Exercícios de Bem-estar**
- Atividade de respiração guiada
- Recursos diários

### Requisitos Não-Funcionais (RNF)

**RNF01 - Segurança**
- Criptografia de dados em trânsito (HTTPS)
- Autenticação JWT
- Firestore Rules protegem acesso aos dados

**RNF02 - Desempenho**
- Tempo de resposta da API < 2 segundos
- App mobile responsivo em 60fps

**RNF03 - Usabilidade**
- Interface intuitiva para diferentes perfis
- Acessibilidade (contraste, tamanho de fonte)

**RNF04 - Escalabilidade**
- Firebase/Firestore suporta crescimento horizontal
- Arquitetura preparada para milhares de usuários

**RNF05 - Disponibilidade**
- Uptime de 99%+ (Firebase)
- Sistema offline-first (dados em cache)

---

## ⚖️ **6. TERMOS ÉTICOS E PRIVACIDADE** (1 minuto e 15 segundos)

### Dados Sensíveis de Saúde Mental

**⚠️ Natureza dos Dados:**
- Informações sobre **estado emocional** (dados sensíveis segundo LGPD)
- Relação terapêutica paciente-psicólogo
- Conteúdo de diários pessoais e reflexões íntimas

### Conformidade com LGPD (Lei Geral de Proteção de Dados)

**1. Princípios Aplicados:**
- **Finalidade:** Dados usados APENAS para acompanhamento terapêutico
- **Necessidade:** Coletamos apenas o mínimo necessário
- **Transparência:** Usuário sabe quem acessa seus dados
- **Segurança:** Criptografia e controle de acesso

**2. Consentimento Explícito:**
- Paciente aceita termos ao criar conta
- Conexão com psicólogo requer ação ativa do paciente
- Pode revogar acesso a qualquer momento

**3. Direitos do Titular:**
- **Acesso:** Paciente vê todos seus dados
- **Correção:** Pode editar registros
- **Exclusão:** Pode deletar conta e dados (direito ao esquecimento)
- **Portabilidade:** Pode exportar histórico

### Segurança Implementada

**Controle de Acesso:**
```javascript
// Psicólogo só acessa dados de pacientes conectados
if (connection.status !== 'active') {
  return { error: 'Sem permissão' };
}

// Validação em múltiplas camadas
- Frontend (UX)
- Backend (segurança)
- Firestore Rules (última barreira)
```

**Proteção de Dados:**
- Senhas hasheadas (Firebase Auth)
- Tokens JWT com expiração
- HTTPS obrigatório
- Firestore Rules impedem acesso direto não autorizado

### Ética Profissional

**Código de Ética do Psicólogo:**
- CRP validado no cadastro (isApproved)
- Dados do paciente confidenciais
- Sistema não substitui atendimento presencial
- Ferramenta de APOIO ao tratamento

**Transparência:**
- Paciente sabe que psicólogo pode ver registros
- Consentimento informado
- Sem venda de dados a terceiros
- Sem uso para publicidade

### Limitações e Responsabilidades

**O Aurora NÃO é:**
- ❌ Substituto para terapia presencial
- ❌ Ferramenta de diagnóstico médico
- ❌ Atendimento emergencial (crises)

**O Aurora É:**
- ✅ Ferramenta complementar ao tratamento
- ✅ Diário emocional estruturado
- ✅ Canal de acompanhamento entre sessões
- ✅ Plataforma educativa

---

## 🎬 **7. CONCLUSÃO** (15 segundos)

### Resumo
- **Modelagem:** 4 entidades principais (User, EmotionalRegister, Connection, Post)
- **Arquitetura:** Cliente-servidor com Firebase + Node.js
- **Casos de uso:** Registro emocional + Conexão paciente-psicólogo
- **Requisitos:** 5 RF + 5 RNF atendidos
- **Ética:** LGPD, consentimento, segurança e transparência

### Impacto
🌅 **Aurora: Cuidando da saúde mental através da tecnologia**

---

## 📝 Dicas de Apresentação

### Distribuição do Tempo:
1. **Introdução:** 45s
2. **Modelagem:** 1min 15s
3. **Arquitetura:** 1min 30s
4. **Casos de Uso:** 2min
5. **Requisitos:** 1min
6. **Ética:** 1min 15s
7. **Conclusão:** 15s

**Total: 7 minutos**

### Recursos Visuais Recomendados:
- Slide 1: Logo + título "Aurora"
- Slide 2: Diagrama de classes (já disponível no README)
- Slide 3: Arquitetura cliente-servidor (diagrama de blocos)
- Slide 4: Fluxo do Caso de Uso 1 (screenshots ou wireframes)
- Slide 5: Fluxo do Caso de Uso 2 (diagrama de sequência)
- Slide 6: Tabela de requisitos
- Slide 7: Ícones LGPD + segurança

### Pontos de Destaque:
- 💡 **Diferencial:** Sistema de conexão controlado pelo paciente
- 💡 **Segurança:** Múltiplas camadas de validação
- 💡 **Ética:** Conformidade LGPD + Código de Ética do CFP
- 💡 **Escalabilidade:** Arquitetura preparada para crescimento

---

**Boa apresentação! 🚀**
