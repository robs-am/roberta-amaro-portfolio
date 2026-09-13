## Purpose

Permite que o visitante veja o portfólio em tema claro ou escuro, respeitando a preferência do sistema e lembrando a escolha feita.

## ADDED Requirements

### Requirement: Alternar tema
O header MUST oferecer um controle que alterna entre tema claro e escuro. A mudança MUST ser aplicada imediatamente, sem recarregar a página. O controle MUST ser operável por teclado e ter rótulo acessível que descreve a ação.

#### Scenario: Mudar para tema escuro
- **WHEN** o visitante está no tema claro e aciona o alternador de tema
- **THEN** a página passa a exibir o tema escuro sem recarregar

#### Scenario: Mudar para tema claro
- **WHEN** o visitante está no tema escuro e aciona o alternador de tema
- **THEN** a página passa a exibir o tema claro sem recarregar

#### Scenario: Uso por teclado
- **WHEN** o visitante foca o alternador com Tab e pressiona Enter ou Espaço
- **THEN** o tema é alternado

### Requirement: Preferência do sistema como padrão
Na primeira visita, sem escolha salva, o site MUST usar o tema correspondente à preferência de cor do sistema operacional do visitante.

#### Scenario: Sistema em modo escuro
- **WHEN** um visitante sem escolha salva acessa o site com o sistema em modo escuro
- **THEN** a página é exibida no tema escuro

#### Scenario: Sistema em modo claro
- **WHEN** um visitante sem escolha salva acessa o site com o sistema em modo claro
- **THEN** a página é exibida no tema claro

### Requirement: Persistência da escolha
Uma escolha manual de tema MUST ser mantida em recarregamentos, em visitas futuras no mesmo navegador e ao trocar de idioma, e MUST ter precedência sobre a preferência do sistema.

#### Scenario: Recarregar a página
- **WHEN** o visitante escolhe o tema escuro e recarrega a página
- **THEN** a página continua no tema escuro

#### Scenario: Trocar de idioma
- **WHEN** o visitante escolhe o tema escuro em `/pt` e troca para `/en`
- **THEN** a página em inglês é exibida no tema escuro

#### Scenario: Escolha diferente do sistema
- **WHEN** o visitante com sistema em modo escuro escolhe o tema claro e volta ao site depois
- **THEN** a página é exibida no tema claro

### Requirement: Sem flash de tema incorreto
A página MUST ser exibida no tema correto desde a primeira pintura, sem mostrar brevemente o outro tema durante o carregamento.

#### Scenario: Carregamento com tema escuro salvo
- **WHEN** um visitante com tema escuro salvo carrega a página
- **THEN** em nenhum momento do carregamento a página aparece no tema claro

### Requirement: Contraste legível nos dois temas
Em ambos os temas, o texto MUST atender ao contraste mínimo WCAG 2.1 nível AA em relação ao fundo (4.5:1 para texto normal, 3:1 para texto grande).

#### Scenario: Verificação de contraste
- **WHEN** a página é auditada quanto a contraste em tema claro e em tema escuro
- **THEN** nenhum texto fica abaixo do contraste mínimo AA
