# WalMat - Tu Tienda Online

![WalMat Logo](src/icons/walmat.png) ## Descripción del Proyecto

WalMat es una aplicación de eCommerce moderna y responsiva, construida con React, que permite a los usuarios explorar productos, gestionar un carrito de compras y (para usuarios autorizados) administrar el inventario de productos. El objetivo principal de WalMat es ofrecer una experiencia de compra online intuitiva y eficiente.

## Características Principales

* **Exploración de Productos:** Visualiza un catálogo de productos con opciones de búsqueda y filtrado por categoría.
* **Paginación:** Navega fácilmente a través de grandes colecciones de productos.
* **Gestión de Carrito:** Añade productos al carrito, ajusta cantidades y elimina artículos.
* **Autenticación de Usuarios:**
    * **Registro:** Crea una nueva cuenta con nombre de usuario, correo electrónico y contraseña.
    * **Inicio de Sesión:** Accede a tu cuenta para funcionalidades avanzadas.
    * **Cierre de Sesión:** Termina tu sesión de forma segura.
* **Administración de Productos (Solo para usuarios logueados):**
    * Crea nuevos productos.
    * Edita los detalles de productos existentes.
    * Elimina productos del catálogo.
* **Diseño Responsivo:** Interfaz adaptativa para una experiencia óptima en móviles, tablets y escritorios.
* **Notificaciones:** Uso de `react-toastify` para notificaciones de usuario (éxito/error).
* **Footer Global:** Información de contacto y derechos de autor en todas las páginas.
* **Sección "Sobre Nosotros":** Una breve descripción de la tienda en la página principal.

## Tecnologías Utilizadas

* **Frontend:**
    * [React.js](https://react.dev/)
    * [React Router DOM](https://reactrouter.com/en/main) (para navegación)
    * [React Bootstrap](https://react-bootstrap.netlify.app/) (para componentes UI)
    * [React Icons](https://react-icons.github.io/react-icons/) (para iconos)
    * [React Toastify](https://fkhadra.github.io/react-toastify/) (para notificaciones)
    * [React Helmet](https://github.com/nfl/react-helmet) (para gestionar el `<head>` del documento)
* **Manejo de Estado:** [React Context API](https://react.dev/learn/passing-props-with-context) (para carrito y autenticación)
* **Almacenamiento de Datos (Simulado):** `localStorage` del navegador para persistencia de usuarios y datos de API mockeados.
* **Mock API:** [MockAPI.io](https://mockapi.io/) (utilizado para simular el backend de productos).

## Instalación y Uso

Sigue estos pasos para configurar y ejecutar el proyecto en tu entorno local:

### Prerrequisitos

Asegúrate de tener instalado [Node.js](https://nodejs.org/en) y [npm](https://www.npmjs.com/) (o [Yarn](https://yarnpkg.com/)) en tu máquina.

### Pasos de Instalación

1.  **Clona el repositorio:**
    ```bash
    git clone [https://github.com/tu-usuario/walmat-ecommerce.git](https://github.com/tu-usuario/walmat-ecommerce.git) # Reemplaza con la URL de tu repositorio si usas Git
    ```
2.  **Navega al directorio del proyecto:**
    ```bash
    cd walmat-ecommerce
    ```
3.  **Instala las dependencias:**
    ```bash
    npm install
    # o si usas Yarn:
    # yarn install
    ```

### Ejecución de la Aplicación

1.  **Inicia la aplicación en modo desarrollo:**
    ```bash
    npm start
    # o si usas Yarn:
    # yarn start
    ```
    Esto abrirá la aplicación en tu navegador predeterminado en `http://localhost:3000`.

### Credenciales de Prueba (Simuladas)

Para probar la funcionalidad de administración de productos, puedes registrar un nuevo usuario o usar las siguientes credenciales (que se validarán contra `localStorage` si no has registrado ninguna):

* **Usuario de Prueba:** `testuser`
* **Contraseña:** `password123`

### Nota sobre el Mock API

Este proyecto utiliza una Mock API (MockAPI.io) para simular la gestión de productos. Los datos creados, editados o eliminados a través del panel de administración se persistirán en esta API mock, no en una base de datos local real. Los usuarios registrados se guardan en el `localStorage` de tu navegador.

## Contribución (Opcional)

Si deseas contribuir a este proyecto, por favor, sigue los siguientes pasos:
1.  Haz un fork del repositorio.
2.  Crea una nueva rama (`git checkout -b feature/nueva-caracteristica`).
3.  Realiza tus cambios y commitea (`git commit -am 'feat: añade nueva característica'`).
4.  Haz push a la rama (`git push origin feature/nueva-caracteristica`).
5.  Abre un Pull Request.

