const { promises: fs } = require("fs");
const {
  validatePostProduct,
  validatePutProduct,
} = require("../utils/validaciones.js");

class ProductManager {
  constructor(path) {
    this.path = path;
    this.id = 0;
  }

  // Function para generar un id autoincremental
  async generateId() {
    const data = await fs.readFile(this.path, "utf-8");
    const products = JSON.parse(data);

    // Obtener todos los IDs existentes
    const ids = products.map((product) => product.id);

    // Si no hay productos, devolvemos 0
    if (ids.length === 0) {
      this.id = 0;
      return this.id;
    }

    // Ordenamos los IDs de menor a mayor
    ids.sort((a, b) => a - b);

    // Buscamos el primer ID faltante en la secuencia
    for (let i = 0; i < ids.length; i++) {
      if (ids[i] !== i) {
        this.id = i;
        return this.id;
      }
    }

    // Si no faltan IDs en la secuencia, usamos el siguiente número
    this.id = ids.length;
    return this.id;
  }

  // Function para obtener todos los productos
  async getProducts() {
    try {
      // Leemos el archivo y parseamos el JSON
      const data = await fs.readFile(this.path, "utf-8");
      const products = JSON.parse(data);

      // Si tenemos productos, los retornamos
      return products;
    } catch (error) {
      // Si el archivo no existe, lo creamos vacío
      if (err.code === "ENOENT") {
        // Crear el archivo vacío
        await fs.writeFile(this.path, "[]");
        return [];
      }

      // Si hay otro error, lo lanzamos
      throw new Error("Error al buscar los productos: ", error);
    }
  }

  // Funcion para buscar el producto por id
  async getProductById(id) {
    try {
      // Obtenemos los productos existentes
      const products = await this.getProducts();

      // Buscamos el producto por id
      const product = products.find((p) => parseInt(p.id) === parseInt(id));

      // Si no existe, lanzamos un error
      if (!product) {
        throw new Error("Producto no encontrado");
      }

      return product;
    } catch (error) {
      // Si hay un error al buscar el producto, lo mandamos
      throw new Error("Error al buscar el producto: " + error.message);
    }
  }

  // Function para agregar un producto
  async addProduct(product) {
    try {
      // Obtenemos los productos existentes
      const products = await this.getProducts();

      // Validamos el producto
      const validateTrue = validatePostProduct(product, products);

      if (validateTrue) {
        // Obtenemos el params y le agregamos el id
        const productToAdd = { ...product, id: await this.generateId() };

        // Agregamos el nuevo producto al array
        products.push(productToAdd);

        // Guardamos el array actualizado en el archivo
        await fs.writeFile(this.path, JSON.stringify(products, null, 2));
        console.log("Producto agregado correctamente: ", productToAdd);
      }
    } catch (error) {
      // Si hay un error al agregar el producto, lo mandamos
      throw new Error("Error al agregar el producto: " + error.message);
    }
  }

  // Function para actualizar un producto
  async updateProduct(id, product) {
    try {
      // obtenemos la lista de productos y obtenemos el producto a actualizar
      const products = await this.getProducts();
      const productToUpdate = await this.getProductById(id);
      const index = products.findIndex(
        (p) => parseInt(p.id) === parseInt(productToUpdate.id)
      );

      // validar los campos a actualizar
      const validateTrue = validatePutProduct(product);

      if (validateTrue) {
        // Actualizamos el producto en el array
        products[index] = { ...productToUpdate, ...product };
        // Guardamos el array actualizado en el archivo
        await fs.writeFile(this.path, JSON.stringify(products, null, 2));
      }
    } catch (error) {
      // Si hay un error al actualizar el producto, lo mandamos
      throw new Error("Error al actualizar el producto: " + error.message);
    }
  }

  // Function para eliminar un producto
  async deleteProduct(id) {
    try {
      // Obtenemos los productos existentes
      const products = await this.getProducts();

      // Buscamos el producto por id
      const productToDelete = await this.getProductById(id);

      // Filtramos el producto a eliminar
      const updatedProducts = products.filter(
        (p) => parseInt(p.id) !== parseInt(productToDelete.id)
      );

      // Guardamos el array actualizado en el archivo
      await fs.writeFile(this.path, JSON.stringify(updatedProducts, null, 2));
    } catch (error) {
      // Si hay un error al eliminar el producto, lo mandamos
      throw new Error("Error al eliminar el producto: " + error.message);
    }
  }
}

module.exports = { ProductManager };
