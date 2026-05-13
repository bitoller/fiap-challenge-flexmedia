# Clean Architecture e SOLID

## 1. Decisao

O `checkin-service` foi reorganizado para seguir Clean Architecture.

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

Nao deve conter regra de negocio.

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
- Isolar mudancas de contrato HTTP das regras de negocio.

### service

Camada de casos de uso.

Responsabilidades:

- Orquestrar fluxos de negocio.
- Usar interfaces de repository.
- Controlar transacoes.
- Decidir mensagens de erro de caso de uso.

Casos de uso atuais:

- `CreateSessionUseCase`
- `AttachReservationUseCase`
- `SearchReservationUseCase`
- `ConfirmGuestUseCase`
- `RegisterConsentsUseCase`
- `CompleteCheckinUseCase`
- `CheckoutUseCase`
- `DashboardUseCase`

### domain

Centro da regra de negocio.

Responsabilidades:

- Modelos de negocio.
- Politicas de dominio.
- Excecoes de negocio sem dependencia de framework.

Exemplo:

- `Reservation`
- `Guest`
- `Room`
- `Stay`
- `ReservationEligibilityPolicy`

### infrastructure

Camada de detalhes tecnicos.

Responsabilidades:

- Entidades JPA para criacao das tabelas pelo Hibernate.
- JDBC.
- Oracle/H2.
- Queries SQL.
- Implementacao concreta das interfaces de repository.

Implementacao atual:

- `JdbcFlexcheckRepository`
- `*JpaEntity` em `infrastructure/persistence/entity`

As entidades JPA ficam na infraestrutura para preservar o dominio limpo. Assim, o banco nasce pelas entidades sem acoplar as regras de negocio ao Hibernate.

## 4. Interfaces de Repository

Os services dependem de interfaces, nao do banco diretamente:

- `ReservationRepository`
- `SessionRepository`
- `GuestRepository`
- `ConsentRepository`
- `VerificationRepository`
- `PaymentRepository`
- `StayRepository`
- `KeyRepository`
- `AuditRepository`
- `DashboardRepository`

Isso permite trocar Oracle por mock, outro banco ou API externa sem mudar os casos de uso.

## 5. Aplicacao dos Principios SOLID

### S - Single Responsibility

Cada caso de uso tem uma responsabilidade clara. Exemplo: `CheckoutUseCase` cuida apenas do encerramento da estadia.

### O - Open/Closed

Novas integracoes podem ser adicionadas criando novas implementacoes das interfaces, sem alterar os casos de uso.

### L - Liskov Substitution

Qualquer implementacao de repository pode substituir outra, desde que respeite o contrato.

### I - Interface Segregation

As interfaces foram separadas por capacidade, evitando uma interface gigante para todo o sistema.

### D - Dependency Inversion

Os casos de uso dependem de abstracoes. O JDBC implementa os repositories, mas nao e conhecido pelo dominio.

## 6. Teste Criado

Foi criado um teste de fluxo direto nos casos de uso:

```text
CheckinFlowUseCaseTest
```

Ele valida:

1. Criacao de sessao.
2. Busca/anexo de reserva.
3. Confirmacao de dados.
4. Registro de consentimentos.
5. Check-in.
6. Emissao de chave.
7. Check-out.

Esse teste roda sem servidor web, usando H2 em memoria.
No perfil de teste, o H2 tambem cria as tabelas pelas entidades JPA e usa `data.sql` apenas para popular dados.

## 7. Como Evoluir

Proximos passos mantendo a arquitetura:

- Separar `reservation-service` real implementando os mesmos conceitos.
- Criar `payment-service` e trocar a implementacao de `PaymentRepository` por client REST.
- Criar `key-service` e trocar a implementacao de `KeyRepository` por client REST.
- Adicionar testes unitarios para `ReservationEligibilityPolicy`.
- Adicionar testes de casos de erro, como pagamento recusado e documento rejeitado.
