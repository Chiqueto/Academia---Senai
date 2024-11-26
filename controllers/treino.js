const Treino = require("../models/treino.js");

const criarTreinoAluno = async (req, res) => {
  const { id_aluno } = req.params;
  const { nome, descricao } = req.body;

  if (!nome) {
    return res.status(400).json({ message: "Preencha todos os campos!" });
  }

  try {
    const novoTreino = await Treino.createTreino({
      nome,
      descricao,
    });
    console.log(id_aluno);

    fetch("http://localhost:3000/treino/atribuir", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id_aluno: id_aluno,
        id_treino: novoTreino.id,
      }),
    });

    // atribuirTreino(id_aluno, novoTreino.id);

    res
      .status(201)
      .json({ message: "Treino criado pelo aluno com sucesso!", novoTreino });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const criarTreinoPersonal = async (req, res) => {
  const { id_personal } = req.params;
  const { nome, descricao } = req.body;

  if (!nome) {
    return res.status(400).json({ message: "Preencha todos os campos!" });
  }

  try {
    const novoTreino = await Treino.createTreino({
      id_personal,
      nome,
      descricao,
    });

    res.status(201).json({
      message: "Treino criado pelo personal com sucesso!",
      novoTreino,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deletarTreino = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await Treino.deleteTreino(id);
    if (result === 0) {
      return res.status(404).json({ message: "Treino não encontrado!" });
    }
    res.json({ message: "Treino deletado com sucesso!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const atualizarTreino = async (req, res) => {
  const { id } = req.params;
  const { nome, descricao } = req.body;

  if (!nome || !descricao) {
    return res.status(400).json({ message: "Preencha todos os campos!" });
  }

  try {
    const treinoAtualizado = await Treino.updateTreino(id, { nome, descricao });
    if (!treinoAtualizado) {
      return res.status(404).json({ message: "Treino não encontrado!" });
    }
    res.json({ message: "Treino atualizado com sucesso!", treinoAtualizado });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const atribuirTreino = async (req, res) => {
  const { id_aluno, id_treino } = req.body;

  if (!id_aluno || !id_treino) {
    return res.status(400).json({ message: "Preencha todos os campos!" });
  }

  try {
    const treinoAtribuido = await Treino.setTreino(id_aluno, id_treino);
    res
      .status(201)
      .json({ message: "Treino atribuido com sucesso!", treinoAtribuido });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const registrarRepeticao = async (req, res) => {
  const { id_aluno } = req.params;
  const { id_treino, id_exercicio, carga, reps } = req.body;

  if (!id_treino || !id_aluno || !id_exercicio || !carga || !reps) {
    return res.status(400).json({ message: "Preencha todos os campos!" });
  }

  try {
    const repeticaoRegistrada = await Treino.setRepeticao(
      id_aluno,
      id_treino,
      id_exercicio,
      carga,
      reps
    );
    res.status(201).json({ message: "Série concluída!", repeticaoRegistrada });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const listarTreinos = async (req, res) => {
  try {
    const treinos = await Treino.getTreinos();
    res.status(201).json(treinos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getTreinoById = async (req, res) => {
  const { id } = req.params;

  try {
    const treino = await Treino.getTreinoById(id);

    res.status(201).json({ treino });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const listaTreinoPersonal = async (req, res) => {
  const { id_personal } = req.params;

  try {
    const treinos = await Treino.getTreinosByPersonal(id_personal);
    res.status(201).json(treinos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const listaTreinoAluno = async (req, res) => {
  const { id_aluno } = req.params;

  try {
    const treinos = await Treino.getTreinosByAluno(id_aluno);
    res.status(201).json(treinos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  criarTreinoPersonal,
  criarTreinoAluno,
  deletarTreino,
  atualizarTreino,
  atribuirTreino,
  registrarRepeticao,
  getTreinoById,
  listarTreinos,
  listaTreinoPersonal,
  listaTreinoAluno,
};
