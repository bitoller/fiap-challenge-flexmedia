# Docker e Environments

## 1. Decisao

Docker sera usado desde o inicio, mas com escopo controlado.

Para o MVP, o uso principal e padronizar o Oracle SQL e os Data de Demo. Isso reduz diferencas entre as maquinas do grupo e torna a apresentacao mais previsivel.

## 2. Estrategia Recomendada

### MVP

```text
Docker:
  Oracle SQL

Local:
  Backend Java Spring Boot
  Frontend React
```

Essa abordagem e a mais segura para comecar, porque evita perder tempo com empacotamento de services antes do Flow estar pronto.

### Depois do MVP

```text
Docker:
  Oracle SQL
  checkin-service
  reservation-service
  mock-integration-service
  kiosk-web
  admin-web
```

### Architecture final

```text
Docker Compose:
  api-gateway
  identity-service
  reservation-service
  checkin-service
  payment-service
  key-service
  biometry-service
  device-service
  PMS-adapter-service
  notification-service
  kiosk-web
  admin-web
  oracle-db
```

## 3. Por que nao containerizar tudo agora

Containerizar tudo antes de existir code aumenta trabalho com portas, redes, build, variaveis, CORS e troubleshooting. Para o desafio, isso pode roubar energia do que mais pontua: MVP funcional.

A better leitura architectural e:

- Estrutura completa desenhada.
- Docker presente desde o inicio.
- Implementation incremental.
- Demo estavel.

## 4. Compose Inicial

O arquivo `docker-compose.yml` sobe:

- `oracle-db`
- volume persistente `oracle-data`
- rede `flexcheck-net`
- scripts de inicializacao do banco

## 5. Variaveis

O arquivo `.env.example` documenta:

- imagem Oracle.
- senha administrativa local.
- User da aplicacao.
- URL JDBC.
- modos mockados de PMS, Payment, Biometry e Key.

## 6. Banco Oracle em Docker

O container usa a imagem oficial do Oracle Database Free:

```text
container-registry.oracle.com/database/free:latest-lite
```

Ao subir pela primeira vez com volume vazio, os scripts em `database/oracle/init` sao montados em `/opt/oracle/scripts/setup`, criam o User `rm553134`, executam o schema e carregam os Data de test.

## 7. Risco e Plano B

Oracle em container pode ser pesado, especialmente em maquinas com pouca memoria. O plano B e usar o Oracle disponibilizado pela faculdade: o backend cria as tables via JPA/Hibernate e o `seed.sql` carrega os Data de Demo. Os scripts completos continuam como alternativa para reset controlado.

## 8. Como explicar na banca

Resposta sugerida:

"Usamos Docker para padronizar o ambiente de development e Demo. No MVP, o Oracle roda containerizado com carga automatica de schema e Data. A Architecture ja possui templates para containerizar os services Java e os frontends React, mas priorizamos Deliveryr o Flow funcional antes de transformar todos os componentes em containers."
