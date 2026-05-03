const request = require("supertest");

const { createApp } = require("../../src/app");
const { resetDatabase } = require("../../src/services/database");
const users = require("../fixtures/users.json");
const {
  expectAuthLoginSchema,
  expectErrorSchema,
  expectUserSchema,
  expectValidationErrorSchema,
} = require("../helpers/schema.helper");

describe("VK-01 /auth", function () {
  let expect;
  let api;

  before(async function () {
    ({ expect } = await import("chai"));
  });

  beforeEach(function () {
    resetDatabase();
    api = request(createApp());
  });

  describe("POST /api/v1/auth/register", function () {
    it("VK-10 deve cadastrar responsavel com dados validos", async function () {
      const response = await api
        .post("/api/v1/auth/register")
        .send(users.validUser)
        .expect(201);

      expect(response.body).to.have.property("data").that.is.an("object");
      expect(response.body).to.have.property("message", "Usuario cadastrado com sucesso.");
      expectUserSchema(expect, response.body.data);
      expect(response.body.data.email).to.equal(users.validUser.email);
    });

    it("VK-11 deve bloquear cadastro por e-mail invalido", async function () {
      const response = await api
        .post("/api/v1/auth/register")
        .send({
          name: users.validUser.name,
          email: "email-invalido",
          password: users.validUser.password,
        })
        .expect(422);

      expectValidationErrorSchema(expect, response.body);
      expect(response.body.code).to.equal("VALIDATION_ERROR");
      expect(response.body.errors.map((error) => error.field)).to.include("email");
    });

    it("VK-12 deve bloquear cadastro por e-mail ja existente", async function () {
      await api.post("/api/v1/auth/register").send(users.validUser).expect(201);

      const response = await api
        .post("/api/v1/auth/register")
        .send(users.validUser)
        .expect(409);

      expectErrorSchema(expect, response.body);
      expect(response.body.code).to.equal("EMAIL_ALREADY_EXISTS");
    });

    it("VK-13 deve bloquear cadastro por campos obrigatorios ausentes", async function () {
      const response = await api.post("/api/v1/auth/register").send({}).expect(422);

      expectValidationErrorSchema(expect, response.body);
      expect(response.body.errors.map((error) => error.field)).to.include.members(["name", "email", "password"]);
    });
  });

  describe("POST /api/v1/auth/login", function () {
    beforeEach(async function () {
      await api.post("/api/v1/auth/register").send(users.validUser).expect(201);
    });

    it("VK-14 deve realizar login com credenciais validas", async function () {
      const response = await api
        .post("/api/v1/auth/login")
        .send({
          email: users.validUser.email,
          password: users.validUser.password,
        })
        .expect(200);

      expectAuthLoginSchema(expect, response.body);
      expect(response.body.data.user.email).to.equal(users.validUser.email);
    });

    it("VK-15 deve bloquear login por credenciais invalidas", async function () {
      const response = await api
        .post("/api/v1/auth/login")
        .send(users.invalidLogin)
        .expect(401);

      expectErrorSchema(expect, response.body);
      expect(response.body.code).to.equal("UNAUTHORIZED");
    });

    it("VK-16 deve bloquear login por payload invalido", async function () {
      const response = await api
        .post("/api/v1/auth/login")
        .send(users.invalidLoginPayload)
        .expect(422);

      expectValidationErrorSchema(expect, response.body);
      expect(response.body.errors.map((error) => error.field)).to.include.members(["email", "password"]);
    });
  });
});
