# Clima das ondas (feature de IA)

Referência viva da feature em que a visitante escreve uma frase livre ("domingo chuvoso", "ondas azuis", "campo de lavanda ao entardecer") e as ondas do hero mudam de forma, ritmo e cor para combinar. Este documento explica o que existe, por que foi feito assim e onde mexer.

## Ideia e decisões de produto

- **Não é um chatbot.** Um chatbot que responde perguntas sobre a Roberta foi considerado primeiro e descartado: é o movimento mais repetido em portfólios com IA. A interação com as ondas reforça o diferencial real dela (ex-designer 3D) e é algo que só este site tem.
- **O modelo nunca mexe em valores do shader.** Ele só escolhe pontos em poucos "dials" semânticos. Uma função determinística (`moodToLayers`) converte esses dials em formas **dentro da faixa que a Roberta já ajustou à mão**. Assim nenhuma resposta, por mais estranha que seja a frase, gera um resultado feio ou fora da marca.
- **O ponto de repouso é o design original.** Com os dials no meio, a cena é exatamente a que já existia. O clima só se afasta dela, e "Voltar ao original" leva de volta.
- **A cor é parcial.** Um pedido de cor gira o matiz das camadas, mas com teto de força e saturação mínima, para o site não ficar berrante contra o texto nem perder a identidade rosa.

## Como funciona

```
visitante escreve  →  WaveMoodInput  →  POST /api/wave-mood  →  Claude Haiku 4.5
                                                                     │  (JSON estruturado)
ondas mudam  ←  stepWaves/paint  ←  setWaveMood (transição suave)  ←─┘
```

1. `components/home/WaveMoodInput.tsx` envia a frase para a rota.
2. `app/api/wave-mood/route.ts` valida, chama o Claude com saída estruturada (JSON Schema) e limpa o resultado com `cleanMood`.
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

`calm`, `energy` e `speed` repousam em 0,5 (= cena original). `tint` repousa em 0.

`warmth` é a **sensação** da frase e `hue`/`tint` são uma **cor nomeada** (ou uma cena de cor inconfundível, como mar ou floresta). O prompt da rota explica essa diferença ao modelo. Os dois se somam: "campo de lavanda ao entardecer" costuma sair com `hue` 270 e um `warmth` positivo.

## Onde fica cada peça

| Arquivo | Papel |
|---|---|
| `app/api/wave-mood/route.ts` | rota; prompt de sistema, schema, modelo, limites e tratamento de erro |
| `components/shapes/waveMood.ts` | tipos, `cleanMood`, `moodToLayers`, `moodRate`, `easeMood` (funções puras) |
| `components/shapes/shapesScene.ts` | estado compartilhado (clima, relógio); `setWaveMood`, `resetWaveMood`, `stepWaves`, `subscribeWaveMood` |
| `components/shapes/waveScene.ts` | recebe as camadas do quadro (`draw`) e o tom de cor (`setTone`/`paint`) |
| `components/shapes/waveMoodClient.ts` | `fetchWaveMood` e `WaveMoodError` (guarda o status HTTP) |
| `components/shapes/mockWaveMood.ts` | mock por palavra-chave e o atalho de console (`waveMood(...)`), só em dev |
| `components/home/WaveMoodInput.tsx` | a interface: pílula que abre num campo de texto |
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

## Custo e proteção

Cada uso gasta da conta de API da Roberta (não da assinatura do Claude, que é separada).

- **Modelo barato:** Claude Haiku 4.5 (`claude-haiku-4-5`), constante `MODEL` em `route.ts`. A tarefa é mapear poucas palavras para números limitados; se as leituras ficarem literais demais, é o lugar de trocar por um modelo maior.
- **Saída minúscula:** `max_tokens` 250; frase de até 140 caracteres (a interface e a rota usam o mesmo limite).
- **Pausa de 4 s:** na interface (botão desabilitado) e na rota (por IP). A da rota é **fraca**: em produção serverless as instâncias não compartilham memória. Ela barra um botão travado, não um abusador.
- **A proteção real é o limite de gasto mensal** definido na conta da Anthropic (Console → Limits → Spend limits). O padrão da organização é US$ 200.000, que não protege nada; defina um valor pequeno (US$ 5 a 10) e um aviso por e-mail. O limite é mensal e vale para a organização inteira. Ao ser atingido, só as chamadas de API param.
- **Prompt injection:** o prompt de sistema trata a frase só como descrição de clima, cena ou cor e proíbe seguir instruções escritas nela. O pior caso é uma resposta esquisita, que ainda passa por `cleanMood` e por `moodToLayers`.

## Configuração

1. Crie `.env.local` na raiz (o `.gitignore` já ignora `.env*`) com:

   ```
   ANTHROPIC_API_KEY=sk-ant-...
   ```

2. Reinicie o `pnpm dev`: o Next só lê o arquivo ao subir.
3. Em produção, cadastre a mesma variável nas configurações de ambiente do serviço de hospedagem. Sem ela a rota responde 503 e a interface mostra "Não consegui interpretar agora".

O proxy do `next-intl` (`proxy.ts`) já exclui `/api`, então a rota não passa pelo roteamento de idioma.

## Como testar

Com o site rodando, no console do navegador (só existe em `pnpm dev`):

```js
await waveMood("domingo chuvoso")
await waveMood("ondas azuis")
await waveMood("qualquer coisa sem clima")   // volta ao rosa original
```

Ele chama a rota real e, se ela não responder (sem chave, pausa), avisa no console e usa o mock, que só reconhece poucas palavras (`tempestade`, `azul`, `verde`, `quente`, `frio`...). Confira nos **dois temas** e no celular. Erros da rota aparecem no terminal do `pnpm dev`.

## O que ajustar

Todos são constantes com comentário no próprio arquivo:

| O quê | Onde | Constante |
|---|---|---|
| quanto cada dial mexe na forma | `waveMood.ts` | `ENERGY_AMPLITUDE`, `CALM_RIPPLE`, `CALM_SKEW`, `SPEED_RATE` |
| velocidade da transição | `waveMood.ts` | `EASE_SECONDS` (0,9 s; cerca de 3× isso para assentar) |
| força do frio/quente | `waveScene.ts` | `MAX_TINT` |
| força da cor pedida e saturação mínima | `waveScene.ts` | `HUE_STRENGTH`, `HUE_SATURATION` |
| modelo, tamanho da saída, pausa | `route.ts` | `MODEL`, `max_tokens`, `COOLDOWN_MS` |
| como o modelo lê frases | `route.ts` | `SYSTEM` |

## Limitações conhecidas e ideias

- A pausa por IP da rota é fraca (veja acima); o limite de gasto é a defesa.
- O clima vale só até recarregar a página (não é salvo).
- Ideias: salvar o último clima, sugerir frases de exemplo no campo, deixar o menu mostrar a `label` atual.
