const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.render("academia/login");
});

router.get("/cadastro", (req, res) => {
  res.render("academia/cadastro");
});

module.exports = router;
