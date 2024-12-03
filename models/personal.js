const pool = require("../db.js");

const createPersonal = async (personalData) => {
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
  } = personalData;

  const resut = await pool.query(
    "INSERT INTO tb_personal (nome, email, senha, cref, cep, cidade, uf, descricao, especialidade, telefone) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *",
    [
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
    ]
  );
  return resut.rows[0];
};

const findAll = async () => {
  const result = await pool.query("SELECT * FROM tb_personal");
  return result.rows;
};

const findById = async (id) => {
  console.log("ID recebido no modelo:", id);

  const result = await pool.query("SELECT * FROM tb_personal WHERE id = $1", 
    [id]);
  console.log("Resultado da query:", result.rows);

  return result.rows[0];
};

const findByNome = async (nome) => {
  console.log("Nome recebido no modelo:", nome);

  const result = await pool.query(
    "SELECT * FROM tb_personal WHERE nome ILIKE $1",
    [`%${nome}%`] // Utiliza o operador LIKE para busca parcial
  );

  console.log("Resultado da query:", result.rows);

  return result.rows; // Retorna todas as linhas encontradas
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

const findAlunoByPersonalId = async (personalId) => {
  console.log("Personal ID recebido:", personalId);
  const result = await pool.query(
    "SELECT * FROM tb_aluno WHERE id IN (SELECT id_aluno FROM tb_alunos_personais WHERE id_personal = $1 )",
    [personalId]
  );
  console.log("Resultado da query:", result.rows);
  return result.rows;
};



const findByEmail = async (email) => {
  const result = await pool.query(
    "SELECT * FROM tb_personal WHERE email = $1",
    [email]
  );

  return result.rows[0];
};

const addAluno = async (idPersonal, idAluno) => {
  const result = await pool.query(
    "INSERT INTO tb_alunos_personais (id_personal, id_aluno) VALUES ($1, $2) RETURNING *",
    [idPersonal, idAluno]
  );

  return result.rows[0];
};

const removeAluno = async (idPersonal, idAluno) => {
  const result = await pool.query(
    "DELETE FROM tb_alunos_personais WHERE id_personal = $1 AND id_aluno = $2",
    [idPersonal, idAluno]
  );
  return result.rowCount;
};

module.exports = {
  findAll,
  findById,
  createPersonal,
  deletePersonal,
  updatePersonal,
  loginPersonal,
  findByEmail,
  findByNome,
  findAlunoByPersonalId,
  removeAluno,
  addAluno,
};
