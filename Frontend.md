# Guía del Frontend de Cunservicios

Esta guía te ayudará a entender, ejecutar y desarrollar la parte frontend de la aplicación Cunservicios, un sistema de gestión para servicios de acueducto y alcantarillado.

## Índice

1. [Estructura del proyecto](https://claude.ai/chat/00c06c62-1923-4ec9-afdc-4e79bb07f4b8#estructura-del-proyecto)
2. [Tecnologías utilizadas](https://claude.ai/chat/00c06c62-1923-4ec9-afdc-4e79bb07f4b8#tecnolog%C3%ADas-utilizadas)
3. [Configuración del entorno](https://claude.ai/chat/00c06c62-1923-4ec9-afdc-4e79bb07f4b8#configuraci%C3%B3n-del-entorno)
4. [Ejecutando la aplicación](https://claude.ai/chat/00c06c62-1923-4ec9-afdc-4e79bb07f4b8#ejecutando-la-aplicaci%C3%B3n)
5. [Arquitectura y patrones](https://claude.ai/chat/00c06c62-1923-4ec9-afdc-4e79bb07f4b8#arquitectura-y-patrones)
6. [Componentes principales](https://claude.ai/chat/00c06c62-1923-4ec9-afdc-4e79bb07f4b8#componentes-principales)
7. [Páginas del sistema](https://claude.ai/chat/00c06c62-1923-4ec9-afdc-4e79bb07f4b8#p%C3%A1ginas-del-sistema)
8. [Estilos y diseño visual](https://claude.ai/chat/00c06c62-1923-4ec9-afdc-4e79bb07f4b8#estilos-y-dise%C3%B1o-visual)
9. [Comunicación con el backend](https://claude.ai/chat/00c06c62-1923-4ec9-afdc-4e79bb07f4b8#comunicaci%C3%B3n-con-el-backend)
10. [Flujos principales](https://claude.ai/chat/00c06c62-1923-4ec9-afdc-4e79bb07f4b8#flujos-principales)
11. [Consejos de desarrollo](https://claude.ai/chat/00c06c62-1923-4ec9-afdc-4e79bb07f4b8#consejos-de-desarrollo)
12. [Resolución de problemas comunes](https://claude.ai/chat/00c06c62-1923-4ec9-afdc-4e79bb07f4b8#resoluci%C3%B3n-de-problemas-comunes)

## Estructura del proyecto

El frontend está organizado en una estructura estándar de React:

```
frontend/
├── public/               # Archivos estáticos y punto de entrada HTML
├── src/                  # Código fuente principal
│   ├── components/       # Componentes reutilizables
│   │   ├── common/       # Componentes genéricos (Header, Footer, etc.)
│   │   ├── forms/        # Componentes de formularios
│   │   ├── layout/       # Componentes de disposición
│   │   └── services/     # Componentes específicos de servicios
│   ├── pages/            # Componentes de página (rutas principales)
│   ├── services/         # Servicios para comunicación con API
│   ├── styles/           # Estilos CSS y configuración de Tailwind
│   ├── App.jsx           # Componente principal y configuración de rutas
│   └── index.jsx         # Punto de entrada de React
└── package.json          # Dependencias y scripts NPM
```

## Tecnologías utilizadas

El frontend está construido con las siguientes tecnologías:

- **React (v18)**: Biblioteca JavaScript para construir interfaces de usuario
- **React Router (v6)**: Para la navegación y gestión de rutas
- **Formik y Yup**: Para manejo y validación de formularios
- **Axios**: Cliente HTTP para realizar peticiones a la API
- **Tailwind CSS**: Framework CSS de utilidades para el diseño
- **React Helmet**: Para gestionar el título y metadatos de la página

## Configuración del entorno

Para comenzar a trabajar con el frontend, necesitas:

1. **Node.js**: Versión 16 o superior
2. **npm** o **yarn**: Gestor de paquetes

### Pasos para configurar:

1. Clonar el repositorio (si aún no lo has hecho):
    
    ```bash
    git clone [url-del-repositorio]
    cd cunservicios
    ```
    
2. Instalar dependencias:
    
    ```bash
    cd frontend
    npm install
    # O usando yarn:
    # yarn install
    ```
    
3. Configurar variables de entorno:
    
    - Copia el archivo `.env.example` a `.env`:
        
        ```bash
        cp .env.example .env
        ```
        
    - Edita `.env` para configurar la URL de la API:
        
        ```
        REACT_APP_API_URL=http://localhost:8000
        ```
        

## Ejecutando la aplicación

Para ejecutar la aplicación en modo desarrollo:

```bash
npm start
# O con yarn:
# yarn start
```

Esto iniciará el servidor de desarrollo y abrirá la aplicación en tu navegador, típicamente en http://localhost:3000.

### Scripts disponibles:

- `npm start`: Inicia el servidor de desarrollo
- `npm build`: Crea una versión optimizada para producción
- `npm test`: Ejecuta las pruebas
- `npm run eject`: Expone la configuración de Create React App (¡usar con precaución!)

## Arquitectura y patrones

El frontend sigue una arquitectura basada en componentes con los siguientes patrones:

4. **Componentes de presentación vs. contenedores**:
    
    - Los componentes de presentación se centran en la interfaz de usuario
    - Los contenedores gestionan el estado y la lógica de negocio
5. **Patrón de composición**:
    
    - Componentes pequeños y reutilizables que se combinan para formar interfaces complejas
6. **Gestión del estado**:
    
    - Estado local con `useState` para componentes individuales
    - Uso de React Context para estado compartido entre componentes (cuando es necesario)

## Componentes principales

### Estructura de Layout

El componente `Layout` (`src/components/layout/Layout.jsx`) envuelve toda la aplicación y proporciona:

- Header (navegación)
- Footer (información de contacto y enlaces)
- Contenedor principal para las páginas

### Formularios

Los formularios utilizan Formik y Yup para:

- Gestión del estado del formulario
- Validación de campos
- Manejo de envío y errores

Ejemplo de un formulario (simplificado):

```jsx
<Formik
  initialValues={{ numeroCuenta: "" }}
  validationSchema={Yup.object({
    numeroCuenta: Yup.string().required("Campo requerido")
  })}
  onSubmit={handleSubmit}
>
  {/* ... campos del formulario ... */}
</Formik>
```

### Componentes de UI comunes

- `Header`: Navegación principal y menú móvil
- `Footer`: Enlaces e información de contacto
- `ServiceCard`: Tarjeta para mostrar servicios
- `FacturaDetail`: Muestra detalles de una factura

## Páginas del sistema

El sistema tiene las siguientes páginas principales:

7. **Home** (`src/pages/Home.jsx`): Página de inicio con información general y accesos rápidos
8. **Services** (`src/pages/Services.jsx`): Detalles de los servicios ofrecidos
9. **Billing** (`src/pages/Billing.jsx`): Consulta y pago de facturas
10. **PQR** (`src/pages/PQR.jsx`): Sistema de Peticiones, Quejas y Reclamos
11. **Contact** (`src/pages/Contact.jsx`): Información de contacto y formulario
12. **NotFound** (`src/pages/NotFound.jsx`): Página 404 para rutas no existentes

Las rutas están definidas en `App.jsx`:

```jsx
<Routes>
  <Route path="/" element={<Home />} />
  <Route path="/servicios" element={<Services />} />
  <Route path="/facturacion" element={<Billing />} />
  <Route path="/pqr" element={<PQR />} />
  <Route path="/contacto" element={<Contact />} />
  <Route path="*" element={<NotFound />} />
</Routes>
```

## Estilos y diseño visual

El proyecto utiliza Tailwind CSS para estilos:

13. **Clases utilitarias**: La mayoría de los estilos se aplican directamente como clases de Tailwind:
    
    ```jsx
    <div className="bg-blue-600 text-white py-4 rounded-lg">
      Contenido
    </div>
    ```
    
14. **Componentes estilizados**: Se han creado clases de componentes en `src/styles/global.css`:
    
    ```css
    .btn {
      @apply px-4 py-2 rounded-md font-medium transition-colors duration-200;
    }
    .btn-primary {
      @apply bg-blue-600 text-white hover:bg-blue-700;
    }
    ```
    
15. **Diseño responsivo**: Se usa el sistema de grid y breakpoints de Tailwind:
    
    ```jsx
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {/* Contenido responsivo */}
    </div>
    ```
    

## Comunicación con el backend

La comunicación con la API se maneja a través de los servicios en `src/services/api.js`:

```javascript
// Ejemplo de configuración de Axios
const apiClient = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:8000",
  headers: {
    "Content-Type": "application/json",
  },
});

// Servicio para facturas
export const facturaService = {
  getFacturas: () => apiClient.get("/api/facturas"),
  getFacturaPorNumero: (numeroFactura) => 
    apiClient.get(`/api/facturas/${numeroFactura}`),
  // ...
};
```

En un componente, usarías estos servicios así:

```javascript
import { facturaService } from "../services/api";

// Luego en una función dentro del componente:
const fetchFactura = async (numeroCuenta) => {
  try {
    const response = await facturaService.getFacturaPorNumero(numeroCuenta);
    setFactura(response.data);
  } catch (error) {
    setError("Error al consultar la factura");
  }
};
```

## Flujos principales

### Consulta de factura

16. Usuario ingresa a la página `/facturacion`
17. Ingresa su número de cuenta en el formulario
18. El sistema hace una petición a la API
19. Se muestra la factura con opciones para pagar o descargar

### Radicación de PQR

20. Usuario ingresa a la página `/pqr`
21. Completa el formulario de PQR con todos los campos requeridos
22. Al enviar, el sistema registra la solicitud
23. Se muestra un mensaje de confirmación con número de radicado

### Consulta de estado de PQR

24. Usuario ingresa a la página `/pqr`
25. Ingresa el número de radicado en el formulario de consulta
26. El sistema busca el PQR y muestra su estado y detalles

## Consejos de desarrollo

### Buenas prácticas

27. **Componentes reutilizables**: Identifica patrones comunes y crea componentes para ellos
28. **Props typing**: Define claramente las props que cada componente necesita
29. **Validación de formularios**: Usa siempre esquemas de Yup para validar entradas
30. **Manejo de errores**: Implementa captura y visualización de errores en todas las peticiones
31. **Loading states**: Muestra indicadores de carga durante operaciones asíncronas

### Para extender el proyecto

32. **Agregar una nueva página**:
    
    - Crea el componente en `src/pages/`
    - Agrega la ruta en `App.jsx`
    - Actualiza la navegación en `Header.jsx`
33. **Crear un nuevo componente**:
    
    - Colócalo en la carpeta apropiada dentro de `src/components/`
    - Haz que sea reutilizable y con props bien definidas
    - Usa estilos consistentes con el resto de la aplicación
34. **Agregar un nuevo servicio API**:
    
    - Agrega los métodos necesarios en `src/services/api.js`
    - Sigue el patrón de los servicios existentes

## Resolución de problemas comunes

### "No se puede conectar con la API"

- Verifica que el backend esté ejecutándose
- Comprueba la URL de la API en el archivo `.env`
- Revisa si hay errores CORS (problema de configuración del backend)

### "Los estilos no se aplican correctamente"

- Asegúrate de que Tailwind CSS esté configurado correctamente
- Verifica si estás usando las clases correctas
- Comprueba si hay conflictos de estilos

### "Los componentes no se renderizan como se espera"

- Utiliza las herramientas de desarrollo de React para inspeccionar los componentes
- Verifica el estado y las props utilizando console.log o React DevTools
- Asegúrate de que no haya errores en la consola del navegador

### "Cambios en el código no se reflejan"

- Asegúrate de guardar todos los archivos
- Verifica que el servidor de desarrollo esté funcionando
- Intenta refrescar el navegador con Ctrl+F5
- En casos extremos, reinicia el servidor de desarrollo

---

Con esta guía deberías tener una comprensión completa del frontend de Cunservicios y estar listo para comenzar a trabajar con él. Si tienes preguntas específicas o necesitas más detalles sobre alguna parte, no dudes en preguntar.