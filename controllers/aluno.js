const Aluno = require("../models/aluno.js");
const Personal = require("../models/personal.js");
const Academia = require("../models/academia.js");
const Exercicio = require("../models/exercicio.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Treino = require("../models/treino.js");
require("dotenv").config();

const SECRET_KEY = process.env.SECRET_KEY;

const formatarTelefone = (telefone) => {
  const telefoneFormatado = telefone.replace(/\D/g, ""); // Remove caracteres não numéricos
  return telefoneFormatado.replace(/^(\d{3})(\d{5})(\d{4})$/, "($1) $2-$3");
};

const calcularIdade = (dataNascimento) => {
  const hoje = new Date();
  const nascimento = new Date(dataNascimento);
  let idade = hoje.getFullYear() - nascimento.getFullYear();
  const mes = hoje.getMonth() - nascimento.getMonth();

  if (mes < 0 || (mes === 0 && hoje.getDate() < nascimento.getDate())) {
    idade--;
  }

  return idade;
};

const criarAluno = async (req, res) => {
  const { nome, email, senha, genero, telefone, dt_nascimento } = req.body;

  //validações de campos em branco
  if (!nome || !email || !senha || !genero || !telefone || !dt_nascimento) {
    return res.status(400).json({ message: "Preencha todos os campos!" });
  }

  const telefoneFormatado = telefone.replace(/\D/g, "");
  const senhaCriptografada = await bcrypt.hash(senha, 10);

  //verifica email
  const db_email = await Aluno.findByEmail(email);
  if (db_email) {
    return res.status(400).json({ message: "Email já cadastrado!" });
  }

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

    // res.status(201).json(novoAluno);
    res.redirect("/aluno");
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const listarAlunos = async (req, res) => {
  try {
    const alunos = await Aluno.findAll();
    res.status(200).json(alunos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// const buscarAluno = async (req, res) => {
//   const { id } = req.params;

//   try {
//     const aluno = await Aluno.findById(id);
//     if (aluno) {
//       res.status(200).json(aluno);
//     } else {
//       res.status(404).json({ message: "Aluno não encontrado" });
//     }
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

const buscarAluno = async (req, res) => {
  const { id } = req.params;

  try {
    const aluno = await Aluno.findById(id);
    if (!aluno) {
      return res.status(404).json({ message: "Aluno não encontrado" });
    }

    aluno.telefone = formatarTelefone(aluno.telefone);
    aluno.idade = calcularIdade(aluno.dt_nascimento);

    res.render("aluno/perfilAluno", { aluno });
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

  //validações de campos em branco
  if (!nome || !telefone) {
    return res.status(400).json({ message: "Preencha todos os campos!" });
  }

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

const renderizaMontarTreino = async (req, res) => {
  const { id_aluno } = req.params;

  const treinos = await Treino.getTreinosByAluno(id_aluno);
  const exercicios = await Exercicio.getExercicios();

  res.render("aluno/montarTreino", { id_aluno, treinos, exercicios });
};

const renderizaMeusTreinos = async (req, res) => {
  const { id_aluno } = req.params;
  const treinos = await Treino.getTreinosByAluno(id_aluno);

  res.render("aluno/meusTreinos", { id_aluno, treinos });
};

const renderizaTreino = async (req, res) => {
  const { id_aluno, id_treino } = req.params;
  const { id_exercicio } = req.query;
  // console.log("Entrou");

  const dt_atual = new Date().toLocaleDateString("en-CA");
  // Obter treino e exercícios
  const treino = await Treino.getTreinoById(id_treino);
  let exercicios = await Exercicio.getExerciciosByTreinoWSerie(id_treino);

  // Adicionar a quantidade de séries feitas para cada exercício
  exercicios = await Promise.all(
    exercicios.map(async (exercicio) => {
      const seriesFeitas = await Treino.getSeriesFeitas(
        id_treino,
        exercicio.id,
        id_aluno,
        dt_atual
      );
      return {
        ...exercicio,
        seriesFeitas, // Adiciona a propriedade ao objeto do exercício
      };
    })
  );

  res.render("aluno/treino", { id_aluno, treino, exercicios });
};

const renderizaExercicio = async (req, res) => {
  const { id_aluno, id_treino, id_exercicio } = req.params;

  try {
    let exercicio = await Exercicio.getExercicioById(id_exercicio);
    const series = await Exercicio.getSeries(
      id_treino,
      id_exercicio,
      id_aluno,
      new Date().toLocaleDateString("en-CA")
    );

    exercicio.seriesFeitas = await Exercicio.getSeriesFeitas(
      id_treino,
      id_exercicio,
      id_aluno,
      new Date().toLocaleDateString("en-CA")
    );

    // console.log(series);

    // console.log("Exercicio: ", exercicio);

    res.render("aluno/exercicio", { id_aluno, id_treino, exercicio, series });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const renderizaCadastro = (req, res) => {
  res.render("aluno/cadastro");
};

const renderizaMenu = (req, res) => {
  const { id } = req.params;
  // const aluno = await Aluno.findById(id);
  res.render("aluno/menuAluno", { id });
};

// const renderizaPerfil = async (req, res) => {
//   const { id } = req.params;
//   const aluno = await Aluno.findById(id);
//   res.render("aluno/perfilAluno", { aluno });
// };

const renderizaPerfil = async (req, res) => {
  const { id } = req.params;
  try {
    const aluno = await Aluno.findById(id);
    if (!aluno) {
      return res.status(404).json({ message: "Aluno não encontrado" });
    }
    aluno.telefone = formatarTelefone(aluno.telefone); // Atualiza o campo com o número formatado
    aluno.idade = calcularIdade(aluno.dt_nascimento); // Adiciona a idade
    res.render("aluno/perfilAluno", { aluno });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const renderizaEncontrarAcademias = (req, res) => {
  try {
    // Aqui você pode passar dados para a página, se necessário
    res.render("aluno/encontrarAcademia", { academia: [] }); // Passe 'academias' se estiver renderizando dinamicamente
  } catch (error) {
    console.error(
      "Erro ao carregar a página encontrarAcademia:",
      error.message
    );
    res.status(500).send("Erro ao carregar a página");
  }
};

const renderizaEncontrarPersonais = async (req, res) => {
  // const { id } = req.params;
  // const aluno = await Aluno.findById(id);
  const personais = await Personal.findAll();
  res.render("aluno/encontrarPersonal", personais);
};

const renderizaListaPersonais = async (req, res) => {
  try {
    const personais = await Personal.findAll(); // Supondo que esta função retorne os personais cadastrados no banco de dados
    res.render("aluno/encontrarPersonal", { personais }); // Passa 'personais' para o template
  } catch (error) {
    console.error("Erro ao buscar os personais:", error.message);
    res.status(500).json({ error: "Erro interno ao buscar personais" });
  }
};

// const renderizaPerfil = async (req, res) => {
//   const { id } = req.params;
//   try {
//     const aluno = await Aluno.findById(id);
//     if (!aluno) {
//       return res.status(404).json({ message: "Aluno não encontrado" });
//     }
//     aluno.idade = calcularIdade(aluno.dt_nascimento); // Adiciona a idade ao objeto do aluno
//     res.render("aluno/perfilAluno", { aluno });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

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

    res.status(200).json({
      message: "Aluno autenticado com sucesso!",
      token,
      redirectTo: `/aluno/menu/${aluno.id}`,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
};

const matriculaAlunoAcademia = async (req, res) => {
  const { idAluno, idAcademia } = req.body;

  try {
    const result = await Aluno.insertInGym(idAluno, idAcademia);

    res
      .status(200)
      .json({ message: "Aluno Matriculado na academia com sucesso!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const desmatriculaAlunoAcademia = async (req, res) => {
  const { idAluno, idAcademia } = req.body;

  try {
    const result = await Aluno.removeFromGyn(idAluno, idAcademia);

    res.status(200).json({ message: "Aluno Desmatriculado com sucesso!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const contrataPersonal = async (req, res) => {
  const { idAluno, idPersonal } = req.body;

  try {
    const result = await Aluno.addPersonal(idAluno, idPersonal);

    res.status(200).json({
      message: "Personal contratado com sucesso!",
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const removePersonal = async (req, res) => {
  const { idAluno, idPersonal } = req.body;

  try {
    const result = await Aluno.removePersonal(idAluno, idPersonal);

    res.status(200).json({ message: "Personal removido com sucesso!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
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
  matriculaAlunoAcademia,
  desmatriculaAlunoAcademia,
  contrataPersonal,
  removePersonal,
  renderizaEncontrarAcademias,
  renderizaEncontrarPersonais,
  formatarTelefone,
  renderizaListaPersonais,
  renderizaMontarTreino,
  renderizaMeusTreinos,
  renderizaTreino,
  renderizaExercicio,
};
