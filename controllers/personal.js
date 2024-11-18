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
    cep,
    cidade,
    uf,
    descricao,
    especialidade,
    telefone,
  } = req.body;

  const telefoneFormatado = telefone.replace(/\D/g, "");
  const senhaCriptografada = await bcrypt.hash(senha, 10);

  //validações de campos em branco
  if (!nome || !email || !senha || !cep || !cidade || !uf || !telefone) {
    return res.status(400).json({ message: "Preencha todos os campos!" });
  }

  //   //verifica email
  //   const db_email = await Aluno.findByEmail(email);
  //   if (db_email) {
  //     return res.status(400).json({ message: "Email já cadastrado!" });
  //   }

  try {
    const novoPersonal = await Personal.createPersonal({
      nome,
      email,
      senha: senhaCriptografada,
      cep,
      cidade,
      uf,
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

const listarPersonal = async (req, res) => {
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
    const result = await Aluno.deletePersonal(id);
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
  try {
    const result = await Aluno.updateAluno(id, {
      nome,
      cep,
      cidade,
      uf,
      descricao,
      especialidade,
      telefoneFormatado,
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

// const renderizaCadastro = (req, res) => {
//   res.render("aluno/cadastro");
// };

// const renderizaMenu = (req, res) => {
//   res.render("aluno/menuAluno");
// };

// const renderizaPerfil = (req, res) => {
//   res.render("aluno/perfilAluno");
// };

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
  criarAluno,
  listarAlunos,
  buscarAluno,
  deletarAluno,
  atualizarAluno,
  //   renderizaLogin,
  renderizaCadastro,
  renderizaMenu,
  renderizaPerfil,
  autenticaAluno,
};
