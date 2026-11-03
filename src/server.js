
const express = require("express");
const mongoose = require("mongoose");
const path = require("path");

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, "..", "public")));

const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/unimove";

mongoose
  .connect(MONGO_URI)
  .then(() => console.log("Conectado ao MongoDB:", MONGO_URI))
  .catch((e) => {
    console.error("Erro ao conectar no MongoDB:", e.message);
    console.error("Dica: inicie o MongoDB local ou rode 'docker compose up -d mongo'");
    process.exit(1);
  });

app.use("/api/linhas", require("./routes/linhas"));
app.use("/api/veiculos", require("./routes/veiculos"));
app.use("/api/localizacoes", require("./routes/localizacoes"));
app.use("/api/ocorrencias", require("./routes/ocorrencias"));
app.use("/api/relatorios", require("./routes/relatorios"));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () =>
  console.log(`UniMove rodando em http://localhost:${PORT}`)
);
