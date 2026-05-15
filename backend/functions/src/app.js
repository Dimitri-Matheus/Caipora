const express = require('express');
const cors = require('cors');

const alertasRoutes = require('./routes/alertas.routes');

const app = express();

// Middlewares Globais
app.use(cors({ origin: true }));  // Permite requisições de outras origens (como o Front-end e o ESP32)
app.use(express.json());  // Permite que a nossa API receba e entenda dados no formato JSON

// Injeção de Rotas
// Toda requisição que chegar com '/alertas' será gerenciada pelo arquivo alertasRoutes
app.use('/api/alertas', alertasRoutes);

module.exports = app;