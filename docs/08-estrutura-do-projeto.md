# Estrutura do Projeto

## 1. Objetivo da Estrutura

A estrutura foi pensada para mostrar maturidade arquitetural sem perder a capacidade de entrega. Ela separa dominios de negocio, deixa claro o que cada microservico faz e permite apresentar para a banca uma evolucao natural do MVP para um produto real.

## 2. Organizacao Geral

```text
backend/
  services/
    api-gateway/
    identity-service/
    reservation-service/
    checkin-service/
    key-service/
    payment-service/
    biometry-service/
    notification-service/
    device-service/
    pms-adapter-service/
frontend/
  kiosk-web/
  admin-web/
database/
  oracle/
docs/
  diagramas/
infra/
  docker/
docker-compose.yml
.env.example
```

## 3. Ordem Recomendada de Implementacao

### Etapa 1 - MVP navegavel

Criar o `kiosk-web` com telas navegaveis e dados mockados. Isso ajuda muito na mentoria e no video.

### Etapa 2 - Banco Oracle

Subir o Oracle pelo Docker Compose ou usar o Oracle da faculdade. O backend cria as tabelas pelas entidades JPA; depois execute `seed.sql` para carregar reservas, hospedes, quartos e totem.

### Etapa 3 - Servicos principais

Implementar:

- `reservation-service`
- `checkin-service`
- `payment-service` mockado
- `key-service` mockado

### Etapa 4 - Integracao

Conectar `kiosk-web` ao backend pelo `api-gateway` ou diretamente aos servicos durante desenvolvimento.

### Etapa 5 - Painel e diferenciais

Implementar `admin-web`, `device-service`, auditoria, dashboard e fluxo de excecao.

## 4. Escopo dos Servicos no MVP

| Servico | MVP | Evolucao |
| --- | --- | --- |
| api-gateway | Roteamento e CORS | JWT, rate limit e agregacao |
| identity-service | Login admin simples ou mock | RBAC completo e tokens tecnicos |
| reservation-service | CRUD e busca de reservas | Sincronizacao real com PMS |
| checkin-service | Orquestracao check-in/check-out | Saga robusta e contingencia |
| key-service | Chave digital simulada | RFID, QR real e mobile key |
| payment-service | Pagamento simulado | Adquirente real e conciliacao |
| biometry-service | Resultado simulado | Provedor facial com prova de vida |
| notification-service | Registro de envio | E-mail, SMS e WhatsApp |
| device-service | Status do totem | Monitoramento de hardware |
| pms-adapter-service | PMS mock | Conectores por fornecedor |

## 5. Padrao Interno dos Microservicos

Cada servico Java deve seguir uma divisao simples:

```text
src/main/java/br/com/fiap/flexcheck/<service>/
  controller/       Controllers REST e tratamento de erro
  dto/              Requests e responses
  mapper/           Conversoes entre API, service e dominio
  service/          Casos de uso, comandos e resultados
  repository/       Interfaces usadas pelos services
  domain/           Entidades, regras e excecoes de negocio
  infrastructure/
    persistence/
      entity/       Entidades JPA que criam as tabelas
    repository/     Implementacoes JDBC/JPA dos contratos
  config/           Configuracoes Spring
src/test/java/
```

## 6. Convencoes de Nome

- Classes de caso de uso: `CreateCheckinSessionUseCase`.
- Controllers: `CheckinSessionController`.
- DTOs de entrada: `CreateSessionRequest`.
- DTOs de saida: `SessionResponse`.
- Repositorios: `CheckinSessionRepository`.
- Entidades JPA: nomes proximos das tabelas, como `CheckinSession`.

## 7. Estrategia de Demonstracao

Para a entrega, a demonstracao deve ser previsivel:

- Usar dados fixos do `seed.sql`.
- Usar cartao de teste aprovado e recusado.
- Usar reserva aprovada e reserva com excecao.
- Mostrar logs ou painel apenas quando agregar valor.
- Evitar depender de integracoes externas reais.

## 8. Proximos Arquivos de Codigo

Quando comecar a implementacao, a primeira base tecnica recomendada e:

- `backend/pom.xml` como projeto pai Maven.
- `backend/services/checkin-service/pom.xml`.
- `backend/services/reservation-service/pom.xml`.
- `frontend/kiosk-web/package.json`.
- `frontend/admin-web/package.json`.

## 9. Docker

Docker entra desde o inicio para padronizar o Oracle. Os servicos Java e React devem ser containerizados depois que o fluxo principal estiver implementado.

Arquivos criados:

- `docker-compose.yml`.
- `.env.example`.
- `infra/docker/README.md`.
- `infra/docker/templates/Dockerfile.spring-boot`.
- `infra/docker/templates/Dockerfile.react-vite`.
