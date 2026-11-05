const mongoose = require("mongoose");

const localizacaoSchema = new mongoose.Schema({
    veiculo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Veiculo",
        required: true
    },
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
    velocidadeKmH: { type: Number, default: 0 },
    atualizadoEm: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Localizacao", localizacaoSchema);