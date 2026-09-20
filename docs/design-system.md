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
| `--background` | `bg-background` | `#faf6f6` | `#181216` | fundo da página |
| `--card` | `bg-card` | `#ffffff` | `#221a20` | cards e blocos de conteúdo |
| `--elevated` | `bg-elevated` | `#f5eded` | `#2b2128` | superfícies internas e hover |
| `--foreground` | `text-foreground` | `#2b1f27` | `#f7eff3` | texto principal |
| `--muted` | `text-muted` | `#6b5560` | `#c9b7c1` | texto secundário (datas, empresa, descrições) |
| `--accent` | `text-accent`, `bg-accent` | `#7f2f5f` | `#e59cc2` | destaque: links, traço decorativo do hero, pills, botão principal |
| `--accent-foreground` | `text-accent-foreground` | `#ffffff` | `#3a1029` | texto sobre fundo `bg-accent` |
| `--border` | `border-border` | `rgba(127,47,95,0.18)` | `rgba(229,156,194,0.18)` | bordas e divisórias (decorativo, nunca texto) |
| `--highlight` | `text-highlight` | `#66264c` | `#f8d8e8` | tom de texto do accent, mais escuro, para passar AA sobre o brilho (o `--accent` fica apertado lá); usado no botão principal do hero, só no tema claro (no escuro os botões do hero são neutros, veja abaixo) |
| `--glow-1` | `bg-glow-1` | `#f5d5e5` | `#5c2a47` | brilho de fundo, primeira mancha (decorativo; ameixa no escuro, rosa no claro) |
| `--glow-2` | `bg-glow-2` | `#f9e4da` | `#74424f` | brilho de fundo, segunda mancha (decorativo; rosa-terra no escuro, pêssego no claro) |
| `--glow-opacity` | — (usado só via `.glow-blob` em `globals.css`) | `0.5` | `0.4` | opacidade das manchas do brilho; ver "Texto sobre o brilho" abaixo |

Opacidades sobre tokens funcionam normalmente (`bg-background/85`, `bg-accent/10`).

**Botões do hero.** No claro usam o accent (o principal em `bg-accent/25` com `text-highlight`, o secundário em `bg-accent/15` com `text-accent`). No escuro são **neutros**: o principal é sólido em `--foreground` com texto `--background` (contraste 16.36), e o secundário é só um contorno `--foreground`/40% com texto `--foreground`. O rosa vivo sobre a névoa ameixa apagada ficava doce demais, então no escuro a cor fica só no brilho e nos detalhes (links, anos, traço do hero).

### Contraste verificado

Razão de contraste WCAG dos pares de texto usados hoje:

| Par (texto / fundo) | Claro | Escuro |
|---|---|---|
| `foreground` / `background` | 14.74 | 16.36 |
| `foreground` / `card` | 15.81 | 15.04 |
| `muted` / `background` | 6.33 | 9.70 |
| `muted` / `card` | 6.79 | 8.92 |
| `accent` / `background` | 7.91 | 8.68 |
| `accent` / `card` | 8.49 | 7.98 |
| `accent` / pill (`bg-accent/10` sobre `card`) | 7.20 | 6.63 |
| `accent-foreground` / `accent` | 8.49 | 7.67 |

Todos os pares passam AA com folga. Ainda assim, não use `accent` para texto sobre `elevated` ou sobre fundos com mais de 10% de `accent` sem recalcular.

### Texto sobre o brilho

Dois lugares ficam diretamente sobre o `BackgroundGlow`: o hero e o `Header` enquanto está transparente (antes de rolar ~8px). Para eles o par relevante não é `texto / background`, e sim `texto / background composto com o brilho no ponto mais claro` (pior caso: dois blobs se sobrepondo, sem atenuação do blur).

**Importante:** misturar o brilho com o `background` não necessariamente ajuda o contraste em nenhum tema — no escuro o brilho é mais claro que o fundo (reduz contraste de texto claro), e no claro o brilho é mais *escuro* que o fundo (reduz contraste de texto escuro, o oposto do que se poderia supor). Em ambos os casos, `muted` e `accent` não sobram contraste suficiente sobre o brilho em opacidade vívida. Por isso, tanto o cargo/bio do hero quanto os links inativos da nav usam `foreground` (não `muted`/`accent`) enquanto estão sobre o brilho — a nav troca para `text-muted` normal assim que o header ganha fundo sólido ao rolar (`useHeaderScrolled`, em `HeaderScrollContext.tsx`). A hierarquia visual nesses estados fica só por tamanho/peso de fonte e pelo pill do link ativo, não por cor.

Com isso, o único par que precisa passar no pior caso é `foreground`:

| Tema | `--glow-opacity` | `foreground` no pior caso (2 blobs sobrepostos) |
|---|---|---|
| Escuro | 0.8 | 7.76 |
| Escuro | 0.65 | 8.60 |
| Escuro | 0.5 | 9.79 |
| Escuro | **0.4 (valor em uso, com as cores atuais)** | **10.81** |
| Claro | **0.5 (valor em uso, com as cores atuais)** | **13.03** |

A bio do hero usa `text-foreground/90` (não `foreground` puro) pra ganhar um pouco de hierarquia visual sobre o nome/cargo; com essa diluição o pior caso cai para **9.08 no escuro** e **9.91 no claro** — ainda dentro de AA, mas com bem menos folga que o `foreground` puro. Não dilua mais que isso (`/90`) sem recalcular.

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
| Nome (`h1`) | `text-6xl font-bold lg:text-8xl` | hero |
| Título de página (`h1`) | `text-3xl font-bold` | página 404 |
| Título de seção (`h2`) | `text-3xl font-semibold` | Experiências, Projetos |
| Título de card (`h3`) | `text-xl font-semibold` | card de projeto |
| Ano da experiência | `font-display text-5xl font-bold tracking-wide text-accent` | item de experiência (é um `p`, não um título) |
| Cargo (`h3`) | `text-lg font-semibold` | item de experiência |
| Cargo do hero | `text-xl font-semibold text-foreground sm:text-2xl`, em caixa normal | hero |
| Bio do hero | `text-xl leading-8 tracking-wide text-foreground/90` | hero |
| Texto corrido | `leading-7` (+ `text-muted` quando secundário) | descrições — a bio do hero fica sobre o brilho e por isso usa `text-foreground/90` |
| Texto auxiliar | `text-sm text-muted` | períodos, empresa, links do header |

Caixa alta, rótulos acima de títulos e pontos do meio entre itens foram removidos de propósito (eram marcas de template): o cargo do hero, a categoria dos cards de projeto e o eyebrow não existem mais. As tecnologias dos cards continuam separadas por `·`.

## Movimento

Inspirado em [tubikstudio.com/works](https://tubikstudio.com/works). O site tem **um momento de movimento só**, a entrada do hero, mais uma entrada discreta nas experiências. Títulos de seção e cards de projeto não animam ao rolar: fade e subida em tudo era o padrão de página gerada e foi removido. As animações de entrada usam [anime.js](https://animejs.com).

| Token | Valor | Uso |
|---|---|---|
| `--ease-expressive` | `cubic-bezier(0.2, 0, 0, 1)` | curva padrão de interação: arranca rápido, desacelera longo (hover, menu mobile) |
| `--ease-soft` | `cubic-bezier(0.22, 1, 0.36, 1)` | hover dos cards: desacelera bem devagar, sensação mais suave que a expressiva |

Os tempos das animações de entrada ficam direto nos componentes (`Hero.tsx`, `ExperienceEntrance.tsx`), não em tokens CSS.

### Padrão das entradas com anime.js

O CSS só oculta os elementos dentro de `@media (scripting: enabled) and (prefers-reduced-motion: no-preference)`, e só até o componente marcar `data-ready` na sua raiz ao montar (o efeito antes põe `opacity: 0` inline, para não haver quadro visível entre a marca e o início da animação). Assim:

- Com movimento reduzido nada é ocultado e a animação nem roda.
- Se o JavaScript não rodar, o fallback `show-fallback` mostra tudo após 3s. Esse fallback só existe **enquanto** `data-ready` não estiver marcado: uma versão anterior deixava o fallback ativo sempre, e ele mostrava o conteúdo fora da tela após 3s, antes de o usuário rolar até ele.
- Como a entrada depende de hidratação, ela começa quando o JS carrega, não no primeiro paint.

### Hero

Animada num `useEffect` do `Hero` (client), em três etapas, todas com a curva `outExpo`:

| Etapa | Alvo | Efeito | Início | Duração |
|---|---|---|---|---|
| 1 | primeira palavra do nome (`data-hero-word`) | revelada da esquerda pra direita (`clipPath` + `translateX` de −32px) | 0ms | 1400ms |
| 2 | demais palavras do nome | reveladas de cima pra baixo (`clipPath` + `translateY` de −40px), 250ms entre elas | 900ms | 1400ms |
| 3 | barra, cargo, textos, CTAs e ícones (`data-hero-item`, na ordem do DOM) | fade + subida de 28px, 180ms entre itens | 1900ms | 1300ms |

O hero completo leva cerca de 4s. Ele ocupa 100dvh, então a seção seguinte só aparece ao rolar e não disputa atenção com a entrada.

### Experiências

Sem cards, linha nem pontos: cada experiência é uma linha em duas colunas (`sm:grid-cols-[9rem_1fr]`), com o **ano de início grande** em Jost na cor accent à esquerda, o período completo logo abaixo em `text-muted`, e cargo, empresa e descrição à direita. No celular as colunas empilham. A lista tem `max-w-3xl` para manter o texto perto de 68 caracteres por linha.

`ExperienceEntrance` (client) renderiza o `ol` e anima cada item uma vez, quando ele entra na tela (`IntersectionObserver`, `threshold: 0.3`): o ano é revelado da esquerda pra direita (`clipPath` + `translateX` de −24px, 1200ms, o mesmo gesto do primeiro nome do hero), e 400ms depois o período e o texto sobem 16px com fade (900ms). Os alvos são marcados com `data-experience-year` e `data-experience-body`.

### Hover e foco nos cards

Card de projeto (`ProjectCard`): a borda vira `--accent` a 60% de opacidade em 500ms com `--ease-soft`. O card não sobe nem dá zoom: só a borda muda. Dentro dele:

- A pílula da seta expande e mostra o rótulo ("Demo" ou "Repo").
- O chevron gira e abre o bloco de contribuição do projeto.
- No projeto com várias capturas, a fatia sob o mouse cresce (`grow-[3]`) para mostrar mais da sua página.

`:focus-within` aplica o mesmo destaque para quem navega por teclado (o foco costuma estar num link dentro do card). Com movimento reduzido, as transições de layout (expansão e fatias) ficam desativadas.

## Menu mobile

Abaixo de 768px, a navegação do `Header` vira um botão hambúrguer (`MobileMenu`, client) de 40×40px com três barras que se tornam um X (`rotate(45deg)`/`rotate(-45deg)` nas barras externas, `opacity-0` na do meio), `aria-expanded`, `aria-controls` e rótulo traduzido (`Header.menu.open`/`Header.menu.close`). A partir de 768px a nav desktop (`hidden md:block`) reaparece e o botão (`md:hidden`) some.

O painel abre abaixo do header com uma técnica de CSS Grid (`grid-rows-[0fr]` → `grid-rows-[1fr]`) para animar a altura sem precisar medir o conteúdo, e recebe `inert` quando fechado — tira o painel da ordem de tab e do leitor de tela sem precisar de `display: none` (que cortaria a transição). Os links vêm de `navItems`, a mesma lista usada pela nav desktop, empilhados com área de toque mínima de 44px (`min-h-11`).

O menu fecha ao: acionar um link, pressionar Esc (o foco volta pro botão), clicar/tocar fora do header (`pointerdown`), ou quando a viewport cruza 768px enquanto o menu está aberto. A animação das barras e do painel usa `--ease-expressive` em 300ms e é desativada com movimento reduzido (`motion-reduce:transition-none`).

## Brilho de fundo

`components/BackgroundGlow.tsx` (client, `aria-hidden`, `pointer-events-none`), renderizado no layout antes do `Header`. Inspirado em [alignerr.com](https://www.alignerr.com), aprovado com a autora após algumas rodadas de calibração.

- Camada `absolute` de `100dvh` de altura no topo da página, com máscara radial (`.glow`, em `globals.css`) que suaviza as quatro bordas (não só embaixo), pra o `overflow-hidden` do container nunca cortar o blur numa linha reta. Na home, a partir de 1024px, o hero é centralizado na vertical e não ancorado no topo, então a máscara centra mais baixo (`.glow-home`, `55% 42%`) para iluminar o conteúdo e não o espaço vazio acima dele.
- **Tema escuro, máscara mais fechada.** O brilho é muito mais saturado contra o fundo quase preto, e uma mancha cobrindo a largura toda lê como o "aurora gradient" genérico. Por isso `.dark .glow` e `.dark .glow-home` usam uma elipse menor (`80% 65%` no topo; `52% 58%` centrada no conteúdo na home em desktop): o brilho fica como uma poça de luz atrás do nome e dos botões, com fundo liso ao redor. O tema claro mantém a máscara ampla. Como só as bordas enfraquecem e o centro continua igual, o contraste do pior caso (tabela em "Texto sobre o brilho") não piora.
- 3 manchas (`div`, `border-radius: 9999px`, `filter: blur(170px)`, cor sólida em `--glow-1`/`--glow-2`, opacidade em `--glow-opacity`). As duas cores ficam separadas horizontalmente (`--glow-1` mais à esquerda, `--glow-2` mais à direita, com uma faixa de transição no meio) — com muito overlap entre elas o brilho lê como uma cor só em vez de gradiente.
- `pointermove` na `window` define um alvo normalizado (-1 a 1); um loop `requestAnimationFrame` interpola a posição atual até o alvo (fator `0.18`) e grava `--glow-x`/`--glow-y` no container. Cada mancha tem uma profundidade (`--glow-depth`) diferente — `150`, `240`, `340`px de deslocamento máximo — criando parallax entre elas. O loop para quando a distância até o alvo fica abaixo de 0.1px e só recomeça no próximo `pointermove`.
- Ativo só com `(pointer: fine) and (prefers-reduced-motion: no-preference)`; com toque ou movimento reduzido as manchas ficam paradas na posição base.
- `--glow-opacity` é `0.5` no claro (cores bem pálidas, então já dá um brilho suave) e `0.4` no escuro (as cores do escuro são ameixa e rosa-terra apagados de propósito: uma versão magenta mais saturada lia forte demais sobre o fundo quase preto) — nos dois temas o texto que fica sobre o brilho (hero e nav do header antes de rolar) usa `--foreground`, não `--muted`/`--accent`; os números de contraste que sustentam esses valores estão em "Texto sobre o brilho" acima.

O brilho existe só no topo da página (o hero). A seção de Projetos não tem brilho próprio: ela chegou a ter duas manchas e uma camada de fade, mas destoavam do resto e foram removidas. Os painéis decorativos dos cards sem imagem (`.project-panel`) ainda usam `--glow-1` num gradiente radial pequeno.

## Padrões de componentes

Ainda não implementados com a identidade visual final. Serão documentados aqui conforme forem construídos:

- Card de projeto vertical (painel visual, botão principal)
- Botão principal e link secundário

Até lá, a especificação de cada um está na seção "Decisions" do design do change `portfolio-mvp`.
