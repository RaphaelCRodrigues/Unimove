
const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Veiculo = require("../models/Veiculo");
const Ocorrencia = require("../models/Ocorrencia");
const Localizacao = require("../models/Localizacao");

// AGREGAÇÃO: veículos agrupados por estado operacional
router.get("/veiculos-por-estado", async (req, res) => {
  const resultado = await Veiculo.aggregate([
    { $group: { _id: "$estadoOperacional", quantidade: { $sum: 1 } } },
    { $project: { estado: "$_id", quantidade: 1, _id: 0 } },
    { $sort: { quantidade: -1 } },
  ]);
  res.json(resultado);
});

// AGREGAÇÃO: ocorrências por tipo e status
router.get("/ocorrencias-por-tipo", async (req, res) => {
  const resultado = await Ocorrencia.aggregate([
    {
      $group: {
        _id: { tipo: "$tipo", status: "$status" },
        quantidade: { $sum: 1 },
      },
    },
    {
      $project: {
        tipo: "$_id.tipo",
        status: "$_id.status",
        quantidade: 1,
        _id: 0,
      },
    },
    { $sort: { tipo: 1, status: 1 } },
  ]);
  res.json(resultado);
});

// AGREGAÇÃO: quantidade de localizações registradas por linha
router.get("/localizacoes-por-linha", async (req, res) => {
  const resultado = await Localizacao.aggregate([
    { $group: { _id: "$linha", totalRegistros: { $sum: 1 } } },
    {
      $lookup: {
        from: "linhas",
        localField: "_id",
        foreignField: "_id",
        as: "linha",
      },
    },
    { $unwind: "$linha" },
    {
      $project: {
        linha: "$linha.nome",
        totalRegistros: 1,
        _id: 0,
      },
    },
    { $sort: { totalRegistros: -1 } },
  ]);
  res.json(resultado);
});

module.exports = router;
