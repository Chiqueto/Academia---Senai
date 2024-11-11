const express = require("express");
const router = express.Router();
const alunoController = require("../controllers/aluno");
const { authMiddleware } = require("../middleware/authMiddleware");

router.get("/", alunoController.renderizaLogin);
router.get("/cadastro", alunoController.renderizaCadastro);
router.get("/menu", authMiddleware, alunoController.renderizaMenu);

router.post("/cadastro", alunoController.criarAluno);
router.get("/listaAlunos", authMiddleware, alunoController.listarAlunos);
router.get("/buscarAluno/:id", authMiddleware, alunoController.buscarAluno);
router.delete("/deletar/:id", authMiddleware, alunoController.deletarAluno);
router.put("/atualizar/:id", authMiddleware, alunoController.atualizarAluno);
router.post("/login", alunoController.autenticaAluno);

module.exports = router;
