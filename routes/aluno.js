const express = require("express");
const router = express.Router();
const alunoController = require("../controllers/aluno");
const { authMiddleware } = require("../middleware/authMiddleware");

router.get("/", alunoController.renderizaLogin);
router.get("/cadastro", alunoController.renderizaCadastro);
router.get("/menu", alunoController.renderizaMenu, authMiddleware);
router.get("/perfilAluno", alunoController.renderizaPerfil, authMiddleware)

router.get("/opcaoTreinoAluno", (req,res) => {
    res.render("aluno/opcaoTreinoAluno")
  });

  router.get("/encontrarAcademia", (req,res) => {
    res.render("aluno/encontrarAcademia")
  });

  router.get("/encontrarPersonal", (req,res) => {
    res.render("aluno/encontrarPersonal")
  });

  router.get("/montarTreino", (req,res) => {
    res.render("aluno/montarTreino")
  });

  router.get("/TreinoA", (req,res) => {
    res.render("aluno/TreinoA")
  });
  router.get("/TreinoB", (req,res) => {
    res.render("aluno/TreinoB")
  });
  router.get("/Treinoc", (req,res) => {
    res.render("aluno/Treinoc")
  });

router.post("/cadastro", alunoController.criarAluno);
router.get("/listaAlunos", authMiddleware, alunoController.listarAlunos);
router.get("/buscarAluno/:id", authMiddleware, alunoController.buscarAluno);
router.delete("/deletar/:id", authMiddleware, alunoController.deletarAluno);
router.put("/atualizar/:id", authMiddleware, alunoController.atualizarAluno);
router.post("/login", alunoController.autenticaAluno);

module.exports = router;
