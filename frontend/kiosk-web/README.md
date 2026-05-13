# kiosk-web

Frontend React do totem de autoatendimento do FlexCheck Hotel.

## Arquitetura

O frontend foi organizado em camadas para manter o fluxo previsível:

- `src/domain/`: tipos e regras de validação.
- `src/data/`: cliente HTTP, endpoints, interceptores, repositórios e mocks.
- `src/presentation/`: layout, componentes, features e hooks.
- `src/i18n/`: configuração do `react-i18next` e traduções por namespace.
- `src/core/`: providers e constantes globais.
- `src/shared/styles/`: tokens visuais, layout kiosk e customizações do Bootstrap.

Veja também [ARCHITECTURE.md](./ARCHITECTURE.md).

## Como rodar

```bash
npm install
npm run dev
```

Abra:

```text
http://127.0.0.1:5173
```

## Mocks ou API real

O frontend tenta a API primeiro e cai para mocks quando houver timeout ou quando os mocks estiverem habilitados.

### Usar API real

```text
VITE_USE_MOCKS=false
VITE_API_URL=http://127.0.0.1:8088/api/v1
VITE_ACTIVE_HOTEL_ID=1
```

### Usar mocks sempre

```text
VITE_USE_MOCKS=true
VITE_MOCK_SCENARIO=SUCCESS
```

### Trocar cenário de mock

- `SUCCESS`
- `NOT_FOUND`
- `INVALID_DOCUMENT`
- `PAYMENT_DECLINED`

## Variáveis de ambiente

- `VITE_API_URL`: base da API.
- `VITE_API_TIMEOUT_MS`: timeout em milissegundos.
- `VITE_USE_MOCKS`: força mocks sem acessar a rede.
- `VITE_MOCK_SCENARIO`: escolhe qual cenário mock usar.
- `VITE_DEFAULT_LANGUAGE`: idioma inicial.
- `VITE_ACTIVE_HOTEL_ID`: hotel usado pelo kiosk para carregar branding e conteúdo.

## Seleção de hotel

O kiosk carrega o perfil do hotel por `VITE_ACTIVE_HOTEL_ID`.

- O valor padrão é `1`.
- O frontend consulta `GET /api/v1/admin/hotels/{hotelId}` através do gateway.
- Se a API ficar indisponível, o kiosk mantém um branding de fallback para não quebrar a tela.

## Idiomas

O kiosk suporta:

- inglês (`en`)
- português do Brasil (`pt-BR`)
- espanhol (`es`)

As traduções ficam em namespaces:

- `common`
- `home`
- `errors`

## Fluxos disponíveis

- Home com seleção de idioma.
- Check-in com rota reservada para o fluxo futuro.
- Check-out com rota reservada para o fluxo futuro.
- Services com rota reservada para o fluxo futuro.

## Build

```bash
npm run build
```

## Observações

- O layout é otimizado para orientação vertical.
- Os botões usam áreas de toque grandes.
- O cliente HTTP injeta `X-Correlation-Id` automaticamente.
