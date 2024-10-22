const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.render("personal/login");
});

router.get("/cadastro", (req, res) => {
  res.render("personal/cadastro");
});
module.exports = router;
