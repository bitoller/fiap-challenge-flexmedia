Frontend:

Checkin:
[ ] a tela de pagamento no checkin landscape está sem a linha dourada nos 3 idiomas. o portrait está normal e bom.
[ ] a tela de erro do checkin landscape está com o card "dançando" entre idiomas, e em portrait além do card "dançando", dois idiomas estão sem a linha dourada.

Checkout:
[ ] a tela de finalizar checkout está boa, tirando a versão landscape em espanhol, onde os cards estão "dançando" e está sem a linha dourada.
[ ] a tela de erro do checkout landscape está com o card "dançando" entre idiomas e alguns idiomas sem a linha dourada, e em portrait temos o card "dançando" e dois idiomas estão sem a linha dourada.

Services:
[ ] não foi implementado e não segue o padrão de cores ou design do resto.


Admin dashboard:

[ ] precisa ter sua palleta de cores trocada pra flexmedia e o nome no canto superior esquerdo para flexmedia.
[ ] precisa seguir o formato de design do kiosk e ser melhorado.
[ ] os dados tem que ser passados para algo que uma pessoa fora de tech consiga ler (exemplo os erros nas reservas que estão em JSON deveriam abrir uma pop up com erro de gente ou as informações no live activity).
[ ] precisa ter as informações em ptbr além de inglês.
[ ] se a sessão expirar não deveria deixar vc logar mesmo que dê erro e não funcione, a pessoa deveria ser redirecionada automaticamente pro login.
[ ] se alguma reserva for criada ou removida a página tem que atualizar automaticamente e ficar na tela de reserva invés de sempre ir pra overview quando atualizada.
[ ] Na parte de criar reserva deveria só aparecer os placeholders nos campos invés de números reais, tirando o nome do hotel que tem que seguir o hotel selecionado e o código de reserva que deveria ter que começar por padrão com RSV- já que o teclado do checkin está configurado assim.
[ ] Rever nas reservas sobre o ícone de "reception required" e pq ele sempre aparece e fazer parse das informações como "RESERVATION_STATUS_CHECKED_OUT" ou "RESERVATION_STATUS_CHECKED_OUT" para frases para pessoas não tech.
[ ] Remover o identity completamente pq ele faria a mesma coisa que o branding e só deixar o branding.
[ ] Deixar o branding como o dourado padrão e ter um botão de reset que volta para o dourado padrão.
[ ] Permitir que o branding mude primary color e accent color na aplicação inteira e que permita a troca do logo.
[ ] Se ainda sobrar tokens, mandar o open spec remover código duplicado e aplicar clean code.