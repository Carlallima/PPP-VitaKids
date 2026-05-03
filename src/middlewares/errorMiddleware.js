const { AppError } = require("../services/errors");

function notFoundHandler(req, res) {
  return res.status(404).json({
    code: "NOT_FOUND",
    message: "Recurso nao encontrado.",
  });
}

function errorHandler(err, req, res, next) {
  if (err instanceof SyntaxError && "body" in err) {
    return res.status(400).json({
      code: "BAD_REQUEST",
      message: "Requisicao invalida.",
    });
  }

  if (err instanceof AppError) {
    const body = {
      code: err.code,
      message: err.message,
    };

    if (err.errors) {
      body.errors = err.errors;
    }

    return res.status(err.statusCode).json(body);
  }

  return res.status(500).json({
    code: "INTERNAL_SERVER_ERROR",
    message: "Erro interno do servidor.",
  });
}

module.exports = {
  errorHandler,
  notFoundHandler,
};
