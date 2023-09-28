const mysql = require('mysql2');

// Configuração para conexão com o banco de dados
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'emilly00@jade',
    database: 'sgram'
});


// Conecta ao banco de dados
connection.connect((err) => {
    if (err) {
        console.error('Erro ao conectar ao banco de dados:', err);
        return;
    }

    console.log('Conexão bem-sucedida ao banco de dados');

    // Nome da tabela que você deseja deletar
    const tabela = 'imagens';

    // Query SQL para deletar todos os registros da tabela
    const sql = `DELETE FROM ${tabela}`;

    // Executa a consulta SQL
    connection.query(sql, (err, results) => {
        if (err) {
            console.error('Erro ao deletar registros da tabela:', err);
        } else {
            console.log(`Registros deletados da tabela ${tabela}: ${results.affectedRows}`);
        }

        // Fecha a conexão com o banco de dados
        connection.end();
    });
});