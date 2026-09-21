## Purpose

Exibe as experiências profissionais e os projetos do portfólio no idioma ativo, a partir de um único cadastro por item com textos em português e inglês.

## ADDED Requirements

### Requirement: Lista de experiências
A página de experiências MUST exibir cada experiência com cargo, empresa, período e descrição, ordenadas da mais recente para a mais antiga. Uma experiência sem data de término MUST exibir o término como "Atual" em português e "Present" em inglês.

#### Scenario: Ordenação por data
- **WHEN** existem experiências iniciadas em 2021 e em 2024
- **THEN** a experiência de 2024 aparece antes da de 2021

#### Scenario: Experiência atual
- **WHEN** uma experiência não tem data de término e a página está em `/en`
- **THEN** o período é exibido terminando em "Present"

### Requirement: Lista de projetos
A página de projetos (`/projects`) MUST listar todos os projetos que tenham um link de demonstração ou de repositório, na ordem de cadastro, cada um como uma linha com painel visual, título e tipo do projeto, sob um título de página com o número de projetos. Um projeto sem nenhum dos dois links MUST NOT ser listado. Cada linha MUST ser um botão que abre o detalhe do projeto. Ao passar o ponteiro sobre uma linha, a imagem do painel MUST se aproximar suavemente e o escurecimento que uniformiza as imagens MUST diminuir; com a preferência de movimento reduzido ativa, a imagem MUST NOT se mover.

#### Scenario: Ordem e conteúdo da linha
- **WHEN** a página `/pt/projects` é carregada
- **THEN** cada projeto com link aparece como uma linha com o painel visual, o título e o tipo
- **AND** os projetos aparecem na ordem de cadastro

#### Scenario: Projeto sem links
- **WHEN** um projeto não tem link de demonstração nem de repositório
- **THEN** ele não aparece na lista

#### Scenario: Hover na linha
- **WHEN** o visitante passa o ponteiro sobre a linha de um projeto
- **THEN** a imagem do painel se aproxima suavemente

#### Scenario: Movimento reduzido no hover
- **WHEN** o visitante com preferência de movimento reduzido passa o ponteiro sobre uma linha
- **THEN** a imagem do painel não se move

### Requirement: Detalhe do projeto
Acionar a linha de um projeto MUST abrir, sobre a página, um diálogo modal com a imagem (ou imagens), o título, o tipo, a descrição, o que a autora fez no projeto (quando cadastrado), as tecnologias e um link para o projeto. O link MUST apontar para a demonstração quando ela existir e, senão, para o repositório, MUST abrir em nova aba sem dar à página aberta acesso à página de origem e MUST avisar leitores de tela que abre em nova aba. O diálogo MUST fechar pelo botão de fechar, pela tecla Esc ou ao acionar a área fora dele, e o foco MUST voltar à linha que o abriu. Com o diálogo aberto, a rolagem da página MUST ficar bloqueada sem deslocar o conteúdo pela largura da barra de rolagem. Com a preferência de movimento reduzido ativa, o diálogo MUST abrir e fechar sem animação.

#### Scenario: Abrir o detalhe
- **WHEN** o visitante aciona a linha de um projeto em `/pt/projects`
- **THEN** um diálogo mostra a imagem, o título, o tipo, a descrição e as tecnologias do projeto

#### Scenario: Link para o projeto
- **WHEN** um projeto tem demonstração e repositório
- **THEN** o link do diálogo aponta para a demonstração

#### Scenario: Projeto só com repositório
- **WHEN** um projeto tem apenas link de repositório
- **THEN** o link do diálogo aponta para o repositório, sem link vazio ou quebrado

#### Scenario: Abrir link externo
- **WHEN** o visitante aciona o link do projeto no diálogo
- **THEN** o link abre em nova aba
- **AND** a página aberta não tem referência à janela do portfólio

#### Scenario: Fechar com Esc
- **WHEN** o diálogo está aberto e o visitante pressiona Esc
- **THEN** o diálogo fecha
- **AND** o foco volta para a linha do projeto

#### Scenario: Fechar ao acionar fora
- **WHEN** o diálogo está aberto e o visitante aciona a área fora dele
- **THEN** o diálogo fecha

### Requirement: Painel visual do projeto
Toda linha de projeto MUST ter um painel visual de mesma proporção no celular. Quando o projeto tiver uma imagem, o painel MUST exibi-la com texto alternativo no idioma ativo; quando tiver várias, MUST exibi-las lado a lado, em faixas inclinadas. Quando não tiver imagem, o painel MUST exibir um fundo decorativo, que MUST ser ignorado por leitores de tela.

#### Scenario: Projeto com imagem
- **WHEN** um projeto tem imagem e a página está em `/pt`
- **THEN** o painel exibe a imagem com texto alternativo em português

#### Scenario: Projeto com várias imagens
- **WHEN** um projeto tem duas ou mais imagens
- **THEN** o painel exibe as imagens lado a lado, em faixas inclinadas

#### Scenario: Projeto sem imagem
- **WHEN** um projeto não tem imagem
- **THEN** o painel exibe um fundo decorativo com a mesma proporção dos painéis com imagem
- **AND** um leitor de tela não anuncia nenhum conteúdo para esse painel

### Requirement: Página sobre
A página `/about` MUST exibir um texto de apresentação (introdução e uma curiosidade), a stack principal e as tecnologias com que a autora também trabalha, com o mesmo conteúdo estrutural nos dois idiomas. Os nomes das tecnologias MUST ser iguais nos dois idiomas.

#### Scenario: Conteúdo da página
- **WHEN** a página `/pt/about` é carregada
- **THEN** ela exibe o texto de apresentação, a stack principal e a lista de tecnologias com que a autora também trabalha

#### Scenario: Tecnologias iguais nos dois idiomas
- **WHEN** a página `/en/about` é carregada
- **THEN** os nomes das tecnologias são idênticos aos de `/pt/about`

### Requirement: Conteúdo no idioma ativo
Os campos de texto de experiências e projetos (cargo, descrição, tipo do projeto, título, o que a autora fez, texto alternativo) MUST ser exibidos no idioma ativo. Os campos que não dependem de idioma (empresa, datas, tecnologias, links) MUST ser os mesmos nas duas versões.

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

### Requirement: Página de trajetória
As experiências, a formação e os prêmios MUST ser exibidos em uma única página, `/experience`, com o mesmo conteúdo e a mesma ordem nos dois idiomas.

#### Scenario: Conteúdo reunido
- **WHEN** a página `/pt/experience` é carregada
- **THEN** ela exibe as experiências, a formação e os prêmios

### Requirement: Formação
A página de trajetória MUST exibir cada formação com curso, instituição e período, da mais recente para a mais antiga pela data de término. Uma data informada só com o ano MUST ser exibida sem mês. Uma formação sem data de término MUST exibir o término como "Em andamento" em português e "In progress" em inglês.

#### Scenario: Data só com ano
- **WHEN** uma formação começa em 2012 e termina em 2018
- **THEN** o período é exibido como ano de início e ano de término, sem mês

#### Scenario: Data com mês
- **WHEN** uma formação começa em março de 2024 e a página está em `/pt`
- **THEN** a data de início é exibida no formato de mês e ano em português

#### Scenario: Formação em andamento
- **WHEN** uma formação não tem data de término e a página está em `/en`
- **THEN** o período é exibido terminando em "In progress"

### Requirement: Prêmios
Um prêmio ligado a uma experiência MUST aparecer dentro dessa experiência. Um prêmio sem experiência MUST aparecer em um painel de destaque separado: em uma coluna lateral fixa a partir de 1024px de largura e, abaixo disso, entre as experiências e a formação. Os links de projeto e de certificado MUST aparecer apenas quando existirem e MUST abrir em nova aba sem dar à página aberta acesso à página de origem. Acessar `/awards` MUST redirecionar em caráter permanente para `/experience` no mesmo idioma.

#### Scenario: Prêmio de uma empresa
- **WHEN** um prêmio está ligado a uma experiência
- **THEN** ele aparece dentro dessa experiência e não no painel separado

#### Scenario: Prêmio independente
- **WHEN** um prêmio não está ligado a nenhuma experiência
- **THEN** ele aparece no painel de destaque, com evento, colocação, emissor, data e descrição

#### Scenario: Prêmio sem certificado
- **WHEN** um prêmio não tem link de certificado
- **THEN** o painel não exibe link de certificado nem espaço vazio no lugar dele

#### Scenario: Endereço antigo de prêmios
- **WHEN** o visitante acessa `/en/awards`
- **THEN** é redirecionado permanentemente para `/en/experience`

### Requirement: Tradução obrigatória
Todo item de experiência, formação, prêmio ou projeto MUST ter todos os seus campos de texto preenchidos em português e em inglês. Um item com tradução faltando MUST impedir o build do site, em vez de ser publicado com texto vazio.

#### Scenario: Descrição sem versão em inglês
- **WHEN** um projeto é cadastrado com descrição apenas em português
- **THEN** o build do site falha indicando o campo sem tradução
