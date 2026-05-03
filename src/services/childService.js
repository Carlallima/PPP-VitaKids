const Child = require("../models/Child");
const { database } = require("./database");
const { forbidden, notFound } = require("./errors");

function listByUser(user) {
  return database.children.filter((child) => child.userId === user.id).map((child) => child.toJSON());
}

function create(user, payload) {
  const child = new Child({
    userId: user.id,
    name: payload.name.trim(),
    birthDate: payload.birthDate,
    weightKg: payload.weightKg,
  });

  database.children.push(child);
  return child.toJSON();
}

function findOwnedByUser(user, childId) {
  const child = database.children.find((item) => item.id === childId);

  if (!child) {
    throw notFound();
  }

  if (child.userId !== user.id) {
    throw forbidden();
  }

  return child;
}

function getById(user, childId) {
  return findOwnedByUser(user, childId).toJSON();
}

module.exports = {
  create,
  findOwnedByUser,
  getById,
  listByUser,
};
