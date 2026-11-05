
const express = require("express");
const router = express.Router();
const Localizacao = require("../models/Localizacao");

// Registrar localização (CREATE)
router.post("/", async (req, res) => {
  try {
    const loc = await Localizacao.create(req.body);
    res.status(201).json(loc);
  } catch (e) { res.status(400).json({ erro: e.message }); }
});

// Última localização de cada veículo (AGREGAÇÃO: $sort + $group)
router.get("/ultimas", async (req, res) => {
  const ultimas = await Localizacao.aggregate([
    { $sort: { createdAt: -1 } },
    {
      $group: {
        _id: "$veiculo",
        latitude: { $first: "$latitude" },
        longitude: { $first: "$longitude" },
        velocidadeKmH: { $first: "$velocidadeKmH" },
        atualizadoEm: { $first: "$createdAt" },
      },
    },
    { $sort: { atualizadoEm: -1 } },
  ]);
  // traz dados do veículo e da linha via lookup (agregação com "join")
  const Veiculo = require("../models/Veiculo");
  const veiculos = await Veiculo.find().populate("linha", "nome");
  const mapa = Object.fromEntries(veiculos.map((v) => [String(v._id), v]));
  res.json(ultimas.map((u) => ({ ...u, veiculo: mapa[u._id] })));
});

// Histórico de um veículo com filtro por data
router.get("/veiculo/:id", async (req, res) => {
  const filtro = { veiculo: req.params.id };
  if (req.query.de || req.query.ate) {
    filtro.createdAt = {};
    if (req.query.de) filtro.createdAt.$gte = new Date(req.query.de);
    if (req.query.ate) filtro.createdAt.$lte = new Date(req.query.ate);
  }
  const locs = await Localizacao.find(filtro).sort({ createdAt: -1 }).limit(100);
  res.json(locs);
});

module.exports = router;