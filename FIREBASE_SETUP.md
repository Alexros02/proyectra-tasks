# 🔥 Configuración de Firebase

## Pasos para configurar Firebase en el proyecto

### 1. Crear proyecto en Firebase Console
1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Haz clic en "Crear un proyecto"
3. Sigue los pasos para crear tu proyecto

### 2. Configurar autenticación
1. En el panel lateral, ve a "Authentication"
2. Haz clic en "Get started"
3. Ve a la pestaña "Sign-in method"
4. Habilita "Google" como proveedor
5. Configura el nombre del proyecto y email de soporte

### 3. Obtener configuración de la app
1. Ve a "Project Settings" (icono de engranaje)
2. Scroll hacia abajo hasta "Your apps"
3. Haz clic en el icono de web (</>)
4. Registra tu app con un nombre
5. Copia la configuración que aparece

### 4. Crear archivo de variables de entorno
Crea un archivo `.env.local` en la raíz del proyecto con:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=tu_api_key_aqui
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=tu_proyecto_id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=tu_proyecto_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=tu_proyecto_id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=tu_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=tu_app_id
```

### 5. Verificar configuración
- Reinicia el servidor de desarrollo
- Verifica que no aparezcan errores en la consola
- Prueba el login con Google

## 🔧 Características implementadas

- ✅ Autenticación con Google
- ✅ Validación de variables de entorno
- ✅ Prevención de inicialización múltiple
- ✅ Configuración del proveedor Google
- ✅ Manejo de errores

## 🚨 Solución de problemas

### Error: "Cannot find module 'firebase/app'"
- Ejecuta: `npm install firebase`

### Error: "Variables de entorno faltantes"
- Crea el archivo `.env.local` con las variables necesarias
- Reinicia el servidor

### Error de autenticación
- Verifica que Google esté habilitado en Firebase Console
- Asegúrate de que el dominio esté autorizado
