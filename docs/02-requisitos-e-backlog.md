# Requisitos e Backlog

## 1. Requisitos Funcionais

### RF-001 - Iniciar sessao no totem

O sistema deve criar uma sessao de atendimento para cada fluxo iniciado no totem.

### RF-002 - Buscar reserva

O hospede deve conseguir buscar uma reserva por codigo, CPF, passaporte, e-mail ou QR Code simulado.

### RF-003 - Exibir resumo da reserva

O totem deve apresentar nome do hospede, datas, hotel, quarto quando disponivel, quantidade de pessoas e status da reserva.

### RF-004 - Confirmar dados pessoais

O hospede deve revisar e corrigir dados obrigatorios antes do check-in.

### RF-005 - Registrar consentimentos

O sistema deve registrar aceite de termos de hospedagem, politica de privacidade e consentimento biometrico quando aplicavel.

### RF-006 - Validar documento

O sistema deve registrar resultado de validacao documental.

### RF-007 - Validar face

O sistema deve oferecer reconhecimento facial opcional com resultado aprovado, recusado ou revisao manual.

### RF-008 - Processar pagamento

O sistema deve simular pagamento, pre-autorizacao ou captura final.

### RF-009 - Concluir check-in

O sistema deve criar uma estadia ativa e atualizar reserva para `CHECKED_IN`.

### RF-010 - Emitir chave

O sistema deve gerar uma chave digital simulada ou registrar emissao de chave fisica.

### RF-011 - Realizar check-out

O sistema deve permitir encerrar estadia ativa apos revisao de pendencias.

### RF-012 - Gerar comprovante

O sistema deve gerar comprovante de check-in e check-out em tela e registrar envio simulado.

### RF-013 - Painel administrativo

Operadores devem visualizar reservas, sessoes, estadias, status de totens e falhas.

### RF-014 - Auditoria

Operacoes sensiveis devem gerar registros de auditoria.

### RF-015 - Integracao PMS simulada

O sistema deve possuir adaptador de PMS com dados mockados ou sincronizados no Oracle.

## 2. Requisitos Nao Funcionais

- RNF-001 - Usabilidade: fluxo do totem deve ser concluido com poucos toques e linguagem direta.
- RNF-002 - Acessibilidade: contraste, fontes legiveis, areas de toque grandes e feedback visual.
- RNF-003 - Performance: telas principais devem responder em ate 2 segundos no MVP.
- RNF-004 - Seguranca: trafego autenticado, senhas com hash, tokens JWT e controle de acesso.
- RNF-005 - Privacidade: dados pessoais e biometricos tratados conforme LGPD.
- RNF-006 - Disponibilidade: falhas externas devem ter tratamento e caminho alternativo.
- RNF-007 - Auditabilidade: operacoes devem ser rastreaveis por `correlationId`.
- RNF-008 - Manutenibilidade: separar dominios por microservico e documentar contratos.
- RNF-009 - Escalabilidade: permitir aumento de totens por hotel sem alterar o core.
- RNF-010 - Portabilidade: ambiente local deve ser reproduzivel para apresentacao.

## 3. Historias de Usuario

### HU-001 - Check-in rapido

Como hospede, quero localizar minha reserva e fazer check-in no totem para evitar fila na recepcao.

Criterios de aceite:

- Deve encontrar reserva por codigo.
- Deve mostrar resumo antes de confirmar.
- Deve concluir check-in quando nao houver pendencias.
- Deve emitir chave simulada ao final.

### HU-002 - Fallback para atendimento

Como hospede, quero ser encaminhado para a recepcao quando o sistema nao puder resolver meu caso para nao ficar travado no totem.

Criterios de aceite:

- Deve mostrar motivo simples.
- Deve registrar a falha.
- Deve permitir chamar atendente ou gerar senha de atendimento.

### HU-003 - Check-out autonomo

Como hospede, quero revisar minhas despesas e fazer check-out no totem para sair rapidamente do hotel.

Criterios de aceite:

- Deve localizar estadia ativa.
- Deve apresentar valores.
- Deve processar pagamento simulado.
- Deve encerrar chave e estadia.

### HU-004 - Acompanhamento operacional

Como gerente, quero visualizar sessoes e status dos totens para identificar gargalos.

Criterios de aceite:

- Deve listar sessoes por status.
- Deve mostrar falhas por tipo.
- Deve mostrar check-ins e check-outs do dia.

### HU-005 - Conformidade LGPD

Como encarregado de privacidade, quero registrar consentimentos e auditoria para comprovar conformidade.

Criterios de aceite:

- Deve registrar versao dos termos.
- Deve registrar data/hora do aceite.
- Deve permitir negar biometria sem bloquear todo o fluxo.

## 4. Backlog Priorizado

### Sprint 1 - Fundacao e narrativa

- Definir escopo do MVP.
- Criar modelo de dados Oracle.
- Criar prototipo navegavel do totem.
- Criar documentacao de arquitetura.
- Preparar roteiro para mentoria de 13/05/2026.

### Sprint 2 - Fluxo principal

- Implementar busca de reserva.
- Implementar check-in.
- Implementar aceite de termos.
- Implementar pagamento simulado.
- Implementar chave simulada.
- Integrar React com APIs.

### Sprint 3 - Check-out e painel

- Implementar check-out.
- Implementar painel administrativo.
- Implementar auditoria.
- Implementar status de totens.
- Ajustar UX e estados de erro.

### Sprint 4 - Finalizacao

- Testar demo ponta a ponta.
- Preparar video pitch de ate 3 minutos.
- Gerar PDF com link do video e integrantes.
- Compactar projeto.
- Revisar apresentacao para banca.

## 5. Criterios de Pronto do MVP

O MVP esta pronto quando:

- O fluxo feliz de check-in funciona de ponta a ponta.
- O fluxo feliz de check-out funciona de ponta a ponta.
- Falhas principais possuem mensagem e alternativa.
- Dados sao persistidos no Oracle.
- O frontend consome APIs reais ou mocks claramente isolados.
- Existe documentacao suficiente para explicar arquitetura e negocio.
- A demonstracao pode ser executada sem depender de internet externa.

