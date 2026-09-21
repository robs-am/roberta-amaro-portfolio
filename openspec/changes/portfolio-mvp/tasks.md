## 1. Setup do projeto

- [x] 1.1 Criar o projeto Next.js (App Router, TypeScript, Tailwind, ESLint) na raiz do repositório preservando `.claude/` e `openspec/` (se o `create-next-app` recusar o diretório não vazio, gerar em pasta temporária e mover); verificar que `pnpm dev` abre a página inicial padrão
- [x] 1.2 Ativar `strict: true` no `tsconfig.json` e verificar que `pnpm exec tsc --noEmit` passa
- [x] 1.3 Instalar `next-intl` e `next-themes` com versões fixas e verificar que aparecem em `package.json` e que `pnpm build` passa
- [x] 1.4 Criar a estrutura de pastas do design (`app/[locale]/`, `components/`, `data/`, `i18n/`, `messages/`) removendo a página padrão do template; verificar que as pastas existem

## 2. Internacionalização

- [x] 2.1 Criar `i18n/routing.ts` (locales `pt`/`en`, default `pt`, `localePrefix: 'always'`), `i18n/request.ts` e `i18n/navigation.ts`; verificar com `pnpm exec tsc --noEmit`
- [x] 2.2 Criar o proxy do next-intl (`proxy.ts` ou `middleware.ts`, conforme a versão do Next.js) com matcher que ignora assets; verificar que `/` redireciona para `/pt` e, com `Accept-Language: en-US` (via `curl -I -H`), para `/en`
- [x] 2.3 Criar `messages/pt.json` e `messages/en.json` com as strings de UI (nav, títulos de seção, rótulos acessíveis, título e descrição da página, "Atual"/"Present", rótulos de links); verificar que ambos têm exatamente as mesmas chaves
- [x] 2.4 Criar `app/[locale]/layout.tsx` com `NextIntlClientProvider`, `generateStaticParams`, `notFound()` para locale inválido e `<html lang>` mapeado (`pt-BR`/`en`), com o idioma lido via `next/root-params` em `i18n/request.ts`; verificar que `/fr` redireciona para `/pt/fr`, que responde 404, e que `/en` tem `lang="en"`
- [x] 2.5 Implementar `generateMetadata` com título, descrição e `alternates.languages` (hreflang) por idioma; verificar no HTML de `/pt` o `<title>` em português e os links `hreflang` para `/pt` e `/en`

## 3. Tema e identidade visual

- [x] 3.1 Definir em `app/globals.css` os tokens da tabela do design (`--background`, `--card`, `--elevated`, `--foreground`, `--muted`, `--accent`, `--accent-foreground`, `--border`, `--glow-*`) em `:root` e `.dark`, expostos via `@theme`, com `@custom-variant dark` por classe; verificar que adicionar a classe `dark` ao `<html>` troca as cores e que o script de contraste aponta todos os pares de texto com 4.5:1 ou mais
- [x] 3.2 Trocar a Geist por Jost (`--font-display`, títulos) e IBM Plex Sans (`--font-sans`, texto) via `next/font/google`, variáveis e com subset `latin`; verificar no navegador que títulos usam Jost e o texto usa IBM Plex Sans
- [x] 3.3 Adicionar o `ThemeProvider` (`attribute="class"`, `defaultTheme="system"`, `enableSystem`) e `suppressHydrationWarning` no `<html>`; verificar que a página segue o modo claro/escuro do sistema sem warnings de hidratação no console
- [x] 3.4 Criar `components/ThemeToggle.tsx` (client) com botão renderizado só após hidratar, rótulo acessível traduzido, operável por teclado e troca com cross-fade via View Transitions (instantânea sem suporte ou com movimento reduzido), e `components/ThemeClassSync.tsx` para reaplicar a classe do tema antes da pintura quando o layout remonta; verificar que alterna o tema sem recarregar e sem salto de luminosidade, que a escolha persiste após reload e que alternar `/pt` <-> `/en` no tema escuro não mostra o tema claro
- [x] 3.5 Verificar ausência de flash: com tema escuro salvo, recarregar com throttling de rede lento no DevTools e confirmar que o tema claro nunca aparece
- [x] 3.6 Criar `components/BackgroundGlow.tsx` (client) conforme o design (manchas em `--glow-*`, `pointermove` + `requestAnimationFrame` com interpolação e parada ao acomodar, ativo só com `pointer: fine` e sem movimento reduzido, `aria-hidden` e `pointer-events-none`) e renderizá-lo no layout; verificar que o brilho acompanha o mouse suavemente, fica parado com movimento reduzido e com emulação de toque no DevTools, não deixa `requestAnimationFrame` rodando no painel Performance com o ponteiro parado e não bloqueia cliques em links sobre ele
- [x] 3.7 Ajustar opacidade e blur do brilho nos dois temas; verificar que o texto do hero mantém contraste AA sobre a área mais clara do brilho
- [x] 3.8 (pendência) Refinar a sensação de movimento do brilho com a autora (velocidade da interpolação, amplitude do deslocamento, profundidade entre manchas) e atualizar os valores finais de `--accent`, `--glow-*` e `--glow-opacity` no `design.md` e em `docs/design-system.md`; verificar no navegador que a movimentação foi aprovada

## 4. Estrutura da página

- [x] 4.1 Criar `components/LocaleSwitcher.tsx` (client) que usa `router.replace` do next-intl preservando `window.location.hash`, pré-carrega os outros idiomas com `router.prefetch`, indica o idioma ativo e é operável por teclado; verificar que `/pt#projects` vira `/en#projects` e que, no build de produção, a troca acontece sem espera perceptível
- [x] 4.2 Criar `components/Header.tsx` fixo no topo, translúcido com `backdrop-blur` sobre o brilho, com links `#experience` e `#projects`, `LocaleSwitcher` e `ThemeToggle`; verificar que continua visível e legível após rolar
- [x] 4.3 Adicionar rolagem suave condicionada a `prefers-reduced-motion: no-preference` e `scroll-margin-top` nas seções; verificar que o título da seção não fica sob o header e que, com movimento reduzido emulado no DevTools, a rolagem é instantânea
- [x] 4.3.1 Substituir o `scroll-behavior: smooth` nativo por uma rolagem animada em JS (`components/header/smoothScroll.ts`, `requestAnimationFrame` + easing cúbico, 650ms), aplicada aos links da nav desktop, do menu mobile e a um novo `BackToTopLink` (ícone "chevrons-up" no lugar do nome por extenso no header, que ficava redundante com o nome já em destaque no hero); verificar no navegador que a rolagem não trava nem acelera de repente (o `scroll-behavior: smooth` do CSS concorria com o `scrollTo` chamado a cada frame) e que cliques modificados (Cmd/Ctrl/Shift/Alt, botão do meio) continuam abrindo em nova aba
- [x] 4.4 Criar `app/[locale]/page.tsx` com as seções na ordem Hero, `#experience`, `#projects`; verificar que `/en#experience` abre na seção de experiências
- [x] 4.5 Criar `app/[locale]/not-found.tsx` simples e a rota `app/[locale]/[...rest]/page.tsx`; verificar que `/pt/fr` exibe essa página com status 404
- [x] 4.6 Adicionar `Header.menu.open` e `Header.menu.close` em `messages/pt.json` e `messages/en.json` e criar `components/navItems.ts` com a lista única de links (`#experience`, `#projects`) usada pela nav desktop; verificar que as mensagens têm as mesmas chaves nos dois idiomas e que a nav desktop continua igual
- [x] 4.7 Criar `components/MobileMenu.tsx` (client) com botão hambúrguer de 40×40px (três barras que viram X), `aria-expanded`, `aria-controls` e rótulo traduzido, e painel abaixo do header com os links de `navItems` empilhados (área de toque mínima de 44px); no `Header`, nav desktop com `hidden md:block`, `MobileMenu` com `md:hidden` e header mobile em uma linha (nome; idioma, tema e menu); verificar em 360px que o botão substitui os links, com seletor e tema visíveis e sem rolagem horizontal, e em 1024px que os links aparecem e o botão some
- [x] 4.8 Fechar o menu ao acionar um link, com Esc (foco volta ao botão), com `pointerdown` fora do header e quando `(min-width: 768px)` passar a valer, e desativar a animação das barras e do painel com movimento reduzido; verificar cada caso no navegador e que Tab percorre os links do menu aberto

## 5. Conteúdo

- [x] 5.1 Criar os tipos `Locale`, `Localized`, `Experience` e `Project` (com `category: Localized`) e o helper `localize`; verificar que remover a chave `en` de um campo `Localized` faz `pnpm exec tsc --noEmit` falhar apontando o item
- [x] 5.2 Criar `data/profile.ts` e `components/Hero.tsx` com nome em Jost, título e bio placeholder bilíngues; verificar que o texto muda entre `/pt` e `/en`
- [x] 5.3 Criar `data/experiences.ts` com pelo menos 3 experiências fictícias (uma sem data de término) usando `satisfies Experience[]`, cadastradas fora de ordem; verificar com `pnpm exec tsc --noEmit`
- [x] 5.4 Criar `components/ExperienceSection.tsx` como timeline vertical (linha, ponto em `--accent`, período, cargo em Jost, empresa, descrição), com ordenação por data decrescente, datas formatadas por idioma e "Atual"/"Present"; verificar em `/pt` e `/en` a ordem, o formato das datas e o término da experiência atual, e que a timeline não gera rolagem horizontal em 360px
- [x] 5.5 Criar `data/projects.ts` com pelo menos 3 projetos fictícios com `category`, cobrindo: com repo e demo, só com repo, com imagem e sem imagem (imagem em `public/projects/`); verificar com `pnpm exec tsc --noEmit`
- [x] 5.6 Criar `components/ProjectCard.tsx` vertical (painel `aspect-video` com imagem ou fundo decorativo `aria-hidden`, pill com `category`, título em Jost, descrição, tecnologias, primeiro link disponível como botão em `--accent` e o outro como link de texto, `target="_blank" rel="noopener noreferrer"`) e `components/ProjectsSection.tsx` (grade 1/2/3 colunas); verificar que o card sem imagem tem painel decorativo da mesma altura e sem conteúdo para leitor de tela, e que o card sem demo mostra só o repositório como botão
- [x] 5.7 Adicionar links de contato (e-mail, LinkedIn, GitHub) no hero, com ícone em stroke (Tabler Icons) e rótulo acessível; botão de CV fica de fora por enquanto (sem arquivo definido)
- [x] 5.8 Escrever o conteúdo real do hero (`data/profile.ts`): cargo e bio de verdade no lugar do texto de exemplo, em `pt` e `en`; verificar que o texto muda entre os dois idiomas
- [x] 5.9 Escrever a descrição real de cada projeto (`data/projects.ts`): o que a Roberta especificamente fez em cada um (Tommy Hilfiger, Liritty, Candide, Creamy, Skelt), no lugar do lorem ipsum, em `pt` e `en`; verificar com `pnpm exec tsc --noEmit` e que a truncagem (`ver mais`) do `ProjectDescription` continua funcionando com o texto novo
- [ ] 5.10 (pendência) Criar seção "Skills"/"Competências" (inspirada em referência do Dribbble, adaptada à identidade visual do site — `--accent` teal, não o roxo/dark da referência): cards agrupando habilidades por categoria com descrição curta e pills de tecnologia; aguardando Roberta definir as categorias e o conteúdo de cada uma
- [x] 5.11 Adaptar `ProjectsSection` para scroll horizontal com `scroll-snap` abaixo do breakpoint `sm` (sem setas/bolinhas, usando o scroll nativo, acessível por teclado e leitor de tela) em vez da grade de 1 coluna; verificar em 360px que desliza com snap por card e que o teclado (Tab/setas) navega entre os cards
- [x] 5.12 Escrever as experiências reais (`data/experiences.ts`): Grupo OLX (Software Engineer, dez/2024–atual) e ED3 Digital (Front-End Software Engineer, nov/2022–nov/2024, onde foram feitos Tommy Hilfiger, Liritty, Candide, Creamy e Skelt), removendo as 3 experiências fictícias; verificar com `pnpm exec tsc --noEmit` e que a ordenação e o "Atual"/"Present" continuam corretos

## 6. Animações

- [x] 6.1 Adicionar em `app/globals.css` os tokens `--ease-expressive`, `--duration-reveal`, `--duration-hero`, `--reveal-stagger` e `--reveal-distance` e as regras de `[data-reveal]` (oculto só com `scripting: enabled` e sem movimento reduzido, transição com atraso por `--reveal-index`, animação de segurança que revela após 3s); verificar com JavaScript desativado no DevTools e com movimento reduzido emulado que todo o conteúdo aparece
- [x] 6.2 Criar `components/RevealObserver.tsx` (client) renderizado no layout, com `IntersectionObserver` que marca `data-revealed` uma vez, define `--reveal-index` pela ordem dos elementos que entram juntos no mesmo lote e para de observar; verificar que um elemento com `data-reveal` anima ao entrar na tela e não anima de novo ao rolar de volta
- [x] 6.3 Aplicar `data-reveal` aos títulos de seção, itens da timeline e cards, e a animação CSS de carregamento ao hero (nome, título e bio em sequência, 900ms com 150ms entre linhas, curva `--ease-soft` e leve desfoque), com o `RevealObserver` esperando `--reveal-hold` (250ms, contados desde o início da animação do hero e não da hidratação) antes de revelar o que já está visível em páginas com hero; verificar que o hero anima antes das experiências no carregamento, que timeline e cards entram em sequência ao rolar, que um card entrando sozinho não espera atraso, e que, ao trocar de idioma com os projetos na tela, os cards não ficam ocultos
- [x] 6.4 Adicionar hover e `:focus-within` aos cards (elevação de 4px, borda em `--accent`, zoom 1.03 na imagem do painel, 300ms com `--ease-expressive`), mudando só a borda com movimento reduzido; verificar com mouse, com Tab e com movimento reduzido emulado
- [x] 6.5 Documentar tokens de movimento, menu mobile e padrões de animação em `docs/design-system.md`; verificar que esses itens saíram da lista de padrões pendentes

## 7. Verificação final

- [x] 7.1 Rodar `pnpm build` e verificar que passa sem erros de tipo ou lint e que `/pt` e `/en` aparecem como rotas estáticas na saída
- [ ] 7.2 Verificar responsividade no DevTools em 360px (sem rolagem horizontal, menu hambúrguer, seletor de idioma e alternador de tema acessíveis), 768px (links no header, sem botão de menu) e 1440px (conteúdo centralizado com largura máxima) — ⏸️ Use F12 → Modo Responsivo
- [ ] 7.3 Verificar contraste AA nos temas claro e escuro com Lighthouse ou axe DevTools, incluindo o hero sobre o brilho e os links do menu mobile, e ajustar tokens até não haver falhas de contraste — ⏸️ Use Lighthouse (F12) ou axe DevTools
- [ ] 7.4 Verificar navegação completa só por teclado (Tab até nav ou botão de menu, links do menu aberto, seletor de idioma e alternador de tema, acionando cada um) em `/pt` e `/en` — ⏸️ Use Tab/Shift+Tab no navegador
- [x] 7.5 Verificar com `curl` que o HTML de `/en` já contém os textos em inglês (sem depender de JavaScript) e que o cookie de idioma faz `/` redirecionar para o idioma escolhido manualmente

## 8. Formação e prêmios

- [x] 8.1 Criar o tipo `Education` e `data/education.ts` (PUC Minas e Universidade Veiga de Almeida, com datas `YYYY-MM` ou só `YYYY`) e as chaves `Experience.educationTitle` e `Experience.inProgress` nos dois idiomas; verificar com `pnpm exec tsc --noEmit`
- [x] 8.2 Criar `components/EducationTimeline.tsx` no padrão da timeline de experiências (ano do término em destaque, datas sem mês quando só há ano, "Em andamento"/"In progress") e renderizá-lo em `/experience`; verificar em `/pt/experience` e `/en/experience`
- [x] 8.3 Adicionar `experienceId?` ao tipo `Award` e mostrar dentro do cargo, em `ExperienceTimeline`, os prêmios ligados a ele (hackathon interno ligado ao Grupo OLX); verificar que o prêmio aparece só dentro do cargo
- [x] 8.4 Criar `components/AwardHighlight.tsx` e reorganizar `/experience` em grade de duas colunas a partir de `lg`, com o painel do Claude Impact Lab em coluna lateral fixa (nome do evento como título, colocação como subtítulo) e, abaixo de `lg`, coluna única na ordem experiências, painel, formação; verificar em 360px, 1024px e 1440px
- [x] 8.5 Adicionar `certificateUrl?` ao tipo `Award` e o link "Ver certificado" no painel, exibido só quando existir; verificar que o painel não muda sem o campo
- [x] 8.6 Remover `app/[locale]/awards/page.tsx`, `components/AwardList.tsx`, o item de nav, a rota do sitemap e as chaves `Header.nav.awards` e `AwardsPage`, e redirecionar `/pt/awards` e `/en/awards` para `/experience` em `next.config.ts`; verificar que os dois endereços respondem 301 para `/experience` no mesmo idioma
- [ ] 8.7 (pendência) Anexar o certificado do Claude Impact Lab: definir `certificateUrl` em `data/awards.ts` com o PDF em `public/certificates/` ou um link de verificação, depois de conferir que o arquivo não expõe dados pessoais; aguardando o arquivo da Roberta
- [ ] 8.8 (adiado) Avaliar renomear o item de nav "Experiências"/"Experience" para "Trajetória"/"Background", já que a página reúne experiências, formação e prêmios

## 9. Tema pela preferência do navegador

Substitui a implementação com `next-themes` das tarefas 3.3 e 3.4, que ficam como registro do que foi feito na época.

- [x] 9.1 Reescrever os tokens em `app/globals.css`: tema claro em `:root`, escuro em `@media (prefers-color-scheme: dark)` (exceto com `data-theme="light"`) e em `:root[data-theme="dark"]`, e a variante `dark` do Tailwind com a mesma regra; ajustar as máscaras de `.glow` e `.glow-home` do tema escuro; verificar no CSS gerado que a variante `dark` sai nas duas formas
- [x] 9.2 Criar `components/theme/theme.ts` (`getTheme`, `setTheme`, `subscribeTheme`, `applyStoredTheme` e o `themeInitScript`) e `components/theme/ThemeSync.tsx`, que reaplica o `data-theme` antes da pintura quando o `<html>` remonta na troca de idioma
- [x] 9.3 Reescrever `ThemeToggle` com `useSyncExternalStore`, mantendo o cross-fade por View Transitions, e colocar o script de tema no `<head>` do layout no lugar do `ThemeProvider`
- [x] 9.4 Fazer `HeroShapes`, `MenuShapes` e `shapeStyle` usarem `getTheme()` e `subscribeTheme()` em vez da classe `dark` do `<html>`; verificar que `grep` não encontra mais `classList.contains("dark")`
- [x] 9.5 Remover `next-themes` com `pnpm remove` e atualizar a seção de temas de `docs/design-system.md`; verificar que `pnpm build` passa
- [x] 9.6 Suavizar o fundo do tema claro (`--background` `#ebe6e4`, `--card` `#f5f2f0`, `--elevated` `#e4dfdd`) e recalcular a tabela de contraste em `docs/design-system.md`; todos os pares continuam acima de 4.5:1
- [ ] 9.7 (pendência) Testar nos dois temas e nos dois idiomas: sem escolha salva (mudar o modo do sistema), com escolha pelo botão (recarregar sem piscar), trocar de idioma no tema escolhido e as formas 3D acompanhando; passar Lighthouse ou axe no hero sobre o brilho, já que o fundo claro mudou

## 10. Organização de pastas

- [x] 10.1 Reorganizar `components/` por assunto (`header`, `theme`, `home`, `shapes`, `experience`, `projects`, `background`, `layout`, `ui`), deixando a raiz vazia, e reescrever os imports; verificar com `pnpm exec tsc --noEmit`, `pnpm build` e `grep` sem nenhum import com o caminho antigo
- [x] 10.2 Atualizar a árvore de pastas do `design.md`, que estava defasada, e os caminhos citados em `docs/design-system.md` e nos comentários do CSS
- [x] 10.3 Reconciliar o resto do change com o site multipágina: `specs/portfolio-page` reescrita (páginas, menu em tela cheia, cápsula de controles, formas 3D, grão, animações), `portfolio-content` (lista e detalhe de projetos, página sobre), `localization` (troca de idioma sem âncora), `proposal.md` e `design.md` (sem âncoras, tokens ameixa, menu, formas 3D, animações, riscos). Os changes `projects-showcase-page` e `portfolio-footer` seguem desatualizados e ficam para reconciliar antes do arquivamento

## 11. Prioridade: diagramação no celular

- [x] 11.1 Redefinir a diagramação da home no celular: nome maior (`17.5vw`), cargo fluido em uma linha, bloco começando abaixo do header (`pt-36`), formas 3D reunidas em um agrupamento abaixo do texto (`cluster` em `shapesScene.ts`), nome com `text-foreground/85` e granulado do tema claro em 0.3
- [x] 11.2 Redefinir o header e o menu: idioma, tema e menu numa única cápsula (`ControlDock`), repetida no menu aberto, e a lista do menu no celular começando na mesma altura do texto da home
