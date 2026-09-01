# Serviprox

Marketplace de servicios para el hogar. El cliente llega por dos caminos —**ya sé qué
necesito** o **no estoy seguro**— y en ambos termina viendo profesionales verificados
ordenados por cercanía.

La regla central del producto: **el sistema sugiere, el cliente decide**. La sugerencia
del diagnóstico nunca reemplaza la elección; ambas se guardan por separado
(`suggested_category` vs `selected_category`) para poder medir cuánto acierta el motor.

## Arquitectura

| Capa | Stack |
| --- | --- |
| Backend | Django 5 + Django REST Framework + JWT, PostgreSQL |
| Frontend | React 18 + TypeScript + Vite + Zustand |
| Infraestructura | Docker Compose (db + backend + frontend) |

```
backend/apps/
  accounts/          Usuario único (cliente / profesional) y autenticación
  households/        Direcciones del cliente; origen del radio de búsqueda
  catalog/           Categorías y servicios con sus rangos de tarifa
  diagnosis/         Preguntas, respuestas y motor de sugerencia
  professionals/     Perfiles, cobertura, agenda, portafolio y distancia
  service_requests/  Solicitud del cliente y candidatos por cercanía
  orders/            Visita agendada, bitácora de estados y calificación
```

## Puesta en marcha con Docker

```bash
cp .env.example .env
docker compose up --build
```

- App: <http://localhost:5173>
- API: <http://localhost:8000/api/v1/>
- Documentación (Swagger): <http://localhost:8000/api/docs/>
- Admin: <http://localhost:8000/admin/>

El servicio `backend` corre migraciones y `seed_demo.py` en cada arranque, así que la app
queda con datos navegables de inmediato.

Si alguno de esos puertos ya está ocupado en tu máquina, cámbialo en el `.env`
(`BACKEND_PORT`, `FRONTEND_PORT`, `POSTGRES_PORT_HOST`) sin tocar el `docker-compose.yml`.

## Puesta en marcha sin Docker

El `.env` viene con Postgres comentado, así que el backend cae a SQLite y no necesitas
base de datos aparte. Las credenciales de Postgres las inyecta el `docker-compose.yml`
al contenedor: si las descomentas en el `.env`, recuerda que `POSTGRES_HOST=db` solo
resuelve dentro de Docker y un arranque local necesitaría `localhost`.

```bash
cd backend
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
python manage.py migrate
python seed_demo.py
python manage.py runserver
```

```bash
cd frontend
npm install
npm run dev
```

## Datos de demostración

`seed_demo.py` reproduce el escenario del prototipo: Kennedy (Bogotá) como hogar, ocho
categorías y tres profesionales a 0.8 km, 1.4 km y 2.6 km. Es idempotente; `--reset`
borra los datos demo antes de recrearlos.

| Rol | Correo | Contraseña |
| --- | --- | --- |
| Cliente | `camila@demo.serviprox.co` | `serviprox2026` |
| Profesional | `andres.ruiz@demo.serviprox.co` | `serviprox2026` |

El frontend inicia sesión con el cliente demo automáticamente
(`VITE_DEMO_EMAIL` / `VITE_DEMO_PASSWORD`). Sustituye ese arranque por una pantalla de
login real antes de exponer el proyecto a usuarios.

## Los dos flujos

**Ya sé qué necesito** → grilla de categorías → confirmación → mapa.

**No estoy seguro** → texto libre + preguntas guiadas → `POST /diagnosis/sessions/`.
El motor (`apps/diagnosis/engine.py`) puntúa cada categoría con reglas explícitas:
palabras clave del texto libre (peso 2) más los pesos que cada opción declara en
`DiagnosticOption.weights`. Devuelve la categoría ganadora, su confianza y el ranking
completo, para que la recomendación sea auditable en vez de una caja negra.

La sesión se marca `confirmed` o `discarded` según el cliente acepte la sugerencia o
elija otra categoría.

## Búsqueda por cercanía

Sin PostGIS: `apps/professionals/geo.py` expresa la fórmula de haversine en SQL
(variante con `asin`, estable numéricamente y compatible con PostgreSQL y SQLite), anota
`distance_km` y filtra tanto por el radio que eligió el cliente como por la cobertura
declarada del profesional. Al ser una anotación de base de datos, el listado sigue siendo
ordenable y paginable.

```
GET /api/v1/professionals/?lat=4.628&lng=-74.15&radius_km=5&category=impermeabilizacion
```

## Endpoints principales

| Método | Ruta | Descripción |
| --- | --- | --- |
| `POST` | `/auth/token/` | Obtiene el par de tokens JWT |
| `POST` | `/auth/register/` | Registro de cliente o profesional |
| `GET` | `/categories/` | Categorías con conteo de profesionales |
| `GET` | `/diagnosis/questions/` | Preguntas activas con sus opciones |
| `POST` | `/diagnosis/sessions/` | Crea el diagnóstico y devuelve la sugerencia |
| `GET` | `/professionals/` | Búsqueda con `lat`, `lng`, `radius_km`, `category` |
| `POST` | `/requests/` | Solicitud; guarda sugerido y confirmado, y arma candidatos |
| `POST` | `/orders/` | Agenda la visita con un profesional |
| `POST` | `/orders/{id}/transition/` | Cambia el estado según transiciones válidas |
| `POST` | `/reviews/` | Califica una orden completada |

## Sistema visual

Los tokens del prototipo viven en `frontend/src/theme/tokens.css`. Azul profundo como
base de confianza, rojo como acento de acción, y superficies translúcidas al estilo
visionOS. El color codifica el estado del servicio en toda la app:

- **Azul** — sugerido por el sistema, no vinculante.
- **Rojo** — confirmado por el cliente.

## Pendientes conocidos

- Pantalla de login/registro real (hoy el frontend usa el usuario demo).
- Mapa esquemático propio; sustituirlo por un motor de mapas real (MapLibre) al integrar
  direcciones verificadas.
- Notificaciones y chat cliente–profesional.
- Pasarela de pagos sobre `orders.final_price`.
