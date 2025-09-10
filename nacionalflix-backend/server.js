const express = require('express');
const cors = require('cors');
require('dotenv').config();
const routes = require('./routes');

const app = express();
const PORT = 3000; // O backend rodará na porta 3000

// Middlewares
app.use(cors()); // Permite que o frontend acesse o backend
app.use(express.json()); // Permite que o servidor entenda requisições com corpo em JSON

// Rota principal da API
app.use('/api', routes);

app.listen(PORT, () => {
  console.log(`Servidor backend rodando em http://localhost:${PORT}`);
});