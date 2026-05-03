const medicationService = require("../services/medicationService");

function listMedications(req, res, next) {
  try {
    const data = medicationService.listByChild(req.user, req.params.childId);
    const response = { data };

    if (data.length === 0) {
      response.message = "Nenhum medicamento foi encontrado.";
    }

    return res.status(200).json(response);
  } catch (error) {
    return next(error);
  }
}

function createMedication(req, res, next) {
  try {
    const data = medicationService.create(req.user, req.params.childId, req.body);
    return res.status(201).json({
      data,
      message: "Medicamento cadastrado com sucesso.",
    });
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  createMedication,
  listMedications,
};
