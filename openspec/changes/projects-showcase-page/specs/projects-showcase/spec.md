## Purpose

Mantém a home enxuta conforme o número de projetos cresce: a home mostra só uma seleção curada, e uma página dedicada lista o acervo completo de projetos, nos dois idiomas.

## ADDED Requirements

### Requirement: Destaques de projetos na home
A seção de projetos da home MUST exibir apenas os projetos marcados como destaque, na mesma ordem de cadastro, em vez da lista completa. A seção MUST conter um link para a página com todos os projetos. Se nenhum projeto estiver marcado como destaque, a seção MUST exibir a lista completa como recurso de segurança, em vez de ficar vazia.

#### Scenario: Home mostra só os destaques
- **WHEN** existem projetos marcados e não marcados como destaque
- **THEN** a seção de projetos da home exibe somente os marcados como destaque

#### Scenario: Link para o acervo completo
- **WHEN** a seção de projetos da home é exibida
- **THEN** um link "ver todos os projetos" (traduzido no idioma ativo) está presente e leva à página de todos os projetos

#### Scenario: Nenhum destaque cadastrado
- **WHEN** nenhum projeto está marcado como destaque
- **THEN** a seção de projetos da home exibe todos os projetos, em vez de ficar vazia

### Requirement: Página de todos os projetos
Cada idioma MUST ter uma página própria listando todos os projetos cadastrados, em uma grade responsiva sem rolagem horizontal em nenhuma largura de tela. Cada projeto MUST ser exibido com a mesma estrutura de card usada na home (painel visual, tipo, título, descrição, tecnologias e links). A página MUST ser alcançável a partir do link "ver todos os projetos" da home.

#### Scenario: Acessar a página de todos os projetos
- **WHEN** o visitante aciona o link "ver todos os projetos" na home de `/pt`
- **THEN** a página `/pt/projects` é aberta listando todos os projetos cadastrados

#### Scenario: Conteúdo no idioma ativo
- **WHEN** a página de todos os projetos é aberta em `/en`
- **THEN** título, tipo e descrição de cada projeto aparecem em inglês

#### Scenario: Sem rolagem horizontal no celular
- **WHEN** a página de todos os projetos é exibida com 360px de largura
- **THEN** os cards ficam em coluna única, sem rolagem horizontal

### Requirement: Navegação do header fora da home
Os links de navegação do header (seções de experiências e projetos) e o controle de voltar ao topo MUST continuar funcionando quando acionados a partir de uma página diferente da home, levando o visitante até a home já posicionada na seção correspondente, em vez de não fazerem nada ou apontarem para uma âncora inexistente na página atual.

#### Scenario: Navegar para uma seção a partir da página de projetos
- **WHEN** o visitante, na página `/pt/projects`, aciona o link "Experiências" no header
- **THEN** a home `/pt` é aberta posicionada na seção de experiências

#### Scenario: Voltar ao topo a partir da página de projetos
- **WHEN** o visitante, na página `/pt/projects`, aciona o controle de voltar ao topo
- **THEN** a home `/pt` é aberta posicionada na seção de apresentação
