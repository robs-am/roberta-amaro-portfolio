## Purpose

Define a estrutura do site do portfólio: uma home de uma tela só (o hero) e páginas próprias para sobre, experiências e projetos, o header, o menu em tela cheia que leva a elas, e a camada visual (formas 3D, brilho, textura e animações) em qualquer tamanho de tela.

## ADDED Requirements

### Requirement: Estrutura do site
O site de cada idioma MUST ter quatro páginas: a home (`/pt`, `/en`), sobre (`/about`), experiências (`/experience`) e projetos (`/projects`). Toda página MUST conter um header e o conteúdo principal, e as páginas internas MUST conter também um rodapé com os créditos e o link de voltar ao topo; na home, os créditos ficam dentro da apresentação, logo abaixo dos contatos, e não há rodapé. Os caminhos das páginas MUST ser iguais nos dois idiomas, diferindo só pelo prefixo.

#### Scenario: Páginas nos dois idiomas
- **WHEN** o visitante acessa `/pt/about` e `/en/about`
- **THEN** as duas páginas existem, cada uma no seu idioma

#### Scenario: Conteúdo principal identificável
- **WHEN** qualquer página é carregada
- **THEN** o conteúdo principal está em um elemento `main` com o identificador `main-content`
- **AND** um link "pular para o conteúdo", visível só ao receber o foco do teclado, leva até ele

### Requirement: Home de uma tela
A home MUST ser composta só pela apresentação (hero), sem seções abaixo dela. A apresentação MUST exibir o nome, o título profissional, um link para a página de experiências, um link para a página de projetos e os links de contato (e-mail, LinkedIn e GitHub) com rótulo acessível no idioma ativo. Links de contato sem endereço cadastrado MUST NOT ser exibidos. Links externos MUST abrir em nova aba sem dar à página aberta acesso à página de origem.

#### Scenario: Apresentação em inglês
- **WHEN** a página `/en` é carregada
- **THEN** a apresentação mostra o nome, o título profissional e os links "View projects" e "View experience" em inglês

#### Scenario: Ir para uma página a partir da home
- **WHEN** o visitante aciona o link de projetos na apresentação de `/pt`
- **THEN** a página `/pt/projects` é aberta

#### Scenario: Contato sem endereço
- **WHEN** o cadastro do perfil não tem endereço de GitHub
- **THEN** o link do GitHub não aparece, sem espaço vazio no lugar

### Requirement: Menu de navegação em tela cheia
O header MUST conter um botão de menu, com rótulo acessível no idioma ativo, que indica se o menu está aberto. Acioná-lo MUST abrir um painel em tela cheia com os links para todas as páginas (início, sobre, experiências e projetos, nesta ordem, numerados) e os links de contato, e os mesmos controles de idioma, tema e fechar que o header. A página atual MUST ser marcada como página atual para leitores de tela e destacada visualmente. O menu MUST fechar quando o visitante acionar um de seus links, o botão de fechar ou a tecla Esc. Com o menu aberto, o foco MUST ir para o botão de fechar e ficar restrito ao painel, a rolagem da página MUST ficar bloqueada e, ao fechar, o foco MUST voltar ao botão que o abriu. Com a preferência de movimento reduzido ativa, o menu MUST abrir e fechar sem animação. O menu MUST ser o mesmo em qualquer largura de tela.

#### Scenario: Abrir o menu
- **WHEN** o visitante aciona o botão de menu em `/pt`
- **THEN** um painel em tela cheia mostra "Início", "Sobre", "Experiências" e "Projetos" e os contatos
- **AND** o botão de menu é anunciado como expandido
- **AND** o foco vai para o botão de fechar

#### Scenario: Página atual marcada
- **WHEN** o menu é aberto em `/pt/projects`
- **THEN** o link "Projetos" é anunciado como página atual e aparece na cor de destaque

#### Scenario: Navegar pelo menu
- **WHEN** o menu está aberto e o visitante aciona "Experiências"
- **THEN** a página `/pt/experience` é aberta
- **AND** o menu fecha

#### Scenario: Fechar com Esc
- **WHEN** o menu está aberto e o visitante pressiona Esc
- **THEN** o menu fecha
- **AND** o foco volta para o botão de menu

#### Scenario: Foco preso no menu
- **WHEN** o menu está aberto e o visitante pressiona Tab repetidamente
- **THEN** o foco percorre só os controles do painel, sem alcançar o conteúdo da página por trás

#### Scenario: Movimento reduzido
- **WHEN** o visitante com preferência de movimento reduzido abre o menu
- **THEN** o painel aparece sem animação

### Requirement: Header e controles agrupados
O header MUST agrupar o seletor de idioma, o alternador de tema e o botão de menu em uma única cápsula com contorno, todos com a mesma altura e área de toque mínima de 36px, e o menu aberto MUST repetir essa cápsula na mesma posição. Nas páginas internas o header MUST conter também um link para a home e um botão de voltar que reabre o menu; esse botão MUST ser omitido quando a página foi aberta por um link da apresentação da home, já que o link para a home cumpre esse papel. Na home o header MUST conter só a cápsula de controles.

#### Scenario: Controles na cápsula
- **WHEN** qualquer página é exibida com 360px de largura
- **THEN** idioma, tema e menu aparecem dentro de uma única cápsula, com o mesmo alinhamento e altura

#### Scenario: Cápsula fixa ao abrir o menu
- **WHEN** o visitante abre o menu
- **THEN** a cápsula continua no mesmo lugar, com o botão de fechar no lugar do botão de menu

#### Scenario: Voltar ao menu
- **WHEN** o visitante, em `/pt/about` aberta pelo menu, aciona o botão de voltar do header
- **THEN** o menu é reaberto

#### Scenario: Página aberta pela apresentação
- **WHEN** o visitante abre `/pt/projects` pelo link da apresentação da home
- **THEN** o header mostra o link para a home e não mostra o botão de voltar ao menu

### Requirement: Header acessível durante a rolagem
Nas páginas internas, o header MUST permanecer visível e utilizável enquanto o visitante rola a página, ganhando fundo e borda depois de uma pequena rolagem para não misturar com o conteúdo. Na home, o header MUST flutuar sobre a apresentação, sem fundo e sem ocupar espaço próprio.

#### Scenario: Controles disponíveis após rolar
- **WHEN** o visitante rola até o fim de `/pt/experience`
- **THEN** a cápsula de controles continua visível e acionável

#### Scenario: Header sobre o conteúdo
- **WHEN** o visitante rola `/pt/experience` alguns pixels
- **THEN** o header ganha fundo e borda inferior

### Requirement: Página começa no topo
Toda página MUST abrir posicionada no topo, sem restaurar a rolagem anterior do navegador e sem manter fragmento na URL. Voltar ao topo dentro de uma página interna MUST ser possível por um link do rodapé, com rolagem suave, exceto quando o visitante tiver a preferência de movimento reduzido ativa, caso em que MUST ser instantânea.

#### Scenario: Recarregar rolado
- **WHEN** o visitante recarrega `/pt/projects` depois de rolar a página
- **THEN** a página abre no topo

#### Scenario: Voltar ao topo pelo rodapé
- **WHEN** o visitante, no fim de `/pt/experience`, aciona o link de voltar ao topo do rodapé
- **THEN** a página rola suavemente até o topo

#### Scenario: Movimento reduzido
- **WHEN** o visitante com preferência de movimento reduzido aciona o link de voltar ao topo
- **THEN** a página vai ao topo sem animação de rolagem

### Requirement: Layout responsivo
O site MUST ser utilizável em larguras de tela a partir de 360px, sem rolagem horizontal, com todos os controles do header acessíveis. No celular, o texto da apresentação MUST começar logo abaixo do header, com o nome dimensionado pela largura da tela para ocupar quase toda a largura útil e o cargo em uma linha ou em duas, sem estourar a largura.

#### Scenario: Tela de celular
- **WHEN** a home é exibida com 360px de largura
- **THEN** não há rolagem horizontal
- **AND** o nome, o cargo, os links e os contatos cabem na largura, alinhados à esquerda pelo mesmo eixo

#### Scenario: Tela de desktop
- **WHEN** qualquer página interna é exibida com 1440px de largura
- **THEN** o conteúdo fica centralizado com largura máxima limitada, sem linhas de texto ocupando a tela inteira

#### Scenario: Cargo mais longo
- **WHEN** a home é exibida em `/pt` com 360px de largura
- **THEN** o cargo quebra em duas linhas em vez de ultrapassar a largura da tela

### Requirement: Formas 3D decorativas
A home e o menu aberto MUST exibir, atrás do texto, um conjunto de formas 3D arredondadas (um anel, um nó e duas esferas) nas cores do tema ativo. As formas MUST ser ignoradas por leitores de tela, MUST NOT impedir cliques ou seleção de texto e MUST estar na mesma posição na home e no menu, deslizando de uma composição para a outra quando o menu abre ou fecha. Em telas em pé (celular), as formas MUST se reunir em um único agrupamento no espaço livre abaixo do texto e MUST NOT cobrir o texto. Em dispositivos com ponteiro preciso e sem preferência de movimento reduzido, as formas MUST reagir suavemente ao ponteiro; com movimento reduzido, MUST permanecer paradas. Na home, as formas MUST se dissipar conforme o visitante rola a página.

#### Scenario: Celular sem cobrir o texto
- **WHEN** a home é exibida com 360px de largura
- **THEN** as formas ficam reunidas abaixo do bloco de texto
- **AND** nenhuma forma cobre o nome, o cargo, os links ou os contatos

#### Scenario: Movimento reduzido
- **WHEN** o visitante com preferência de movimento reduzido abre a home e move o mouse
- **THEN** as formas permanecem paradas

#### Scenario: Cores acompanham o tema
- **WHEN** o visitante alterna entre tema claro e escuro
- **THEN** as formas passam a usar as cores do tema ativo

#### Scenario: Não interfere na interação
- **WHEN** o visitante clica em um link posicionado sobre uma forma
- **THEN** o link é acionado normalmente

#### Scenario: Abrir o menu na home
- **WHEN** o visitante abre o menu estando na home
- **THEN** as formas continuam visíveis atrás do menu e deslizam para a posição do menu, sem reaparecer do zero

### Requirement: Brilho de fundo interativo
As páginas internas MUST exibir, atrás do topo, um brilho decorativo em gradiente com as cores de destaque do tema ativo; a home e o menu, que têm as formas 3D, MUST ter fundo liso, sem o brilho. Em dispositivos com ponteiro preciso (mouse ou trackpad), o brilho MUST se deslocar suavemente na direção do ponteiro, com deslocamento pequeno e sem saltos. O brilho MUST permanecer parado quando a preferência de movimento reduzido estiver ativa ou quando o dispositivo não tiver ponteiro preciso. O brilho MUST ser ignorado por leitores de tela, MUST NOT impedir cliques ou seleção de texto e MUST NOT manter animação em execução enquanto o ponteiro estiver parado.

#### Scenario: Movimento do mouse
- **WHEN** o visitante move o mouse da esquerda para a direita da tela em `/pt/about`
- **THEN** o brilho se desloca suavemente para a direita, sem saltos

#### Scenario: Movimento reduzido
- **WHEN** o visitante com preferência de movimento reduzido move o mouse em uma página interna
- **THEN** o brilho permanece parado

#### Scenario: Dispositivo de toque
- **WHEN** uma página interna é aberta em um celular sem mouse
- **THEN** o brilho é exibido parado

#### Scenario: Ponteiro parado
- **WHEN** o visitante para de mover o mouse e o brilho termina de se acomodar
- **THEN** nenhuma animação do brilho continua em execução

#### Scenario: Cores acompanham o tema
- **WHEN** o visitante alterna entre tema claro e escuro
- **THEN** o brilho passa a usar as cores de destaque do tema ativo

#### Scenario: Home sem brilho
- **WHEN** a home é exibida
- **THEN** o fundo é liso, sem o brilho, e as formas 3D fazem o papel de cor

#### Scenario: Não interfere na interação
- **WHEN** o visitante clica em um link posicionado sobre a área do brilho
- **THEN** o link é acionado normalmente

### Requirement: Textura de fundo
Todas as páginas e o menu aberto MUST ter uma textura fina de grão sobre o fundo, que MUST ficar atrás das formas, do texto e dos controles, MUST ser ignorada por leitores de tela e MUST NOT impedir cliques ou seleção de texto. A intensidade MUST ser discreta a ponto de não reduzir a legibilidade do texto em nenhum dos temas.

#### Scenario: Textura discreta
- **WHEN** qualquer página é exibida no tema claro
- **THEN** o fundo mostra a textura sutil, sem que o texto perca nitidez

#### Scenario: Mesma superfície no menu
- **WHEN** o menu é aberto
- **THEN** o painel usa a mesma textura do resto do site

### Requirement: Animações de entrada
O nome na apresentação MUST animar no carregamento da página, palavra por palavra, sem depender de o JavaScript ter carregado; o restante da apresentação (traço, cargo, links e contatos) MUST entrar em sequência logo depois. As linhas da lista de experiências e da lista de projetos MUST animar na primeira vez que entram na área visível: o título (ou o ano) de cada linha aparece primeiro e o restante do conteúdo logo depois. Cada linha MUST animar uma única vez por carregamento da página. Com a preferência de movimento reduzido ativa, o conteúdo MUST aparecer sem animação. Sem JavaScript disponível, ou se a animação não iniciar, nenhum conteúdo MUST ficar oculto por mais de alguns segundos.

#### Scenario: Apresentação no carregamento
- **WHEN** a home é carregada
- **THEN** as palavras do nome aparecem uma após a outra
- **AND** o cargo, os links e os contatos entram em sequência depois do nome

#### Scenario: Linhas ao rolar
- **WHEN** o visitante rola `/pt/experience` até uma experiência que ainda não estava visível
- **THEN** o ano da experiência aparece primeiro e o texto logo depois

#### Scenario: Sem repetição
- **WHEN** o visitante rola até uma linha da lista de projetos, volta ao topo e rola até ela novamente
- **THEN** a linha não anima de novo

#### Scenario: Movimento reduzido
- **WHEN** o visitante com preferência de movimento reduzido carrega a página e rola até o fim
- **THEN** todo o conteúdo aparece imediatamente, sem animação

#### Scenario: Sem JavaScript
- **WHEN** a página é carregada com JavaScript desativado
- **THEN** todo o conteúdo fica visível

#### Scenario: Troca de idioma
- **WHEN** o visitante troca de idioma em `/pt/projects`
- **THEN** a lista aparece no novo idioma e nenhuma linha permanece oculta
