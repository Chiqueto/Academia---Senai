const Personal = require("../models/personal.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const SECRET_KEY = process.env.SECRET_KEY;

const criarPersonal = async (req, res) => {
  const {
    nome,
    email,
    senha,
    cref,
    cep,
    cidade,
    uf,
    descricao,
    especialidade,
    telefone,
  } = req.body;

  //validações de campos em branco
  if (
    !nome ||
    !email ||
    !senha ||
    !cref ||
    !cep ||
    !cidade ||
    !uf ||
    !telefone
  ) {
    return res.status(400).json({ message: "Preencha todos os campos!" });
  }

  const telefoneFormatado = telefone.replace(/\D/g, "");
  const senhaCriptografada = await bcrypt.hash(senha, 10);
  const cepFormatado = cep.replace(/[-]/g, "");

  //verificar se o cep é válido
  if (cepFormatado.length > 8) {
    return res.status(400).json({ message: "CEP inválido!" });
  }

  try {
    const novoPersonal = await Personal.createPersonal({
      nome,
      email,
      senha: senhaCriptografada,
      cref,
      cep: cepFormatado,
      cidade,
      uf,
      descricao,
      especialidade,
      telefone: telefoneFormatado,
    });

    if (!novoPersonal) {
      return res.status(400).json({ message: "Erro ao cadastrar personal" });
    }

    // res.status(201).json(novoPersonal);
    res.redirect("/personal");
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const listarPersonais = async (req, res) => {
  try {
    const personais = await Personal.findAll();
    res.status(201).json(personais);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const buscarPersonal = async (req, res) => {
  const { id } = req.params;

  try {
    const personal = await Personal.findById(id);
    if (personal) {
      res.status(200).json(personal);
    } else {
      res.status(404).json({ message: "Personal não encontrado" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deletarPersonal = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await Personal.deletePersonal(id);

    if (result === 0) {
      return res.status(404).json({ error: "Presonal não encontrado" });
    } else {
      return res.json({ message: "Personal deletado com sucesso!" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const atualizarPersonal = async (req, res) => {
  const { id } = req.params;
  const { nome, cep, cidade, uf, descricao, especialidade, telefone } =
    req.body;

  //validações de campos em branco
  if (!nome || !cep || !cidade || !uf || !telefone) {
    return res.status(400).json({ message: "Preencha todos os campos!" });
  }
  const telefoneFormatado = telefone.replace(/\D/g, "");
  const cepFormatado = cep.replace(/[-]/g, "");

  //verificar se o cep é válido
  if (cepFormatado.length > 8) {
    return res.status(400).json({ message: "CEP inválido!" });
  }

  try {
    const result = await Personal.updatePersonal(id, {
      nome,
      cep: cepFormatado,
      cidade,
      uf,
      descricao,
      especialidade,
      telefone: telefoneFormatado,
    });
    if (result.length === 0) {
      return res.status(404).json({ error: "Personal não encontrado" });
    } else {
      return res.json({ message: "Personal atualizado com sucesso!" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const renderizaLogin = (req, res) => {
  res.render("personal/login");
};

const renderizaCadastro = (req, res) => {
  res.render("personal/cadastro");
};

const renderizaMenu = (req, res) => {
  res.render("personal/menuPersonal");
};

 const renderizaPerfil = (req, res) => {
   res.render("personal/perfilPersonal");
 };

const autenticaPersonal = async (req, res) => {
  const { email, senha } = req.body;
  try {
    const personal = await Personal.loginAluno(email);

    if (!personal) {
      return res.status(404).json({ error: "Personal não encontrado" });
    }

    const senhaValida = await bcrypt.compare(senha, personal.senha);
    if (!senhaValida) {
      return res.status(401).json({ error: "Erro! Usuário ou senha inválida" });
    }

    const token = jwt.sign(
      { id: personal.id, email: personal.email },
      SECRET_KEY,
      {
        expiresIn: "1h",
      }
    );

    return res.status(200).json({
      message: "Personal autenticado com sucesso!",
      token,
      redirectTo: "/personal/menu",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Erro interno do servidor" });
  }
};

module.exports = {
  criarPersonal,
  listarPersonais,
  buscarPersonal,
  deletarPersonal,
  atualizarPersonal,
  renderizaLogin,
  renderizaCadastro,
  renderizaMenu,
  renderizaPerfil,
  autenticaPersonal,
};
