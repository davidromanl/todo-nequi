# Proyecto Ionic + Angular + Cordova

Aplicación móvil híbrida creada con Ionic Angular usando Apache Cordova como runtime nativo.

Este proyecto está configurado para compilar Android sin Capacitor y con versiones compatibles.

## Requisitos del Sistema

Instalar en el sistema:

- **Node.js**: Versión LTS recomendada (18 o 20)
- **Ionic CLI y Cordova**: `npm install -g @ionic/cli cordova`
- **Java JDK**: Versión requerida (JDK 17)
- **Android SDK**: Platform 35

## Instalación del Proyecto

```bash
npm install
```

## Integración con Cordova

Habilitar la integración y añadir las plataformas necesarias:

```bash
ionic integrations enable cordova
ionic cordova platform add android@12
ionic cordova platform add ios
```

## Ejecución en Dispositivos

Ejecutar en dispositivo Android y iOS:

```bash
ionic cordova run android --device
ionic cordova run ios --device
```

## Estructura del Proyecto

```text
src/app/
├── core/           → servicios (storage, firebase, config)
├── shared/         → componentes reutilizables
├── pages/
│   ├── tasks/
│   └── categories/
└── models/
```