## Context

Hoje `components/projects/ProjectsSection.tsx` renderiza todos os itens de `data/projects.ts` dentro de `ProjectsCarousel` (grade a partir de `sm`, carrossel com `scroll-snap` abaixo disso). `ProjectCard` já embute classes de dimensionamento do carrossel (`w-[85%] shrink-0 snap-start`, neutralizadas a partir de `sm` com `sm:w-auto sm:shrink sm:snap-align-none`), então hoje só funciona dentro do `ProjectsCarousel`.

O header (`components/header/DesktopNav.tsx`, `MobileMenu.tsx`, `BackToTopLink.tsx`) usa `<a href="#hash">` com `onSmoothAnchorClick` (`components/header/smoothScroll.ts`), que assume que a seção-alvo existe na página atual. `portfolio-mvp` ainda não foi arquivado (ver nota em `proposal.md`); os requirements que esta mudança estende vivem em `openspec/changes/portfolio-mvp/specs/`.

## Goals / Non-Goals

**Goals:**
- Home exibe só uma seleção curada de projetos, com link para o acervo completo.
- Nova página `/[locale]/projects` reaproveita `ProjectCard` numa grade sem carrossel.
- Header continua funcional (nav + voltar ao topo) quando acionado fora da home.

**Non-Goals:**
- Não adiciona item de nav dedicado a "Projetos" na página de projetos (o header continua com os 2 links atuais, âncoras da home).
- Não define quais projetos são destaque — cadastro de conteúdo fica com a Roberta.
- Não mexe em Hero, Experiências, nem nas animações de entrada já existentes (o `RevealObserver` do layout já cobre qualquer página).

## Decisions

### Campo `featured` em `Project`, com fallback para "mostrar tudo"
`data/types.ts` ganha `featured?: boolean` em `Project`. `ProjectsSection` filtra `projects.filter((p) => p.featured)`; se o resultado vier vazio (nenhum projeto marcado ainda), usa a lista completa como estava antes. Isso evita que a home fique com a seção vazia enquanto o cadastro de destaques não é feito, sem exigir validação de build para "pelo menos um destaque".

Alternativa descartada: campo obrigatório com checagem em tempo de build (como o padrão de tradução obrigatória do projeto) — rejeitada porque bloquearia o `pnpm build` por uma decisão de conteúdo pendente, e aqui o pior caso (mostrar tudo) já é o comportamento atual.

### Classes de dimensionamento saem do `ProjectCard`, viram responsabilidade de quem renderiza
`ProjectCard` perde `w-[85%] shrink-0 snap-start sm:w-auto sm:shrink sm:snap-align-none` do `<article>` raiz. `ProjectsSection` passa a envolver cada card num `<div>` com essas classes ao montar os filhos do `ProjectsCarousel`; a nova página envolve os cards num grid simples (`grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3`) sem essas classes. `ProjectsCarousel` não muda (continua tratando `container.children` para o `IntersectionObserver` dos dots; os filhos agora são os wrappers, o que não afeta o índice).

Alternativa descartada: prop `className` no `ProjectCard` para o chamador injetar o dimensionamento — mais indireção para o mesmo resultado, e só existem dois chamadores hoje.

### Link "ver todos" dentro da seção, não um terceiro item no header
O link fica no fim da seção de projetos da home (abaixo do carrossel/grade), não em `navItems.ts`. Mantém o header com 2 links (Experiências, Projetos) e coloca a descoberta da página nova exatamente onde o visitante já está pensando em projetos.

### Navegação do header fora da home via `usePathname`
`DesktopNav`, `MobileMenu` e `BackToTopLink` (todos client) já podem usar `usePathname` de `@/i18n/navigation` (com prefixo de locale já removido, então a home é `"/"`). Um helper pequeno decide o `href`:

```ts
function sectionHref(pathname: string, locale: string, hash: string) {
  return pathname === "/" ? `#${hash}` : `/${locale}#${hash}`;
}
```

`onSmoothAnchorClick` não precisa mudar: ele já ignora (`return` cedo) qualquer `href` que não comece com `#`, então fora da home o clique vira navegação normal do navegador para `/<locale>#hash>`, que abre a home já posicionada na seção (comportamento coberto pelo requirement "Acesso direto a uma seção", já existente). Dentro da home, o `href` continua sendo só `#hash` e a rolagem animada atual não muda.

Alternativa descartada: trocar os `<a>` pelo componente `Link` de `@/i18n/navigation` nesses casos — obrigaria uma ramificação de componente (`<a>` vs `<Link>`) em vez de só uma ramificação de string, para o mesmo resultado.

## Risks / Trade-offs

- [Fallback "mostra tudo" pode mascarar o esquecimento de marcar destaques] → Aceitável: é o mesmo comportamento que a home já tem hoje, nunca fica pior.
- [`ProjectCard` sem dimensionamento próprio depende do chamador aplicar o wrapper certo] → Só dois chamadores (`ProjectsSection`, a nova página), ambos cobertos pelos cenários da spec; um teste manual em 360px em cada um confirma.
- [`portfolio-mvp` não arquivado] → Já registrado na proposal; ao arquivar `portfolio-mvp`, reconciliar manualmente os requirements "Cards de projetos", "Navegação entre seções" e "Voltar ao topo" com o que está aqui.

## Migration Plan

Sem dados a migrar nem rota removida — mudança aditiva. Ordem sugerida de implementação: (1) campo `featured` + fallback em `ProjectsSection`, (2) tirar as classes de carrossel do `ProjectCard` e ajustar os dois chamadores, (3) nova rota `/[locale]/projects`, (4) link "ver todos" na home, (5) navegação do header fora da home. Cada passo é verificável isoladamente no navegador antes do próximo.
