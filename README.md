# SocialHub - Frontend

## Descripción

Una aplicación web moderna para gestionar y publicar contenido en múltiples redes sociales desde una sola plataforma.

## Características

### Implementadas
- Autenticación de usuarios con login y registro
- Dashboard principal con estadísticas rápidas
- Publicación inmediata en redes sociales conectadas
- Gestión de conexiones OAuth para LinkedIn, Reddit y Mastodon
- Interfaz responsiva con diseño moderno y minimalista
- Sistema de navegación con sidebar y rutas organizadas

### En desarrollo
- Programación de publicaciones
- Historial de publicaciones con métricas
- Autenticación de dos factores (2FA)
- Cola de publicaciones

## Tecnologías

- **React 19.1.0** - Framework de UI
- **Vite 7.0.4** - Build tool y servidor de desarrollo
- **TailwindCSS 4.1.11** - Framework de estilos
- **React Router DOM 7.8.1** - Enrutamiento
- **Axios 1.11.0** - Cliente HTTP
- **Context API** - Gestión de estado

## Dependencias Principales

### Dependencias de Producción
- **@tailwindcss/vite** ^4.1.11 - Plugin de Vite para TailwindCSS
- **axios** ^1.11.0 - Cliente HTTP para requests a la API
- **dayjs** ^1.11.18 - Librería para manejo de fechas
- **lucide-react** ^0.541.0 - Iconos para React
- **react** ^19.1.0 - Framework de UI
- **react-dom** ^19.1.0 - DOM bindings para React
- **react-qr-code** ^2.0.18 - Generación de códigos QR
- **react-router-dom** ^7.8.1 - Enrutamiento para React
- **tailwindcss** ^4.1.11 - Framework de CSS utilitario

### Dependencias de Desarrollo
- **@eslint/js** ^9.30.1 - Configuración base de ESLint
- **@types/react** ^19.1.8 - Tipos TypeScript para React
- **@types/react-dom** ^19.1.6 - Tipos TypeScript para React DOM
- **@vitejs/plugin-react** ^4.6.0 - Plugin oficial de React para Vite
- **eslint** ^9.30.1 - Linter de JavaScript
- **eslint-plugin-react-hooks** ^5.2.0 - Reglas ESLint para hooks
- **eslint-plugin-react-refresh** ^0.4.20 - Plugin ESLint para React Refresh
- **globals** ^16.3.0 - Variables globales para ESLint
- **vite** ^7.0.4 - Build tool

## Requisitos del Sistema

- **Node.js** >= 16.0.0
- **npm** o **yarn**
- **Backend SocialHub** ejecutándose en `http://127.0.0.1:8000`

## Setup Completo desde Cero

Si es la primera vez que configuras el proyecto, sigue estos pasos:

### 1. Configurar el Backend
Antes de ejecutar el frontend, asegúrate de que el backend esté funcionando:
```bash
# En el directorio del backend
php artisan serve
# El backend debe estar corriendo en http://127.0.0.1:8000
```

### 2. Configurar el Frontend

1. **Clonar el repositorio**
```bash
git clone <repository-url>
cd frontISW811
```

2. **Verificar versión de Node.js**
```bash
node --version  # Debe ser >= 16.0.0
npm --version
```

3. **Instalar dependencias**

Todas las dependencias se instalan automáticamente con:
```bash
npm install
```

O puedes instalarlas individualmente:

**Dependencias de producción:**
```bash
npm install @tailwindcss/vite axios dayjs lucide-react react react-dom react-qr-code react-router-dom tailwindcss
```

**Dependencias de desarrollo:**
```bash
npm install -D @eslint/js @types/react @types/react-dom @vitejs/plugin-react eslint eslint-plugin-react-hooks eslint-plugin-react-refresh globals vite
```

4. **Configurar variables de entorno**
Crear un archivo `.env` en la raíz del proyecto:
```env
VITE_API_URL=http://127.0.0.1:8000/api

# OAuth URLs
VITE_LINKEDIN_LINK=http://127.0.0.1:8000/api/connections/linkedin/authorize
VITE_LINKEDIN_ACCESS_TOKEN=http://127.0.0.1:8000/api/connections/linkedin/access-token

VITE_REDDIT_LINK=http://127.0.0.1:8000/api/connections/reddit/authorize
VITE_REDDIT_ACCESS_TOKEN=http://127.0.0.1:8000/api/connections/reddit/access-token

VITE_MASTODON_LINK=http://127.0.0.1:8000/api/connections/mastodon/authorize
VITE_MASTODON_ACCESS_TOKEN=http://127.0.0.1:8000/api/connections/mastodon/access-token
```

5. **Ejecutar en desarrollo**
```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:5173`

### 3. Verificar la Conexión
- Backend debe estar corriendo en: `http://127.0.0.1:8000`
- Frontend debe estar corriendo en: `http://localhost:5173`
- Probar el login/registro para verificar conexión con la API

## Instalación (Proyecto Existente)

1. **Clonar el repositorio**
```bash
git clone <repository-url>
cd frontISW811
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Configurar variables de entorno**
Crear un archivo `.env` en la raíz del proyecto con las variables mostradas en la sección anterior.

4. **Ejecutar en desarrollo**
```bash
npm run dev
```

5. **Construir para producción**
```bash
npm run build
```

## Estructura del Proyecto

```
src/
├── api/
│   └── axios.js              # Configuración de Axios
├── components/
│   ├── Alert.jsx             # Componente de alertas
│   ├── ImmediatePostForm.jsx # Formulario de publicación
│   ├── Layout.jsx            # Layout principal
│   ├── Navbar.jsx            # Barra de navegación
│   ├── Sidebar.jsx           # Barra lateral
│   └── SocialAccountsPanel.jsx # Panel de conexiones
├── config/
│   └── env.js                # Configuración de variables de entorno
├── constants/
│   └── routes.js             # Constantes de rutas
├── context/
│   └── AuthContext.jsx       # Contexto de autenticación
├── pages/
│   ├── Dashboard.jsx         # Página principal
│   ├── Connections.jsx       # Página de conexiones
│   ├── History.jsx           # Historial (placeholder)
│   ├── Schedule.jsx          # Programación (placeholder)
│   ├── Enable2FA.jsx         # 2FA (placeholder)
│   ├── Verify2FA.jsx         # Verificación 2FA (placeholder)
│   ├── Login.jsx             # Página de login
│   └── Register.jsx          # Página de registro
├── App.jsx                   # Componente principal
└── main.jsx                  # Punto de entrada
```

## Integración con Backend

La aplicación se conecta con el backend Laravel ubicado en:
```
C:\Users\Fran\Desktop\ISW811\K\socialhub\backend\backISW811
```

### Endpoints principales utilizados

| Funcionalidad | Endpoint |
|---------------|----------|
| Autenticación | `/login`, `/register` |
| Posts | `/posts` (GET, POST) |
| LinkedIn OAuth | `/connections/linkedin/authorize` |
| LinkedIn Access Token | `/connections/linkedin/access-token` |
| Reddit OAuth | `/connections/reddit/authorize` |
| Reddit Access Token | `/connections/reddit/access-token` |
| Mastodon OAuth | `/connections/mastodon/authorize` |
| Mastodon Access Token | `/connections/mastodon/access-token` |

## Diseño y UX

### Principios de diseño
- **Minimalista**: Interfaz limpia y sin distracciones
- **Responsivo**: Adaptable a todos los dispositivos
- **Intuitivo**: Flujo de usuario claro y lógico
- **Escalable**: Preparado para futuras funcionalidades

### Flujo de usuario
1. **Login/Registro** → Autenticación
2. **Dashboard** → Vista general y estadísticas
3. **Conexiones** → Conectar redes sociales
4. **Publicación** → Crear y publicar contenido
5. **Historial** → Revisar publicaciones anteriores

## Seguridad

- Autenticación basada en tokens
- Interceptores de Axios para manejo de errores 401
- Variables de entorno para configuración sensible
- Preparado para implementación de 2FA

## Próximas Funcionalidades

- Programación de publicaciones con calendario
- Historial detallado con métricas de engagement
- Autenticación de dos factores
- Cola de publicaciones
- Análisis de mejores horarios para publicar
- Exportación de reportes
- Notificaciones push

## Scripts Disponibles

- `npm run dev` - Servidor de desarrollo
- `npm run build` - Construcción para producción
- `npm run preview` - Vista previa de producción
- `npm run lint` - Linting del código

## Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.