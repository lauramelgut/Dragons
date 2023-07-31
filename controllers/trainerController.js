const connection = require("../config/db");
const bcrypt = require("bcrypt");
class TrainerController {
  //Muestra todos los entrenadores
  getAllTrainer = (req, res) => {
    let sql = `SELECT * FROM trainer WHERE is_deleted = 0`;

    connection.query(sql, (error, result) => {
      if (error) throw error;
      res.render("allTrainers", { result });
    });
  };

  //Muestra el formulario de registro
  viewRegisterForm = (req, res) => {
    res.render("register", { message: "" });
  };

  //Registra un nuevo entrenador
  register = (req, res) => {
    let { name, last_name, email, password, description, phone } = req.body;

    let img = "";
    if (req.file != undefined) {
      img = req.file.filename;
    } else {
      img = "avatar.jpg";
    }
    //Encriptamos contraseña
    bcrypt.hash(password, 10, function (err, hash) {
      if (err) throw err;
      console.log(hash);

      let sql = `INSERT INTO trainer (name, last_name, email, password, description, phone, photo) VALUES ("${name}", "${last_name}", "${email}", "${hash}", "${description}", "${phone}", "${img}")`;

      connection.query(sql, (error, result) => {
        // si da error
        if (error) {
          //si el error es por email duplicado
          if (error.code == "ER_DUP_ENTRY") {
            res.render("register", {
              message: "El Email ya Existe",
            });
          } else {
            //si es otro tipo de error
            throw error;
          }
        }
        //si no da error
        res.render("register", {
          message: "Entrenador/a creado correctamente",
        });
      });
    });
  };
  //Muestra la vista de perfil con sus dragones
  //Metodo sencillo:
  viewOneTrainer = (req, res) => {
    let trainer_id = req.params.id;
    let sqlTrainer = `SELECT * FROM trainer WHERE is_deleted = 0 AND trainer_id = ${trainer_id}`;
    let sqlDragon = `SELECT * FROM dragon WHERE is_deleted = 0 AND trainer_id = ${trainer_id}`;

    connection.query(sqlTrainer, (errorTrainer, resultTrainer) => {
      if (errorTrainer) throw errorTrainer;

      connection.query(sqlDragon, (errorDragon, resultDragon) => {
        if (errorDragon) throw errorDragon;
        res.render("oneTrainer", { resultTrainer, resultDragon });
      });
    });
  };
  //Muestra la vista de perfil de un entrenador con sus dragones con una sola consulta a su base de datos
  viewOtherOneTrainer = (req, res) => {
    let trainer_id = req.params.id;
    let sql = `SELECT trainer.*, dragon.is_deleted as deleted, dragon.dragon_id, dragon.dragon_name, dragon.img FROM trainer left join dragon on trainer.trainer_id = dragon.trainer_id WHERE trainer.trainer_id = ${trainer_id} AND trainer.is_deleted = 0;`;

    connection.query(sql, (error, result) => {
      if (error) throw error;
      console.log(result);
      //limpiamos el resultado
      let finalResult = {};
      let dragonGroup = [];
      let dragon = {};

      result.forEach((x) => {
        if (x.deleted == 0) {
          dragon = {
            dragon_id: x.dragon_id,
            dragon_name: x.dragon_name,
            img: x.images,
          };
          dragonGroup.push(dragon);
        }
      });
      finalResult = {
        trainer_id: trainer_id,
        name: result[0].name,
        last_name: result[0].last_name,
        photo: result[0].photo,
        email: result[0].email,
        password: result[0].password,
        dragonGroup,
      };
      res.render("otherOneTrainer", { finalResult, dragon, dragonGroup });
    });
  };

  //Muestra el formulario de login
  viewLoginForm = (req, res) => {
    res.render("loginForm", { message: "" });
  };

  //Comprueba las credenciales de logueo
  login = (req, res) => {
    let { email, password } = req.body;
    let sql = `SELECT * from trainer WHERE email = '${email}' AND is_deleted = 0`;

    connection.query(sql, (error, result) => {
      if (error) throw error;
      if (result.length == 1) {
        //el email es correcto y comprobamos la contraseña
        let hash = result[0].password;
        bcrypt.compare(password, hash, (err, resultCompare) => {
          if (resultCompare) {
            //email y contraseña correctos
            res.redirect(`/trainer/oneTrainer/${result[0].trainer_id}`);
          } else {
            //email correcto,pero contraseña incorrecta
            res.render("loginForm", { message: "Contraseña incorrecta" });
          }
        });
      } else {
        //como minimo el email es incorrecto
        res.render("loginForm", { message: "Email incorrecto" });
      }
    });
  };
  //Borrado real de un entrenador
  deleteTrainer = (req, res) => {
    let trainer_id = req.params.trainer_id;
    let sql = `DELETE FROM trainer WHERE trainer_id = ${trainer_id}`;

    connection.query(sql, (error, result) => {
      if (error) throw error;
      res.redirect("/trainer");
    });
  };
  //Borrado logico de entrenador
  logicDeleteTrainer = (req, res) => {
    let trainer_id = req.params.trainer_id;
    let length = req.params.length;

    if (length > 0) {
      let sql = `UPDATE
    trainer
    INNER JOIN
    dragon
    ON
    trainer.trainer_id = dragon.trainer_id
    SET
    trainer.is_deleted = 1, dragon.is_deleted = 1
    WHERE
    trainer.trainer_id = ${trainer_id}`;

      connection.query(sql, (error, result) => {
        if (error) throw error;
        res.redirect("/trainer");
      });
    } else {
      let sql = `UPDATE trainer SET is_deleted = 1 WHERE trainer_id = ${trainer_id}`;
      connection.query(sql, (error, result) => {
        if (error) throw error;
        res.redirect("/trainer");
      });
    }
  };
  //Renderiza la vista del formulario de edicion de entrenador
  viewEditForm = (req, res) => {
    let trainer_id = req.params.trainer_id;
    let sql = `SELECT * FROM trainer WHERE trainer_id = ${trainer_id}`;

    connection.query(sql, (error, result) => {
      if (error) throw error;
      res.render("editTrainer", {
        result,
      });
    });
  };

  //Recoge la informacion modificada del entrenador
  saveEditTrainer = (req, res) => {
    let trainer_id = req.params.trainer_id;
    let { name, last_name, email, password, description, phone } = req.body;

    let sql = `UPDATE trainer SET name = '${name}', last_name = '${last_name}', email = '${email}', description = '${description}', phone = '${phone}'`;
    let final = ` WHERE trainer_id = ${trainer_id}`;

    if (req.file != undefined) {
      let img = req.file.filename;
      sql += `, photo = '${img}'`;

      if (password != "") {
        bcrypt.hash(password, 10, (error, hash) => {
          sql += `, password = '${hash}'`;
          sql += final;

          connection.query(sql, (error, result) => {
            if (error) throw error;
            res.redirect(`/trainer/oneTrainer/${result[0].trainer_id}`);
          });
        });
      }
    } else {
      sql += final;

      connection.query(sql, (error2, result) => {
        if (error2) throw error2;
        res.redirect(`/trainer/oneTrainer/${trainer_id}`);
      });
    }
  };
}

module.exports = new TrainerController();
