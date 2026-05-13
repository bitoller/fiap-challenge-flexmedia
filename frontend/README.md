# Frontend

Web applications for FlexCheck Hotel.

## Applications

- `kiosk-web`: implemented. React kiosk interface.
- `admin-web`: implemented. Administrative portal separated from the kiosk.

## Stack

- React
- TypeScript
- Vite
- Simple CSS in the MVP
- API via `VITE_API_URL`

## Run the Kiosk

```bash
cd frontend/kiosk-web
npm install
npm run dev
```

Default API endpoint:

```text
http://127.0.0.1:8080/api/v1
```

With backend on another port:

```bash
VITE_API_URL=http://127.0.0.1:8081/api/v1 npm run dev
```

Through the gateway:

```bash
VITE_API_URL=http://127.0.0.1:8088/api/v1 VITE_ACTIVE_HOTEL_ID=1 npm run dev
```

Environment example:

- [frontend/kiosk-web/.env.example](./kiosk-web/.env.example)

The kiosk resolves the active hotel using `VITE_ACTIVE_HOTEL_ID` and uses the profile returned by `admin-service` for branding and hotel copy.

## Run the Admin Portal

```bash
cd frontend/admin-web
npm install
npm run dev
```

Default API endpoint:

```text
http://127.0.0.1:8088/api/v1
```

Environment example:

- [frontend/admin-web/README.md](./admin-web/README.md)

## Docker Demo

From the project root:

```bash
docker compose up --build
```

The kiosk is available at:

```text
http://127.0.0.1:3000
```

The admin portal is available at:

```text
http://127.0.0.1:3001
```

## App Folders

- [kiosk-web](kiosk-web/README.md)
- [admin-web](admin-web/README.md)
