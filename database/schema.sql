-- Tabela de Clientes
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='clientes' AND xtype='U')
BEGIN
    CREATE TABLE clientes (
        id INT IDENTITY(1,1) PRIMARY KEY,
        nome NVARCHAR(200) NOT NULL,
        email NVARCHAR(200) UNIQUE NOT NULL,
        telefone NVARCHAR(20),
        cpf NVARCHAR(14),
        data_cadastro DATETIME DEFAULT GETDATE()
    );
    PRINT 'Tabela clientes criada com sucesso';
END

GO

-- Tabela de Produtos
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='produtos' AND xtype='U')
BEGIN
    CREATE TABLE produtos (
        id INT IDENTITY(1,1) PRIMARY KEY,
        nome NVARCHAR(200) NOT NULL,
        descricao NVARCHAR(500),
        categoria NVARCHAR(100),
        preco DECIMAL(10, 2) NOT NULL,
        estoque INT NOT NULL DEFAULT 0,
        ativo BIT DEFAULT 1,
        data_cadastro DATETIME DEFAULT GETDATE()
    );
    PRINT 'Tabela produtos criada com sucesso';
END

GO

-- Tabela de Vendas
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='vendas' AND xtype='U')
BEGIN
    CREATE TABLE vendas (
        id INT IDENTITY(1,1) PRIMARY KEY,
        cliente_id INT,
        produto_id INT,
        quantidade INT NOT NULL,
        valor_total DECIMAL(10, 2) NOT NULL,
        data_venda DATETIME DEFAULT GETDATE(),
        FOREIGN KEY (cliente_id) REFERENCES clientes(id),
        FOREIGN KEY (produto_id) REFERENCES produtos(id)
    );
    PRINT 'Tabela vendas criada com sucesso';
END

GO

-- Índices para melhor performance
IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'idx_vendas_data')
    CREATE INDEX idx_vendas_data ON vendas(data_venda DESC);

IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'idx_vendas_cliente')
    CREATE INDEX idx_vendas_cliente ON vendas(cliente_id);

IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'idx_produtos_categoria')
    CREATE INDEX idx_produtos_categoria ON produtos(categoria);