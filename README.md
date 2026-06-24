# Medi. — Recordatorio de Medicación

> Parcial 2 – Aplicaciones Móviles | React Native + Expo (SDK 51)
> Continuación de la app del Parcial 1.

---

## 📋 Descripción

**Medi.** permite registrarse, iniciar sesión y gestionar medicaciones con su hora
de recordatorio. En esta segunda entrega se incorporó el acceso a recursos del
dispositivo (cámara/galería, ubicación, contactos y calendario), testing
automatizado con Jest y la migración del estado a un store global con **Zustand**.

---

## 🆕 Novedades del Parcial 2

### 1. Estado global con Zustand
- `src/store/useMedStore.js` — store de la lista de medicaciones, con acciones
  `agregar`, `eliminar`, `actualizar` y `toggleTomada`.
- `src/store/useAuthStore.js` — store del usuario autenticado y la sesión.
- Las pantallas dejaron de manejar la lista con `useState` + lecturas sueltas de
  AsyncStorage y de pasar el usuario por params (prop drilling): ahora leen y
  modifican el estado a través de los hooks del store.

### 2. Permisos y acceso a recursos del dispositivo
Centralizado en `src/storage/dispositivo.js`. Cada recurso pide su permiso antes
de usarse, maneja los estados (concedido / denegado / no determinado) y muestra
un mensaje claro al usuario si se rechaza.

- **Cámara y galería** (`expo-image-picker`): foto del medicamento, se muestra en
  la lista (miniatura) y en el detalle (imagen grande).
- **Ubicación GPS** (`expo-location`): ubicación de la farmacia, con coordenadas y
  dirección aproximada por geocodificación inversa.
- **Contactos** (`expo-contacts`): selección del médico/familiar asociado.
- **Calendario** (`expo-calendar`): creación de un evento de la toma a la hora
  indicada, desde el alta o desde el detalle de la medicación.

### 3. Testing con Jest + React Native Testing Library
Tres tests (`__tests__/`):
- `CustomButton.test.js` — componente reutilizable (render e interacción).
- `validaciones.test.js` — lógica de negocio (validación de hora, adherencia).
- `useMedStore.test.js` — store global (agregar / toggle / eliminar / actualizar).

### Correcciones heredadas del Parcial 1
- La acción de **marcar una medicación como tomada** ahora está conectada a la UI
  (antes existía en storage pero no se llamaba, por eso Progreso siempre marcaba 0%).
- Las medicaciones y los datos de salud ahora se guardan **por usuario** (antes
  eran claves globales compartidas entre todas las cuentas).

---

## 🚀 Cómo ejecutar la app

### Requisitos
- Node.js 18+
- Expo Go **compatible con SDK 51** (o emulador de Android Studio, que instala
  automáticamente la versión correcta de Expo Go).

### Pasos
```bash
# 1. Instalar dependencias
npm install

# 2. (recomendado) Asegurar versiones nativas compatibles con el SDK
npx expo install expo-image-picker expo-location expo-contacts expo-calendar

# 3. Iniciar el servidor
npx expo start

# 4. Abrir en el emulador (tecla "a") o escanear el QR con Expo Go
```

---

## 🧪 Cómo correr los tests

```bash
npm test
```

Ejecuta los tres tests con Jest (preset `jest-expo`). Para modo interactivo:
`npm run test:watch`.

---

## 🗂 Estructura del proyecto

```
MediApp/
├── App.js
├── app.json
├── package.json
├── __tests__/
│   ├── CustomButton.test.js
│   ├── validaciones.test.js
│   └── useMedStore.test.js
└── src/
    ├── components/      CustomButton, MedicationItem
    ├── navigation/      AppNavigator
    ├── screens/         Welcome, Login, Register, Home, Med, AddMedication,
    │                    Progreso, Salud, Yo
    ├── store/           useAuthStore, useMedStore   (Zustand)
    ├── storage/         storage, dispositivo, notifications, theme
    └── utils/           validaciones
```

---

## 🤖 IA aplicada al desarrollo

Durante el desarrollo se utilizó un **asistente de IA** como herramienta de apoyo
en tareas puntuales, siempre bajo revisión, integración y decisiones de diseño
propias. La arquitectura general, la elección de Zustand, el alcance de cada
funcionalidad y la validación final en el emulador fueron definidas por el autor.

**Herramientas:** asistente conversacional de IA (generación y refactor de código).

**Ejemplos de prompts utilizados:**
- *"Generá un store de Zustand para una lista de medicaciones, con acciones
  agregar/eliminar/actualizar/toggle, que persista en AsyncStorage por usuario."*
- *"Escribí un módulo que pida permisos de cámara, ubicación, contactos y
  calendario en Expo SDK 51, manejando el caso de permiso denegado con un mensaje
  claro."*
- *"Configurá Jest con jest-expo y dame un test del store y uno de un componente."*

---

## 📱 Video DEMO
https://drive.google.com/file/d/17i02S_GNFmRPmwroZ5R91-KELMrWd7yT/view?usp=drive_link
---

## 👨‍💻 Autor
Jonatan Canchi — Aplicaciones Móviles — ISTEA
