const database = {
  users: [],
  children: [],
  medications: [],
  exams: [],
};

function resetDatabase() {
  database.users.length = 0;
  database.children.length = 0;
  database.medications.length = 0;
  database.exams.length = 0;
}

module.exports = {
  database,
  resetDatabase,
};
