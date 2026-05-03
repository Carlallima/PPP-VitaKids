const request = require("supertest");

const { createApp } = require("../../src/app");
const { resetDatabase } = require("../../src/services/database");
const children = require("../fixtures/children.json");
const { loginAndGetToken } = require("../helpers/auth.helper");
const { createChild, createChildOwnedByAnotherUser } = require("../helpers/resource.helper");
const {
  expectChildSchema,
  expectErrorSchema,
  expectValidationErrorSchema,
} = require("../helpers/schema.helper");

describe("VK-01 /children", function () {
  let expect;
  let api;
  let token;

  before(async function () {
    ({ expect } = await import("chai"));
  });

  beforeEach(async function () {
    resetDatabase();
    api = request(createApp());
    token = await loginAndGetToken(api);
  });

  describe("GET /api/v1/children", function () {
    it("VK-17 deve bloquear acesso a endpoint protegido sem autenticacao", async function () {
      const response = await api.get("/api/v1/children").expect(401);

      expectErrorSchema(expect, response.body);
      expect(response.body.code).to.equal("UNAUTHORIZED");
    });

    it("VK-22 deve listar criancas vinculadas ao responsavel", async function () {
      const child = await createChild(api, token);

      const response = await api
        .get("/api/v1/children")
        .set("Authorization", `Bearer ${token}`)
        .expect(200);

      expect(response.body).to.have.property("data").that.is.an("array").with.lengthOf(1);
      expectChildSchema(expect, response.body.data[0]);
      expect(response.body.data[0].id).to.equal(child.id);
    });

    it("VK-23 deve listar criancas sem registros cadastrados", async function () {
      const response = await api
        .get("/api/v1/children")
        .set("Authorization", `Bearer ${token}`)
        .expect(200);

      expect(response.body).to.have.property("data").that.is.an("array").and.is.empty;
      expect(response.body).to.have.property("message", "Nenhuma crianca cadastrada foi encontrada.");
    });
  });

  describe("POST /api/v1/children", function () {
    it("VK-18 deve cadastrar crianca com dados validos", async function () {
      const response = await api
        .post("/api/v1/children")
        .set("Authorization", `Bearer ${token}`)
        .send(children.validChild)
        .expect(201);

      expect(response.body).to.have.property("data").that.is.an("object");
      expect(response.body).to.have.property("message", "Crianca cadastrada com sucesso.");
      expectChildSchema(expect, response.body.data);
      expect(response.body.data).to.include(children.validChild);
    });

    it("VK-19 deve bloquear cadastro de crianca por campos obrigatorios ausentes", async function () {
      const response = await api
        .post("/api/v1/children")
        .set("Authorization", `Bearer ${token}`)
        .send(children.missingRequiredChild)
        .expect(422);

      expectValidationErrorSchema(expect, response.body);
      expect(response.body.errors.map((error) => error.field)).to.include.members(["name", "birthDate", "weightKg"]);
    });

    it("VK-20 deve bloquear cadastro de crianca por data de nascimento futura", async function () {
      const response = await api
        .post("/api/v1/children")
        .set("Authorization", `Bearer ${token}`)
        .send(children.futureBirthDateChild)
        .expect(422);

      expectValidationErrorSchema(expect, response.body);
      expect(response.body.errors.map((error) => error.field)).to.include("birthDate");
    });

    it("VK-21 deve bloquear cadastro de crianca por peso invalido", async function () {
      const response = await api
        .post("/api/v1/children")
        .set("Authorization", `Bearer ${token}`)
        .send(children.invalidWeightChild)
        .expect(422);

      expectValidationErrorSchema(expect, response.body);
      expect(response.body.errors.map((error) => error.field)).to.include("weightKg");
    });
  });

  describe("GET /api/v1/children/{childId}", function () {
    it("VK-24 deve consultar crianca vinculada ao responsavel", async function () {
      const child = await createChild(api, token);

      const response = await api
        .get(`/api/v1/children/${child.id}`)
        .set("Authorization", `Bearer ${token}`)
        .expect(200);

      expect(response.body).to.have.property("data").that.is.an("object");
      expectChildSchema(expect, response.body.data);
      expect(response.body.data.id).to.equal(child.id);
    });

    it("VK-25 deve retornar 404 para consulta de crianca inexistente", async function () {
      const response = await api
        .get("/api/v1/children/00000000-0000-4000-8000-000000000000")
        .set("Authorization", `Bearer ${token}`)
        .expect(404);

      expectErrorSchema(expect, response.body);
      expect(response.body.code).to.equal("NOT_FOUND");
    });

    it("VK-26 deve bloquear consulta de crianca de outro responsavel", async function () {
      const { child, otherToken } = await createChildOwnedByAnotherUser(api);

      const response = await api
        .get(`/api/v1/children/${child.id}`)
        .set("Authorization", `Bearer ${otherToken}`)
        .expect(403);

      expectErrorSchema(expect, response.body);
      expect(response.body.code).to.equal("FORBIDDEN");
    });
  });
});
