const authService = require("../services/authService");

function authenticate(req, res, next) {
  const authorization = req.get("authorization") || "";
  const [scheme, token] = authorization.split(" ");

  if (scheme !== "Bearer" || !token) {
    return res.status(401).json({
      code: "UNAUTHORIZED",
      message: "Autenticacao obrigatoria.",
    });
  }

  try {
    req.user = authService.verifyToken(token);
    return next();
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  authenticate,
};
