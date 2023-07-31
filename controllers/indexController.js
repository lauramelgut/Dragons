class IndexController {
  //Muestra la vista Home
  viewHome = (req, res) => {
    res.render("index", { title: "Express" });
  };
}
module.exports = new IndexController();
