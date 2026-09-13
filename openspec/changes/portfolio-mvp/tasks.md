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

- [ ] 3.1 Definir em `app/globals.css` os tokens da tabela do design (`--background`, `--card`, `--elevated`, `--foreground`, `--muted`, `--accent`, `--accent-foreground`, `--border`, `--glow-*`) em `:root` e `.dark`, expostos via `@theme`, com `@custom-variant dark` por classe; verificar que adicionar a classe `dark` ao `<html>` troca as cores e que o script de contraste aponta todos os pares de texto com 4.5:1 ou mais
- [ ] 3.2 Trocar a Geist por Jost (`--font-display`, títulos) e IBM Plex Sans (`--font-sans`, texto) via `next/font/google`, variáveis e com subset `latin`; verificar no navegador que títulos usam Jost e o texto usa IBM Plex Sans
- [ ] 3.3 Adicionar o `ThemeProvider` (`attribute="class"`, `defaultTheme="system"`, `enableSystem`) e `suppressHydrationWarning` no `<html>`; verificar que a página segue o modo claro/escuro do sistema sem warnings de hidratação no console
- [ ] 3.4 Criar `components/ThemeToggle.tsx` (client) com botão renderizado só após hidratar, rótulo acessível traduzido e operável por teclado; verificar que alterna o tema sem recarregar e que a escolha persiste após reload e ao trocar `/pt` -> `/en`
- [ ] 3.5 Verificar ausência de flash: com tema escuro salvo, recarregar com throttling de rede lento no DevTools e confirmar que o tema claro nunca aparece
- [ ] 3.6 Criar `components/BackgroundGlow.tsx` (client) conforme o design (manchas em `--glow-*`, `pointermove` + `requestAnimationFrame` com interpolação e parada ao acomodar, ativo só com `pointer: fine` e sem movimento reduzido, `aria-hidden` e `pointer-events-none`) e renderizá-lo no layout; verificar que o brilho acompanha o mouse suavemente, fica parado com movimento reduzido e com emulação de toque no DevTools, não deixa `requestAnimationFrame` rodando no painel Performance com o ponteiro parado e não bloqueia cliques em links sobre ele
- [ ] 3.7 Ajustar opacidade e blur do brilho nos dois temas; verificar que o texto do hero mantém contraste AA sobre a área mais clara do brilho

## 4. Estrutura da página

- [ ] 4.1 Criar `components/LocaleSwitcher.tsx` (client) que usa `router.replace` do next-intl preservando `window.location.hash`, indica o idioma ativo e é operável por teclado; verificar que `/pt#projects` vira `/en#projects`
- [ ] 4.2 Criar `components/Header.tsx` fixo no topo, translúcido com `backdrop-blur` sobre o brilho, com links `#experience` e `#projects`, `LocaleSwitcher` e `ThemeToggle`; verificar que continua visível e legível após rolar
- [ ] 4.3 Adicionar rolagem suave condicionada a `prefers-reduced-motion: no-preference` e `scroll-margin-top` nas seções; verificar que o título da seção não fica sob o header e que, com movimento reduzido emulado no DevTools, a rolagem é instantânea
- [ ] 4.4 Criar `app/[locale]/page.tsx` com as seções na ordem Hero, `#experience`, `#projects`; verificar que `/en#experience` abre na seção de experiências
- [ ] 4.5 Criar `app/[locale]/not-found.tsx` simples e a rota `app/[locale]/[...rest]/page.tsx`; verificar que `/pt/fr` exibe essa página com status 404

## 5. Conteúdo

- [ ] 5.1 Criar os tipos `Locale`, `Localized`, `Experience` e `Project` (com `category: Localized`) e o helper `localize`; verificar que remover a chave `en` de um campo `Localized` faz `pnpm exec tsc --noEmit` falhar apontando o item
- [ ] 5.2 Criar `data/profile.ts` e `components/Hero.tsx` com nome em Jost, título e bio placeholder bilíngues; verificar que o texto muda entre `/pt` e `/en`
- [ ] 5.3 Criar `data/experiences.ts` com pelo menos 3 experiências fictícias (uma sem data de término) usando `satisfies Experience[]`, cadastradas fora de ordem; verificar com `pnpm exec tsc --noEmit`
- [ ] 5.4 Criar `components/ExperienceSection.tsx` como timeline vertical (linha, ponto em `--accent`, período, cargo em Jost, empresa, descrição), com ordenação por data decrescente, datas formatadas por idioma e "Atual"/"Present"; verificar em `/pt` e `/en` a ordem, o formato das datas e o término da experiência atual, e que a timeline não gera rolagem horizontal em 360px
- [ ] 5.5 Criar `data/projects.ts` com pelo menos 3 projetos fictícios com `category`, cobrindo: com repo e demo, só com repo, com imagem e sem imagem (imagem em `public/projects/`); verificar com `pnpm exec tsc --noEmit`
- [ ] 5.6 Criar `components/ProjectCard.tsx` vertical (painel `aspect-video` com imagem ou fundo decorativo `aria-hidden`, pill com `category`, título em Jost, descrição, tecnologias, primeiro link disponível como botão em `--accent` e o outro como link de texto, `target="_blank" rel="noopener noreferrer"`) e `components/ProjectsSection.tsx` (grade 1/2/3 colunas); verificar que o card sem imagem tem painel decorativo da mesma altura e sem conteúdo para leitor de tela, e que o card sem demo mostra só o repositório como botão

## 6. Verificação final

- [ ] 6.1 Rodar `pnpm build` e verificar que passa sem erros de tipo ou lint e que `/pt` e `/en` aparecem como rotas estáticas na saída
- [ ] 6.2 Verificar responsividade no DevTools em 360px (sem rolagem horizontal, controles do header acessíveis) e em 1440px (conteúdo centralizado com largura máxima)
- [ ] 6.3 Verificar contraste AA nos temas claro e escuro com Lighthouse ou axe DevTools, incluindo o hero sobre o brilho, e ajustar tokens até não haver falhas de contraste
- [ ] 6.4 Verificar navegação completa só por teclado (Tab até nav, seletor de idioma e alternador de tema, acionando cada um) em `/pt` e `/en`
- [ ] 6.5 Verificar com `curl` que o HTML de `/en` já contém os textos em inglês (sem depender de JavaScript) e que o cookie de idioma faz `/` redirecionar para o idioma escolhido manualmente
