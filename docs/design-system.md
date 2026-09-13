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
| `--accent` | `text-accent`, `bg-accent` | `#36707f` | `#7eb3c1` | destaque: links, título profissional, pills, botão principal |
| `--accent-foreground` | `text-accent-foreground` | `#fffdf8` | `#0f2a31` | texto sobre fundo `bg-accent` |
| `--border` | `border-border` | `rgba(67,126,142,0.22)` | `rgba(126,179,193,0.18)` | bordas e divisórias (decorativo, nunca texto) |
| `--glow-1` | `bg-glow-1` | `#7eb3c1` | `#36707f` | brilho de fundo, tom teal (decorativo) |
| `--glow-2` | `bg-glow-2` | `#94c4fc` | `#587ea5` | brilho de fundo, tom azul (decorativo) |

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
| Nome (`h1`) | `text-4xl sm:text-5xl font-bold` | hero |
| Título de página (`h1`) | `text-3xl font-bold` | página 404 |
| Título de seção (`h2`) | `text-2xl font-semibold` | Experiências, Projetos |
| Título de card (`h3`) | `text-lg font-semibold` | card de projeto |
| Cargo (`h3`) | `font-semibold` | item de experiência |
| Título profissional | `text-lg font-medium text-accent` | hero |
| Texto corrido | `leading-7` (+ `text-muted` quando secundário) | descrições, bio |
| Texto auxiliar | `text-sm text-muted` | datas, empresa, links do header |

## Padrões de componentes

Ainda não implementados com a identidade visual final. Serão documentados aqui conforme forem construídos:

- Card de projeto vertical (painel visual, pill de tipo, botão principal)
- Pill
- Botão principal e link secundário
- Timeline de experiências
- Brilho de fundo interativo
- Menu mobile (hambúrguer abaixo de 768px, painel abaixo do header)
- Movimento: animações de entrada ao rolar e hover nos cards (tokens de duração e curva `cubic-bezier(0.2, 0, 0, 1)`, inspirados em [tubikstudio.com/works](https://tubikstudio.com/works))

Até lá, a especificação de cada um está na seção "Decisions" do design do change `portfolio-mvp`.
