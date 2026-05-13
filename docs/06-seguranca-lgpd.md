# Seguranca e LGPD

## 1. Principios

O FlexCheck Hotel trata dados pessoais, dados financeiros e possivelmente dados biometricos. Por isso, a arquitetura deve seguir tres principios:

- Minimizar coleta.
- Proteger dados em repouso e em transito.
- Dar transparencia e alternativa ao hospede.

## 2. Dados Pessoais Tratados

- Nome.
- Documento.
- Data de nascimento.
- Nacionalidade.
- Telefone.
- E-mail.
- Dados de reserva.
- Dados de pagamento tokenizados ou simulados.
- Resultado de validacao documental.
- Resultado de biometria, se houver consentimento.

## 3. Dados Sensiveis

Biometria facial e considerada dado pessoal sensivel. O MVP deve tratar isso com cuidado na narrativa:

- Biometria e opcional.
- Existe fallback sem biometria.
- Consentimento e registrado separadamente.
- Imagem bruta nao deve ser persistida.
- Se houver template, deve ser criptografado ou substituido por referencia de provedor.

## 4. Bases Legais

Possiveis bases legais para explicar no trabalho:

- Execucao de contrato: dados necessarios para hospedagem.
- Obrigacao legal/regulatoria: dados exigidos para hospedagem e controle.
- Legitim interesse: seguranca operacional, desde que proporcional.
- Consentimento: biometria e comunicacoes opcionais.

## 5. Controles de Seguranca

### Autenticacao

- Operadores usam login e senha.
- Totens usam token tecnico associado ao dispositivo.
- Tokens possuem expiracao.

### Autorizacao

Papeis sugeridos:

- `ADMIN`: configura hotel, usuarios e politicas.
- `MANAGER`: acompanha operacao e relatorios.
- `RECEPTIONIST`: resolve excecoes.
- `AUDITOR`: consulta auditoria.
- `KIOSK`: executa fluxos do totem.

### Criptografia

- HTTPS em producao.
- Senhas com BCrypt.
- Dados sensiveis criptografados ou tokenizados.
- Segredos fora do repositorio.

### Logs

Logs nao devem conter:

- Numero completo de documento.
- Dados de cartao.
- Imagens.
- Template biometrico.
- Token de autenticacao.

### Auditoria

Auditar:

- Login administrativo.
- Busca de reserva.
- Alteracao de dados do hospede.
- Aceite ou negativa de consentimento.
- Resultado de documento.
- Resultado de biometria.
- Pagamento.
- Emissao/revogacao de chave.
- Check-in e check-out.
- Encaminhamento para recepcao.

## 6. Ameacas e Mitigacoes

| Ameaca | Exemplo | Mitigacao |
| --- | --- | --- |
| Uso indevido de reserva | Pessoa tenta usar reserva de terceiro | Validacao de documento, biometria opcional, codigo e dados pessoais |
| Duplicidade de check-in | Duas tentativas simultaneas | Idempotency key e trava por reserva |
| Vazamento de dados | Logs com documento ou imagem | Mascaramento e politica de logs |
| Falha de PMS | PMS indisponivel no pico | Modo contingencia e reconciliacao |
| Pagamento duplicado | Reenvio de requisicao | Idempotencia por transacao |
| Totem comprometido | Token roubado | Token tecnico revogavel, escopo limitado e monitoramento |
| Falso negativo facial | Hospede legitimo rejeitado | Fallback e atendimento humano |

## 7. Politica de Retencao Sugerida

- Sessoes temporarias: expirar apos inatividade.
- Auditoria: manter conforme regra do hotel.
- Consentimentos: manter enquanto houver necessidade de comprovacao.
- Biometria: nao armazenar imagem no MVP.
- Comprovantes: manter conforme politica fiscal e operacional.

## 8. Mensagem de Consentimento para o Totem

Texto sugerido para o MVP:

"Usaremos seus dados para confirmar sua reserva e concluir sua hospedagem. O reconhecimento facial e opcional e serve apenas para validacao de identidade neste atendimento. Voce pode continuar sem biometria e, se preferir, solicitar apoio da recepcao."

