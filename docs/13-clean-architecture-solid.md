# Clean Architecture e SOLID

## 1. Decisao

O `checkin-service` foi reorganized para seguir Clean Architecture.

A regra principal adotada:

```text
Controller -> Service -> Domain
Infrastructure/Repository -> Repository interfaces
```

O dominio nao depende de Spring, JDBC, Oracle, DTO HTTP ou React.

## 2. Estrutura Atual

```text
br.com.fiap.flexcheck.checkin
├── controller
│   ├── KioskController
│   └── ApiExceptionHandler
├── dto
│   └── Dtos
├── mapper
│   ├── ApiMapper
│   └── ResultMapper
├── service
│   ├── command
│   ├── result
│   └── *UseCase
├── repository
│   └── interfaces
├── domain
│   ├── entity
│   ├── exception
│   └── service
├── infrastructure
│   ├── persistence
│   │   └── entity
│   └── repository
└── config
```

## 3. Responsabilidade de Cada Camada

### controller

Camada de entrada HTTP.

Responsabilidades:

- Receber requests REST.
- Validar DTOs com Bean Validation.
- Tratar erros.

Nao deve conter regra de Business.

### dto

Contratos de entrada e saida da API.

Responsabilidades:

- Representar requests e responses HTTP.
- Declarar validacoes simples de formato e obrigatoriedade.
- Evitar expor diretamente entidades de dominio.

### mapper

Camada de conversao.

Responsabilidades:

- Converter DTOs para comandos de service.
- Converter resultados de service para DTOs de resposta.
- Isolar mudancas de contrato HTTP das Business Rules.

### service

Camada de use cases.

Responsabilidades:

- Orquestrar Flows de Business.
- Usar interfaces de repository.
- Controlar transacoes.
- Decidir mensagens de erro de caso de uso.

use cases atuais:

- `CreateSessionUseCase`
- `AttachreservationUseCase`
- `SearchreservationUseCase`
- `ConfirmGuestUseCase`
- `RegisterConsentsUseCase`
- `CompleteCheckinUseCase`
- `CheckoutUseCase`
- `DashboardUseCase`

### domain

Centro da regra de Business.

Responsabilidades:

- Modelos de Business.
- Politicas de dominio.
- Excecoes de Business sem dependency de framework.

Exemplo:

- `reservation`
- `Guest`
- `Room`
- `Stay`
- `reservationEligibilityPolicy`

### infrastructure

Camada de detalhes tecnicos.

Responsabilidades:

- Entidades JPA para criacao das tables pelo Hibernate.
- JDBC.
- Oracle/H2.
- Queries SQL.
- Implementation concreta das interfaces de repository.

Implementation atual:

- `JdbcFlexcheckRepository`
- `*JpaEntity` em `infrastructure/persistence/entity`

As entidades JPA ficam na infraestrutura para preservationr o dominio limpo. Assim, o banco nasce pelas entidades sem acoplar as Business Rules ao Hibernate.

## 4. Interfaces de Repository

Os services dependem de interfaces, nao do banco diretamente:

- `reservationRepository`
- `SessionRepository`
- `GuestRepository`
- `ConsentRepository`
- `VerificationRepository`
- `PaymentRepository`
- `StayRepository`
- `KeyRepository`
- `AuditRepository`
- `DashboardRepository`

Isso permite trocar Oracle por mock, outro banco ou API externa sem mudar os use cases.

## 5. Aplicacao dos Principios SOLID

### S - Single Responsibility

Cada caso de uso tem uma responsabilidade clara. Exemplo: `CheckoutUseCase` cuida apenas do stay checkout.

### O - Open/Closed

Novas integracoes podem ser adicionadas criando novas implementacoes das interfaces, sem alterar os use cases.

### L - Liskov Substitution

Qualquer Implementation de repository pode substituir outra, desde que respeite o contrato.

### I - Interface Segregation

As interfaces foram separadas por capacidade, evitando uma interface gigante para todo o sistema.

### D - Dependency Inversion

Os use cases dependem de abstracoes. O JDBC implementa os repositories, mas nao e conhecido pelo dominio.

## 6. test Criado

Foi criado um test de Flow direto nos use cases:

```text
CheckinFlowUseCaseTest
```

Ele valida:

1. Criacao de Session.
2. Busca/anexo de reservation.
3. Confirmation de Data.
4. Registro de consentimentos.
5. check-in.
6. key issuance.
7. check-out.

Esse test roda sem servidor web, usando H2 em memoria.
No perfil de test, o H2 tambem cria as tables pelas entidades JPA e usa `data.sql` apenas para popular Data.

## 7. Como Evoluir

Next steps mantendo a Architecture:

- Separar `reservation-service` real implementando os mesmos conceitos.
- Criar `payment-service` e trocar a Implementation de `PaymentRepository` por client REST.
- Criar `key-service` e trocar a Implementation de `KeyRepository` por client REST.
- Adicionar tests unitarios para `reservationEligibilityPolicy`.
- Adicionar tests de casos de erro, como Payment recusado e document rejeitado.
