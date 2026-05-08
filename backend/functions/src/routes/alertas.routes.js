const express = require('express');
const router = express.Router();

const {
  listarAlertas,
  obterAlertaPorId,
  criarAlerta,
  resolverAlerta
} = require('../controllers/alertas.controller');

// Rota acionada pelo hardware (ESP32) para registrar um novo evento de som
router.post('/', criarAlerta);

// Rota acionada pelo site (Front-end) quando o operador toma uma ação.
// Utilizamos PATCH pois é uma atualização parcial (apenas mudando o status para resolvido).
router.put('/:id/resolver', resolverAlerta);

// Rota para listar todos os alertas
router.get('/', listarAlertas);

// Rota para obter um alerta específico
router.get('/:id', obterAlertaPorId);

module.exports = router;