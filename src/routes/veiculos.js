
const express = require("express");
const router = express.Router();
const Veiculo = require("../models/Veiculo");

// CREATE
router.post("/", async (req, res) => {
  try {
    const veiculo = await Veiculo.create(req.body);
    res.status(201).json(veiculo);
  } catch (e) { res.status(400).json({ erro: e.message }); }
});

// READ com filtros (ex: ?estado=Operacional&linha=<id>)
router.get("/", async (req, res) => {
  const filtro = {};
  if (req.query.estado) filtro.estadoOperacional = req.query.estado;
  if (req.query.linha) filtro.linha = req.query.linha;
  const veiculos = await Veiculo.find(filtro).populate("linha", "nome origem destino").sort({ placa: 1 });
  res.json(veiculos);
});

// Atualizar somente o estado operacional (ação frequente no painel)
router.patch("/:id/estado", async (req, res) => {
  const veiculo = await Veiculo.findByIdAndUpdate(
    req.params.id,
    { estadoOperacional: req.body.estadoOperacional },
    { new: true }
  );
  if (!veiculo) return res.status(404).json({ erro: "Veículo não encontrado" });
  res.json(veiculo);
});

router.put("/:id", async (req, res) => {
  const veiculo = await Veiculo.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!veiculo) return res.status(404).json({ erro: "Veículo não encontrado" });
  res.json(veiculo);
});

router.delete("/:id", async (req, res) => {
  const veiculo = await Veiculo.findByIdAndDelete(req.params.id);
  if (!veiculo) return res.status(404).json({ erro: "Veículo não encontrado" });
  res.json({ mensagem: "Veículo removido com sucesso" });
});

module.exports = router;
