const pool = require("../db.js");

const createAcademia = async (academiaData) => {
  const {
    nome,
    email,
    senha,
    cnpj,
    cep,
    cidade,
    bairro,
    logradouro,
    numero,
    uf,
    telefone,
  } = academiaData;

  const result = await pool.query(
    "INSERT INTO tb_academia (nome, email, senha, cnpj, cep, cidade, bairro, logradouro, numero, uf, telefone) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *",
    [
      nome,
      email,
      senha,
      cnpj,
      cep,
      cidade,
      bairro,
      logradouro,
      numero,
      uf,
      telefone,
    ]
  );
  return result.rows[0];
};

const findAll = async () => {
  const result = await pool.query("SELECT * FROM tb_academia");

  return result.rows;
};

const findById = async (id) => {
  const result = await pool.query("SELECT * FROM tb_academia WHERE id = $1", [
    id,
  ]);

  return result.rows;
};

module.exports = {
  createAcademia,
  findAll,
  findById,
};
