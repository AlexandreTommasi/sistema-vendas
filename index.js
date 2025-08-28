const express = require('express');
const sql = require('mssql');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Database configuration
const dbConfig = {
    server: process.env.DATABASE_SERVER,
    database: process.env.DATABASE_NAME,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    pool: { 
        max: 10, 
        min: 0, 
        idleTimeoutMillis: 30000 
    },
    options: { 
        encrypt: true, 
        trustServerCertificate: false 
    }
};

let pool;

// Connect to database
async function connectDB() {
    try {
        pool = await sql.connect(dbConfig);
        console.log('✅ Connected to Azure SQL Database');
        return true;
    } catch (err) {
        console.error('❌ Database connection error:', err.message);
        return false;
    }
}

// Routes
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

app.get('/api/status', async (req, res) => {
    const isConnected = pool && pool.connected;
    res.json({ 
        status: 'online',
        app: 'Sistema de Vendas',
        database: isConnected ? 'conectado' : 'desconectado',
        server: process.env.DATABASE_SERVER || 'not configured',
        timestamp: new Date().toISOString()
    });
});

// Vendas endpoints
app.get('/api/vendas', async (req, res) => {
    try {
        if (!pool || !pool.connected) {
            await connectDB();
        }
        const result = await pool.request()
            .query(`SELECT v.*, c.nome as cliente_nome, p.nome as produto_nome 
                    FROM vendas v
                    LEFT JOIN clientes c ON v.cliente_id = c.id
                    LEFT JOIN produtos p ON v.produto_id = p.id
                    ORDER BY v.data_venda DESC`);
        res.json(result.recordset);
    } catch (err) {
        console.error('Error fetching sales:', err);
        res.status(500).json({ error: 'Erro ao buscar vendas' });
    }
});

app.post('/api/vendas', async (req, res) => {
    try {
        const { cliente_id, produto_id, quantidade, valor_total } = req.body;
        if (!pool || !pool.connected) {
            await connectDB();
        }
        const result = await pool.request()
            .input('cliente_id', sql.Int, cliente_id)
            .input('produto_id', sql.Int, produto_id)
            .input('quantidade', sql.Int, quantidade)
            .input('valor_total', sql.Decimal(10, 2), valor_total)
            .query(`INSERT INTO vendas (cliente_id, produto_id, quantidade, valor_total, data_venda) 
                    OUTPUT INSERTED.* 
                    VALUES (@cliente_id, @produto_id, @quantidade, @valor_total, GETDATE())`);
        res.json(result.recordset[0]);
    } catch (err) {
        console.error('Error creating sale:', err);
        res.status(500).json({ error: 'Erro ao criar venda' });
    }
});

// Clientes endpoints
app.get('/api/clientes', async (req, res) => {
    try {
        if (!pool || !pool.connected) {
            await connectDB();
        }
        const result = await pool.request().query('SELECT * FROM clientes ORDER BY nome');
        res.json(result.recordset);
    } catch (err) {
        console.error('Error fetching clients:', err);
        res.status(500).json({ error: 'Erro ao buscar clientes' });
    }
});

app.post('/api/clientes', async (req, res) => {
    try {
        const { nome, email, telefone, cpf } = req.body;
        if (!pool || !pool.connected) {
            await connectDB();
        }
        const result = await pool.request()
            .input('nome', sql.NVarChar, nome)
            .input('email', sql.NVarChar, email)
            .input('telefone', sql.NVarChar, telefone)
            .input('cpf', sql.NVarChar, cpf)
            .query(`INSERT INTO clientes (nome, email, telefone, cpf) 
                    OUTPUT INSERTED.* 
                    VALUES (@nome, @email, @telefone, @cpf)`);
        res.json(result.recordset[0]);
    } catch (err) {
        console.error('Error creating client:', err);
        res.status(500).json({ error: 'Erro ao criar cliente' });
    }
});

// Produtos endpoints
app.get('/api/produtos', async (req, res) => {
    try {
        if (!pool || !pool.connected) {
            await connectDB();
        }
        const result = await pool.request().query('SELECT * FROM produtos WHERE ativo = 1 ORDER BY nome');
        res.json(result.recordset);
    } catch (err) {
        console.error('Error fetching products:', err);
        res.status(500).json({ error: 'Erro ao buscar produtos' });
    }
});

app.post('/api/produtos', async (req, res) => {
    try {
        const { nome, descricao, preco, estoque, categoria } = req.body;
        if (!pool || !pool.connected) {
            await connectDB();
        }
        const result = await pool.request()
            .input('nome', sql.NVarChar, nome)
            .input('descricao', sql.NVarChar, descricao)
            .input('preco', sql.Decimal(10, 2), preco)
            .input('estoque', sql.Int, estoque)
            .input('categoria', sql.NVarChar, categoria)
            .query(`INSERT INTO produtos (nome, descricao, preco, estoque, categoria, ativo) 
                    OUTPUT INSERTED.* 
                    VALUES (@nome, @descricao, @preco, @estoque, @categoria, 1)`);
        res.json(result.recordset[0]);
    } catch (err) {
        console.error('Error creating product:', err);
        res.status(500).json({ error: 'Erro ao criar produto' });
    }
});

// Dashboard metrics
app.get('/api/dashboard', async (req, res) => {
    try {
        if (!pool || !pool.connected) {
            await connectDB();
        }
        
        const [vendas, clientes, produtos, vendas_hoje] = await Promise.all([
            pool.request().query('SELECT COUNT(*) as total, SUM(valor_total) as valor FROM vendas'),
            pool.request().query('SELECT COUNT(*) as total FROM clientes'),
            pool.request().query('SELECT COUNT(*) as total FROM produtos WHERE ativo = 1'),
            pool.request().query(`SELECT COUNT(*) as total, SUM(valor_total) as valor 
                                 FROM vendas 
                                 WHERE CAST(data_venda as DATE) = CAST(GETDATE() as DATE)`)
        ]);
        
        res.json({
            vendas_total: vendas.recordset[0].total,
            vendas_valor: vendas.recordset[0].valor || 0,
            clientes_total: clientes.recordset[0].total,
            produtos_total: produtos.recordset[0].total,
            vendas_hoje: vendas_hoje.recordset[0].total,
            vendas_hoje_valor: vendas_hoje.recordset[0].valor || 0
        });
    } catch (err) {
        console.error('Error fetching dashboard:', err);
        res.status(500).json({ error: 'Erro ao buscar dashboard' });
    }
});

const PORT = process.env.PORT || 3000;

connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`🚀 Server running on port ${PORT}`);
        console.log(`📊 Sistema de Vendas - API Ready`);
        console.log(`🌐 Environment: ${process.env.NODE_ENV || 'development'}`);
    });
});