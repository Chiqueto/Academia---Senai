const Aluno = require("../models/aluno.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const SECRET_KEY = process.env.SECRET_KEY;

const criarAluno = async (req, res) => {
  const { nome, email, senha, genero, telefone, dt_nascimento } = req.body;

  const telefoneFormatado = telefone.replace(/\D/g, "");
  const senhaCriptografada = await bcrypt.hash(senha, 10);

  try {
    const novoAluno = await Aluno.createAluno({
      nome,
      email,
      senha: senhaCriptografada,
      genero,
      telefone: telefoneFormatado,
      dt_nascimento,
    });

    if (!novoAluno) {
      return res.status(400).json({ message: "Erro ao cadastrar aluno" });
    }
    //verifica email
    const db_email = await Aluno.findByEmail(email);
    if (db_email) {
      return res.status(400).json({ message: "Email já cadastrado!" });
    }

    // res.status(201).json(novoAluno);
    res.redirect("/aluno");
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const listarAlunos = async (req, res) => {
  try {
    const alunos = await Aluno.findAll();
    res.status(201).json(alunos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const buscarAluno = async (req, res) => {
  const { id } = req.params;

  try {
    const aluno = await Aluno.findById(id);
    if (aluno) {
      res.status(200).json(aluno);
    } else {
      res.status(404).json({ message: "Aluno não encontrado" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deletarAluno = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await Aluno.deleteAluno(id);
    if (result === 0) {
      // Se `rowCount` for 0, o aluno não foi encontrado
      return res.status(404).json({ error: "Aluno não encontrado" });
    } else {
      return res.json({ message: "Aluno deletado com sucesso!" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const atualizarAluno = async (req, res) => {
  const { id } = req.params;
  const { nome, telefone } = req.body;
  const telefoneFormatado = telefone.replace(/\D/g, "");
  try {
    const result = await Aluno.updateAluno(id, { nome, telefoneFormatado });
    if (result.length === 0) {
      return res.status(404).json({ error: "Aluno não encontrado" });
    } else {
      return res.json({ message: "Aluno atualizado com sucesso!" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const renderizaLogin = (req, res) => {
  res.render("aluno/login");
};

const renderizaCadastro = (req, res) => {
  res.render("aluno/cadastro");
};

const renderizaMenu = (req, res) => {
  res.render("aluno/menuAluno");
};

const renderizaPerfil = (req, res) => {
  res.render("aluno/perfilAluno");
};

const autenticaAluno = async (req, res) => {
  const { email, senha } = req.body;
  try {
    const aluno = await Aluno.loginAluno(email);

    if (!aluno) {
      return res.status(404).json({ error: "Aluno não encontrado" });
    }

    const senhaValida = await bcrypt.compare(senha, aluno.senha);
    if (!senhaValida) {
      return res.status(401).json({ error: "Erro! Usuário ou senha inválida" });
    }

    const token = jwt.sign({ id: aluno.id, email: aluno.email }, SECRET_KEY, {
      expiresIn: "1h",
    });

    return res.status(200).json({
      message: "Aluno autenticado com sucesso!",
      token,
      redirectTo: "/aluno/menu",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Erro interno do servidor" });
  }
};

module.exports = {
  criarAluno,
  listarAlunos,
  buscarAluno,
  deletarAluno,
  atualizarAluno,
  renderizaLogin,
  renderizaCadastro,
  renderizaMenu,
  renderizaPerfil,
  autenticaAluno,
};
