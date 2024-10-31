const express = require("express");
const router = express.Router();
const becrypt = require("bcrypt");
const salt = 10;
const pool = require("../db.js");
const alunoController = require("../controllers/aluno");

router.get("/", (req, res) => {
  res.render("aluno/login");
});

router.get("/cadastro", (req, res) => {
  res.render("aluno/cadastro");
});

// router.post("/cadastro", async (req, res) => {
//   const { nome, email, senha, genero, telefone, dt_nascimento } = req.body;

//   const telefoneNew = telefone.replace(/\D/g, "");
//   const senhaEncrypt = await becrypt.hash(senha, 10);

//   try {
//     const resut = await pool.query(
//       "INSERT INTO tb_aluno (nome, email, senha, genero, telefone, dt_nascimento) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
//       [nome, email, senhaEncrypt, genero, telefoneNew, dt_nascimento]
//     );
//     res.status(201).json(resut.rows[0]);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

router.post("/cadastro", alunoController.criarAluno);
router.get("/listaAlunos", alunoController.listarAlunos);
router.get("/buscarAluno/:id", alunoController.buscarAluno);
router.delete("/deletar/:id", alunoController.deletarAluno);
router.put("/atualizar/:id", alunoController.atualizarAluno);

router.get("/menu", (req, res) => {
  res.render("aluno/menuAluno");
});

router.get("/clientes", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM tb_aluno");
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
