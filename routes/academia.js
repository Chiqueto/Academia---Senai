const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.render("academia/login");
});

router.get("/cadastro", (req, res) => {
  res.render("academia/cadastro");
});

router.get("/menu", (req,res) => {
  res.render("academia/menuAcademia")
});

router.get("/perfil", (req,res) => {
  res.render("academia/perfil")
});

router.get("/alunos", (req,res) => {
  res.render("academia/alunos")
});

router.get("/personais", (req,res) => {
  res.render("academia/personais")
});

router.get("/aparelhos", (req,res) => {
  res.render("academia/aparelhos")
});

router.get("/adcEquipamento", (req,res) => {
  res.render("academia/adcEquipamento")
});

router.get("/detalhe", (req,res) => {
  res.render("academia/adcdetalhe")
});



module.exports = router;
