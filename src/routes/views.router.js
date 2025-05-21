const { Router } = require("express");
const {
  ProductManager,
} = require("../controllers/productManager.controller.js");

const viewsRouter = Router();
const pm = new ProductManager("./src/data/products.json");

viewsRouter.get("/", async (req, res) => {
  const products = await pm.getProducts();

  res.render("home", { products });
});

viewsRouter.get("/realtimeproducts", async (req, res) => {
  const products = await pm.getProducts();

  res.render("realTimeProducts", { products });
});

module.exports = viewsRouter;
