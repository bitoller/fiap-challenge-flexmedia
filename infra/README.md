# Infraestrutura

Arquivos de apoio para ambiente e demonstracao.

## Status

O MVP principal roda localmente com:

- `checkin-service` em Spring Boot;
- Oracle FIAP remoto;
- `kiosk-web` em Vite;
- `api-gateway` opcional.

Docker local fica como fallback para Oracle local e evolucao de containerizacao.

## Variaveis

Configure `.env` na raiz:

```text
ORACLE_URL=jdbc:oracle:thin:@oracle.fiap.com.br:1521:ORCL
ORACLE_USER=rm552726
ORACLE_PASSWORD=<sua-senha>
JPA_DDL_AUTO=update
PMS_MODE=MOCK
PAYMENT_MODE=MOCK
BIOMETRY_MODE=MOCK
KEY_ISSUER_MODE=MOCK
```

## Docker

O compose principal sobe a demo completa:

```bash
docker compose up --build
```

Servicos:

- `checkin-service`
- `api-gateway`
- `kiosk-web`

Arquivos de apoio em:

```text
infra/docker/
```

O Oracle local ainda existe no compose como profile opcional, mas nao e o caminho principal depois da migracao para Oracle FIAP.

## Demonstracao

Recomendado:

1. Confirmar conexao Oracle FIAP.
2. Abrir Docker Desktop.
3. Rodar `docker compose up --build`.
4. Validar o fluxo no Postman.
5. Fazer a demonstracao pelo totem.
