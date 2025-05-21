const productRouter = require("./routes/products.router.js");
const cartRouter = require("./routes/carts.router.js");
const viewsRouter = require("./routes/views.router.js");
const {
  ProductManager,
} = require("./controllers/productManager.controller.js");

const pm = new ProductManager("./src/data/products.json");

const express = require("express");
const path = require("path");
const app = express();

const http = require("http").createServer(app);
const io = require("socket.io")(http);

const handlebars = require("express-handlebars");
const multer = require("multer");

const PORT = 8080;

//
// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//
// Handlebars
app.engine(
  "handlebars",
  handlebars.engine({
    defaultLayout: "main",
    layoutsDir: __dirname + "/views/layouts",
    partialsDir: __dirname + "/views/partials",
  })
);
app.set("view engine", "handlebars");
app.set("views", __dirname + "/views");

app.use(express.static(__dirname + "/public"));
app.use(express.static(__dirname + "/views"));

//
// Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname)
    );
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|gif/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(
      path.extname(file.originalname).toLowerCase()
    );

    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error("Solo se permiten imágenes (jpeg, jpg, png, gif)"));
  },
}).single("imageFile");

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

//
// Socket
io.on("connection", async (socket) => {
  console.log("Cliente conectado");

  try {
    // Obtener productos y enviarlos al cliente
    const products = await pm.getProducts();
    socket.emit("products", products);

    // Manejar la creación de nuevos productos
    socket.on("newProduct", async (product) => {
      try {
        await pm.addProduct(product);
        const updatedProducts = await pm.getProducts();
        io.emit("products", updatedProducts);
      } catch (error) {
        console.error("Error al agregar producto:", error);
        socket.emit("error", { message: error.message });
      }
    });

    // Manejar la edicion de productos
    socket.on("editProduct", async (product) => {
      try {
        await pm.updateProduct(product.productId, product.productData);
        const updatedProducts = await pm.getProducts();
        io.emit("products", updatedProducts);
      } catch (error) {
        console.error("Error al editar producto:", error);
        socket.emit("error", { message: error.message });
      }
    });

    // Manejar la eliminacion de productos
    socket.on("deleteProduct", async (productId) => {
      try {
        await pm.deleteProduct(productId);
        const updatedProducts = await pm.getProducts();
        io.emit("products", updatedProducts);
      } catch (error) {
        console.error("Error al eliminar producto:", error);
        socket.emit("error", { message: error.message });
      }
    });
  } catch (error) {
    console.error("Error al obtener productos:", error);
    socket.emit("error", { message: "Error al cargar los productos" });
  }
});

//
// Routers
app.use("/api/products", productRouter);
app.use("/api/carts", cartRouter);
app.post("/api/uploads", (req, res) => {
  upload(req, res, (err) => {
    if (err) {
      return res.status(400).json({ error: err.message });
    }
    if (!req.file) {
      return res
        .status(400)
        .json({ error: "No se ha seleccionado ningún archivo" });
    }
    res.json({
      message: "Imagen subida exitosamente",
      filePath: `/uploads/${req.file.filename}`,
    });
  });
});

//
// Views
app.use("/", viewsRouter);

//
// Server
http.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
