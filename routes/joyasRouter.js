const express = require("express");
const router = express.Router();
const { getJoyas, filtrarJoyas } = require("../controllers/joyasController");

router.get("/", getJoyas);
router.get("/filtros", filtrarJoyas);

module.exports = router;
