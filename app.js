const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const baseApi = require("./routes/base");
const aluno = require("./routes/aluno/aluno");
const personal = require("./routes/personal/personal");
const academia = require("./routes/academia/academia");


app.use(bodyParser.urlencoded({ extended: true }));

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
