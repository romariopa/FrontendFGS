# Simulador del Ahorro Digital

Una aplicación web moderna para la simulación de productos financieros y onboarding digital, construida con Next.js 14, TypeScript y Tailwind CSS.

## 🏆 Resumen del Proyecto y Logros Técnicos

Este proyecto ha sido desarrollado siguiendo los más altos estándares de calidad de software, logrando una solución robusta, mantenible y escalable:

-   **Cobertura de Pruebas al 100%:** Se ha implementado una suite de pruebas exhaustiva utilizando Jest y React Testing Library, garantizando que cada componente, hook, servicio y utilidad funcione correctamente bajo diversos escenarios.
-   **Internacionalización (i18n):** Soporte completo multi-idioma (Español e Inglés) con gestión centralizada de textos y detección dinámica del contexto.
-   **Clean Architecture:** Separación estricta de responsabilidades entre la interfaz de usuario (UI), la lógica de negocio y los servicios externos.
-   **Componentes Modulares:** Diseño atómico y reutilizable que facilita el mantenimiento y asegura consistencia visual.
-   **Validaciones Robustas:** Manejo proactivo de errores y validaciones en tiempo real para ofrecer una experiencia de usuario fluida y segura.

## 🚀 Cómo ejecutar el proyecto

1.  **Instalar dependencias:**
    ```bash
    npm install
    ```

2.  **Iniciar servidor de desarrollo:**
    ```bash
    npm run dev
    ```

3.  **Abrir en el navegador:**
    Visita [http://localhost:3000](http://localhost:3000)

## 🏗 Arquitectura

El proyecto sigue principios de **Clean Architecture** y modularidad para garantizar escalabilidad y mantenibilidad:

-   **`src/app`**: Rutas y páginas (App Router). Separación clara entre Server Components y Client Components.
-   **`src/components`**: Componentes de UI reutilizables y atómicos (Button, Input, Card).
-   **`src/services`**: Capa de acceso a datos y lógica de negocio externa (API mocks).
-   **`src/hooks`**: Lógica de estado y efectos encapsulada (Custom Hooks).
-   **`src/utils`**: Funciones puras y helpers.
-   **`src/types`**: Definiciones de tipos TypeScript compartidas.

## 🌐 Por qué Server-Side Rendering (SSR)?

El proyecto utiliza **Next.js** para aprovechar el **Server-Side Rendering (SSR)** y los **Server Components**, una decisión técnica clave para aplicaciones financieras modernas:

1.  **SEO (Search Engine Optimization):**
    Al renderizar el HTML en el servidor, los motores de búsqueda pueden indexar el contenido inmediatamente. Esto es crucial para que los productos de ahorro sean descubiertos orgánicamente por los usuarios.

2.  **Rendimiento y Core Web Vitals:**
    SSR mejora significativamente el *First Contentful Paint (FCP)*. El usuario recibe una página completamente construida desde el servidor, eliminando la espera de carga y ejecución de JavaScript masivo en el cliente.

3.  **Seguridad:**
    La lógica de negocio sensible y las claves de API privadas se mantienen en el servidor, reduciendo la superficie de ataque y protegiendo la integridad de los datos financieros.

4.  **Experiencia en Dispositivos Móviles:**
    Al descargar el procesamiento pesado al servidor, la aplicación mantiene un rendimiento fluido incluso en dispositivos con recursos limitados o conexiones inestables.

## ⚡ Estrategia de Renderizado (ISR)

Para la sección de **Productos (`/products`)**, hemos implementado **Incremental Static Regeneration (ISR)**.

### ¿Por qué ISR?
-   **Rendimiento:** La página se sirve estáticamente (HTML pre-generado), lo que garantiza tiempos de carga casi instantáneos (TTFB bajo).
-   **SEO:** El contenido está disponible para los motores de búsqueda sin necesidad de ejecución de JS en el cliente.
-   **Datos Frescos:** A diferencia de SSG puro, definimos un `revalidate = 60`. Esto significa que Next.js regenerará la página en segundo plano si ha pasado más de 1 minuto desde la última solicitud, asegurando que la información de los productos (tasas, descripciones) se mantenga actualizada sin reconstruir todo el sitio.

## 💰 Fórmula del Simulador

El simulador utiliza la fórmula de valor futuro para una serie de pagos con interés compuesto (anualidad vencida):

**Fórmula:**
$$ VF = P(1+r)^n + PMT \times \frac{(1+r)^n - 1}{r} $$

Donde:
-   **$VF$**: Valor Futuro (Saldo Final).
-   **$P$**: Monto Inicial (Capital).
-   **$PMT$**: Aporte Mensual.
-   **$n$**: Número de meses (Plazo).
-   **$r$**: Tasa de interés mensual efectiva.

*Nota: La tasa anual (E.A.) del 6% se convierte a mensual efectiva antes del cálculo.*

## 🛡️ Seguridad y Validaciones

-   **Onboarding:** Implementación de un mecanismo de validación de token simulado ("No soy un robot") para prevenir envíos automatizados.
-   **Tipado Estricto:** TypeScript se utiliza en todo el proyecto para prevenir errores en tiempo de ejecución.
-   **Validación de Formularios:** Feedback visual inmediato y estados de error controlados.

---

Desarrollado con ❤️ pensando en la mejor experiencia bancaria digital.
