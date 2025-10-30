/**
 * Aurora Backend Server
 *
 * Servidor Node.js + Express para o aplicativo Aurora
 *
 * Arquitetura: MVC com Repository Pattern
 *
 * Padrões GoF Implementados:
 * 1. Singleton - Conexão Firebase (firebase.js)
 * 2. Repository - Acesso a dados (UserRepository, PostRepository)
 * 3. Factory - Criação de usuários (UserFactory)
 * 4. Strategy - Estratégias de autenticação (AuthStrategy)
 * 5. Observer - Sistema de eventos (EventObserver)
 */

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

// Importa rotas
const userRoutes = require('./src/routes/userRoutes');
const postRoutes = require('./src/routes/postRoutes');
const emotionalRegisterRoutes = require('./src/routes/emotionalRegisterRoutes');
const connectionRoutes = require('./src/routes/connectionRoutes');

// Importa sistema de eventos (Observer Pattern)
const { EventSystem } = require('./src/patterns/EventObserver');

// Inicializa Express
const app = express();
const PORT = process.env.PORT || 3000;

// ==========================================
// MIDDLEWARES
// ==========================================

// CORS - Permite requisições do frontend
app.use(
  cors({
    origin: '*', // Em produção, especificar domínios permitidos
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  }),
);

// Parser de JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logger de requisições
app.use(morgan('dev'));

// ==========================================
// INICIALIZAÇÃO
// ==========================================

// Inicializa sistema de eventos (Observer Pattern + Singleton)
const eventSystem = EventSystem.getInstance();
console.log('📡 Sistema de Eventos ativo');

// ==========================================
// ROTAS
// ==========================================

// Rota de health check
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: '🚀 Aurora Backend API está funcionando!',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    patterns: [
      'Singleton (Firebase Connection)',
      'Repository (Data Access)',
      'Factory (User Creation)',
      'Strategy (Authentication)',
      'Observer (Event System)',
    ],
  });
});

// Rota de status
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

// Importa rotas de usuários
app.use('/api', userRoutes);

// Importa rotas de posts
app.use('/api', postRoutes);

// Importa rotas de registros emocionais
app.use('/api', emotionalRegisterRoutes);

// Importa rotas de conexões
console.log('🔍 Carregando rotas de conexão...');
try {
  app.use('/api/connections', connectionRoutes);
  console.log('✅ Rotas de conexão carregadas com sucesso!');
  console.log('   POST /api/connections/generate');
  console.log('   POST /api/connections/connect');
  console.log('   GET  /api/connections/psychologist/:id/patients');
  console.log('   GET  /api/connections/patient/:id/psychologist');
  console.log('   GET  /api/connections/patient/:id/registers');
} catch (error) {
  console.error('❌ Erro ao carregar rotas de conexão:', error.message);
}

// ==========================================
// TRATAMENTO DE ERROS
// ==========================================

// Rota não encontrada
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Rota não encontrada',
    path: req.path,
  });
});

// Handler de erros global
app.use((err, req, res, next) => {
  console.error('❌ Erro:', err);

  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Erro interno do servidor',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
});

// ==========================================
// INICIALIZAÇÃO DO SERVIDOR
// ==========================================

app.listen(PORT, () => {
  console.log('\n================================================');
  console.log('🚀 Aurora Backend Server');
  console.log('================================================');
  console.log(`📍 Servidor rodando em: http://localhost:${PORT}`);
  console.log(`🌐 API disponível em: http://localhost:${PORT}/api`);
  console.log(`📚 Health check: http://localhost:${PORT}/health`);
  console.log('================================================\n');

  console.log('📋 Padrões GoF Implementados:');
  console.log('  1️⃣  Singleton - Firebase Connection');
  console.log('  2️⃣  Repository - Data Access Layer');
  console.log('  3️⃣  Factory - User Factory');
  console.log('  4️⃣  Strategy - Authentication Strategies');
  console.log('  5️⃣  Observer - Event System\n');

  console.log('📡 Rotas disponíveis:');
  console.log('  POST   /api/register');
  console.log('  POST   /api/login');
  console.log('  POST   /api/logout');
  console.log('  POST   /api/reset-password');
  console.log('  GET    /api/users/:id');
  console.log('  GET    /api/psychologists');
  console.log('  POST   /api/psychologists/:id/approve');
  console.log('  GET    /api/posts');
  console.log('  GET    /api/posts/:id');
  console.log('  POST   /api/posts');
  console.log('  PUT    /api/posts/:id');
  console.log('  DELETE /api/posts/:id');
  console.log('  POST   /api/posts/:id/publish');
  console.log('  POST   /api/posts/:id/like');
  console.log('  GET    /api/registers/:userId');
  console.log('  GET    /api/registers/:userId/month/:year/:month');
  console.log('  GET    /api/registers/:userId/date/:date');
  console.log('  POST   /api/registers');
  console.log('  DELETE /api/registers/:userId/date/:date\n');
});

// Tratamento de erros não capturados
process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection:', reason);
});

process.on('uncaughtException', (error) => {
  console.error('❌ Uncaught Exception:', error);
  process.exit(1);
});

module.exports = app;
