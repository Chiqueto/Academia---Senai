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

  return result.rows[0];
};

const findStudents = async (id) => {
  const result = await pool.query(
    "SELECT * FROM tb_aluno WHERE id in (SELECT id_aluno FROM tb_alunos_academias WHERE id_academia = $1)",
    [id]
  );

  return result.rows;
};

const findPersonais = async (id) => {
  const result = await pool.query(
    "SELECT * FROM tb_personal WHERE id in (SELECT id_personal FROM tb_academias_personais WHERE id_academia = $1)",
    [id]
  );

  return result.rows;
};


const updateAcademia = async (id, academiaData) => {
  const { cidade, bairro, logradouro, telefone, nome } = academiaData;

  try {
    const result = await pool.query(
      "UPDATE tb_academia SET cidade = $1, bairro = $2, logradouro = $3, telefone = $4, nome = $5 WHERE id = $6 RETURNING *",
      [cidade, bairro, logradouro, telefone, nome, id]
    );

    return result.rows; // Deve retornar a linha atualizada
  } catch (error) {
    console.error("Erro na atualização do banco de dados:", error.message);
    throw error;
  }
};



// const updateAcademia = async (id, academiaData) => {
//   const { nome, cep, cidade, bairro, logradouro, numero, uf, telefone } =
//     academiaData;
//   console.log({
//     nome,
//     cep,
//     cidade,
//     bairro,
//     logradouro,
//     numero,
//     uf,
//     telefone,
//     id,
//   });
//   const result = await pool.query(
//     "UPDATE tb_academia SET nome = $1, cep = $2, cidade = $3, bairro = $4, logradouro = $5, numero = $6, uf = $7, telefone = $8 WHERE id = $9 RETURNING *",
//     [nome, cep, cidade, bairro, logradouro, numero, uf, telefone, id]
//   );

//   return result.rows;
// };

const deleteAcademia = async (id) => {
  const result = pool.query("DELETE FROM tb_academia WHERE id = $1", [id]);

  return result.rowCount;
};
const deleteAlunos = async (id) => {
  const result = pool.query("DELETE FROM tb_academia WHERE id = $1", [id]);

  return result.rowCount;
};

const deletePersonal = async (idPersonal, idAcademia) => {
  const result = await pool.query(
    "DELETE FROM tb_academias_personais WHERE id_personal = $1 AND id_academia = $2",
    [idPersonal, idAcademia]
  );
  return result.rowCount;
};



const findByCnpj = async (cnpj) => {
  const result = await pool.query("SELECT * FROM tb_academia WHERE cnpj = $1", [
    cnpj,
  ]);

  return result.rows[0];
};

const findByEmail = async (email) => {
  const result = await pool.query(
    "SELECT * FROM tb_academia WHERE email = $1",
    [email]
  );

  return result.rows[0];
};

const loginAcademia = async (email) => {
  const result = await pool.query(
    "SELECT * FROM tb_academia WHERE email = $1",
    [email]
  );
  if (result.rowCount === 0) {
    return null;
  }
  return result.rows[0];
};

const insertPersonal = async (id_academia, id_personal) => {
  const result = await pool.query(
    "INSERT INTO tb_academias_personais (id_academia, id_personal) VALUES ($1, $2) RETURNING *",
    [id_academia, id_personal]
  );

  return result.rows[0];
};



module.exports = {
  createAcademia,
  findAll,
  findById,
  updateAcademia,
  deleteAcademia,
  findByCnpj,
  findByEmail,
  loginAcademia,
  findStudents,
  findPersonais,
  insertPersonal,
  deleteAlunos,
  deletePersonal,

};
