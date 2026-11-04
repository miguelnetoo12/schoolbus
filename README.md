# SchoolBus – Rotas Escolares

Sistema de gestão de transporte escolar: painel, mapa de rotas, cadastro de alunos, motoristas, ônibus e escolas, organização de rotas com otimização de paradas, embarque, avisos de atraso e área dos responsáveis.

Feito só com **HTML, CSS e JavaScript**, sem instalar nada.

## Estrutura

```
schoolbus/
├── index.html            Estrutura da página
├── css/style.css         Visual (cores azul, branco e amarelo nas variáveis do :root)
├── js/config.js          ← configuração (Firebase e usuários de teste)
├── js/dados-iniciais.js  Escolas, rotas, ônibus, motoristas e alunos de exemplo
├── js/banco-local.js     Banco de dados no navegador (localStorage)
├── js/script.js          Todo o sistema
├── firestore.rules       Regras de segurança para o Firebase
└── README.md
```

## 1. Abrir no VS Code

1. Abra a pasta no VS Code.
2. Instale a extensão **Live Server** (Ritwick Dey).
3. Clique com o botão direito em `index.html` → **Open with Live Server**.

O sistema abre no **modo local**: os dados ficam salvos no seu navegador.

- Quem abre sem entrar é tratado como **Responsável**.
- Clique em **Entrar** (canto superior direito) para usar como equipe:

| Usuário | Senha | Nível |
|---|---|---|
| `admin` | `admin123` | Administrador |
| `motorista` | `motorista123` | Motorista / Operador |

Mude esses usuários em `js/config.js`.

Para testar a Área dos responsáveis, use um dos códigos que estão no topo de `js/dados-iniciais.js`.

## 2. Publicar no GitHub Pages

1. Crie um repositório no GitHub e envie todos os arquivos (mantendo as pastas `css` e `js`).
2. No repositório: **Settings → Pages → Branch: main / (root) → Save**.
3. Em 1 ou 2 minutos o site fica em `https://SEU-USUARIO.github.io/NOME-DO-REPOSITORIO/`.

**Atenção:** sem o Firebase, cada visitante tem o **próprio** banco no navegador. O que você cadastrar não aparece para os outros, e os usuários de teste ficam visíveis no código. Para um sistema de verdade, faça o passo 3.

## 3. Banco de dados compartilhado com Firebase (gratuito)

Com o Firebase, todos veem os mesmos dados, a equipe entra com e-mail e senha e os dados pessoais dos alunos ficam protegidos pelo servidor.

1. Acesse <https://console.firebase.google.com> e crie um projeto (ex.: `schoolbus-teresina`). O Google Analytics pode ficar desligado.
2. **Firestore Database → Criar banco de dados** → modo de produção → região `southamerica-east1` (São Paulo).
3. Ainda no Firestore, aba **Regras**: apague o conteúdo, cole o arquivo `firestore.rules` e clique em **Publicar**.
4. **Authentication → Vamos começar → E-mail/senha → Ativar**.
5. **Authentication → Users → Add user**: crie a sua conta (seu e-mail e uma senha). Copie o **User UID** que aparece na lista.
6. **Firestore → Iniciar coleção** com o nome `usuarios`:
   - ID do documento: cole o seu **User UID**
   - campo `papel` (string) = `admin`
   - campo `nome` (string) = seu nome
7. **Configurações do projeto (engrenagem) → Seus apps → `</>` (Web)** → registre o app e copie o objeto `firebaseConfig`.
8. Cole esse objeto em `js/config.js`, no lugar de `firebase: null`.
9. **Authentication → Settings → Authorized domains → Add domain**: adicione `SEU-USUARIO.github.io`.
10. Envie as alterações para o GitHub, abra o site, clique em **Entrar** com seu e-mail e senha.
11. Em **Acesso e privacidade → Backup dos dados**, clique em **Carregar dados iniciais** para enviar as escolas, rotas e ônibus para o Firebase.

Para dar acesso a um motorista: crie a conta dele em **Authentication → Add user**, copie o UID e cadastre em **Acesso e privacidade → Usuários da equipe**.

As chaves do `firebaseConfig` podem ficar públicas no GitHub: quem protege os dados são as regras do `firestore.rules`.

## Níveis de acesso

| Nível | O que faz |
|---|---|
| Administrador | Cadastra e edita alunos, motoristas, ônibus, escolas, rotas e usuários |
| Motorista / Operador | Vê os alunos da rota, marca embarque e desembarque, informa atrasos e alterações |
| Responsável (público) | Acompanha o aluno pelo código: rota, ponto, horários, ônibus no mapa e avisos |

## Observações

- A posição dos ônibus no mapa é calculada pelo **horário programado** mais o atraso informado pelo motorista. Não há GPS.
- Distância e tempo são estimados pela distância entre as paradas, um fator de via e a velocidade média (ajustáveis em **Escolas e cálculo**). Cada rota e parada tem um botão para abrir o trajeto real no Google Maps.
- As coordenadas das paradas e escolas são aproximadas. Ajuste em **Rotas → Editar** (clique no mapa ou cole coordenadas copiadas do Google Maps).
- Faça backups em **Acesso e privacidade → Exportar backup**.
