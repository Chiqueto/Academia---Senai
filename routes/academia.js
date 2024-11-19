const express = require("express");
const router = express.Router();
const academiaController = require("../controllers/academia");
const { authMiddleware } = require("../middleware/authMiddleware");

router.get("/", academiaController.renderizaLogin);
router.get("/cadastro", academiaController.renderizaCadastro);

router.get("/menu/:id", academiaController.renderizaMenu);

router.get("/perfil/:id", academiaController.renderizaPerfil);

router.get("/alunos/:id", academiaController.renderizaListaAlunos);

router.get("/personais", (req, res) => {
  res.render("academia/personais");
});

router.get("/aparelhos", (req, res) => {
  res.render("academia/aparelhos");
});

router.get("/adcEquipamento", (req, res) => {
  res.render("academia/adcEquipamento");
});

router.get("/detalhe", (req, res) => {
  res.render("academia/adcdetalhe");
});

router.get("/treinos", (req, res) => {
  res.render("academia/treinos");
});

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
router.put(
  "/atualizar/:id",
  // authMiddleware,
  academiaController.atualizaAcademia
);
router.delete(
  "/deletar/:id",
  // authMiddleware,
  academiaController.deletar
);
router.post("/login", academiaController.autenticaAcademia);

module.exports = router;
