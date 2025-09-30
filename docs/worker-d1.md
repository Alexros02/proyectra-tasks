## Cloudflare Worker + D1 (API de Tasks)

Esta guía documenta cómo trabajar localmente, migrar el esquema, desplegar y consumir la API basada en Cloudflare Workers con base de datos D1. Asume que el Worker y la BD D1 ya están creados en Cloudflare.

### Requisitos

- Node 18+ (Workers Runtime es compatible con Node-style tooling)
- Cuenta de Cloudflare con acceso al proyecto
- Wrangler instalado en el proyecto

```bash
npm i -D wrangler
npx wrangler login
```

### wrangler.toml (ejemplo de referencia)

Si aún no existe, crea un `wrangler.toml` similar. Ajusta los nombres reales del Worker y la BD D1.

```toml
name = "proyectra-tasks-api"
main = "cloudflare-worker/src/index.ts"
compatibility_date = "2024-09-01"

routes = []

[vars]
ALLOWED_ORIGINS = "http://localhost:3000,https://tu-dominio.com"

[[d1_databases]]
binding = "DB"
database_name = "proyectra_tasks_db"
database_id = "<ID_DE_TU_D1>"

[observability]
enabled = true
```

Notas:

- `binding = "DB"` será como accedemos a D1 en el Worker: `env.DB`.
- Usa `routes` o `workers.dev` según tu despliegue (Pages Functions, Route en dominio, etc.).

### Estructura sugerida del Worker

```
cloudflare-worker/
  src/
    index.ts        # Router + handlers + CORS
  package.json      # (opcional si separas el workspace)
```

### Scripts útiles (en package.json del repo raíz)

```json
{
  "scripts": {
    "dev:worker": "wrangler dev",
    "deploy:worker": "wrangler deploy",
    "db:migrate": "wrangler d1 migrations apply proyectra_tasks_db",
    "db:migrate:create": "wrangler d1 migrations create proyectra_tasks_db"
  }
}
```

Si tu base se llama distinto, sustituye `proyectra_tasks_db` por el nombre correcto.

### Migraciones D1

1. Crear una nueva migración (si necesitas cambios de esquema):

```bash
npm run db:migrate:create 0002_algo
```

Esto creará un archivo bajo `migrations/0002_algo.sql`. Edítalo con tu SQL.

2. Aplicar migraciones a la BD remota (o la que esté configurada en `wrangler.toml`):

```bash
npm run db:migrate
```

3. Ejecutar SQL manualmente (útil para depurar):

```bash
npx wrangler d1 execute proyectra_tasks_db --command "SELECT COUNT(*) FROM tasks;"
```

### Desarrollo local

Arranca el Worker en modo local (usa bindings mock o remotos según tu configuración):

```bash
npm run dev:worker
```

De forma predeterminada se expondrá en `http://127.0.0.1:8787`. Ajusta el `ALLOWED_ORIGINS` para permitir CORS desde `http://localhost:3000`.

### CORS (recomendado)

- Permite sólo orígenes confiables: `ALLOWED_ORIGINS="http://localhost:3000,https://tu-dominio.com"`.
- Métodos: `GET, POST, PUT, DELETE, OPTIONS`.
- Headers: `Content-Type, Authorization`.
- Responder a `OPTIONS` con 204 y los headers de CORS.

Ejemplo de headers que debería devolver el Worker:

```http
Access-Control-Allow-Origin: http://localhost:3000
Access-Control-Allow-Methods: GET,POST,PUT,DELETE,OPTIONS
Access-Control-Allow-Headers: Content-Type, Authorization
Access-Control-Allow-Credentials: true
```

### Autenticación (opcional pero recomendado)

Si usas Firebase Auth en el frontend:

- Envía `Authorization: Bearer <ID_TOKEN>` en las llamadas.
- En el Worker, valida el token (p. ej., contra `https://www.googleapis.com/identitytoolkit/v3/relyingparty/getAccountInfo` con una clave de servicio, o cacheando jwks y validando JWT). Alternativa: proteger sólo rutas de mutación y permitir lectura pública.

Para empezar rápido, puedes dejar `GET` público y exigir token en `POST/PUT/DELETE`.

### Rutas API (propuesta)

- `GET /api/health`

  - 200 `{ ok: true }`

- `GET /api/tasks?limit=20&offset=0`

  - 200 `{ data: Task[], total: number }`

- `GET /api/tasks/:id`

  - 200 `{ data: Task }` | 404

- `POST /api/tasks`

  - Body: `{ title: string, description?: string }`
  - 201 `{ data: Task }`

- `PUT /api/tasks/:id`

  - Body: `{ title?: string, description?: string, status?: 'todo'|'in_progress'|'done' }`
  - 200 `{ data: Task }`

- `DELETE /api/tasks/:id`
  - 204 sin body

`Task` ejemplo:

```json
{
  "id": "uuid",
  "title": "Nombre de la tarea",
  "description": "Texto opcional",
  "status": "todo",
  "created_at": "2024-09-01T10:00:00Z",
  "updated_at": null
}
```

### Esquema sugerido (si aún no lo tienes)

```sql
CREATE TABLE IF NOT EXISTS tasks (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  status TEXT CHECK(status IN ('todo','in_progress','done')) DEFAULT 'todo',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_tasks_status ON tasks(status);
CREATE INDEX IF NOT EXISTS idx_tasks_created_at ON tasks(created_at);
```

### Consumo desde el frontend (Next.js)

Configura `NEXT_PUBLIC_API_BASE_URL` apuntando al dominio del Worker.

```ts
const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL as string;

export const fetchTasks = async () => {
  const res = await fetch(`${API_BASE}/api/tasks`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' }
  });
  if (!res.ok) throw new Error('Error obteniendo tareas');
  return res.json();
};
```

Si usas Firebase Auth, añade el token:

```ts
const token = await user.getIdToken();
await fetch(`${API_BASE}/api/tasks`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({ title: 'Nueva tarea' })
});
```

### Despliegue

Desplegar el Worker a Cloudflare:

```bash
npm run deploy:worker
```

Verifica logs en tiempo real:

```bash
npx wrangler tail
```

### Troubleshooting

- 403/401 en mutaciones: revisa `Authorization` y validación del token.
- CORS bloqueado: confirma `ALLOWED_ORIGINS` y que `OPTIONS` responda 204 con headers correctos.
- Errores SQL: usa `wrangler d1 execute` para probar queries y validar el esquema.
- Variables no disponibles: asegúrate de definir `[vars]` en `wrangler.toml` y, si usas ambientes, replicarlas en cada uno (`[env.production.vars]`, etc.).

### Guía rápida de comandos (y cuándo usarlos)

```bash
# 1) Autenticación y verificación
npx wrangler login                 # Inicia sesión en Cloudflare (una vez por máquina)
npx wrangler --version             # Verifica instalación de wrangler

# 2) Desarrollo local
npm run dev:worker                 # Arranca el Worker con D1 local (rápido para iterar)
npx wrangler dev --remote          # Arranca el Worker usando la D1 remota

# 3) Migraciones (esquema de BD)
npm run db:migrate                 # Aplica migraciones a D1 local
npx wrangler d1 migrations apply proyectra_db --remote  # Aplica migraciones a D1 remota (dashboard)

# 4) Ejecutar SQL ad-hoc (depuración)
npx wrangler d1 execute proyectra_db --command "SELECT name FROM sqlite_master WHERE type='table';"          # Local
npx wrangler d1 execute proyectra_db --remote --command "SELECT * FROM users LIMIT 10;"                      # Remoto

# 5) Despliegue y observabilidad
npm run deploy:worker              # Desplegar el Worker
npx wrangler tail                  # Ver logs en tiempo real
```

- Usa `dev:worker` mientras desarrollas (rápido, D1 local). Si necesitas ver exactamente lo que hay en producción (tablas/datos remotos), usa `wrangler dev --remote`.
- Tras crear o editar migraciones, aplica en local con `npm run db:migrate`. Cuando quieras que aparezcan en el dashboard (D1 remota), aplica con `--remote`.
- Si la API funciona local pero no ves tablas en el dashboard, probablemente solo aplicaste migraciones localmente: ejecuta el comando con `--remote`.
- Para CORS en dev, mantén `ALLOWED_ORIGINS` con los orígenes del frontend (`http://localhost:3000`, `http://127.0.0.1:3000`).
