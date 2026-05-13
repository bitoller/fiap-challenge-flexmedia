# Oracle

Scripts Oracle do FlexCheck Hotel.

## Status

Mantidos como apoio ao banco FIAP. O backend tambem possui entidades JPA com `@Table`, usadas para criar/atualizar as tabelas automaticamente.

## Arquivos

- `schema.sql`: cria tabelas, constraints e indices.
- `seed.sql`: carrega dados de demonstracao.
- `reset.sql`: remove tabelas `FC_*` do schema conectado.
- `setup_fiap.sql`: executa reset, schema, seed e verificacao.
- `verify.sql`: mostra contagens e reservas carregadas.
- `init/`: scripts para Oracle local via Docker, mantidos como fallback.

## Conexao FIAP

```text
Host: oracle.fiap.com.br
Porta: 1521
SID: ORCL
JDBC: jdbc:oracle:thin:@oracle.fiap.com.br:1521:ORCL
```

## Criar Tabelas pelo Backend

1. Configure `.env` na raiz.
2. Mantenha `JPA_DDL_AUTO=update`.
3. Rode:

```bash
cd backend/services/checkin-service
mvn spring-boot:run
```

O Hibernate cria/atualiza as tabelas `FC_*`.

## Popular Dados de Demo

Execute `seed.sql` pela IDE conectada no Oracle FIAP.

Dados esperados:

- `RSV-2026-0001`
- `RSV-2026-0002`

## Reset Manual

Se precisar recriar tudo pela IDE, execute:

```text
setup_fiap.sql
```

Esse script roda reset, schema, seed e verificacao.

## Cuidado

`reset.sql` apaga tabelas `FC_*` do usuario conectado. Use apenas no schema do projeto.
