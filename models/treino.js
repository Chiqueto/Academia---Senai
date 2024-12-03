const pool = require("../db.js");

const createTreino = async (treinoData) => {
  const { id_personal, nome, descricao } = treinoData;

  const result = await pool.query(
    "INSERT INTO tb_treino (id_personal, nome, descricao) VALUES ($1, $2, $3) RETURNING *",
    [id_personal, nome, descricao]
  );
  return result.rows[0];
};

const deleteTreino = async (id) => {
  const result = await pool.query("DELETE FROM tb_treino WHERE id = $1", [id]);

  return result.rowCount;
};

const getTreinos = async () => {
  const result = await pool.query("SELECT * FROM tb_treino");

  return result.rows;
};

const getTreinoById = async (id) => {
  const result = await pool.query("SELECT * FROM tb_treino WHERE id = $1", [
    id,
  ]);

  return result.rows[0];
};

const getTreinosByPersonal = async (id_personal) => {
  const result = await pool.query(
    "SELECT * FROM tb_treino WHERE id_personal = $1",
    [id_personal]
  );

  return result.rows;
};

const getTreinosByAluno = async (id_aluno) => {
  const result = await pool.query(
    "SELECT * FROM tb_treino WHERE id IN (SELECT id_treino FROM tb_treino_alunos WHERE id_aluno = $1)",
    [id_aluno]
  );

  return result.rows;
};

const updateTreino = async (id, treinoData) => {
  const { nome, descricao } = treinoData;

  const result = await pool.query(
    "UPDATE tb_treino SET nome = $1, descricao = $2 WHERE id = $3 RETURNING *",
    [nome, descricao, id]
  );

  return result.rows[0];
};

const setTreino = async (idAluno, idTreino) => {
  const result = await pool.query(
    "INSERT INTO tb_treino_alunos (id_treino, id_aluno) VALUES ($1, $2) RETURNING *",
    [idTreino, idAluno]
  );

  return result.rows[0];
};

const setExercises = async (id_treino, exercicios) => {
  const values = exercicios
    .map((_, i) => `($1, $${i * 2 + 2}, $${i * 2 + 3})`)
    .join(", ");
  const params = exercicios.reduce(
    (acc, exercicio) => acc.concat([exercicio.id, exercicio.series]),
    [id_treino]
  );
  const query = `
    INSERT INTO tb_treino_exercicio (id_treino, id_exercicio, series)
    VALUES ${values}
    RETURNING *;
  `;
  const result = await pool.query(query, params);
  return result.rows;
};

const setRepeticao = async (id_treino, id_aluno, id_exercicio, carga, reps) => {
  const serieQuery = await pool.query(
    "SELECT COUNT(1) FROM tb_registro_treino WHERE id_treino = $1 AND id_exercicio = $2 AND id_aluno = $3  AND dt_treino = current_date",
    [id_treino, id_exercicio, id_aluno]
  );

  const count = serieQuery.rows[0].count;
  const serie = Number(count) + 1;

  console.log("teste serie", serie);

  console.log(
    `Teste ${id_treino} ${id_exercicio} ${id_aluno} ${carga} ${reps} ${serie}`
  );

  const result = await pool.query(
    "INSERT INTO tb_registro_treino (id_treino, id_exercicio, id_aluno, dt_treino, serie, carga, qtde_reps ) VALUES ($1, $2, $6, CURRENT_DATE::DATE, $3, $4, $5) RETURNING *",
    [id_treino, id_exercicio, serie, carga, reps, id_aluno]
  );

  return result.rows[0];
};

const removeExercise = async (id_treino, id_exercicio) => {
  const result = await pool.query(
    "DELETE FROM tb_treino_exercicio WHERE id_treino = $1 AND id_exercicio = $2",
    [id_treino, id_exercicio]
  );

  return result.rowCount;
};

const getExerciciosByTreino = async (id_treino) => {
  const result = await pool.query(
    "SELECT e.* FROM tb_treino t, tb_exercicio e WHERE t.id = $1 AND e.id IN (SELECT id_exercicio FROM tb_treino_exercicio WHERE id_exercicio = e.id) ",
    [id_treino]
  );

  return result.rows;
};

const getSeriesFeitas = async (id_treino, id_exercicio, id_aluno, dt_atual) => {
  const result = await pool.query(
    "SELECT COALESCE(MAX(serie), 0) AS max_serie FROM tb_registro_treino WHERE id_treino = $1 AND id_exercicio = $2 AND id_aluno = $3 AND dt_treino = $4",
    [id_treino, id_exercicio, id_aluno, dt_atual]
  );

  return result.rows[0].max_serie;
};

const initTreino = async (id_aluno, id_treino) => {
  const result = await pool.query(
    "INSERT INTO tb_historico_treino (id_aluno, id_treino, dt_treino, hr_inicio) VALUES ($1, $2, current_date, current_timestamp) RETURNING *",
    [id_aluno, id_treino]
  );

  return result.rows[0];
};

const getTreinoStatus = async (id_aluno, id_treino) => {
  const result = await pool.query(
    "SELECT * FROM tb_historico_treino WHERE id_aluno = $1 AND id_treino = $2 AND dt_treino = current_date",
    [id_aluno, id_treino]
  );

  return result.rows[0];
};

const deleteTreinoExec = async (id_aluno, id_treino) => {
  const result = await pool.query(
    "DELETE FROM tb_historico_treino WHERE id_aluno = $1 AND id_treino = $2 AND dt_treino = current_date",
    [id_aluno, id_treino]
  );

  return result.rowCount;
};

const finishTreino = async (id_aluno, id_treino) => {
  const result = await pool.query(
    "UPDATE tb_historico_treino SET hr_conclusao = current_timestamp, concluido = true WHERE id_aluno = $1 AND id_treino = $2 AND dt_treino = current_date RETURNING *",
    [id_aluno, id_treino]
  );

  return result.rows[0];
};

const getAllSeriesByTreino = async (id_treino) => {
  const result = await pool.query(
    "SELECT SUM(series) AS total_series FROM tb_treino_exercicio WHERE id_treino = $1",
    [id_treino]
  );

  return result.rows[0].total_series;
};

const getFinishedSeriesByTreino = async (id_treino, id_aluno) => {
  const result = await pool.query(
    "SELECT COUNT(1) AS series_feitas FROM tb_registro_treino WHERE id_treino = $1 AND id_aluno = $2 AND dt_treino = current_date",
    [id_treino, id_aluno]
  );

  return result.rows[0].series_feitas;
};

module.exports = {
  createTreino,
  deleteTreino,
  updateTreino,
  setTreino,
  setRepeticao,
  getTreinoById,
  getTreinos,
  getTreinosByPersonal,
  getTreinosByAluno,
  setExercises,
  removeExercise,
  getExerciciosByTreino,
  getSeriesFeitas,
  initTreino,
  getTreinoStatus,
  deleteTreinoExec,
  finishTreino,
  getAllSeriesByTreino,
  getFinishedSeriesByTreino,
};
