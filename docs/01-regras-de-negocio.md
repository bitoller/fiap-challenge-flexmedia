# Regras de Negocio

## 1. Glossario

- Hospede: pessoa que utilizara a reserva e a estadia.
- Reserva: registro originado no PMS ou criado para demonstracao.
- Estadia: periodo efetivo em que o hospede ocupa o quarto.
- PMS: Property Management System, sistema de gestao hoteleira.
- Totem: terminal fisico de autoatendimento.
- Chave digital: credencial de acesso enviada por QR Code, link ou app.
- Chave fisica: cartao RFID ou similar emitido pelo equipamento.
- Pre-autorizacao: bloqueio temporario de valor no cartao para garantir despesas.
- Sessao de atendimento: fluxo iniciado no totem por um hospede.

## 2. Politicas Gerais

### RN-001 - Identificacao da reserva

O sistema deve permitir localizar reserva por codigo da reserva, CPF, passaporte, e-mail ou QR Code. Para o MVP, QR Code pode ser representado por um codigo textual.

### RN-002 - Reserva elegivel para check-in

Uma reserva so pode iniciar check-in quando:

- Estiver confirmada.
- A data de entrada for igual a data atual ou estiver dentro da janela de early check-in configurada.
- Nao estiver cancelada, expirada ou marcada como no-show.
- Houver ao menos um quarto associado ou disponibilidade para atribuicao.
- Nao existir estadia ativa para a mesma reserva.

### RN-003 - Reserva inelegivel

Quando a reserva nao for elegivel, o totem deve informar o motivo de forma simples e oferecer encaminhamento para atendimento humano.

### RN-004 - Dados obrigatorios do hospede

Antes do check-in, o hospede deve confirmar ou preencher:

- Nome completo.
- Documento.
- Data de nascimento.
- Nacionalidade.
- Telefone ou e-mail.
- Endereco, quando exigido pelo hotel.
- Aceite de termos de hospedagem.
- Consentimento para tratamento de dados pessoais.

### RN-005 - Hospede menor de idade

Hospedes menores de idade nao podem concluir check-in autonomo sem responsavel vinculado. O fluxo deve encaminhar para recepcao.

### RN-006 - Validacao de documento

O sistema deve registrar a validacao do documento. No MVP, a validacao pode ser simulada com status `APPROVED`, `REJECTED` ou `MANUAL_REVIEW`.

### RN-007 - Reconhecimento facial

Reconhecimento facial deve ser opcional, depender de consentimento explicito e sempre possuir alternativa. Se o hospede negar consentimento ou a validacao falhar, o fluxo deve continuar por validacao documental ou atendimento assistido.

### RN-008 - Dado biometrico sensivel

Imagem facial e template biometrico sao dados sensiveis. A arquitetura deve evitar armazenar imagem bruta. Quando necessario, armazenar somente referencia tecnica, hash, template criptografado ou token do provedor.

### RN-009 - Pagamento ou pre-autorizacao

O check-in pode exigir pagamento antecipado, garantia ou pre-autorizacao, conforme politica do hotel. Se o pagamento for recusado, o check-in nao deve ser concluido automaticamente.

### RN-010 - Pendencias financeiras

Uma reserva com pendencias financeiras impeditivas deve ser encaminhada para atendimento humano ou pagamento no totem.

### RN-011 - Atribuicao de quarto

O check-in so pode ser concluido se houver quarto disponivel e limpo. Para o MVP, o status do quarto pode ser controlado no banco de dados.

### RN-012 - Emissao de chave

A chave so pode ser emitida apos o check-in ser concluido. A validade da chave deve respeitar a data/hora de check-out prevista, com tolerancia configuravel.

### RN-013 - Falha na emissao de chave

Se a chave nao puder ser emitida, a estadia pode ficar com status `CHECKED_IN_PENDING_KEY`, exigindo acao da recepcao.

### RN-014 - Check-in duplicado

Nao deve ser permitido concluir dois check-ins para a mesma reserva. A operacao deve ser idempotente por `reservationId` e `sessionId`.

### RN-015 - Check-out elegivel

O check-out pode ser iniciado quando existir estadia ativa e a data atual estiver dentro da janela permitida pelo hotel.

### RN-016 - Late check-out

Se o hospede tentar check-out apos o horario limite, o sistema deve aplicar regra de taxa ou encaminhar para recepcao, conforme configuracao.

### RN-017 - Consumos e cobrancas

Antes de finalizar check-out, o sistema deve apresentar diarias, taxas e consumos registrados. No MVP, consumos podem ser simulados.

### RN-018 - Encerramento da estadia

O check-out so pode ser concluido quando pendencias financeiras impeditivas forem resolvidas ou autorizadas manualmente.

### RN-019 - Recibo

Apos check-out, o sistema deve gerar comprovante visual e registrar envio por e-mail ou WhatsApp simulado.

### RN-020 - Encaminhamento humano

Qualquer falha critica, suspeita de fraude, menor de idade, documento rejeitado, pagamento recusado ou divergencia de reserva deve permitir encaminhamento para atendimento humano.

### RN-021 - Auditoria

Toda acao relevante deve ser auditada com data/hora, origem, usuario ou totem, identificador de correlacao e resultado.

### RN-022 - Modo contingencia

Se o PMS estiver indisponivel, o sistema deve permitir operar com dados sincronizados recentemente, mas deve registrar pendencia de reconciliacao.

### RN-023 - LGPD e minimizacao

O sistema deve coletar apenas dados necessarios para hospedagem, seguranca e integracao operacional. Dados sensiveis devem ter justificativa, consentimento e prazo de retencao.

### RN-024 - Cancelamento de sessao

Sessoes abandonadas devem expirar automaticamente apos periodo configuravel, apagando dados temporarios nao confirmados.

### RN-025 - Idioma e acessibilidade

O totem deve usar linguagem clara, botoes grandes, contraste adequado e fluxo com poucos passos. Multi-idioma e desejavel para evolucao.

## 3. Fluxo de Check-in

1. Hospede inicia atendimento no totem.
2. Sistema cria uma sessao.
3. Hospede informa codigo, CPF/passaporte ou QR Code.
4. Sistema consulta a reserva no servico interno e, se necessario, no PMS.
5. Sistema verifica elegibilidade.
6. Hospede confirma dados pessoais.
7. Hospede aceita termos e consentimentos.
8. Sistema valida documento.
9. Sistema executa reconhecimento facial opcional ou fallback.
10. Sistema calcula pagamento/pre-autorizacao.
11. Hospede confirma pagamento.
12. Sistema atribui quarto.
13. Sistema conclui check-in.
14. Sistema emite chave.
15. Sistema mostra comprovante e orientacoes finais.

## 4. Fluxo de Check-out

1. Hospede inicia check-out.
2. Sistema identifica reserva, quarto ou chave.
3. Sistema consulta estadia ativa.
4. Sistema apresenta resumo de despesas.
5. Hospede confirma valores.
6. Sistema processa pagamento final ou captura pre-autorizacao.
7. Sistema encerra chave.
8. Sistema atualiza PMS.
9. Sistema conclui estadia.
10. Sistema gera comprovante.

## 5. Excecoes Importantes

- Reserva nao encontrada: orientar busca alternativa e recepcao.
- Reserva cancelada: bloquear fluxo e encaminhar.
- Quarto indisponivel: informar espera ou recepcao.
- Documento rejeitado: encaminhar recepcao.
- Biometria falhou: permitir nova tentativa e fallback.
- Pagamento recusado: permitir nova tentativa e recepcao.
- PMS fora do ar: usar contingencia se dados locais forem recentes.
- Totem sem impressora/chave: concluir check-in com pendencia operacional ou chave digital.

