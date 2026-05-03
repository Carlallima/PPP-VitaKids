const children = require("../fixtures/children.json");
const users = require("../fixtures/users.json");
const { loginAndGetToken } = require("./auth.helper");

async function createChild(request, token, payload = children.validChild) {
  const response = await request
    .post("/api/v1/children")
    .set("Authorization", `Bearer ${token}`)
    .send(payload);

  return response.body.data;
}

async function createOwnedChild(request) {
  const token = await loginAndGetToken(request, users.validUser);
  const child = await createChild(request, token);
  return { child, token };
}

async function createChildOwnedByAnotherUser(request) {
  const ownerToken = await loginAndGetToken(request, users.validUser);
  const child = await createChild(request, ownerToken);
  const otherToken = await loginAndGetToken(request, users.secondUser);
  return { child, otherToken, ownerToken };
}

module.exports = {
  createChild,
  createChildOwnedByAnotherUser,
  createOwnedChild,
};
