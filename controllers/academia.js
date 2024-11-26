const Academia = require("../models/academia.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const { findAvailablePersonais } = require("../models/academia.js");

const SECRET_KEY = process.env.SECRET_KEY;



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

  const db_cnpj = await Academia.findByCnpj(cnpjFormatado);
  const db_email = await Academia.findByEmail(email);

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
    res.redirect("/academia");
    // .status(201)
    //.json({ novaAcademia, message: "Academia inserida com sucesso!" });
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
      redirectTo: `/academia/menu/${academia.id}`,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Erro interno do servidor" });
  }
};

const renderizaLogin = (req, res) => {
  res.render("academia/login");
};

const renderizaCadastro = (req, res) => {
  res.render("academia/cadastro");
};

const renderizaPerfil = async (req, res) => {
  const { id } = req.params;
  const academia = await Academia.findById(id);
  // console.log(academia);
  res.render(`academia/perfil`, { academia });
};

const renderizaMenu = (req, res) => {
  const { id } = req.params;
  res.render(`academia/menuAcademia`, { id });
};

const renderizaEquipamento = (req, res) => {
  const { id } = req.params;
  res.render(`academia/equipamento`, { id });
};


const renderizaListaAlunos = async (req, res) => {
  const { id } = req.params;
  const alunos = await Academia.findStudents(id);
  console.log(alunos);
  res.render("academia/alunos", { alunos });
};

const renderizaListaPersonais = async (req, res) => {
  const { id } = req.params;
  const personais = await Academia.findPersonais(id);
  console.log(personais);
  res.render("academia/personais", { personais });
};

const inserirPersonal = async (req, res) => {
  const { id_academia, id_personal } = req.body;

  try {
    const personal = await Academia.insertPersonal(id_academia, id_personal);
    res.status(201).json({ message: "Personal inserido com sucesso!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Função para buscar os alunos
const searchAlunos = async (req, res) => {
  const query = req.query.q;  // Pegando o termo de pesquisa da query string
  
  // Query SQL com LIKE para buscar alunos que começam com o termo pesquisado
  const sql = `
    SELECT nome
    FROM tb_alunos
    WHERE nome ILIKE $1
    LIMIT 10
  `;
  
  try {
    const result = await pool.query(sql, [`%${query}%`]); // Realiza a busca no banco
    res.json(result.rows); // Retorna os resultados em formato JSON
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};
module.exports = {
  cadastrar,
  listarAcademias,
  listarAcademiaPorId,
  atualizaAcademia,
  deletar,
  autenticaAcademia,
  renderizaMenu,
  renderizaPerfil,
  renderizaListaAlunos,
  renderizaLogin,
  renderizaCadastro,
  renderizaListaPersonais,
  inserirPersonal,
  renderizaEquipamento,
  searchAlunos,
};
