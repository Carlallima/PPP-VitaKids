class AppError extends Error {
  constructor(statusCode, code, message, errors) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.errors = errors;
  }
}

function badRequest(message = "Requisicao invalida.") {
  return new AppError(400, "BAD_REQUEST", message);
}

function unauthorized(message = "Autenticacao obrigatoria.") {
  return new AppError(401, "UNAUTHORIZED", message);
}

function forbidden(message = "Voce nao tem permissao para acessar este recurso.") {
  return new AppError(403, "FORBIDDEN", message);
}

function notFound(message = "Recurso nao encontrado.") {
  return new AppError(404, "NOT_FOUND", message);
}

function validationError(errors) {
  return new AppError(422, "VALIDATION_ERROR", "Existem campos invalidos.", errors);
}

module.exports = {
  AppError,
  badRequest,
  forbidden,
  notFound,
  unauthorized,
  validationError,
};
