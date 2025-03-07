const express = require("express");
const multer = require("multer");
const { upload } = require("../uploadConfig");
const alunoController = require("../controllers/aluno");
const TreinoController = require("../controllers/treino");
const ExercicioController = require("../controllers/exercicio");
const router = express.Router();

const { authMiddleware } = require("../middleware/authMiddleware");

router.get("/", alunoController.renderizaLogin);
router.get("/cadastro", alunoController.renderizaCadastro);
// router.get("/menu", alunoController.renderizaMenu, authMiddleware);
// router.get("/perfilAluno", alunoController.renderizaPerfil, authMiddleware)
//Sem a autenticação

router.get("/menu/:id", alunoController.renderizaMenu);
router.get("/perfilAluno/:id", alunoController.renderizaPerfil);

router.get("/meusTreinos/:id_aluno", alunoController.renderizaMeusTreinos);
router.get(
  "/meusTreinos/:id_aluno/treino/:id_treino",
  alunoController.renderizaTreino
);

router.get(
  "/encontrarAcademia/:id_aluno",
  alunoController.renderizaEncontrarAcademias
);

//add exercicio a um treino
router.post(
  "/montarTreino/:id_aluno/treino/addExercicios",
  TreinoController.adicionarExercicios
);

//remover um exercicio
router.delete(
  `/montarTreino/:id_aluno/treino/:id_treino/exercicio/:id_exercicio`,
  TreinoController.removerExercicio
);

//DeletarTreino
router.delete(
  `/montarTreino/:id_aluno/treino/:id_treino`,
  TreinoController.deletarTreino
);

//get exercicio by treino
router.get(
  "/montarTreino/:id_aluno/treino/:id_treino/exercicios",
  ExercicioController.listarExerciciosPorTreinoWSerie
);

// router.get("/encontrarPersonal", (req, res) => {
//   res.render("aluno/encontrarPersonal");
// });

router.get(
  "/:id_aluno/perfilPersonal/:id_personal",
  alunoController.renderizaPerfilPersonal
);

router.get(
  "/encontrarPersonal/:id_aluno",
  alunoController.renderizaListaPersonais
);

router.get(
  "/:id_aluno/perfilAcademia/:id_academia",
  alunoController.renderizaPerfilAcademia
);

router.get("/montarTreino/:id_aluno", alunoController.renderizaMontarTreino);
router.get("/buscarAluno/", alunoController.buscarAluno);

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
router.get("/:id_aluno/treinos", TreinoController.listaTreinoAluno);
router.get(
  "/:id_aluno/treino/:id_treino",
  ExercicioController.listarExerciciosPorTreino
);
router.get(
  "/meusTreinos/:id_aluno/treino/:id_treino/exercicios/:id_exercicio",
  alunoController.renderizaExercicio
);

module.exports = router;
