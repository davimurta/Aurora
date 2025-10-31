require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const userRoutes = require('./src/routes/userRoutes');
const postRoutes = require('./src/routes/postRoutes');
const emotionalRegisterRoutes = require('./src/routes/emotionalRegisterRoutes');
const connectionRoutes = require('./src/routes/connectionRoutes');

const { EventSystem } = require('./src/patterns/EventObserver');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(
  cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  }),
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(morgan('dev'));

const eventSystem = EventSystem.getInstance();
console.log('📡 Sistema de Eventos ativo');

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

app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

app.use('/api', userRoutes);

app.use('/api', postRoutes);

app.use('/api', emotionalRegisterRoutes);

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

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Rota não encontrada',
    path: req.path,
  });
});

app.use((err, req, res, next) => {
  console.error('❌ Erro:', err);

  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Erro interno do servidor',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
});

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

process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection:', reason);
});

process.on('uncaughtException', (error) => {
  console.error('❌ Uncaught Exception:', error);
  process.exit(1);
});

module.exports = app;
