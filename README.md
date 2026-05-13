# FlexCheck Hotel

Plataforma do desafio FIAP com a Flexmedia. O backend foi organizado em microservicos com foco em clean code, clean architecture e separacao clara de responsabilidades.

## O que esta pronto

- `checkin-service`: orquestra o fluxo principal do totem
- `api-gateway`: entrada unica para `/api/v1/**`
- `reservation-service`: busca e confirmacao de reservas
- `payment-service`: transacoes de pagamento
- `key-service`: emissao e revogacao de chaves
- `admin-service`: dashboard, auditoria, branding e conteudo do hotel
- `device-service`: status e heartbeat dos totens
- `identity-service`: autenticacao, usuarios e credenciais tecnicas
- `notification-service`: comprovantes e alertas
- `biometry-service`: contrato de biometria para evolucao futura
- `pms-adapter-service`: contrato de PMS para evolucao futura
- `kiosk-web`: frontend do totem

## Como subir tudo com Docker

### 1. Configurar o ambiente

Na raiz do projeto:

```bash
Copy-Item .env.demo.example .env
```

O arquivo de exemplo ja vem com:

- `ORACLE_USER=rm553134`
- `ORACLE_PASSWORD=060892`

Se voce for usar o Oracle fisico da FIAP, confirme que esse schema foi criado antes de subir a stack.

### 2. Subir a stack completa

```bash
docker compose up -d --build
```

Isso sobe:

- `checkin-service`
- `api-gateway`
- `reservation-service`
- `payment-service`
- `key-service`
- `admin-service`
- `device-service`
- `identity-service`
- `notification-service`
- `biometry-service`
- `pms-adapter-service`
- `kiosk-web`

### 3. Parar tudo

```bash
docker compose down
```

## Como subir partes especificas

### Somente o totem e a API principal

```bash
docker compose up -d --build checkin-service api-gateway kiosk-web
```

### Somente os servicos de apoio

```bash
docker compose up -d --build reservation-service payment-service key-service admin-service device-service identity-service notification-service
```

### Somente os contratos de integracao futuros

```bash
docker compose up -d --build biometry-service pms-adapter-service
```

## Rodar local sem Docker

### Backend principal

```bash
cd backend/services/checkin-service
mvn spring-boot:run
```

### Gateway

```bash
cd backend/services/api-gateway
mvn spring-boot:run
```

### Servicos novos

```bash
cd backend/services/identity-service
mvn spring-boot:run

cd backend/services/notification-service
mvn spring-boot:run
```

## Documentacao por servico

- [Backend services](backend/services/README.md)
- [identity-service](backend/services/identity-service/README.md)
- [notification-service](backend/services/notification-service/README.md)

## Banco Oracle

O projeto usa o schema `rm553134` no Oracle da FIAP e scripts de inicializacao versionados em `database/oracle/`.

Se precisar recriar o schema fisico, rode os scripts da pasta:

- `database/oracle/init/01_create_user.sql`
- `database/oracle/init/02_run_schema.sql`
- `database/oracle/init/03_run_seed.sql`

## Fluxo principal

1. abrir sessao no totem
2. buscar e associar reserva
3. confirmar hospede e consentimentos
4. concluir check-in
5. emitir chave
6. fazer check-out
7. registrar comprovantes e alertas

## Observacoes de arquitetura

- `checkin-service` continua como orquestrador do fluxo.
- `identity-service` e `notification-service` usam armazenamento em memoria no MVP.
- `biometry-service` e `pms-adapter-service` foram preservados como contratos para integracao real futura.
- O `admin-service` concentra operacoes de hotel, incluindo branding e conteudo.
