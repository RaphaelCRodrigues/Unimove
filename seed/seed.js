
// Popula o banco com dados simulados de transporte universitário
const mongoose = require("mongoose");
const Linha = require("../src/models/Linha");
const Veiculo = require("../src/models/Veiculo");
const Localizacao = require("../src/models/Localizacao");
const Ocorrencia = require("../src/models/Ocorrencia");

const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/unimove";

async function seed() {
  await mongoose.connect(MONGO_URI);
  console.log("Conectado. Limpando coleções...");
  await Promise.all([
    Linha.deleteMany({}),
    Veiculo.deleteMany({}),
    Localizacao.deleteMany({}),
    Ocorrencia.deleteMany({}),
  ]);

  const linhas = await Linha.insertMany([
    {
      nome: "Linha 1 - Centro",
      origem: "Campus Central",
      destino: "Centro",
      horarios: [
        { diaSemana: "Segunda a Sexta", hora: "07:30" },
        { diaSemana: "Segunda a Sexta", hora: "12:00" },
        { diaSemana: "Segunda a Sexta", hora: "17:30" },
      ],
    },
    {
      nome: "Linha 2 - Zona Norte",
      origem: "Campus Central",
      destino: "Zona Norte",
      horarios: [
        { diaSemana: "Segunda a Sexta", hora: "07:00" },
        { diaSemana: "Segunda a Sexta", hora: "18:00" },
      ],
    },
    {
      nome: "Linha 3 - Zona Sul",
      origem: "Campus Central",
      destino: "Zona Sul",
      horarios: [
        { diaSemana: "Segunda a Sexta", hora: "08:00" },
        { diaSemana: "Sábado", hora: "09:00" },
      ],
    },
  ]);
  console.log(`${linhas.length} linhas criadas.`);

  const veiculos = await Veiculo.insertMany([
    { placa: "ABC1D23", modelo: "Volare W9", capacidade: 30, estadoOperacional: "Operacional", linha: linhas[0]._id },
    { placa: "EFG4H56", modelo: "Volare W9", capacidade: 30, estadoOperacional: "Operacional", linha: linhas[0]._id },
    { placa: "IJK7L89", modelo: "Marcopolo Torino", capacidade: 45, estadoOperacional: "Manutenção", linha: linhas[1]._id },
    { placa: "MNO1P23", modelo: "Marcopolo Torino", capacidade: 45, estadoOperacional: "Operacional", linha: linhas[1]._id },
    { placa: "QRS4T56", modelo: "Caio Apache", capacidade: 40, estadoOperacional: "Operacional", linha: linhas[2]._id },
    { placa: "UVW7X89", modelo: "Caio Apache", capacidade: 40, estadoOperacional: "Inativo", linha: linhas[2]._id },
  ]);
  console.log(`${veiculos.length} veículos criados.`);

  // localizações simuladas (coordenadas aproximadas da região do campus)
  const locs = [];
  for (const v of veiculos) {
    const n = 5 + Math.floor(Math.random() * 6);
    for (let i = 0; i < n; i++) {
      locs.push({
        veiculo: v._id,
        linha: v.linha,
        latitude: -23.55 + (Math.random() - 0.5) * 0.08,
        longitude: -46.63 + (Math.random() - 0.5) * 0.08,
        velocidadeKmH: v.estadoOperacional === "Operacional" ? Math.floor(Math.random() * 50) : 0,
        createdAt: new Date(Date.now() - i * 5 * 60 * 1000),
      });
    }
  }
  await Localizacao.insertMany(locs);
  console.log(`${locs.length} localizações simuladas.`);

  await Ocorrencia.insertMany([
    { veiculo: veiculos[2]._id, linha: linhas[1]._id, tipo: "Avaria", descricao: "Problema no sistema de ar-condicionado.", status: "Em análise" },
    { veiculo: veiculos[4]._id, linha: linhas[2]._id, tipo: "Lotado", descricao: "Veículo lotado no horário de pico das 17h30.", status: "Aberta" },
    { veiculo: veiculos[1]._id, linha: linhas[0]._id, tipo: "Atraso", descricao: "Atraso de 20 minutos por congestionamento.", status: "Resolvida" },
    { veiculo: veiculos[5]._id, linha: linhas[2]._id, tipo: "Avaria", descricao: "Falha no motor — veículo retirado de operação.", status: "Aberta" },
  ]);
  console.log("4 ocorrências criadas.");
  console.log("Seed concluído com sucesso!");
  await mongoose.disconnect();
}

seed().catch((e) => {
  console.error("Erro no seed:", e);
  process.exit(1);
});
