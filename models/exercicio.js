const pool = require("../db.js");

const createExercicio = async (exercicioData) => {
  const { id_personal, nome, descricao, url_video } = exercicioData;

  const result = await pool.query(
    "INSERT INTO tb_exercicio (id_personal, nome, descricao, url_video) VALUES ($1, $2, $3, $4) RETURNING *",
    [id_personal, nome, descricao, url_video]
  );
  return result.rows[0];
};

const updateExercicio = async (id, exercicioData) => {
  const { nome, descricao, url_video } = exercicioData;

  const result = await pool.query(
    "UPDATE tb_exercicio SET nome = $1, descricao = $2, url_video = $3 WHERE id = $4 RETURNING *",
    [nome, descricao, url_video, id]
  );

  return result.rows[0];
};

const deleteExercicio = async (id) => {
  const result = await pool.query("DELETE FROM tb_exercicio WHERE id = $1", [
    id,
  ]);

  return result.rowCount;
};

const getExercicios = async () => {
  const result = await pool.query("SELECT * FROM tb_exercicio");

  return result.rows;
};

const getExercicioById = async (id) => {
  const result = await pool.query("SELECT * FROM tb_exercicio WHERE id = $1", [
    id,
  ]);

  return result.rows[0];
};

const getExerciciosByPersonal = async (id_personal) => {
  const result = await pool.query(
    "SELECT * FROM tb_exercicio WHERE id_personal = $1",
    [id_personal]
  );

  return result.rows;
};

const getExerciciosByTreino = async (id_treino) => {
  const result = await pool.query(
    "SELECT e.* FROM tb_exercicio e WHERE e.id IN (SELECT id_exercicio FROM tb_treino_exercicio WHERE id_treino = $1) ",
    [id_treino]
  );

  return result.rows;
};

module.exports = {
  createExercicio,
  updateExercicio,
  deleteExercicio,
  getExercicios,
  getExercicioById,
  getExerciciosByPersonal,
  getExerciciosByTreino,
};
