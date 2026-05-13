# Frontend

Aplicacoes web do FlexCheck Hotel.

## Aplicacoes

- `kiosk-web`: implementada. Interface React do totem.
- `admin-web`: planejada. Painel de recepcao e operacao.

## Stack

- React
- TypeScript
- Vite
- CSS simples no MVP
- API via `VITE_API_URL`

## Rodar o Totem

```bash
cd frontend/kiosk-web
npm install
npm run dev
```

Padrao de API:

```text
http://127.0.0.1:8080/api/v1
```

Com backend em outra porta:

```bash
VITE_API_URL=http://127.0.0.1:8081/api/v1 npm run dev
```

Via gateway:

```bash
VITE_API_URL=http://127.0.0.1:8088/api/v1 VITE_ACTIVE_HOTEL_ID=1 npm run dev
```

Exemplo de ambiente local:

- [frontend/kiosk-web/.env.example](./kiosk-web/.env.example)

O kiosk busca o hotel ativo por `VITE_ACTIVE_HOTEL_ID` e usa o perfil retornado pelo `admin-service` para nome, cores e conteúdo de marca.

## Demo com Docker

Na raiz do projeto:

```bash
docker compose up --build
```

O totem fica em:

```text
http://127.0.0.1:3000
```

## Fluxo do Totem

1. Escolher check-in ou checkout.
2. Buscar reserva.
3. Confirmar dados.
4. Aceitar termos.
5. Simular documento/biometria.
6. Simular pagamento.
7. Emitir chave.
8. Fazer checkout.

## Pastas

- [kiosk-web](kiosk-web/README.md)
- [admin-web](admin-web/README.md)
