const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const sequelize = require('./db');
const authRoutes = require('./auth');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Conectar ao MySQL
sequelize.authenticate()
  .then(() => console.log('MySQL conectado'))
  .catch(err => console.log('Erro de conexão MySQL:', err));

// Rotas
app.use('/api', authRoutes);

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
