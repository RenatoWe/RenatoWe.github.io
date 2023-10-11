const express = require('express');
const mysql = require('mysql2');
const multer = require('multer');
const path = require('path');
const bodyParser = require('body-parser');
const app = express();

app.set('view engine', 'ejs');

// Configurar o middleware para processar formulários e uploads de arquivos
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Configurar o diretório para servir arquivos estáticos (CSS, JS, imagens)
app.use(express.static(path.join(__dirname, 'public')));

// Configurar a conexão com o banco de dados MySQL
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'emilly00@jade',
    database: 'sgram'
});

db.connect((err) => {
    if (err) {
        console.error('Erro ao conectar ao banco de dados:', err);
    } else {
        console.log('Conectado ao banco de dados MySQL');
    }
});

// Configurar o sistema de armazenamento de uploads de arquivos usando o Multer
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

// Rota para exibir o formulário
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

// Rota para exibir os dados do banco de dados na página HTML
app.get('/pesquisar', (req, res) => {
    const termoPesquisa = req.query.pesquisa;
    const sql = 'SELECT * FROM imagens WHERE nome_fantasia LIKE ?';
    db.query(sql, [`%${termoPesquisa}%`], (err, results) => {
        if (err) {
            console.error('Erro ao buscar dados no banco de dados:', err);
        } else {
            res.render('resultado', { resultados: results });
        }
    });
});




// Rota para processar o formulário e adicionar dados ao banco de dados
app.post('/adicionar', upload.single('imagem'), (req, res) => {
    const { descricao, nome_fantasia, telefone, Endereco } = req.body;
    const imagem = req.file.filename;

    const sql = 'INSERT INTO imagens (imagem, descricao, nome_fantasia, telefone, Endereco) VALUES (?, ?, ?, ?, ?)';
    db.query(sql, [imagem, descricao, nome_fantasia, telefone, Endereco], (err, result) => {
        if (err) {
            console.error('Erro ao inserir dados no banco de dados:', err);
        } else {
            console.log('Dados inseridos com sucesso');
            res.redirect('/');
        }
    });
});

// Iniciar o servidor na porta 3000
app.listen(3000, () => {
    console.log('Servidor está rodando na porta 3000');
});
