const Academia = require("../models/academia.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const cadastrar = async (req, res) => {
  const {
    nome,
    email,
    senha,
    cnpj,
    cep,
    cidade,
    bairro,
    logradouro,
    numero,
    uf,
    telefone,
  } = req.body;

  const telefoneFormatado = telefone.replace(/\D/g, "");
  const senhaCriptografada = await bcrypt.hash(senha, 10);
  const cnpjFormatado = cnpj.replace(/[.\-\/]/g, "");
  const cepFormatado = cep.replace(/[-]/g, "");

  try {
    const novaAcademia = Academia.createAcademia({
      nome,
      email,
      senha: senhaCriptografada,
      cnpj: cnpjFormatado,
      cep: cepFormatado,
      cidade,
      bairro,
      logradouro,
      numero,
      uf,
      telefone: telefoneFormatado,
    });
    res.status(201).json(novaAcademia);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const listarAcademias = async (req, res) => {
  try {
    const academias = await Academia.findAll();
    res.status(201).json(academias);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const listarAcademiaPorId = async (req, res) => {
  const { id } = req.params;
  console.log(id);
  try {
    const academia = await Academia.findById(id);
    res.status(201).json(academia);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const atualizaAcademia = async (req, res) => {
  const { id } = req.params;
  const { nome, cep, cidade, bairro, logradouro, numero, uf, telefone } =
    req.body;

  const telefoneFormatado = telefone.replace(/\D/g, "");
  const cepFormatado = cep.replace(/[-]/g, "");

  try {
    const academia = Academia.updateAcademia(id, {
      nome,
      cep: cepFormatado,
      cidade,
      bairro,
      logradouro,
      numero,
      uf,
      telefone: telefoneFormatado,
    });

    res.status(201).json(academia);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const renderizaLogin = (req, res) => {
  res.render("academia/login");
};

const renderizaCadastro = (req, res) => {
  res.render("academia/cadastro");
};

const autenticaAcademia = async (req, res) => {
  const { cnpj, senha } = req.body;
  try {
    const academia = await Academia.loginAcademia(cnpj);

    if (!academia) {
      return res.status(404).json({ error: "Academia não encontrado" });
    }

    const senhaValida = await bcrypt.compare(senha, academia.senha);
    if (!senhaValida) {
      return res.status(401).json({ error: "Erro! Usuário ou senha inválida" });
    }

    const token = jwt.sign({ id: academia.id, cnpj: academia.cnpj }, SECRET_KEY, {
      expiresIn: "1h",
    });

    return res.status(200).json({
      message: "Academia autenticado com sucesso!",
      token,
      redirectTo: "/academia/menu",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Erro interno do servidor" });
  }
};

module.exports = {
  cadastrar,
  listarAcademias,
  listarAcademiaPorId,
  atualizaAcademia,
  renderizaLogin,
  renderizaCadastro,
  autenticaAcademia,
};
