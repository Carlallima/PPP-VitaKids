const request = require("supertest");

const { createApp } = require("../../src/app");
const { resetDatabase } = require("../../src/services/database");
const exams = require("../fixtures/exams.json");
const { createChildOwnedByAnotherUser, createOwnedChild } = require("../helpers/resource.helper");
const {
  expectErrorSchema,
  expectExamSchema,
  expectValidationErrorSchema,
} = require("../helpers/schema.helper");

describe("VK-01 /children/{childId}/exams", function () {
  let expect;
  let api;

  before(async function () {
    ({ expect } = await import("chai"));
  });

  beforeEach(function () {
    resetDatabase();
    api = request(createApp());
  });

  describe("POST /api/v1/children/{childId}/exams", function () {
    it("VK-34 deve cadastrar exame com dados validos", async function () {
      const { child, token } = await createOwnedChild(api);

      const response = await api
        .post(`/api/v1/children/${child.id}/exams`)
        .set("Authorization", `Bearer ${token}`)
        .send(exams.validExam)
        .expect(201);

      expect(response.body).to.have.property("message", "Exame cadastrado com sucesso.");
      expectExamSchema(expect, response.body.data);
      expect(response.body.data).to.include({
        childId: child.id,
        ...exams.validExam,
      });
    });

    it("VK-35 deve bloquear cadastro de exame por campos obrigatorios ausentes", async function () {
      const { child, token } = await createOwnedChild(api);

      const response = await api
        .post(`/api/v1/children/${child.id}/exams`)
        .set("Authorization", `Bearer ${token}`)
        .send(exams.missingRequiredExam)
        .expect(422);

      expectValidationErrorSchema(expect, response.body);
      expect(response.body.errors.map((error) => error.field)).to.include.members(["type", "performedAt", "result"]);
    });

    it("VK-36 deve bloquear cadastro de exame por data de realizacao futura", async function () {
      const { child, token } = await createOwnedChild(api);

      const response = await api
        .post(`/api/v1/children/${child.id}/exams`)
        .set("Authorization", `Bearer ${token}`)
        .send(exams.futurePerformedAtExam)
        .expect(422);

      expectValidationErrorSchema(expect, response.body);
      expect(response.body.errors.map((error) => error.field)).to.include("performedAt");
    });

    it("VK-37 deve bloquear cadastro de exame para crianca de outro responsavel", async function () {
      const { child, otherToken } = await createChildOwnedByAnotherUser(api);

      const response = await api
        .post(`/api/v1/children/${child.id}/exams`)
        .set("Authorization", `Bearer ${otherToken}`)
        .send(exams.validExam)
        .expect(403);

      expectErrorSchema(expect, response.body);
      expect(response.body.code).to.equal("FORBIDDEN");
    });
  });

  describe("GET /api/v1/children/{childId}/exams", function () {
    it("VK-38 deve listar exames sem registros cadastrados", async function () {
      const { child, token } = await createOwnedChild(api);

      const response = await api
        .get(`/api/v1/children/${child.id}/exams`)
        .set("Authorization", `Bearer ${token}`)
        .expect(200);

      expect(response.body).to.have.property("data").that.is.an("array").and.is.empty;
      expect(response.body).to.have.property("message", "Nenhum exame foi encontrado.");
    });

    it("VK-39 deve listar exames vinculados a crianca", async function () {
      const { child, token } = await createOwnedChild(api);
      await api
        .post(`/api/v1/children/${child.id}/exams`)
        .set("Authorization", `Bearer ${token}`)
        .send(exams.validExam)
        .expect(201);

      const response = await api
        .get(`/api/v1/children/${child.id}/exams`)
        .set("Authorization", `Bearer ${token}`)
        .expect(200);

      expect(response.body).to.have.property("data").that.is.an("array").with.lengthOf(1);
      expectExamSchema(expect, response.body.data[0]);
      expect(response.body.data[0]).to.include({
        childId: child.id,
        ...exams.validExam,
      });
    });

    it("VK-40 deve bloquear listagem de exames para crianca de outro responsavel", async function () {
      const { child, otherToken } = await createChildOwnedByAnotherUser(api);

      const response = await api
        .get(`/api/v1/children/${child.id}/exams`)
        .set("Authorization", `Bearer ${otherToken}`)
        .expect(403);

      expectErrorSchema(expect, response.body);
      expect(response.body.code).to.equal("FORBIDDEN");
    });
  });
});
