const express = require("express");
const Exercicio = require("../controllers/exercicio.js");

const router = express.Router();

router.get("/", Exercicio.listarExercicios);
router.get("/:id", Exercicio.listarExerciciosById);
module.exports = router;
