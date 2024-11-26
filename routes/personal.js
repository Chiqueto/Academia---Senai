const express = require("express");
const router = express.Router();
const personalController = require("../controllers/personal");
const Exercicio = require("../controllers/exercicio");
const { authMiddleware } = require("../middleware/authMiddleware");

router.get("/", personalController.renderizaLogin);
router.get("/cadastro", personalController.renderizaCadastro);
//router.get("/menu", personalController.renderizaMenu, authMiddleware);
// router.get("/perfilPersonal", personalController.renderizaPerfil, authMiddleware)

//Sem a autenticação
router.get("/menu", personalController.renderizaMenu);
// router.get("/perfilPersonal", personalController.renderizaPerfil);

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
router.post("/criarExercicio/:id_personal", Exercicio.criarExercicio);
router.put(
  "/atualizarExercicio/:id_personal/:id_exercicio",
  Exercicio.atualizarExercicio
);
router.delete("/deletarExercicio/:id", Exercicio.deletarExercicio);
router.get("/exercicios/:id_personal", Exercicio.listarExerciciosByPersonal);

module.exports = router;
