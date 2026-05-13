# Docker

Material de apoio para ambiente local e futura containerizacao.

## Status

O compose principal da raiz sobe a demo completa usando Oracle FIAP remoto:

```bash
docker compose up --build
```

Este diretorio fica como apoio para fallback Oracle local e futura containerizacao mais completa.

## Oracle Local Opcional

O `docker-compose.yml` da raiz pode subir um Oracle local caso a equipe precise trabalhar sem acesso ao banco FIAP.

```bash
docker compose --profile oracle-local up -d oracle-db
```

Parar:

```bash
docker compose down
```

Apagar volume local:

```bash
docker compose down -v
```

## Quando Usar

Use Docker se:

- o Oracle FIAP estiver indisponivel;
- for preciso testar DDL destrutivo fora do schema compartilhado;
- a equipe decidir empacotar os servicos para demo.

## Evolucao

Proximos containers planejados:

- `checkin-service`
- `api-gateway`
- `kiosk-web`
- mocks dos microservicos externos
