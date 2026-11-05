
const mongoose = require("mongoose");

const veiculoSchema = new mongoose.Schema(
    {
        placa: { type: String, required: true, unique: true, uppercase: true },
        modelo: { type: String, required: true },
        capacidade: { type: Number, required: true },
        estadoOperacional: {
            type: String,
            enum: ["Operacional", "Manutenção", "Inativo"],
            default: "Operacional",
        },
        linha: { type: mongoose.Schema.Types.ObjectId, ref: "Linha", required: true },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Veiculo", veiculoSchema);