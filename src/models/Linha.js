const mongoose = require("mongoose");

const horarioSchema = new mongoose.Schema(
    {
        diaSemana: { type: String, enum: ["Segunda a Sexta", "Sábado", "Domingo"], required: true },
        hora: { type: String, required: true },
    },
    { _id: false }
);

const linhaSchema = new mongoose.Schema(
    {
        nome: { type: String, required: true },
        origem: { type: String, required: true },
        destino: { type: String, required: true },
        horarios: [horarioSchema],
        coordenadas: [{ lat: Number, lng: Number }], // Necessário para desenhar o trajeto no mapa
        ativa: { type: Boolean, default: true },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Linha", linhaSchema);