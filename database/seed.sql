-- Inserir Clientes de exemplo
IF NOT EXISTS (SELECT * FROM clientes)
BEGIN
    INSERT INTO clientes (nome, email, telefone, cpf) VALUES 
    ('João Silva', 'joao.silva@email.com', '11987654321', '123.456.789-00'),
    ('Maria Santos', 'maria.santos@email.com', '11987654322', '234.567.890-11'),
    ('Pedro Oliveira', 'pedro.oliveira@email.com', '11987654323', '345.678.901-22'),
    ('Ana Costa', 'ana.costa@email.com', '11987654324', '456.789.012-33'),
    ('Carlos Pereira', 'carlos.pereira@email.com', '11987654325', '567.890.123-44'),
    ('Lucia Ferreira', 'lucia.ferreira@email.com', '11987654326', '678.901.234-55'),
    ('Roberto Alves', 'roberto.alves@email.com', '11987654327', '789.012.345-66'),
    ('Fernanda Lima', 'fernanda.lima@email.com', '11987654328', '890.123.456-77'),
    ('Ricardo Souza', 'ricardo.souza@email.com', '11987654329', '901.234.567-88'),
    ('Patricia Rocha', 'patricia.rocha@email.com', '11987654330', '012.345.678-99');
    
    PRINT 'Clientes inseridos com sucesso';
END

GO

-- Inserir Produtos de exemplo
IF NOT EXISTS (SELECT * FROM produtos)
BEGIN
    INSERT INTO produtos (nome, descricao, categoria, preco, estoque) VALUES 
    -- Eletrônicos
    ('Notebook Dell Inspiron', 'Notebook com processador Intel i5, 8GB RAM', 'Eletrônicos', 3499.90, 15),
    ('Mouse Logitech MX', 'Mouse sem fio ergonômico', 'Eletrônicos', 299.90, 50),
    ('Teclado Mecânico RGB', 'Teclado gamer com iluminação RGB', 'Eletrônicos', 449.90, 30),
    ('Monitor LG 27"', 'Monitor Full HD IPS', 'Eletrônicos', 1299.90, 20),
    ('Headset Gamer', 'Fone com microfone e som surround', 'Eletrônicos', 249.90, 40),
    
    -- Livros
    ('Clean Code', 'Livro sobre práticas de programação', 'Livros', 89.90, 100),
    ('Design Patterns', 'Padrões de projeto de software', 'Livros', 119.90, 80),
    ('The Pragmatic Programmer', 'Guia para programadores', 'Livros', 99.90, 90),
    
    -- Escritório
    ('Cadeira Ergonômica', 'Cadeira de escritório com apoio lombar', 'Escritório', 899.90, 25),
    ('Mesa para Notebook', 'Mesa ajustável para notebook', 'Escritório', 199.90, 35),
    ('Organizador de Mesa', 'Kit organizador com porta-canetas', 'Escritório', 79.90, 60),
    ('Luminária LED', 'Luminária de mesa com ajuste de intensidade', 'Escritório', 149.90, 45),
    
    -- Software
    ('Windows 11 Pro', 'Licença Windows 11 Professional', 'Software', 999.90, 200),
    ('Office 365', 'Assinatura anual Office 365', 'Software', 399.90, 150),
    ('Antivírus Pro', 'Proteção completa 1 ano', 'Software', 199.90, 100);
    
    PRINT 'Produtos inseridos com sucesso';
END

GO

-- Inserir algumas vendas de exemplo
IF NOT EXISTS (SELECT * FROM vendas)
BEGIN
    INSERT INTO vendas (cliente_id, produto_id, quantidade, valor_total, data_venda) VALUES 
    (1, 1, 1, 3499.90, DATEADD(day, -5, GETDATE())),
    (2, 2, 2, 599.80, DATEADD(day, -4, GETDATE())),
    (3, 6, 1, 89.90, DATEADD(day, -3, GETDATE())),
    (1, 9, 1, 899.90, DATEADD(day, -2, GETDATE())),
    (4, 5, 1, 249.90, DATEADD(day, -1, GETDATE())),
    (5, 13, 1, 999.90, GETDATE()),
    (6, 3, 1, 449.90, GETDATE()),
    (7, 11, 2, 159.80, GETDATE());
    
    PRINT 'Vendas de exemplo inseridas';
END