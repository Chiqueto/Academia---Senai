const Personal = require("../models/personal.js");
const Treino = require("../models/treino.js");

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Aluno = require("../models/aluno.js");
const { addAluno, removeAluno } = require("../models/personal");
require("dotenv").config();
const Exercicio = require("../models/exercicio.js");

// const id_personal = document.getElementById('listaAlunos').getAttribute('data-id-personal');

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

  // Validações de campos em branco
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

  // Formatação do telefone e outros campos
  const telefoneFormatado = telefone.replace(/\D/g, "");
  const senhaCriptografada = await bcrypt.hash(senha, 10);
  const cepFormatado = cep.replace(/[-]/g, "");

  // Verificar email
  const db_email = await Personal.findByEmail(email);
  if (db_email) {
    return res.status(400).json({ message: "Email já cadastrado!" });
  }

  // Verificar CREF
  const db_cref = await Personal.findByCref(cref);
  if (db_cref) {
    return res.status(400).json({ message: "CREF já cadastrado!" });
  }

  // Verificar se o CEP é válido
  if (cepFormatado.length !== 8) {
    return res.status(400).json({ message: "CEP inválido!" });
  }

  try {
    // Criar o novo personal
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

    // Retornar uma resposta JSON com a URL de redirecionamento
    res.status(201).json({
      message: "Cadastro realizado com sucesso!",
      redirectTo: "/personal",
    });
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
    res.render("personal/listaAlunos", { alunos, all_alunos, id_personal });
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
  const { nome } = req.query;

  // console.log("Nome recebido:", nome);

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
  const { nome, descricao, telefone } = req.body;

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
    }
    res.redirect(`/personal/perfilPersonal/${id}`);
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

const renderizaTreinos = async (req, res) => {
  const { id_personal } = req.params;

  try {
    const treinos = await Treino.getTreinosByPersonal(id_personal);
    const exercicios = await Exercicio.getExercicios();

    res.render("personal/treinos", { id_personal, treinos, exercicios });
  } catch (error) {
    res.status(500).json({ error: "Falha ao carregar treinos" });
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
      redirectTo: `/personal/menuPersonal/${personal.id}`,
    }); // Opcional: Define o token como cookie
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

  // console.log("ID do Aluno:", id_aluno);
  // console.log("ID do Personal:", id_personal);

  try {
    const alunoPersonal = await Personal.adicionarAluno(id_aluno, id_personal);
    res
      .status(201)
      .json({ alunoPersonal, message: "Aluno inserido com sucesso!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao adicionar aluno." });
  }
};

const removerAluno = async (req, res) => {
  const { id_personal, id_aluno } = req.params;
  // const { } = req.body

  try {
    const response = await Personal.removerAluno(id_aluno, id_personal);

    res.status(201).json({ message: "Aluno excluído com sucesso!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// async function removerAluno(id_aluno) {
//   try {
//     const id_personal = document.getElementById('listaAlunos').getAttribute('data-id-personal');
//     const response = await fetch(`/personal/removerAluno/${id_personal}/${id_aluno}`, {
//       method: 'DELETE',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//     });

//     if (response.ok) {
//       const result = await response.json();
//       alert(result.message);
//       // Remove o elemento do DOM
//       const alunoElement = document.querySelector(`[data-id-aluno="${id_aluno}"]`).parentElement;
//       alunoElement.remove();
//     } else {
//       const error = await response.json();
//       console.error('Erro no servidor:', error);
//       alert('Erro ao remover aluno.');
//     }
//   } catch (error) {
//     console.error('Erro no cliente:', error);
//     alert('Erro ao tentar remover o aluno.');
//   }
// }

const renderizaCriarExercicio = async (req, res) => {
  const { id_personal } = req.params;

  try {
    const exercicios = await Exercicio.getExerciciosByPersonal(id_personal);
    res.render(`personal/criarExercicio`, { id_personal, exercicios });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao renderizar tela." });
  }
};

const editarPersonal = async (req, res) => {
  const { id } = req.params;

  try {
    const personal = await Personal.findById(id);
    if (!personal) {
      return res.status(404).send("personal não encontrada");
    }
    res.render(`personal/editar`, { personal });
  } catch (error) {
    console.error(error);
    res.status(500).send("Erro ao carregar a página de edição");
  }
};
const renderizaPerfilAluno = async (req, res) => {
  try {
    const { id_personal, id_aluno } = req.params; // Pega o id do aluno da URL

    // Aqui, você pode buscar o aluno pelo ID no banco de dados
    const aluno = await Aluno.findById(id_aluno); // Substitua pelo método de consulta do seu banco de dados
    const treinos = await Treino.getTreinosByAlunoAndPersonal(
      id_aluno,
      id_personal
    );

    const treinosPersonal = await Treino.getTreinosByPersonal(id_personal);

    if (!aluno) {
      return res.status(404).send("Aluno não encontrado");
    }

    // Passa o aluno para o template
    res.render("personal/perfilAluno", {
      id_personal,
      aluno,
      treinos,
      treinosPersonal,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Erro ao carregar perfil do aluno");
  }
};

const renderizaExercicio = async (req, res) => {
  const { id_personal, id_exercicio } = req.params;
  try {
    const exercicio = await Exercicio.getExercicioById(id_exercicio);
    res.render("personal/exercicio", { exercicio, id_personal });
  } catch (error) {
    console.error(error);
    res.status(500).send("Erro ao carregar exercicio");
  }
};

const criarTreino = async (req, res) => {
  const { id_personal } = req.params;
  const { nome, descricao } = req.body;
  try {
    const novoTreino = await Treino.createTreino({
      id_personal,
      nome,
      descricao,
    });

    res.status(201).json({ message: "Treino criado com sucesso!" });
  } catch (error) {
    res.status(500).json({ message: "Falha ao criar treino: " + error });
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
  renderizaPerfilAluno,
  renderizaCriarExercicio,
  renderizaTreinos,
  criarTreino,
  renderizaExercicio,
};
