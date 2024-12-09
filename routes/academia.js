const express = require("express");
const router = express.Router();
const academiaController = require("../controllers/academia");

const { authMiddleware } = require("../middleware/authMiddleware");

router.get("/", (req, res) => {
  res.render("academia/login");
});

router.get("/cadastro", (req, res) => {
  res.render("academia/cadastro");
});

router.get("/academia/alunos", (req, res) => {
  const id = req.params.id;
  res.render("academia/alunos", { id: id });
});

router.get('/academia/menu/:id', async (req, res) => {
  const { id } = req.params;
  res.render("academia/menuAcademia", {id: id});
});

router.get("/perfil/:id", academiaController.renderizaPerfil);

router.get("/alunos/:idAcademia", academiaController.renderizaListaAlunos);

router.get("/personais/:id", academiaController.renderizaListaPersonais);

router.get("/equipamento/:id", academiaController.renderizaEquipamento);

router.get("/editar/:id", academiaController.editarAcademia);
router.post("/atualizar/:id", academiaController.atualizaAcademia);
router.delete("/removerPersonal/:idPersonal", academiaController.deletarPersonal);
router.delete("/removerALuno/:idAluno" , academiaController.deletarAluno);

router.get("/adcEquipamento", (req, res) => {
  res.render("academia/adcEquipamento");
});

router.get("/detalhe", (req, res) => {
  res.render("academia/adcdetalhe");
});

// router.get("/treinos", (req, res) => {
//   res.render("academia/treinos");
// });
router.get("/treinos/:id", academiaController.renderizaTreinos);

router.post("/cadastro", academiaController.cadastrar);
router.get(
  "/listaAcademias",
  // authMiddleware,
  academiaController.listarAcademias
);
router.get(
  "/listarAcademia/:id",
  // authMiddleware,
  academiaController.listarAcademiaPorId
);

router.delete(
  "/deletar",
  // authMiddleware,
  academiaController.deletar
);
router.post("/login", academiaController.autenticaAcademia);

router.post("/inserirPersonal", academiaController.inserirPersonal);
router.post('/inserirAluno/:idAcademia', academiaController.adicionarAluno) 
  console.log(`Adicionando aluno à academia `);

// router.post("/inserirAluno", academiaController.inserirAluno);
module.exports = router;
