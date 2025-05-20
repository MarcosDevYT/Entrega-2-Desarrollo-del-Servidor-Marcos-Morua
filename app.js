import express from "express";
import productRouter from "./routes/product.js";
import cartRouter from "./routes/cart.js";

const app = express();
const PORT = 8080;

app.use(express.json());

// Usar el router para /products
app.use("/api/products", productRouter);

// Usar el router para /carts
app.use("/api/carts", cartRouter);

app.listen(PORT, () => {
  console.log(`Server iniciado en el puerto:${PORT}`);
});
