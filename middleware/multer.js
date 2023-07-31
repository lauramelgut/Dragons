const multer = require("multer");

let uploadImage = (carpeta) => {
  const storage = multer.diskStorage({
    destination: `public/images/${carpeta}`,
    filename: function (req, file, cb) {
      console.log(file);

      let originalName = file.originalname;
      let extension = originalName.slice(
        originalName.lastIndexOf("."),
        originalName.length
      );

      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      cb(null, uniqueSuffix + extension);
    },
  });

  const upload = multer({ storage: storage }).single("img");

  return upload;
};

module.exports = uploadImage;
