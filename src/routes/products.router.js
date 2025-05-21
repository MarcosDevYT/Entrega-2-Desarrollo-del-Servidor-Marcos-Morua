const { Router } = require("express");
const {
  ProductManager,
} = require("../controllers/productManager.controller.js");

const productRouter = Router();
const pm = new ProductManager("./src/data/products.json");

// Ruta para obtener productos
productRouter.get("/", async (req, res) => {
  try {
    const products = await pm.getProducts();
    res.json({
      message: "Productos obtenidos correctamente",
      products,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error al obtener los productos",
      error: error.message,
    });
  }
});

// Ruta para obtener un producto por id
productRouter.get("/:pid", async (req, res) => {
  try {
    const { pid } = req.params;
    const product = await pm.getProductById(pid);
    res.json({
      message: `Producto #${pid} obtenido correctamente`,
      product,
    });
  } catch (error) {
    if (error.message.includes("Producto no encontrado")) {
      return res.status(404).json({ message: "Producto no encontrado" });
    }
    res.status(500).json({
      message: "Error al obtener el producto",
      error: error.message,
    });
  }
});

// Ruta para agregar un producto
productRouter.post("/", async (req, res) => {
  try {
    const product = req.body;
    await pm.addProduct(product);
    res.status(201).json({ message: "Producto agregado correctamente" });
  } catch (error) {
    res.status(500).json({
      message: "Error al agregar el producto",
      error: error.message,
    });
  }
});

// Ruta para actualizar un producto
productRouter.put("/:pid", async (req, res) => {
  try {
    const { pid } = req.params;
    const product = req.body;
    await pm.updateProduct(pid, product);
    res
      .status(200)
      .json({ message: `Producto #${pid} actualizado correctamente` });
  } catch (error) {
    res.status(500).json({
      message: "Error al actualizar el producto",
      error: error.message,
    });
  }
});

// Ruta para eliminar un producto
productRouter.delete("/:pid", async (req, res) => {
  try {
    const { pid } = req.params;
    await pm.deleteProduct(pid);
    res
      .status(200)
      .json({ message: `Producto #${pid} eliminado correctamente` });
  } catch (error) {
    res.status(500).json({
      message: "Error al eliminar el producto",
      error: error.message,
    });
  }
});

module.exports = productRouter;
