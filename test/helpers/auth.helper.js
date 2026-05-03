const users = require("../fixtures/users.json");

async function registerUser(request, user = users.validUser) {
  return request.post("/api/v1/auth/register").send(user);
}

async function login(request, credentials = users.validUser) {
  return request
    .post("/api/v1/auth/login")
    .send({
      email: credentials.email,
      password: credentials.password,
    });
}

async function loginAndGetToken(request, user = users.validUser) {
  await registerUser(request, user);
  const response = await login(request, user);
  return response.body.data.token;
}

module.exports = {
  login,
  loginAndGetToken,
  registerUser,
};
