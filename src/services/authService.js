const jwt = require("jsonwebtoken");

const User = require("../models/User");
const { database } = require("./database");
const { AppError, unauthorized } = require("./errors");

const JWT_SECRET = process.env.JWT_SECRET || "vitakids-mvp-secret";
const TOKEN_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "2h";

function normalizeEmail(email) {
  return email.trim().toLowerCase();
}

function publicUser(user) {
  return user.toJSON();
}

function register(payload) {
  const email = normalizeEmail(payload.email);
  const alreadyExists = database.users.some((user) => user.email === email);

  if (alreadyExists) {
    throw new AppError(409, "EMAIL_ALREADY_EXISTS", "E-mail ja cadastrado.");
  }

  const user = new User({
    name: payload.name.trim(),
    email,
    password: payload.password,
    role: payload.role || "RESPONSAVEL",
  });

  database.users.push(user);

  return publicUser(user);
}

function login(payload) {
  const email = normalizeEmail(payload.email);
  const user = database.users.find((item) => item.email === email && item.password === payload.password);

  if (!user) {
    throw unauthorized("E-mail ou senha incorretos.");
  }

  const token = jwt.sign(
    {
      sub: user.id,
      email: user.email,
      role: user.role,
    },
    JWT_SECRET,
    { expiresIn: TOKEN_EXPIRES_IN },
  );

  return {
    token,
    tokenType: "Bearer",
    user: publicUser(user),
  };
}

function verifyToken(token) {
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = database.users.find((item) => item.id === decoded.sub);

    if (!user) {
      throw unauthorized();
    }

    return user;
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }

    throw unauthorized();
  }
}

module.exports = {
  login,
  publicUser,
  register,
  verifyToken,
};
