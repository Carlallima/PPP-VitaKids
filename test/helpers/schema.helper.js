const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

function expectErrorSchema(expect, body) {
  expect(body).to.be.an("object");
  expect(body).to.have.property("code").that.is.a("string");
  expect(body).to.have.property("message").that.is.a("string");
}

function expectValidationErrorSchema(expect, body) {
  expectErrorSchema(expect, body);
  expect(body).to.have.property("errors").that.is.an("array").and.is.not.empty;
  body.errors.forEach((error) => {
    expect(error).to.have.property("field").that.is.a("string");
    expect(error).to.have.property("message").that.is.a("string");
  });
}

function expectUserSchema(expect, user) {
  expect(user).to.include.keys(["id", "name", "email"]);
  expect(user.id).to.match(UUID_PATTERN);
  expect(user.name).to.be.a("string").and.not.empty;
  expect(user.email).to.be.a("string").and.include("@");
  expect(user).to.not.have.property("password");
}

function expectAuthLoginSchema(expect, body) {
  expect(body).to.have.property("data").that.is.an("object");
  expect(body.data).to.include.keys(["token", "tokenType", "user"]);
  expect(body.data.token).to.be.a("string").and.not.empty;
  expect(body.data.tokenType).to.equal("Bearer");
  expectUserSchema(expect, body.data.user);
}

function expectChildSchema(expect, child) {
  expect(child).to.include.keys(["id", "name", "birthDate", "weightKg", "createdAt", "updatedAt"]);
  expect(child.id).to.match(UUID_PATTERN);
  expect(child.name).to.be.a("string").and.not.empty;
  expect(child.birthDate).to.match(DATE_PATTERN);
  expect(child.weightKg).to.be.a("number");
  expect(new Date(child.createdAt).toString()).to.not.equal("Invalid Date");
  expect(new Date(child.updatedAt).toString()).to.not.equal("Invalid Date");
}

function expectMedicationSchema(expect, medication) {
  expect(medication).to.include.keys(["id", "childId", "name", "doseTime", "doseQuantity", "createdAt", "updatedAt"]);
  expect(medication.id).to.match(UUID_PATTERN);
  expect(medication.childId).to.match(UUID_PATTERN);
  expect(medication.name).to.be.a("string").and.not.empty;
  expect(medication.doseTime).to.match(/^([01][0-9]|2[0-3]):[0-5][0-9]$/);
  expect(medication.doseQuantity).to.be.a("number");
  expect(new Date(medication.createdAt).toString()).to.not.equal("Invalid Date");
  expect(new Date(medication.updatedAt).toString()).to.not.equal("Invalid Date");
}

function expectExamSchema(expect, exam) {
  expect(exam).to.include.keys(["id", "childId", "type", "performedAt", "result", "createdAt", "updatedAt"]);
  expect(exam.id).to.match(UUID_PATTERN);
  expect(exam.childId).to.match(UUID_PATTERN);
  expect(exam.type).to.be.a("string").and.not.empty;
  expect(exam.performedAt).to.match(DATE_PATTERN);
  expect(exam.result).to.be.a("string").and.not.empty;
  expect(new Date(exam.createdAt).toString()).to.not.equal("Invalid Date");
  expect(new Date(exam.updatedAt).toString()).to.not.equal("Invalid Date");
}

module.exports = {
  expectAuthLoginSchema,
  expectChildSchema,
  expectExamSchema,
  expectErrorSchema,
  expectMedicationSchema,
  expectUserSchema,
  expectValidationErrorSchema,
};
