# 🛍️ Sistema de Gestión de Productos

Aplicación web moderna para la gestión de productos con autenticación, CRUD completo y diseño responsivo.

## 📋 Descripción

Este proyecto es una aplicación de gestión de productos desarrollada con React, TypeScript y Vite. Permite a los usuarios autenticados realizar operaciones CRUD (Crear, Leer, Actualizar, Eliminar) sobre productos, con una interfaz moderna y fluida.

## ✨ Características

- 🔐 **Autenticación** - Sistema de login con persistencia de sesión
- 📦 **Gestión de Productos** - CRUD completo de productos
- 🎨 **Dos vistas de visualización** - Vista de tabla y vista de tarjetas
- 🔍 **Búsqueda y filtros** - Filtrado por categoría y búsqueda en tiempo real
- 📱 **Diseño responsivo** - Optimizado para móvil, tablet y desktop
- 🎭 **Animaciones fluidas** - Transiciones suaves con Framer Motion
- 🖼️ **Galería de imágenes** - Visualización de múltiples imágenes por producto
- ✏️ **Edición inline** - Editar productos desde la lista o vista de detalle
- 🗑️ **Confirmación de eliminación** - Modal de confirmación antes de eliminar
- 💾 **Validación de formularios** - Validación en tiempo real de todos los campos

## 🚀 Tecnologías Utilizadas

- **React 19.1.1** - Biblioteca de interfaz de usuario
- **TypeScript** - Tipado estático para JavaScript
- **Vite 7.1.7** - Build tool y dev server ultrarrápido
- **Tailwind CSS 3.4.0** - Framework de CSS utility-first
- **Framer Motion** - Biblioteca de animaciones
- **React Router DOM** - Enrutamiento del lado del cliente
- **DummyJSON API** - API de prueba para datos de productos

## 📦 Instalación

1. **Clonar el repositorio**
```bash
git clone <url-del-repositorio>
cd prueba-tecnica
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Iniciar el servidor de desarrollo**
```bash
npm run dev
```

4. **Abrir en el navegador**
```
http://localhost:5174
```

## 🔑 Credenciales de Prueba

Para acceder a la aplicación, utiliza las siguientes credenciales:

- **Usuario:** `emilys`
- **Contraseña:** `emilyspass`

Estas credenciales son proporcionadas por la API de DummyJSON.

## 📁 Estructura del Proyecto

```
prueba-tecnica/
├── src/
│   ├── components/          # Componentes reutilizables
│   │   ├── ProductFormModal.tsx
│   │   └── index.ts
│   ├── pages/              # Páginas principales
│   │   ├── Login.tsx
│   │   ├── Products.tsx
│   │   └── ProductDetail.tsx
│   ├── services/           # Servicios y API calls
│   │   ├── authService.ts
│   │   └── productService.ts
│   ├── context/            # Context API
│   │   └── AuthContext.tsx
│   ├── types/              # Definiciones de TypeScript
│   │   └── index.ts
│   ├── App.tsx             # Componente principal
│   ├── main.tsx            # Punto de entrada
│   └── index.css           # Estilos globales
├── public/                 # Archivos estáticos
├── package.json
├── tsconfig.json
├── vite.config.ts
└── tailwind.config.js
```

## 🎯 Funcionalidades Principales

### 1. Autenticación
- Login con validación de credenciales
- Persistencia de sesión en localStorage
- Redirección automática según estado de autenticación
- Logout con limpieza de sesión

### 2. Lista de Productos
- Vista de tabla con información detallada
- Vista de tarjetas con diseño moderno
- Filtrado por categoría
- Búsqueda en tiempo real por título
- Botones de acción (Ver, Editar, Eliminar) en cada producto

### 3. Detalle de Producto
- Galería de imágenes con navegación
- Miniaturas seleccionables
- Información completa del producto
- Calificación con estrellas
- Indicador de stock con colores
- Botones para editar y eliminar

### 4. Crear/Editar Producto
- Formulario modal responsivo
- Validación en tiempo real
- Campos: título, descripción, precio, descuento, stock, marca, categoría
- Mensajes de éxito/error

### 5. Eliminar Producto
- Modal de confirmación
- Feedback visual del estado
- Redirección automática tras eliminación

## 🛠️ Scripts Disponibles

```bash
npm run dev          # Inicia el servidor de desarrollo
npm run build        # Compila para producción
npm run preview      # Preview de la build de producción
npm run lint         # Ejecuta ESLint
```

## 📝 Notas Importantes

- **API de Prueba**: Este proyecto utiliza DummyJSON API, que simula operaciones CRUD pero no persiste los cambios en el servidor. Los productos creados o editados solo existirán durante la sesión actual.

- **Autenticación**: La autenticación es manejada por la API de DummyJSON y el token se almacena en localStorage.

- **Diseño Responsivo**: La aplicación está optimizada para funcionar en dispositivos móviles, tablets y escritorio.

## 🎨 Diseño y UX

- **Gradientes modernos**: Uso de gradientes sutiles para un diseño atractivo
- **Animaciones fluidas**: Transiciones suaves en navegación y modales
- **Feedback visual**: Indicadores de carga y estados de la aplicación
- **Sin scroll innecesario**: Vista de detalle optimizada para caber en pantalla
- **Iconografía**: SVG icons para una interfaz clara

## 🐛 Solución de Problemas

### El login no funciona
- Verifica que estés usando las credenciales correctas: `emilys` / `emilyspass`
- Verifica la conexión a internet (API externa)

### Los productos no se crean/actualizan
- Esto es normal: DummyJSON API simula las operaciones pero no persiste los datos
- Los productos creados solo existirán en la sesión actual

### Estilos no se aplican correctamente
```bash
npm run build
npm run dev
```

## 📄 Licencia

Este proyecto fue desarrollado como prueba técnica.

## 👨‍💻 Desarrollador
Jefferson Alexis Pozo Bohórquez
Desarrollado con ❤️ usando React + TypeScript + Vite

---

## 🔧 Configuración Avanzada de ESLint (Opcional)

Si deseas habilitar reglas de lint más estrictas:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
