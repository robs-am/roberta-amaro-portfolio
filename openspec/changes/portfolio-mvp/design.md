## Context

O repositório começou vazio (só o scaffolding do OpenSpec), então não há código legado nem restrição de compatibilidade. Motivação e escopo estão em `proposal.md`; o comportamento esperado está nas specs de `localization`, `theme`, `portfolio-page` e `portfolio-content`.

A restrição que mais molda a arquitetura é o blog planejado para os próximos meses: ele precisa de URLs indexáveis por idioma. Por isso o i18n já nasce baseado em rotas, mesmo o MVP sendo uma página só.

A identidade visual segue a referência escolhida pela autora: https://www.alignerr.com/en/process (fundo quase preto com brilho teal/azul que reage ao mouse, cards escuros com borda teal sutil, destaque teal claro). As animações de entrada e hover seguem uma segunda referência, https://tubikstudio.com/works, sem adotar a tipografia dela.

## Goals / Non-Goals

**Goals:**
- Página totalmente renderizada no servidor e gerada estaticamente para cada idioma
- JavaScript no cliente restrito aos controles interativos (idioma, tema, menu mobile), ao brilho de fundo e ao observador das animações de entrada
- Estrutura `app/[locale]/` que aceite `blog/` depois sem mexer no que já existe
- Identidade visual centralizada em tokens, para ajustar cores, fontes e movimento sem tocar nos componentes

**Non-Goals:**
- Suporte a mais de dois idiomas (a estrutura permite, mas não será testada)
- Fundo em WebGL/canvas ou animação contínua enquanto o ponteiro está parado
- Bibliotecas de animação (GSAP, Framer Motion) ou rolagem suavizada por JavaScript
- Fontes pagas (a "The Future" da Alignerr e a Lausanne do Tubik ficam de fora)
- Testes automatizados end-to-end (verificação manual pelas specs no MVP)
- Analytics, SEO avançado (sitemap, Open Graph images), deploy

## Decisions

### Estrutura de pastas

```
app/
  [locale]/
    layout.tsx          <html lang>, fontes, providers, brilho, observer, header, metadados
    page.tsx            Hero + #experience + #projects
    not-found.tsx
    [...rest]/page.tsx  notFound() para caminhos inexistentes
  globals.css           Tailwind + tokens de tema e movimento
components/
  BackgroundGlow.tsx    (client)
  Header.tsx            nav desktop + LocaleSwitcher + ThemeToggle + MobileMenu
  navItems.ts           lista única dos links de navegação
  MobileMenu.tsx        (client) hambúrguer + painel abaixo do header
  LocaleSwitcher.tsx    (client)
  ThemeToggle.tsx       (client)
  ThemeClassSync.tsx    (client) reaplica a classe do tema quando o layout remonta
  RevealObserver.tsx    (client) marca [data-reveal] ao entrar na tela
  Hero.tsx
  ExperienceSection.tsx timeline vertical
  ProjectCard.tsx / ProjectsSection.tsx
data/
  types.ts
  profile.ts            nome, título, bio (hero)
  experiences.ts
  projects.ts
i18n/
  routing.ts            locales, defaultLocale
  request.ts            carrega messages por locale
  navigation.ts         Link/useRouter cientes do locale
messages/
  pt.json
  en.json
proxy.ts
global.d.ts             tipos do next-intl (Locale e Messages)
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

**Preservar a âncora ao trocar idioma:** o fragmento não chega ao servidor. O `LocaleSwitcher` anexa `window.location.hash` ao caminho passado para `router.replace(..., { locale })`; a navegação do next-intl preserva o fragmento.

**Troca de idioma sem espera:** o Next.js trata `/pt` e `/en` como o mesmo layout raiz (ignora o valor do parâmetro), então a troca é uma navegação no cliente que depende do payload da outra rota. O `LocaleSwitcher` chama `router.prefetch(pathname, { locale })` para os outros idiomas ao montar, e o clique usa dados já carregados. O prefetch só roda em produção; no dev server a troca continua mais lenta.

### Tema com next-themes + Tailwind por classe
- `ThemeProvider` com `attribute="class"`, `defaultTheme="system"`, `enableSystem`, `disableTransitionOnChange`. O next-themes injeta um script inline antes da pintura que aplica a classe, o que atende a spec de "sem flash", e persiste em `localStorage`, que é compartilhado entre `/pt` e `/en`.
- `<html suppressHydrationWarning>`, porque a classe é aplicada antes da hidratação.
- No `ThemeToggle`, o botão só é renderizado após hidratar (via `useSyncExternalStore`), para evitar mismatch de hidratação; antes disso ocupa o mesmo espaço com um placeholder.
- Tailwind v4: variante `dark` redefinida para a classe com `@custom-variant dark (&:where(.dark, .dark *));`.

Alternativa: CSS puro com `prefers-color-scheme` (sem escolha manual) ou implementação própria do script anti-flash (mesmo resultado com mais código).

**Cross-fade na troca de tema:** o next-themes troca a classe num único quadro, e a mudança de luminosidade de tela cheia é percebida como uma piscada. O `ThemeToggle` envolve a troca em `document.startViewTransition`, com o `setTheme` dentro de `flushSync` (o next-themes aplica a classe num efeito; o `flushSync` garante que ela já esteja no DOM quando o navegador captura o estado novo). A duração de 250ms fica em `::view-transition-old(root)`/`::view-transition-new(root)`, e `::view-transition { pointer-events: none; }` evita perder cliques durante a animação. Sem suporte à API ou com movimento reduzido, a troca é instantânea. Usamos a API do navegador diretamente, e não o componente `<ViewTransition>` do React, porque a troca de tema é um `setState` comum, que não aciona o componente. Alternativa descartada: transição CSS de cor, que fica irregular entre elementos (justamente o que `disableTransitionOnChange` evita).

**Classe do tema ao trocar de idioma:** mudar o valor de `[locale]` remonta o layout raiz, e o React remove todos os atributos do `<html>` ao liberar o elemento (`releaseSingletonInstance`), inclusive a classe `dark`. O next-themes só a devolve num efeito passivo, depois de uma pintura, o que mostrava um quadro no tema claro. O `ThemeClassSync` reaplica classe e `color-scheme` num `useLayoutEffect`, antes da pintura, lendo a mesma chave `theme` e resolvendo `system` como o next-themes. Alternativa descartada: recarregar a página na troca de idioma (`window.location`), que evita a lógica repetida mas perde a navegação no cliente e deixa a troca mais lenta.

### Tokens de identidade visual
Cores definidas como variáveis CSS em `globals.css`, com valores em `:root` e sobrescritos em `.dark`, expostos ao Tailwind via `@theme`. Componentes usam só as classes dos tokens (`bg-card`, `text-muted`...), nunca cores cruas. Valores extraídos dos tokens da referência:

| Token | Claro | Escuro | Uso |
|---|---|---|---|
| `--background` | `#f1ede6` | `#181818` | fundo da página |
| `--card` | `#fffdf8` | `#202020` | cards e itens da timeline |
| `--elevated` | `#faf8f5` | `#262626` | superfícies internas e hover |
| `--foreground` | `#2a2622` | `#f5f5f4` | texto principal |
| `--muted` | `#5f574d` | `#bcbcbc` | texto secundário |
| `--accent` | `#36707f` | `#7eb3c1` | links, pontos da timeline, botão |
| `--accent-foreground` | `#fffdf8` | `#0f2a31` | texto sobre o botão teal |
| `--border` | `rgba(67,126,142,0.22)` | `rgba(126,179,193,0.18)` | bordas |
| `--glow-1` | `#7eb3c1` | `#36707f` | brilho de fundo (teal) |
| `--glow-2` | `#94c4fc` | `#587ea5` | brilho de fundo (azul) |

Contraste calculado para todos os pares de texto: o menor é 4.52:1 (texto teal sobre pill com 14% de teal no tema claro), por isso a pill usa 10% de teal. Botão: 6.52:1 no escuro e 5.46:1 no claro. Pares entre 4.5 e 5 ficam na verificação da task de contraste.

A referência viva de tokens e tipografia, para uso no dia a dia, fica em `docs/design-system.md`.

### Fontes
Via `next/font/google`, ambas variáveis e só com o subset `latin`:
- **Jost** para títulos (token `--font-display`): geométrica, a alternativa gratuita mais próxima da "The Future" da referência. Uma regra base em `globals.css` aplica `font-display` e `tracking-wide` a `h1`, `h2` e `h3`; o espaçamento aberto deixa a Jost em negrito mais legível do que o `tracking-tight` testado inicialmente.
- **IBM Plex Sans** para o texto (token `--font-sans`): a mesma fonte de texto da referência.

A Geist do template é removida. Alternativas: só IBM Plex Sans (visual mais técnico, uma fonte a menos), manter Geist (sem ligação com a referência) ou uma grotesca editorial como a do Tubik (descartada para não misturar duas direções de identidade).

### Brilho de fundo interativo
A referência usa um shader WebGL com 6 cores e animação por tempo. Aqui o efeito é feito com CSS e um componente client pequeno, `BackgroundGlow`:
- Camada `absolute` no topo da página, atrás do conteúdo, com `pointer-events-none` e `aria-hidden`, altura de cerca de 80vh e máscara em gradiente para dissolver no `--background`.
- 2 ou 3 manchas `div` com `radial-gradient` nas cores `--glow-*` e `filter: blur(...)`. Como as cores vêm dos tokens, o brilho troca junto com o tema sem JavaScript.
- `pointermove` na `window` define um alvo normalizado (-1 a 1). Um loop `requestAnimationFrame` interpola a posição atual até o alvo (fator em torno de 0.06) e grava `--glow-x`/`--glow-y` no container. Cada mancha usa `translate3d` com um multiplicador diferente (deslocamento máximo de ~40px), criando profundidade.
- O loop para quando a diferença até o alvo fica abaixo de 0.1px e só recomeça no próximo `pointermove`. Isso cumpre a spec de não manter animação com o ponteiro parado; com a aba oculta, o navegador já suspende o `requestAnimationFrame`.
- O listener só é registrado quando `(pointer: fine)` e `(prefers-reduced-motion: no-preference)` são verdadeiros, reagindo a mudanças dessas media queries.
- Renderizado no layout, antes do `Header`. O header fica translúcido (`backdrop-blur`) sobre o brilho.

Alternativa: WebGL como na referência (visual mais orgânico e animado mesmo parado, mas exige uma dependência 3D e processamento contínuo).

### Menu mobile
- Abaixo de 768px (breakpoint `md`), os links da navegação saem do header e vão para um painel aberto por um botão hambúrguer. Seletor de idioma e alternador de tema continuam visíveis, e o header mobile vira uma linha só: nome à esquerda; idioma, tema e hambúrguer à direita (cabe em 360px).
- O `Header` continua Server Component: renderiza a `<nav>` desktop com `hidden md:block` e o `MobileMenu` (client) com `md:hidden`. Os links vêm de `components/navItems.ts` (href da âncora + chave de tradução), para a nav desktop e o menu não duplicarem a lista.
- Botão de 40×40px com três barras que viram um X (`rotate`/`translate` com `--ease-expressive`), `aria-expanded`, `aria-controls` apontando para o painel e rótulo traduzido (`Header.menu.open`/`Header.menu.close`).
- Painel posicionado com `absolute inset-x-0 top-full` dentro do header, `bg-background/95` com `backdrop-blur` e borda inferior; links empilhados com área de toque mínima de 44px. Abre com fade e deslocamento curto.
- Fecha ao acionar um link, com Esc (devolvendo o foco ao botão), com `pointerdown` fora do header e quando `(min-width: 768px)` passa a valer (listener de `matchMedia`). A troca de idioma remonta o layout e fecha o menu naturalmente.
- Painel não modal: sem focus trap nem bloqueio de rolagem, porque não cobre a página e tem só 2 links. Com movimento reduzido, barras e painel mudam sem animação.

Alternativas: menu em tela cheia ou gaveta lateral com fundo escurecido (desproporcionais para 2 links e exigem diálogo modal com focus trap); manter a quebra de linha atual da nav (funciona, mas foi explicitamente substituída pelo hambúrguer).

### Animações de entrada e hover
Inspiradas em https://tubikstudio.com/works, que usa GSAP + ScrollTrigger. Aqui o mesmo efeito é feito com CSS e um observador pequeno.

**Tokens de movimento** em `globals.css`: `--ease-expressive: cubic-bezier(0.2, 0, 0, 1)` (curva usada no Tubik: arranca rápido e desacelera longo), `--duration-reveal: 600ms` e `--reveal-stagger: 80ms`.

**Entrada ao rolar:**
- Títulos de seção, itens da timeline e cards recebem `data-reveal` direto no JSX dos Server Components. A variável `--reveal-index` não fica no JSX: o `RevealObserver` a define pela ordem dos elementos que entram na tela no mesmo lote, para que só elementos que aparecem juntos animem em sequência (com índice fixo, o quarto card esperaria 240ms mesmo entrando sozinho no celular).
- O CSS só oculta dentro de `@media (scripting: enabled) and (prefers-reduced-motion: no-preference)`: `[data-reveal]:not([data-revealed])` fica com `opacity: 0` e `translate: 0 16px`. Quando o atributo `data-revealed` aparece, uma transição de `--duration-reveal` com `--ease-expressive` leva o elemento ao estado final, com atraso de `calc(var(--reveal-index, 0) * var(--reveal-stagger))`. Sem JavaScript ou com movimento reduzido, nada fica oculto.
- `RevealObserver` (client, renderizado no layout, retorna `null`): ao montar, cria um `IntersectionObserver` para `[data-reveal]`, marca `data-revealed` quando o elemento entra na tela e para de observá-lo, então cada elemento anima uma vez. Como o layout remonta na troca de idioma, o observer remonta junto e observa o conteúdo novo; o que já está visível é revelado na hora.
- Rede de segurança: `[data-reveal]:not([data-revealed])` também recebe uma animação que o torna visível após 3s, caso o JavaScript carregue mas o observer falhe.

**Hero:** anima no carregamento só com CSS (`@keyframes` de fade + subida, 400ms, em sequência nome → título → bio), sem depender de hidratação, para não atrasar o conteúdo principal.

**Hover e foco nos cards:** `translate: 0 -4px`, borda em `--accent` com baixa opacidade e zoom de 1.03 na imagem do painel (dentro de `overflow-hidden`), em 300ms com `--ease-expressive`. `:focus-within` aplica o mesmo destaque para quem navega por teclado. Com movimento reduzido, só a borda muda.

Alternativas: GSAP/ScrollTrigger como no Tubik (cerca de 70KB para efeitos que o CSS resolve); scroll-driven animations em CSS (`animation-timeline: view()`), que revertem ao rolar de volta, dificultam a sequência e não funcionam no Firefox sem flag.

### Card de projeto vertical
```
+---------------------------+
|  painel (aspect-video)    |  imagem, ou fundo decorativo aria-hidden
+---------------------------+
|  [tipo]                   |  pill: accent 10% + texto accent
|  Título (Jost)            |
|  Descrição (muted)        |
|  tecnologias              |
|  [Botão]  link de texto   |
+---------------------------+
```
- Card com `bg-card`, `border-border` e cantos arredondados, como o bloco escuro da referência.
- Painel sem imagem: fundo `color-mix` de 12% de `--accent` sobre `--card` com um `radial-gradient` de brilho no canto (mesma técnica dos cards da referência), marcado com `aria-hidden`.
- O primeiro link disponível (demonstração, senão repositório) vira botão preenchido em `--accent`; o outro fica como link de texto.
- Grade: 1 coluna no celular, 2 no tablet, 3 no desktop.

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
```
- `Record<Locale, string>` faz o compilador exigir as duas chaves, o que cumpre a spec de "tradução obrigatória" no `next build` (que roda type-check). Arrays exportados com `satisfies` para o erro apontar o item.
- Datas como `'YYYY-MM'`: ordenação por comparação de string e formatação com `getFormatter().dateTime(..., { month: 'short', year: 'numeric' })`, com `timeZone: 'UTC'` na configuração do next-intl.
- Ordenação feita na renderização, não no arquivo, para que a ordem de cadastro não importe.
- O helper `localize(value, locale)` evita repetir `field[locale]` nos componentes.

Alternativa: arquivos separados por idioma (descartado por duplicar datas, links e tags); MDX por item (desnecessário para textos curtos, fica reservado ao blog).

### Server vs Client Components
Tudo é Server Component, exceto `LocaleSwitcher`, `ThemeToggle`, `ThemeClassSync`, `MobileMenu`, `RevealObserver` e `BackgroundGlow`. A navegação por âncora usa `<a href="#projects">` nativo, com `scroll-behavior: smooth` em CSS dentro de `@media (prefers-reduced-motion: no-preference)`, `data-scroll-behavior="smooth"` no `<html>` (para o Next.js desativar a rolagem suave durante trocas de rota) e `scroll-margin-top` nas seções para não ficarem sob o header fixo.

### Links externos e imagens
Links com `target="_blank" rel="noopener noreferrer"`. Imagens de projeto com `next/image`, em `public/projects/`.

## Risks / Trade-offs

- [Brilho atrás do hero pode reduzir o contraste do texto secundário] -> Opacidade e blur altos nas manchas, máscara em gradiente e verificação de contraste do hero sobre o ponto mais claro do brilho, nos dois temas.
- [Brilho teal sobre fundo bege no tema claro pode parecer "sujo"] -> Opacidade menor no claro e ajuste visual das cores `--glow-*` na verificação.
- [Duas famílias de fonte aumentam o download] -> Fontes variáveis, só subset `latin` e `display: swap` (padrão do `next/font`).
- [Jost não é idêntica à "The Future"] -> Aceito; a fonte fica isolada no token `--font-display` e pode ser trocada depois.
- [Mismatch de hidratação no alternador de tema] -> Botão só após hidratar; placeholder com o mesmo tamanho para não causar layout shift.
- [`ThemeClassSync` repete a regra de resolução do next-themes] -> Se `storageKey`, `attribute` ou os nomes dos temas mudarem no `ThemeProvider`, o componente precisa mudar junto; o risco está anotado no próprio componente e em `docs/design-system.md`.
- [View Transitions não existem em navegadores antigos] -> Detecção de suporte; sem a API a troca de tema é instantânea, como antes.
- [Conteúdo com `data-reveal` ficar oculto se o JavaScript carregar mas falhar] -> Ocultação só com `scripting: enabled`, animação de segurança que revela após 3s e hero animado apenas por CSS.
- [Animação do hero atrasar a percepção de carregamento] -> Duração curta (400ms), começando imediatamente, sem esperar hidratação.
- [Menu mobile sem focus trap] -> Aceito: painel não modal com 2 links; Esc e clique fora fecham o menu e o foco volta ao botão.
- [Redirect da raiz depende do proxy e não funciona em export estático puro (`output: 'export'`)] -> Não usar export estático; hospedar em plataforma com suporte a proxy (ex: Vercel).
- [Conteúdo placeholder publicado por engano] -> Deploy está fora do escopo; placeholders claramente fictícios ("Empresa Exemplo").
- [Mais setup inicial que o toggle simples] -> Aceito conscientemente em troca de não migrar o i18n quando o blog chegar.

## Migration Plan

Projeto novo, sem migração. Rollback não se aplica antes do primeiro deploy.

## Open Questions

- Cores exatas do brilho: aproximadas a partir dos tokens da referência, ajustáveis apenas em `--glow-*`.
- Duração e distância exatas das animações de entrada: começam em 600ms e 16px e podem ser calibradas visualmente só pelos tokens de movimento.
- Plataforma de hospedagem: não afeta o MVP, desde que suporte proxy.
- Seção de contato ou footer com redes sociais: pode entrar como change separado.
