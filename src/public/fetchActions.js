// Funcion para obtener todos los productos
const GETProducts = async () => {
  try {
    const response = await fetch("http://localhost:8080/api/products");

    if (!response.ok) {
      throw new Error("Error al obtener los productos");
    }

    const data = await response.json();
    return data.products;
  } catch (error) {
    console.error(error);
    return null;
  }
};

// Funcion para obtener el producto con el id
const GETProductById = async (productId) => {
  try {
    const response = await fetch(
      `http://localhost:8080/api/products/${productId}`,
      {
        method: "GET",
      }
    );

    if (!response.ok) {
      throw new Error("Error al obtener el producto");
    }

    const data = await response.json();

    return data.product;
  } catch (error) {
    console.error(error);
    return null;
  }
};

// Crear un producto
const POSTProduct = async (productData) => {
  try {
    const response = await fetch("http://localhost:8080/api/products", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(productData),
    });

    if (!response.ok) {
      throw new Error("Error al agregar el producto");
    }

    const data = await response.json();
    console.log("Producto agregado:", data);
    alert("Producto agregado con éxito");
  } catch (error) {
    console.error(error);
    alert("Error al agregar el producto: " + error.message);
  }
};

// Editar un producto con el id y los datos del formulario
const PUTProduct = async (productId, productData) => {
  try {
    const response = await fetch(
      `http://localhost:8080/api/products/${productId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(productData),
      }
    );

    if (!response.ok) {
      throw new Error("Error al editar el producto");
    }

    const data = await response.json();
    console.log("Producto editado:", data);
  } catch (error) {
    console.error(error);
    alert("Error al editar el producto: " + error.message);
  }
};

// Funcion para eliminar un producto
const DELETEProduct = async (productId) => {
  try {
    const response = await fetch(
      `http://localhost:8080/api/products/${productId}`,
      {
        method: "DELETE",
      }
    );

    if (!response.ok) {
      throw new Error("Error al eliminar el producto");
    }

    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
};
