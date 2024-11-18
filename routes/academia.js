const express = require("express");
const router = express.Router();
const academiaController = require("../controllers/academia");

router.get("/", (req, res) => {
  res.render("academia/login");
});

router.get("/cadastro", (req, res) => {
  res.render("academia/cadastro");
});

router.get("/menu", (req, res) => {
  res.render("academia/menuAcademia");
});

router.get("/perfil", (req, res) => {
  res.render("academia/perfil");
});

router.get("/alunos", (req, res) => {
  res.render("academia/alunos");
});

router.get("/personais", (req, res) => {
  res.render("academia/personais");
});

router.get("/aparelhos", (req, res) => {
  res.render("academia/aparelhos")
});

router.get("/adcEquipamento", (req,res) => {
  res.render("academia/adcEquipamento");
});

router.get("/detalhe", (req,res) => {
  res.render("academia/adcdetalhe")
});

router.get("/treinos", (req,res) => {
  res.render("academia/treinos")
});

router.post("/cadastro", academiaController.cadastrar);
router.get("/listaAcademias", academiaController.listarAcademias);
router.get("/listarAcademia/:id", academiaController.listarAcademiaPorId);
router.put("/atualizar/:id", academiaController.atualizaAcademia);

module.exports = router;
