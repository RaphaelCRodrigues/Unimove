
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

// READ com filtros (ex: ?status=Aberta&tipo=Avaria)
router.get("/", async (req, res) => {
  const filtro = {};
  if (req.query.status) filtro.status = req.query.status;
  if (req.query.tipo) filtro.tipo = req.query.tipo;
  const ocorrencias = await Ocorrencia.find(filtro)
    .populate("veiculo", "placa modelo")
    .populate("linha", "nome")
    .sort({ createdAt: -1 });
  res.json(ocorrencias);
});

// Atualizar status (Aberta -> Em análise -> Resolvida)
router.patch("/:id/status", async (req, res) => {
  const ocorrencia = await Ocorrencia.findByIdAndUpdate(
    req.params.id,
    { status: req.body.status },
    { new: true }
  );
  if (!ocorrencia) return res.status(404).json({ erro: "Ocorrência não encontrada" });
  res.json(ocorrencia);
});

router.delete("/:id", async (req, res) => {
  const ocorrencia = await Ocorrencia.findByIdAndDelete(req.params.id);
  if (!ocorrencia) return res.status(404).json({ erro: "Ocorrência não encontrada" });
  res.json({ mensagem: "Ocorrência removida com sucesso" });
});

module.exports = router;
