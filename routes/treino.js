const express = require("express");
const router = express.Router();
const Treino = require("../controllers/treino.js");

// Rota para criar um novo treino
router.post("/personal/:id_personal", Treino.criarTreinoPersonal);
router.post("/aluno/:id_aluno", Treino.criarTreinoAluno);

// Rota para deletar um treino pelo ID
router.delete("/:id_treino", Treino.deletarTreino);
router.delete("/personal/:id_treino", Treino.personalDeleteTreino);

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

router.post("/iniciarTreino/:id_aluno/:id_treino", Treino.iniciarTreino);
router.delete("/cancelarTreino/:id_aluno/:id_treino", Treino.cancelarTreino);
router.put("/concluirTreino/:id_aluno/:id_treino", Treino.concluirTreino);
router.get("/verificaSerie/:id_aluno/:id_treino", Treino.verificaSeries);
//add exercicio a um treino
router.post("/addExercicios", Treino.adicionarExercicios);

//remover um exercicio
router.delete(`/:id_treino/exercicio/:id_exercicio`, Treino.removerExercicio);

//add exercicio a um treino
router.post("/addExercicios", Treino.adicionarExercicios);

//atribuir treino a um aluno
router.post("/atribuir", Treino.atribuirTreino);

//desvincular treino a um aluno
router.delete("/desvincular/:id_aluno/:id_treino", Treino.desvincularTreino);

module.exports = router;
