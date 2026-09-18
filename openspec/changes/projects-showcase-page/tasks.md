## 1. Dados

- [x] 1.1 Adicionar `featured?: boolean` a `Project` em `data/types.ts`; verificar com `pnpm exec tsc --noEmit`
- [x] 1.2 Marcar `featured: true` nos projetos que a Roberta escolher para a home em `data/projects.ts`; até a escolha, nenhum projeto fica marcado (a seção usa o fallback de mostrar todos) — marcados Tommy Hilfiger, Liritty, Candide e Creamy Skincare; Skelt fica só na página de todos os projetos

## 2. Card de projeto reutilizável

- [x] 2.1 Remover de `components/projects/ProjectCard.tsx` as classes de dimensionamento do carrossel (`w-[85%] shrink-0 snap-start sm:w-auto sm:shrink sm:snap-align-none`) do `<article>` raiz; verificar com `pnpm exec tsc --noEmit`
- [x] 2.2 Em `components/projects/ProjectsSection.tsx`, envolver cada `ProjectCard` renderizado dentro do `ProjectsCarousel` com um `<div>` que aplica as classes removidas; verificar no navegador em 360px que o carrossel da home continua deslizando com snap por card, igual a antes

## 3. Destaques na home

- [x] 3.1 Em `ProjectsSection.tsx`, filtrar `projects` por `featured`, com fallback para a lista completa quando o filtro vier vazio; verificar com `pnpm exec tsc --noEmit` que o tipo do array filtrado continua `Project[]`
- [x] 3.2 Adicionar a chave `Projects.viewAll` ("Ver todos os projetos" / "View all projects") em `messages/pt.json` e `messages/en.json`; verificar que as chaves são idênticas nos dois arquivos
- [x] 3.3 Adicionar, abaixo do carrossel/grade em `ProjectsSection.tsx`, um link para `/projects` (via `Link` de `@/i18n/navigation`, que já prefixa o locale) usando o rótulo de `Projects.viewAll`; verificar em `/pt` e `/en` que o link aparece com o texto no idioma certo e leva à URL prefixada corretamente

## 4. Página de todos os projetos

- [x] 4.1 Adicionar as chaves `ProjectsPage.title` e `ProjectsPage.description` em `messages/pt.json` e `messages/en.json` (para o `<title>` e a meta description da nova rota); verificar que as chaves são idênticas nos dois arquivos
- [x] 4.2 Criar `app/[locale]/projects/page.tsx`: `generateMetadata` com as chaves acima, `notFound()` para locale inválido (mesmo padrão de `app/[locale]/page.tsx`), heading reaproveitando `Projects.title`, e todos os projetos de `data/projects.ts` renderizados com `ProjectCard` dentro de uma grade (`grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3`); verificar com `pnpm exec tsc --noEmit`
- [x] 4.3 Verificar no navegador em `/pt/projects` e `/en/projects`: todos os projetos aparecem (não só os destaques), em 360px ficam em coluna única sem rolagem horizontal, e os cards continuam com hover/foco e animação de entrada (`data-reveal`) como na home

## 5. Navegação do header fora da home

- [x] 5.1 Criar um helper (`components/header/sectionHref.ts` ou similar) que recebe o `pathname` atual (de `usePathname` de `@/i18n/navigation`), o locale e uma âncora, e retorna `#<hash>` quando `pathname === "/"` ou `/<locale>#<hash>` caso contrário
- [x] 5.2 Usar o helper em `DesktopNav.tsx`, `MobileMenu.tsx` e `BackToTopLink.tsx` para montar o `href` de cada link, mantendo `onClick={onSmoothAnchorClick}` sem alterações; verificar com `pnpm exec tsc --noEmit`
- [x] 5.3 Verificar no navegador: a partir de `/pt/projects`, clicar em "Experiências" no header abre `/pt#experience` já posicionado na seção; clicar no ícone de voltar ao topo abre `/pt#hero`; repetir em `/en/projects`
- [x] 5.4 Verificar que, dentro da home (`/pt` ou `/en`), a navegação por âncora continua idêntica a antes (rolagem animada, sem recarregar a página)
- [x] 5.5 (escopo adicionado durante a implementação) Adicionar um link "← Voltar para a home" no topo de `app/[locale]/projects/page.tsx` (mesmo padrão de `not-found.tsx`), já que o ícone de voltar ao topo do header não comunica "ir para a home" com clareza numa página sem topo próprio; chave `ProjectsPage.back` em `messages/pt.json` e `messages/en.json`; verificado no navegador

## 6. Verificação final

- [x] 6.1 Rodar `pnpm build` e verificar que passa sem erros de tipo ou lint e que `/pt/projects` e `/en/projects` aparecem como rotas estáticas na saída
- [x] 6.2 Rodar `openspec validate projects-showcase-page --strict` e confirmar que passa
