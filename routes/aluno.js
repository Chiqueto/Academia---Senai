const express = require("express");
const multer = require("multer");
const { upload } = require("../uploadConfig");
const alunoController = require("../controllers/aluno");
const router = express.Router();

const { authMiddleware } = require("../middleware/authMiddleware");

router.get("/", alunoController.renderizaLogin);
router.get("/cadastro", alunoController.renderizaCadastro);
// router.get("/menu", alunoController.renderizaMenu, authMiddleware);
// router.get("/perfilAluno", alunoController.renderizaPerfil, authMiddleware)
//Sem a autenticação

router.get("/menu/:id", alunoController.renderizaMenu);
router.get("/perfilAluno/:id", alunoController.renderizaPerfil);

router.get("/opcaoTreinoAluno", (req, res) => {
  res.render("aluno/opcaoTreinoAluno");
});

router.get("/encontrarAcademia", alunoController.renderizaEncontrarAcademias);

// router.get("/encontrarPersonal", (req, res) => {
//   res.render("aluno/encontrarPersonal");
// });

router.get("/encontrarPersonal", alunoController.renderizaListaPersonais);

router.get("/montarTreino", (req, res) => {
  res.render("aluno/montarTreino");
});

router.get("/TreinoA", (req, res) => {
  res.render("aluno/TreinoA");
});
router.get("/TreinoB", (req, res) => {
  res.render("aluno/TreinoB");
});
router.get("/Treinoc", (req, res) => {
  res.render("aluno/Treinoc");
});

router.post("/cadastro", alunoController.criarAluno);
// router.get("/listaAlunos", authMiddleware, alunoController.listarAlunos);
// router.get("/buscarAluno/:id", authMiddleware, alunoController.buscarAluno);
// router.delete("/deletar/:id", authMiddleware, alunoController.deletarAluno);
router.put("/atualizar/:id", authMiddleware, alunoController.atualizarAluno);
router.post("/login", alunoController.autenticaAluno);

// Rota para upload de foto de perfil
// router.post("/uploadFoto/:id", upload.single("fotoPerfil"), alunoController.uploadFoto);
//router.post("/uploadFoto/:id", upload.single("fotoPerfil"), alunoController.uploadFoto);

//Sem a autenticação
router.get("/listaAlunos", alunoController.listarAlunos);
router.get("/buscarAluno/:id", alunoController.buscarAluno);

router.delete("/deletar/:id", alunoController.deletarAluno);
router.put("/atualizar/:id", alunoController.atualizarAluno);
router.post("/matricula", alunoController.matriculaAlunoAcademia);
router.delete("/desmatricula", alunoController.desmatriculaAlunoAcademia);
router.post("/contrataPersonal", alunoController.contrataPersonal);
router.delete("/removePersonal", alunoController.removePersonal);
module.exports = router;
