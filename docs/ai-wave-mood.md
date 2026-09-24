# Clima das ondas (feature de IA)

Referência viva da feature em que a visitante escreve uma frase livre ("domingo chuvoso", "ondas azuis", "campo de lavanda ao entardecer") e as ondas do hero mudam de forma, ritmo e cor para combinar. Este documento explica o que existe, por que foi feito assim e onde mexer.

## Ideia e decisões de produto

- **Não é um chatbot.** Um chatbot que responde perguntas sobre a Roberta foi considerado primeiro e descartado: é o movimento mais repetido em portfólios com IA. A interação com as ondas reforça o diferencial real dela (ex-designer 3D) e é algo que só este site tem.
- **O modelo nunca mexe em valores do shader.** Ele só escolhe pontos em poucos "dials" semânticos. Uma função determinística (`moodToLayers`) converte esses dials em formas **dentro da faixa que a Roberta já ajustou à mão**. Assim nenhuma resposta, por mais estranha que seja a frase, gera um resultado feio ou fora da marca.
- **O ponto de repouso é o design original.** Com os dials no meio, a cena é exatamente a que já existia. O clima só se afasta dela, e "Voltar ao original" leva de volta.
- **A cor é parcial.** Um pedido de cor gira o matiz das camadas, mas com teto de força e saturação mínima, para o site não ficar berrante contra o texto nem perder a identidade rosa.
- **Uma cor ou várias.** Frases de uma cor só ("azul", "o mar") pintam todas as camadas do mesmo matiz. Frases festivas ou de muitas luzes ("festa psicodélica", "tokyo") espalham matizes diferentes pelas camadas (dial `spread`).
- **Custo protegido em camadas.** A rota é pública e gasta da conta da Roberta, então há várias barreiras (veja "Custo e proteção").

## Como funciona

```
visitante escreve  →  WaveMoodInput  →  POST /api/wave-mood  →  Claude Haiku 4.5
                                                                     │  (JSON estruturado)
ondas mudam  ←  stepWaves/paint  ←  setWaveMood (transição suave)  ←─┘
```

1. `components/home/WaveMoodInput.tsx` envia a frase para a rota.
2. `app/api/wave-mood/route.ts` valida, confere a origem, consulta o cache e os limites (só depois disso chama o Claude), pede saída estruturada (JSON Schema), limpa o resultado com `cleanMood` e o guarda no cache.
3. `setWaveMood` (em `components/shapes/shapesScene.ts`) define o clima-alvo. O clima atual caminha até ele a cada quadro, em cerca de 3 segundos.
4. A cena converte o clima em formas (`moodToLayers`) e cores (`setTone` → `paint`) a cada quadro.

### Os dials

Todos ficam em `WaveMood` (`components/shapes/waveMood.ts`). O modelo devolve também uma `label` curta ("silêncio profundo noturno"), no idioma da frase, mostrada à visitante.

| Dial | Faixa | Efeito |
|---|---|---|
| `calm` | 0 agitado, 1 parado | mexe na ondulação fina (segunda senoide) e na inclinação das cristas |
| `energy` | 0 baixo, 1 alto | altura das ondas |
| `speed` | 0 lento, 1 rápido | ritmo do relógio das ondas |
| `warmth` | -1 frio, 1 quente | empurra o rosa para violeta (frio) ou coral (quente) |
| `hue` | 0 a 360° | cor pedida, na roda de cores (0 vermelho, 120 verde, 215 azul, 330 rosa) |
| `tint` | 0 a 1 | quanto da cor pedida entra; 0 mantém o rosa |
| `spread` | 0 a 1 | quanto os matizes das camadas se afastam: 0 todas da mesma cor, 1 um leque de cores (uma por camada) |

`calm`, `energy` e `speed` repousam em 0,5 (= cena original). `tint` e `spread` repousam em 0.

`warmth` é a **sensação** da frase e `hue`/`tint` são uma **cor**, nomeada ou evocada: uma cena (mar, floresta), um lugar ou cidade (Tóquio é neon magenta, Rio é verde e dourado), uma estação ou hora do dia. O prompt da rota explica essa diferença ao modelo, e só uma frase sem cor nenhuma (um sentimento abstrato) fica com `tint` 0. Os dois se somam: "campo de lavanda ao entardecer" costuma sair com `hue` 270 e um `warmth` positivo.

`spread` só aparece através do `tint`: com `tint` 0 ele não faz nada, e ele some e aparece junto com a cor. Por isso o prompt exige `tint` de pelo menos 0,5 (e um `hue`) sempre que `spread` for maior que 0. Com `spread` alto a saturação mínima também sobe (0,4 para até 0,7), porque cores fortes pedem isso. No `paint` (`waveScene.ts`), cada camada gira o matiz numa fração de um leque de `SPREAD_DEGREES` (270°) centrado no `hue`: a de trás fica atrás e a da frente adiante.

## Onde fica cada peça

| Arquivo | Papel |
|---|---|
| `app/api/wave-mood/route.ts` | rota; prompt de sistema, schema, modelo, checagem de origem, cache, limites e tratamento de erro |
| `app/api/wave-mood/store.ts` | memória compartilhada da rota (cache e contadores): Redis do Upstash, ou um `Map` local sem as variáveis |
| `components/shapes/waveMood.ts` | tipos, `cleanMood`, `moodToLayers`, `moodRate`, `easeMood`, `moodToParam`/`moodFromParam` (funções puras) |
| `components/shapes/shapesScene.ts` | estado compartilhado (clima, relógio); `setWaveMood`, `resetWaveMood`, `stepWaves`, `subscribeWaveMood` |
| `components/shapes/waveScene.ts` | recebe as camadas do quadro (`draw`) e o tom de cor (`setTone`/`paint`) |
| `components/shapes/waveMoodClient.ts` | `fetchWaveMood`, `WaveMoodError` (guarda o status HTTP e o código do erro) e o clima da sessão (`readSavedMood`, `saveMood`, `clearSavedMood`) |
| `components/shapes/mockWaveMood.ts` | mock por palavra-chave e o atalho de console (`waveMood(...)`), só em dev |
| `components/home/WaveMoodInput.tsx` | a interface: pílula que abre num campo de texto, com sugestões, "Copiar link" e "Voltar ao original" |
| `components/home/HeroShapes.tsx`, `components/header/menu/MenuShapes.tsx` | chamam `stepWaves` a cada quadro |
| `messages/pt.json`, `messages/en.json` | textos, chaves `Hero.mood*` |

## Decisões técnicas que não são óbvias

- **Relógio acumulado, não tempo absoluto.** A fase de uma onda é `velocidade × tempo`. Mudar a velocidade contra o tempo absoluto faz todas as ondas darem um salto. Por isso `stepWaves` soma passos pequenos (`dt × ritmo`), o que muda o ritmo sem salto. A velocidade não faz parte do `LayerSpec` por esse motivo: ela vive em `moodRate`.
- **Estado compartilhado entre hero e menu.** O clima e o relógio ficam em `shapesScene.ts`, como o ponteiro e o horizonte, então o menu continua exatamente de onde o hero parou, cor incluída. Os dois podem rodar um loop ao mesmo tempo; `stepWaves` só avança uma vez por tempo de quadro.
- **Cor: girar o matiz em vez de misturar.** Misturar rosa com azul no RGB dá um cinza-violeta lamacento. O `paint` gira o matiz (HSL) de cada cor que a cena pinta (camadas, lado escuro, borda iluminada, sombras) **preservando o brilho de cada uma**, então a profundidade de papel recortado continua como desenhada.
- **O matiz é circular.** `easeMood` gira pelo caminho mais curto (350° → 10° são 20°, não 340°). Quando a cor ainda não aparece (`tint` perto de 0), o matiz salta direto para o novo, para uma cor nova entrar como ela mesma em vez de varrer as intermediárias.
- **`cleanMood` protege contra respostas ruins.** Cada dial é limitado à sua faixa, o matiz é normalizado (370 vira 10) e um campo ausente ou não numérico mantém o valor anterior. O schema estruturado do modelo não aceita `minimum`/`maximum`, então o limite é feito aqui.
- **Movimento reduzido.** Sem animação a cena é um quadro parado. Nesse caso `setWaveMood` vai direto ao valor final e avisa a cena (`subscribeWaveMood`) para redesenhar o quadro.
- **`WaveMoodInput` não é um `data-hero-item`.** O hero mede esses elementos para saber onde o texto termina e afastar as ondas dele. Incluí-lo faria as ondas fugirem do canto onde ele está.

## Sugestões, link e memória

- **Sugestões:** três frases prontas (`moodSuggestion1` a `3` em `messages/`) aparecem como chips discretos abaixo do campo. Por causa do cache, depois da primeira vez elas não custam nada.
- **Link compartilhável:** o clima vai na URL como `?mood=calm,energy,warmth,speed,hue,tint,spread` (sete números, por exemplo `?mood=0.2,0.85,0.6,0.8,300,0.9,0.5`). Quem abre o link vê as ondas animarem para o clima, depois da entrada do hero. A `label` fica **de fora de propósito**: é texto, e texto vindo de um link poderia pôr palavras de qualquer um na página. `moodFromParam` só aceita exatamente sete números e passa tudo por `cleanMood`, então `?mood=abc` é ignorado. "Copiar link" copia essa URL.
- **Memória da sessão:** o último clima fica em `sessionStorage` (chave `wave-mood`), então recarregar a página o mantém, e uma visita nova começa do design original. O acesso a storage é sempre protegido por `try/catch` (janela privada, storage bloqueado). Um `?mood=` válido na URL tem prioridade sobre o que estiver salvo. Links de versões antigas (seis números) deixam de valer e são ignorados.

## Custo e proteção

Cada uso gasta da conta de API da Roberta (não da assinatura do Claude, que é separada). Uma chamada custa cerca de US$ 0,001 (Haiku 4.5: uns 600 tokens de entrada e 100 de saída).

A rota é pública, então tem camadas, nesta ordem (`POST` em `route.ts`):

1. **Frase válida:** não vazia e com até 140 caracteres (a interface e a rota usam o mesmo limite). Saída de no máximo 250 tokens.
2. **Mesma origem:** a requisição precisa trazer `Origin` cujo host seja igual ao `Host`; senão responde 403. Barra outros sites usando a chave pelos navegadores de seus visitantes. Um script fora do navegador consegue falsificar o cabeçalho, então isso só sobe a barra.
3. **Cache:** a frase é normalizada (minúsculas, espaços colapsados, pontuação final removida), vira um hash sha256 e a resposta fica guardada por 7 dias. Um acerto de cache **não custa nada e não conta nos limites**. A chave inclui `CACHE_VERSION`: suba o número sempre que o prompt ou as dials mudarem, senão respostas antigas continuam sendo servidas.
4. **Limites, só para frases novas** (429): pausa de 4 s por IP (`too-soon`), 30 chamadas por dia por IP e 150 por dia no site inteiro (`daily-limit`). O teto do site é o disjuntor: no pior caso são cerca de US$ 4,50 por mês, dentro do limite de gasto, e um dia de abuso não consome o mês. A interface mostra "Um instante, tente de novo em seguida" para `too-soon` e "O limite de hoje foi atingido, volte amanhã" para `daily-limit`.
5. **Falha fechada:** se o Redis cair, a rota responde 503 e **não** chama o Claude. Uma falha ao **salvar** no cache não vira erro: só custa uma chamada a mais para a mesma frase.

Outros pontos:

- **Modelo barato:** Claude Haiku 4.5 (`claude-haiku-4-5`), constante `MODEL` em `route.ts`. A tarefa é mapear poucas palavras para números limitados; se as leituras ficarem literais demais, é o lugar de trocar por um modelo maior.
- **Pausa também na interface:** o botão fica desabilitado por 4 s depois de cada envio.
- **A última defesa é o limite de gasto mensal** da conta da Anthropic (Console → Limits → Spend limits). Está em US$ 5. O limite vale para a organização inteira e, ao ser atingido, só as chamadas de API param.
- **Por que Redis:** na Vercel cada requisição pode cair numa instância diferente e as instâncias não compartilham memória, então contadores e cache precisam de um lugar compartilhado. Sem as variáveis do Redis (o `pnpm dev`), `store.ts` usa um `Map` local com a mesma interface, então nada extra é preciso para desenvolver. Em produção, sem Redis, cada instância teria os próprios contadores e os limites perderiam o efeito.
- **Prompt injection:** o prompt de sistema trata a frase só como descrição de clima, cena ou cor e proíbe seguir instruções escritas nela. O pior caso é uma resposta esquisita, que ainda passa por `cleanMood` e por `moodToLayers`.

## Configuração

1. Crie `.env.local` na raiz (o `.gitignore` já ignora `.env*`) com:

   ```
   ANTHROPIC_API_KEY=sk-ant-...
   ```

2. Reinicie o `pnpm dev`: o Next só lê o arquivo ao subir.
3. Em produção (Vercel), cadastre a mesma variável em Settings → Environment Variables. Sem ela a rota responde 503 e a interface mostra "Não consegui interpretar agora".
4. Ainda na Vercel, adicione um Redis pelo Marketplace (Upstash). A integração cria sozinha `KV_REST_API_URL` e `KV_REST_API_TOKEN`, que o `Redis.fromEnv()` de `store.ts` lê (ele também aceita `UPSTASH_REDIS_REST_URL` e `_TOKEN`), então nada precisa ser renomeado. O `@upstash/redis` já está nas dependências.
5. Defina `NEXT_PUBLIC_SITE_URL` com o endereço final do site; sem ela o site é tratado como não publicado (veja `app/robots.ts`).
6. Confira se o limite de gasto na conta da Anthropic está baixo e se há aviso por e-mail.

O proxy do `next-intl` (`proxy.ts`) já exclui `/api`, então a rota não passa pelo roteamento de idioma.

## Como testar

Com o site rodando, no console do navegador (só existe em `pnpm dev`):

```js
await waveMood("domingo chuvoso")
await waveMood("ondas azuis")
await waveMood("qualquer coisa sem clima")   // volta ao rosa original
```

Ele chama a rota real e, se ela não responder (sem chave, pausa), avisa no console e usa o mock, que só reconhece poucas palavras (`tempestade`, `azul`, `verde`, `quente`, `frio`...). Confira nos **dois temas** e no celular. Erros da rota aparecem no terminal do `pnpm dev`.

Para ver as dials que o modelo devolveu para uma frase, chame a rota com `Origin` (sem ele a rota responde 403). Se a frase já estiver no cache, isso não gasta chamada; se for nova, gasta uma do dia:

```
curl -s -X POST http://localhost:3000/api/wave-mood -H "Content-Type: application/json" -H "Origin: http://localhost:3000" -d '{"prompt":"tokyo"}'
```

Para ver o limite diário sem esperar, baixe `VISITOR_DAILY_CAP` temporariamente (por exemplo para 2) e volte para 30 depois. Bons casos de teste de leitura: "tokyo", "new york", "rio de janeiro", "festa psicodélica", "azul" (uma cor só, `spread` 0), "domingo chuvoso".

## O que ajustar

Todos são constantes com comentário no próprio arquivo:

| O quê | Onde | Constante |
|---|---|---|
| quanto cada dial mexe na forma | `waveMood.ts` | `ENERGY_AMPLITUDE`, `CALM_RIPPLE`, `CALM_SKEW`, `SPEED_RATE` |
| velocidade da transição | `waveMood.ts` | `EASE_SECONDS` (0,9 s; cerca de 3× isso para assentar) |
| força do frio/quente | `waveScene.ts` | `MAX_TINT` |
| força da cor pedida e saturação mínima | `waveScene.ts` | `HUE_STRENGTH`, `HUE_SATURATION` |
| abertura do leque de cores e saturação dele | `waveScene.ts` | `SPREAD_DEGREES` (270), `SPREAD_SATURATION` (0,7) |
| modelo, tamanho da saída | `route.ts` | `MODEL`, `max_tokens` |
| pausa, tetos diários, duração do cache | `route.ts` | `COOLDOWN_SECONDS`, `VISITOR_DAILY_CAP`, `SITE_DAILY_CAP`, `CACHE_SECONDS` |
| descartar respostas em cache | `route.ts` | `CACHE_VERSION` (suba ao mudar o prompt ou as dials) |
| como o modelo lê frases | `route.ts` | `SYSTEM` |

## Limitações conhecidas e ideias

- A checagem de origem não barra um script fora do navegador que falsifique `Origin`; quem segura isso são os limites e o teto de gasto.
- As leituras de lugares e cidades vêm da imagem que o modelo faz deles e podem ser estereotipadas (Tóquio sempre neon). Se uma resposta parecer clichê demais, o ajuste é no `SYSTEM`.
- Ideias: deixar o menu mostrar a `label` atual, encurtar `EASE_SECONDS` (0,9 para uns 0,6), testes automatizados das funções puras de `waveMood.ts`, conferir o contraste do texto em todos os matizes, e uma "respiração" das ondas enquanto o modelo pensa.
