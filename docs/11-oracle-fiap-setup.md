# Oracle FIAP Setup

## 1. Connection Data

The FIAP Oracle connection uses:

```text
Host: oracle.fiap.com.br
Port: 1521
SID: ORCL
User: your Oracle user
JDBC URL: jdbc:oracle:thin:@oracle.fiap.com.br:1521:ORCL
```

The password must remain only in each developer's local environment.

## 2. Where To Put The Password

Do not place the password in source code, README files, Git history, or shared team channels when the repository is shared.

Create a local `.env` file in the project root from the example:

```bash
cp .env.example .env
```

Then edit:

```text
ORACLE_PASSWORD=your-real-password
```

The `.env` file is already listed in `.gitignore` and must not be versioned.

## 2.1. Create Tables In Oracle FIAP With JPA

The backend can create tables from the JPA entities.

In `.env`, keep:

```env
ORACLE_URL=jdbc:oracle:thin:@oracle.fiap.com.br:1521:ORCL
ORACLE_USER=your_oracle_user
JPA_DDL_AUTO=update
```

Then start the service:

```bash
cd backend/services/checkin-service
mvn spring-boot:run
```

`application.yml` imports the root `.env` automatically. On startup, Hibernate creates or updates the `FC_*` tables in the connected user's schema.

Then load demo data from the IDE:

```text
database/oracle/seed.sql
```

## 2.2. Create Tables By Script When A Full Reset Is Needed

Open the FIAP connection in the IDE and run:

```text
database/oracle/setup_fiap.sql
```

This script runs:

1. `reset.sql`
2. `schema.sql`
3. `seed.sql`
4. `verify.sql`

At the end, these reservations should appear:

- `RSV-2026-0001`
- `RSV-2026-0002`

## 3. Running With `.env` Variables

Inside a service folder:

```bash
cd backend/services/checkin-service
mvn spring-boot:run
```

If you prefer to pass variables directly:

```bash
ORACLE_URL=jdbc:oracle:thin:@oracle.fiap.com.br:1521:ORCL \
ORACLE_USER=your_oracle_user \
ORACLE_PASSWORD=your-real-password \
mvn spring-boot:run
```

## 4. Team Database Access

There are two safe paths:

### Each Developer Uses Their Own RM

This is the safest option. Each person creates a local `.env` with their FIAP user and password.

### Shared Group User

If FIAP provides or allows a shared user, everyone can use the same `ORACLE_USER` and `ORACLE_PASSWORD`, but the password must be shared through a private channel such as a password manager, private Teams message, or in-person exchange. Do not version it.

## 5. What Goes To Git

Versioned:

- `.env.example`
- JPA entities
- `schema.sql`
- `seed.sql`
- documentation

Not versioned:

- `.env`
- real passwords
- tokens
- personal credentials

## 6. Important Note

If everyone uses the same Oracle schema, one person's changes affect the others. For group development, agree on one of these options:

- Use the shared Oracle FIAP schema only for integration.
- Use local H2 for fast development.
- Use local Oracle Docker when possible.
- Use JPA to create or update tables.
- Use `reset.sql`, `schema.sql`, and `seed.sql` only when the environment must be reset.
