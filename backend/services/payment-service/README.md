# payment-service

Microservico planejado para pre-autorizacoes, capturas e registro de transacoes.

## Status

Planejado como servico independente. No MVP atual, pagamento simulado esta dentro do `checkin-service`.

## Responsabilidades

- Criar pre-autorizacao no check-in.
- Capturar valores no checkout.
- Simular pagamento aprovado, recusado e pendente.
- Garantir idempotencia com `Idempotency-Key`.
- Registrar transacoes para auditoria.

## Endpoints Planejados

- `POST /api/v1/payments/pre-authorizations`
- `POST /api/v1/payments/captures`
- `GET /api/v1/payments/{transactionId}`
- `POST /api/v1/payments/{transactionId}/refunds`

## Tabela

- `fc_payment_transaction`

## Cartoes de Teste

- `TEST_CARD_APPROVED`: aprova.
- `TEST_CARD_DECLINED`: recusa.
- `TEST_CARD_REVIEW`: pendente, previsto para evolucao.

## MVP Atual

Use `paymentMethod` nos endpoints do `checkin-service`:

- `POST /api/v1/checkin-sessions/{sessionId}/complete-checkin`
- `POST /api/v1/stays/{stayId}/checkout`
