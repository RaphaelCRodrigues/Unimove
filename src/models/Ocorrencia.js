const mongoose = require("mongoose");

const ocorrenciaSchema = new mongoose.Schema({
    tipo: { type: String, required: true },
    veiculo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Veiculo",
        required: true
    },
    descricao: { type: String, required: true },
    status: {
        type: String,
        enum: ["Aberta", "Em análise", "Resolvida"],
        default: "Aberta"
    },
}, { timestamps: true });

module.exports = mongoose.model("Ocorrencia", ocorrenciaSchema);