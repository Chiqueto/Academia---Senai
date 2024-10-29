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

module.exports = router;
