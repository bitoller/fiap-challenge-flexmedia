# Plano de Entrega e Pitch

## 1. Entrega da Sprint

O Challenge exige um arquivo `.ZIP` contendo:

1. PDF com nomes dos integrantes, nome do time e link publico do video.
2. Arquivo compactado com os arquivos e pastas do MVP desenvolvido.

O video pitch deve ter no maximo 3 minutos.

## 2. Estrutura Recomendada do PDF

- Nome do projeto: FlexCheck Hotel.
- Nome do time.
- Integrantes.
- RM de cada integrante, se exigido pela turma.
- Link publico do video.
- Resumo de uma frase da solucao.

## 3. Roteiro do Video de Ate 3 Minutos

### 0:00 a 0:25 - Problema

"Em hoteis, check-in e check-out ainda dependem de filas, conferencia manual de documentos, pagamento e emissao de chaves. Isso gera espera para hospedes e sobrecarga para a recepcao."

### 0:25 a 0:50 - Solucao

"O FlexCheck Hotel e um totem de autoatendimento integrado a sistemas hoteleiros. Ele permite localizar a reserva, confirmar dados, validar documento, aceitar termos, realizar pagamento e emitir uma chave de acesso."

### 0:50 a 2:20 - Demonstracao

Mostrar:

- Tela inicial do totem.
- Busca por codigo de reserva.
- Confirmacao de dados.
- Aceite LGPD.
- Validacao de documento/biometria simulada.
- Pagamento simulado.
- Check-in concluido com chave.
- Check-out com fechamento.
- Painel administrativo com status.

### 2:20 a 2:45 - Arquitetura e Diferenciais

"A solucao foi criada com React, Java Spring Boot, Oracle SQL e arquitetura em microservicos. O PMS fica isolado em um adaptador, permitindo integrar diferentes hoteis sem reescrever o sistema. A solucao tambem considera LGPD, auditoria e modo contingencia."

### 2:45 a 3:00 - Fechamento

"Com isso, o hotel reduz filas, padroniza atendimento e oferece uma experiencia mais rapida e segura para o hospede."

## 4. Demo Recomendada

Usar um fluxo de sucesso e um fluxo de excecao.

Fluxo de sucesso:

- Reserva `RSV-2026-0001`.
- Hospede aprovado.
- Pagamento aprovado.
- Chave digital emitida.

Fluxo de excecao:

- Reserva `RSV-2026-0002`.
- Pagamento recusado ou documento em revisao.
- Sistema encaminha para recepcao.

## 5. Checklist de Qualidade

- O video tem menos de 3 minutos.
- O link esta publico.
- O PDF tem nomes e link.
- O ZIP contem frontend, backend, banco e docs.
- O README explica como executar.
- Dados de teste estao prontos.
- A demo nao depende de internet externa.
- Existe um plano B caso o totem real nao esteja disponivel.
- O grupo sabe explicar o que e real, o que e simulado e o que e evolucao.

## 6. Perguntas Provaveis da Banca

### Como voces integram com diferentes PMS?

Resposta: usando um `pms-adapter-service`, que traduz o contrato interno para o contrato de cada PMS. Assim, o fluxo de check-in nao muda quando o hotel troca de fornecedor.

### Como tratam LGPD no reconhecimento facial?

Resposta: a biometria e opcional, depende de consentimento especifico, possui fallback e nao exige armazenar imagem bruta no MVP.

### O que acontece se o pagamento falhar?

Resposta: o fluxo nao conclui automaticamente. O hospede pode tentar novamente ou ser encaminhado para atendimento humano.

### O que acontece se o PMS estiver fora?

Resposta: o sistema pode operar em contingencia com dados sincronizados recentemente e depois reconciliar eventos pendentes.

### Por que microservicos?

Resposta: porque o dominio possui integracoes independentes, como PMS, pagamento, chaves, dispositivos e biometria. A separacao reduz acoplamento e permite evoluir cada parte sem afetar todo o sistema. Para o MVP, a implementacao sera controlada para nao comprometer a entrega.

