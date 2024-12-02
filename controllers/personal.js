const Personal = require("../models/personal.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
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

const listarAlunos = async (req, res) => {
  const { id } = req.params; // Captura o ID do personal da URL

  try {
    // Supondo que você tenha uma função para listar alunos de um personal
    const alunos = await Personal.findAlunoByPersonalId(id); // Alterar conforme sua lógica

    if (alunos.length === 0) {
      return res.status(404).json({ message: "Nenhum aluno encontrado" });
    }

    res.render("personal/listaAlunos", { alunos }); // Passa os alunos para a view
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao listar alunos" });
  }
};

const buscarPersonal = async (req, res) => {
  const { id } = req.params;

  // console.log("ID recebido:", id);

  try {
    const personal = await Personal.findById(id);
    // console.log("Resultado da busca:", personal);
    if (personal) {
      res.status(200).json(personal);
    } else {
      res.status(404).json({ message: "Personal não encontrado" });
    }
  } catch (error) {
    console.error("Erro ao buscar personal:", error);
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
  const { id } = req.params;
  if (!id) return res.status(400).send("ID não fornecido!");
  res.render("personal/menuPersonal", { id });
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
    personal.idade = calcularIdade(personal.dt_nascimento); // Ajuste para considerar 'dt_nascimento'

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
    res.cookie("authToken", token, { httpOnly: true }); // Opcional: Define o token como cookie
    return res.redirect(`/personal/menuPersonal/${personal.id}`);
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
};
