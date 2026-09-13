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
