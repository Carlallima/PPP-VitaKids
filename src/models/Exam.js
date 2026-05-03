const crypto = require("crypto");

class Exam {
  constructor({ childId, type, performedAt, result }) {
    const timestamp = new Date().toISOString();

    this.id = crypto.randomUUID();
    this.childId = childId;
    this.type = type;
    this.performedAt = performedAt;
    this.result = result;
    this.createdAt = timestamp;
    this.updatedAt = timestamp;
  }
}

module.exports = Exam;
