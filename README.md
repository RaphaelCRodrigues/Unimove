
# UniMove 🚌

Sistema de Monitoramento de Transporte Universitário — aplicação web com **Node.js + Express + MongoDB**.

## O que o sistema faz

- **Linhas**: cadastro, consulta, ativação/desativação e exclusão de linhas de transporte;
- **Veículos**: cadastro e atualização do estado operacional (Operacional / Manutenção / Inativo);
- **Localizações**: registro de posição dos veículos e consulta da última localização de cada um;
- **Ocorrências**: registro de avarias, atrasos, lotação etc., com acompanhamento de status;
- **Relatórios**: agregações no MongoDB (veículos por estado, ocorrências por tipo, registros por linha).

## Requisitos

- [Node.js](https://nodejs.org) (versão 18+) e npm
- MongoDB rodando localmente **ou** [Docker](https://www.docker.com)

## Como executar

### Opção 1 — com Docker (mais simples, sobe MongoDB + aplicação)

```bash
docker compose up --build
```

Em outro terminal, popule o banco com dados simulados:

```bash
docker exec -it unimove-app node seed/seed.js
```

Acesse: **http://localhost:3000**

### Opção 2 — sem Docker (MongoDB local)

1. Inicie o MongoDB local (ex.: `mongod`);
2. Instale as dependências e rode o seed:

```bash
npm install
npm run seed
npm start
```

Acesse: **http://localhost:3000**

## Estrutura do projeto

```
unimove/
├── src/
│   ├── models/        # Schemas Mongoose (Linha, Veiculo, Localizacao, Ocorrencia)
│   ├── routes/        # Rotas REST (CRUD, filtros e agregações)
│   └── server.js      # Servidor Express
├── public/            # Interface web (HTML/CSS/JS puro)
├── seed/seed.js       # Dados simulados
├── docker-compose.yml
└── package.json
```

## Destaques técnicos (para a apresentação)

- **CRUD completo** nas 4 coleções;
- **Filtros** via query string (ex.: `GET /api/ocorrencias?status=Aberta&tipo=Avaria`);
- **Agregações** `$group`, `$sort`, `$lookup` (join) e `$project` em `/api/relatorios`;
- Última localização por veículo via `$group` + `$first` após ordenação.
