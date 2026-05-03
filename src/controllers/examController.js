const examService = require("../services/examService");

function listExams(req, res, next) {
  try {
    const data = examService.listByChild(req.user, req.params.childId);
    const response = { data };

    if (data.length === 0) {
      response.message = "Nenhum exame foi encontrado.";
    }

    return res.status(200).json(response);
  } catch (error) {
    return next(error);
  }
}

function createExam(req, res, next) {
  try {
    const data = examService.create(req.user, req.params.childId, req.body);
    return res.status(201).json({
      data,
      message: "Exame cadastrado com sucesso.",
    });
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  createExam,
  listExams,
};
