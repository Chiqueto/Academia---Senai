const express = require("express");
const router = express.Router();
const becrypt = require("bcrypt");
const salt = 10;
const pool = require("../db.js");
const alunoController = require("../controllers/aluno");

router.get("/", alunoController.renderizaLogin);
router.get("/cadastro", alunoController.renderizaCadastro);
router.get("/menu", alunoController.renderizaMenu);

router.post("/cadastro", alunoController.criarAluno);
router.get("/listaAlunos", alunoController.listarAlunos);
router.get("/buscarAluno/:id", alunoController.buscarAluno);
router.delete("/deletar/:id", alunoController.deletarAluno);
router.put("/atualizar/:id", alunoController.atualizarAluno);

module.exports = router;
