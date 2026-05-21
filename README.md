# 💜 Coinly — Moeda Estudantil
Plataforma de moeda digital estudantil que gamifica o desempenho acadêmico. Professores distribuem moedas como reconhecimento, e alunos as resgatam por vantagens reais em empresas parceiras.

🚧 **Em desenvolvimento**

`Spring Boot 4` `React 19` `TypeScript` `PostgreSQL` `JWT`

---

## 📚 Índice

- [Links Úteis](#-links-úteis)
- [Sobre o Projeto](#-sobre-o-projeto)
- [Funcionalidades Principais](#-funcionalidades-principais)
- [Tecnologias Utilizadas](#-tecnologias-utilizadas)
- [Instalação e Execução](#-instalação-e-execução)
- [Estrutura de Pastas](#-estrutura-de-pastas)
- [Autor](#-autor)
- [Licença](#-licença)

---

## 🔗 Links Úteis

- 📖 **Documentação da API (Swagger):** `http://localhost:8080/swagger-ui.html`
- :octocat: **Repositório:** [github.com/CaioSResende](https://github.com/CaioSResende)
- 💼 **LinkedIn:** [linkedin.com/in/caiosouzaderesende](https://linkedin.com/in/caiosouzaderesende)

---

## 📝 Sobre o Projeto

Coinly surgiu da ideia de transformar o reconhecimento acadêmico em algo tangível. Em vez de elogios informais, professores têm um saldo semestral de moedas para distribuir entre seus alunos como recompensa por bom desempenho, participação ou dedicação.

Os alunos acumulam essas moedas e as resgatam em um catálogo de vantagens — descontos, produtos e serviços — oferecidas por empresas parceiras credenciadas pela instituição. Ao resgatar, o aluno recebe um cupom por e-mail para utilizar o benefício.

O sistema contempla quatro perfis de usuário:

| Papel | Responsabilidade |
|---|---|
| **Administrador** | Gerencia instituições, professores, alunos e empresas parceiras |
| **Instituição** | Agrega os professores e alunos cadastrados |
| **Professor** | Recebe um saldo semestral e distribui moedas aos alunos |
| **Aluno** | Acumula moedas e as resgata no catálogo de vantagens |
| **Empresa Parceira** | Cadastra vantagens e recebe cupons de resgate |

---

## ✨ Funcionalidades Principais

- 🔐 **Autenticação JWT** — login seguro com tokens de acesso
- 🪙 **Envio de Moedas** — professores enviam moedas a alunos com justificativa
- 🛍️ **Catálogo de Vantagens** — alunos navegam e resgatam benefícios de empresas parceiras
- 📧 **Notificações por E-mail** — cupom enviado ao aluno no resgate e credenciais enviadas no cadastro
- 📊 **Extrato de Transações** — histórico completo de envios e resgates
- 🏢 **Gestão de Empresas Parceiras** — fluxo de aprovação (Pendente → Aprovada / Rejeitada)
- 🔑 **Recuperação de Senha** — geração e envio de senha temporária por e-mail
- 📖 **Documentação interativa** — Swagger UI integrado à API

---

## 🛠 Tecnologias Utilizadas

### ⚙️ Back-end (`coinly-api`)

| Tecnologia | Uso |
|---|---|
| Java 21 | Linguagem principal |
| Spring Boot 4.0.6 | Framework principal (Web MVC, Data JPA, Security, Mail, Validation) |
| Spring Security + JWT | Autenticação e autorização via OAuth2 Resource Server |
| PostgreSQL | Banco de dados relacional |
| Lombok | Redução de boilerplate |
| SpringDoc OpenAPI | Documentação automática da API (Swagger UI) |
| Thymeleaf | Templates HTML para e-mails |
| Gradle | Build e gerenciamento de dependências |

### 💻 Front-end (`coinly-web`)

| Tecnologia | Uso |
|---|---|
| React 19 | Framework de UI |
| TypeScript 6 | Tipagem estática |
| Vite 8 | Build tool e servidor de desenvolvimento |
| React Router DOM 7 | Roteamento SPA |

### ☁️ Infraestrutura

| Tecnologia | Uso |
|---|---|
| SendGrid | Envio de e-mails em produção |
| PostgreSQL | Banco de dados |

---

## 🔧 Instalação e Execução

### Pré-requisitos

- Java 21+
- Node.js 20+
- PostgreSQL 14+
- (Opcional) [MailHog](https://github.com/mailhog/MailHog) para testar e-mails em desenvolvimento

### 1. Banco de Dados

```sql
CREATE USER coinly WITH PASSWORD 'coinly';
CREATE DATABASE coinly OWNER coinly;
```

### 2. Back-end

```bash
cd coinly-api
./gradlew bootRun
```

Para criar o administrador inicial, defina as variáveis de ambiente:

```bash
ADMIN_EMAIL=admin@exemplo.com \
ADMIN_SENHA=senha123 \
ADMIN_NOME="Administrador" \
./gradlew bootRun
```

A API ficará disponível em `http://localhost:8080`.

### 3. Front-end

```bash
cd coinly-web
npm install
npm run dev
```

O app ficará disponível em `http://localhost:5173`.

### Variáveis de Ambiente (`coinly-api`)

| Variável | Padrão | Descrição |
|---|---|---|
| `DB_URL` | `jdbc:postgresql://localhost:5432/coinly` | URL do banco |
| `DB_USERNAME` | `coinly` | Usuário do banco |
| `DB_PASSWORD` | `coinly` | Senha do banco |
| `JWT_SECRET` | `change-me-please-...` | Segredo para assinar tokens JWT (mínimo 32 bytes) |
| `JWT_EXPIRATION_MINUTES` | `120` | Tempo de expiração do token |
| `ADMIN_EMAIL` | — | E-mail do administrador inicial |
| `ADMIN_SENHA` | — | Senha do administrador inicial |
| `ADMIN_NOME` | — | Nome do administrador inicial |
| `MAIL_PASSWORD` | — | API Key do SendGrid (produção) |
| `COINLY_MAIL_FROM` | — | Endereço remetente dos e-mails (produção) |

---

## 📂 Estrutura de Pastas

```
Coinly/
├── coinly-api/                         # Back-end Spring Boot
│   └── src/main/java/com/coinly/api/
│       ├── config/                     # Configurações (Security, OpenAPI)
│       ├── controller/                 # Endpoints REST
│       ├── domain/                     # Entidades JPA
│       ├── dto/                        # Objetos de transferência de dados
│       ├── exception/                  # Tratamento global de erros
│       ├── repository/                 # Repositórios Spring Data
│       ├── security/                   # JWT, UserDetails, Admin Seeder
│       ├── service/                    # Regras de negócio
│       └── validation/                 # Validadores customizados (CPF, CNPJ)
│
├── coinly-web/                         # Front-end React
│   └── src/
│       ├── pages/
│       │   ├── Login/
│       │   ├── ForgotPassword/
│       │   ├── HomePage/
│       │   ├── EnviarMoedas/
│       │   ├── CatalogoVantagens/
│       │   ├── Extrato/
│       │   └── Cadastro/
│       ├── components/
│       ├── hooks/
│       └── lib/
│
└── artefatos/                          # Diagramas e documentação
    ├── Diagrama de Casos de Uso.pdf
    ├── Diagrama de Classes.pdf
    ├── Diagrama de Componentes.pdf
    └── Modelo ER.png
```

---

## 👤 Autor

| 👤 Nome | :octocat: GitHub | 💼 LinkedIn | 📤 Email |
|---|---|---|---|
| Caio Souza de Resende


Estudante de Engenharia de Software @ PUC Minas · Junior Cloud Architect @ ForceOne

☁️ AWS Certified Cloud Practitioner · AI Practitioner · Solutions Architect · CloudOps Engineer

---

## 📄 Licença

Este projeto é distribuído sob a licença MIT.
