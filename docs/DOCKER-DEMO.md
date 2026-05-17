# Docker Demo

Standard guide for running the complete FlexCheck Hotel demo.

## Prerequisites

- Docker Desktop installed and running.
- `.env` configured in the project root with Oracle FIAP access.
- Active internet connection for downloading images and dependencies during the first build.

Check Docker:

```bash
docker info
```

If a `docker.sock` error appears, open Docker Desktop and wait until initialization completes.

## Configure The Environment

From the project root:

```bash
cp .env.demo.example .env
```

Fill in:

```text
ORACLE_URL=jdbc:oracle:thin:@oracle.fiap.com.br:1521:ORCL
ORACLE_USER=your_oracle_user
ORACLE_PASSWORD=your_oracle_password
ADMIN_USERNAME=admin@example.local
ADMIN_PASSWORD=change_me_admin_password
```

## Start The Stack

```bash
docker compose up --build
```

Started services:

- `checkin-service`
- `api-gateway`
- `kiosk-web`

## URLs

- Kiosk: `http://127.0.0.1:3000`
- Gateway health: `http://127.0.0.1:8088/gateway/health`
- API health: `http://127.0.0.1:8081/api/v1/health`

## Stop

```bash
docker compose down
```

## Port 8080 Already In Use

The demo publishes `checkin-service` on `8081` by default to avoid conflicts with local processes. Inside Docker, the service still listens on `8080`.

To change the published port:

```text
CHECKIN_PORT=8082
```

Then run:

```bash
docker compose down
docker compose up --build
```

## Clean Rebuild

```bash
docker compose down
docker compose build --no-cache
docker compose up
```

## Optional Local Oracle

The local Oracle container does not start by default. It remains under a separate profile:

```bash
docker compose --profile oracle-local up -d oracle-db
```

For the main demo, prefer the remote Oracle FIAP instance.

## Fallback Without Docker

Backend:

```bash
cd backend/services/checkin-service
mvn spring-boot:run
```

Frontend:

```bash
cd frontend/kiosk-web
npm run dev
```
