const express = require("express");
const router = express.Router();
const personalController = require("../controllers/personal");
const ExercicioController = require("../controllers/exercicio");
const TreinoController = require("../controllers/treino");
const { authMiddleware } = require("../middleware/authMiddleware");

router.get("/", personalController.renderizaLogin);
router.get("/cadastro", personalController.renderizaCadastro);
//router.get("/menu", personalController.renderizaMenu, authMiddleware);
router.get("/perfilPersonal/:id", personalController.renderizaPerfil);

router.get("/menuPersonal", (req, res) => {
  res.render("personal/menuPersonal", { id: null });
});
router.get("/menuPersonal/:id", personalController.renderizaMenu);


router.get("/opcaoTreinoPersonal", (req, res) => {
  res.render("personal/opcaoTreinoPersonal");
});

//Sem a autenticação
//router.get("/menuPersonal/:id", personalController.renderizaMenu);
router.get("/menuPersonal/:id?", personalController.renderizaMenu);

router.post("/cadastro", personalController.criarPersonal);
// router.get("/listaPersonais", authMiddleware, personalController.listarPersonais);
// router.get("/buscarPersonal/:id", authMiddleware, personalController.buscarPersonal);
// router.delete("/deletar/:id", authMiddleware, personalController.deletarPersonal);
// router.put("/atualizar/:id", authMiddleware, personalController.atualizarPersonal);
router.post("/login", personalController.autenticaPersonal);

//Sem a autenticação
router.get("/listaPersonais", personalController.listarPersonais);
router.get("/buscarPersonal/:id", personalController.buscarPersonal);
router.delete("/deletar/:id", personalController.deletarPersonal);
router.put("/atualizar/:id", personalController.atualizarPersonal);

//exercicios para personais
router.post("/criarExercicio/:id_personal", ExercicioController.criarExercicio);
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
  TreinoController.adicionarExercicio
);

module.exports = router;
