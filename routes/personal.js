const express = require("express");
const router = express.Router();
const personalController = require("../controllers/personal");
const { authMiddleware } = require("../middleware/authMiddleware");

router.get("/", personalController.renderizaLogin);
router.get("/cadastro", personalController.renderizaCadastro);
// router.get("/menu", personalController.renderizaMenu, authMiddleware);
// router.get("/perfilPersonal", personalController.renderizaPerfil, authMiddleware)

//Sem a autenticação
router.get("/menu", personalController.renderizaMenu);
// router.get("/perfilPersonal", personalController.renderizaPerfil);

router.post("/cadastro", personalController.criarPersonal);
// router.get("/listaPersonais", authMiddleware, personalController.listarPersonais);
// router.get("/buscarPersonal/:id", authMiddleware, personalController.buscarPersonal);
// router.delete("/deletar/:id", authMiddleware, personalController.deletarPersonal);
// router.put("/atualizar/:id", authMiddleware, personalController.atualizarPersonal);
router.post("/login", personalController.autenticaPersonal);

//Sem a autenticação
router.get("/listaPersonais", personalController.listarPersonais);
router.get("/buscarPersonal/:id", personalController.buscarPersonal);
router.delete("/deletar/:id", personalController.deletarPersonal);
router.put("/atualizar/:id", personalController.atualizarPersonal);

module.exports = router;
