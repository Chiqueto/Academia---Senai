const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const baseApi = require("./routes/base");
const aluno = require("./routes/aluno");
const personal = require("./routes/personal");
const academia = require("./routes/academia");

app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));

app.set("view engine", "ejs");

app.use(express.static("public"));
app.use("/", baseApi);
app.use("/aluno", aluno);
app.use("/personal", personal);
app.use("/academia", academia);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
