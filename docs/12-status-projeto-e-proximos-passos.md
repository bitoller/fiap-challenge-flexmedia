# Status do Projeto e Proximos Passos

## 1. O que ja foi criado

### Backend

Implementado:

- `checkin-service`
- `api-gateway`

O `checkin-service` esta organizado em Clean Architecture:

- `controller`
- `dto`
- `mapper`
- `service`
- `repository`
- `domain`
- `infrastructure`
- `config`

Estruturado/documentado:

- `reservation-service`
- `payment-service`
- `key-service`
- `biometry-service`
- `device-service`
- `notification-service`
- `pms-adapter-service`
- `identity-service`

No MVP, o `checkin-service` concentra o fluxo principal para reduzir risco. Internamente ele ja cobre reserva, check-in, pagamento simulado, chave simulada, checkout e auditoria.

### Frontend

Implementado:

- `kiosk-web`

Ainda falta:

- `admin-web`

### Banco de dados

Criado:

- Modelo Oracle em `database/oracle/schema.sql`.
- Seed dinamico em `database/oracle/seed.sql`.
- Reset em `database/oracle/reset.sql`.
- Setup completo FIAP em `database/oracle/setup_fiap.sql`.
- Verificacao em `database/oracle/verify.sql`.
- Entidades JPA no backend para criar as tabelas automaticamente com Hibernate.

## 2. Como ficou o Gateway

O `api-gateway` esta implementado como um gateway MVP em Spring Boot.

Ele roda por padrao em:

```text
http://localhost:8088
```

Endpoints:

```text
GET /gateway/health
```

E encaminha:

```text
/api/v1/** -> checkin-service
```

Por padrao, ele aponta para:

```text
http://localhost:8080
```

Para mudar:

```bash
CHECKIN_SERVICE_URL=http://localhost:8081 mvn spring-boot:run
```

O gateway foi validado localmente encaminhando uma busca de reserva para o `checkin-service`.

## 3. Como deixar o Oracle FIAP funcional

Na IDE, abra a conexao:

```text
oracle.fiap.com.br:1521:ORCL
```

Opcao recomendada agora: deixe o backend criar as tabelas pelas entidades JPA.

Configure:

```env
JPA_DDL_AUTO=update
```

Rode o `checkin-service` uma vez. O Hibernate cria/atualiza as tabelas `FC_*`.

Depois, para carregar dados de demonstracao, execute:

```text
database/oracle/seed.sql
```

Opcao alternativa: se quiser resetar tudo por script, execute:

```text
database/oracle/setup_fiap.sql
```

Esse script alternativo:

1. Apaga tabelas antigas `FC_*`.
2. Cria tabelas.
3. Insere dados de teste.
4. Lista contagens e reservas carregadas.

Depois configure o backend:

```env
ORACLE_URL=jdbc:oracle:thin:@oracle.fiap.com.br:1521:ORCL
ORACLE_USER=rm553134
ORACLE_PASSWORD=sua-senha
```

E rode:

```bash
cd backend/services/checkin-service
set -a
source .env
set +a
mvn spring-boot:run
```

## 4. O que falta para o MVP ficar forte

Prioridade alta:

- Rodar o backend com `JPA_DDL_AUTO=update` no Oracle FIAP para criar as tabelas.
- Rodar `seed.sql` no Oracle FIAP para carregar as reservas de teste.
- Testar `checkin-service` usando Oracle real.
- Ajustar o frontend para chamar o gateway na demo.
- Criar `admin-web` simples.
- Criar roteiro de demo com reserva de sucesso e reserva de erro.
- Adicionar testes de erro para documento rejeitado, reserva inelegivel e pagamento recusado.

Prioridade media:

- Adicionar testes automatizados de regra de negocio.
- Criar endpoints administrativos para listar reservas, sessoes e estadias.
- Melhorar tratamento de expiracao de sessao.
- Adicionar logs com `correlationId` em todos os fluxos.
- Criar Dockerfile real para `checkin-service`, `api-gateway` e `kiosk-web`.

Prioridade baixa, para banca final:

- Separar `reservation-service` real.
- Separar `payment-service` mockado.
- Separar `key-service` mockado.
- Implementar `admin-web` mais completo.
- Adicionar tela de monitoramento de totens.
- Adicionar relatorio operacional.

## 5. O que ainda nao esta pronto

- Autenticacao real de usuarios administrativos.
- `identity-service` implementado.
- Integracao real com PMS.
- Integracao real com pagamento.
- Integracao real com biometria.
- Integracao real com chave fisica.
- Envio real de e-mail/WhatsApp.
- Deploy final em Docker Compose com todos os servicos.

## 6. Recomendacao de caminho

O melhor caminho agora e:

1. Criar o banco no Oracle FIAP.
2. Rodar o `checkin-service` apontando para esse banco.
3. Rodar o `api-gateway`.
4. Rodar o `kiosk-web` chamando o gateway.
5. Criar o `admin-web`.

Com isso, o projeto ja tera uma demo completa e coerente com a arquitetura.
