const alertasService = require('../services/alertas.service');

// Controller: Responsável apenas por receber a requisição HTTP (req), 
// repassar os dados para o Service processar, e devolver a resposta HTTP (res).

exports.criarAlerta = async (req, res) => {
  try {
    const result = await alertasService.criar(req.body);
    res.status(201).json(result);   // 201: Created (Recurso criado com sucesso)
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.resolverAlerta = async (req, res) => {
  try {
    // Passa o ID da URL (params) e o corpo da requisição para o Service
    await alertasService.resolver(req.params.id, req.body);
    res.json({ success: true });    // 200: OK (Padrão)
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};