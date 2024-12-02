const Exercicio = require("../models/exercicio.js");

// Cria um novo exercício
const criarExercicio = async (req, res) => {
  const { id_personal } = req.params;
  const { nome, descricao, url_video } = req.body;

  if (!id_personal || !nome || !descricao || !url_video) {
    return res.status(400).json({ message: "Preencha todos os campos!" });
  }

  try {
    const novoExercicio = await Exercicio.createExercicio({
      id_personal,
      nome,
      descricao,
      url_video,
    });
    res.status(201).json(novoExercicio);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Erro ao criar exercício", error: error.message });
  }
};

// Atualiza um exercício existente
const atualizarExercicio = async (req, res) => {
  const { id_personal, id_exercicio } = req.params;
  const { nome, descricao, url_video } = req.body;

  if (!id_personal || !id_exercicio || !nome || !descricao || !url_video) {
    return res.status(400).json({ message: "Preencha todos os campos!" });
  }

  try {
    const exercicioAtualizado = await Exercicio.updateExercicio(id_exercicio, {
      nome,
      descricao,
      url_video,
    });

    if (!exercicioAtualizado) {
      return res.status(404).json({ message: "Exercício não encontrado" });
    }

    res.status(200).json(exercicioAtualizado);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Erro ao atualizar exercício", error: error.message });
  }
};

// Remove um exercício
const deletarExercicio = async (req, res) => {
  const { id } = req.params;

  try {
    const linhasRemovidas = await Exercicio.deleteExercicio(id);

    if (linhasRemovidas === 0) {
      return res.status(404).json({ message: "Exercício não encontrado" });
    }

    res.status(200).json({ message: "Exercício removido com sucesso" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Erro ao remover exercício", error: error.message });
  }
};

const listarExercicios = async (req, res) => {
  try {
    const exercicios = await Exercicio.getExercicios();

    res.status(201).json(exercicios);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const listarExerciciosById = async (req, res) => {
  const { id } = req.params;

  try {
    const exercicio = await Exercicio.getExercicioById(id);

    res.status(201).json(exercicio);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const listarExerciciosByPersonal = async (req, res) => {
  const { id_personal } = req.params;

  try {
    const exercicios = await Exercicio.getExerciciosByPersonal(id_personal);

    res.status(201).json(exercicios);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const listarExerciciosPorTreino = async (req, res) => {
  const { id_treino } = req.params;
  // console.log("Entrou" + id_treino);

  try {
    const treinos = await Exercicio.getExerciciosByTreino(id_treino);
    // console.log(treinos);
    res.status(201).json(treinos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  criarExercicio,
  atualizarExercicio,
  deletarExercicio,
  listarExercicios,
  listarExerciciosById,
  listarExerciciosByPersonal,
  listarExerciciosPorTreino,
};
