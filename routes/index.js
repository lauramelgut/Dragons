var express = require("express");
const indexController = require("../controllers/indexController");
var router = express.Router();

//Ruta base del archivo: localhost:3000

/* GET home page. */
//localhost:3000

router.get("/", indexController.viewHome);

module.exports = router;
