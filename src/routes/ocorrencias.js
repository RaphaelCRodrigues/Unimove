const express = require("express");
const router = express.Router();
const Ocorrencia = require("../models/Ocorrencia");

// CREATE
router.post("/", async (req, res) => {
  try {
    const ocorrencia = await Ocorrencia.create(req.body);
    res.status(201).json(ocorrencia);
  } catch (e) { res.status(400).json({ erro: e.message }); }
});

// READ com filtros
router.get("/", async (req, res) => {
  try {
    const filtro = {};
    if (req.query.status) filtro.status = req.query.status;
    if (req.query.tipo) filtro.tipo = req.query.tipo;

    const ocorrencias = await Ocorrencia.find(filtro)
        .populate({
          path: "veiculo",
          select: "placa modelo linha",
          populate: { path: "linha", select: "nome" }
        })
        .sort({ createdAt: -1 });

    res.json(ocorrencias);
  } catch (e) {
    res.status(500).json({ erro: e.message });
  }
});

// Atualizar status
router.patch("/:id/status", async (req, res) => {
  try {
    const ocorrencia = await Ocorrencia.findByIdAndUpdate(
        req.params.id,
        { status: req.body.status },
        { new: true }
    );
    if (!ocorrencia) return res.status(404).json({ erro: "Ocorrência não encontrada" });
    res.json(ocorrencia);
  } catch (e) {
    res.status(400).json({ erro: e.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const ocorrencia = await Ocorrencia.findByIdAndDelete(req.params.id);
    if (!ocorrencia) return res.status(404).json({ erro: "Ocorrência não encontrada" });
    res.json({ mensagem: "Ocorrência removida com sucesso" });
  } catch (e) {
    res.status(500).json({ erro: e.message });
  }
});

module.exports = router;