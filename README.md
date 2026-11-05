# 🚍 Unimove - Sistema de Monitoramento e Gestão de Frotas

Aplicação full-stack desenvolvida em **Node.js** (com Express - responsável por gerir a comunicação do servidor (receber os pedidos do utilizador/frontend, processar e devolver respostas) e Mongoose - responsável por conversar com a base de dados (organizar, validar e estruturar como os dados dos ônibus, linhas e ocorrências são salvos no MongoDB)) e **MongoDB**, projetada para o controlo operacional de frotas de transporte público.

## ⚙️ Arquitetura e Módulos (Models)
O sistema está estruturado nos seguintes domínios principais localizados em `src/models/`:
* **Veículos (`Veiculo.js`)**: Gerenciamento e cadastro da frota ativa de veículos/autocarros.
* **Linhas (`Linha.js`)**: Controlo de rotas, itinerários e tarifas associadas.
* **Localizações (`Localizacao.js`)**: Monitoramento geoespacial (latitude, longitude e velocidade) e posicionamento em tempo real dos veículos.
* **Ocorrências (`Ocorrencia.js`)**: Registo de incidentes, falhas operacionais ou desvios de rota.
* **Relatórios (`src/routes/relatorios.js`)**: Consolidação de dados para análises gerenciais.

## 🗄️ Base de Dados e Dados de Exemplo (MongoDB Atlas)
O projeto inclui um script automatizado de povoamento (*seed*) localizado em `seed/seed.js`. Este script liga-se ao MongoDB Atlas, limpa dados anteriores e cria automaticamente as coleções (`veiculos`, `linhas`, `localizacoes`, `ocorrencias`) inserindo documentos de teste para validação imediata do sistema[cite: 1].

## 🚀 Como Executar o Projeto

1. Instale as dependências do projeto:
   ```bash
   npm install
