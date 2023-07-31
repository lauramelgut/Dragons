const connection = require("../config/db");
class DragonController {
  //Muestra todos los dragones de todos los entrenadores que no esten borrados
  viewAllDragons = (req, res) => {
    let sql = `SELECT * FROM dragon WHERE is_deleted = 0`;

    connection.query(sql, (error, result) => {
      if (error) throw error;
      res.render("allDragons", { result });
    });
  };

  //Muestra el formulario de crear nuevo Dragón
  viewCreateDragonForm = (req, res) => {
    let id = req.params.id;
    res.render("createDragon", { trainer_id: id });
  };

  //Guarda la información de un nuevo dragón de un entrenador concreto

  saveDragon = (req, res) => {
    let trainer_id = req.params.id;
    let { dragon_name, description } = req.body;
    let sql = `INSERT INTO dragon (dragon_name, description, trainer_id) VALUES ('${dragon_name}, '${description}', ${trainer_id});`;
    let img = "";
    if (req.file != undefined) {
      img = req.file.filename;
    } else {
      img = "avatardragon.jpg";
    }
    sql = `INSERT INTO dragon (dragon_name, description, img, trainer_id) VALUES ('${dragon_name}', '${description}', '${img}', ${trainer_id});`;

    connection.query(sql, (error, result) => {
      if (error) throw error;
      res.redirect(`/trainer/oneTrainer/${trainer_id}`);
    });
  };

  //Renderiza el formulario de crear dragon desde el navbar
  addDragonNavbar = (req, res) => {
    let sql = `SELECT name, description, trainer_id FROM trainer WHERE is_deleted = 0`;

    connection.query(sql, (error, result) => {
      if (error) throw error;
      res.render("addDragonNavbar", { result });
    });
  };

  //Guarda la info de un nuevo dragon desde el formulario del navbar
  saveDragonNavbar = (req, res) => {
    let { dragon_name, description, trainer_id } = req.body;
    let sql = `INSERT INTO dragon (dragon_name, description,  trainer_id) VALUES ( '${dragon_name}', '${description}', ${trainer_id});`;
    if (req.file != undefined) {
      let img = req.file.filename;
      sql = `INSERT INTO dragon (dragon_name, description, img, trainer_id ) VALUES ('${dragon_name}', '${description}', '${img}', ${trainer_id});`;
    }
    connection.query(sql, (error, result) => {
      if (error) throw error;
      res.redirect(`/trainer/oneTrainer/${trainer_id}`);
    });
  };

  //Elimina de manera logica un dragon
  logicDelete = (req, res) => {
    let dragon_id = req.params.dragon_id;
    let trainer_id = req.params.trainer_id;

    let sql = `UPDATE dragon SET is_deleted = 1 WHERE dragon_id = ${dragon_id}`;

    connection.query(sql, (error, result) => {
      if (error) throw error;
      res.redirect(`/trainer/oneTrainer/${trainer_id}`);
    });
  };

  // Elimina de manera real un dragon
  deleteDragon = (req, res) => {
    let { dragon_id, trainer_id } = req.params;

    let sql = `DELETE FROM dragon WHERE dragon_id = ${dragon_id}`;

    connection.query(sql, (error, result) => {
      if (error) throw error;
      res.redirect(`/trainer/oneTrainer/${trainer_id}`);
    });
  };

  // Renderiza la vista para editar un dragon
  viewEditForm = (req, res) => {
    let dragon_id = req.params.dragon_id;
    let sql = `SELECT * FROM dragon WHERE dragon_id = ${dragon_id}`;

    connection.query(sql, (error, result) => {
      if (error) throw error;
      res.render("editDragon", { result });
    });
  };
  //Guarda la informacion editada de un dragon
  saveEditDragon = (req, res) => {
    let dragon_id = req.params.dragon_id;
    let trainer_id = req.params.trainer_id;
    let dragon_name = req.body.dragon_name;
    let description = req.body.description;

    let sql = `UPDATE dragon SET dragon_name = '${dragon_name}', description = '${description}' WHERE dragon_id = ${dragon_id}`;

    if (req.file != undefined) {
      let img = req.file.filename;
      sql = `UPDATE dragon SET dragon_name = '${dragon_name}', description = '${description}', img = '${img}' WHERE dragon_id = ${dragon_id}`;
    }
    connection.query(sql, (error, result) => {
      if (error) throw error;
      res.redirect(`/trainer/oneTrainer/${trainer_id}`);
    });
  };
}
module.exports = new DragonController();
