const express = require("express");
const router = express.Router();
const Treino = require("../controllers/treino.js");

// Rota para criar um novo treino
router.post("/personal/:id_personal", Treino.criarTreinoPersonal);
router.post("/aluno/:id_aluno", Treino.criarTreinoAluno);

// Rota para deletar um treino pelo ID
router.delete("/:id", Treino.deletarTreino);

// Rota para atualizar um treino pelo ID
router.put("/:id", Treino.atualizarTreino);

// Rota para atribuir um treino a um aluno
router.post("/atribuir", Treino.atribuirTreino);

// Rota para registrar uma repetição em um treino
router.post("/repeticao/:id_aluno", Treino.registrarRepeticao);

router.get("/", Treino.listarTreinos);

router.get("/:id", Treino.getTreinoById);

router.get("/personal/:id_personal", Treino.listaTreinoPersonal);

router.get("/aluno/:id_aluno", Treino.listaTreinoAluno);

module.exports = router;
