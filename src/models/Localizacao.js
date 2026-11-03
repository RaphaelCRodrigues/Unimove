
const mongoose = require("mongoose");

const localizacaoSchema = new mongoose.Schema(
  {
    veiculo: { type: mongoose.Schema.Types.ObjectId, ref: "Veiculo", required: true },
    linha: { type: mongoose.Schema.Types.ObjectId, ref: "Linha", required: true },
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
    velocidadeKmH: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Localizacao", localizacaoSchema);
