const pool = require("../db.js");

const createAluno = async (alunoData) => {
  const { nome, email, senha, genero, telefone, dt_nascimento } = alunoData;

  const resut = await pool.query(
    "INSERT INTO tb_aluno (nome, email, senha, genero, telefone, dt_nascimento) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
    [nome, email, senha, genero, telefone, dt_nascimento]
  );
  return resut.rows[0];
};


const calcularIdade = (dataNascimento) => {
  const hoje = new Date();
  const nascimento = new Date(dataNascimento);
  let idade = hoje.getFullYear() - nascimento.getFullYear();
  const mes = hoje.getMonth() - nascimento.getMonth();

  if (mes < 0 || (mes === 0 && hoje.getDate() < nascimento.getDate())) {
    idade--;
  }

  return idade;
};

const findAll = async () => {
  const result = await pool.query("SELECT * FROM tb_aluno");
  return result.rows;
};

const findById = async (id) => {
  const result = await pool.query("SELECT * FROM tb_aluno WHERE id = $1", [id]);
  if (result.rows.length > 0) {
    const aluno = result.rows[0];
    aluno.idade = calcularIdade(aluno.dt_nascimento);
    return aluno;
  }
  return null;
};

const findByNome = async (nome) => {
  console.log("Nome recebido no modelo:", nome);

  const result = await pool.query(
    "SELECT * FROM tb_aluno WHERE nome ILIKE $1",
    [`%${nome}%`] // Utiliza o operador LIKE para busca parcial
  );

  console.log("Resultado da query:", result.rows);

  return result.rows; // Retorna todas as linhas encontradas
};


// const findById = async (id) => {
//   const result = await pool.query("SELECT * FROM tb_aluno WHERE id = $1", [id]);
//   return result.rows[0];
// };

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

const loginAluno = async (email) => {
  const result = await pool.query("SELECT * FROM tb_aluno WHERE email = $1", [
    email,
  ]);
  if (result.rowCount === 0) {
    return null;
  }
  return result.rows[0];
};

const findByEmail = async (email) => {
  const result = await pool.query("SELECT * FROM tb_aluno WHERE email = $1", [
    email,
  ]);

  return result.rows[0];
};


const insertInGym = async (idAluno, idAcademia) => {
  const result = await pool.query(
    "Insert INTO tb_alunos_academias (id_aluno, id_academia) VALUES ($1, $2) RETURNING *",
    [idAluno, idAcademia]
  );
  return result.rows[0];
};

const removeFromGyn = async (idAluno, idAcademia) => {
  const result = await pool.query(
    "DELETE FROM tb_alunos_academias WHERE id_aluno = $1 AND id_academia = $2",
    [idAluno, idAcademia]
  );
  return result.rowCount;
};

const addPersonal = async (idAluno, idPersonal) => {
  const result = await pool.query(
    "INSERT INTO tb_alunos_personais (id_aluno, id_personal) VALUES ($1, $2) RETURNING *",
    [idAluno, idPersonal]
  );

  return result.rows[0];
};

const removePersonal = async (idAluno, idPersonal) => {
  const result = await pool.query(
    "DELETE FROM tb_alunos_personais WHERE id_aluno = $1 AND id_personal = $2",
    [idAluno, idPersonal]
  );
  return result.rowCount;
};

module.exports = {
  findAll,
  findById,
  createAluno,
  deleteAluno,
  updateAluno,
  loginAluno,
  findByEmail,
  insertInGym,
  removeFromGyn,
  addPersonal,
  removePersonal,
  findByNome,
};
