const Personal = require("../models/personal.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Aluno = require("../models/aluno.js");
const { addAluno, removeAluno } = require('../models/personal');
require("dotenv").config();

const SECRET_KEY = process.env.SECRET_KEY;

const formatarTelefone = (telefone) => {
  const telefoneFormatado = telefone.replace(/\D/g, ""); // Remove caracteres não numéricos
  return telefoneFormatado.replace(/^(\d{3})(\d{5})(\d{4})$/, "($1) $2-$3");
};

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

  //verificar email
  const db_email = await Aluno.findByEmail(email);
  if (db_email) {
    return res.status(400).json({ message: "Email já cadastrado!" });
  }

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
    res.status(200).json(personais);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// const listarAlunos = async (req, res) => {
//   // console.log("Rota /personal/listaAlunos/:id acessada com ID:", req.params.id_personal);
//   const { id_personal } = req.params;
//   // console.log(id_personal)
//   try {
//     const alunos = await Personal.findAlunoByPersonalId(id_personal);
//     const all_alunos = await Aluno.findAll();
//     res.render("personal/listaAlunos", { alunos, message: null, id_personal });
//   } catch (error) {
//     console.error("Erro ao listar alunos:", error);
//     res.status(500).render("personal/listaAlunos", {
//       alunos: [],
//       all_alunos: [],
//       message: "Erro ao listar alunos. Tente novamente mais tarde.",
//       id_personal,
//     });
//   }
// };

const listarAlunos = async (req, res) => {
  const { id_personal } = req.params;
  try {
    const alunos = await Personal.findAluno(id_personal);
    const all_alunos = await Aluno.findAll(); // Garante que pega todos os alunos
    res.render("personal/listaAlunos", { alunos, all_alunos,  id_personal });
  } catch (error) {
    console.error("Erro ao listar alunos:", error);
    res.status(500).render("personal/listaAlunos", {
      alunos: [],
      all_alunos: [], // Inclua um array vazio como fallback
      message: "Erro ao listar alunos. Tente novamente mais tarde.",
      id_personal,
    });
  }
};



const buscarPersonal = async (req, res) => {
  const { nome} = req.query;

  console.log("Nome recebido:", nome);

  try {
    const personais = await Personal.findByNome(nome);
    if (personais.length > 0) {
      res.status(200).json(personais);
    } else {
      res.status(404).json({ message: "Nenhum personal encontrado." });
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
  const { nome, descricao, telefone } =
    req.body;

  //validações de campos em branco
  if (!nome || !descricao || !telefone) {
    return res.status(400).json({ message: "Preencha todos os campos!" });
  }
  const telefoneFormatado = telefone.replace(/\D/g, "");

  try {
    const result = await Personal.updatePersonal(id, {
      nome,
      descricao,
      telefone: telefoneFormatado,
    });
    if (result.length === 0) {
      return res.status(404).json({ error: "Personal não encontrado" });
    } res.redirect(`/personal/perfilPersonal/${id}`);
  } catch (error) {
    console.error("Erro ao atualizar a personal:", error.message);
    res.status(500).send("Erro interno do servidor.");
  }
};

const renderizaLogin = (req, res) => {
  res.render("personal/login");
};

const renderizaCadastro = (req, res) => {
  res.render("personal/cadastro");
};

const renderizaMenu = (req, res) => {
  const { id } = req.params;
 // if (!id) return res.status(400).send("ID não fornecido!");
  res.render(`personal/menuPersonal`, { id });
};
// const renderizaMenu = (req, res) => {
//   res.render("personal/menuPersonal",{ id });
// };

//  const renderizaPerfil = (req, res) => {
//    res.render("personal/perfilPersonal");
//  };

const renderizaPerfil = async (req, res) => {
  const { id } = req.params;
  // console.log("ID recebido na rota:", id);

  try {
    const personal = await Personal.findById(id);

    if (!personal) {
      return res.status(404).json({ message: "Personal não encontrado" });
    }

    personal.telefone = formatarTelefone(personal.telefone);

    res.render("personal/perfilPersonal", { personal });
  } catch (error) {
    console.error("Erro ao buscar personal:", error);
    res.status(500).json({ error: error.message });
  }
};

const autenticaPersonal = async (req, res) => {
  const { email, senha } = req.body;
  try {
    const personal = await Personal.loginPersonal(email);

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

    // Redireciona para a página do menu diretamente
    return res.status(200).json({
      message: "Personal autenticada com sucesso!",
      token, 
      redirectTo:  `/personal/menuPersonal/${personal.id}`,
    }) ;// Opcional: Define o token como cookie
      } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Erro interno do servidor" });
  }
};
//     return res.status(200).json({
//       message: "Personal autenticado com sucesso!",
//       token,
//       redirectTo: "/personal/menuPersonal",
//     });
//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({ error: "Erro interno do servidor" });
//   }
// };

// controllers/AlunoPersonalController.js


const adicionarAluno = async (req, res) => {
  
    const { id_aluno } = req.body; // Pega o idAluno do corpo da requisição
    const { id_personal } = req.params; // Pega o idPersonal da URL

    console.log("ID do Aluno:", id_aluno);
    console.log("ID do Personal:", id_personal);

try {
    const alunoPersonal = await adicionarAluno(id_personal, id_aluno);
    res.status(201).json({alunoPersonal, message: "Aluno inserido com sucesso!"});
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao adicionar aluno." });
  }
};


const removerAluno = async (req, res) => {
  try {
    const { id_aluno } = req.body; 
    const { id_personal } = req.params; // Pega o idPersonal da URL
   
    if (!id_personal || !id_aluno) {
      return res.status(400).json({ error: "ID do Aluno e ID do Personal são obrigatórios." });
    }

    const rowsDeleted = await removerAluno(id_aluno, id_personal);
    if (rowsDeleted === 0) {
      return res.status(404).json({ error: "Relação não encontrada." });
    }

    res.status(200).json({ message: "Aluno removido com sucesso." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao remover aluno." });
  }
};

const editarPersonal = async (req, res) => {
  const { id } = req.params;

  try {
    const personal = await Personal.findById(id);
    if (!personal) {
      return res.status(404).send("personal não encontrada");
    }
    res.render(`personal/editar`, { personal});
  } catch (error) {
    console.error(error);
    res.status(500).send("Erro ao carregar a página de edição");
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
  listarAlunos,
  formatarTelefone,
  adicionarAluno,
  removerAluno,
  editarPersonal,
};
