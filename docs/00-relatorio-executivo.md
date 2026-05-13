# Relatorio Executivo

## 1. Contexto

A Flexmedia atua em solucoes tecnologicas para seguranca, automacao, telecom, broadcast, ITS e digital signage. O desafio proposto pede um totem de autoatendimento para o setor hoteleiro, permitindo check-in e check-out automatizados com integracao a PMS, emissao de chaves, reconhecimento facial e funcionalidades adicionais.

O projeto proposto, chamado FlexCheck Hotel, usa a experiencia da Flexmedia com hardware, automacao e atendimento em campo para criar uma solucao aplicavel a hoteis de diferentes portes.

## 2. Problema Identificado

O check-in e check-out tradicional em hoteis costuma depender de atendimento presencial, fila na recepcao, conferencia manual de dados, confirmacao de pagamento, emissao manual de chave e consulta ao PMS. Esse processo gera:

- Tempo de espera para hospedes, especialmente em horarios de pico.
- Sobrecarga da recepcao com tarefas repetitivas.
- Risco de erro humano na conferencia de documentos, reservas e pagamentos.
- Experiencia inconsistente entre turnos e unidades.
- Baixa rastreabilidade de decisoes operacionais.

## 3. Publico Afetado

- Hospedes: querem rapidez, autonomia, seguranca e menor atrito.
- Recepcionistas: precisam reduzir tarefas repetitivas e atuar em casos de excecao.
- Gerentes de hotel: buscam eficiencia operacional, padronizacao e dados confiaveis.
- Redes hoteleiras: precisam integrar unidades, PMS e processos comuns.
- Flexmedia: pode expandir sua linha de totens e digital signage para automacao hoteleira.

## 4. Solucao Proposta

O FlexCheck Hotel e uma plataforma composta por:

- Aplicacao React para o totem.
- Painel administrativo React para acompanhamento operacional.
- Microservicos Java para reservas, check-in, chaves, pagamentos, biometria, dispositivos e integracao PMS.
- Banco Oracle SQL para persistencia transacional.
- Camada de integracao para PMS e equipamentos do totem.

O hospede usa o totem para localizar a reserva, confirmar dados, validar documento, aceitar termos, realizar pagamento/pre-autorizacao e receber a chave. No check-out, o hospede revisa consumo, confirma pagamento e encerra a estadia.

## 5. Proposta de Valor

- Reducao de filas e tempo medio de atendimento.
- Operacao 24x7 sem depender integralmente da recepcao.
- Processo padronizado e auditavel.
- Melhor experiencia para hospedes digitais.
- Possibilidade de upsell, como late check-out, upgrade de quarto e servicos extras.
- Produto aderente ao portifolio tecnologico da Flexmedia.

## 6. Escopo do MVP

O MVP deve ser pequeno o suficiente para funcionar bem na entrega, mas completo o suficiente para demonstrar valor.

Inclui:

- Fluxo de check-in no totem.
- Busca de reserva por CPF/passaporte, codigo da reserva ou QR Code simulado.
- Confirmacao de dados do hospede.
- Aceite de termos e consentimento LGPD.
- Simulacao de validacao de documento.
- Simulacao de reconhecimento facial com fallback manual.
- Simulacao de pagamento ou pre-autorizacao.
- Emissao de chave digital ou fisica simulada.
- Fluxo de check-out com fechamento de pendencias.
- Painel administrativo simples para acompanhar sessoes e reservas.
- Banco Oracle com dados reais de teste.

Nao inclui no MVP:

- Integracao real com PMS comercial.
- Integracao real com adquirente de cartao.
- Emissao real de cartao RFID, se o equipamento nao estiver disponivel.
- Biometria facial produtiva com provedor homologado.
- Multi-idioma completo, embora a arquitetura de frontend deva permitir evolucao.

## 7. Diferenciais para a Banca

- Arquitetura preparada para PMS reais por meio de adaptadores.
- Tratamento LGPD para dados sensiveis e biometricos.
- Modo contingencia para falhas de rede ou PMS indisponivel.
- Auditoria completa das operacoes.
- Design acessivel para uso em totem.
- Painel operacional com status dos totens e falhas.
- Fluxos de excecao bem definidos, evitando a sensacao de prototipo incompleto.

## 8. Metricas de Sucesso

- Tempo medio de check-in abaixo de 3 minutos no MVP.
- Check-in concluido sem ajuda humana em pelo menos 80% dos casos simulados.
- Check-out concluido em menos de 2 minutos quando nao houver pendencias.
- Reducao de etapas manuais da recepcao.
- Registro auditavel de 100% das transacoes sensiveis.
- Disponibilidade logica do totem com fallback para atendimento assistido.

## 9. Cronograma de Execucao

Datas relevantes do desafio:

- 08/04/2026: primeira mentoria.
- 13/05/2026: segunda mentoria.
- 24/05/2026: entrega da Sprint.
- 17/06/2026: banca final.

Como hoje e 11/05/2026, a prioridade imediata e chegar na segunda mentoria de 13/05/2026 com uma narrativa clara, arquitetura definida, escopo fechado e primeiras telas ou fluxo navegavel.

Plano sugerido:

- Ate 13/05/2026: validar problema, solucao, arquitetura e prototipo visual.
- Ate 18/05/2026: implementar base backend, banco Oracle e fluxo principal do totem.
- Ate 21/05/2026: integrar frontend com APIs e simular PMS, pagamento e chave.
- Ate 23/05/2026: gravar pitch, testar demo e preparar ZIP.
- 24/05/2026: entregar sprint.
- Ate 17/06/2026: polir UX, incluir painel, metricas, auditoria e narrativa de escala.

## 10. Visao de Continuidade

Apos o MVP, o produto pode evoluir para:

- Integracao com PMS reais usados no mercado hoteleiro.
- Emissao real de chaves RFID ou QR Code.
- App mobile para chave digital.
- Reconhecimento facial homologado com prova de vida.
- Pagamentos reais com adquirente.
- Suporte multi-hotel e multi-rede.
- Analytics de atendimento, filas, conversao e falhas.
- Oferta de servicos adicionais no totem.

