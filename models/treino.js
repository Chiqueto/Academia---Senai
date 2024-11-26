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

const setRepeticao = async (id_treino, id_aluno, id_exercicio, carga, reps) => {
  const serie =
    (await pool.query(
      "SELECT COUNT(1) FROM tb_registro_treino WHERE id_treino = $1 AND id_exercicio = $2 AND id_aluno = $3  AND dt_treino = current_date",
      [id_treino, id_exercicio, id_aluno]
    )) + 1;

  const result = await pool.query(
    "INSERT INTO tb_registro_treino (id_treino, id_exercicio, id_aluno, dt_treino, serie, carga, reps ) VALUES ($1, $2, $6, current_date, $3, $4, $5) RETURNING *",
    [id_treino, id_exercicio, serie, carga, reps, id_aluno]
  );

  return result.rows[0];
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
};
