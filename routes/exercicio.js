const express = require("express");
const Exercicio = require("../controllers/exercicio.js");

const router = express.Router();

router.get("/", Exercicio.listarExercicios);
router.get("/:id", Exercicio.listarExerciciosById);

//get exercicio by treino
router.get("/treino/:id_treino", Exercicio.listarExerciciosPorTreinoWSerie);

module.exports = router;
