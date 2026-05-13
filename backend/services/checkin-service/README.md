# checkin-service

Servico principal do MVP. Orquestra o fluxo de check-in e checkout, coordenando reserva, biometria, pagamento, chave, PMS e auditoria via servicos dedicados.

## Status

Implementado.

## Arquitetura

```text
controller -> service interfaces -> service.impl -> repository interfaces -> infrastructure/repository
                                  -> domain
```

Pacotes principais:

- `controller`: endpoints REST e tratamento de erros.
- `dto`: requests e responses separados.
- `mapper`: conversao API e resultado.
- `service`: interfaces dos casos de uso.
- `service.impl`: implementacoes dos casos de uso.
- `repository`: contratos de persistencia.
- `infrastructure/repository`: adapters JDBC.
- `infrastructure/client`: contratos HTTP para os outros microservicos.
- `domain`: entidades de dominio, politicas e excecoes.

## Banco

Oracle FIAP por padrao. O `application.yml` importa o `.env` da raiz.

```text
ORACLE_URL=jdbc:oracle:thin:@oracle.fiap.com.br:1521:ORCL
ORACLE_USER=rm553134
ORACLE_PASSWORD=060892
```

As tabelas `FC_*` sao criadas via `database/oracle/schema.sql` e populadas por `database/oracle/seed.sql`.

## Endpoints

- `GET /api/v1/health`
- `POST /api/v1/checkin-sessions`
- `POST /api/v1/checkin-sessions/{sessionId}/reservation`
- `POST /api/v1/checkin-sessions/{sessionId}/guest-confirmation`
- `POST /api/v1/checkin-sessions/{sessionId}/consents`
- `POST /api/v1/checkin-sessions/{sessionId}/complete-checkin`
- `POST /api/v1/stays/lookup`
- `POST /api/v1/stays/{stayId}/checkout`

## Servicos Integrados

- `reservation-service`
- `biometry-service`
- `payment-service`
- `key-service`
- `pms-adapter-service`
- `admin-service`
## Como Rodar

```bash
cd backend/services/checkin-service
mvn spring-boot:run
```

Porta alternativa:

```bash
SERVER_PORT=8081 mvn spring-boot:run
```

Health:

```bash
curl http://127.0.0.1:8080/api/v1/health
```

## Docker

Na raiz do projeto:

```bash
docker compose up --build checkin-service
```

Para a demo completa:

```bash
docker compose up --build
```

## Testes

```bash
mvn test
```

Os testes usam profile `h2` em `src/test/resources` para nao gravar dados no Oracle real.

## Postman

Use a collection:

```text
docs/postman/FlexCheck-Hotel.postman_collection.json
```

Variavel `baseUrl` padrao:

```text
http://127.0.0.1:8080/api/v1
```

## Dados de Demo

- Reserva: `RSV-2026-0001`
- Documento: `12345678909`
- Cartao aprovado: `TEST_CARD_APPROVED`
- Cartao recusado: `TEST_CARD_DECLINED`
