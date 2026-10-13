# Despliegue del frontend en Render

Crear un **Static Site** desde este repositorio.

- **Root Directory:** `Proyecto Bomberos` si el repositorio contiene también el backend.
- **Build Command:** `pnpm install --frozen-lockfile && pnpm run build`
- **Publish Directory:** `dist`
- **Variable:** `VITE_API_URL=https://backbomberos.onrender.com/api`

El rewrite de `render.yaml` permite que las rutas de React funcionen al recargar la página.

Si Render utiliza este proyecto como raíz del repositorio, no es necesario indicar `Proyecto Bomberos` como directorio raíz.
