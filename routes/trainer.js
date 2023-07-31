var express = require("express");
const trainerController = require("../controllers/trainerController");
const uploadImage = require("../middleware/multer");
var router = express.Router();

//Ruta base del archivo: localhost:3000

//Muestra todos los entrenadores
//localhost:3000/trainer

router.get("/", trainerController.getAllTrainer);

//Muestra el formulario de registro
//localhost:3000/trainer/register
router.get("/register", trainerController.viewRegisterForm);

//Guarda los datos de un nuevo entrenador
//localhost:3000/trainer/register
router.post("/register", uploadImage("trainers"), trainerController.register);

//Muestra la vista de perfil de un entrenador con sus dragones
//localhost:3000/trainer/oneTrainer/:id
router.get("/oneTrainer/:id", trainerController.viewOneTrainer);

//Muestra la vista de perfil de un entrenador con sus dragones con una sola consulta a su base de datos
//localhost:3000/trainer/otherOneTrainer/:id
router.get("/otherOneTrainer/:id", trainerController.viewOtherOneTrainer);

//Muestra formulario de login
//localhost:3000/trainer/login
router.get("/login", trainerController.viewLoginForm);

//Comprueba las credenciales de logueo
//localhost:3000/trainer/login
router.post("/login", trainerController.login);

//Borrado real de un artista
//localhos:3000/trainer/delete/:trainer_id
router.get("/delete/:trainer_id", trainerController.deleteTrainer);

//Borrado logico de artista
//localhost:3000/trainer/logicDelete/:trainer_id/:length
router.get(
  "/logicDelete/:trainer_id/:length",
  trainerController.logicDeleteTrainer
);

//Renderiza la vista del formulario de edicion de artista
//localhost:3000/trainer/editTrainer/:trainer_id
router.get("/editTrainer/:trainer_id", trainerController.viewEditForm);

//Recoge la informacion modificada del artista
//localhost:3000/trainer/editTrainer/:trainer_id
router.post(
  "/editTrainer/:trainer_id",
  uploadImage("trainers"),
  trainerController.saveEditTrainer
);

module.exports = router;
