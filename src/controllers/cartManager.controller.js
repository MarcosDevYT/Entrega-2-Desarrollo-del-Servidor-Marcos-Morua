const { promises: fs } = require("fs");
const { ProductManager } = require("./productManager.controller.js");

const pm = new ProductManager("./data/products.json");

class CartManager {
  constructor(path) {
    this.path = path;
    this.id = 0;
  }

  // Function para generar un id autoincremental
  async generateId() {
    // Leemos el archivo y parseamos el JSON
    const data = await fs.readFile(this.path, "utf-8");
    const carts = JSON.parse(data);

    // Si no hay productos, el id es 0
    if (carts.length === 0) {
      this.id = 0;
    } else {
      // Si hay productos, buscamos el id más alto y le sumamos 1
      const maxId = Math.max(...carts.map((cart) => cart.id));
      this.id = maxId + 1;
    }

    return this.id;
  }

  async getCarts() {
    try {
      // Leemos el archivo y parseamos el JSON
      const data = await fs.readFile(this.path, "utf-8");
      const carts = JSON.parse(data);

      // Si tenemos productos, los retornamos
      return carts;
    } catch (error) {
      // Si el archivo no existe, lo creamos vacío
      if (error.code === "ENOENT") {
        // Crear el archivo vacío
        await fs.writeFile(this.path, "[]");
        return [];
      }

      // Si hay otro error, lo lanzamos
      throw new Error("Error al buscar los carritos: ", error);
    }
  }

  // Funcion para buscar el carrito por id
  async getCartById(id) {
    try {
      // Obtenemos los carritos existentes
      const data = await fs.readFile(this.path, "utf-8");
      const carts = JSON.parse(data);

      // Buscamos el carrito por id
      const cart = carts.find((cart) => cart.id === parseInt(id));

      // Si no existe, lanzamos un error
      if (!cart) {
        throw new Error("Carrito no encontrado");
      }

      return cart;
    } catch (error) {
      // Si ocurre un error en el proceso, lo lanzamos
      throw new Error("Error al obtener el carrito: " + error.message);
    }
  }

  // Function para crear un carrito con el array vacio de productos
  async createCart() {
    try {
      // Obtenemos los carritos existentes
      const carts = await this.getCarts();

      // Creamos el nuevo carrito
      const newCart = {
        id: await this.generateId(),
        products: [],
      };

      // Agregamos el nuevo carrito al array de carritos
      carts.push(newCart);

      // Guardamos el nuevo carrito en el archivo
      await fs.writeFile(this.path, JSON.stringify(carts, null, 2));

      return newCart;
    } catch (error) {
      // Si ocurre un error en el proceso, lo lanzamos
      throw new Error("Error al crear el carrito: " + error.message);
    }
  }

  // Function para agregar un producto al carrito
  async addProductToCart(cartId, productId) {
    try {
      // Obtener todos los carritos
      const carts = await this.getCarts();

      // Buscar el carrito por id
      const cartIndex = carts.findIndex((cart) => cart.id === parseInt(cartId));
      if (cartIndex === -1) throw new Error("Carrito no encontrado");
      const cart = carts[cartIndex];

      // Verificar si el producto existe
      await pm.getProductById(productId);

      // Buscar si el producto ya está en el carrito
      const prodIndex = cart.products.findIndex(
        (p) => p.product === parseInt(productId)
      );

      if (prodIndex !== -1) {
        // Si ya está, incrementar la cantidad
        cart.products[prodIndex].quantity += 1;
      } else {
        // Si no está, agregarlo con cantidad 1 y solo el id
        cart.products.push({ product: parseInt(productId), quantity: 1 });
      }

      // Guardar el carrito actualizado
      carts[cartIndex] = cart;
      await fs.writeFile(this.path, JSON.stringify(carts, null, 2));
      return cart;
    } catch (error) {
      // Si no existe el carrito, lanzamos un error
      if (error.message.includes("Carrito no encontrado")) {
        throw new Error("Carrito no encontrado");
      }

      // Si no existe el producto, lanzamos un error
      if (error.message.includes("Producto no encontrado")) {
        throw new Error("Error al encontrar el producto: " + error.message);
      }

      // Si ocurre otro error, lo lanzamos
      throw new Error(
        "Error al agregar un producto al carrito: " + error.message
      );
    }
  }
}

module.exports = { CartManager };
