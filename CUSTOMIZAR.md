# Como reutilizar este site para outro cliente

Este projeto é uma cópia idêntica do site da Gran Nardo. Para outro cliente, troque apenas o que está abaixo.

## 1. Dados do cliente (use Localizar e Substituir)

Termos para buscar em `index.html`, `js/main.js` e `css/style.css`:

| Buscar | O que é |
|---|---|
| `Gran Nardo` / `Grannardo` / `Grupo Nardo` | Nome da empresa (cerca de 80 ocorrências, quase todas em `index.html`) |
| `5544991082460` | WhatsApp (links do HTML e `js/main.js` linha ~459, no envio do formulário) |
| `(44) 99108-2460` / `+55 44 99108-2460` | Telefone exibido, `tel:` e Schema.org |
| `alnmaringa@gmail.com` | E-mail |
| `Av. São Judas Tadeu, 532` / `87023-200` / `Maringá` | Endereço |
| `-23.3941483` / `-51.938777` | Coordenadas (Schema.org) |
| `maps.app.goo.gl/...` e o `<iframe>` do mapa (`index.html` ~linhas 414, 438, 472) | Link "Traçar rota" e mapa embutido |
| `gruponardomaringa` / `gruponardo.com.br` / `grannardo.com.br` | Instagram e sites |
| `15 anos` / `mil projetos` / `desde 2009` | Números institucionais (inclui `js/main.js` linha 63) |

## 2. Textos que dependem do segmento

Mármores e granitos são o assunto de vários textos. Revise todas as seções: hero, manifesto, serviços (6 cards), materiais (6 itens), processo e Grupo Nardo.
Para um negócio que não seja marmoraria, também troque `<title>`, a meta description e as metatags Open Graph.

## 3. Imagens (`assets/img/`)

- `hero.jpg`, `about.jpg`
- `servicos/` (6), `materiais/` (6 — a "Nero Portoro" reutiliza `hero.jpg`) e `grupo/` (3)

Mantenha os mesmos nomes de arquivo ou ajuste os `src` no `index.html`. Atualize também os `alt`.

## 4. Visual

- **Cores:** variáveis no topo de `css/style.css` (`--bg`, `--gold`, `--ink` etc.). Trocar `--gold`, `--gold-2` e `--gold-deep` já muda a identidade.
- **Fontes:** `css/fonts.css` e `assets/fonts/`.
- **Favicon:** o SVG embutido na tag `<link rel="icon">`.

## 5. Antes de publicar

- Troque `og:image` por uma URL absoluta, por exemplo `https://SEU-USUARIO.github.io/SEU-REPO/assets/img/hero.jpg`. Com caminho relativo, a prévia social não aparece.
- Atualize o bloco JSON-LD (Schema.org) e adicione `og:url` e `canonical`.
- Teste o formulário e os botões de WhatsApp.
- No GitHub Pages, escolha a branch e a pasta `/ (root)`. O `.nojekyll` já está incluído.

## Rodar localmente

```bash
python3 -m http.server 8000
```
