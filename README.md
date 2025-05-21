# Entregable-2-Marcos-Morua

Segundo entregable para Backend 1 - Coderhouse, de Marcos Morua, en esta entrega se crean las clases de CartManager y ProductManager para crear, editar, eliminar y obtener productos o carritos. Se utiliza el Router de Express para utilizar las rutas de los archivos cart.js y product.js.

## Estructura del Proyecto

```
Entregable-2-Marcos-Morua
├── app
|   |
│   ├── modules
|   |   └── CartManager.js      # Clase para gestionar los carritos
|   |   └── ProductManager.js   # Clase para gestionar productos
│   │
│   ├── routes
|   |   └── cart.js             # Rutas relacionadas con el carrito
│   │   └── products.js         # Rutas relacionadas con productos
│   └── data
|       └── cart.json           # Archivo JSON para el carrito
│       └── products.json       # Archivo JSON para los productos
|
├── Backend 1 - Marcos Morua    # JSON exportado de Postman
├── app.js                      # Punto de entrada de la aplicación
├── package.json                # Configuración de npm
└── README.md                   # Documentación del proyecto
```

## Uso

1. Inicia el servidor:

   ```
   pnpm dev (Para iniciar con node en "src/app.js")
   ```

2. Accede a la API en `http://localhost:8080`.
