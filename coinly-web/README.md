# Coinly Web — Front-end

Front-end React + TypeScript com as telas de **CRUD de Alunos** e **CRUD de Empresas Parceiras** do sistema Coinly.

## Stack

- React 18 + TypeScript
- Vite (dev server e build)
- React Router v6
- `fetch` nativo (sem libs HTTP extras)

## Como rodar

```bash
# 1. Instale as dependências
npm install

# 2. Garanta que o backend (coinly-api) esteja rodando em http://localhost:8080

# 3. Suba o front em modo dev
npm run dev
```

Abra `http://localhost:5173`.

## Como funciona a comunicação com o back

O Vite está configurado com **proxy** em `vite.config.ts`:

```
/api/*  ->  http://localhost:8080/api/*
```

Ou seja, todas as requisições do front são feitas para `/api/...`
(ex: `/api/alunos`) e o Vite redireciona automaticamente para o backend
local. **Não foi alterado nada no back-end** — não precisa configurar CORS.

Se precisar mudar a porta/host do backend, edite `vite.config.ts`.

## Estrutura

```
src/
├── App.tsx                 # Rotas
├── main.tsx                # Entry point
├── components/             # Layout, Modal, Alert, StatusBadge
├── pages/
│   ├── HomePage.tsx
│   ├── alunos/             # AlunosPage + AlunoForm
│   └── empresas/           # EmpresasPage + EmpresaForm
├── services/               # http.ts + serviços de cada recurso
├── types/api.ts            # Tipos espelhando os DTOs do back
├── utils/format.ts         # Máscaras + validação CPF/CNPJ
└── styles/global.css       # CSS global
```

## Funcionalidades

### Alunos (`/alunos`)
- Listar todos os alunos com saldo de moedas e instituição
- Buscar por nome, e-mail, CPF ou curso
- Cadastrar novo aluno (com seleção de instituição)
- Editar dados (CPF não é alterável, conforme back)
- Remover aluno
- Validação de CPF e e-mail no client-side antes de enviar

### Empresas (`/empresas`)
- Listar todas as empresas com status (Pendente / Aprovada / Rejeitada)
- Filtrar por status
- Buscar por nome, e-mail ou CNPJ
- Cadastrar nova empresa (entra como `PENDENTE`)
- Aprovar ou Rejeitar empresas pendentes
- Editar dados (CNPJ não alterável, conforme back)
- Remover empresa
- Validação de CNPJ e e-mail no client-side

## Endpoints consumidos

| Método | URL                              |
|--------|----------------------------------|
| GET    | `/api/alunos`                    |
| GET    | `/api/alunos/{id}`               |
| POST   | `/api/alunos`                    |
| PUT    | `/api/alunos/{id}`               |
| DELETE | `/api/alunos/{id}`               |
| GET    | `/api/empresas?status=...`       |
| POST   | `/api/empresas`                  |
| PUT    | `/api/empresas/{id}`             |
| PATCH  | `/api/empresas/{id}/aprovar`     |
| PATCH  | `/api/empresas/{id}/rejeitar`    |
| DELETE | `/api/empresas/{id}`             |
| GET    | `/api/instituicoes` (para combo) |
