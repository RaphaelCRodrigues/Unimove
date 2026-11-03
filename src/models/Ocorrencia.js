
const mongoose = require("mongoose");

const ocorrenciaSchema = new mongoose.Schema(
  {
    veiculo: { type: mongoose.Schema.Types.ObjectId, ref: "Veiculo" },
    linha: { type: mongoose.Schema.Types.ObjectId, ref: "Linha" },
    tipo: {
      type: String,
      enum: ["Avaria", "Acidente", "Atraso", "Lotado", "Outro"],
      required: true,
    },
    descricao: { type: String, required: true },
    status: {
      type: String,
      enum: ["Aberta", "Em análise", "Resolvida"],
      default: "Aberta",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Ocorrencia", ocorrenciaSchema);
