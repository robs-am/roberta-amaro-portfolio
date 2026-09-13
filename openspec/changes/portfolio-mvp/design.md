## Context

O repositório está vazio (só o scaffolding do OpenSpec), então não há código legado nem restrição de compatibilidade. Motivação e escopo estão em `proposal.md`; o comportamento esperado está nas specs de `localization`, `theme`, `portfolio-page` e `portfolio-content`.

A restrição que mais molda a arquitetura é o blog planejado para os próximos meses: ele precisa de URLs indexáveis por idioma. Por isso o i18n já nasce baseado em rotas, mesmo o MVP sendo uma página só.

## Goals / Non-Goals

**Goals:**
- Página totalmente renderizada no servidor e gerada estaticamente para cada idioma
- JavaScript no cliente restrito aos dois controles interativos (idioma e tema)
- Estrutura `app/[locale]/` que aceite `blog/` depois sem mexer no que já existe
- Identidade visual centralizada em tokens, para trocar paleta e fonte sem tocar nos componentes

**Non-Goals:**
- Identidade visual final (ficam defaults neutros)
- Suporte a mais de dois idiomas (a estrutura permite, mas não será testada)
- Testes automatizados end-to-end (verificação manual pelas specs no MVP)
- Analytics, SEO avançado (sitemap, Open Graph images), deploy

## Decisions

### Estrutura de pastas

```
app/
  [locale]/
    layout.tsx        <html lang>, providers, header, metadados por idioma
    page.tsx          Hero + #experience + #projects
    not-found.tsx
  globals.css         Tailwind + tokens de tema
components/
  Header.tsx          nav + LocaleSwitcher + ThemeToggle
  LocaleSwitcher.tsx  (client)
  ThemeToggle.tsx     (client)
  Hero.tsx
  ExperienceSection.tsx
  ProjectCard.tsx / ProjectsSection.tsx
data/
  experiences.ts
  projects.ts
  profile.ts          nome, título, bio (hero)
i18n/
  routing.ts          locales, defaultLocale
  request.ts          carrega messages por locale
  navigation.ts       Link/useRouter cientes do locale
messages/
  pt.json
  en.json
proxy.ts              (ou middleware.ts, conforme a versão do Next.js)
```

### Next.js App Router + TypeScript estrito
App Router é o padrão atual e o que o next-intl suporta com mais recursos (Server Components traduzidos). Pages Router foi descartado por estar em modo de manutenção. `strict: true` no TypeScript é pré-requisito da decisão de "tradução obrigatória" abaixo.

### i18n com next-intl e prefixo sempre presente
- `locales: ['pt', 'en']`, `defaultLocale: 'pt'`, `localePrefix: 'always'`: toda URL tem prefixo, então `/` sempre redireciona e nunca existe conteúdo duplicado sem prefixo.
- Detecção pelo `Accept-Language` e cookie de preferência (`NEXT_LOCALE`) ficam a cargo do proxy do next-intl, que já implementa a ordem cookie > navegador > default exigida pela spec.
- `generateStaticParams` no layout e leitura do idioma com `next/root-params` em `i18n/request.ts`, para que `/pt` e `/en` sejam gerados estaticamente. Isso substitui `setRequestLocale`/`requestLocale`, marcados como deprecated no next-intl 4.
- Caminhos sem prefixo válido (ex: `/fr`) são redirecionados pelo proxy para `/<idioma>/fr`, que responde 404 via `app/[locale]/[...rest]/page.tsx`. Forçar 404 direto no proxy exigiria adivinhar quais segmentos "parecem idioma" e quebraria rotas futuras sem prefixo, como `/blog`.
- `lang` do `<html>`: o código de rota é `pt`, mas o atributo usa `pt-BR`. Um mapa simples `{ pt: 'pt-BR', en: 'en' }` resolve isso.
- `hreflang` via `alternates.languages` em `generateMetadata`.
- Strings de interface ficam em `messages/*.json`; conteúdo de portfólio fica em `data/*.ts` (ver abaixo). Assim o JSON contém só textos curtos de UI e o conteúdo longo fica tipado.

Alternativas: Context + localStorage (descartado por não gerar URLs indexáveis para o blog); `next-i18next` (feito para Pages Router); implementação manual com dicionários (reinventa detecção, cookie e navegação).

**Preservar a âncora ao trocar idioma:** o fragmento não chega ao servidor. O `LocaleSwitcher` lê `window.location.hash` e o anexa ao destino de `router.replace(pathname, { locale })`.

### Tema com next-themes + Tailwind por classe
- `ThemeProvider` com `attribute="class"`, `defaultTheme="system"`, `enableSystem`. O next-themes injeta um script inline antes da pintura que aplica a classe, o que atende a spec de "sem flash", e persiste em `localStorage`, que é compartilhado entre `/pt` e `/en`.
- `<html suppressHydrationWarning>`, porque a classe é aplicada antes da hidratação.
- No `ThemeToggle`, o ícone só é renderizado após montar no cliente, para evitar mismatch de hidratação (o servidor não sabe o tema).
- Tailwind v4: variante `dark` redefinida para a classe com `@custom-variant dark (&:where(.dark, .dark *));`.

Alternativa: CSS puro com `prefers-color-scheme` (sem escolha manual) ou implementação própria do script anti-flash (mesmo resultado com mais código).

### Tokens de identidade visual
Cores definidas como variáveis CSS em `globals.css` (`--background`, `--foreground`, `--muted`, `--card`, `--border`, `--accent`), com valores em `:root` e sobrescritos em `.dark`, expostos ao Tailwind via `@theme`. Componentes usam só `bg-background`, `text-foreground` etc., nunca cores cruas. Trocar a identidade visual depois significa editar um arquivo.

Defaults do MVP:
- Base neutra (escala zinc do Tailwind) com um único acento (indigo), ambos verificados contra contraste AA nos dois temas
- Fonte Geist via `next/font` (já é o default do `create-next-app`, sem custo extra e sem layout shift)
- Cards com borda sutil, cantos arredondados, sem sombra pesada; grid de 1 coluna no celular, 2 no tablet, 3 no desktop
- Largura máxima de conteúdo em torno de `max-w-5xl`

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
  title: Localized;
  description: Localized;
  tech: string[];
  repoUrl?: string;
  demoUrl?: string;
  image?: { src: string; alt: Localized };
};
```
- `Record<Locale, string>` faz o compilador exigir as duas chaves, o que cumpre a spec de "tradução obrigatória" no `next build` (que roda type-check). Arrays exportados com `satisfies Experience[]` para o erro apontar o item.
- Datas como `'YYYY-MM'`: ordenação por comparação de string e formatação com `useFormatter().dateTime(..., { month: 'short', year: 'numeric' })` do next-intl.
- Ordenação feita na renderização, não no arquivo, para que a ordem de cadastro não importe.
- Um helper `t(localized, locale)` evita repetir `field[locale]` nos componentes.

Alternativa: arquivos separados por idioma (descartado por duplicar datas, links e tags); MDX por item (desnecessário para textos curtos, fica reservado ao blog).

### Server vs Client Components
Tudo é Server Component, exceto `LocaleSwitcher` e `ThemeToggle`. A navegação por âncora usa `<a href="#projects">` nativo, com `scroll-behavior: smooth` em CSS dentro de `@media (prefers-reduced-motion: no-preference)` e `scroll-margin-top` nas seções para não ficar sob o header fixo. Nenhum JavaScript é necessário para isso.

### Links externos e imagens
Links com `target="_blank" rel="noopener noreferrer"`. Imagens de projeto com `next/image`, em `public/projects/`. Projetos sem imagem simplesmente não renderizam o bloco.

## Risks / Trade-offs

- [Nome do arquivo de proxy mudou no Next.js 16 (`middleware.ts` -> `proxy.ts`) e a documentação do next-intl pode estar em transição] -> Usar a convenção da versão instalada e seguir o guia de App Router do next-intl correspondente; fixar versões no `package.json`.
- [Mismatch de hidratação no alternador de tema] -> Renderizar o ícone só após montar; placeholder com o mesmo tamanho para não causar layout shift.
- [Redirect da raiz depende do proxy e não funciona em export estático puro (`output: 'export'`)] -> Não usar export estático; hospedar em plataforma com suporte a proxy/middleware (ex: Vercel). Registrado para quando o deploy for decidido.
- [Conteúdo placeholder publicado por engano] -> Deploy está fora do escopo; placeholders claramente fictícios ("Empresa Exemplo").
- [Acento indigo pode não atingir contraste AA em texto pequeno no tema escuro] -> Usar tons diferentes do acento por tema (ex: 600 no claro, 400 no escuro) e verificar na task de contraste.
- [Mais setup inicial que o toggle simples] -> Aceito conscientemente em troca de não migrar o i18n quando o blog chegar.

## Migration Plan

Projeto novo, sem migração. Rollback não se aplica antes do primeiro deploy.

## Open Questions

- Identidade visual final (paleta, acento, fonte): ajustável depois apenas nos tokens.
- Plataforma de hospedagem: não afeta o MVP, desde que suporte proxy/middleware.
- Seção de contato ou footer com redes sociais: pode entrar como change separado.
