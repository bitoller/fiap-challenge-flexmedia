-- FlexCheck Hotel - setup completo para Oracle FIAP
-- Execute este arquivo conectado no usuario do projeto, por exemplo rm553134.
--
-- Ordem:
-- 1. Remove tabelas antigas FC_*.
-- 2. Recria estrutura.
-- 3. Insere dados de demonstracao.
-- 4. Mostra validacao final.

@reset.sql
@schema.sql
@seed.sql
@verify.sql

