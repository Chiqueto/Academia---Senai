const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.render("aluno/login");
});

router.get("/cadastro", (req, res) => {
  res.render("aluno/cadastro");
});

router.get("/menu",(req, res) => {
  res.render("aluno/menuAluno");
});

module.exports = router;
