# Proyecto To-Do — Ionic + Angular + Cordova

Aplicación móvil híbrida desarrollada con **Ionic + Angular** utilizando **Apache Cordova** como runtime nativo.

La app permite gestionar tareas con categorías, persistencia local y control de funcionalidades mediante **Firebase Remote Config** (feature flags).

## Funcionalidades

- Crear, completar y eliminar tareas.
- Crear, editar y eliminar categorías.
- Asignar categoría a una tarea.
- Filtrar tareas por categoría.
- Persistencia local del estado.
- Feature flag con Firebase Remote Config.
- Compilación para Android e iOS con Cordova.

## Stack Tecnológico

- **Ionic:** 7
- **Angular:** 16
- **Apache Cordova:** 12
- **Plataformas:** cordova-android 12 / cordova-ios 7
- **Node.js:** 18 LTS
- **Java:** JDK 11
- **Android SDK:** 35

---

## Requisitos del Sistema

Instalar previamente:

- **Node.js**: 18 LTS
- **Ionic CLI 7 y Cordova 12**:
  ```bash
  npm install -g @ionic/cli@7 cordova@12
  ```
- **Java**: JDK 11
- **Android Studio** (incluye Android SDK)
- Variable de entorno `ANDROID_HOME` configurada
- **(Opcional iOS)** macOS + Xcode

## Instalación del Proyecto

Instalar dependencias:
```bash
npm install
```

Si aún no existen las plataformas instaladas, añádelas:
```bash
ionic integrations enable cordova
ionic cordova platform add android@12
ionic cordova platform add ios@7
```

---

## Ejecución en Desarrollo

### Android (dispositivo o emulador)
```bash
ionic cordova run android -l
```

### iOS (macOS)
```bash
ionic cordova run ios -l
```

> **Nota:** `-l` habilita live reload. Si hay problemas con live reload, usar `ionic build` seguido de `ionic cordova run <platform>`.

---

## Compilación para Entrega

### Generar APK (Android)
```bash
ionic build --prod
ionic cordova build android --prod
```
> El APK se genera en: `platforms/android/app/build/outputs/`

### Generar IPA (iOS)
```bash
ionic build --prod
ionic cordova build ios --prod
```
> Abrir el proyecto en Xcode y exportar el IPA.

---

## Arquitectura del Proyecto

```text
src/app/
├── core/           → servicios singleton (storage, firebase, config)
├── shared/         → componentes reutilizables
├── features/
│   ├── tasks/      → gestión de tareas
│   └── categories/ → gestión de categorías
└── models/         → interfaces y tipos
```

**Principios aplicados:**
- Separación por features
- Servicios inyectables
- Tipado fuerte con interfaces
- Flujo reactivo para estado

---

## Firebase Remote Config (Feature Flags)

Se implementó un feature flag para activar/desactivar funcionalidades sin recompilar la app.

**Ejemplo de flags:**
- `enable_categories` → habilita el módulo de categorías
- `enable_task_stats` → habilita estadísticas (opcional)

**Flujo:**
1. La app inicializa Firebase al arrancar.
2. Obtiene valores de Remote Config.
3. La UI se adapta según los flags configurados.

---

## Optimización de Rendimiento

- **Lazy loading** de módulos por feature.
- Uso de `ChangeDetectionStrategy.OnPush`.
- Utilización de `trackBy` en listas.
- Minimización de renders innecesarios.
- Build en modo producción completo.
- Manejo eficiente de grandes listas.

---

## Calidad y Mantenibilidad

- Estructura modular y escalable.
- Servicios reutilizables para `storage` y `config`.
- Interfaces tipadas para `Task` y `Category`.
- `README` documentando entorno y builds.
- Commits separados por funcionalidades.

---

## Desafíos y Soluciones

### Desafíos
- Sincronización entre tareas y categorías.
- Integración de Remote Config en app híbrida.
- Compatibilidad Cordova + toolchain.

### Soluciones
- Estado centralizado con servicios.
- Inicialización temprana de Firebase.
- Versionado controlado del entorno.