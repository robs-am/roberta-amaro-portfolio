## Why

Ainda não existe um portfólio pessoal público para apresentar experiências profissionais e projetos. O MVP cria essa presença online já bilíngue (PT/EN) e com dark/light mode, sobre uma base preparada para receber uma seção de blog em breve, sem retrabalho no mecanismo de idiomas.

## What Changes

- Novo projeto Next.js (App Router) com TypeScript, a partir de um repositório vazio
- Site de quatro páginas por idioma: a home (uma tela só, o hero), `/about`, `/experience` e `/projects`, todas com header, conteúdo e rodapé. O plano inicial era uma página única com seções âncora; ele foi substituído por páginas próprias (o hero da home já leva ao resto, e cada página tem espaço para crescer)
- Header com o seletor de idioma, o alternador de tema e o botão de menu agrupados em uma única cápsula; o menu abre em tela cheia (com os links para as quatro páginas e os contatos), em qualquer largura de tela
- Internacionalização com rotas por idioma (`/pt`, `/en`), detecção automática do idioma do navegador e fallback para português
- Dark/light mode com persistência da escolha e sem flash de tema incorreto no carregamento
- Experiências, formação, prêmios e projetos alimentados por arquivos de dados tipados, com textos em PT e EN no mesmo item
- Página de trajetória (`/experience`) reunindo experiências, formação e prêmios: prêmios de empresa dentro do cargo, prêmios independentes em painel lateral de destaque, e `/awards` redirecionando para essa página
- Página de projetos (`/projects`) como lista de linhas com painel visual; cada linha abre um diálogo com o detalhe do projeto e o link para ele
- Página `/about` com texto de apresentação e a stack
- Conteúdo real da autora (nome, cargo, experiências, projetos, formação)
- Identidade visual: neutros quase cinza com traço de calor e acento ameixa (rosa no tema escuro), fontes Jost e IBM Plex Sans, textura de grão sobre o fundo, tudo centralizado em tokens
- Formas 3D (anel, nó e duas esferas, com three.js) atrás do texto da home e do menu, reagindo ao ponteiro; brilho de fundo em gradiente nas páginas internas, parado em dispositivos de toque e para quem prefere movimento reduzido
- Layout responsivo a partir de 360px; no celular, a home tem o nome dimensionado pela largura e as formas reunidas abaixo do texto
- Animações de entrada (nome do hero palavra por palavra, linhas das listas ao rolar) e de abertura do menu e do detalhe de projeto, com anime.js e CSS, todas desativadas para quem prefere movimento reduzido

Fora do escopo: blog, seção de contato/formulário, CMS, deploy.

## Capabilities

### New Capabilities
- `localization`: roteamento por idioma (`/pt`, `/en`), detecção do idioma do navegador com fallback PT, troca de idioma mantendo a página e textos de interface traduzidos
- `theme`: alternância entre dark e light mode, respeito à preferência do sistema, persistência da escolha e ausência de flash de tema
- `portfolio-page`: estrutura do site (páginas, header, menu em tela cheia), formas 3D, brilho e textura de fundo, layout responsivo e animações de entrada
- `portfolio-content`: exibição de experiências, formação, prêmios, projetos e da página sobre a partir de dados bilíngues, no idioma ativo

### Modified Capabilities
<!-- Nenhuma: não há specs existentes. -->

## Impact

- Repositório: criação de toda a estrutura da aplicação (hoje só contém o scaffolding do OpenSpec)
- Dependências novas: `next`, `react`, `react-dom`, `typescript`, `tailwindcss`, `next-intl`, `three` (formas 3D) e `animejs` (animações); o tema claro/escuro não usa biblioteca: segue `prefers-color-scheme` e guarda a escolha manual em `components/theme/theme.ts`
- Arquivos principais: `proxy.ts` (ou `middleware.ts`, conforme a versão do Next.js), `app/[locale]/`, `messages/pt.json`, `messages/en.json`, `data/experiences.ts`, `data/education.ts`, `data/awards.ts`, `data/projects.ts`, `data/skills.ts`
- Estrutura de rotas `app/[locale]/` já comporta futuras rotas como `app/[locale]/blog/`
- Os changes `projects-showcase-page` e `portfolio-footer` foram escritos para o plano de página única (seções âncora e cards) e estão desatualizados em relação a este change; precisam ser revistos ou arquivados antes de `portfolio-mvp` ser arquivado
