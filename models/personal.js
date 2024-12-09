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
    [id,]);
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
  const { descricao,  nome, telefone } = personalData;

  try {
    const result = await pool.query(
      "UPDATE tb_personal SET descricao = $1, nome = $2, telefone = $3 WHERE id = $4 RETURNING *",
      [descricao, nome, telefone, id]
    );

    return result.rows; // Deve retornar a linha atualizada
  } catch (error) {
    console.error("Erro na atualização do banco de dados:", error.message);
    throw error;
  }
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

const findAluno = async (personalId) => {
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

const adicionarAluno = async ( id_aluno,id_personal) => {
  const result = await pool.query(
    "INSERT INTO tb_alunos_personais (id_aluno, id_personal) VALUES ($1, $2) RETURNING *",
    [id_aluno,id_personal ]
  );

  return result.rows[0];
};

const removerAluno = async ( id_aluno,id_personal) => {
  const result = await pool.query(
    "DELETE FROM tb_alunos_personais WHERE id_aluno = $1 AND id_personal = $2",
    [id_aluno,id_personal]
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
  findAluno,
  removerAluno,
  adicionarAluno,
};
