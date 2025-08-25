# Autenticación de Dos Factores (2FA) - SocialHub

## Descripción

Este proyecto ha sido actualizado para incluir autenticación de dos factores (2FA) completa, proporcionando una capa adicional de seguridad para las cuentas de usuario.

## Funcionalidades Implementadas

### 1. Login con Soporte 2FA
- **Ubicación**: `src/pages/Login.jsx`
- **Funcionalidad**: 
  - Verifica si el usuario tiene 2FA habilitado
  - Si está habilitado, redirige a la página de verificación 2FA
  - Si no está habilitado, procede con el login normal
  - Manejo mejorado de errores y validaciones

### 2. Registro con Opción 2FA
- **Ubicación**: `src/pages/Register.jsx`
- **Funcionalidad**:
  - Checkbox para habilitar 2FA durante el registro
  - Validaciones mejoradas de contraseña (mínimo 8 caracteres)
  - Confirmación de contraseña
  - Mensaje de éxito con redirección automática

### 3. Verificación 2FA
- **Ubicación**: `src/pages/Verify2FA.jsx`
- **Funcionalidad**:
  - 6 inputs individuales para el código OTP
  - Auto-focus y navegación automática entre inputs
  - Soporte para pegar códigos completos
  - Navegación con teclado (flechas, backspace)
  - Auto-verificación cuando se completa el código
  - Opción para reenviar código
  - Manejo de errores y mensajes de éxito

### 4. Configuración 2FA
- **Ubicación**: `src/pages/Enable2FA.jsx`
- **Funcionalidad**:
  - Generación y visualización de códigos QR
  - Activación/desactivación de 2FA
  - Validación de códigos OTP para confirmar cambios
  - Generación de nuevos códigos QR
  - Estado visual del estado de 2FA

### 5. Componentes Reutilizables

#### OTPInput
- **Ubicación**: `src/components/OTPInput.jsx`
- **Funcionalidad**:
  - Componente reutilizable para inputs OTP
  - Auto-focus y navegación automática
  - Soporte para pegar códigos
  - Callback cuando se completa el código
  - Personalizable (longitud, estilos, etc.)

#### AuthContext Mejorado
- **Ubicación**: `src/context/AuthContext.jsx` y `src/hooks/useAuth.js`
- **Funcionalidad**:
  - Manejo mejorado del estado de autenticación
  - Verificación automática al cargar la aplicación
  - Funciones para actualizar información del usuario
  - Separación del hook useAuth para evitar errores de fast refresh

## Endpoints del Backend Requeridos

### Login
```
POST /login
Body: { email, password }
Response: { data: { id, first_name, last_name, two_factor_enabled } }
```

### Registro
```
POST /register
Body: { first_name, last_name, email, password, two_factor_enabled }
Response: { data: { id, first_name, last_name, two_factor_enabled } }
```

### Verificación 2FA
```
POST /2fa/verify
Body: { code, user_id }
Response: { data: { id, first_name, last_name } }
```

### Reenvío de Código 2FA
```
POST /2fa/resend
Body: { user_id }
Response: { message: "Code sent successfully" }
```

### Obtener QR Code
```
GET /users/{user_id}/qr-2fa
Response: { data: { two_factor_url, two_factor_enabled } }
```

### Generar Nuevo QR Code
```
POST /users/{user_id}/generate-qr
Response: { data: { two_factor_url } }
```

### Habilitar/Deshabilitar 2FA
```
PUT /users/{user_id}/enable-2fa
Body: { two_factor_enabled: boolean, verify_code: string }
Response: { data: { two_factor_enabled } }
```

## Flujo de Usuario

### 1. Registro con 2FA
1. Usuario llena el formulario de registro
2. Marca la opción "Enable Two-Factor Authentication"
3. Se crea la cuenta y se genera un QR code
4. Usuario escanea el QR con su app autenticadora
5. Usuario ingresa el código de 6 dígitos para verificar
6. 2FA queda habilitado

### 2. Login con 2FA
1. Usuario ingresa email y contraseña
2. Si 2FA está habilitado, se redirige a `/verify-2fa?id={user_id}`
3. Usuario ingresa el código de 6 dígitos de su app
4. Se verifica el código y se completa el login
5. Usuario accede al dashboard

### 3. Configuración de 2FA
1. Usuario accede a "2FA" desde el sidebar
2. Puede ver el estado actual (habilitado/deshabilitado)
3. Para habilitar: muestra QR code, usuario escanea e ingresa código
4. Para deshabilitar: usuario ingresa código de verificación
5. Cambios se aplican inmediatamente

## Características de Seguridad

- **Validación de códigos**: Solo acepta códigos de 6 dígitos numéricos
- **Auto-focus**: Mejora la experiencia de usuario
- **Navegación con teclado**: Accesibilidad completa
- **Pegado de códigos**: Soporte para copiar/pegar códigos completos
- **Manejo de errores**: Mensajes claros para diferentes tipos de error
- **Estado persistente**: Información de usuario guardada en localStorage
- **Verificación automática**: Al completar el código se verifica automáticamente

## Dependencias Agregadas

```json
{
  "react-qr-code": "^1.0.5"
}
```

## Instalación

```bash
npm install react-qr-code
```

## Uso

1. **Registro**: Los usuarios pueden habilitar 2FA durante el registro
2. **Login**: El sistema detecta automáticamente si 2FA está habilitado
3. **Configuración**: Los usuarios pueden gestionar su 2FA desde el sidebar
4. **Verificación**: Interfaz intuitiva para ingresar códigos OTP

## Notas Técnicas

- El componente OTPInput es reutilizable y puede configurarse para diferentes longitudes
- El AuthContext maneja automáticamente la verificación del estado de autenticación
- Los códigos QR se generan dinámicamente desde el backend
- La interfaz es responsive y accesible
- Se mantiene la consistencia visual con el resto de la aplicación

## Próximas Mejoras

- [ ] Códigos de respaldo para recuperación de cuenta
- [ ] Historial de dispositivos autorizados
- [ ] Notificaciones por email/SMS como método alternativo
- [ ] Configuración de tiempo de expiración de códigos
- [ ] Análisis de seguridad y auditoría de intentos de acceso
