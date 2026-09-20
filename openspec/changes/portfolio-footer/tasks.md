## 1. Internacionalização

- [x] 1.1 Adicionar chaves de mensagens `Footer.copyright` e `Footer.backToTop` em `messages/pt.json` e `messages/en.json` com textos correspondentes; verificar que ambos têm as mesmas chaves e que `pnpm exec tsc --noEmit` passa

## 2. Componente Footer

- [x] 2.1 Criar `components/Footer.tsx` como servidor ou cliente, com estrutura semântica `<footer>`, copyright text usando `useTranslations()`, e um link "voltar ao topo" com `href="#"` e `aria-label` traduzido; verificar que o arquivo compila sem erros

- [x] 2.2 Estilizar Footer com Tailwind (padding, margin, layout) e `color: var(--muted)` para texto; fonte IBM Plex Sans, tamanho 0.875rem ou menor; verificar visualmente no navegador que o footer é minimalista e texto está em cor neutra

- [ ] 2.3 Verificar que footer não tem rolagem horizontal em 360px e é legível em 1024px; usar DevTools Modo Responsivo

## 3. Integração no Layout

- [x] 3.1 Adicionar import de `Footer` e renderizá-lo no final de `app/[locale]/layout.tsx` (após `{children}` e `RevealObserver`); verificar que `pnpm dev` compila sem erros e página carrega

- [ ] 3.2 Verificar que footer aparece em `/pt` e `/en`, com texto em português e inglês respectivamente; abrir navegador e confirmar

## 4. Verificação de Funcionalidade

- [ ] 4.1 Clicar no link "voltar ao topo" em `/pt` e `/en` e verificar que página faz scroll suave até o topo com 650ms de animação; verificar que a rolagem não trava nem pula

- [ ] 4.2 Emular `prefers-reduced-motion: reduce` no DevTools e clicar no link; verificar que scroll é instantâneo (sem animação)

- [ ] 4.3 Verificar contraste AA entre texto footer e fundo em ambos temas (claro e escuro) com Lighthouse ou axe DevTools; ajustar opacidade de `--muted` se necessário

- [ ] 4.4 Navegar com Tab até o link "voltar ao topo" e verificar que é focável e acionável com Enter/Space; rolar página e verificar que focus outline é visível

## 5. Verificação Final

- [ ] 5.1 Rodar `pnpm build` e verificar que passa sem erros e que `/pt` e `/en` aparecem como rotas estáticas

- [ ] 5.2 Verificar que o HTML de `/en` renderizado no servidor já contém o texto do footer em inglês (sem depender de JavaScript), usando `curl http://localhost:3000/en | grep -i "back to top"` ou inspeção no navegador
