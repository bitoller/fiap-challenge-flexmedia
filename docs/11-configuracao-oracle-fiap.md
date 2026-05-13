# Configuracao do Oracle FIAP

## 1. Dados da conexao

Pelo print da IDE, a conexao Oracle da FIAP usa:

```text
Host: oracle.fiap.com.br
Porta: 1521
SID: ORCL
Usuario: rm552726
URL JDBC: jdbc:oracle:thin:@oracle.fiap.com.br:1521:ORCL
```

A senha deve ficar somente no ambiente local de cada integrante.

## 2. Onde colocar a senha

Nao coloque a senha no codigo, no README, no Git ou no grupo da equipe se o repositorio for compartilhado.

Crie um arquivo local `.env` na raiz do projeto a partir do exemplo:

```bash
cp .env.example .env
```

Depois edite:

```text
ORACLE_PASSWORD=sua-senha-real
```

O arquivo `.env` ja esta no `.gitignore`, entao nao deve ser versionado.

## 2.1. Como criar as tabelas no Oracle FIAP com JPA

O backend agora cria as tabelas pelas entidades JPA.

No `.env`, mantenha:

```env
ORACLE_URL=jdbc:oracle:thin:@oracle.fiap.com.br:1521:ORCL
ORACLE_USER=rm552726
JPA_DDL_AUTO=update
```

Depois rode o servico:

```bash
cd backend/services/checkin-service
mvn spring-boot:run
```

O `application.yml` importa o `.env` da raiz automaticamente. Ao iniciar, o Hibernate cria/atualiza as tabelas `FC_*` no schema do usuario conectado.

Depois carregue os dados de demonstracao pela IDE:

```text
database/oracle/seed.sql
```

## 2.2. Como criar as tabelas por script, se precisar resetar tudo

Abra a conexao da FIAP na IDE e execute:

```text
database/oracle/setup_fiap.sql
```

Esse script executa:

1. `reset.sql`
2. `schema.sql`
3. `seed.sql`
4. `verify.sql`

Ao final, devem aparecer as reservas:

- `RSV-2026-0001`
- `RSV-2026-0002`

## 3. Como rodar com as variaveis do .env

No macOS/Linux, dentro da pasta do servico:

```bash
cd backend/services/checkin-service
mvn spring-boot:run
```

Se preferir passar direto no terminal:

```bash
ORACLE_URL=jdbc:oracle:thin:@oracle.fiap.com.br:1521:ORCL \
ORACLE_USER=rm552726 \
ORACLE_PASSWORD=sua-senha-real \
mvn spring-boot:run
```

## 4. Como a equipe acessa o banco

Existem dois caminhos:

### Cada integrante usa seu proprio RM

Essa e a opcao mais segura. Cada pessoa cria seu proprio `.env` com usuario e senha da FIAP.

### Um usuario compartilhado do grupo

Se a FIAP forneceu ou permitiu um usuario compartilhado, todos podem usar o mesmo `ORACLE_USER` e `ORACLE_PASSWORD`, mas a senha deve ser enviada por canal privado, como gerenciador de senhas, Teams privado ou combinacao presencial. Nao versionar.

## 5. O que vai para o Git

Vai para o Git:

- `.env.example`
- `backend/services/checkin-service/.env.example`
- entidades JPA
- `schema.sql`
- `seed.sql`
- documentacao

Nao vai para o Git:

- `.env`
- senha real
- tokens
- credenciais pessoais

## 6. Observacao importante

Se todos usarem o mesmo schema Oracle, as alteracoes de uma pessoa afetam as outras. Para desenvolvimento em grupo, combinem uma das opcoes:

- Usar o Oracle FIAP compartilhado apenas para integracao.
- Usar H2 local para desenvolvimento rapido.
- Usar Oracle Docker local quando possivel.
- Usar JPA para criar/atualizar tabelas.
- Usar scripts `reset.sql`, `schema.sql` e `seed.sql` apenas quando for necessario resetar o ambiente.
