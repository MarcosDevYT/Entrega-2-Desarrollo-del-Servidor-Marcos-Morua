// iniciar Socket
const socket = io();

// Detectar si estamos en la vista de productos a tiempo real
const isRealTimeView = () => {
  return window.location.pathname.includes("realtimeproducts");
};

// Función para actualizar la lista de productos
const updateProductsList = (products) => {
  const productsContainer = document.getElementById("productsContainer");
  if (!productsContainer) return;

  // Si products es un objeto con propiedad 'products', extrae el array
  const productsArray = Array.isArray(products)
    ? products
    : products.products || [];

  // Limpia el contenedor
  productsContainer.innerHTML = "";

  // Si no hay productos, muestra un mensaje
  if (productsArray.length === 0) {
    productsContainer.innerHTML =
      "<tr> <td colspan='8' class='text-center py-4 border-b border-black/10 text-lg'>No hay productos</td></tr>";
    return;
  }

  // Crea y agrega un producto
  productsArray.forEach((product) => {
    try {
      const row = createRow(product);
      productsContainer.appendChild(row);
    } catch (error) {
      console.error("Error al crear tarjeta de producto:", error, product);
    }
  });
};

// Crear una tarjeta de producto
const createRow = (product) => {
  if (!product) return document.createElement("div");

  const row = document.createElement("tr");
  row.className = "border-b border-black/10 text-left hover:bg-black/10";

  // Asegúrate de que los datos existan
  const title = product.title;
  const price = product.price;
  const description = product.description;
  const stock = product.stock;
  const code = product.code;
  const category = product.category;
  const thumbnails = Array.isArray(product.thumbnails)
    ? product.thumbnails
    : [];
  const thumbnail = thumbnails[0] || "https://via.placeholder.com/150";

  row.innerHTML = `
    <td class="px-2 py-2 ">
      <img class="w-32 h-24 object-cover rounded-md" src="${thumbnail}" alt="${title}">
    </td>
    <td class="px-6 py-2">${title}</td>
    <td class="px-6 py-2">$${price}</td>
    <td class="px-6 py-2">${description}</td>
    <td class="px-6 py-2">${category}</td>
    <td class="px-6 py-2">${code}</td>
    <td class="px-6 py-2">${stock}</td>
    <td class="px-6 py-2 ">
      ${itemDropdown(product.id)}
    </td>
  `;
  return row;
};

const itemDropdown = (id) => {
  return `
    <div class="flex justify-end items-center h-full relative">
      <span class="cursor-pointer dropdown-toggle">
        <i class="ri-more-fill"></i>
      </span>

      <div
        class="absolute hidden border border-black/10 rounded-md top-5 right-0 bg-white z-10 dropdown-menu"
      >
        <p class="font-medium text-base p-2 px-3">Acciones</p>
        <hr class="border-black/10" />
        <span
          class="w-32 cursor-pointer p-2 px-3 text-sm hover:bg-black/10 block delete-item"
          id="${id}"
        >Eliminar</span>
        <span
          class="w-32 cursor-pointer p-2 px-3 text-sm hover:bg-black/10 block edit-item"
          id="${id}"
        >Editar</span>
      </div>
    </div>
  `;
};

// Funcionalidad para editar o agregar un producto
const realTimeProductAction = (productId, productData) => {
  // Enviar a través de WebSocket
  if (productId) {
    socket.emit("editProduct", { productId, productData });
  } else {
    socket.emit("newProduct", productData);
  }

  return;
};

// Funcionalidad para eliminar un producto
const realTimeDeleteProduct = (productId) => {
  socket.emit("deleteProduct", productId);
};
