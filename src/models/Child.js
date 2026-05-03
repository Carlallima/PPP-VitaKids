const crypto = require("crypto");

class Child {
  constructor({ userId, name, birthDate, weightKg }) {
    const timestamp = new Date().toISOString();

    this.id = crypto.randomUUID();
    this.userId = userId;
    this.name = name;
    this.birthDate = birthDate;
    this.weightKg = weightKg;
    this.createdAt = timestamp;
    this.updatedAt = timestamp;
  }

  toJSON() {
    return {
      id: this.id,
      name: this.name,
      birthDate: this.birthDate,
      weightKg: this.weightKg,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}

module.exports = Child;
