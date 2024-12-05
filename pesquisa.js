const express = require('express');
const mysql = require('mysql2');

const app = express();
const port = 3000;

// Configuração do banco de dados MySQL
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root', // seu usuário MySQL
  password: 'senha', // sua senha MySQL
  database: 'livraria',
});

// Conectar ao banco de dados
db.connect((err) => {
  if (err) {
    console.error('Erro ao conectar ao banco de dados: ' + err.stack);
    return;
  }
  console.log('Conectado ao banco de dados MySQL');
});

// Rota de pesquisa
app.get('/pesquisar', (req, res) => {
  const query = req.query.query;

  if (!query) {
    return res.status(400).json({ error: "Por favor, forneça um parâmetro 'query' para pesquisa." });
  }

  // Consulta SQL para buscar livros com o parâmetro 'query'
  const sql = `
    SELECT * FROM livros 
    WHERE titulo LIKE ? OR autor LIKE ? OR genero LIKE ?
  `;

  const likeQuery = `%${query}%`;

  db.execute(sql, [likeQuery, likeQuery, likeQuery], (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Erro ao consultar o banco de dados.' });
    }
    res.json(results);
  });
});

// Iniciar o servidor
app.listen(port, () => {
  console.log(`API rodando em http://localhost:${port}`);
});

