# MVP Implementado

## 1. Status Atual

A primeira fatia funcional do MVP foi implementada com:

- Backend Java Spring Boot em `backend/services/checkin-service`.
- API Gateway Spring Boot em `backend/services/api-gateway`.
- Frontend React do totem em `frontend/kiosk-web`.
- Persistencia apontando para Oracle FIAP.
- Criacao de tabelas por entidades JPA/Hibernate.
- Fluxo de check-in e check-out testado por API.
- `checkin-service` reorganizado em Clean Architecture com principios SOLID.
- Teste automatizado de fluxo nos casos de uso.

## 2. O que ja funciona

### Backend

- Gateway MVP encaminhando `/api/v1/**` para o `checkin-service`.
- Casos de uso separados na camada `service`.
- Dominio desacoplado de Spring/JDBC.
- Adaptador JDBC implementando interfaces de repository.
- Entidades JPA na infraestrutura para criacao automatica do schema.
- Criar sessao de atendimento.
- Buscar reserva por codigo.
- Validar elegibilidade da reserva.
- Confirmar dados do hospede.
- Registrar consentimentos LGPD.
- Simular validacao documental.
- Simular biometria opcional.
- Simular pagamento aprovado ou recusado.
- Criar estadia.
- Emitir chave digital simulada.
- Fazer check-out.
- Revogar chave.
- Atualizar reserva e quarto.
- Registrar auditoria.
- Expor dashboard administrativo basico.

### Frontend do Totem

- Tela inicial com escolha entre check-in e check-out.
- Busca por codigo de reserva.
- Resumo da reserva.
- Confirmacao de dados pessoais.
- Aceite de termos e biometria opcional.
- Pagamento simulado.
- Tela de sucesso com quarto, chave digital e estadia.
- Fluxo de check-out por numero de estadia.
- Estados de erro com encaminhamento para recepcao.

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

## 4. Dados de teste

Reservas:

- `RSV-2026-0001`
- `RSV-2026-0002`

Pagamentos simulados:

- `TEST_CARD_APPROVED`
- `TEST_CARD_DECLINED`

## 5. Decisao tecnica

O backend foi implementado dentro do `checkin-service` como MVP modular. Ele ja possui responsabilidades de reserva, check-in, pagamento, chave e auditoria separadas internamente, mas ainda roda como um unico servico para reduzir risco de entrega.

Na evolucao, os modulos podem ser separados em microservicos independentes usando os contratos documentados.

## 6. Proximos passos

- Criar `admin-web` consumindo `/api/v1/admin/dashboard`.
- Validar o schema criado por JPA no Oracle FIAP.
- Separar `reservation-service` quando o fluxo principal estiver estavel.
- Adicionar testes automatizados para regras de elegibilidade.
- Melhorar acessibilidade e responsividade do totem.
