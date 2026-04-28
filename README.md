# Finance Workspace

Monorepo Nx con una landing en Astro ubicada en apps/landing. La integración de Astro con Nx es manual: la app usa sus integraciones oficiales para React, Tailwind 4 y Vercel, y Nx solo orquesta los targets mediante project.json.

## Requisitos

- Node 22.12.0 o superior
- pnpm 10.33.2

## Instalar dependencias

```sh
pnpm install
```

## Ejecutar la landing

```sh
pnpm nx serve landing
```

## Validaciones principales

```sh
pnpm nx typecheck landing
pnpm nx build landing
pnpm nx run-many -t build typecheck
```

## Estructura relevante

- apps/landing: app Astro con React islands y Tailwind 4
- apps/landing/project.json: targets manuales de Nx
- apps/landing/astro.config.mjs: integraciones oficiales de Astro para React y Vercel, más Tailwind vía Vite

## CI

La CI usa pnpm y Node 22.12.0 para ejecutar format, build y typecheck sobre el workspace.
