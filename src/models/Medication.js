const crypto = require("crypto");

class Medication {
  constructor({ childId, name, doseTime, doseQuantity }) {
    const timestamp = new Date().toISOString();

    this.id = crypto.randomUUID();
    this.childId = childId;
    this.name = name;
    this.doseTime = doseTime;
    this.doseQuantity = doseQuantity;
    this.createdAt = timestamp;
    this.updatedAt = timestamp;
  }
}

module.exports = Medication;
