<p align="center">
<img src="https://capsule-render.vercel.app/api?type=waving&color=0:E0234E,100:8B0000&height=220&section=header&text=NestJS%20Auth%20Template&fontSize=45&fontColor=ffffff&animation=fadeIn&fontAlignY=35"/>
</p>

<p align="center">

![NestJS](https://img.shields.io/badge/NestJS-Framework-E0234E?style=for-the-badge&logo=nestjs&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-Language-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![NodeJS](https://img.shields.io/badge/Node.js-Runtime-339933?style=for-the-badge&logo=node.js&logoColor=white)
![JWT](https://img.shields.io/badge/Auth-JWT-black?style=for-the-badge)
![Tests](https://img.shields.io/badge/Tests-Jest-C21325?style=for-the-badge&logo=jest)
![CI](https://img.shields.io/badge/CI-GitHub%20Actions-2088FF?style=for-the-badge&logo=githubactions&logoColor=white)

</p>

---

# 🚀 NestJS Auth Template

A **production-ready NestJS REST API template** implementing authentication, security best practices, testing and CI/CD pipeline.

This project is designed as a **solid starting point for scalable backend applications**.

---

# About

This template provides a complete authentication system built with **NestJS** and **Passport strategies**.

It includes:

- Google OAuth Authentication
- Email / Password Authentication
- JWT Access Tokens
- Refresh Token Rotation
- Passport Strategies
- Global JWT Auth Guard
- Swagger API Documentation
- Unit Tests
- E2E Tests
- CI/CD Pipeline
- Husky Git Hooks
- Lint-staged Code Quality
- SWC as the compiler

---

# Tech Stack

<p align="center">

<img src="https://skillicons.dev/icons?i=nestjs,ts,nodejs,postgres,docker,githubactions,jest,git" />

</p>

---

# Installation

1. Clone the repository

```bash
git clone https://github.com/CarMi0Proggramer/nestjs-auth-template.git
```

2. Move into the project folder

```bash
cd nestjs-auth-template
```

3. Install dependencies using pnpm

```bash
pnpm install
```

4. Create your environment file from the example:

```bash
cp .env.example .env
```

Then replace the values according to your environment.
Example .env:

```
PORT="3000"
DATABASE_URL="postgresql://user:password@localhost:5432/nest_auth_db"

JWT_SECRET="super_secret_access_token"
JWT_EXPIRES_IN="15m"

REFRESH_JWT_SECRET="super_secret_refresh_token"
REFRESH_JWT_EXPIRES_IN="7d"

GOOGLE_CLIENT_ID="your_google_client_id"
GOOGLE_SECRET="your_google_client_secret"
GOOGLE_CALLBACK_URL="http://localhost:3000/api/auth/google/callback"

FRONTEND_URL ="http://localhost:5173"
```

# Database Setup

This project uses PostgreSQL. You can use either Neon (cloud) or Docker (local).

###### Option 1 — Neon Database

Steps:

1. Create a database at: [https://neon.tech/](https://neon.tech/)
2. Copy your connection string
3. Paste it into .env

###### Option 2 - PostgreSQL with Docker

Steps:

1. Run a local PostgreSQL container

```bash
docker run -d \
--name nest-postgres \
-p 5432:5432 \
-e POSTGRES_USER=postgres \
-e POSTGRES_PASSWORD=postgres \
-e POSTGRES_DB=nest_auth_db \
postgres:18
```

2. Add your connection string

```
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/nest_auth_db
```

3. Paste it into .env

# Running the Application

- Run the development server:

```bash
pnpm run dev
```

- Build the project:

```bash
pnpm run build
```

- Start the production build:

```bash
pnpm run start
```

# Testing

- Run unit tests:

```bash
pnpm run test
```

- Run unit tests in watch mode:

```bash
pnpm run test:watch
```

- Generate coverage report::

```bash
pnpm run test:cov
```

## End-to-End Tests

- Run e2e tests:

```bash
pnpm run test:e2e
```

- Run e2e tests in watch mode:

```bash
pnpm run test:e2e:watch
```

- Generate e2e coverage:

```bash
pnpm run test:e2e:cov
```

# Database Migrations:

- Generate a migration:

```bash
pnpm run migration:generate -d ./src/database/data-source.ts ./src/database/migrations/MIGRATION_NAME
```

- Create a migration:

```bash
pnpm run migration:create -d ./src/database/data-source.ts ./src/database/migrations/MIGRATION_NAME
```

- Run migrations:

```bash
pnpm run migration:run
```

- Rollback last migration:

```bash
pnpm run migration:rollback
```

# API Documentation

Swagger documentation will be available at:

```
http://localhost:3000/api
```

Once the server is running.

# Code Quality

This project includes:

- ESLint
- Prettier
- Husky
- lint-staged

Pre-commit hooks automatically run linting and formatting.

# CI/CD

This project includes a GitHub Actions pipeline that runs automatically on:

- push
- pull_request

The pipeline runs:

- unit tests
- e2e tests
- build verification

# Contributing

Contributions are welcome.

1. Fork the repository
2. Create a new branch

```bash
git checkout -b feature/your-feature
```

3. Commit your changes using conventional commits syntax
4. Push your branch
5. Open a pull request

# License

This project is licensed under MIT License.
