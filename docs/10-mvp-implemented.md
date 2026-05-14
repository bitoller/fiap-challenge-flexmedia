# implemented MVP

## 1. Status Atual

A primeira fatia funcional do MVP foi implementada com:

- Backend Java Spring Boot em `backend/services/checkin-service`.
- API Gateway Spring Boot em `backend/services/api-gateway`.
- Frontend React do Kiosk em `frontend/kiosk-web`.
- Persistencia apontando para Oracle FIAP.
- Criacao de tables por entidades JPA/Hibernate.
- Flow de check-in e check-out testado por API.
- `checkin-service` reorganized em Clean Architecture com principios SOLID.
- test automatizado de Flow nos use cases.

## 2. O que ja funciona

### Backend

- Gateway MVP encaminhando `/api/v1/**` para o `checkin-service`.
- use cases separados na camada `service`.
- Dominio desacoplado de Spring/JDBC.
- Adaptador JDBC implementando interfaces de repository.
- Entidades JPA na infraestrutura para criacao automatica do schema.
- Criar Session de atendimento.
- Buscar reservation por code.
- Validar elegibilidade da reservation.
- Confirmar Data do Guest.
- Registrar consentimentos LGPD.
- Simular Validation documental.
- Simular Biometry opcional.
- Simular Payment aprovado ou recusado.
- Criar estadia.
- Emitir Key digital simulada.
- Fazer check-out.
- Revogar Key.
- Atualizar reservation e quarto.
- Registrar audit.
- Expor dashboard administrativo basico.

### Frontend do Kiosk

- Tela inicial com escolha entre check-in e check-out.
- Busca por code de reservation.
- summary da reservation.
- Confirmation de personal data.
- consent de terms e Biometry opcional.
- Payment simulado.
- Tela de sucesso com quarto, Key digital e estadia.
- Flow de check-out por numero de estadia.
- Estados de erro com encaminhamento para Reception.

## 3. Como rodar rapidamente

Backend com Oracle FIAP:

```bash
cd backend/services/checkin-service
mvn spring-boot:run
```

Se a porta `8080` estiver ocupada:

```bash
SERVER_PORT=8081 mvn spring-boot:run
```

Frontend:

```bash
cd frontend/kiosk-web
npm install
npm run dev
```

Com backend em outra porta:

```bash
VITE_API_URL=http://127.0.0.1:8081/api/v1 npm run dev
```

Abrir:

```text
http://localhost:5173
```

## 4. Data de test

reservation:

- `RSV-2026-0001`
- `RSV-2026-0002`

Payments simulados:

- `TEST_CARD_APPROVED`
- `TEST_CARD_DECLINED`

## 5. Decisao tecnica

O backend foi implemented dentro do `checkin-service` como MVP modular. Ele ja possui responsabilidades de reservation, check-in, Payment, Key e audit separadas internamente, mas ainda roda como um unico Service para reduce risco de Delivery.

Na evolucao, os modulos podem ser separados em microservices independentes usando os contratos documentados.

## 6. Next steps

- Criar `admin-web` consumindo `/api/v1/admin/dashboard`.
- Validar o schema criado por JPA no Oracle FIAP.
- Separar `reservation-service` quando o Flow principal estiver estavel.
- Adicionar tests automatizados para regras de elegibilidade.
- Melhorar acessibilidade e responsividade do Kiosk.
