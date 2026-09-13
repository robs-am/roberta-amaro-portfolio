## Purpose

Define a estrutura da página única do portfólio: header, apresentação e seções âncora, e como o visitante navega entre elas em qualquer tamanho de tela.

## ADDED Requirements

### Requirement: Estrutura de página única
A página de cada idioma MUST conter, nesta ordem, um header, a seção de apresentação (hero), a seção de experiências e a seção de projetos. As seções de experiências e projetos MUST ter os identificadores de âncora `experience` e `projects`, iguais nos dois idiomas.

#### Scenario: Ordem das seções
- **WHEN** a página `/pt` é carregada
- **THEN** as seções aparecem na ordem: apresentação, experiências, projetos

#### Scenario: Âncoras iguais nos dois idiomas
- **WHEN** as páginas `/pt` e `/en` são carregadas
- **THEN** ambas contêm as âncoras `#experience` e `#projects`

### Requirement: Seção de apresentação
A seção de apresentação MUST exibir o nome, o título profissional e um texto curto sobre a pessoa, no idioma ativo.

#### Scenario: Apresentação em inglês
- **WHEN** a página `/en` é carregada
- **THEN** a apresentação mostra o nome, o título profissional e o texto sobre a pessoa em inglês

### Requirement: Navegação entre seções
O header MUST conter links para as seções de experiências e projetos. Acionar um link MUST levar à seção correspondente e atualizar o fragmento da URL. Acessar uma URL com fragmento MUST abrir a página já na seção indicada. A rolagem MUST ser suave, exceto quando o visitante tiver a preferência de movimento reduzido ativa, caso em que MUST ser instantânea.

#### Scenario: Clique no link de projetos
- **WHEN** o visitante aciona o link "Projetos" no header de `/pt`
- **THEN** a página rola até a seção de projetos
- **AND** a URL passa a ser `/pt#projects`

#### Scenario: Acesso direto a uma seção
- **WHEN** o visitante acessa `/en#experience`
- **THEN** a página abre posicionada na seção de experiências

#### Scenario: Movimento reduzido
- **WHEN** o visitante com preferência de movimento reduzido aciona um link de seção
- **THEN** a página vai até a seção sem animação de rolagem

### Requirement: Header acessível durante a rolagem
O header, com a navegação, o seletor de idioma e o alternador de tema, MUST permanecer visível e utilizável enquanto o visitante rola a página, sem cobrir o título da seção de destino ao navegar por âncora.

#### Scenario: Controles disponíveis após rolar
- **WHEN** o visitante rola até a seção de projetos
- **THEN** o seletor de idioma e o alternador de tema continuam visíveis e acionáveis

#### Scenario: Título da seção não coberto
- **WHEN** o visitante navega para `#projects`
- **THEN** o título da seção de projetos fica visível abaixo do header

### Requirement: Layout responsivo
A página MUST ser utilizável em larguras de tela a partir de 360px, sem rolagem horizontal, com todos os controles do header acessíveis.

#### Scenario: Tela de celular
- **WHEN** a página é exibida com 360px de largura
- **THEN** não há rolagem horizontal
- **AND** a navegação, o seletor de idioma e o alternador de tema estão acessíveis

#### Scenario: Tela de desktop
- **WHEN** a página é exibida com 1440px de largura
- **THEN** o conteúdo fica centralizado com largura máxima limitada, sem linhas de texto ocupando a tela inteira

### Requirement: Brilho de fundo interativo
A página MUST exibir, atrás do topo, um brilho decorativo em gradiente com as cores de destaque do tema ativo. Em dispositivos com ponteiro preciso (mouse ou trackpad), o brilho MUST se deslocar suavemente na direção do ponteiro, com deslocamento pequeno e sem saltos. O brilho MUST permanecer parado quando a preferência de movimento reduzido estiver ativa ou quando o dispositivo não tiver ponteiro preciso. O brilho MUST ser ignorado por leitores de tela, MUST NOT impedir cliques ou seleção de texto e MUST NOT manter animação em execução enquanto o ponteiro estiver parado.

#### Scenario: Movimento do mouse
- **WHEN** o visitante move o mouse da esquerda para a direita da tela
- **THEN** o brilho se desloca suavemente para a direita, sem saltos

#### Scenario: Movimento reduzido
- **WHEN** o visitante com preferência de movimento reduzido move o mouse
- **THEN** o brilho permanece parado

#### Scenario: Dispositivo de toque
- **WHEN** a página é aberta em um celular sem mouse
- **THEN** o brilho é exibido parado

#### Scenario: Ponteiro parado
- **WHEN** o visitante para de mover o mouse e o brilho termina de se acomodar
- **THEN** nenhuma animação do brilho continua em execução

#### Scenario: Cores acompanham o tema
- **WHEN** o visitante alterna entre tema claro e escuro
- **THEN** o brilho passa a usar as cores de destaque do tema ativo

#### Scenario: Não interfere na interação
- **WHEN** o visitante clica em um link posicionado sobre a área do brilho
- **THEN** o link é acionado normalmente

### Requirement: Menu de navegação no celular
Em larguras de tela abaixo de 768px, os links de navegação do header MUST ficar em um menu recolhível, aberto por um botão com rótulo acessível no idioma ativo que indica se o menu está aberto. O seletor de idioma e o alternador de tema MUST permanecer visíveis no header, fora do menu. O menu aberto MUST aparecer como um painel logo abaixo do header e MUST fechar quando o visitante acionar um de seus links, pressionar Esc, tocar ou clicar fora dele, ou quando a largura da tela passar a 768px ou mais. A partir de 768px, os links MUST ficar visíveis diretamente no header e o botão de menu MUST NOT ser exibido.

#### Scenario: Header no celular
- **WHEN** a página é exibida com 360px de largura
- **THEN** os links de navegação ficam ocultos e o botão de menu é exibido
- **AND** o seletor de idioma e o alternador de tema continuam visíveis

#### Scenario: Abrir o menu
- **WHEN** o visitante aciona o botão de menu em `/pt`
- **THEN** um painel com os links "Experiências" e "Projetos" aparece abaixo do header
- **AND** o botão passa a ser anunciado como expandido, com rótulo para fechar o menu

#### Scenario: Navegar pelo menu
- **WHEN** o menu está aberto e o visitante aciona "Projetos"
- **THEN** a página vai até a seção de projetos
- **AND** o menu fecha

#### Scenario: Fechar com Esc
- **WHEN** o menu está aberto e o visitante pressiona Esc
- **THEN** o menu fecha
- **AND** o foco volta para o botão de menu

#### Scenario: Fechar ao tocar fora
- **WHEN** o menu está aberto e o visitante toca em uma área fora do header
- **THEN** o menu fecha

#### Scenario: Uso por teclado
- **WHEN** o visitante abre o menu pelo teclado e pressiona Tab
- **THEN** o foco percorre os links do menu

#### Scenario: Tela a partir de 768px
- **WHEN** a página é exibida com 1024px de largura
- **THEN** os links de navegação aparecem diretamente no header
- **AND** o botão de menu não é exibido

### Requirement: Animações de entrada
A seção de apresentação MUST animar no carregamento da página. Títulos de seção, itens da linha do tempo de experiências e cards de projeto MUST aparecer com uma animação de opacidade e deslocamento vertical curto, de no máximo 600ms, na primeira vez que entram na área visível; elementos que entram juntos MUST animar em sequência. Cada elemento MUST animar uma única vez por carregamento da página. Com a preferência de movimento reduzido ativa, o conteúdo MUST aparecer sem animação. Sem JavaScript disponível, nenhum conteúdo MUST ficar oculto.

#### Scenario: Apresentação no carregamento
- **WHEN** a página é carregada
- **THEN** nome, título profissional e texto de apresentação aparecem em sequência com a animação

#### Scenario: Cards em sequência
- **WHEN** o visitante rola até a seção de projetos
- **THEN** os cards aparecem um após o outro, com fade e leve subida

#### Scenario: Sem repetição
- **WHEN** o visitante rola até a seção de projetos, volta ao topo e rola até os projetos novamente
- **THEN** os cards não animam de novo

#### Scenario: Movimento reduzido
- **WHEN** o visitante com preferência de movimento reduzido carrega a página e rola até o fim
- **THEN** todo o conteúdo aparece imediatamente, sem animação

#### Scenario: Sem JavaScript
- **WHEN** a página é carregada com JavaScript desativado
- **THEN** todo o conteúdo fica visível

#### Scenario: Troca de idioma
- **WHEN** o visitante troca de idioma com a seção de projetos visível na tela
- **THEN** os cards aparecem no novo idioma e não permanecem ocultos

### Requirement: Destaque de cards no hover e foco
Ao passar o ponteiro sobre um card de projeto, ou ao mover o foco do teclado para um elemento dentro dele, o card MUST exibir um destaque suave com leve elevação, borda na cor de destaque e aproximação sutil da imagem do painel. Com a preferência de movimento reduzido ativa, o destaque MUST se limitar à mudança de cor da borda, sem movimento.

#### Scenario: Hover no card
- **WHEN** o visitante passa o ponteiro sobre um card de projeto
- **THEN** o card se eleva levemente, a borda muda para a cor de destaque e a imagem do painel se aproxima suavemente

#### Scenario: Foco por teclado
- **WHEN** o visitante move o foco com Tab até um link dentro de um card
- **THEN** o card exibe o mesmo destaque do hover

#### Scenario: Movimento reduzido
- **WHEN** o visitante com preferência de movimento reduzido passa o ponteiro sobre um card
- **THEN** apenas a cor da borda muda, sem elevação nem aproximação da imagem
