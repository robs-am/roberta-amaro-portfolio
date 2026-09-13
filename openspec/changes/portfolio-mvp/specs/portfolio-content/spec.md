## Purpose

Exibe as experiências profissionais e os projetos do portfólio no idioma ativo, a partir de um único cadastro por item com textos em português e inglês.

## ADDED Requirements

### Requirement: Lista de experiências
A seção de experiências MUST exibir cada experiência com cargo, empresa, período e descrição, ordenadas da mais recente para a mais antiga. Uma experiência sem data de término MUST exibir o término como "Atual" em português e "Present" em inglês.

#### Scenario: Ordenação por data
- **WHEN** existem experiências iniciadas em 2021 e em 2024
- **THEN** a experiência de 2024 aparece antes da de 2021

#### Scenario: Experiência atual
- **WHEN** uma experiência não tem data de término e a página está em `/en`
- **THEN** o período é exibido terminando em "Present"

### Requirement: Cards de projetos
A seção de projetos MUST exibir cada projeto como um card vertical contendo, de cima para baixo: painel visual, tipo do projeto, título, descrição, tecnologias utilizadas e links. O card MUST exibir links para a demonstração e para o repositório apenas quando esses links existirem. Links externos MUST abrir em nova aba sem dar à página aberta acesso à página de origem.

#### Scenario: Ordem dos elementos do card
- **WHEN** um projeto com todos os campos é exibido
- **THEN** o card mostra, nesta ordem, painel visual, tipo, título, descrição, tecnologias e links

#### Scenario: Projeto com repositório e demonstração
- **WHEN** um projeto tem link de repositório e link de demonstração
- **THEN** o card exibe os dois links

#### Scenario: Projeto sem demonstração
- **WHEN** um projeto tem apenas link de repositório
- **THEN** o card exibe somente o link do repositório, sem link vazio ou quebrado

#### Scenario: Abrir link externo
- **WHEN** o visitante aciona o link de repositório de um card
- **THEN** o link abre em nova aba
- **AND** a página aberta não tem referência à janela do portfólio

### Requirement: Painel visual do card
Todo card de projeto MUST começar com um painel visual de mesma proporção. Quando o projeto tiver imagem, o painel MUST exibi-la com texto alternativo no idioma ativo. Quando não tiver, o painel MUST exibir um fundo decorativo, que MUST ser ignorado por leitores de tela.

#### Scenario: Projeto com imagem
- **WHEN** um projeto tem imagem e a página está em `/pt`
- **THEN** o painel do card exibe a imagem com texto alternativo em português

#### Scenario: Projeto sem imagem
- **WHEN** um projeto não tem imagem
- **THEN** o painel do card exibe um fundo decorativo com a mesma proporção dos painéis com imagem
- **AND** um leitor de tela não anuncia nenhum conteúdo para esse painel

### Requirement: Conteúdo no idioma ativo
Os campos de texto de experiências e projetos (cargo, descrição, tipo do projeto, título, texto alternativo) MUST ser exibidos no idioma ativo. Os campos que não dependem de idioma (empresa, datas, tecnologias, links) MUST ser os mesmos nas duas versões.

#### Scenario: Mesmo projeto nos dois idiomas
- **WHEN** um projeto é exibido em `/pt` e em `/en`
- **THEN** tipo, título e descrição aparecem no idioma de cada página
- **AND** tecnologias e links são idênticos nas duas páginas

### Requirement: Datas no formato do idioma
Os períodos das experiências MUST ser exibidos como mês e ano no formato do idioma ativo.

#### Scenario: Data em português
- **WHEN** uma experiência começa em março de 2024 e a página está em `/pt`
- **THEN** a data de início é exibida no formato de mês e ano em português (ex: "mar. de 2024")

#### Scenario: Data em inglês
- **WHEN** a mesma experiência é exibida em `/en`
- **THEN** a data de início é exibida no formato de mês e ano em inglês (ex: "Mar 2024")

### Requirement: Tradução obrigatória
Todo item de experiência ou projeto MUST ter todos os seus campos de texto preenchidos em português e em inglês. Um item com tradução faltando MUST impedir o build do site, em vez de ser publicado com texto vazio.

#### Scenario: Descrição sem versão em inglês
- **WHEN** um projeto é cadastrado com descrição apenas em português
- **THEN** o build do site falha indicando o campo sem tradução
