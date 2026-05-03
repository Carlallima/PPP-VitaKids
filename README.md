# VitaKids API

API REST do MVP VitaKids implementada com Node.js, Express, JWT e banco de dados em memoria. A implementacao segue o contrato definido em `docs/swagger.yaml`.

## Requisitos

- Node.js 18 ou superior
- npm

## Instalacao

```bash
npm install
```

## Execucao

```bash
npm start
```

A API ficara disponivel em:

```text
http://localhost:3000/api/v1
```

A documentacao Swagger UI ficara disponivel em:

```text
http://localhost:3000/api-docs
```

## Testar

```bash
npm test
```

## Fluxo de autenticacao

O Swagger atual define cadastro e login de responsaveis. Para testar o fluxo protegido, cadastre um usuario, faca login e use o token retornado no header `Authorization`.

### 1. Registrar responsavel

```bash
curl -X POST http://localhost:3000/api/v1/auth/register ^
  -H "Content-Type: application/json" ^
  -d "{\"name\":\"Carla Lima\",\"email\":\"carla@example.com\",\"password\":\"Senha@123\"}"
```

Resposta esperada: `201 Created`.

### 2. Login

```bash
curl -X POST http://localhost:3000/api/v1/auth/login ^
  -H "Content-Type: application/json" ^
  -d "{\"email\":\"carla@example.com\",\"password\":\"Senha@123\"}"
```

Copie o valor de `data.token` retornado.

### 3. Criar crianca usando JWT

```bash
curl -X POST http://localhost:3000/api/v1/children ^
  -H "Content-Type: application/json" ^
  -H "Authorization: Bearer SEU_TOKEN" ^
  -d "{\"name\":\"Ana Lima\",\"birthDate\":\"2021-04-18\",\"weightKg\":18.5}"
```

Resposta esperada: `201 Created`.

### 4. Listar criancas

```bash
curl http://localhost:3000/api/v1/children ^
  -H "Authorization: Bearer SEU_TOKEN"
```

## Rotas implementadas

- `GET /api/v1/health`
- `POST /api/v1/auth/register`
- `POST /api/v1/auth/login`
- `GET /api/v1/children`
- `POST /api/v1/children`
- `GET /api/v1/children/:childId`
- `GET /api/v1/children/:childId/medications`
- `POST /api/v1/children/:childId/medications`
- `GET /api/v1/children/:childId/exams`
- `POST /api/v1/children/:childId/exams`
- `GET /api-docs`

## Banco em memoria

Os dados sao mantidos apenas enquanto o processo Node.js esta em execucao. Ao reiniciar o servidor, usuarios, criancas, medicamentos e exames sao apagados.
