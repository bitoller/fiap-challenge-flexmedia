# admin-web

Painel administrativo planejado para recepcao e gestao operacional.

## Status

Planejado. Ainda nao possui aplicacao React implementada.

## Objetivo

Dar visibilidade operacional para o hotel: reservas do dia, sessoes em andamento, falhas, check-ins concluidos, checkouts e status de totens.

## Telas Planejadas

- Dashboard do dia.
- Reservas de hoje.
- Sessoes em andamento.
- Check-ins concluidos.
- Checkouts concluidos.
- Falhas e handoffs para recepcao.
- Status dos totens.
- Auditoria resumida.

## API Inicial

O `checkin-service` ja expõe:

```text
GET /api/v1/admin/dashboard
```

Esse endpoint retorna:

- reservas de hoje
- estadias ativas
- check-ins concluidos
- checkouts concluidos
- sessoes com falha
- sessoes recentes

## Valor para a Banca

O painel mostra que o totem faz parte de uma operacao monitoravel, com rastreabilidade e atendimento humano para excecoes.
