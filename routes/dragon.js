var express = require("express");
const dragonController = require("../controllers/dragonController");
const uploadImage = require("../middleware/multer");
var router = express.Router();

//Ruta base del archivo:
//localhost:3000/dragon

//Muestra todos los dragones de todos los entrenadores que no esten borrados
// localhost:3000/dragon
router.get("/", dragonController.viewAllDragons);

//Muestra el formulario de crear nuevo Dragón
//localhost:3000/dragon/createDragon/:id

router.get("/createDragon/:id", dragonController.viewCreateDragonForm);

//Guarda la información de un nuevo dragón de un entrenador concreto
//localhost:3000/dragon/createDragon/:id
router.post(
  "/createDragon/:id",
  uploadImage("dragons"),
  dragonController.saveDragon
);

//Renderiza el formulario de crear dragon desde el navbar
//localhost:3000/dragon/addDragonNavbar
router.get("/addDragonNavbar", dragonController.addDragonNavbar);

//Guarda la info de un nuevo dragon desde el formulario del navbar
//localhost:3000/dragon/addDragonNavbar
router.post(
  "/addDragonNavbar",
  uploadImage("dragons"),
  dragonController.saveDragonNavbar
);

//Elimina de manera logica un dragon
//localhost:3000/dragon/logicDelete/:dragon_id
router.get("/logicDelete/:dragon_id/:trainer_id", dragonController.logicDelete);

//Borrado real de un dragon
//localhos:3000/dragon/delete/:dragon_id/:trainer_id
router.get("/delete/:dragon_id/:trainer_id", dragonController.deleteDragon);

//Renderiza la vista para editar un dragon
//localhost:3000/dragon/editDragon/:dragon_id
router.get("/editDragon/:dragon_id", dragonController.viewEditForm);

//Guarda la informacion editada de un dragon
//localhost:3000/dragon/editDragon/:dragon_id/:trainer_id
router.post(
  "/editDragon/:dragon_id/:trainer_id",
  uploadImage("dragons"),
  dragonController.saveEditDragon
);

module.exports = router;
