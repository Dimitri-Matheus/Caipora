const express = require('express');
const router = express.Router();

const {
  listarAlertas,
  obterAlertaPorId,
  criarAlerta,
  resolverAlerta,
  obterAnalytics
} = require('../controllers/alertas.controller');

// Rota acionada pelo hardware (ESP32) para registrar um novo evento de som
router.post('/', criarAlerta);

//Retorna o total de alertas agrupados por dia (DD/MM) para alimentar o gráfico de linha histórico.
router.get('/analytics/historico', obterAnalytics);

// Rota para alterar o status de um alerta para 'resolvido'
router.put('/:id/resolver', resolverAlerta);

// Rota para listar todos os alertas
router.get('/', listarAlertas);

// Rota para obter um alerta específico
router.get('/:id', obterAlertaPorId);

module.exports = router;