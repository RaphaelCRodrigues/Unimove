
const express = require("express");
const router = express.Router();
const Linha = require("../models/Linha");

// CREATE
router.post("/", async (req, res) => {
  try {
    const linha = await Linha.create(req.body);
    res.status(201).json(linha);
  } catch (e) { res.status(400).json({ erro: e.message }); }
});

// READ com filtro (ex: ?ativa=true&origem=Centro)
router.get("/", async (req, res) => {
  const filtro = {};
  if (req.query.ativa !== undefined) filtro.ativa = req.query.ativa === "true";
  if (req.query.origem) filtro.origem = new RegExp(req.query.origem, "i");
  const linhas = await Linha.find(filtro).sort({ nome: 1 });
  res.json(linhas);
});

router.get("/:id", async (req, res) => {
  const linha = await Linha.findById(req.params.id);
  if (!linha) return res.status(404).json({ erro: "Linha não encontrada" });
  res.json(linha);
});

// UPDATE
router.put("/:id", async (req, res) => {
  const linha = await Linha.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!linha) return res.status(404).json({ erro: "Linha não encontrada" });
  res.json(linha);
});

// DELETE
router.delete("/:id", async (req, res) => {
  const linha = await Linha.findByIdAndDelete(req.params.id);
  if (!linha) return res.status(404).json({ erro: "Linha não encontrada" });
  res.json({ mensagem: "Linha removida com sucesso" });
});

module.exports = router;
