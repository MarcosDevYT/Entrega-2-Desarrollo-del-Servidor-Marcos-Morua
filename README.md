# Entregable-2-Marcos-Morua

Segundo entregable para Backend 1 - Coderhouse, de Marcos Morua, en esta entrega se implementa handlebars para crear las vistas de los productos, se implementa las vistas dinamicas utilizando websocket para la vista realTimeProducts, y se agrega la funcionalidad de subida de archivos con multer. Se utiliza el Router de Express para utilizar las rutas de los archivos cart.js, views.js, product.js y uploads.js.

## Estructura del Proyecto

```

Entregable-2-Marcos-Morua/
├── src/
│   ├── app.js                              # Punto de entrada de la aplicación
│   ├── controllers/                        # Controladores de la aplicación
│   │   ├── cartManager.controller.js       # Lógica de carritos
│   │   └── productManager.controller.js    # Lógica de productos
│   │
│   ├── data/                               # Archivos de datos (mock)
│   │   ├── cart.json                       # Datos de carritos
│   │   └── products.json                   # Datos de productos
│   │
│   ├── public/                             # Archivos estáticos (frontend)
│   │   ├── fetchActions.js                 # Funciones para llamadas API
│   │   ├── main.js                         # Lógica principal del frontend
│   │   ├── modalFunctions.js               # Funciones para modales
│   │   ├── realTimeFuncionality.js         # Funcionalidad en tiempo real
│   │   └── style.css                       # Estilos CSS
│   │
│   ├── routes/                             # Rutas de la aplicación
│   │   ├── carts.router.js                 # Rutas de carritos
│   │   ├── products.router.js              # Rutas de productos
│   │   ├── uploads.router.js               # Rutas para subida de archivos
│   │   └── views.router.js                 # Rutas de vistas
│   │
│   ├── utils/                              # Funciones utilitarias
│   │   └── validaciones.js                 # Funciones de validación
│   │
│   └── views/                              # Vistas Handlebars
│       ├── home.handlebars                 # Página de inicio
│       ├── realTimeProducts.handlebars     # Vista en tiempo real
│       │
│       ├── layouts/
│       │   └── main.handlebars             # Layout principal
│       │
│       └── partials/                       # Componentes reutilizables
│           ├── formProducts.handlebars     # Formulario de productos
│           ├── header.handlebars           # Encabezado
│           ├── input.handlebars            # Componente de input
│           └── itemDropdown.handlebars     # Menú desplegable
│
├── uploads/                                # Carpeta de archivos
├── .gitignore
├── package.json                            # Configuración de dependencias y scripts
├── pnpm-lock.yaml                          # pnpm-lock
└── README.md

```

## Uso

1. Inicia el servidor:

   ```
   pnpm dev (Para iniciar con node en "src/app.js")
   ```

2. Accede a la API en `http://localhost:8080`.
