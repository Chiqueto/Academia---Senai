const pool = require("../db.js");

const createPersonal = async (personalData) => {
  const {
    nome,
    email,
    senha,
    cep,
    cidade,
    uf,
    descricao,
    especialidade,
    telefone,
  } = personalData;

  const resut = await pool.query(
    "INSERT INTO tb_personal (nome, email, senha, cep, cidade, uf, descricao, especialidade, telefone) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *",
    [nome, email, senha, cep, cidade, uf, descricao, especialidade, telefone]
  );
  return resut.rows[0];
};

const findAll = async () => {
  const result = await pool.query("SELECT * FROM tb_personal");
  return result.rows;
};

const findById = async (id) => {
  const result = await pool.query("SELECT * FROM tb_personal WHERE id = $1", [
    id,
  ]);
  return result.rows[0];
};

const deletePersonal = async (id) => {
  const result = await pool.query("DELETE FROM tb_personal WHERE id = $1", [
    id,
  ]);
  return result.rowCount;
};

const updatePersonal = async (id, personalData) => {
  const { nome, cep, cidade, uf, descricao, especialidade, telefone } =
    personalData;
  const result = await pool.query(
    "UPDATE tb_personal SET nome = $1, cep = $2, cidade = $3, uf = $4, descricao = $5, especialidade = $6, telefone = $7 WHERE id = $8 RETURNING *",
    [nome, cep, cidade, uf, descricao, especialidade, telefone, id]
  );
  return result.rows[0];
};

const loginPersonal = async (email) => {
  const result = await pool.query(
    "SELECT * FROM tb_personal WHERE email = $1",
    [email]
  );
  if (result.rowCount === 0) {
    return null;
  }
  return result.rows[0];
};

const findByEmail = async (email) => {
  const result = await pool.query(
    "SELECT * FROM tb_personal WHERE email = $1",
    [email]
  );

  return result.rows[0];
};

module.exports = {
  findAll,
  findById,
  createPersonal,
  deletePersonal,
  updatePersonal,
  loginPersonal,
  findByEmail,
};
