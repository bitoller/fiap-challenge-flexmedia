# Docker e Ambientes

## 1. Decisao

Docker sera usado desde o inicio, mas com escopo controlado.

Para o MVP, o uso principal e padronizar o Oracle SQL e os dados de demonstracao. Isso reduz diferencas entre as maquinas do grupo e torna a apresentacao mais previsivel.

## 2. Estrategia Recomendada

### MVP

```text
Docker:
  Oracle SQL

Local:
  Backend Java Spring Boot
  Frontend React
```

Essa abordagem e a mais segura para comecar, porque evita perder tempo com empacotamento de servicos antes do fluxo estar pronto.

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

### Arquitetura final

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
  pms-adapter-service
  notification-service
  kiosk-web
  admin-web
  oracle-db
```

## 3. Por que nao containerizar tudo agora

Containerizar tudo antes de existir codigo aumenta trabalho com portas, redes, build, variaveis, CORS e troubleshooting. Para o desafio, isso pode roubar energia do que mais pontua: MVP funcional.

A melhor leitura arquitetural e:

- Estrutura completa desenhada.
- Docker presente desde o inicio.
- Implementacao incremental.
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
- usuario da aplicacao.
- URL JDBC.
- modos mockados de PMS, pagamento, biometria e chave.

## 6. Banco Oracle em Docker

O container usa a imagem oficial do Oracle Database Free:

```text
container-registry.oracle.com/database/free:latest-lite
```

Ao subir pela primeira vez com volume vazio, os scripts em `database/oracle/init` sao montados em `/opt/oracle/scripts/setup`, criam o usuario `rm553134`, executam o schema e carregam os dados de teste.

## 7. Risco e Plano B

Oracle em container pode ser pesado, especialmente em maquinas com pouca memoria. O plano B e usar o Oracle disponibilizado pela faculdade: o backend cria as tabelas via JPA/Hibernate e o `seed.sql` carrega os dados de demonstracao. Os scripts completos continuam como alternativa para reset controlado.

## 8. Como explicar na banca

Resposta sugerida:

"Usamos Docker para padronizar o ambiente de desenvolvimento e demonstracao. No MVP, o Oracle roda containerizado com carga automatica de schema e dados. A arquitetura ja possui templates para containerizar os servicos Java e os frontends React, mas priorizamos entregar o fluxo funcional antes de transformar todos os componentes em containers."
