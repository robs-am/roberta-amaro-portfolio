# Design system

Referência viva da identidade visual do portfólio. Os valores reais ficam em [`app/globals.css`](../app/globals.css); este documento explica o que cada peça é, onde usar e quais regras seguir.

Inspiração visual: [alignerr.com/en/process](https://www.alignerr.com/en/process). O raciocínio por trás das escolhas está no design do change `portfolio-mvp` (`openspec/changes/portfolio-mvp/design.md`, arquivado ao final do MVP).

## Regras gerais

- **Nunca use cor crua em componentes** (`#fff`, `text-zinc-500`, `bg-[#202020]`). Use sempre as classes geradas pelos tokens (`bg-card`, `text-muted`, `border-border`...). Assim os dois temas e ajustes futuros funcionam sem tocar nos componentes.
- **Títulos herdam fonte e espaçamento da regra base.** Não adicione `font-display` nem `tracking-*` em `h1`, `h2` ou `h3`; defina só tamanho e peso.
- **Todo texto precisa de contraste AA** (4.5:1) nos dois temas. Ao criar ou alterar um token de cor usado em texto, recalcule os pares da tabela de contraste.

## Temas

O tema é controlado pela classe `dark` no `<html>`, aplicada pelo `next-themes` (padrão: preferência do sistema; a escolha manual fica salva no `localStorage`).

- Tema claro: valores em `:root`.
- Tema escuro: valores sobrescritos em `.dark`.
- Para variações pontuais por tema em um componente, use o variant `dark:` do Tailwind, mas prefira sempre resolver com tokens.

### Troca de tema

- O botão de tema faz um **cross-fade de 250ms** com a View Transitions API (`document.startViewTransition`). A duração fica nas regras `::view-transition-old(root)` e `::view-transition-new(root)` em `app/globals.css`.
- Sem suporte do navegador ou com `prefers-reduced-motion: reduce`, a troca é instantânea.
- Durante a transição, `::view-transition { pointer-events: none; }` mantém a página clicável.

### Classe do tema ao trocar de idioma

Trocar de `/pt` para `/en` remonta o `<html>`, e o React apaga a classe `dark` que o `next-themes` aplicou. O componente `ThemeClassSync` reaplica a classe antes da pintura para evitar um quadro no tema errado.

Ele repete a regra do `next-themes` (chave `theme` no `localStorage`, `system` resolvido pela preferência do sistema). **Se mudar `storageKey`, `attribute` ou os nomes dos temas no `ThemeProvider`, atualize também o `ThemeClassSync`.**

## Cores

| Token | Classe Tailwind | Claro | Escuro | Uso |
|---|---|---|---|---|
| `--background` | `bg-background` | `#f1ede6` | `#181818` | fundo da página |
| `--card` | `bg-card` | `#fffdf8` | `#202020` | cards e blocos de conteúdo |
| `--elevated` | `bg-elevated` | `#faf8f5` | `#262626` | superfícies internas e hover |
| `--foreground` | `text-foreground` | `#2a2622` | `#f5f5f4` | texto principal |
| `--muted` | `text-muted` | `#5f574d` | `#bcbcbc` | texto secundário (datas, empresa, descrições) |
| `--accent` | `text-accent`, `bg-accent` | `#2a5c68` | `#7eb3c1` | destaque: links, traço decorativo do hero, pills, botão principal |
| `--accent-foreground` | `text-accent-foreground` | `#fffdf8` | `#0f2a31` | texto sobre fundo `bg-accent` |
| `--border` | `border-border` | `rgba(67,126,142,0.22)` | `rgba(126,179,193,0.18)` | bordas e divisórias (decorativo, nunca texto) |
| `--glow-1` | `bg-glow-1` | `#7eb3c1` | `#0f7482` | brilho de fundo, tom teal (decorativo) |
| `--glow-2` | `bg-glow-2` | `#7cc0f0` | `#2f8fe0` | brilho de fundo, tom azul (decorativo) |
| `--glow-opacity` | — (usado só via `.glow-blob` em `globals.css`) | `0.8` | `0.5` | opacidade das manchas do brilho; ver "Texto sobre o brilho" abaixo |

Opacidades sobre tokens funcionam normalmente (`bg-background/85`, `bg-accent/10`).

### Contraste verificado

Razão de contraste WCAG dos pares de texto usados hoje:

| Par (texto / fundo) | Claro | Escuro |
|---|---|---|
| `foreground` / `background` | 12.87 | 16.28 |
| `foreground` / `card` | 14.77 | 14.94 |
| `muted` / `background` | 6.09 | 9.35 |
| `muted` / `card` | 6.99 | 8.58 |
| `accent` / `background` | 4.76 | 7.70 |
| `accent` / `card` | 5.46 | 7.06 |
| `accent` / pill (`bg-accent/10` sobre `card`) | 4.78 | 5.90 |
| `accent-foreground` / `accent` | 5.46 | 6.52 |

Os pares mais apertados são os de `accent` no tema claro. Não use `accent` para texto sobre `elevated` ou sobre fundos com mais de 10% de `accent` sem recalcular.

### Texto sobre o brilho

Dois lugares ficam diretamente sobre o `BackgroundGlow`: o hero e o `Header` enquanto está transparente (antes de rolar ~8px). Para eles o par relevante não é `texto / background`, e sim `texto / background composto com o brilho no ponto mais claro` (pior caso: dois blobs se sobrepondo, sem atenuação do blur).

**Importante:** misturar o brilho com o `background` não necessariamente ajuda o contraste em nenhum tema — no escuro o brilho é mais claro que o fundo (reduz contraste de texto claro), e no claro o brilho é mais *escuro* que o fundo (reduz contraste de texto escuro, o oposto do que se poderia supor). Em ambos os casos, `muted` e `accent` não sobram contraste suficiente sobre o brilho em opacidade vívida. Por isso, tanto o cargo/bio do hero quanto os links inativos da nav usam `foreground` (não `muted`/`accent`) enquanto estão sobre o brilho — a nav troca para `text-muted` normal assim que o header ganha fundo sólido ao rolar (`useHeaderScrolled`, em `HeaderScrollContext.tsx`). A hierarquia visual nesses estados fica só por tamanho/peso de fonte e pelo pill do link ativo, não por cor.

Com isso, o único par que precisa passar no pior caso é `foreground`:

| Tema | `--glow-opacity` | `foreground` no pior caso (2 blobs sobrepostos) |
|---|---|---|
| Escuro | 0.65 | 4.26 (falha) |
| Escuro | 0.55 | 4.93 |
| Escuro | **0.5 (valor em uso)** | **5.36** |
| Claro | **0.8 (valor em uso)** | **7.59** |
| Claro | 0.4 | 8.91 |

A bio do hero usa `text-foreground/90` (não `foreground` puro) pra ganhar um pouco de hierarquia visual sobre o nome/cargo; com essa diluição o pior caso cai para **4.68 no escuro** e **6.21 no claro** — ainda dentro de AA, mas com bem menos folga que o `foreground` puro. Não dilua mais que isso (`/90`) sem recalcular.

Se `--glow-1`, `--glow-2` ou `--glow-opacity` de qualquer tema mudarem, recalcule esse pior caso antes de assumir que o texto continua legível — cores mais claras de `--glow-2` custam mais opacidade no escuro. Se `muted`/`accent` voltarem a aparecer sobre o brilho em algum ponto, a opacidade segura cai bem mais (no claro, `muted` só passa com `--glow-opacity` em torno de 0.3 ou menos com as cores atuais).

## Tipografia

| Token | Classe | Fonte | Uso |
|---|---|---|---|
| `--font-display` | `font-display` | Jost | títulos (`h1`, `h2`, `h3`) |
| `--font-sans` | `font-sans` | IBM Plex Sans | todo o resto (padrão do `body`) |

As duas são carregadas com `next/font/google` no [`app/[locale]/layout.tsx`](../app/[locale]/layout.tsx), em versão variável e com subset `latin`. Elas expõem as variáveis `--font-jost` e `--font-plex-sans`, que os tokens acima referenciam.

### Regra base dos títulos

Em `app/globals.css`, `h1`, `h2` e `h3` recebem automaticamente:

- `font-display` (Jost)
- `tracking-wide` (espaçamento de letras de `0.025em`), que deixa a Jost em negrito mais legível do que o espaçamento apertado

### Escala em uso

| Elemento | Classes | Onde |
|---|---|---|
| Nome (`h1`) | `text-5xl font-bold lg:text-7xl` | hero |
| Título de página (`h1`) | `text-3xl font-bold` | página 404 |
| Título de seção (`h2`) | `text-2xl font-semibold` | Experiências, Projetos |
| Título de card (`h3`) | `text-lg font-semibold` | card de projeto |
| Cargo (`h3`) | `font-semibold` | item de experiência |
| Título profissional (eyebrow) | `text-sm font-semibold uppercase tracking-wide text-foreground` | hero |
| Texto corrido | `leading-7` (+ `text-muted` quando secundário) | descrições, bio — exceto a bio do hero, que fica sobre o brilho e por isso usa `text-foreground/90` |
| Texto auxiliar | `text-sm text-muted` | datas, empresa, links do header |

## Movimento

Inspirado em [tubikstudio.com/works](https://tubikstudio.com/works) (GSAP + ScrollTrigger no original); aqui o mesmo efeito é feito só com CSS e um `IntersectionObserver` pequeno.

| Token | Valor | Uso |
|---|---|---|
| `--ease-expressive` | `cubic-bezier(0.2, 0, 0, 1)` | curva padrão de interação: arranca rápido, desacelera longo (entrada ao rolar, hover, menu mobile) |
| `--ease-soft` | `cubic-bezier(0.22, 1, 0.36, 1)` | curva do hero: desacelera bem devagar, sensação mais suave que a expressiva |
| `--duration-reveal` | `600ms` | duração da transição de entrada ao rolar |
| `--reveal-stagger` | `80ms` | atraso entre elementos do mesmo lote ao entrarem juntos na tela |
| `--reveal-distance` | `16px` | deslocamento vertical inicial dos elementos `data-reveal` |
| `--duration-hero` | `900ms` | duração de cada linha do hero |
| `--hero-stagger` | `150ms` | atraso entre linhas do hero (nome → título → bio) |
| `--hero-distance` | `12px` | deslocamento vertical inicial das linhas do hero |
| `--hero-blur` | `6px` | desfoque inicial das linhas do hero, que se desfaz durante a animação |
| `--reveal-hold` | `calc(var(--duration-hero) + 2 * var(--hero-stagger))` (1200ms) | tempo que o `RevealObserver` espera, contado do início da animação do hero (não da hidratação), antes de revelar conteúdo abaixo que já está visível no carregamento |

### Entrada ao rolar (`data-reveal`)

- Títulos de seção, itens da timeline e cards recebem `data-reveal` direto no JSX dos Server Components.
- O CSS só oculta dentro de `@media (scripting: enabled) and (prefers-reduced-motion: no-preference)`: sem JavaScript ou com movimento reduzido, nada fica oculto.
- `RevealObserver` (client, renderizado no layout, retorna `null`) observa todo `[data-reveal]` com `IntersectionObserver`; quando um lote de elementos entra na tela junto, define `--reveal-index` pela ordem deles (só nesse lote, não globalmente — um card entrando sozinho não herda um índice alto e não espera atraso à toa), marca `data-revealed` e para de observar. Cada elemento anima uma vez só; rolar de volta não repete a animação.
- Como o layout remonta na troca de idioma, o `RevealObserver` remonta junto e revela na hora o que já estiver visível — os cards não ficam ocultos depois de trocar `/pt` ↔ `/en` com a seção de projetos na tela.
- Rede de segurança: `[data-reveal]:not([data-revealed])` também recebe uma animação (`reveal-fallback`) que o torna visível após 3s, caso o JavaScript carregue mas o observer falhe.

### Hero

Anima só com CSS, sem depender de hidratação: nome → título → bio entram em foco com fade, subida de `--hero-distance` e desfoque de `--hero-blur` que se desfaz, cada linha em `--duration-hero` com `--hero-stagger` de atraso entre elas e a curva `--ease-soft`.

O `RevealObserver` espera `--reveal-hold` antes de revelar conteúdo já visível abaixo do hero (ex.: Experiências), para a seção seguinte não competir com a animação do hero ainda em andamento. Por isso `--reveal-hold` é calculado a partir dos próprios tokens do hero (duração da última linha + seus atrasos) em vez de um valor fixo separado — se `--duration-hero` ou `--hero-stagger` mudarem, o hold acompanha sem precisar sincronizar os dois manualmente.

### Hover e foco nos cards

Card (`ProjectCard`): sobe 4px e a borda vira `--accent` a 60% de opacidade; a imagem (ou painel decorativo, quando não há imagem) ganha zoom de 1.03, contido pelo `overflow-hidden` do painel. Tudo em 300ms com `--ease-expressive`. `:focus-within` aplica o mesmo destaque para quem navega por teclado (o foco costuma estar num link dentro do card). Com movimento reduzido, só a cor da borda muda — sem translate nem zoom.

## Menu mobile

Abaixo de 768px, a navegação do `Header` vira um botão hambúrguer (`MobileMenu`, client) de 40×40px com três barras que se tornam um X (`rotate(45deg)`/`rotate(-45deg)` nas barras externas, `opacity-0` na do meio), `aria-expanded`, `aria-controls` e rótulo traduzido (`Header.menu.open`/`Header.menu.close`). A partir de 768px a nav desktop (`hidden md:block`) reaparece e o botão (`md:hidden`) some.

O painel abre abaixo do header com uma técnica de CSS Grid (`grid-rows-[0fr]` → `grid-rows-[1fr]`) para animar a altura sem precisar medir o conteúdo, e recebe `inert` quando fechado — tira o painel da ordem de tab e do leitor de tela sem precisar de `display: none` (que cortaria a transição). Os links vêm de `navItems`, a mesma lista usada pela nav desktop, empilhados com área de toque mínima de 44px (`min-h-11`).

O menu fecha ao: acionar um link, pressionar Esc (o foco volta pro botão), clicar/tocar fora do header (`pointerdown`), ou quando a viewport cruza 768px enquanto o menu está aberto. A animação das barras e do painel usa `--ease-expressive` em 300ms e é desativada com movimento reduzido (`motion-reduce:transition-none`).

## Brilho de fundo

`components/BackgroundGlow.tsx` (client, `aria-hidden`, `pointer-events-none`), renderizado no layout antes do `Header`. Inspirado em [alignerr.com](https://www.alignerr.com), aprovado com a autora após algumas rodadas de calibração.

- Camada `absolute` de `95vh` de altura no topo da página, com `mask-image: radial-gradient(120% 85% at 55% 0%, #000 45%, transparent 92%)` — suaviza as quatro bordas (não só embaixo), pra o `overflow-hidden` do container nunca cortar o blur numa linha reta.
- 3 manchas (`div`, `border-radius: 9999px`, `filter: blur(170px)`, cor sólida em `--glow-1`/`--glow-2`, opacidade em `--glow-opacity`). As duas cores ficam separadas horizontalmente (teal mais à esquerda, azul mais à direita, com uma faixa de transição no meio) — com muito overlap entre elas o brilho lê como uma cor só em vez de gradiente.
- `pointermove` na `window` define um alvo normalizado (-1 a 1); um loop `requestAnimationFrame` interpola a posição atual até o alvo (fator `0.18`) e grava `--glow-x`/`--glow-y` no container. Cada mancha tem uma profundidade (`--glow-depth`) diferente — `150`, `240`, `340`px de deslocamento máximo — criando parallax entre elas. O loop para quando a distância até o alvo fica abaixo de 0.1px e só recomeça no próximo `pointermove`.
- Ativo só com `(pointer: fine) and (prefers-reduced-motion: no-preference)`; com toque ou movimento reduzido as manchas ficam paradas na posição base.
- `--glow-opacity` é bem mais alto no claro (`0.8`) que no escuro (`0.5`) — nos dois temas o texto que fica sobre o brilho (hero e nav do header antes de rolar) usa `--foreground`, não `--muted`/`--accent`; os números de contraste que sustentam esses valores estão em "Texto sobre o brilho" acima.

## Padrões de componentes

Ainda não implementados com a identidade visual final. Serão documentados aqui conforme forem construídos:

- Card de projeto vertical (painel visual, pill de tipo, botão principal)
- Pill
- Botão principal e link secundário
- Timeline de experiências

Até lá, a especificação de cada um está na seção "Decisions" do design do change `portfolio-mvp`.
