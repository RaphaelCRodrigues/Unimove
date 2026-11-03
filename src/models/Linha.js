
const mongoose = require("mongoose");

const horarioSchema = new mongoose.Schema(
  {
    diaSemana: { type: String, enum: ["Segunda a Sexta", "Sábado", "Domingo"], required: true },
    hora: { type: String, required: true }, // ex: "07:30"
  },
  { _id: false }
);

const linhaSchema = new mongoose.Schema(
  {
    nome: { type: String, required: true },           // ex: "Linha 1 - Centro"
    origem: { type: String, required: true },
    destino: { type: String, required: true },
    horarios: [horarioSchema],
    ativa: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Linha", linhaSchema);
