#!/bin/bash

# Script para iniciar o projeto Aurora em modo desenvolvimento
# Este script roda o backend (server) e o frontend (client) simultaneamente

echo "🌅 Iniciando Aurora..."
echo ""

# Verifica se as dependências estão instaladas
if [ ! -d "client/node_modules" ]; then
    echo "📦 Instalando dependências do CLIENT..."
    cd client && npm install && cd ..
fi

if [ ! -d "server/node_modules" ]; then
    echo "📦 Instalando dependências do SERVER..."
    cd server && npm install && cd ..
fi

if [ ! -f "client/.env" ]; then
    echo "⚙️  Criando arquivo .env no client..."
    cp .env.example client/.env
    echo "✅ Arquivo client/.env criado! Configure-o se necessário."
fi

echo ""
echo "🚀 Iniciando servidores..."
echo ""
echo "📱 Frontend (client): http://localhost:19006"
echo "🖥️  Backend (server): http://localhost:3000"
echo ""
echo "Pressione Ctrl+C para parar todos os servidores"
echo ""

# Inicia o backend e o frontend em paralelo
# Usa trap para garantir que ambos sejam fechados ao pressionar Ctrl+C
trap 'kill 0' SIGINT

cd server && npm run dev &
cd client && npm run web &

wait
