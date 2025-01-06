const Treino = require("../models/treino.js");
const Exercicio = require("../models/exercicio.js");
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

const personalDeleteTreino = async (req, res) => {
  const { id_treino } = req.params;
  try {
    const deleteTreinoAluno = await Treino.deleteTreinoAluno(id_treino);
    const result = await Treino.deleteTreino(id_treino);
    if (result === 0) {
      return res.status(404).json({ message: "Treino não encontrado!" });
    }
    res.json({ message: "Treino excluído com sucesso!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deletarTreino = async (req, res) => {
  const { id_treino } = req.params;
  try {
    // Verificar se o treino tem um id_personal
    const treino = await Treino.getTreinoById(id_treino);
    if (!treino) {
      return res.status(404).json({ message: "Treino não encontrado!" });
    }

    if (treino.id_personal) {
      // Se o treino tem um id_personal, excluir apenas da tabela tb_treino_alunos
      const result = await Treino.deleteTreinoAluno(id_treino);
      console.log("ENTROUUUU COMO PERSONALLLL");
      if (result === 0) {
        return res
          .status(404)
          .json({ message: "Treino não encontrado na tabela de alunos!" });
      }
      res.json({ message: "Treino excluído da tabela de alunos com sucesso!" });
    } else {
      // Se o treino não tem um id_personal, excluir da tabela treinos
      const deleteTreinoAluno = await Treino.deleteTreinoAluno(id_treino);
      const result = await Treino.deleteTreino(id_treino);
      if (result === 0) {
        return res.status(404).json({ message: "Treino não encontrado!" });
      }
      res.json({ message: "Treino excluído com sucesso!" });
    }
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

  console.log(
    "id_aluno" +
      id_aluno +
      "id_treino" +
      id_treino +
      "id_exercicio" +
      id_exercicio +
      "carga" +
      carga +
      "reps" +
      reps
  );

  if (!id_treino || !id_aluno || !id_exercicio || !carga || !reps) {
    return res.status(400).json({ message: "Preencha todos os campos!" });
  }

  try {
    // Obtenha o número máximo de séries para o exercício
    const maxSeries = await Exercicio.getMaxSeries(id_treino, id_exercicio);

    if (!maxSeries) {
      return res
        .status(404)
        .json({ message: "Exercício não encontrado ou sem limite definido." });
    }

    // Obtenha o número de séries feitas no dia
    const dt_atual = new Date().toLocaleDateString("en-CA"); // Formato 'YYYY-MM-DD'
    const seriesFeitas = await Treino.getSeriesFeitas(
      id_treino,
      id_exercicio,
      id_aluno,
      dt_atual
    );

    // Verifique se o número máximo foi atingido
    if (seriesFeitas >= maxSeries) {
      return res
        .status(400)
        .json({ message: "Número máximo de séries já alcançado para hoje." });
    }

    // Registre a nova repetição
    const repeticaoRegistrada = await Treino.setRepeticao(
      id_treino,
      id_aluno,
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

const adicionarExercicios = async (req, res) => {
  const { id_treino, exercicios } = req.body; // Recebe um array de objetos com id e series

  // Verificação básica de entrada
  if (!id_treino || !Array.isArray(exercicios) || exercicios.length === 0) {
    return res.status(400).json({
      error: "ID do treino ou lista de exercícios inválida.",
    });
  }

  console.log("Exercícios recebidos:", exercicios);

  // Valida se todos os exercícios possuem séries
  for (const exercicio of exercicios) {
    if (!exercicio.series) {
      return res.status(400).json({
        error: "Cada exercício deve conter um número de séries.",
      });
    }
  }

  try {
    // Consultar exercícios já associados ao treino
    const exerciciosExistentes = await Treino.getExerciciosByTreino(id_treino);
    console.log("teste exercicios existentes");
    console.log(exerciciosExistentes);
    // Verificar se algum dos IDs enviados já está associado
    const exerciciosJaAdicionados = exercicios.filter((exercicio) =>
      exerciciosExistentes.some(
        (exExistente) => exExistente.id === exercicio.id
      )
    );

    // Nome dos exercícios duplicados
    const nomeExerciciosAdicionados = exerciciosJaAdicionados.map(
      (exercicio) =>
        exerciciosExistentes.find(
          (exExistente) => exExistente.id === exercicio.id
        ).nome
    );

    // Retorna erro se houver exercícios duplicados
    console.log(exerciciosJaAdicionados);
    if (exerciciosJaAdicionados.length > 0) {
      return res.status(400).json({
        error: `Os exercícios já estão associados ao treino: ${nomeExerciciosAdicionados.join(
          ", "
        )}`,
      });
    }

    // Adiciona exercícios ao treino
    const exerciciosAdicionados = await Treino.setExercises(
      id_treino,
      exercicios
    );

    // Verifica se os exercícios foram adicionados corretamente
    if (!exerciciosAdicionados || exerciciosAdicionados.length === 0) {
      return res.status(500).json({
        error: "Nenhum exercício foi adicionado ao treino. Tente novamente.",
      });
    }

    res.status(201).json({
      message: "Exercícios adicionados ao treino com sucesso!",
      exerciciosAdicionados,
    });
  } catch (error) {
    console.error("Erro ao adicionar exercícios:", error);

    // Trata erros específicos do pool ou SQL
    if (error.code === "23505") {
      return res.status(409).json({
        error: "Conflito: os exercícios já estão associados ao treino.",
      });
    }

    // Trata outros erros inesperados
    res.status(500).json({
      error: "Erro inesperado ao adicionar exercícios.",
      detalhes: error.message,
    });
  }
};

const removerExercicio = async (req, res) => {
  const { id_treino, id_exercicio } = req.params;

  try {
    const exercicioRemovido = await Treino.removeExercise(
      id_treino,
      id_exercicio
    );

    res.status(201).json({
      message: "Exercício removido do treino!",
      exercicioRemovido,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const listarExerciciosPorTreino = async (req, res) => {
  const { id_treino } = req.params;

  try {
    const exercicios = await Treino.getExerciciosByTreino(id_treino);

    res.status(201).json({ exercicios });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const iniciarTreino = async (req, res) => {
  const { id_aluno, id_treino } = req.params;

  if (!id_treino || !id_aluno) {
    return res.status(400).json({ message: "Preencha todos os campos!" });
  }

  try {
    const treinoIniciado = await Treino.initTreino(id_aluno, id_treino);

    res
      .status(201)
      .json({ message: "Treino iniciado!", treinoIniciado, status: "ativo" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const cancelarTreino = async (req, res) => {
  const { id_aluno, id_treino } = req.params;

  if (!id_treino || !id_aluno) {
    return res.status(400).json({ message: "Preencha todos os campos!" });
  }

  try {
    const treinoCancelado = await Treino.deleteTreinoExec(id_aluno, id_treino);
    if (treinoCancelado === 0) {
      return res.status(404).json({ message: "Treino não encontrado!" });
    } else {
      const seriesCanceladas = await Treino.deleteDoneSeries(
        id_aluno,
        id_treino
      );
    }

    res.status(201).json({
      message: "Treino cancelado!",
      treinoCancelado,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const concluirTreino = async (req, res) => {
  const { id_aluno, id_treino } = req.params;

  if (!id_treino || !id_aluno) {
    return res.status(400).json({ message: "Preencha todos os campos!" });
  }

  try {
    const treinoFinalizado = await Treino.finishTreino(id_aluno, id_treino);

    res.status(201).json({
      message: "Treino finalizado!",
      treinoFinalizado,
      status: "concluído",
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const verificaSeries = async (req, res) => {
  const { id_treino, id_aluno } = req.params;

  try {
    const seriesFeitas = await Treino.getFinishedSeriesByTreino(
      id_treino,
      id_aluno
    );

    const totalSeries = await Treino.getAllSeriesByTreino(id_treino);
    let statusTreino;
    if (seriesFeitas === totalSeries) {
      statusTreino = "finalizado";
    } else {
      statusTreino = "incompleto";
    }

    console.log("Status Treino:", statusTreino);

    res.status(201).json({
      data: {
        statusTreino,
      },
    });
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
  adicionarExercicios,
  removerExercicio,
  listarExerciciosPorTreino,
  iniciarTreino,
  cancelarTreino,
  concluirTreino,
  verificaSeries,
  personalDeleteTreino,
};
