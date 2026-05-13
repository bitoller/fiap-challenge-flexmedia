# Backend

Backend Java/Spring do FlexCheck Hotel.

## Servicos

Implementados:

- `checkin-service`: orquestra check-in e checkout, coordenando os demais servicos.
- `api-gateway`: proxy HTTP para centralizar entrada em `/api/v1/**`.
- `reservation-service`: busca e confirmacao de reserva.
- `payment-service`: gravacao de transacoes de pagamento.
- `key-service`: emissao e revogacao de chaves.
- `admin-service`: dashboard e auditoria operacional.

Planejados:

- `identity-service`: usuarios, tokens e perfis.
- `reservation-service`: reservas, hospedes, quartos e elegibilidade.
- `payment-service`: pre-autorizacao e captura.
- `key-service`: emissao e revogacao de chaves.
- `biometry-service`: validacao facial opcional.
- `notification-service`: comprovantes e mensagens operacionais.
- `device-service`: totens, heartbeat e eventos de hardware.
- `pms-adapter-service`: integracao com PMS.

## Como Rodar

API principal:

```bash
cd backend/services/checkin-service
mvn spring-boot:run
```

Gateway:

```bash
cd backend/services/api-gateway
mvn spring-boot:run
```

Se a porta `8080` estiver ocupada:

```bash
cd backend/services/checkin-service
SERVER_PORT=8081 mvn spring-boot:run
```

## Demo com Docker

Na raiz do projeto:

```bash
cp .env.demo.example .env
docker compose up --build
```

Servicos expostos:

- `checkin-service`: `http://127.0.0.1:8081/api/v1`
- `reservation-service`: `http://127.0.0.1:8082/api/v1`
- `payment-service`: `http://127.0.0.1:8083/api/v1`
- `key-service`: `http://127.0.0.1:8084/api/v1`
- `admin-service`: `http://127.0.0.1:8085/api/v1`
- `api-gateway`: `http://127.0.0.1:8088`
- `kiosk-web`: `http://127.0.0.1:3000`

## Banco

O `checkin-service` usa Oracle FIAP e importa o `.env` da raiz do projeto.

Variaveis principais:

```text
ORACLE_URL=jdbc:oracle:thin:@oracle.fiap.com.br:1521:ORCL
ORACLE_USER=rm553134
ORACLE_PASSWORD=060892
JPA_DDL_AUTO=update
```

## Padrao Java

Para os servicos implementados:

```text
controller/api -> service -> domain
repository interfaces <- infrastructure adapters
```

Convencoes:

- DTOs separados por request/response.
- Controllers finos.
- Services por interface.
- Entidades JPA nao expostas na API.
- Erro padronizado com `code`, `message`, `details` e `correlationId`.
- `X-Correlation-Id` propagado nas chamadas.

## Testes

```bash
cd backend/services/checkin-service
mvn test
```

Os testes usam H2 apenas no escopo de teste para nao alterar o Oracle real.
