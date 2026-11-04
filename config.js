/* =====================================================================
   SchoolBus – Configuração
   ---------------------------------------------------------------------
   ESTE É O ÚNICO ARQUIVO QUE VOCÊ PRECISA MEXER PARA PUBLICAR.

   SEM Firebase (firebase: null)
     Os dados ficam só no navegador de quem abre o site. Bom para
     desenvolver no VS Code, mas no GitHub Pages cada visitante teria
     os próprios dados: o que você cadastrar NÃO aparece para os outros.

   COM Firebase
     Todos os visitantes veem os mesmos dados, a equipe entra com
     e-mail e senha e as permissões são protegidas pelo servidor.
     Passo a passo no README.md.
   ===================================================================== */
window.SCHOOLBUS_CONFIG = {

  // 1) Cole aqui o objeto "firebaseConfig" do Console do Firebase
  //    (Configurações do projeto → Seus apps → App da Web).
  //    Deixe null para usar o banco local.
  firebase: null,
  /* Exemplo:
  firebase: {
    apiKey: "AIza...",
    authDomain: "schoolbus-teresina.firebaseapp.com",
    projectId: "schoolbus-teresina",
    storageBucket: "schoolbus-teresina.appspot.com",
    messagingSenderId: "000000000000",
    appId: "1:000000000000:web:0000000000000000"
  },
  */

  // 2) Usuários do MODO LOCAL (sem Firebase). Servem só para testar:
  //    ficam visíveis no código, então NÃO são proteção de verdade.
  usuariosLocais: [
    { usuario: "admin",     senha: "admin123",     papel: "admin",    nome: "Administrador" },
    { usuario: "motorista", senha: "motorista123", papel: "operador", nome: "Motorista" }
  ],

  // No modo local, abre direto como Administrador, com todos os menus
  // (igual ao protótipo). Mude para false para exigir login.
  modoLocalComoAdmin: true,

  // Mostra os usuários de teste na tela de login (modo local).
  mostrarUsuariosDeTeste: true
};
