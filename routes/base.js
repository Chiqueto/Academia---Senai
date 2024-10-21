const express = require("express"); //importo o express
const router = express.Router(); //importo as rotas do express

router.get("/", (req, res) => {
  res.render("index");
});

module.exports = router; //exporto as rotas
