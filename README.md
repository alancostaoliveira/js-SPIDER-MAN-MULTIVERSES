# Spider-Man Multiverses

Site estático em HTML, CSS e JavaScript inspirado no multiverso do Spider-Man. O projeto reúne uma home com carrossel de personagens, páginas internas dedicadas a cada ator e um menu off-canvas responsivo para dispositivos móveis.

## Visão geral

- Home com carrossel de cards para Tobey Maguire, Tom Holland e Andrew Garfield.
- Páginas internas com galerias, vídeos e navegação entre filmes.
- Layout responsivo para desktop e mobile.
- Melhorias de acessibilidade com foco em teclado, ARIA e menu modal.
- Ajustes de performance como carregamento preguiçoso de imagens.

## Estrutura

```text
index.html
assets/
  css/
  images/
  scripts/
  videos/
pages/
devtools/
```

## Como executar

O projeto não usa build step. Você pode abrir com um servidor local, como o Live Server do VS Code.

### Opção 1: Live Server

1. Abra a pasta do projeto no VS Code.
2. Clique com o botão direito em `index.html`.
3. Selecione `Open with Live Server`.

### Opção 2: servidor simples

```bash
python -m http.server 5500
```

Depois acesse:

```text
http://127.0.0.1:5500
```

## Acessibilidade

O projeto inclui:

- navegação off-canvas com botão acessível;
- `aria-expanded`, `aria-controls`, `role="dialog"` e `aria-modal="true"` no menu;
- foco preso dentro do menu quando aberto;
- retorno do foco ao botão de origem ao fechar;
- imagens com `loading="lazy"`.

## Auditoria automática

Existe um runner local em `devtools/` para executar o `axe-core` via Puppeteer.

```bash
cd devtools
npm install
npm run axe
```

O relatório é gerado em `devtools/axe-report.json`.

## Navegação principal

- `index.html` - página inicial
- `pages/tobey-maguire/` - páginas do Tobey Maguire
- `pages/tom-holland/` - páginas do Tom Holland
- `pages/andrew-garfield/` - páginas do Andrew Garfield

## Observação

Alguns caminhos de mídia usam nomes e pastas herdados do material original. Se você reorganizar os arquivos, revise os links HTML, CSS e JavaScript para evitar 404s.
