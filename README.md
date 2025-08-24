# SocialHub - Frontend

Una aplicación web moderna para gestionar y publicar contenido en múltiples redes sociales desde una sola plataforma.

## 🚀 Características

### ✅ Implementadas
- **Autenticación de usuarios** con login y registro
- **Dashboard principal** con estadísticas rápidas
- **Publicación inmediata** en redes sociales conectadas
- **Gestión de conexiones OAuth** para LinkedIn, Reddit y Mastodon
- **Interfaz responsiva** con diseño moderno y minimalista
- **Sistema de navegación** con sidebar y rutas organizadas

### 🔄 En desarrollo
- Programación de publicaciones
- Historial de publicaciones con métricas
- Autenticación de dos factores (2FA)
- Cola de publicaciones

## 🛠️ Tecnologías

- **React 19** - Framework de UI
- **Vite** - Build tool y servidor de desarrollo
- **TailwindCSS** - Framework de estilos
- **React Router DOM** - Enrutamiento
- **Axios** - Cliente HTTP
- **Context API** - Gestión de estado

## 📦 Instalación

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

4. **Ejecutar en desarrollo**
```bash
npm run dev
```

5. **Construir para producción**
```bash
npm run build
```

## 🏗️ Estructura del Proyecto

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

## 🔗 Integración con Backend

La aplicación se conecta con el backend Laravel ubicado en:
```
C:\Users\Fran\Desktop\ISW811\K\socialhub\backend\backISW811
```

### Endpoints principales utilizados:

- **Autenticación**: `/login`, `/register`
- **Posts**: `/posts` (GET, POST)
- **Conexiones OAuth**:
  - LinkedIn: `/connections/linkedin/authorize`, `/connections/linkedin/access-token`
  - Reddit: `/connections/reddit/authorize`, `/connections/reddit/access-token`
  - Mastodon: `/connections/mastodon/authorize`, `/connections/mastodon/access-token`

## 🎨 Diseño y UX

### Principios de diseño:
- **Minimalista**: Interfaz limpia y sin distracciones
- **Responsivo**: Adaptable a todos los dispositivos
- **Intuitivo**: Flujo de usuario claro y lógico
- **Escalable**: Preparado para futuras funcionalidades

### Flujo de usuario:
1. **Login/Registro** → Autenticación
2. **Dashboard** → Vista general y estadísticas
3. **Conexiones** → Conectar redes sociales
4. **Publicación** → Crear y publicar contenido
5. **Historial** → Revisar publicaciones anteriores

## 🔐 Seguridad

- Autenticación basada en tokens
- Interceptores de Axios para manejo de errores 401
- Variables de entorno para configuración sensible
- Preparado para implementación de 2FA

## 🚀 Próximas Funcionalidades

- [ ] Programación de publicaciones con calendario
- [ ] Historial detallado con métricas de engagement
- [ ] Autenticación de dos factores
- [ ] Cola de publicaciones
- [ ] Análisis de mejores horarios para publicar
- [ ] Exportación de reportes
- [ ] Notificaciones push

## 📝 Scripts Disponibles

- `npm run dev` - Servidor de desarrollo
- `npm run build` - Construcción para producción
- `npm run preview` - Vista previa de producción
- `npm run lint` - Linting del código

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.
