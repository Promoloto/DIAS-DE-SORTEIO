# Padronização Visual dos Jogos Caixa: Trevo de 4 Corações e Cores Oficiais

Implementação da identidade visual oficial da Caixa Loterias em todos os botões e componentes do sistema, renderizando o trevo vetorial de 4 corações em cada modalidade e aplicando a paleta exata de cores de fundo, texto e contorno conforme o banner de referência.

## Decisões Confirmadas com o Usuário

> [!NOTE]
> **Status: Implementado com Sucesso**
> - **Lista de Jogos**: Mantidos os 10 jogos do banner oficial mais a **Loteria Federal**, totalizando 11 modalidades ativas.
> - **Trevo de 4 Corações em SVG**: Renderizado com traços e preenchimentos nas cores oficiais de cada jogo.
> - **Cores Oficiais Aplicadas**: Aplicado em todos os botões no modo "POR DIA", "POR JOGO", no cabeçalho do detalhe do jogo e na lista de configuração do Gerenciador de Dias de Sorteio.

---

## 1. Visão Geral & Conceito

Cada modalidade das Loterias Caixa possui uma identidade cromática e simbólica consagrada. O elemento central dessa identidade é o **trevo de 4 folhas formado por 4 corações estilizados** com as pontas unidas no centro.

Este plano define a criação de um gerador vetorial SVG para o trevo de 4 corações que se adapta parametricamente às cores de cada jogo, bem como a atualização dos estilos CSS/Tailwind dos botões para refletir com exatidão o material gráfico oficial enviado (Mega-Sena, Quina, Lotofácil, +Milionária, Dupla Sena, Lotomania, Timemania, Dia de Sorte, Loteca, Super Sete e Federal).

---

## 2. Experiência do Usuário & Design Visual

### A. Anatomia do Trevo de 4 Corações (Vetor SVG)
O ícone do trevo da Caixa é formado por 4 corações posicionados a 0°, 90°, 180° e 270° (ou 45°, 135°, 225°, 315°), convergindo para o centro com proporções harmoniosas:
- **Renderização SVG Nítida**: Geometria matemática com `<path>` de coração repetido por rotação angular precisa.
- **Coloração por Jogo**: Traços e preenchimentos personalizados respeitando a matriz gráfica de cada loteria (ex.: 3 corações brancos e 1 em destaque, ou cor sólida conforme a identidade de cada jogo).

### B. Mapeamento de Cores e Estilos dos 11 Jogos (Baseado no Banner)
| Jogo | Fundo do Botão | Cor do Texto | Efeito de Contorno / Sombra | Trevo de 4 Corações |
| :--- | :--- | :--- | :--- | :--- |
| **MEGA-SENA** | Verde Oficial (`#009e49`) | Branco (`#ffffff`) | Leve sombra para legibilidade | Verde e Branco |
| **QUINA** | Roxo/Índigo Profundo (`#261c6b`) | Branco (`#ffffff`) | Texto limpo de alto contraste | Roxo e Lilás |
| **LOTOFÁCIL** | Magenta/Pink Violeta (`#93126f`) | Branco (`#ffffff`) | Texto nítido em alto contraste | Magenta e Branco |
| **+ MILIONÁRIA** | Azul Marinho Caixa (`#1a2d5a`) | Laranja Vivo (`#f26f21`) | Letras em laranja vibrante | Laranja vibrante |
| **DUPLA SENA** | Vinho / Bordô (`#a51e39`) | Branco (`#ffffff`) | Alto contraste | Vinho e Rosé |
| **LOTOMANIA** | Laranja (`#f37324`) | Branco (`#ffffff`) | Alto contraste | Laranja e Branco |
| **DIA DE SORTE** | Amarelo Queimado / Ouro (`#faa61a`) | Branco (`#ffffff`) | Contorno/sombra marrom escuro | Branco e Marrom |
| **TIMEMANIA** | Amarelo Solar (`#feed01`) | Branco (`#ffffff`) | Contorno verde escuro (`#008e36`) | Verde e Branco |
| **LOTECA** | Vermelho Vivo (`#d81e28`) | Branco (`#ffffff`) | Alto contraste | Vermelho e Branco |
| **SUPER SETE** | Verde Lima / Pistache (`#94c11f`) | Branco (`#ffffff`) | Alto contraste | Verde Lima e Branco |
| **FEDERAL** | Azul Real (`#0066b3`) | Branco (`#ffffff`) | Alto contraste | Azul e Branco |

### C. Aplicação nos Componentes
1. **Modo "POR DIA" (Grade de Segunda a Sábado)**:
   - Os botões de cada jogo dentro das colunas dos dias passam a exibir o fundo na cor do jogo, o trevo de 4 corações correspondente alinhado à esquerda e o nome em letras maiúsculas legíveis.
2. **Modo "POR JOGO" (Filtro por Modalidade)**:
   - Cartões de filtro com o trevo em destaque, tamanho generoso para idosos e efeito táctil aprimorado.
3. **Painel de Detalhes do Jogo**:
   - Cabeçalho do modal/painel com o trevo oficial grande e as cores temáticas.
4. **Painel Administrativo (Gerenciador de Dias de Sorteio)**:
   - A lista de jogos no configurador exibe o trevo colorido correspondente ao lado de cada nome, incluindo a Loteca com seu sorteio padrão (Segunda-feira).

---

## 3. Decisões Técnicas & Trade-Offs

- **Geração de SVG Inline vs Imagens Externas**:
  - *Abordagem*: SVG vetorial gerado diretamente via código JavaScript (`getGameCloverSvg(gameName, size)`).
  - *Vantagem*: Zero dependência de arquivos externos que possam falhar, carregamento instantâneo, nitidez perfeita em qualquer resolução (celular, tablet, 4K) e possibilidade de colorir dinamicamente pétalas individuais.
- **Timemania e Dia de Sorte (Fundo Claro com Letra Branca)**:
  - *Abordagem*: Implementação de `text-stroke` / `drop-shadow` em CSS conforme o banner original da Caixa, garantindo que a letra branca se destaque com perfeição e contraste superior a 4.5:1.

---

## 4. Arquitetura Técnica & Fluxo de Dados

```
┌───────────────────────────────────────────────────────────────┐
│                    DEFINIÇÃO DOS JOGOS                        │
│  ALL_GAMES (11 jogos) & GAME_COLOR_CLASSES & SCHEDULE_DATA    │
└───────────────────────────────┬───────────────────────────────┘
                                │
                                ▼
┌───────────────────────────────────────────────────────────────┐
│              FUNÇÃO GERADORA DE TREVO SVG                     │
│               getGameCloverSvg(game, size)                    │
│   • 4 corações em rotação precisa (0°, 90°, 180°, 270°)       │
│   • Cores personalizadas de borda e miolo por jogo            │
└───────────────────────────────┬───────────────────────────────┘
                                │
        ┌───────────────────────┼───────────────────────┐
        ▼                       ▼                       ▼
┌───────────────┐       ┌───────────────┐       ┌───────────────┐
│  Modo POR DIA │       │ Modo POR JOGO │       │ Painel Admin  │
│ (renderTable) │       │ (renderGames) │       │   (Schedule)  │
└───────────────┘       └───────────────┘       └───────────────┘
```

---

## 5. Plano de Verificação

1. **Validação do Build**:
   - Executar `compile_applet` e `lint_applet` para assegurar integridade sintática e ausência de erros.
2. **Conferência Visual**:
   - Abrir o navegador com `playwright-cli` e capturar telas comparando:
     - Visualização dos botões no modo "POR DIA"
     - Visualização dos botões no modo "POR JOGO"
     - Visualização da tabela no Painel Administrativo com os 11 jogos
     - Nomes, fundos e trevos de cada uma das 11 modalidades em conformidade com o banner de referência.
