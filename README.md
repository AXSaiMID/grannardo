# Gran Nardo — Mármores & Granitos

Site institucional cinematográfico da **Gran Nardo** (Grupo Nardo · Maringá/PR), com estética editorial escura + dourada no padrão dos sites premiados de arquitetura.

## Stack

- **HTML + CSS + JS** puros (sem build)
- **[Lenis](https://github.com/darkroomengineering/lenis)** — smooth scroll (vendored em `assets/vendor`)
- **[GSAP + ScrollTrigger](https://gsap.com/)** — animações (vendored)
- Fontes locais: **Marcellus**, **Cormorant Garamond**, **Archivo** (`assets/fonts`)
- Todas as imagens geradas sob medida (dark cinematic + veins dourados) em `assets/img`

## Recursos

- Preloader com contador e palavras rotativas
- Cursor customizado (dot + ring com estados `ver` / `deslize`)
- Lenis + GSAP ScrollTrigger sincronizados
- Hero com tipografia gigante, parallax e intro orquestrada
- Manifesto com revelação palavra a palavra (scrub) + contadores animados
- Serviços em **cards empilhados com sticky** (escala/dimming progressivo)
- Materiais em **scroll horizontal pinado** (desktop) / snap-scroll (mobile)
- Processo com coluna sticky
- Grupo Nardo com preview flutuante que segue o mouse
- Formulário → WhatsApp, mapa em modo escuro, botão flutuante de WhatsApp
- Botões magnéticos, grain animado, barra de progresso, menu fullscreen mobile
- Schema.org LocalBusiness, meta OG, `prefers-reduced-motion` respeitado

## Publicar / compartilhar

**Link de apresentação (CDN do próprio repo, versão atual):**
```
https://cdn.statically.io/gh/AXSaiMID/grannardo@ce2d8f808f4211edfbfb634322fde8b77e01ab50/index.html
```

**GitHub Pages (link permanente — ativar 1x, 30 segundos):**
1. Abra `Settings` → `Pages` no repositório
2. Em `Source`, escolha **Deploy from a branch**
3. Selecione a branch **`arena/01a0ad91-grannardo`** e a pasta **`/ (root)`** → `Save`
4. Em ~2 minutos o site estará em: **https://axsaimid.github.io/grannardo/**

Após fazer merge para a `main`, troque a branch do Pages para `main` (mesmo caminho acima).

## Rodar localmente

```bash
python3 -m http.server 8000
# ou
npx serve .
```

Abrir `http://localhost:8000`.

## Conteúdo

Dados reais coletados de [grannardo.com.br](https://grannardo.com.br) e [gruponardo.com.br](https://gruponardo.com.br):
endereço, telefone/WhatsApp, e-mail, Instagram, serviços, empresas do grupo e textos institucionais.
