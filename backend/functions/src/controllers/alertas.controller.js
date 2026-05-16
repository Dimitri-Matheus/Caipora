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

exports.listarAlertas = async (req, res) => {
  try {
    const alertas = await alertasService.listar();
    res.json(alertas);  // 200: OK (Padrão)
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.obterAlertaPorId = async (req, res) => {
  try {
    const alerta = await alertasService.obterPorId(req.params.id);
    res.json(alerta);  // 200: OK (Padrão)
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Adicione no alertas.controller.js

exports.obterAnalytics = async (req, res) => {
    try {
        // Chama a função que acabamos de criar no service
        const dados = await alertasService.obterDadosAnalytics();
        res.status(200).json(dados);
    } catch (error) {
        console.error("Erro ao gerar analytics:", error);
        res.status(500).json({ erro: "Falha ao processar dados para o gráfico" });
    }
};

// Não esqueça de adicionar obterAnalytics no module.exports do controller!