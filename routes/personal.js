const express = require("express");
const router = express.Router();
const personalController = require("../controllers/personal");
const ExercicioController = require("../controllers/exercicio");
const TreinoController = require("../controllers/treino");
// const { authMiddleware } = require("../middleware/authMiddleware");

router.get("/personal/:id", (req, res) => {
  res.send("Rota interceptada!");
});

router.get("/", personalController.renderizaLogin);
router.get("/cadastro", personalController.renderizaCadastro);
//router.get("/menu", personalController.renderizaMenu, authMiddleware);
router.get("/perfilPersonal/:id", personalController.renderizaPerfil);

router.get("/menuPersonal", (req, res) => {
  res.render("personal/menuPersonal", { id: null });
});
router.get("/menuPersonal/:id", personalController.renderizaMenu);

//router.get("/opcaoTreinoPersonal", (req, res) => {
// res.render("personal/opcaoTreinoPersonal");
//});

router.get("/opcaoTreinoPersonal/:id", (req, res) => {
  res.render("personal/opcaoTreinoPersonal", { id: null });
});
//Sem a autenticação
//router.get("/menuPersonal/:id", personalController.renderizaMenu);
//router.get("/menuPersonal/:id?", personalController.renderizaMenu);

router.post("/cadastro", personalController.criarPersonal);
// router.get("/listaPersonais", authMiddleware, personalController.listarPersonais);
// router.get("/buscarPersonal/:id", authMiddleware, personalController.buscarPersonal);
// router.delete("/deletar/:id", authMiddleware, personalController.deletarPersonal);
// router.put("/atualizar/:id", authMiddleware, personalController.atualizarPersonal);
router.post("/login", personalController.autenticaPersonal);

//Sem a autenticação
router.get("/listaPersonais", personalController.listarPersonais);
router.get("/buscarPersonal/", personalController.buscarPersonal);
router.delete("/deletar/:id", personalController.deletarPersonal);
router.post("/atualizar/:id", personalController.atualizarPersonal);
router.get("/listaAlunos/:id_personal", personalController.listarAlunos);
router.get(
  "/:id_personal/perfilAluno/:id_aluno",
  personalController.renderizaPerfilAluno
);

router.get(
  "/criarExercicio/:id_personal",
  personalController.renderizaCriarExercicio
);

//exercicios para personais
router.post("/criarExercicio/:id_personal", ExercicioController.criarExercicio);
router.post("/adicionarAluno/:id_personal", personalController.adicionarAluno);
router.delete(
  "/removerAluno/:id_aluno/:id_personal",
  personalController.removerAluno
);

//router.post('/:id_personal/adicionarAluno', personalController.adicionarAluno);

router.put(
  "/atualizarExercicio/:id_personal/:id_exercicio",
  ExercicioController.atualizarExercicio
);
router.delete("/deletarExercicio/:id", ExercicioController.deletarExercicio);
router.get(
  "/exercicios/:id_personal",
  ExercicioController.listarExerciciosByPersonal
);
router.get("/:id_personal/treinos", TreinoController.listaTreinoPersonal);
router.get(
  "/:id_personal/treino/:id_treino",
  ExercicioController.listarExerciciosPorTreino
);
router.post(
  "/:id_aluno/treino/:id_treino/addExercicio",
  TreinoController.adicionarExercicios
);
router.get("/editar/:id", personalController.editarPersonal);
module.exports = router;
