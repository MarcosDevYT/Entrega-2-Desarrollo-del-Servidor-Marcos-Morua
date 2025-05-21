/*
  Funcionalidades para el formulario y eliminar los productos
*/

// Validar los datos que se envian al formulario
const validateForm = (form) => {
  const requiredFields = form.querySelectorAll("[required]");
  let isValid = true;

  requiredFields.forEach((field) => {
    if (!field.value.trim()) {
      isValid = false;
    }
  });

  // Validar que al menos una imagen esté presente
  const imageUrl = form.querySelector('input[name="imageUrl"]');
  const imageFile = form.querySelector('input[name="imageFile"]');

  if (
    !imageUrl.value.trim() &&
    (!imageFile.files || imageFile.files.length === 0)
  ) {
    alert("Por favor ingresa una URL o sube una imagen");
    return false;
  }

  return isValid;
};

// Validar que el codigo no se repita
const validateCode = async (productId, code) => {
  const products = await GETProducts();
  if (!products) {
    alert("Error al obtener los productos");
    // Si no se pueden obtener productos, asumimos que no hay duplicados
    return true;
  }

  const codeExists = products.some(
    (product) => product.code === code && product.id !== productId
  );

  if (codeExists) {
    alert(`El codigo ${code} ya lo posee otro producto`);
    return true;
  }

  return false;
};

// Manejar el envío del formulario
const handleSubmit = async (e) => {
  e.preventDefault();
  e.stopPropagation();

  if (!validateForm(e.target)) {
    alert("Por favor completa todos los campos obligatorios");
    return;
  }

  const formData = new FormData(e.target);

  // Obtenemos los datos del formulario
  const productData = {
    title: formData.get("title").trim(),
    description: formData.get("description").trim(),
    code: formData.get("code").trim(),
    price: parseFloat(formData.get("price")),
    status: true,
    stock: parseInt(formData.get("stock"), 10),
    category: formData.get("category").trim(),
    thumbnails: [],
  };

  // obtenemos el id del producto si lo posee
  let productId = formData.get("id").trim();

  // Agregar la URL o el nombre del archivo al array de thumbnails
  const imageUrl = formData.get("imageUrl");
  const imageFile = formData.get("imageFile");

  if (imageUrl) {
    productData.thumbnails.push(imageUrl);
  } else if (imageFile && imageFile.size > 0) {
    // Subir el nombre del archivo
    productData.thumbnails.push(imageFile.name);
  }

  if (isRealTimeView()) {
    const hasDuplicate = await validateCode(productId, productData.code);
    if (hasDuplicate) return;

    realTimeProductAction(productId, productData);
    e.target.reset();
    modalClose();
    return;
  }

  // Enviar por HTTP

  if (!productId) {
    // Si no tenemos el productId es porque es un nuevo producto
    if (await validateCode(null, productData.code)) return;

    POSTProduct(productData);

    e.target.reset();

    modalClose();
    window.location.reload();
  } else {
    if (await validateCode(productId, productData.code)) return;

    // Si tenemos el productId es porque es un producto a editar
    PUTProduct(productId, productData);

    e.target.reset();

    modalClose();
    window.location.reload();
  }
};

/*
  Funcionalidad para eliminar productos
*/

const deleteProduct = async (productId) => {
  console.log("Eliminar producto ID:", productId);

  if (isRealTimeView()) {
    realTimeDeleteProduct(productId);
    return;
  }

  const deleted = await DELETEProduct(productId);

  if (!deleted) {
    alert("Error al eliminar el producto");
    return;
  }

  alert("Producto eliminado con éxito");
  window.location.reload();
};

/*
  Funcionalidad para editar productos
*/

const editProduct = async (productId) => {
  console.log("Editar producto ID:", productId);

  const product = await GETProductById(productId);

  // Comenzamos el try catch para manejar el formulario asi editarlo
  try {
    if (!product) return;

    // Llenamos el formulario con los datos del producto
    const form = document.getElementById("modalForm");
    form.elements["title"].value = product.title || "";
    form.elements["description"].value = product.description || "";
    form.elements["code"].value = product.code || "";
    form.elements["price"].value = product.price || "";
    form.elements["stock"].value = product.stock || "";
    form.elements["category"].value = product.category || "";

    // Establecer el ID del producto
    form.elements["id"].value = product.id;

    // Manejar la imagen - solo si es una URL
    if (product.thumbnails && product.thumbnails.length > 0) {
      const isUrl = product.thumbnails[0].startsWith("http");

      // Mostrar el input correspondiente
      if (isUrl) {
        form.elements["imageType"].value = "url";
        form.elements["imageUrl"].value = product.thumbnails[0];
        document.getElementById("urlInput").classList.remove("hidden");
        document.getElementById("fileInput").classList.add("hidden");
      } else {
        // No podemos establecer el valor de un input file por seguridad
        // Solo mostramos el nombre del archivo como texto
        form.elements["imageType"].value = "file";
        document.getElementById("urlInput").classList.add("hidden");
        document.getElementById("fileInput").classList.remove("hidden");
        // Mostrar el nombre del archivo como texto informativo
        const fileInfo = document.createElement("div");
        fileInfo.textContent = `Archivo actual: ${product.thumbnails[0]}`;
        fileInfo.className = "text-sm text-gray-500 mt-1";
        const fileInputContainer = document.getElementById("fileInput");
        fileInputContainer.appendChild(fileInfo);
      }
    }

    // Cambiar el texto del botón de submit
    submitBtn.textContent = "Actualizar Producto";

    modalOpen();
  } catch (error) {
    console.error("Error al cargar el producto:", error);
  }
};

/*
  Iniciar eventos
*/

// Agregar el event listener para cargar al inicio del documento
document.addEventListener("DOMContentLoaded", () => {
  setupImageInputToggle();

  modalForm.addEventListener("submit", handleSubmit);

  // Si estamos en la url de realTimeProducts, iniciamos los eventos
  if (isRealTimeView() && socket) {
    socket.on("products", (products) => {
      console.log("Productos actualizados:", products);
      updateProductsList(products);
    });
  }
});
