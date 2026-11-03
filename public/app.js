
const api = (url, opts) => fetch(url, opts).then((r) => r.json());
const post = (url, dados) => api(url, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(dados) });

// navegação entre abas
document.querySelectorAll(".tab").forEach((btn) => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".tab").forEach((b) => b.classList.remove("ativa"));
    document.querySelectorAll(".painel").forEach((p) => p.classList.remove("ativo"));
    btn.classList.add("ativa");
    document.getElementById(btn.dataset.tab).classList.add("ativo");
    carregarTudo();
  });
});

const fmtData = (d) => new Date(d).toLocaleString("pt-BR");
const badge = (estado) => `<span class="badge b-${estado.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/ /g, "-")}">${estado}</span>`;

async function carregarLinhas() {
  const linhas = await api("/api/linhas");
  document.getElementById("tbl-linhas").innerHTML = linhas.map((l) => `
    <tr>
      <td>${l.nome}</td><td>${l.origem}</td><td>${l.destino}</td>
      <td>${l.ativa ? badge("Operacional") : badge("Inativo")}</td>
      <td class="acoes">
        <button onclick="alternarLinha('${l._id}', ${!l.ativa})">${l.ativa ? "Desativar" : "Ativar"}</button>
        <button onclick="excluir('/api/linhas/${l._id}')">Excluir</button>
      </td>
    </tr>`).join("");
  document.getElementById("sel-linha-veiculo").innerHTML =
    linhas.filter((l) => l.ativa).map((l) => `<option value="${l._id}">${l.nome}</option>`).join("");
}

async function carregarVeiculos() {
  const veiculos = await api("/api/veiculos");
  document.getElementById("tbl-veiculos").innerHTML = veiculos.map((v) => `
    <tr>
      <td>${v.placa}</td><td>${v.modelo}</td><td>${v.linha ? v.linha.nome : "-"}</td>
      <td>${badge(v.estadoOperacional)}</td>
      <td class="acoes">
        <button onclick="mudarEstado('${v._id}', '${proximoEstado(v.estadoOperacional)}')">Mudar estado</button>
        <button onclick="excluir('/api/veiculos/${v._id}')">Excluir</button>
      </td>
    </tr>`).join("");
  document.getElementById("sel-veiculo-oc").innerHTML =
    veiculos.map((v) => `<option value="${v._id}">${v.placa} — ${v.modelo}</option>`).join("");
}

const proximoEstado = (e) => (e === "Operacional" ? "Manutenção" : e === "Manutenção" ? "Inativo" : "Operacional");

async function carregarLocalizacoes() {
  const locs = await api("/api/localizacoes/ultimas");
  document.getElementById("tbl-loc").innerHTML = locs.map((u) => `
    <tr>
      <td>${u.veiculo ? u.veiculo.placa : "?"}</td>
      <td>${u.veiculo && u.veiculo.linha ? u.veiculo.linha.nome : "-"}</td>
      <td>${u.latitude.toFixed(5)}</td><td>${u.longitude.toFixed(5)}</td>
      <td>${u.velocidadeKmH} km/h</td><td>${fmtData(u.atualizadoEm)}</td>
    </tr>`).join("");
}

async function carregarOcorrencias() {
  const status = document.getElementById("filtro-status").value;
  const url = "/api/ocorrencias" + (status ? `?status=${encodeURIComponent(status)}` : "");
  const ocs = await api(url);
  const proximo = { Aberta: "Em análise", "Em análise": "Resolvida", Resolvida: "Aberta" };
  document.getElementById("tbl-oc").innerHTML = ocs.map((o) => `
    <tr>
      <td>${fmtData(o.createdAt)}</td><td>${o.tipo}</td>
      <td>${o.veiculo ? o.veiculo.placa : "-"}</td><td>${o.descricao}</td><td>${o.status}</td>
      <td class="acoes"><button onclick="mudarStatus('${o._id}', '${proximo[o.status]}')">→ ${proximo[o.status]}</button></td>
    </tr>`).join("");
}

async function carregarRelatorios() {
  const [estados, tipos, locs] = await Promise.all([
    api("/api/relatorios/veiculos-por-estado"),
    api("/api/relatorios/ocorrencias-por-tipo"),
    api("/api/relatorios/localizacoes-por-linha"),
  ]);
  document.getElementById("rel-estados").innerHTML = estados.map((e) => `<li><span>${e.estado}</span><b>${e.quantidade}</b></li>`).join("");
  document.getElementById("rel-tipos").innerHTML = tipos.map((o) => `<li><span>${o.tipo} (${o.status})</span><b>${o.quantidade}</b></li>`).join("");
  document.getElementById("rel-locs").innerHTML = locs.map((l) => `<li><span>${l.linha}</span><b>${l.totalRegistros}</b></li>`).join("");
}

function carregarTudo() {
  carregarLinhas(); carregarVeiculos(); carregarLocalizacoes(); carregarOcorrencias(); carregarRelatorios();
}

// formulários
document.getElementById("form-linha").addEventListener("submit", async (e) => {
  e.preventDefault();
  const f = new FormData(e.target);
  await post("/api/linhas", { nome: f.get("nome"), origem: f.get("origem"), destino: f.get("destino"), horarios: [] });
  e.target.reset(); carregarTudo();
});

document.getElementById("form-veiculo").addEventListener("submit", async (e) => {
  e.preventDefault();
  const f = new FormData(e.target);
  await post("/api/veiculos", {
    placa: f.get("placa"), modelo: f.get("modelo"),
    capacidade: Number(f.get("capacidade")), linha: f.get("linha"),
  });
  e.target.reset(); carregarTudo();
});

document.getElementById("form-ocorrencia").addEventListener("submit", async (e) => {
  e.preventDefault();
  const f = new FormData(e.target);
  const veiculos = await api("/api/veiculos");
  const v = veiculos.find((x) => x._id === f.get("veiculo"));
  await post("/api/ocorrencias", {
    tipo: f.get("tipo"), veiculo: f.get("veiculo"),
    linha: v && v.linha ? v.linha._id : undefined,
    descricao: f.get("descricao"),
  });
  e.target.reset(); carregarTudo();
});

document.getElementById("filtro-status").addEventListener("change", carregarOcorrencias);

// simular uma nova localização aleatória
document.getElementById("btn-registrar-loc").addEventListener("click", async () => {
  const veiculos = await api("/api/veiculos");
  const v = veiculos[Math.floor(Math.random() * veiculos.length)];
  await post("/api/localizacoes", {
    veiculo: v._id, linha: v.linha._id || v.linha,
    latitude: -23.55 + (Math.random() - 0.5) * 0.08,
    longitude: -46.63 + (Math.random() - 0.5) * 0.08,
    velocidadeKmH: Math.floor(Math.random() * 60),
  });
  carregarLocalizacoes(); carregarRelatorios();
});

// ações globais
window.excluir = async (url) => { if (confirm("Confirmar exclusão?")) { await api(url, { method: "DELETE" }); carregarTudo(); } };
window.alternarLinha = async (id, ativa) => { await api(`/api/linhas/${id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ativa }) }); carregarTudo(); };
window.mudarEstado = async (id, estado) => { await api(`/api/veiculos/${id}/estado`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ estadoOperacional: estado }) }); carregarTudo(); };
window.mudarStatus = async (id, status) => { await api(`/api/ocorrencias/${id}/status`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status }) }); carregarOcorrencias(); };

carregarTudo();
