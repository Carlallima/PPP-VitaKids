const Exam = require("../models/Exam");
const childService = require("./childService");
const { database } = require("./database");

function listByChild(user, childId) {
  const child = childService.findOwnedByUser(user, childId);
  return database.exams.filter((exam) => exam.childId === child.id);
}

function create(user, childId, payload) {
  const child = childService.findOwnedByUser(user, childId);
  const exam = new Exam({
    childId: child.id,
    type: payload.type.trim(),
    performedAt: payload.performedAt,
    result: payload.result.trim(),
  });

  database.exams.push(exam);
  return exam;
}

module.exports = {
  create,
  listByChild,
};
