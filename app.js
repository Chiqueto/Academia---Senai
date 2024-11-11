const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const baseApi = require("./routes/base");
const aluno = require("./routes/aluno");
const personal = require("./routes/personal");
const academia = require("./routes/academia");
const cors = require("cors");

app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors());

app.set("view engine", "ejs");

app.use(express.static("public"));
app.use("/", baseApi);
app.use("/aluno", aluno);
app.use("/personal", personal);
app.use("/academia", academia);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
