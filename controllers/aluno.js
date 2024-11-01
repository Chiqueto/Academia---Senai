const Aluno = require("../models/aluno.js");
const becrypt = require("bcrypt");

const criarAluno = async (req, res) => {
  const { nome, email, senha, genero, telefone, dt_nascimento } = req.body;

  const telefoneFormatado = telefone.replace(/\D/g, "");
  const senhaCriptografada = await becrypt.hash(senha, 10);

  try {
    const novoAluno = await Aluno.createAluno({
      nome,
      email,
      senha: senhaCriptografada,
      genero,
      telefone: telefoneFormatado,
      dt_nascimento,
    });
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

module.exports = {
  criarAluno,
  listarAlunos,
  buscarAluno,
  deletarAluno,
  atualizarAluno,
  renderizaLogin,
  renderizaCadastro,
  renderizaMenu,
};
