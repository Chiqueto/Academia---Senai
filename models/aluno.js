const pool = require("../db.js");

const createAluno = async (alunoData) => {
  const { nome, email, senha, genero, telefone, dt_nascimento } = alunoData;

  const resut = await pool.query(
    "INSERT INTO tb_aluno (nome, email, senha, genero, telefone, dt_nascimento) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
    [nome, email, senha, genero, telefone, dt_nascimento]
  );
  return resut.rows[0];
};

const findAll = async () => {
  const result = await pool.query("SELECT * FROM tb_aluno");
  return result.rows;
};

const findById = async (id) => {
  const result = await pool.query("SELECT * FROM tb_aluno WHERE id = $1", [id]);
  return result.rows[0];
};

const deleteAluno = async (id) => {
  const result = await pool.query("DELETE FROM tb_aluno WHERE id = $1", [id]);
  return result.rowCount;
};

const updateAluno = async (id, alunoData) => {
  const { nome, telefone } = alunoData;
  const result = await pool.query(
    "UPDATE tb_aluno SET nome = $1, telefone = $2 WHERE id = $3 RETURNING *",
    [nome, telefone, id]
  );
  return result.rows[0];
};

module.exports = {
  findAll,
  findById,
  createAluno,
  deleteAluno,
  updateAluno,
};
