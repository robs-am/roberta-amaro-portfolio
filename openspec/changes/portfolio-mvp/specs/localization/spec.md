## Purpose

Permite que o portfólio seja lido em português ou inglês, cada idioma com sua própria URL indexável, e que o visitante troque de idioma a qualquer momento.

## ADDED Requirements

### Requirement: Rotas por idioma
O site MUST servir a página em português sob o prefixo `/pt` e em inglês sob o prefixo `/en`. O HTML entregue pelo servidor MUST já conter todo o texto no idioma da URL, sem depender de JavaScript no cliente, e o elemento `<html>` MUST declarar o atributo `lang` correspondente (`pt-BR` ou `en`).

#### Scenario: Acesso à versão em inglês
- **WHEN** o visitante acessa `/en`
- **THEN** a página é exibida inteiramente em inglês
- **AND** o elemento `<html>` tem `lang="en"`

#### Scenario: Acesso à versão em português
- **WHEN** o visitante acessa `/pt`
- **THEN** a página é exibida inteiramente em português
- **AND** o elemento `<html>` tem `lang="pt-BR"`

#### Scenario: Conteúdo visível sem JavaScript
- **WHEN** a página `/en` é requisitada por um cliente que não executa JavaScript
- **THEN** o HTML retornado contém os textos em inglês

### Requirement: Detecção de idioma na raiz
Ao acessar a raiz `/`, o site MUST redirecionar para `/en` ou `/pt` conforme a preferência de idioma do navegador. Quando a preferência não for inglês nem português, ou não estiver disponível, o site MUST redirecionar para `/pt`.

#### Scenario: Navegador em inglês
- **WHEN** o visitante acessa `/` com o navegador configurado para `en-US`
- **THEN** é redirecionado para `/en`

#### Scenario: Navegador em português
- **WHEN** o visitante acessa `/` com o navegador configurado para `pt-BR`
- **THEN** é redirecionado para `/pt`

#### Scenario: Idioma do navegador não suportado
- **WHEN** o visitante acessa `/` com o navegador configurado para `es-ES`
- **THEN** é redirecionado para `/pt`

#### Scenario: Sem preferência de idioma
- **WHEN** o visitante acessa `/` sem informar preferência de idioma
- **THEN** é redirecionado para `/pt`

### Requirement: Escolha manual tem precedência
Depois que o visitante escolher um idioma manualmente, visitas seguintes à raiz `/` MUST redirecionar para o idioma escolhido, mesmo que difira da preferência do navegador.

#### Scenario: Retorno após escolher inglês
- **WHEN** um visitante com navegador em `pt-BR` troca para inglês e depois acessa `/` novamente
- **THEN** é redirecionado para `/en`

### Requirement: Caminho sem idioma suportado
Um caminho que não comece com `/pt` ou `/en` MUST ser redirecionado para o mesmo caminho sob o idioma detectado. Quando o caminho resultante não existir, o site MUST responder com página não encontrada (HTTP 404) no idioma ativo, marcada para não ser indexada por buscadores.

#### Scenario: Prefixo inexistente
- **WHEN** o visitante sem preferência de idioma acessa `/fr`
- **THEN** é redirecionado para `/pt/fr`
- **AND** a página responde "Página não encontrada" com status 404

#### Scenario: Página inexistente dentro de um idioma
- **WHEN** o visitante acessa `/en/qualquer-coisa`
- **THEN** a página responde "Page not found" com status 404
- **AND** o documento contém a instrução `noindex`

### Requirement: Seletor de idioma
O header MUST oferecer um controle que troca a página para o outro idioma, indica qual idioma está ativo e é operável por teclado. A troca MUST manter o visitante na mesma página e preservar a seção âncora atual da URL, quando houver.

#### Scenario: Troca de português para inglês
- **WHEN** o visitante está em `/pt` e aciona o seletor de idioma escolhendo inglês
- **THEN** a URL passa a ser `/en`
- **AND** todo o texto da página é exibido em inglês

#### Scenario: Troca preservando a seção
- **WHEN** o visitante está em `/pt#projects` e troca para inglês
- **THEN** a URL passa a ser `/en#projects`
- **AND** a seção de projetos continua visível

#### Scenario: Uso por teclado
- **WHEN** o visitante navega até o seletor com Tab e o aciona com Enter ou Espaço
- **THEN** o idioma é trocado

### Requirement: Textos de interface no idioma ativo
Todos os textos de interface (links de navegação, títulos de seção, rótulos acessíveis de botões, título e descrição da página) MUST estar no idioma ativo, sem mistura de idiomas na mesma página.

#### Scenario: Rótulos acessíveis traduzidos
- **WHEN** a página é exibida em `/en`
- **THEN** os rótulos acessíveis do seletor de idioma e do alternador de tema estão em inglês

#### Scenario: Metadados da página traduzidos
- **WHEN** a página `/pt` é carregada
- **THEN** o título e a meta descrição do documento estão em português

### Requirement: Indicação de versões alternativas
Cada página MUST declarar, nos metadados do documento, links para sua versão em cada idioma suportado, para que buscadores associem as duas versões.

#### Scenario: Links alternativos presentes
- **WHEN** a página `/pt` é carregada
- **THEN** o documento contém links alternativos com `hreflang` apontando para `/pt` e `/en`
