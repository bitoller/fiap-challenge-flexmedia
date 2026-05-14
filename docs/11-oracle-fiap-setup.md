# Setup do Oracle FIAP

## 1. Data da conexao

Pelo print da IDE, a conexao Oracle da FIAP usa:

```text
Host: oracle.fiap.com.br
Porta: 1521
SID: ORCL
User: rm553134
URL JDBC: jdbc:oracle:thin:@oracle.fiap.com.br:1521:ORCL
```

A senha deve ficar somente no ambiente local de cada integrante.

## 2. Onde colocar a senha

Nao coloque a senha no code, no README, no Git ou no grupo da equipe se o repositorio for compartilhado.

Crie um arquivo local `.env` na raiz do Project a partir do exemplo:

```bash
cp .env.example .env
```

Depois edite:

```text
ORACLE_PASSWORD=sua-senha-real
```

O arquivo `.env` ja esta no `.gitignore`, entao nao deve ser versionado.

## 2.1. Como criar as tables no Oracle FIAP com JPA

O backend agora cria as tables pelas entidades JPA.

No `.env`, mantenha:

```env
ORACLE_URL=jdbc:oracle:thin:@oracle.fiap.com.br:1521:ORCL
ORACLE_USER=rm553134
JPA_DDL_AUTO=update
```

Depois rode o Service:

```bash
cd backend/services/checkin-service
mvn spring-boot:run
```

O `application.yml` importa o `.env` da raiz automaticamente. Ao iniciar, o Hibernate cria/atualiza as tables `FC_*` no schema do User conectado.

Depois carregue os Data de Demo pela IDE:

```text
database/oracle/seed.sql
```

## 2.2. Como criar as tables por script, se precisar resetar tudo

Abra a conexao da FIAP na IDE e execute:

```text
database/oracle/setup_fiap.sql
```

Esse script executa:

1. `reset.sql`
2. `schema.sql`
3. `seed.sql`
4. `verify.sql`

Ao final, devem aparecer as reservation:

- `RSV-2026-0001`
- `RSV-2026-0002`

## 3. Como rodar com as variaveis do .env

No macOS/Linux, dentro da pasta do Service:

```bash
cd backend/services/checkin-service
mvn spring-boot:run
```

Se preferir passar direto no terminal:

```bash
ORACLE_URL=jdbc:oracle:thin:@oracle.fiap.com.br:1521:ORCL \
ORACLE_USER=rm553134 \
ORACLE_PASSWORD=sua-senha-real \
mvn spring-boot:run
```

## 4. Como a equipe acessa o banco

Existem dois caminhos:

### Cada integrante usa seu proprio RM

Essa e a opcao mais segura. Cada pessoa cria seu proprio `.env` com User e senha da FIAP.

### Um User compartilhado do grupo

Se a FIAP forneceu ou permitiu um User compartilhado, todos podem usar o mesmo `ORACLE_USER` e `ORACLE_PASSWORD`, mas a senha deve ser enviada por canal private, como gerenciador de senhas, Teams private ou combinacao presencial. Nao versionar.

## 5. O que vai para o Git

Vai para o Git:

- `.env.example`
- `backend/services/checkin-service/.env.example`
- entidades JPA
- `schema.sql`
- `seed.sql`
- Documentation

Nao vai para o Git:

- `.env`
- senha real
- tokens
- credenciais personal

## 6. Observacao importante

Se todos usarem o mesmo schema Oracle, as alteracoes de uma pessoa afetam as outras. Para development em grupo, combinem uma das opcoes:

- Usar o Oracle FIAP compartilhado apenas para Integration.
- Usar H2 local para development rapido.
- Usar Oracle Docker local quando possivel.
- Usar JPA para criar/atualizar tables.
- Usar scripts `reset.sql`, `schema.sql` e `seed.sql` apenas quando for necessario resetar o ambiente.
