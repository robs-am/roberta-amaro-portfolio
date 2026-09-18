## Why

A seção de projetos na home já lista todos os projetos (hoje 5, crescendo para 6+ em breve, e ainda vai ganhar os projetos do trabalho atual). Em uma página única, isso deixa a home cada vez mais longa e faz o carrossel mobile (scroll horizontal com snap) arrastar por muitos cards — uma experiência ruim para quem só quer ter uma visão geral rápida.

## What Changes

- A home passa a mostrar só uma seleção curada de projetos em destaque (marcados via um novo campo `featured` no cadastro de cada projeto), em vez da lista completa.
- A seção de projetos da home ganha um link "ver todos os projetos", levando a uma nova página dedicada.
- Nova rota `/[locale]/projects` lista todos os projetos em uma grade responsiva (reaproveitando `ProjectCard`), sem carrossel — não há problema de conteúdo empilhado verticalmente numa página própria.
- O card de projeto (`ProjectCard`) deixa de embutir classes específicas do carrossel (largura de 85%, `snap-start`); esse dimensionamento passa a ser responsabilidade de quem o renderiza (carrossel na home, grade na nova página), para o mesmo card servir aos dois contextos sem gambiarra visual.
- Os links do header (nav desktop, menu mobile, ícone de voltar ao topo) passam a resolver o destino de acordo com a rota atual: em `#hash` quando já na home (mantendo a rolagem animada existente), ou `/<locale>#hash` quando em outra página (ex.: a nova página de projetos), para continuar funcionando fora da home.
- Hero e seção de experiências continuam exatamente como estão hoje — esta mudança não os afeta.

Não é uma mudança de conteúdo: quais projetos especificamente entram na seleção de destaque da home fica marcado como pendência, a critério da Roberta.

**Nota sobre capabilities:** `portfolio-mvp` (que define a home, incluindo a seção de projetos e a navegação do header) ainda não foi arquivado — `openspec/specs/` está vazio, então não existe spec principal para declarar como `Modified Capabilities` sem violar o fluxo delta do OpenSpec. Por isso, esta proposta declara tudo como uma capability nova; os requirements abaixo estendem/substituem, na prática, os requirements "Cards de projetos" (`portfolio-content`) e "Navegação entre seções"/"Voltar ao topo" (`portfolio-page`) de `openspec/changes/portfolio-mvp/`. Quando `portfolio-mvp` for arquivado, esses requirements de lá devem ser reconciliados com os desta capability (registrado como pendência em `tasks.md`).

## Capabilities

### New Capabilities
- `projects-showcase`: página dedicada listando todos os projetos, o comportamento da home de exibir apenas destaques com um link para essa página, e a navegação do header fora da home.

### Modified Capabilities
(nenhuma — ver nota acima)

## Impact

- `data/types.ts`: campo opcional `featured?: boolean` em `Project`.
- `data/projects.ts`: marcar os projetos que entram na seleção da home (pendência de conteúdo).
- `components/projects/ProjectsSection.tsx`: filtrar por `featured` na home e adicionar o link "ver todos".
- `components/projects/ProjectCard.tsx`: remover classes de dimensionamento específicas do carrossel; quem renderiza o card passa a controlar largura/snap.
- `components/projects/ProjectsCarousel.tsx`: aplicar as classes de largura/snap que saíram do `ProjectCard`.
- Novo `app/[locale]/projects/page.tsx` (e `generateMetadata` correspondente): grade com todos os projetos.
- `components/header/navItems.ts`, `DesktopNav.tsx`, `MobileMenu.tsx`, `BackToTopLink.tsx`: resolução de href consciente da rota atual (via `usePathname` de `i18n/navigation.ts`).
- `messages/pt.json`, `messages/en.json`: novas strings (título/descrição da página de projetos, rótulo do link "ver todos").
