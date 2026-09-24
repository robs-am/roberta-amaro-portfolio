# Roberta Amaro | Portfólio

Portfólio pessoal bilíngue (português e inglês) com tema claro e escuro, feito com Next.js (App Router), TypeScript e Tailwind v4.

## Rodando

Este projeto usa **pnpm**.

```bash
pnpm install
pnpm dev        # http://localhost:3000
pnpm build      # build de produção (também confere tipos)
pnpm lint
```

Para a feature de IA (campo "Mudar o clima" no hero), crie `.env.local` com `ANTHROPIC_API_KEY=...`; sem a chave a rota responde 503. Em produção o cache e os limites de uso usam um Redis (Upstash, pelo Marketplace da Vercel); localmente não precisa de nada. Detalhes e custo em [`docs/ai-wave-mood.md`](docs/ai-wave-mood.md).

Em produção, defina `NEXT_PUBLIC_SITE_URL` (URL canônica, sitemap e pré-visualização ao compartilhar). Sem ela, o site é tratado como não publicado (veja `app/robots.ts`).

## Páginas

Todas existem em `/pt` e `/en`.

| Rota | Conteúdo |
|---|---|
| `/` | home com o hero e as formas 3D |
| `/about` | sobre e stack |
| `/experience` | trajetória: experiências (com os prêmios de empresa dentro do cargo), formação e prêmios independentes |
| `/projects` | todos os projetos |

`/awards` redireciona (301) para `/experience`.

## Estrutura

```
app/
  [locale]/     rotas por idioma; o segmento [locale] recebe "pt" ou "en"
  globals.css   tokens de tema e movimento
components/     organizado por assunto
  header/  theme/  home/  shapes/  experience/
  projects/  background/  layout/  ui/
data/           conteúdo: experiências, formação, prêmios, projetos, perfil
i18n/           idiomas, navegação e hreflang
messages/       textos da interface (pt.json e en.json)
```

## Onde mexer

- **Conteúdo** (experiências, formação, prêmios, projetos): arquivos em `data/`. Todo texto precisa das duas versões, `pt` e `en`; o build falha se faltar uma.
- **Textos da interface**: `messages/pt.json` e `messages/en.json`, sempre com as mesmas chaves.
- **Cores, fontes e movimento**: tokens em `app/globals.css`. Veja `docs/design-system.md` antes de mudar uma cor (há uma tabela de contraste a manter).
- **Tema**: segue a preferência do navegador até a visitante escolher pelo botão. A lógica fica em `components/theme/theme.ts`.

## Documentação

- [`docs/design-system.md`](docs/design-system.md): tokens, tipografia, movimento, tema e padrões de componentes.
- [`docs/ai-wave-mood.md`](docs/ai-wave-mood.md): a feature de IA que muda as ondas do hero a partir de uma frase da visitante (como funciona, custo, configuração e o que ajustar).
- `openspec/changes/portfolio-mvp/`: proposta, design, specs e tarefas do MVP.
