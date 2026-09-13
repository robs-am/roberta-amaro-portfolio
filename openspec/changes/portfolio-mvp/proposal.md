## Why

Ainda não existe um portfólio pessoal público para apresentar experiências profissionais e projetos. O MVP cria essa presença online já bilíngue (PT/EN) e com dark/light mode, sobre uma base preparada para receber uma seção de blog em breve, sem retrabalho no mecanismo de idiomas.

## What Changes

- Novo projeto Next.js (App Router) com TypeScript, a partir de um repositório vazio
- Página única com seções âncora: Hero/Sobre, Experiências e Projetos
- Header com navegação para as seções, seletor de idioma e alternador de tema
- Internacionalização com rotas por idioma (`/pt`, `/en`), detecção automática do idioma do navegador e fallback para português
- Dark/light mode com persistência da escolha e sem flash de tema incorreto no carregamento
- Seção de experiências e cards de projetos alimentados por arquivos de dados tipados, com textos em PT e EN no mesmo item
- Conteúdo de exemplo (placeholder), a ser substituído pelo conteúdo real depois
- Identidade visual com defaults neutros (paleta simples clara/escura, fonte sans), centralizada em tokens para ajuste posterior

Fora do escopo: blog, seção de contato/formulário, CMS, conteúdo real, deploy.

## Capabilities

### New Capabilities
- `localization`: roteamento por idioma (`/pt`, `/en`), detecção do idioma do navegador com fallback PT, troca de idioma preservando a seção atual e textos de interface traduzidos
- `theme`: alternância entre dark e light mode, respeito à preferência do sistema, persistência da escolha e ausência de flash de tema
- `portfolio-page`: estrutura da página única (header, hero, seções âncora) e navegação entre seções
- `portfolio-content`: exibição de experiências e cards de projetos a partir de dados bilíngues, no idioma ativo

### Modified Capabilities
<!-- Nenhuma: não há specs existentes. -->

## Impact

- Repositório: criação de toda a estrutura da aplicação (hoje só contém o scaffolding do OpenSpec)
- Dependências novas: `next`, `react`, `react-dom`, `typescript`, `tailwindcss`, `next-intl`, `next-themes`
- Arquivos principais: `proxy.ts` (ou `middleware.ts`, conforme a versão do Next.js), `app/[locale]/`, `messages/pt.json`, `messages/en.json`, `data/experiences.ts`, `data/projects.ts`
- Estrutura de rotas `app/[locale]/` já comporta futuras rotas como `app/[locale]/blog/`
