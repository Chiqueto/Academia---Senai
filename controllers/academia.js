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
// const atualizaAcademia = async (req, res) => {
//   const { id } = req.params;
//   const { cidade, bairro, logradouro, telefone } = req.body;
//   try {
//     const academia = await Academia.updateAcademia(id, { cidade, bairro, logradouro, telefone });
//     res.redirect(`/academia/perfil/${id}`);
//   } catch (error) {
//     console.error(error);
//     res.status(500).send("Erro ao atualizar a academia");
//   }
// };


const atualizaAcademia = async (req, res) => {
  const { id } = req.params;
  const { cidade, bairro, logradouro, telefone, nome } = req.body;

  if (!cidade || !bairro || !logradouro || !telefone) {
    return res.status(400).send("Todos os campos são obrigatórios.");
  }

  try {
    const academiaAtualizada = await Academia.updateAcademia(id, {
      cidade,
      bairro,
      logradouro,
      telefone,
      nome,
    });

    if (academiaAtualizada.length === 0) {
      return res.status(404).send("Academia não encontrada.");
    }

    res.redirect(`/academia/perfil/${id}`);
  } catch (error) {
    console.error("Erro ao atualizar a academia:", error.message);
    res.status(500).send("Erro interno do servidor.");
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

const editarAcademia = async (req, res) => {
  const { id } = req.params;

  try {
    const academia = await Academia.findById(id);
    if (!academia) {
      return res.status(404).send("Academia não encontrada");
    }
    res.render(`academia/editar`, { academia });
  } catch (error) {
    console.error(error);
    res.status(500).send("Erro ao carregar a página de edição");
  }
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
    const personais = await Academia.insertPersonal(id_academia, id_personal);
    res.status(201).json({ message: "Personal inserido com sucesso!", data: personais });
  } catch (error) {
    console.error("Erro ao adicionar pessoasl: ", error);
    res.status(500).json({ error: error.message });
  }
};

const deletarPersonal = async (req, res) => {
  try {
    const { idAcademia } = req.body; // ID da academia enviado no corpo da requisição
    const { idPersonal } = req.params; // ID do personal enviado na URL

    if (!idAcademia || !idPersonal) {
      return res
        .status(400)
        .json({ error: "ID da academia e ID do personal são obrigatórios." });
    }

    const rowsDeleted = await Academia.deletePersonal(idPersonal, idAcademia);

    if (rowsDeleted === 0) {
      return res
        .status(404)
        .json({ error: "Relação entre academia e personal não encontrada." });
    }

    res.status(200).json({ message: "Personal removido com sucesso." });
  } catch (error) {
    console.error("Erro ao remover personal:", error);
    res.status(500).json({ error: "Erro ao remover personal." });
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
  editarAcademia,
  deletarPersonal,
 
};
