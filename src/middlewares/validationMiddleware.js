const { validationError } = require("../services/errors");

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const TIME_PATTERN = /^([01][0-9]|2[0-3]):[0-5][0-9]$/;
const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function isPlainObject(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function requiredString(body, field, minLength, maxLength, errors) {
  if (typeof body[field] !== "string") {
    errors.push({ field, message: "Informe um texto valido." });
    return;
  }

  const value = body[field].trim();
  if (value.length < minLength) {
    errors.push({ field, message: "Campo obrigatorio." });
  }

  if (value.length > maxLength) {
    errors.push({ field, message: `Informe no maximo ${maxLength} caracteres.` });
  }
}

function isValidDateOnly(value) {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return false;
  }

  const date = new Date(`${value}T00:00:00.000Z`);
  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value;
}

function isFutureDateOnly(value) {
  const input = new Date(`${value}T00:00:00.000Z`);
  const now = new Date();
  const today = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
  return input.getTime() > today.getTime();
}

function validateBody(validate) {
  return (req, res, next) => {
    if (!isPlainObject(req.body)) {
      return next(validationError([{ field: "body", message: "Informe um JSON valido." }]));
    }

    const errors = validate(req.body);
    if (errors.length > 0) {
      return next(validationError(errors));
    }

    return next();
  };
}

function validateUuidParam(paramName) {
  return (req, res, next) => {
    if (!UUID_PATTERN.test(req.params[paramName])) {
      return res.status(404).json({
        code: "NOT_FOUND",
        message: "Recurso nao encontrado.",
      });
    }

    return next();
  };
}

const validateRegister = validateBody((body) => {
  const errors = [];
  requiredString(body, "name", 1, 120, errors);
  requiredString(body, "email", 1, 255, errors);
  requiredString(body, "password", 8, 128, errors);

  if (typeof body.email === "string" && !EMAIL_PATTERN.test(body.email.trim())) {
    errors.push({ field: "email", message: "Informe um e-mail valido." });
  }

  return errors;
});

const validateLogin = validateBody((body) => {
  const errors = [];
  requiredString(body, "email", 1, 255, errors);
  requiredString(body, "password", 1, 128, errors);

  if (typeof body.email === "string" && !EMAIL_PATTERN.test(body.email.trim())) {
    errors.push({ field: "email", message: "Informe um e-mail valido." });
  }

  return errors;
});

const validateChild = validateBody((body) => {
  const errors = [];
  requiredString(body, "name", 1, 120, errors);

  if (!isValidDateOnly(body.birthDate)) {
    errors.push({ field: "birthDate", message: "Informe uma data valida no formato YYYY-MM-DD." });
  } else if (isFutureDateOnly(body.birthDate)) {
    errors.push({ field: "birthDate", message: "A data de nascimento nao pode ser futura." });
  }

  if (typeof body.weightKg !== "number" || !Number.isFinite(body.weightKg)) {
    errors.push({ field: "weightKg", message: "Informe um peso numerico valido." });
  } else if (body.weightKg < 0.1 || body.weightKg > 300) {
    errors.push({ field: "weightKg", message: "Informe um peso entre 0.1 e 300 kg." });
  }

  return errors;
});

const validateMedication = validateBody((body) => {
  const errors = [];
  requiredString(body, "name", 1, 120, errors);

  if (typeof body.doseTime !== "string" || !TIME_PATTERN.test(body.doseTime)) {
    errors.push({ field: "doseTime", message: "Informe um horario valido no formato HH:mm." });
  }

  if (!Number.isInteger(body.doseQuantity)) {
    errors.push({ field: "doseQuantity", message: "Informe uma quantidade inteira de doses." });
  } else if (body.doseQuantity < 1 || body.doseQuantity > 100) {
    errors.push({ field: "doseQuantity", message: "Informe uma quantidade entre 1 e 100." });
  }

  return errors;
});

const validateExam = validateBody((body) => {
  const errors = [];
  requiredString(body, "type", 1, 120, errors);
  requiredString(body, "result", 1, 2000, errors);

  if (!isValidDateOnly(body.performedAt)) {
    errors.push({ field: "performedAt", message: "Informe uma data valida no formato YYYY-MM-DD." });
  } else if (isFutureDateOnly(body.performedAt)) {
    errors.push({ field: "performedAt", message: "A data de realizacao nao pode ser futura." });
  }

  return errors;
});

module.exports = {
  validateChild,
  validateExam,
  validateLogin,
  validateMedication,
  validateRegister,
  validateUuidParam,
};
