const authService = require("../services/authService");

function register(req, res, next) {
  try {
    const user = authService.register(req.body);
    return res.status(201).json({
      data: user,
      message: "Usuario cadastrado com sucesso.",
    });
  } catch (error) {
    return next(error);
  }
}

function login(req, res, next) {
  try {
    const data = authService.login(req.body);
    return res.status(200).json({ data });
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  login,
  register,
};
