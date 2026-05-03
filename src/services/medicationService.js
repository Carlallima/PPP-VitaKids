const Medication = require("../models/Medication");
const childService = require("./childService");
const { database } = require("./database");

function listByChild(user, childId) {
  const child = childService.findOwnedByUser(user, childId);
  return database.medications.filter((medication) => medication.childId === child.id);
}

function create(user, childId, payload) {
  const child = childService.findOwnedByUser(user, childId);
  const medication = new Medication({
    childId: child.id,
    name: payload.name.trim(),
    doseTime: payload.doseTime,
    doseQuantity: payload.doseQuantity,
  });

  database.medications.push(medication);
  return medication;
}

module.exports = {
  create,
  listByChild,
};
