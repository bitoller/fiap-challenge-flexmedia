# FlexCheck Hotel

MVP para o Challenge FIAP com a Flexmedia. O projeto simula um totem de autoatendimento para hotel, com fluxo de check-in, consentimentos LGPD, pagamento simulado, emissao de chave, checkout, dashboard e rastreabilidade operacional.

## Status

Implementado:

- `checkin-service`: API principal do MVP em Spring Boot.
- `api-gateway`: proxy simples para entrada unica em `/api/v1/**`.
- `reservation-service`: busca e confirmacao de reserva.
- `payment-service`: gravacao de transacoes de pagamento.
- `key-service`: emissao e revogacao de chaves.
- `admin-service`: dashboard e auditoria operacional.
- `kiosk-web`: frontend React do totem.
- Oracle FIAP como banco principal, com tabelas criadas por JPA/Hibernate.
- Collection Postman para validar o fluxo completo.

Planejado/documentado:

- `identity-service`
- `biometry-service`
- `notification-service`
- `device-service`
- `pms-adapter-service`
- `admin-web`

## Estrutura

```text
.
├── backend/
│   └── services/
│       ├── api-gateway/
│       ├── checkin-service/
│       └── demais microservicos planejados
├── database/
│   └── oracle/
├── docs/
│   ├── postman/
│   └── diagramas/
├── frontend/
│   ├── kiosk-web/
│   └── admin-web/
├── infra/
│   └── docker/
├── .env.example
└── docker-compose.yml
```

## Rodar pelo Docker

Este e o fluxo recomendado para a demo e para padronizar a equipe. Ele sobe:

- `checkin-service`
- `api-gateway`
- `reservation-service`
- `payment-service`
- `key-service`
- `admin-service`
- `kiosk-web`

O banco usado e o Oracle FIAP remoto configurado no `.env`.

### 1. Abrir o Docker

No macOS, abra o Docker Desktop e confirme que o daemon esta ativo:

```bash
open -a Docker
docker info
```

Se `docker info` reclamar de `docker.sock` ou daemon indisponivel, o Docker Desktop ainda nao terminou de iniciar.

### 2. Configurar ambiente

Na raiz do projeto:

```bash
cp .env.demo.example .env
```

Edite `.env` e preencha:

```text
ORACLE_PASSWORD=060892
```

As portas padrao da demo sao:

```text
CHECKIN_PORT=8081
GATEWAY_PORT=8088
KIOSK_PORT=3000
```

### 3. Subir tudo

```bash
docker compose up --build
```

URLs:

- Totem: `http://127.0.0.1:3000`
- Gateway: `http://127.0.0.1:8088/gateway/health`
- API direta: `http://127.0.0.1:8081/api/v1/health`

### 4. Parar

```bash
docker compose down
```

### Porta ocupada

Se alguma porta estiver em uso, altere no `.env`. Exemplo:

```text
CHECKIN_PORT=8082
GATEWAY_PORT=8089
KIOSK_PORT=3001
```

Depois rode novamente:

```bash
docker compose down
docker compose up --build
```

Guia completo: [Demo Docker](docs/DEMO_DOCKER.md).

## Banco

O backend usa Oracle FIAP por padrao:

```text
ORACLE_URL=jdbc:oracle:thin:@oracle.fiap.com.br:1521:ORCL
ORACLE_USER=rm553134
JPA_DDL_AUTO=update
```

O Hibernate cria/atualiza as tabelas `FC_*` a partir das entidades JPA quando o `checkin-service` inicia.

## Rodar sem Docker

Use apenas como fallback de desenvolvimento.

Backend:

```bash
cd backend/services/checkin-service
mvn spring-boot:run
```

Frontend:

```bash
cd frontend/kiosk-web
npm install
VITE_API_URL=http://127.0.0.1:8080/api/v1 npm run dev
```

## URLs

- Checkin API: `http://127.0.0.1:8081/api/v1/health`
- Gateway: `http://127.0.0.1:8088/gateway/health`
- Totem Docker: `http://127.0.0.1:3000`
- Totem local Vite: `http://127.0.0.1:5173`

## Postman

Importe:

```text
docs/postman/FlexCheck-Hotel.postman_collection.json
```

A collection cobre health checks, busca de reserva, criacao de sessao, associacao de reserva, confirmacao de hospede, consentimentos, check-in, checkout e dashboard.

## Dados de Demo

- Reserva: `RSV-2026-0001`
- Documento: `12345678909`
- Pagamento aprovado: `TEST_CARD_APPROVED`
- Pagamento recusado: `TEST_CARD_DECLINED`

## Documentacao

- [Backend](backend/README.md)
- [Frontend](frontend/README.md)
- [Banco Oracle](database/README.md)
- [Infraestrutura](infra/README.md)
- [Documentos do projeto](docs/README.md)
- [Demo Docker](docs/DEMO_DOCKER.md)
- [Postman](docs/postman/README.md)
