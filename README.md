# Gestão Financeira Pessoal

**Aluno:** Eduardo Ferreira Carvalho  
**Professor:** Marcelo Faria  

---

## Visão Geral

Aplicação fullstack de gestão financeira pessoal composta por:

- **Backend:** API REST em Node.js com Express, TypeScript, Prisma ORM e PostgreSQL
- **Frontend:** Aplicativo mobile em React Native com Expo

---

## Pré-requisitos

Para rodar o backend, é necessário ter instalado:

- [Docker Desktop](https://www.docker.com/products/docker-desktop/)

Para rodar o frontend, é necessário ter instalado:

- [Node.js](https://nodejs.org/) (versão 18 ou superior)
- [Expo Go](https://expo.dev/go) no celular (para visualizar o app)

---

## Como Rodar o Backend

O backend utiliza Docker para garantir que o banco de dados PostgreSQL e a API subam corretamente em qualquer ambiente, sem necessidade de configuração manual.

### Passo 1 — Abrir o terminal na pasta do backend

```
cd backend-final
```

### Passo 2 — Subir os containers

```
docker-compose up --build
```

Esse comando irá automaticamente:

1. Baixar e iniciar o banco de dados PostgreSQL
2. Instalar as dependências do projeto
3. Gerar o Prisma Client
4. Executar as migrations (criação das tabelas)
5. Popular o banco com as categorias padrão (seed)
6. Iniciar o servidor da API

### Passo 3 — Verificar se está funcionando

Acesse no navegador: **http://localhost:3000**

A resposta esperada é:

```json
{
  "status": "ok",
  "message": "Gestão Financeira API"
}
```

### Parar o servidor

```
docker-compose down
```

---

## Como Rodar o Frontend

### Passo 1 — Abrir o terminal na pasta do frontend

```
cd gestao-financeira-fixed
```

### Passo 2 — Instalar as dependências

```
npm install
```

### Passo 3 — Iniciar o projeto

```
npx expo start
```

### Passo 4 — Abrir no celular

Instale o app **Expo Go** no celular e escolha uma das opções abaixo:

---

#### Opção A — Mesma rede Wi-Fi (mais simples)

Se o celular e o computador estiverem na **mesma rede Wi-Fi**, basta escanear o QR code exibido no terminal com o Expo Go.

---

#### Opção B — Redes diferentes (Tunnel)

Se o celular e o computador estiverem em redes diferentes, pressione a tecla **T** no terminal após rodar `npx expo start`. O Expo ativará o modo tunnel e gerará um QR code que funciona em qualquer rede.

```
npx expo start
# Quando o terminal abrir, pressione: T
```

---

> **Importante:** o backend e o frontend devem rodar no **mesmo computador**. O frontend está configurado para se comunicar com `http://localhost:3000`.

---

## Endpoints da API

| Método   | Rota                  | Descrição                              |
|----------|-----------------------|----------------------------------------|
| GET      | `/`                   | Health check da API                    |
| GET      | `/categories`         | Lista todas as categorias              |
| POST     | `/categories`         | Cria uma nova categoria                |
| PUT      | `/categories/:id`     | Atualiza uma categoria                 |
| DELETE   | `/categories/:id`     | Remove uma categoria                   |
| GET      | `/transactions`       | Lista transações (filtra por mês/ano)  |
| POST     | `/transactions`       | Cria uma nova transação                |
| DELETE   | `/transactions/:id`   | Remove uma transação                   |

---

## Estrutura do Projeto

```
backend-final/
├── prisma/
│   ├── migrations/        # Histórico de migrations do banco
│   ├── schema.prisma      # Modelo do banco de dados
│   └── seed.ts            # Dados iniciais (categorias padrão)
├── src/
│   ├── controllers/       # Lógica de cada rota
│   ├── middleware/        # Tratamento de erros
│   ├── routes/            # Definição das rotas
│   └── server.ts          # Entrada da aplicação
├── Dockerfile             # Imagem Docker da API
├── docker-compose.yml     # Orquestração da API + banco de dados
└── entrypoint.sh          # Script de inicialização automática

gestao-financeira-fixed/
├── app/
│   ├── (tabs)/
│   │   ├── index.jsx             # Tela de transações
│   │   ├── add-transactions.jsx  # Tela de adicionar transação
│   │   └── summary.jsx           # Tela de resumo e gráfico
│   ├── welcome.jsx               # Tela de boas-vindas
│   └── _layout.jsx               # Layout raiz
├── components/                   # Componentes reutilizáveis
├── contexts/
│   └── GlobalState.jsx           # Estado global da aplicação
├── services/
│   └── api.js                    # Comunicação com o backend
└── constants/                    # Cores e categorias
```

---

## Tecnologias Utilizadas

| Camada      | Tecnologia                          |
|-------------|-------------------------------------|
| Frontend    | React Native, Expo, Expo Router     |
| Backend     | Node.js, Express, TypeScript        |
| Banco       | PostgreSQL                          |
| ORM         | Prisma                              |
| Containers  | Docker, Docker Compose              |
| Validação   | Zod                                 |

