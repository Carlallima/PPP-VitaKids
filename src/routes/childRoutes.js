const express = require("express");

const childController = require("../controllers/childController");
const examController = require("../controllers/examController");
const medicationController = require("../controllers/medicationController");
const { authenticate } = require("../middlewares/authMiddleware");
const {
  validateChild,
  validateExam,
  validateMedication,
  validateUuidParam,
} = require("../middlewares/validationMiddleware");

const router = express.Router();

router.use(authenticate);

router.get("/", childController.listChildren);
router.post("/", validateChild, childController.createChild);
router.get("/:childId", validateUuidParam("childId"), childController.getChild);

router.get("/:childId/medications", validateUuidParam("childId"), medicationController.listMedications);
router.post("/:childId/medications", validateUuidParam("childId"), validateMedication, medicationController.createMedication);

router.get("/:childId/exams", validateUuidParam("childId"), examController.listExams);
router.post("/:childId/exams", validateUuidParam("childId"), validateExam, examController.createExam);

module.exports = router;
