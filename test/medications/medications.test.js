const request = require("supertest");

const { createApp } = require("../../src/app");
const { resetDatabase } = require("../../src/services/database");
const medications = require("../fixtures/medications.json");
const {
  createChild,
  createChildOwnedByAnotherUser,
  createOwnedChild,
} = require("../helpers/resource.helper");
const {
  expectErrorSchema,
  expectMedicationSchema,
  expectValidationErrorSchema,
} = require("../helpers/schema.helper");

describe("VK-01 /children/{childId}/medications", function () {
  let expect;
  let api;

  before(async function () {
    ({ expect } = await import("chai"));
  });

  beforeEach(function () {
    resetDatabase();
    api = request(createApp());
  });

  describe("POST /api/v1/children/{childId}/medications", function () {
    it("VK-27 deve bloquear cadastro de medicamento por horario invalido", async function () {
      const { child, token } = await createOwnedChild(api);

      const response = await api
        .post(`/api/v1/children/${child.id}/medications`)
        .set("Authorization", `Bearer ${token}`)
        .send(medications.invalidDoseTimeMedication)
        .expect(422);

      expectValidationErrorSchema(expect, response.body);
      expect(response.body.errors.map((error) => error.field)).to.include("doseTime");
    });

    it("VK-28 deve cadastrar medicamento com dados validos", async function () {
      const { child, token } = await createOwnedChild(api);

      const response = await api
        .post(`/api/v1/children/${child.id}/medications`)
        .set("Authorization", `Bearer ${token}`)
        .send(medications.validMedication)
        .expect(201);

      expect(response.body).to.have.property("message", "Medicamento cadastrado com sucesso.");
      expectMedicationSchema(expect, response.body.data);
      expect(response.body.data).to.include({
        childId: child.id,
        ...medications.validMedication,
      });
    });

    it("VK-29 deve bloquear cadastro de medicamento por quantidade invalida", async function () {
      const { child, token } = await createOwnedChild(api);

      const response = await api
        .post(`/api/v1/children/${child.id}/medications`)
        .set("Authorization", `Bearer ${token}`)
        .send(medications.invalidDoseQuantityMedication)
        .expect(422);

      expectValidationErrorSchema(expect, response.body);
      expect(response.body.errors.map((error) => error.field)).to.include("doseQuantity");
    });

    it("VK-30 deve bloquear cadastro de medicamento para crianca de outro responsavel", async function () {
      const { child, otherToken } = await createChildOwnedByAnotherUser(api);

      const response = await api
        .post(`/api/v1/children/${child.id}/medications`)
        .set("Authorization", `Bearer ${otherToken}`)
        .send(medications.validMedication)
        .expect(403);

      expectErrorSchema(expect, response.body);
      expect(response.body.code).to.equal("FORBIDDEN");
    });
  });

  describe("GET /api/v1/children/{childId}/medications", function () {
    it("VK-31 deve listar medicamentos sem registros cadastrados", async function () {
      const { child, token } = await createOwnedChild(api);

      const response = await api
        .get(`/api/v1/children/${child.id}/medications`)
        .set("Authorization", `Bearer ${token}`)
        .expect(200);

      expect(response.body).to.have.property("data").that.is.an("array").and.is.empty;
      expect(response.body).to.have.property("message", "Nenhum medicamento foi encontrado.");
    });

    it("VK-32 deve listar medicamentos vinculados a crianca", async function () {
      const { child, token } = await createOwnedChild(api);
      await api
        .post(`/api/v1/children/${child.id}/medications`)
        .set("Authorization", `Bearer ${token}`)
        .send(medications.validMedication)
        .expect(201);

      const response = await api
        .get(`/api/v1/children/${child.id}/medications`)
        .set("Authorization", `Bearer ${token}`)
        .expect(200);

      expect(response.body).to.have.property("data").that.is.an("array").with.lengthOf(1);
      expectMedicationSchema(expect, response.body.data[0]);
      expect(response.body.data[0]).to.include({
        childId: child.id,
        ...medications.validMedication,
      });
    });

    it("VK-33 deve bloquear listagem de medicamentos para crianca de outro responsavel", async function () {
      const { child, otherToken } = await createChildOwnedByAnotherUser(api);

      const response = await api
        .get(`/api/v1/children/${child.id}/medications`)
        .set("Authorization", `Bearer ${otherToken}`)
        .expect(403);

      expectErrorSchema(expect, response.body);
      expect(response.body.code).to.equal("FORBIDDEN");
    });
  });
});
