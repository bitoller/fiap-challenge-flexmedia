# Demo Docker

Guia padronizado para subir a demo completa do FlexCheck Hotel.

## Pre-requisitos

- Docker Desktop instalado e aberto.
- `.env` configurado na raiz com acesso ao Oracle FIAP.
- Internet ativa para baixar imagens e dependencias no primeiro build.

Verifique o Docker:

```bash
docker info
```

Se aparecer erro de `docker.sock`, abra o Docker Desktop e espere finalizar a inicializacao.

## Configurar Ambiente

Na raiz do projeto:

```bash
cp .env.demo.example .env
```

Preencha:

```text
ORACLE_PASSWORD=060892
```

## Subir Tudo

```bash
docker compose up --build
```

Servicos iniciados:

- `checkin-service`
- `api-gateway`
- `kiosk-web`

## URLs

- Totem: `http://127.0.0.1:3000`
- Gateway health: `http://127.0.0.1:8088/gateway/health`
- API health: `http://127.0.0.1:8081/api/v1/health`

## Parar

```bash
docker compose down
```

## Porta 8080 Ocupada

A demo publica o `checkin-service` em `8081` por padrao para evitar conflito com processos locais. Dentro do Docker, o servico continua em `8080`.

Se precisar trocar:

```text
CHECKIN_PORT=8082
```

Depois:

```bash
docker compose down
docker compose up --build
```

## Rebuild Limpo

```bash
docker compose down
docker compose build --no-cache
docker compose up
```

## Oracle Local Opcional

O Oracle local nao sobe por padrao. Ele fica em profile separado:

```bash
docker compose --profile oracle-local up -d oracle-db
```

Para a demo principal, prefira Oracle FIAP remoto.

## Fallback Sem Docker

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
