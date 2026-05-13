# Database

Arquivos de banco do FlexCheck Hotel.

## Banco Principal

Oracle FIAP remoto:

```text
jdbc:oracle:thin:@oracle.fiap.com.br:1521:ORCL
```

O caminho principal do MVP e deixar o `checkin-service` criar/atualizar as tabelas via JPA/Hibernate com:

```text
JPA_DDL_AUTO=update
```

## Pastas

- `oracle/`: scripts SQL, seed, reset e verificacao.

## Quando Usar Scripts SQL

Use os scripts de `database/oracle` quando precisar:

- recriar as tabelas manualmente;
- popular dados de demonstracao;
- verificar contagens;
- apresentar o modelo relacional.

Para o fluxo normal de desenvolvimento, rode o backend e deixe o Hibernate atualizar o schema.
