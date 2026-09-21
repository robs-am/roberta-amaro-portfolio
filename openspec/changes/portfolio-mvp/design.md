## Context

O repositório começou vazio (só o scaffolding do OpenSpec), então não há código legado nem restrição de compatibilidade. Motivação e escopo estão em `proposal.md`; o comportamento esperado está nas specs de `localization`, `theme`, `portfolio-page` e `portfolio-content`.

A restrição que mais molda a arquitetura é o blog planejado para os próximos meses: ele precisa de URLs indexáveis por idioma. Por isso o i18n já nasce baseado em rotas, mesmo o MVP sendo uma página só.

O plano inicial era uma página única com seções âncora (hero, experiências, projetos). Ele foi trocado por um site de quatro páginas: a home é só o hero (uma tela, com formas 3D), e sobre, experiências e projetos têm páginas próprias, alcançadas pelo menu em tela cheia ou pelos links do hero. Não há mais âncoras `#experience`, `#projects` nem `#hero`.

A identidade visual partiu de uma referência da autora (https://www.alignerr.com/en/process: fundo escuro com brilho que reage ao mouse, cards com borda sutil), mas foi se afastando dela: o teal virou uma paleta ameixa/rosa sobre neutros quase cinza, e o hero ganhou formas 3D. As animações de entrada e hover seguem uma segunda referência, https://tubikstudio.com/works, sem adotar a tipografia dela. Os valores vigentes estão em `app/globals.css` e em `docs/design-system.md`.

## Goals / Non-Goals

**Goals:**
- Páginas renderizadas no servidor e geradas estaticamente para cada idioma
- JavaScript no cliente restrito aos controles interativos (idioma, tema, menu), às formas 3D, ao brilho de fundo, ao detalhe de projeto e às animações de entrada
- Estrutura `app/[locale]/` que aceite `blog/` depois sem mexer no que já existe
- Identidade visual centralizada em tokens, para ajustar cores, fontes e movimento sem tocar nos componentes

**Non-Goals:**
- Suporte a mais de dois idiomas (a estrutura permite, mas não será testada)
- WebGL fora das formas 3D decorativas (o fundo em si é CSS) ou animação contínua do brilho enquanto o ponteiro está parado
- Bibliotecas de animação além do anime.js (GSAP, Framer Motion) ou rolagem suavizada por JavaScript
- Fontes pagas (a "The Future" da Alignerr e a Lausanne do Tubik ficam de fora)
- Testes automatizados end-to-end (verificação manual pelas specs no MVP)
- Analytics, SEO avançado (sitemap, Open Graph images), deploy

## Decisions

### Estrutura de pastas

`components/` é organizado por assunto, não por tipo de arquivo: cada pasta responde "de que parte do site é isso?". A raiz de `components/` fica vazia.

```
app/
  [locale]/
    layout.tsx            <html lang>, fontes, script de tema, brilho, grão, header, rodapé, metadados
    page.tsx              home (só o hero)
    about/page.tsx        sobre e stack
    experience/page.tsx   trajetória: experiências, formação e prêmios
    projects/page.tsx     todos os projetos
    not-found.tsx
    [...rest]/page.tsx    notFound() para caminhos inexistentes
    opengraph-image.tsx
  globals.css             Tailwind + tokens de tema e movimento
  sitemap.ts
  robots.ts
components/
  header/                 Header, HeaderShell, HideOnHome, HomeLink, BackButton, ControlDock,
                          LocaleSwitcher, Menu, MenuShapes, menuEvents, navItems, capsuleIcon
  theme/                  theme.ts (lógica do tema), ThemeSync, ThemeToggle
  home/                   Hero, HeroShapes, ContactIcons
  shapes/                 shapesScene, shapeStyle, hoverSpin (3D compartilhado entre hero e menu)
  experience/             ExperienceTimeline, EducationTimeline, ExperienceEntrance, AwardHighlight
  projects/               ProjectShowcase
  background/             BackgroundGlow, Grain
  layout/                 Footer, ScrollReset
  ui/                     ArrowIcon, textLinkStyles (usados em mais de uma parte)
data/
  types.ts
  profile.ts              nome, título, bio (hero)
  experiences.ts
  education.ts
  awards.ts
  projects.ts
  skills.ts
  site.ts                 URL do site e lista de rotas (sitemap)
i18n/
  routing.ts              locales, defaultLocale
  request.ts              carrega messages por locale
  navigation.ts           Link/useRouter cientes do locale
  alternates.ts           hreflang e mapa de idiomas
messages/
  pt.json
  en.json
proxy.ts
next.config.ts            redirect permanente de /awards para /experience
```

### Next.js App Router + TypeScript estrito
App Router é o padrão atual e o que o next-intl suporta com mais recursos (Server Components traduzidos). Pages Router foi descartado por estar em modo de manutenção. `strict: true` no TypeScript é pré-requisito da decisão de "tradução obrigatória" abaixo.

### i18n com next-intl e prefixo sempre presente
- `locales: ['pt', 'en']`, `defaultLocale: 'pt'`, `localePrefix: 'always'`: toda URL tem prefixo, então `/` sempre redireciona e nunca existe conteúdo duplicado sem prefixo.
- Detecção pelo `Accept-Language` e cookie de preferência (`NEXT_LOCALE`) ficam a cargo do proxy do next-intl (`proxy.ts`, nome do antigo `middleware.ts` a partir do Next.js 16), que já implementa a ordem cookie > navegador > default exigida pela spec.
- `generateStaticParams` no layout e leitura do idioma com `next/root-params` em `i18n/request.ts`, para que `/pt` e `/en` sejam gerados estaticamente. Isso substitui `setRequestLocale`/`requestLocale`, marcados como deprecated no next-intl 4.
- Caminhos sem prefixo válido (ex: `/fr`) são redirecionados pelo proxy para `/<idioma>/fr`, que responde 404 via `app/[locale]/[...rest]/page.tsx`. Forçar 404 direto no proxy exigiria adivinhar quais segmentos "parecem idioma" e quebraria rotas futuras sem prefixo, como `/blog`.
- `lang` do `<html>`: o código de rota é `pt`, mas o atributo usa `pt-BR`. Um mapa simples `{ pt: 'pt-BR', en: 'en' }` resolve isso.
- `hreflang` via `alternates.languages` em `generateMetadata`, com `metadataBase` vindo de `NEXT_PUBLIC_SITE_URL` (fallback `http://localhost:3000`).
- Strings de interface ficam em `messages/*.json`, tipadas a partir de `pt.json` em `global.d.ts`; conteúdo de portfólio fica em `data/*.ts`.

Alternativas: Context + localStorage (descartado por não gerar URLs indexáveis para o blog); `next-i18next` (feito para Pages Router); implementação manual com dicionários (reinventa detecção, cookie e navegação).

**Troca de idioma e âncoras:** o site não usa mais âncoras entre seções, e o `ScrollReset` remove qualquer fragmento da URL ao abrir uma página, então o `LocaleSwitcher` não preserva fragmento: ele troca o idioma na mesma página (`router.replace(pathname, { locale, scroll: false })`) e leva a página ao topo (`window.scrollTo(0, 0)`), para evitar que a navegação do roteador e a rolagem disputem a posição.

**Troca de idioma sem espera:** o Next.js trata `/pt` e `/en` como o mesmo layout raiz (ignora o valor do parâmetro), então a troca é uma navegação no cliente que depende do payload da outra rota. O `LocaleSwitcher` chama `router.prefetch(pathname, { locale })` para os outros idiomas ao montar, e o clique usa dados já carregados. O prefetch só roda em produção; no dev server a troca continua mais lenta.

### Tema pela preferência do navegador, com escolha manual
O tema segue `prefers-color-scheme` até o visitante escolher um com o botão. Foi trocado o `next-themes` por uma implementação própria e pequena, em `components/theme/theme.ts`.
- **CSS:** o tema claro fica em `:root`. O escuro fica em `@media (prefers-color-scheme: dark)` (exceto com `data-theme="light"`) e em `:root[data-theme="dark"]`. Os dois blocos precisam ser idênticos: o CSS não permite compartilhar um bloco entre media query e seletor. A variante `dark` do Tailwind v4 (`@custom-variant dark`) segue a mesma regra.
- **Escolha manual:** o botão grava `light` ou `dark` no `localStorage` (chave `theme`) e aplica `data-theme` no `<html>`, que tem prioridade sobre a media query. Sem escolha salva não há atributo, então a página segue o navegador até sem JavaScript, e acompanha mudanças do sistema com o site aberto.
- **Sem flash:** um script inline no `<head>` (`themeInitScript`) aplica a escolha salva antes da primeira pintura. `<html suppressHydrationWarning>` continua, porque o atributo é aplicado antes da hidratação.
- **`ThemeToggle`:** lê o tema com `useSyncExternalStore` (`getTheme` e `subscribeTheme`), com servidor devolvendo `null`; antes de hidratar ocupa o mesmo espaço com um placeholder.
- **JavaScript que precisa do tema** (as formas 3D) usa `getTheme()` e `subscribeTheme()`, que reagem ao botão e à preferência do navegador, e nunca a classe do `<html>`.

Alternativas: manter o `next-themes` (mesmo comportamento para o visitante, mas com um pacote a mais e sem tema correto antes do JavaScript); só CSS sem botão (descartada: a autora quis manter a escolha manual).

**Cross-fade na troca de tema:** a mudança de luminosidade de tela cheia num único quadro é percebida como uma piscada. O `ThemeToggle` envolve a troca em `document.startViewTransition`; como `setTheme` altera o DOM de forma síncrona, não precisa de `flushSync`. A duração de 250ms fica em `::view-transition-old(root)`/`::view-transition-new(root)`, e `::view-transition { pointer-events: none; }` evita perder cliques durante a animação. Sem suporte à API ou com movimento reduzido, a troca é instantânea. Durante a troca, `setTheme` desliga as transições de cor por dois quadros, para não competirem com o cross-fade (o que o `disableTransitionOnChange` fazia). Usamos a API do navegador diretamente, e não o componente `<ViewTransition>` do React, porque a troca de tema não é uma atualização de estado do React. Alternativa descartada: transição CSS de cor, que fica irregular entre elementos.

**Tema ao trocar de idioma:** mudar o valor de `[locale]` remonta o layout raiz, e o React remove todos os atributos do `<html>` ao liberar o elemento (`releaseSingletonInstance`), inclusive o `data-theme`. O `ThemeSync` o reaplica num `useLayoutEffect`, antes da pintura, para que a página nunca apareça um quadro no outro tema. Alternativa descartada: recarregar a página na troca de idioma (`window.location`), que perde a navegação no cliente e deixa a troca mais lenta.

### Tokens de identidade visual
Cores definidas como variáveis CSS em `globals.css`, com valores em `:root` e sobrescritos para o tema escuro (media query e `data-theme="dark"`), expostos ao Tailwind via `@theme`. Componentes usam só as classes dos tokens (`bg-card`, `text-muted`...), nunca cores cruas. Valores extraídos dos tokens da referência:

Os neutros (fundo, texto, bordas) são quase cinza, com só um traço de calor, para que o acento ameixa e o brilho sejam o único rosa da página em vez de tingir tudo.

| Token | Claro | Escuro | Uso |
|---|---|---|---|
| `--background` | `#ebe6e4` | `#171416` | fundo da página |
| `--card` | `#f5f2f0` | `#201c1e` | superfícies elevadas |
| `--elevated` | `#e4dfdd` | `#292427` | superfícies internas, detalhe do projeto |
| `--foreground` | `#2a2427` | `#f5f1f3` | texto principal |
| `--muted` | `#675d63` | `#c5babf` | texto secundário |
| `--accent` | `#7f2f5f` | `#e08a9f` | links, traço do hero, item atual do menu |
| `--accent-foreground` | `#ffffff` | `#3a1029` | texto sobre fundo em `--accent` |
| `--border` | `rgba(42,36,39,0.13)` | `rgba(255,255,255,0.12)` | bordas |
| `--glow-1` | `#f5d5e5` | `#532a42` | brilho de fundo e formas |
| `--glow-2` | `#f9e4da` | `#74424f` | brilho de fundo e formas |
| `--glow-opacity` | `0.32` | `0.32` | opacidade das manchas do brilho |
| `--highlight` | `#66264c` | `#f8d8e8` | texto sobre o brilho (mais escuro no claro, mais claro no escuro) |

O contraste dos pares de texto desta paleta ainda precisa ser conferido com Lighthouse ou axe (tarefas 7.3 e 9.7); a tabela de contraste que existia aqui era da paleta teal anterior e foi retirada. O nome do hero usa `--foreground` a 85% nos dois temas, para não pesar sobre o fundo (o preto puro no claro e o branco puro no escuro competiam com o resto da página).

A referência viva de tokens e tipografia, para uso no dia a dia, fica em `docs/design-system.md`.

### Fontes
Via `next/font/google`, ambas variáveis e só com o subset `latin`:
- **Jost** para títulos (token `--font-display`): geométrica, a alternativa gratuita mais próxima da "The Future" da referência. Uma regra base em `globals.css` aplica `font-display` e `tracking-wide` a `h1`, `h2` e `h3`; o espaçamento aberto deixa a Jost em negrito mais legível do que o `tracking-tight` testado inicialmente.
- **IBM Plex Sans** para o texto (token `--font-sans`): a mesma fonte de texto da referência.

A Geist do template é removida. Alternativas: só IBM Plex Sans (visual mais técnico, uma fonte a menos), manter Geist (sem ligação com a referência) ou uma grotesca editorial como a do Tubik (descartada para não misturar duas direções de identidade).

### Brilho de fundo interativo
A referência usa um shader WebGL com 6 cores e animação por tempo. Aqui o efeito é feito com CSS e um componente client pequeno, `BackgroundGlow`:
- Camada `absolute` no topo da página, atrás do conteúdo, com `pointer-events-none` e `aria-hidden`, altura de uma tela (`h-dvh`) e `mask-image` radial (suaviza as quatro bordas, não só embaixo — evita que o `overflow-hidden` do container corte o blur numa linha reta) para dissolver no `--background`.
- 3 manchas `div` com `border-radius: 9999px`, cor sólida em `--glow-*` e `filter: blur(170px)`. Como as cores vêm dos tokens, o brilho troca junto com o tema sem JavaScript. As duas cores ficam separadas horizontalmente (`--glow-1` mais à esquerda, `--glow-2` mais à direita, com uma faixa de transição no meio) para ler como um gradiente contínuo em vez de manchas isoladas.
- `pointermove` na `window` define um alvo normalizado (-1 a 1). Um loop `requestAnimationFrame` interpola a posição atual até o alvo (fator `0.18`) e grava `--glow-x`/`--glow-y` no container. Cada mancha usa `translate3d` com um multiplicador de profundidade diferente (deslocamento máximo de `340px`), criando profundidade e um movimento perceptível ao mouse.
- O loop para quando a diferença até o alvo fica abaixo de 0.1px e só recomeça no próximo `pointermove`. Isso cumpre a spec de não manter animação com o ponteiro parado; com a aba oculta, o navegador já suspende o `requestAnimationFrame`.
- O listener só é registrado quando `(pointer: fine)` e `(prefers-reduced-motion: no-preference)` são verdadeiros, reagindo a mudanças dessas media queries.
- Renderizado no layout, antes do `Header`. Na home ele fica oculto (`.glow-home { display: none }`): as formas 3D fazem o papel de cor, e o menu, que é opaco, cobre o brilho. Nas páginas internas o `HeaderShell` (client) começa transparente sobre o brilho e só ganha `bg-background/95` + `backdrop-blur` e borda depois de ~8px de rolagem; na home o header é `fixed` e nunca ganha fundo.

Alternativa para o brilho: WebGL como na referência (visual mais orgânico, mas processamento contínuo). O WebGL ficou só nas formas 3D, abaixo.

### Formas 3D (home e menu)
Um anel, um nó e duas esferas em three.js, desenhados em um `canvas` fixo, portalizado para o `<body>` (o hero corta o próprio overflow e é transladado, o que reancoraria um filho `fixed`). O `HeroShapes` (home) e o `MenuShapes` (menu) leem o mesmo arranjo, em `components/shapes/shapesScene.ts`: ao abrir o menu na home as formas deslizam de uma composição para a outra em vez de trocar.
- **Câmera:** campo de visão estreito (12°) a distância grande, para pouca perspectiva; as formas mantêm a proporção onde quer que estejam na tela.
- **Tamanho e posição:** cada forma tem uma âncora normalizada na viewport e um raio em "unidades de forma" (fração da menor entre a altura e 70% da largura). Assim a composição vale em desktop largo e em celular.
- **Telas em pé (`aspect < 0.85`):** as formas se reúnem em um agrupamento (`cluster` em cada forma) no espaço livre abaixo do texto, encostado perto da borda inferior; `fitPlacements` mede o texto (`collectTextRects`) e encolhe o agrupamento em degraus se o espaço for curto. Se nem o menor tamanho couber (o menu ocupa boa parte da tela), cai no arranjo antigo: cada forma numa âncora à direita, empurrada só o suficiente para liberar o texto.
- **Movimento:** balanço lento em torno da inclinação de repouso (nunca uma volta completa, para o anel não ficar de perfil e parecer uma pílula), deslocamento pequeno com o ponteiro, e giro ao passar o ponteiro sobre a forma (`hoverSpin`). Só com ponteiro preciso e sem movimento reduzido; com movimento reduzido a cena é desenhada uma vez.
- **Entrada:** cada forma aparece em fade, uma após a outra de cima para baixo, no mesmo ritmo do texto, terminando quando o texto termina (`HERO_ENTRANCE_MS`).
- **Rolagem:** a opacidade da cena segue a posição de rolagem (suavizada), some nos primeiros 45% da altura da tela e o desenho para de rodar quando ela some.
- **Carga:** three.js só é carregado no navegador, depois do texto do hero (`dynamic` com `ssr: false`); no menu, a camada 3D só existe enquanto ele está visível.

### Textura de fundo
`components/background/Grain.tsx` põe um grão fino sobre o fundo (ruído de um filtro SVG como data URI, sem imagem para baixar), em camada fixa e sem cliques, atrás das formas e do conteúdo. Cada tema tem a sua camada, porque um único modo de mistura não serve aos dois fundos: no escuro, `screen` com pontos claros esparsos; no claro, `multiply` com pontos escuros. O menu, que é opaco, renderiza o próprio grão. A intensidade do tema claro é 0.3 (0.55 chamava atenção demais); a do escuro é 0.26.

### Header e menu em tela cheia
O site tem quatro páginas, então o menu é a navegação em qualquer largura de tela (não há mais nav desktop nem menu só de celular). Os itens vêm de `components/header/navItems.ts` (caminho + chave de tradução): início, sobre, experiências e projetos.
- **Painel:** `role="dialog"` com `aria-modal`, portalizado para o `<body>` (o header pode ter `backdrop-filter`, que viraria o bloco de contenção de um filho `fixed` e o cortaria no tamanho do header). Abre revelando de cima para baixo com `clip-path` (700ms, `--ease-expressive`), e cada linha entra um instante depois da anterior (250ms + 80ms por linha); ao fechar, tudo sai junto.
- **Conteúdo:** os quatro links em Jost gigante e numerados (a numeração é decorativa, `aria-hidden`), a página atual em `--accent` com `aria-current="page"`, e os contatos (e-mail, LinkedIn, GitHub) embaixo. As formas 3D ficam atrás (`MenuShapes`), só montadas enquanto o menu está visível.
- **Foco e rolagem:** ao abrir, o resto do `<body>` fica `inert` e a rolagem é bloqueada; o foco vai para o botão de fechar e volta ao botão que abriu ao fechar. Fecha com Esc, com o botão ou ao acionar um link. Sem fechar por clique fora: o painel cobre a tela inteira.
- **Movimento reduzido:** sem transição.
- **Celular:** a lista começa na mesma altura que o texto da home (`pt-36` no hero menos os 4.25rem da linha de controles), para a home e o menu parecerem a mesma tela; a partir de `sm`, os dois são centralizados na altura.

**Cápsula de controles (`ControlDock`).** Idioma, tema e botão de menu eram três controles com linguagens diferentes (uma pílula com borda, um quadrado com borda, um ícone sem borda) e alturas diferentes, e pareciam soltos no canto, sobretudo no celular. Agora ficam em uma única cápsula com contorno (`rounded-full`, `bg-background/70` com blur, 44px de altura, botões internos de 36px, divisórias finas), no mesmo formato de "pílula oca" dos ícones do menu. O menu aberto repete a cápsula na mesma posição (com o X no lugar do menu), então ela não muda de lugar ao abrir. Alternativas descartadas: manter os três separados só igualando alturas (continuam três peças soltas); deixar só o botão de menu no celular e levar idioma e tema para dentro dele (mais limpo, mas esconde os dois controles um toque mais longe).

**Header por página.** Na home, o header é `fixed` sobre o hero, sem fundo e só com a cápsula (o hero já tem os links e os contatos). Nas outras páginas fica `sticky`, com o link para a home (e o botão de voltar ao menu, omitido quando a página foi aberta por um link do hero) e a cápsula; depois de ~8px de rolagem ganha fundo e borda.

Alternativas descartadas: nav horizontal no desktop mais menu no celular (o site tem poucas páginas e o menu grande faz parte da identidade); painel pequeno sob o header sem focus trap (servia para dois links âncora, não para quatro páginas).

### Animações de entrada e hover
Inspiradas em https://tubikstudio.com/works, que usa GSAP + ScrollTrigger. Aqui o mesmo tipo de efeito é feito com anime.js e CSS, e cada animação é dona de um lugar (não há um observador global).

**Curvas:** `--ease-expressive: cubic-bezier(0.2, 0, 0, 1)` (arranca rápido e desacelera longo, usada no menu e nos hovers) e `--ease-soft: cubic-bezier(0.22, 1, 0.36, 1)` (desacelera devagar, usada no fundo do detalhe de projeto e na imagem das linhas).

**Hero (carregamento):** o nome é CSS puro, para começar na primeira pintura sem esperar a hidratação (no dev server isso levava cerca de um segundo de página em branco): a primeira palavra é revelada da esquerda e as seguintes de cima, uma após a outra (1300ms, 200ms entre elas). O resto (traço, cargo, links, contatos e, no celular, os créditos) entra com anime.js a partir de `[data-hero-item]`, em ordem no DOM (1100ms, 140ms entre itens), medido a partir de onde a animação do nome está, e não da montagem do componente. O CSS oculta esses itens só até o anime.js assumir (`data-ready` na raiz), com uma animação de segurança que os revela após 3s se algo falhar. As formas 3D usam o mesmo relógio (`heroEntrance.startedAt`) e terminam quando o texto termina; as durações precisam ficar em sincronia com `HERO_ENTRANCE_MS` em `shapesScene.ts`.

**Listas ao rolar:** `ExperienceEntrance` (linhas da timeline) e `ProjectShowcase` (título da página e linhas) observam cada linha com `IntersectionObserver` (limiar 0.3) e a animam uma vez, ao entrar: o ano ou título é revelado da esquerda (1200ms) e o resto sobe com fade (900ms, atraso de 400ms). O mesmo esquema de ocultação até `data-ready` e de segurança em 3s vale para `[data-experience-list]` e `[data-showcase]`.

**Movimento reduzido e sem JavaScript:** o CSS só oculta dentro de `@media (scripting: enabled) and (prefers-reduced-motion: no-preference)`, e cada componente só liga a animação com movimento permitido. Fora disso, nada fica oculto.

**Hover nas linhas de projeto:** a imagem do painel aproxima (`scale-105`, 700ms, `--ease-soft`) e o escurecimento que uniformiza as capturas de tela diminui (500ms); com movimento reduzido, nada disso transiciona.

Alternativas: GSAP/ScrollTrigger como no Tubik (peso alto para efeitos que o anime.js e o CSS resolvem); scroll-driven animations em CSS (`animation-timeline: view()`), que revertem ao rolar de volta e não funcionam no Firefox sem flag; um único `RevealObserver` com `data-reveal` em tudo (foi a primeira versão, trocada porque cada bloco pede uma coreografia diferente: nome em palavras, ano revelado da esquerda, linhas de projeto).

### Lista de projetos e detalhe
A página `/projects` é uma lista, não uma grade de cards: cada projeto é uma linha com o painel visual e, ao lado (a partir de `lg`, com o painel à esquerda e o texto à direita), o título e o tipo. Só entram projetos com demonstração ou repositório (o link do detalhe vem de `demoUrl ?? repoUrl`).
- **Painel:** `aspect-video` no celular, com cantos arredondados (o canto superior direito maior a partir de `lg`). Uma imagem preenche o painel; várias viram faixas inclinadas (`clip-path` com `--slant`), sobrepostas quase por completo, deixando um vão fino e uniforme. Sem imagem, um fundo decorativo `aria-hidden` (`color-mix` de 12% de `--accent` sobre `--card` com um brilho no canto). Um escurecimento de 30% uniformiza as capturas de tela, muito diferentes entre si; ele diminui no hover, e o detalhe mostra a imagem com as cores originais.
- **Detalhe:** um `<dialog>` modal (`showModal`), com a imagem à esquerda em uma moldura de proporção única (o detalhe tem a mesma altura para todos os projetos e não rola no desktop; a captura é cortada para caber), e à direita título, tipo, descrição, "o que fiz" (`contribution`, opcional, com um rótulo só para leitores de tela), tecnologias e o link. A forma do diálogo cresce a partir da linha clicada (`clip-path` da linha até a caixa cheia, 900ms) e volta para ela ao fechar (700ms); o fundo (`::backdrop`) desfoca e escurece. Fecha com o botão, Esc ou clique fora, e devolve o foco à linha. A rolagem da página fica bloqueada sem a barra de rolagem sumir (`scrollbar-gutter: stable`), para nada se deslocar.
- **Acessibilidade:** a linha é um `<button>` com `aria-haspopup="dialog"`; o `<dialog>` recebe o título como rótulo; o link abre em nova aba, com um aviso só para leitores de tela.

### Timeline de experiências
Inspirada no indicador de etapas da referência, na vertical: `<ol>` com uma linha à esquerda (`--accent` com baixa opacidade) e, em cada item, um ponto circular em `--accent`, seguido de período (texto `--muted`), cargo (Jost), empresa e descrição. No celular, a mesma estrutura em uma coluna.

### Modelo de dados bilíngue
```ts
type Locale = 'pt' | 'en';
type Localized = Record<Locale, string>;

type Experience = {
  id: string;
  role: Localized;
  company: string;
  start: string;          // 'YYYY-MM'
  end?: string;           // ausente = atual
  description: Localized;
};

type Project = {
  id: string;
  category: Localized;    // tipo exibido na pill
  title: Localized;
  description: Localized;
  tech: string[];
  repoUrl?: string;
  demoUrl?: string;
  image?: { src: string; width: number; height: number; alt: Localized };
};

type Education = {
  id: string;
  course: Localized;      // grau e área
  institution: string;
  start: string;          // 'YYYY' ou 'YYYY-MM'
  end?: string;           // ausente = em andamento
};

type Award = {
  id: string;
  title: Localized;       // colocação
  event: Localized;
  issuer: string;
  experienceId?: string;  // ligado a um cargo: aparece dentro dele
  date: string;           // 'YYYY-MM'
  description: Localized;
  url?: string;           // projeto
  certificateUrl?: string;
};
```
- `Record<Locale, string>` faz o compilador exigir as duas chaves, o que cumpre a spec de "tradução obrigatória" no `next build` (que roda type-check). Arrays exportados com `satisfies` para o erro apontar o item.
- Datas como `'YYYY-MM'`: ordenação por comparação de string e formatação com `getFormatter().dateTime(..., { month: 'short', year: 'numeric' })`, com `timeZone: 'UTC'` na configuração do next-intl.
- Ordenação feita na renderização, não no arquivo, para que a ordem de cadastro não importe.
- O helper `localize(value, locale)` evita repetir `field[locale]` nos componentes.

Alternativa: arquivos separados por idioma (descartado por duplicar datas, links e tags); MDX por item (desnecessário para textos curtos, fica reservado ao blog).

### Página de trajetória: formação e prêmios
Experiências, formação e prêmios ficam em `/experience`, em vez de páginas separadas: um sexto item no nav e uma página de prêmios quase vazia foram descartados.
- **Prêmio dentro do cargo:** com `experienceId`, aparece abaixo da descrição do cargo, em linhas compactas (colocação, evento, data e links). Sem `experienceId`, vai para o painel de destaque. Ligar por campo explícito, e não pela data, evita atribuir à empresa um prêmio conquistado por conta própria no mesmo período.
- **Painel de destaque:** a partir de `lg` a página vira uma grade de duas colunas (`minmax(0,48rem)` e o restante), com o painel em `sticky` na coluna direita, ao lado das experiências e da formação. Abaixo de `lg` é uma coluna só, na ordem experiências, painel, formação. O nome do evento é o texto grande (Jost, `--accent`) e a colocação vem como subtítulo, para o painel não parecer mais um item da timeline.
- **Formação:** mesmo padrão da timeline de experiências. O ano grande é o do término e datas só com ano não mostram mês.
- **Redirect:** `/awards` responde 301 para `/experience` no mesmo idioma, via `redirects()` em `next.config.ts`; a rota, o item do nav e a entrada no sitemap foram removidos.

### Server vs Client Components
Tudo é Server Component, exceto o que precisa de estado, do navegador ou de animação: `LocaleSwitcher`, `ThemeToggle`, `ThemeSync`, `Menu`, `MenuShapes`, `BackButton`, `HomeLink`, `HeaderShell`, `HideOnHome`, `Hero`, `HeroShapes`, `Footer` (lê a rota), `BackgroundGlow`, `ScrollReset`, `ExperienceEntrance` e `ProjectShowcase`. `Header`, `ControlDock` e as páginas continuam no servidor, e os dados vêm de `data/*.ts`.

**Rolagem:** não há mais âncoras entre seções nem rolagem animada por JavaScript. A rolagem suave é `scroll-behavior: smooth` em CSS, só com `prefers-reduced-motion: no-preference`, e serve ao link de voltar ao topo do rodapé; `ScrollReset` desliga a restauração de rolagem do navegador e sempre abre a página no topo, removendo qualquer fragmento da URL. (A rolagem por `requestAnimationFrame` de 650ms, com o `smoothScroll.ts`, existia para os links de âncora e saiu junto com eles.)

### Links externos e imagens
Links com `target="_blank" rel="noopener noreferrer"`. Imagens de projeto com `next/image`, em `public/projects/`.

## Risks / Trade-offs

- [Brilho atrás do hero pode reduzir o contraste do texto secundário] -> Opacidade e blur altos nas manchas, máscara em gradiente e verificação de contraste do hero sobre o ponto mais claro do brilho, nos dois temas.
- [Brilho rosa sobre fundo quase cinza no tema claro pode parecer "sujo"] -> Opacidade baixa (0.32) e cores `--glow-*` bem claras no claro; ajustado com a autora.
- [Duas famílias de fonte aumentam o download] -> Fontes variáveis, só subset `latin` e `display: swap` (padrão do `next/font`).
- [Jost não é idêntica à "The Future"] -> Aceito; a fonte fica isolada no token `--font-display` e pode ser trocada depois.
- [Mismatch de hidratação no alternador de tema] -> Botão só após hidratar; placeholder com o mesmo tamanho para não causar layout shift.
- [Os tokens do tema escuro ficam duplicados no CSS (media query e `data-theme="dark"`)] -> Aceito: o CSS não compartilha um bloco entre os dois; um comentário em `globals.css` e `docs/design-system.md` avisam que precisam ficar idênticos.
- [Chave `theme` e atributo `data-theme` aparecem no script do `<head>` e em `components/theme/theme.ts`] -> Ficam no mesmo arquivo; ao mudar um, conferir o CSS em `globals.css`.
- [View Transitions não existem em navegadores antigos] -> Detecção de suporte; sem a API a troca de tema é instantânea, como antes.
- [Animações ocultarem conteúdo se o JavaScript carregar mas falhar] -> Ocultação só com `scripting: enabled` e movimento permitido; animação de segurança que revela após 3s; o nome do hero é CSS puro e não depende de hidratação.
- [Hero e menu com mesma composição 3D: mudar a posição das formas mexe nos dois] -> Um arranjo só, em `shapesScene.ts`; ao mexer nele, conferir a home e o menu abertos, em celular e em desktop.
- [Menu em tela cheia em celular baixo pode não caber sem rolar] -> O painel rola (`overflow-y-auto`) e as fontes dos itens escalam com a altura; em telas muito baixas, os contatos ficam em uma linha.
- [Redirect da raiz depende do proxy e não funciona em export estático puro (`output: 'export'`)] -> Não usar export estático; hospedar em plataforma com suporte a proxy (ex: Vercel).
- [Textos de exemplo publicados por engano] -> Deploy está fora do escopo; o conteúdo já é o real, mas a home não é publicada antes de a autora revisar os textos.
- [Mais setup inicial que o toggle simples] -> Aceito conscientemente em troca de não migrar o i18n quando o blog chegar.

## Migration Plan

Projeto novo, sem migração. Rollback não se aplica antes do primeiro deploy.

## Open Questions

- Verificação manual pendente (tarefas 7.2 a 7.4 e 9.7): responsividade, contraste e teclado nos dois temas e idiomas, com a paleta e a home nova.

Resolvida: cores, opacidade e movimento do brilho foram calibrados e aprovados com a autora (valores finais na tabela de tokens acima e em `docs/design-system.md`).
- Plataforma de hospedagem: não afeta o MVP, desde que suporte proxy.
- Rodapé e projetos em destaque: os changes `portfolio-footer` e `projects-showcase-page` foram escritos para o plano de página única e precisam ser reconciliados com este design antes do arquivamento.
