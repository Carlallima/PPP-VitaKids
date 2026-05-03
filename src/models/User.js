const crypto = require("crypto");

class User {
  constructor({ name, email, password, role = "RESPONSAVEL" }) {
    this.id = crypto.randomUUID();
    this.name = name;
    this.email = email;
    this.password = password;
    this.role = role;
  }

  toJSON() {
    return {
      id: this.id,
      name: this.name,
      email: this.email,
    };
  }
}

module.exports = User;
