const express = require("express");

const authRoutes = require("./authRoutes");
const childRoutes = require("./childRoutes");

const router = express.Router();

router.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

router.use("/auth", authRoutes);
router.use("/children", childRoutes);

module.exports = router;
