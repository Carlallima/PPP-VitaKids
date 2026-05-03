const childService = require("../services/childService");

function listChildren(req, res, next) {
  try {
    const data = childService.listByUser(req.user);
    const response = { data };

    if (data.length === 0) {
      response.message = "Nenhuma crianca cadastrada foi encontrada.";
    }

    return res.status(200).json(response);
  } catch (error) {
    return next(error);
  }
}

function createChild(req, res, next) {
  try {
    const data = childService.create(req.user, req.body);
    return res.status(201).json({
      data,
      message: "Crianca cadastrada com sucesso.",
    });
  } catch (error) {
    return next(error);
  }
}

function getChild(req, res, next) {
  try {
    const data = childService.getById(req.user, req.params.childId);
    return res.status(200).json({
      data,
      message: "Crianca encontrada com sucesso.",
    });
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  createChild,
  getChild,
  listChildren,
};
