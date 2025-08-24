# Sistema de Conexiones Sociales - Frontend React

## 🎯 Funcionalidades Implementadas

### Botón Dinámico por Red Social
Cada red social (LinkedIn, Reddit, Mastodon) ahora tiene un **único botón** que cambia dinámicamente según el estado de conexión:

- **"Conectar con [Red]"** - Si el usuario no está conectado
- **"Desconectar [Red]"** - Si el usuario ya está conectado

### Estado de Conexión
El estado se obtiene automáticamente desde el endpoint:
```
GET {API_URL}/connections/user/{user}/platform-status
```

**Respuesta esperada:**
```json
[
  { "id": 1, "platform": "linkedin", "status": 1 },
  { "id": 2, "platform": "reddit", "status": 0 },
  { "id": 3, "platform": "mastodon", "status": 1 }
]
```

- `status === 1` → Activo/Conectado
- `status === 0` → Desconectado

### Flujo de Conexión
1. **Clic en "Conectar"** → Redirige a la URL de OAuth correspondiente:
   - LinkedIn → `VITE_LINKEDIN_LINK`
   - Reddit → `VITE_REDDIT_LINK`
   - Mastodon → `VITE_MASTODON_LINK`

2. **Clic en "Desconectar"** → Llama al endpoint:
   ```
   DELETE {API_URL}/connections/{id}
   ```

### Estados de Carga
- **Spinner de carga** mientras se procesa la acción
- **Botón deshabilitado** durante el proceso
- **Mensajes de éxito/error** para feedback del usuario

## 🔧 Configuración Requerida

### Variables de Entorno
Asegúrate de tener configuradas estas variables en tu archivo `.env`:

```env
# API Configuration
VITE_API_URL=http://127.0.0.1:8000/api

# OAuth URLs for Social Networks
VITE_LINKEDIN_LINK=http://127.0.0.1:8000/api/connections/linkedin/authorize
VITE_REDDIT_LINK=http://127.0.0.1:8000/api/connections/reddit/authorize
VITE_MASTODON_LINK=http://127.0.0.1:8000/api/connections/mastodon/authorize
```

## 📁 Archivos Modificados/Creados

### Nuevos Archivos
- `src/api/helpers.js` - Helper para obtener enlaces de OAuth

### Archivos Modificados
- `src/components/SocialAccountsPanel.jsx` - Componente principal con la nueva lógica

## 🎨 Ejemplo de UI

```jsx
<Button onClick={() => handleClick("linkedin")} disabled={isLoading}>
  {linkedinConnect.active ? "Desconectar LinkedIn" : "Conectar LinkedIn"}
</Button>
```

## 🔄 Flujo de Funcionamiento

1. **Carga inicial**: `useEffect` obtiene el estado de todas las conexiones
2. **Renderizado**: Los botones se muestran según el estado actual
3. **Interacción**: `handleClick` decide automáticamente si conectar o desconectar
4. **Actualización**: El estado local se actualiza después de cada acción

## 🚀 Uso

El componente `SocialAccountsPanel` ahora maneja automáticamente:
- ✅ Estado de conexión de cada red social
- ✅ Botones dinámicos según el estado
- ✅ Spinners de carga durante las acciones
- ✅ Manejo de errores y mensajes de éxito
- ✅ Redirección a OAuth para conexión
- ✅ Desconexión mediante API

No se requieren cambios adicionales en el código que usa este componente.
