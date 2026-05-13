# Relatorio Consolidado - FlexCheck Hotel

## 1. Identificacao

- Projeto: FlexCheck Hotel.
- Desafio: Totem de autoatendimento para setor hoteleiro.
- Empresa parceira: Flexmedia.
- Stack proposta: Java, React e Oracle SQL.
- Ambiente: Docker e Docker Compose.
- Arquitetura: microservicos com integracoes simuladas no MVP.

## 2. Resumo Executivo

O FlexCheck Hotel e uma plataforma de autoatendimento para hoteis que permite ao hospede realizar check-in e check-out em um totem, reduzindo filas, padronizando processos e liberando a recepcao para casos mais complexos.

A solucao cobre busca de reserva, confirmacao de dados, aceite LGPD, validacao documental, biometria opcional, pagamento/pre-autorizacao, emissao de chave e encerramento da estadia.

## 3. Problema

O atendimento tradicional em hoteis pode gerar filas, demora, retrabalho e falhas de conferencia. Processos como validacao de reserva, pagamento, documento e emissao de chave sao repetitivos e podem ser automatizados com seguranca.

## 4. Solucao

A proposta usa um totem com interface React conectado a microservicos Java e banco Oracle. O sistema tambem possui painel administrativo para recepcao e gerencia acompanharem sessoes, falhas e status dos totens.

## 5. Escopo do MVP

Incluido no MVP:

- Check-in funcional.
- Check-out funcional.
- Reserva e PMS simulados.
- Pagamento simulado.
- Chave digital/fisica simulada.
- Biometria opcional simulada.
- Banco Oracle com dados de demonstracao.
- Docker Compose para padronizar o banco local.
- Painel administrativo inicial.
- Auditoria de operacoes principais.

Fora do MVP:

- PMS comercial real.
- Pagamento real.
- Biometria produtiva.
- RFID real, caso o hardware nao esteja disponivel.

## 6. Regras de Negocio Principais

- Reserva deve estar confirmada e dentro da janela de check-in.
- Check-in duplicado deve ser bloqueado.
- Hospede menor de idade deve ir para atendimento humano.
- Documento rejeitado impede conclusao automatica.
- Biometria e opcional e exige consentimento.
- Pagamento recusado impede check-in automatico.
- Chave so pode ser emitida apos check-in concluido.
- Check-out exige resolucao de pendencias financeiras.
- Todas as operacoes criticas devem ser auditadas.
- PMS indisponivel deve gerar contingencia e reconciliacao.

## 7. Arquitetura

Microservicos definidos:

- `api-gateway`: entrada unica.
- `identity-service`: identidade, usuarios e tokens.
- `reservation-service`: reservas, hospedes, quartos e elegibilidade.
- `checkin-service`: orquestracao de check-in/check-out.
- `key-service`: emissao e revogacao de chaves.
- `payment-service`: pagamentos e pre-autorizacoes.
- `biometry-service`: validacao facial opcional.
- `notification-service`: comprovantes e comunicacoes.
- `device-service`: totens e hardware.
- `pms-adapter-service`: integracao com PMS.

## 8. Modelo de Dados

Tabelas Oracle principais:

- `fc_hotel`
- `fc_room`
- `fc_guest`
- `fc_reservation`
- `fc_reservation_guest`
- `fc_kiosk_device`
- `fc_checkin_session`
- `fc_consent`
- `fc_document_verification`
- `fc_biometry_verification`
- `fc_stay`
- `fc_payment_transaction`
- `fc_key_credential`
- `fc_device_event`
- `fc_pms_event`
- `fc_audit_log`

Criacao do banco:

- Entidades JPA em `backend/services/checkin-service/src/main/java/.../infrastructure/persistence/entity`
- Hibernate com `JPA_DDL_AUTO=update`

Scripts de apoio:

- `database/oracle/schema.sql`
- `database/oracle/seed.sql`

Ambiente:

- `docker-compose.yml`
- `.env.example`
- `database/oracle/init`

## 9. Seguranca e LGPD

A solucao deve respeitar minimizacao de dados, consentimento, alternativa sem biometria, logs sem informacao sensivel e auditoria completa.

Pontos de destaque:

- Biometria facial e opcional.
- Imagem bruta nao deve ser persistida.
- Consentimento deve ser versionado.
- Dados financeiros reais nao devem ser armazenados no sistema.
- Acesso administrativo deve usar papeis e permissoes.

## 10. Experiencia do Usuario

O totem deve ter:

- Botoes grandes.
- Linguagem simples.
- Etapas curtas.
- Feedback imediato.
- Caminho claro para recepcao.
- Tela final com comprovante e chave.

O painel deve ter:

- Reservas do dia.
- Sessoes em andamento.
- Falhas por motivo.
- Status dos totens.
- Historico resumido de auditoria.

## 11. Diferenciais

- Arquitetura preparada para PMS reais.
- Adaptador anti-corrupcao para integracoes.
- Tratamento LGPD desde o desenho.
- Auditoria e rastreabilidade.
- Modo contingencia.
- Monitoramento do totem como equipamento fisico.
- Fluxos de excecao bem pensados.

## 12. Riscos e Mitigacoes

| Risco | Mitigacao |
| --- | --- |
| Escopo grande demais | Priorizar fluxo de check-in/check-out e simular integracoes |
| PMS real indisponivel | Criar `pms-adapter-service` mockado |
| Biometria complexa | Simular e explicar desenho LGPD |
| Demo instavel | Usar seed fixo e roteiro ensaiado |
| Oracle dificil de rodar localmente | Usar banco da faculdade ou script portavel |

## 13. Plano Ate a Entrega

- 11/05 a 13/05: fechar documentacao, prototipo e narrativa para mentoria.
- 14/05 a 18/05: implementar backend principal e banco.
- 19/05 a 21/05: integrar React com APIs.
- 22/05 a 23/05: testar demo, gravar video e montar PDF.
- 24/05: entregar ZIP.
- Ate 17/06: polir UX, painel, auditoria e apresentacao final.

## 14. Materiais do Projeto

- Visao executiva: `docs/00-relatorio-executivo.md`.
- Regras de negocio: `docs/01-regras-de-negocio.md`.
- Requisitos e backlog: `docs/02-requisitos-e-backlog.md`.
- Arquitetura: `docs/03-arquitetura-software.md`.
- Modelo Oracle: `docs/04-modelagem-dados-oracle.md`.
- APIs: `docs/05-contratos-api.md`.
- Seguranca e LGPD: `docs/06-seguranca-lgpd.md`.
- Pitch e entrega: `docs/07-plano-entrega-pitch.md`.
- Estrutura: `docs/08-estrutura-do-projeto.md`.
- Docker e ambientes: `docs/09-docker-e-ambientes.md`.
- MVP implementado: `docs/10-mvp-implementado.md`.
- Configuracao Oracle FIAP: `docs/11-configuracao-oracle-fiap.md`.
- Status e proximos passos: `docs/12-status-projeto-e-proximos-passos.md`.
- Clean Architecture e SOLID: `docs/13-clean-architecture-solid.md`.
