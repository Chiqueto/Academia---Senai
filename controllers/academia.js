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

  const db_cnpj = await Academia.findByCnpj(cnpjFormatado);
  console.log(db_cnpj);
  const db_email = await Academia.findByEmail(email);

  //validações de campos em branco
  if (
    !nome ||
    !email ||
    !senha ||
    !cnpj ||
    !cep ||
    !cidade ||
    !bairro ||
    !logradouro ||
    !numero ||
    !uf ||
    !telefone
  ) {
    return res.status(400).json({ message: "Preencha todos os campos!" });
  }

  if (db_cnpj) {
    return res.status(400).json({ message: "CNPJ já cadastrado!" });
  }
  if (db_email) {
    return res.status(400).json({ message: "Email já cadastrado!" });
  }

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
    res
      .status(201)
      .json({ novaAcademia, message: "Academia inserida com sucesso!" });
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
    res
      .status(201)
      .json({ academia, message: "Academia atualizado com sucesso!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const atualizaAcademia = async (req, res) => {
  const { id } = req.params;
  const { nome, cep, cidade, bairro, logradouro, numero, uf, telefone } =
    req.body;

  //verificar campos vazios
  if (
    !nome ||
    !cep ||
    !cidade ||
    !bairro ||
    !logradouro ||
    !numero ||
    !uf ||
    !telefone
  ) {
    return res.status(400).json({ message: "Preencha todos os campos!" });
  }

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

    res
      .status(201)
      .json({ academia }, { message: "Academia atualizado com sucesso!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deletar = async (req, res) => {
  const { id } = req.params;

  try {
    const result = Academia.deleteAcademia(id);

    res.status(200).json({ message: "Academia deletado com sucesso!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const autenticaAcademia = async (req, res) => {
  const { email, senha } = req.body;
  try {
    const academia = await Academia.loginAcademia(email);

    if (!academia) {
      return res.status(404).json({ error: "Academia não encontrada" });
    }

    const senhaValida = await bcrypt.compare(senha, academia.senha);
    if (!senhaValida) {
      return res.status(401).json({ error: "Erro! Email ou senha inválida" });
    }

    const token = jwt.sign(
      { id: academia.id, email: academia.email },
      SECRET_KEY,
      {
        expiresIn: "1h",
      }
    );

    return res.status(200).json({
      message: "Academia autenticada com sucesso!",
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
  deletar,
  autenticaAcademia,
};
