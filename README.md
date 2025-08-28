# Sistema de Vendas

Sistema completo de vendas com gerenciamento de clientes, produtos e dashboard.

## 🚀 Instalação

```bash
# Instalar dependências
npm install

# Configurar variáveis de ambiente
cp .env.example .env
# Editar .env com suas credenciais do banco
```

## 📝 Scripts Disponíveis

```bash
# Iniciar em produção
npm start

# Desenvolvimento
npm run dev

# Build (se necessário)
npm run build

# Testes
npm test
```

## 🔧 Configuração

### Variáveis de Ambiente

O arquivo `.env` já está configurado com:
- Servidor SQL Azure
- Credenciais do banco
- Porta da aplicação

## 📦 Estrutura do Projeto

```
sistema-vendas/
├── index.js          # Arquivo principal da API
├── package.json      # Dependências e scripts
├── .env             # Variáveis de ambiente (configurado)
├── .env.example     # Template de variáveis
├── .gitignore       # Arquivos ignorados pelo git
├── README.md        # Documentação
├── public/          # Interface web
│   └── index.html   # Dashboard completo
└── database/        # Scripts SQL
    ├── schema.sql   # Tabelas: clientes, produtos, vendas
    └── seed.sql     # Dados iniciais (10 clientes, 15 produtos, 8 vendas)
```

## 🌐 Endpoints da API

### Dashboard
- `GET /api/dashboard` - Métricas gerais

### Vendas
- `GET /api/vendas` - Listar vendas
- `POST /api/vendas` - Registrar nova venda

### Clientes  
- `GET /api/clientes` - Listar clientes
- `POST /api/clientes` - Cadastrar cliente

### Produtos
- `GET /api/produtos` - Listar produtos
- `POST /api/produtos` - Cadastrar produto

### Status
- `GET /api/status` - Status da aplicação e banco

## 💻 Interface Web

Dashboard completo com:
- 📊 Métricas em tempo real
- 💰 Registro de vendas
- 👥 Gestão de clientes
- 📦 Gestão de produtos
- 📈 Histórico de vendas

## 🚀 Deploy no Azure

Este projeto está pronto para deploy no Azure App Service.
**Não precisa de web.config** - Azure detecta automaticamente Node.js.

## 📄 Licença

ISC