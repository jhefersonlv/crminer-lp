# CRMiner Landing — Ideias de Design

> Referências analisadas em 2026-05-27. Não implementar nada sem alinhar.
> Fontes: Jack 3D Portfolio · Michael Smith Dark Portfolio · Aurora Sign Up · Icon Scroller · 404 Page · Mindloop Newsletter

---

## 1. Marquee scroll-driven (não auto-play)

**O que o Jack faz:** duas fileiras de imagens se movem horizontalmente
conforme o scroll — uma pra direita, outra pra esquerda. O deslocamento é
calculado em tempo real: `(scrollY - sectionTop + innerHeight) * 0.3`.

**Ideia CRMiner:** na seção *Segmentos* (atualmente marquee CSS infinito),
trocar pelo scroll-driven. Em vez de GIFs aleatórios, usar screenshots reais
do dashboard em diferentes segmentos — Ótica, Petshop, Barbearia, Clínica…
Fileira 1 vai pra direita conforme desce. Fileira 2 vai pra esquerda.
Resultado: parece que o sistema está "desfilando" enquanto o usuário lê.

**Impacto esperado:** muito mais interativo e surpreendente que o loop CSS.

---

## 2. Sticky stacking cards com scale-down (seção Módulos ou Features)

**O que o Jack faz:** 3 project cards ficam `position: sticky` e vão
"empilhando" com `scale` diminuindo (cada card escala 0.03 menos que o
anterior). O efeito é de deck de cartas acumulando.

**Ideia CRMiner:** usar nos 5 módulos principais (CRM, Financeiro, Agenda,
Estoque, Canais). Cada card sticky mostra:
- número grande (01–05)
- nome do módulo
- screenshot/mock do módulo em uso
- bullet list de 3 features

Conforme o usuário desce, os cards se empilham. Último card = IA Copiloto
com destaque especial.

**Obs:** requer que a seção tenha altura `n_cards * 100vh` pra dar espaço
pro scroll acionar cada card.

---

## 3. AnimatedText — texto que revela caractere por caractere no scroll

**O que o Jack faz:** cada caractere do parágrafo vai de `opacity: 0.2`
para `opacity: 1` conforme o scroll avança, criando a ilusão de que o
texto está sendo "digitado pelo scroll".

**Ideia CRMiner:** aplicar nas frases de maior impacto da landing:
- Hero: *"Do lead ao fechamento. Tudo em um lugar."*
- Problem section: *"Enquanto você usa 4 sistemas separados, seus clientes
  esperam."*
- CTA final: *"Comece hoje. Sem cartão. Sem TI."*

Não aplicar em textos longos — só nas frases âncora (~8–15 palavras).

---

## 4. Magnetic hover no device mockup do Hero

**O que o Jack faz:** a foto de perfil tem um efeito magnético — quando o
mouse se aproxima, o elemento é atraído suavemente para o cursor.
Retorna com curva ease-in-out ao sair.

**Ideia CRMiner:** aplicar no device mockup desktop do hero. Quando o
mouse entra na área, o mockup se inclina levemente em direção ao cursor
(combinando com o `rotateY` que já existe). Sensação de objeto 3D real
respondendo ao mouse.

**Implementação:** sobrepor ao transform 3D existente um delta sutil de
`translate3d` baseado na posição do mouse relativa ao centro do elemento.
Manter a animação de float (`device-float-desk`) rodando em paralelo.

---

## 5. Hero heading em viewport-width com gradiente

**O que o Jack faz:** `font-size: 17.5vw`, `font-weight: 900`, gradiente
de texto `#646973 → #BBCCD7`, `letter-spacing: -0.02em`, `leading-none`.
Texto ocupa toda a largura da tela criando impacto brutal.

**Ideia CRMiner:** o h1 atual já é grande. Ideia de variação:
- Linha 1: *"CRM"* — massivo, gradiente dark (ink → indigo)
- Linha 2: *"para quem"* — menor, cor sólida
- Linha 3: *"vende de verdade."* — médio, indigo vibrante

Ou simplesmente aumentar o h1 atual de `clamp(40px, 6.4vw, 64px)` para
`clamp(48px, 7.5vw, 96px)` e aplicar gradiente `var(--ink) → var(--indigo)`.

---

## 6. Seções com rounded-top e negative margin (efeito de sobreposição)

**O que o Jack faz:** a seção Services (fundo branco) tem
`border-radius: 60px 60px 0 0` e a Projects (fundo escuro) puxa por cima
com `margin-top: -14px`. Cria ilusão de layers empilhadas.

**Ideia CRMiner:** já existe algo parecido entre algumas seções, mas pode
ser mais agressivo. Específico para a transição entre:
- Segments (fundo cream) → Problem sections (fundo escuro) → Modules
- O border-radius grande (50-60px) deixa a transição mais "premium"

---

## 7. FadeIn sistemático com stagger por seção

**O que o Jack faz:** todos os elementos têm `whileInView` com `once: true`
e delay escalonado (`i * 0.1`). Nada aparece de uma vez — cada elemento
entra levemente depois do anterior.

**Ideia CRMiner:** o `reveal` class atual funciona com IntersectionObserver,
mas os delays são manuais via `data-delay`. Melhorar com stagger automático:
- Seção Módulos: cada card entra 80ms depois do anterior
- Seção Preços: cards entram em cascata (free → pro → enterprise)
- FAQ: itens revelam um a um com 60ms de intervalo

---

## 8. Número gigante como elemento decorativo nos cards

**O que o Jack faz:** nos service items e project cards, o número (01, 02…)
é exibido em `font-size: clamp(3rem, 10vw, 140px)`, `font-weight: 900`.
Serve como âncora visual e elemento decorativo ao mesmo tempo.

**Ideia CRMiner:** já existe nos ob-stepper e ob-step-content do onboarding.
Expandir para:
- Seção Módulos: número do módulo em grande como background do card
- Seção Preços: número do plano como elemento decorativo atrás do preço

---

---

---

# Referência 2 — Michael Smith Dark Portfolio
> Inter + Instrument Serif · GSAP + Framer Motion · HLS video · Glassmorphism pill nav

---

## 9. Segmento cycling no hero — "O CRM para {segmento}"

**O que o Michael faz:** a frase "A {role} lives in Chicago" tem a palavra
{role} trocando a cada 2s entre ["Creative", "Fullstack", "Founder"].
Usa `AnimatePresence mode="wait"` com `key={index}` — ao trocar a key, o
Framer Motion destrói e recria o elemento com animação `y: 20→0→-20`.

**Ideia CRMiner — ALTO POTENCIAL:** adaptar para o hero:
> *"O CRM para* **[Ótica]***."*

Palavras que ciclam: `["Ótica", "Petshop", "Barbearia", "Clínica", "Loja",
"Oficina", "Imobiliária", "E-commerce"]` — um novo segmento a cada 1.8s.
Palavra em destaque: `font-style: italic`, cor `var(--indigo)`, entrada
suave `y: 12→0, opacity: 0→1`.

Impacto: o visitante vê o próprio segmento na frase e se identifica
imediatamente. Muito mais eficiente que listar segmentos em chips.

---

## 10. Loading screen com counter e palavra rotativa

**O que o Michael faz:** antes da página carregar, tela preta com:
- Counter `000 → 100` em fonte grande (tabular-nums)
- Palavra rotativa centralizada: ["Design", "Create", "Inspire"]
- Barra de progresso com gradiente accent na parte inferior
- Duração: ~2.7s, depois dissolve e revela o site

**Ideia CRMiner:** usar na primeira visita (sessionStorage para não repetir):
- Counter `000 → 100`
- Frase central: *"CRM"* → *"Pipeline"* → *"Financeiro"* → *"Agenda"*
- Logo do CRMiner fade-in no centro enquanto o counter sobe
- Barra de progresso em `var(--indigo)`

Alternativa mais leve: só o logo com um fade de 1.2s e nenhum counter —
mais clean, menos intrusivo.

---

## 11. Navbar floating pill centrada

**O que o Michael faz:** a navbar não é full-width — é uma pílula
centralizada (`inline-flex`, `rounded-full`) com `backdrop-blur`,
`border border-white/10`. Flutua no topo com `position: fixed`.
Ao scrollar 100px, ganha `box-shadow`.

**Ideia CRMiner:** a navbar atual já é pill, mas se alinha à esquerda
dentro de `max-width: 960px`. Variante: centralizar completamente como o
Michael — sem container wide, a pílula fica suspensa no centro do viewport.
Funciona especialmente bem acima do hero com video/gradiente de fundo.

---

## 12. Gradient hover border ring nos botões CTA

**O que o Michael faz:** os botões CTA ("See Works", "Reach out") têm em
estado default bordas normais. No hover, aparece um `span` absoluto com
`inset: -2px; border-radius: inherit; background: accent-gradient` atrás
do botão — criando a ilusão de borda gradiente. Combina com `scale(1.05)`.

**Ideia CRMiner:** aplicar nos botões principais:
- Hero CTA "Quero testar grátis" → borda gradiente indigo→purple no hover
- CTA final → idem
- Navbar "Login" / "Começar" → versão sutil

Implementação: `position: relative` no botão + `::before` pseudo-element
com `background: linear-gradient(135deg, var(--indigo), #7D5DFF)`,
`border-radius: inherit`, `inset: -1.5px`, `z-index: -1`,
`opacity: 0 → 1` no hover. Sem JS necessário.

---

## 13. GSAP power3.out para entradas do hero

**O que o Michael faz:** em vez de CSS transitions ou Framer Motion,
usa GSAP timeline para as animações de entrada do hero:
- `.name-reveal`: `y: 50→0, opacity: 0→1, duration: 1.2s, ease: power3.out`
- `.blur-in`: `filter: blur(10px)→0, y: 20→0, stagger: 0.1, duration: 1s`

**Ideia CRMiner:** o hero atual usa `animation: nav-slide-in` e `reveal`
classes via IntersectionObserver. Uma GSAP timeline nas entradas do hero
(h1, subtítulo, device mockup, float cards) em sequência com `power3.out`
ficaria muito mais suave e cinematográfico.

```js
gsap.timeline({ delay: 0.2 })
  .from('.hero-eyebrow', { y: -20, opacity: 0, duration: 0.6 })
  .from('h1',            { y: 60, opacity: 0, duration: 1.0, ease: 'power3.out' }, '-=0.3')
  .from('.hero-lead',    { y: 30, opacity: 0, duration: 0.8 }, '-=0.5')
  .from('.device-desktop', { y: 40, opacity: 0, scale: 0.97, duration: 1.0 }, '-=0.6')
  .from('.float-card',  { y: 20, opacity: 0, stagger: 0.15 }, '-=0.4')
```

---

## 14. Bento grid assimétrico para módulos/features

**O que o Michael faz:** seção "Selected Works" usa
`grid-cols-12` com cards em spans alternados `7/5/5/7`.
Cards maiores ficam com imagem dominante, menores com mais texto.

**Ideia CRMiner:** substituir a seção de Módulos (lista vertical atual)
por um bento grid assimétrico:
- Card grande (col-span-7): Financeiro — com mini-gráfico animado
- Card médio (col-span-5): CRM — pipeline de leads
- Card médio (col-span-5): Agenda — calendário mini
- Card grande (col-span-7): IA Copiloto — screenshot do chat WhatsApp

Cada card tem hover com `scale(1.02)` + `backdrop-blur` + label aparecendo.

---

## 15. GSAP Marquee no footer — "DO LEAD AO FECHAMENTO •"

**O que o Michael faz:** no footer, um texto repete infinitamente usando
GSAP `xPercent: -50, duration: 40, ease: "none", repeat: -1`.
Texto: `"BUILDING THE FUTURE • "` repetido 10x.

**Ideia CRMiner:** substituir (ou complementar) o footer com:
> `"DO LEAD AO FECHAMENTO • SEM MANUAL • SEM TI • PRONTO EM MINUTOS • "`

Fonte grande (`clamp(3rem, 6vw, 7rem)`), `font-weight: 800`, uppercase,
cor `rgba(255,255,255,0.06)` sobre fundo escuro — decorativo, quase
invisível, mas dá profundidade ao footer.

---

## 16. Footer com video de fundo invertido (`scale-y: -1`)

**O que o Michael faz:** o footer usa o mesmo HLS video do hero, mas
com `transform: scaleY(-1)` — de cabeça pra baixo. Com overlay escuro
`bg-black/60`. Cria continuidade visual entre hero e footer sem usar
o mesmo clipe da mesma forma.

**Ideia CRMiner:** o video de fundo já existe na seção Segments. No footer,
reusar esse mesmo `.mp4` com `transform: scaleY(-1)` + overlay mais pesado.
Zero custo de assets extra, máximo impacto visual.

---

## 17. Halftone overlay em imagens/mocks

**O que o Michael faz:** sobre as imagens dos project cards, aplica um
`radial-gradient(circle, #000 1px, transparent 1px)` de 4×4px com
`opacity: 0.2` e `mix-blend-mode: multiply`. Efeito de meio-tom sutil
que dá textura "impressa" às fotos.

**Ideia CRMiner:** aplicar nos device mocks do hero (desktop + mobile)
como textura sutil. Ou nos thumbnails de módulos no bento grid.
CSS puro, zero JS, praticamente zero custo de performance.

```css
.mock-halftone::after {
  content: '';
  position: absolute;
  inset: 0;
  background-image: radial-gradient(circle, rgba(0,0,0,0.15) 1px, transparent 1px);
  background-size: 4px 4px;
  mix-blend-mode: multiply;
  pointer-events: none;
  border-radius: inherit;
}
```

---

## 18. Scroll indicator animado abaixo do hero

**O que o Michael faz:** centralizado no bottom do hero:
- Label `"SCROLL"` em `text-xs uppercase tracking-[0.2em] text-muted`
- Linha vertical `w-px h-10 bg-stroke`
- Highlight animado dentro da linha desce do topo ao fundo em loop (1.5s)

**Ideia CRMiner:** o hero atual não tem indicador de scroll. Adicionar
esse elemento discreto acima do `.hero` bottom padding. Sinaliza que
há mais conteúdo abaixo sem ser intrusivo.

---

---

---

# Referência 3 — Aurora Sign Up (two-column form)
> Inter · Framer Motion · Lucide · Tailwind v4 · video sem overlay

---

## 19. Login/Signup do CRMiner com two-column + video puro

**O que o Aurora faz:** layout 52%/48% — coluna esquerda tem um `<video>`
sem nenhum overlay ou gradiente sobre ele. Coluna direita tem o form.
O vídeo respira e domina visualmente sem ser abafado por camadas escuras.

**Ideia CRMiner:** a tela de login atual é simples (form centralizado).
Reformular com:
- **Esquerda (52%):** vídeo do sistema em uso (ou o mesmo MP4 da landing),
  sem overlay. No canto inferior: logo + "CRMiner" + frase curta.
- **Direita (48%):** form de login/cadastro limpo, fundo `#0B1426`
  (var(--ink)).

Resultado: quando o usuário chega na tela de login, a primeira coisa que
vê é o produto funcionando — não uma tela branca genérica.

---

## 20. Steps laterais durante o onboarding

**O que o Aurora faz:** na coluna esquerda do form de cadastro, exibe
3 steps com visual claro de ativo/inativo. Step ativo: `bg-white text-black`
com o número em círculo preto. Step inativo: `bg-[#1A1A1A]`, opacidade
reduzida. Passando de um step para o próximo, o estado visual muda.

**Ideia CRMiner — direto aplicável ao onboarding do sistema:**
O onboarding já tem 5 etapas. Na versão web (`/setup`), colocar os steps
na coluna esquerda com esse visual (ao invés do stepper atual):

```
● 1  Crie sua conta          ← ativo (branco)
○ 2  Perfil do negócio        ← inativo (cinza)
○ 3  Escolha os módulos
○ 4  Dashboard pronto
○ 5  IA ativada
```

Também serve para o **mock do onboarding na landing page** — substituir
o `.ob-stepper` atual por esse componente mais polido.

---

## 21. Brand gray (`#1A1A1A`) nos inputs de forms

**O que o Aurora faz:** os inputs não são brancos nem transparentes —
são `background: #1A1A1A` (quase preto, mas não igual ao fundo `#000`).
Sem border visível. `focus:ring-2 focus:ring-white/20`.
Placeholder em `text-white/20` (muito sutil). Label em `text-white` normal.

**Ideia CRMiner:** os campos do sistema atualmente usam fundo branco
(light mode). Nos mocks da landing (onboarding), aplicar essa lógica:
- Input background: `rgba(255,255,255,0.04)` (já usado) mas com
  `border: none` e apenas ring no focus — mais clean que borda sempre visível.
- O `.ob-input` atual tem borda `rgba(255,255,255,.08)` que some no fundo.
  O ring-on-focus do Aurora é mais legível.

---

## 22. `selection:bg-white/30` e micro-detalhes de polish

**O que o Aurora faz:** aplica `selection:bg-white/30` no elemento raiz.
Quando o usuário seleciona texto, o highlight é branco semi-transparente
ao invés do azul padrão do browser. Detalhe de 2 segundos que faz a
experiência parecer mais crafted.

**Outros micro-detalhes do Aurora que valem copiar:**
- `active:scale-[0.98]` no botão submit — pressionar o botão dá feedback
  físico de "clicado"
- `antialiased` global — já existe no CRMiner
- Divider "Ou" centralizado com `bg-black px-4` sobreposto na linha — 
  técnica CSS clássica mas muito limpa

**Ideia CRMiner:** adicionar ao `body` do sistema (word-web):
```css
::selection { background: rgba(79, 108, 255, 0.3); }
```
E no botão primário: `active:scale-[0.98] transition-transform`.

---

## 23. Social buttons no grid 2-col para login

**O que o Aurora faz:** botões de SSO (Google, GitHub) em grid `2 × 1`
com ícone + label. Fundo `bg-black border border-white/10 rounded-xl
hover:bg-white/5`. Visual muito mais clean que o estilo pill-com-logo
tradicional.

**Ideia CRMiner:** a tela de login do CRMiner pode ter:
- Botão Google OAuth em grid 2-col
- Ou outros provedores futuros
- Estilo: `border: 1px solid rgba(255,255,255,.08)`, fundo `var(--ink)`,
  hover `rgba(255,255,255,.04)`, ícone + texto.

---

---

---

---

# Referência 4 — 404 Page (navigation cards layout)
> Cards com ícone + subtitle · floatSlow em elementos decorativos · dashed border via gradient · gradient text fill em SVGs

---

## 25. Navigation cards com ícone + subtitle + hover lift

**O que a página faz:** a 404 exibe 2–4 cards de navegação no formato:
- Ícone centralizado (Material Symbol ou SVG) com gradiente de cor
- Título em 1–2 palavras
- Subtítulo descritivo em `text-sm text-muted`
- No hover: `translateY(-4px)` + `box-shadow` mais profundo — sensação de
  cartão levantando da mesa

**Ideia CRMiner:** aplicar na seção de Módulos (substituindo a lista simples)
ou como um "menu de funcionalidades" em alguma seção intermediária:
- **Ícone** (ex: pipeline icon) com fill gradiente `var(--indigo) → #7D5DFF`
- **Título:** "Pipeline de Vendas"
- **Subtítulo:** "Acompanhe cada lead do primeiro contato ao fechamento"
- Hover lift com sombra `0 16px 40px rgba(79,108,255,.18)`

Grid: `repeat(auto-fit, minmax(200px, 1fr))` para se adaptar de 2 a 4 colunas.

---

## 26. `floatSlow` animation em ícones decorativos

**O que a página faz:** o ícone ou elemento central da 404 (ex: uma nave
ou número 404 gigante) tem uma animação CSS chamada `floatSlow`:
```css
@keyframes floatSlow {
  0%, 100% { transform: translateY(0); }
  50%       { transform: translateY(-14px); }
}
.decorative-icon { animation: floatSlow 4s ease-in-out infinite; }
```
Movimento suave, sem bounce — apenas o sobe/desce lento que dá vida a um
elemento estático sem distrair o conteúdo principal.

**Ideia CRMiner:** aplicar em:
- Ícone decorativo do hero (além do device mockup que já flutua)
- Logotipo do WhatsApp na simulação do ob-mock 5
- Ícones decorativos de background nas seções Problem / Features
- Qualquer elemento ilustrativo que esteja estático demais

---

## 27. Dashed border via `background-image` gradient

**O que a página faz:** borda pontilhada/tracejada sem usar `border-style: dashed`
(que não aceita cores com opacidade). Técnica:
```css
.dashed-card {
  background-image: repeating-linear-gradient(
    90deg, rgba(255,255,255,.15) 0, rgba(255,255,255,.15) 6px,
    transparent 6px, transparent 12px
  ),
  repeating-linear-gradient(
    180deg, rgba(255,255,255,.15) 0, rgba(255,255,255,.15) 6px,
    transparent 6px, transparent 12px
  ),
  repeating-linear-gradient(
    90deg, rgba(255,255,255,.15) 0, rgba(255,255,255,.15) 6px,
    transparent 6px, transparent 12px
  ),
  repeating-linear-gradient(
    180deg, rgba(255,255,255,.15) 0, rgba(255,255,255,.15) 6px,
    transparent 6px, transparent 12px
  );
  background-size: 12px 1px, 1px 12px, 12px 1px, 1px 12px;
  background-position: top, right, bottom, left;
  background-repeat: repeat-x, repeat-y, repeat-x, repeat-y;
}
```

**Ideia CRMiner:** usar nos cards de pricing (fundo escuro, borda tracejada
sutil) ou nas seções de features com fundo escuro. Mais premium que `border: dashed`
e suporta opacidade arbitrária.

---

## 28. Gradient text fill em ícones SVG / Material Symbols

**O que a página faz:** ícones SVG recebem fill com gradiente em vez de cor
sólida. Técnica via `linearGradient` inline no SVG:
```html
<svg>
  <defs>
    <linearGradient id="icon-grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#4F6CFF"/>
      <stop offset="100%" stop-color="#7D5DFF"/>
    </linearGradient>
  </defs>
  <path fill="url(#icon-grad)" d="..."/>
</svg>
```
Ou via `background-clip: text` para ícones como texto (Material Symbols com
`font-family: Material Symbols Outlined`):
```css
.icon-gradient {
  background: linear-gradient(135deg, var(--indigo), #7D5DFF);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
```

**Ideia CRMiner:** aplicar nos ícones dos cards de módulos, nos ícones dos
feature bullets, ou no próprio logo CRMiner em contextos decorativos (hero
background, footer). Pequeno detalhe que eleva muito a percepção de qualidade.

---

## 29. Two-column card grid no fundo de seção

**O que a página faz:** logo abaixo do conteúdo principal da 404, uma grade
2×2 (ou 2×N) de cards menores oferece atalhos de navegação. Cada card:
- Menor que um card principal (`padding: 16px 20px`)
- `display: flex; align-items: center; gap: 12px`
- Ícone pequeno à esquerda + texto à direita
- Fundo `rgba(255,255,255,.04)`, borda `rgba(255,255,255,.08)`
- Hover: borda `rgba(79,108,255,.4)` + fundo `rgba(79,108,255,.08)`

**Ideia CRMiner:** usar na seção de Segmentos ou como "grid de entradas rápidas"
no final de uma seção de features, mostrando módulos secundários que não
ganharam card dedicado:
- Relatórios → Histórico completo de vendas
- API → Integre com qualquer ferramenta
- Multi-empresa → Gerencie mais de uma unidade
- Suporte → Chat, base de conhecimento, vídeos

---

---

---

---

# Referência 5 — Mindloop (newsletter platform)
> Fundo #000 contínuo · Liquid Glass · scroll word-reveal · vídeo com fade gradiente · fundo único que conecta tudo

---

## 30. Background único contínuo — "tudo conectado"

**O que o Mindloop faz:** a decisão de design mais importante do site é usar
`background: #000` em **todas** as seções sem exceção. Não há alternância
cream/ink/cream/ink. As seções se distinguem por bordas sutis (`border-t border-white/5`),
espaçamento e tipografia — não por mudança de cor de fundo.
O resultado: ao rolar, parece que você está passando por um único canvas
escuro, não "pulando entre blocos".

**Ideia CRMiner — ALTO POTENCIAL:**
A landing atual alterna: cream (hero) → ink (problem) → cream-ish (segments) →
ink (onboarding) → cream (pricing). Cada mudança de fundo é uma "pausa visual"
que fragmenta o ritmo.

Experimento a testar: converter a landing para fundo único `var(--ink)` em tudo
(ou `var(--cream)` em tudo no light-mode), e usar apenas bordas sutis e
espaçamento para separar seções. Resultado esperado: muito mais premium,
muito mais coeso. Combina diretamente com as ideias de overlay e vídeo abaixo.

**Atenção:** mudar o fundo geral exige rever contraste de todos os textos.
Fazer em branch separado antes de validar.

---

## 31. Vídeo com fade gradiente para o fundo — transição invisível entre seção e seção

**O que o Mindloop faz:** na seção hero, um vídeo cobre 100% da tela. Na borda
inferior do vídeo há um gradiente que faz o vídeo dissolver no fundo preto:
```css
.hero-video-fade {
  position: absolute;
  bottom: 0; left: 0; right: 0;
  height: 256px;  /* h-64 */
  background: linear-gradient(to top, #000000 0%, transparent 100%);
  pointer-events: none;
}
```
O vídeo "derrama" para o fundo ao invés de ter uma borda dura. O próximo
conteúdo começa no preto puro e parece emergir do vídeo.

**Ideia CRMiner:** o vídeo de fundo da seção Segments tem um corte brusco.
Aplicar esse gradiente na borda inferior **e** na borda superior (fade-in
também) para que a seção com vídeo "flutue" na página.

```css
.segments::before {
  content: '';
  position: absolute;
  inset: 0;
  background:
    linear-gradient(to bottom, var(--ink) 0%, transparent 18%),
    linear-gradient(to top,    var(--ink) 0%, transparent 18%);
  pointer-events: none;
  z-index: 1;
}
```

---

## 32. Liquid Glass Effect — classe CSS reutilizável

**O que o Mindloop faz:** todos os elementos "flutuantes" (botões de social,
form de email, alguns cards) usam uma classe `.liquid-glass` que cria o
efeito de vidro líquido com bordar gradiente via mask:

```css
.liquid-glass {
  background: rgba(255, 255, 255, 0.01);
  background-blend-mode: luminosity;
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
  border: none;
  box-shadow: inset 0 1px 1px rgba(255, 255, 255, 0.1);
  position: relative;
  overflow: hidden;
}
.liquid-glass::before {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: inherit;
  padding: 1.4px;
  background: linear-gradient(
    180deg,
    rgba(255,255,255,0.45) 0%,  rgba(255,255,255,0.15) 20%,
    rgba(255,255,255,0.00) 40%, rgba(255,255,255,0.00) 60%,
    rgba(255,255,255,0.15) 80%, rgba(255,255,255,0.45) 100%
  );
  -webkit-mask:
    linear-gradient(#fff 0 0) content-box,
    linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
  pointer-events: none;
}
```

O truque do `mask-composite: exclude` cria a borda gradiente sem afetar
o interior — só o padding de 1.4px da borda aparece com o gradiente.

**Ideia CRMiner:** adicionar `.liquid-glass` ao `styles.css` como classe utilitária.
Aplicar em:
- Botões secondary no hero ("Ver planos", "Ver demo")
- Cards de módulo com fundo escuro (`--ink-2`)
- O form de email/captura no hero (substitui o `border: 1px solid rgba(255,255,255,.1)` atual)
- Nav scrolled com `background: rgba(11,20,38,.82)` → complementar com liquid-glass

---

## 33. Scroll word-reveal — parágrafo revela palavra por palavra

**O que o Mindloop faz:** na seção Mission, um parágrafo longo (50+ palavras)
tem cada `<span>` de palavra com opacidade calculada com `useScroll + useTransform`
do Framer Motion. Quando a palavra entra na metade do viewport, vai de
`opacity: 0.15` para `opacity: 1`.

Em vanilla JS (sem React), a mesma lógica com IntersectionObserver + threshold
gradual + CSS custom properties:

```js
function initWordReveal(selector) {
  document.querySelectorAll(selector).forEach(el => {
    // quebra o texto em spans por palavra
    el.innerHTML = el.textContent
      .split(' ')
      .map((w, i) => `<span class="wr-word" style="--i:${i}">${w}</span>`)
      .join(' ');

    const words = el.querySelectorAll('.wr-word');
    const obs = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        entry.target.classList.toggle('wr-visible', entry.isIntersecting);
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -15% 0px' });

    words.forEach((w, i) => {
      obs.observe(w);
    });
  });
}
```

```css
.wr-word {
  opacity: 0.15;
  transition: opacity 0.4s ease calc(var(--i, 0) * 30ms);
  display: inline;
}
.wr-word.wr-visible { opacity: 1; }
```

**Ideia CRMiner — ALTO POTENCIAL:** aplicar nas frases âncora de maior impacto:
- Seção Problem: *"Enquanto você usa 4 sistemas separados, seus clientes esperam."*
- Seção AI: *"A IA do CRMiner observa seus dados o tempo todo e te avisa onde
  tem dinheiro escapando."*
- Hero subtitle (só em desktop — mobile não fica bem)

---

## 34. `fadeUp` helper — padrão de animação de entrada unificado

**O que o Mindloop faz:** em vez de escrever `initial/animate/whileInView`
repetido em cada elemento, define um helper centralizado:

```ts
const fadeUp = (delay: number) => ({
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-100px" },
  transition: { duration: 0.6, delay, ease: "easeOut" },
});
```

Em vanilla JS (sem React/Framer), o equivalente com IntersectionObserver
e CSS já existe na landing como `.reveal` + `data-delay`. A padronização
importa: garantir que **todos** os elementos da landing usem os mesmos
valores de `duration`, `y`, e `ease`.

**Ideia CRMiner — fácil de implementar agora:**
Auditar os elementos com `reveal` + `data-delay` e verificar se todos usam
as mesmas variáveis de `transition-duration` e `transform` em `:root`.
Atualmente pode haver inconsistências entre seções. Padronizar para:
- `transition: opacity 0.6s ease, transform 0.6s ease`
- `transform: translateY(20px) → translateY(0)`
- Delays: `0, 0.1s, 0.2s, 0.3s` (e não 0, 1, 2, 3 como `data-delay` multiplica)

---

## 35. Seções conectadas por vídeos temáticos intermediários

**O que o Mindloop faz:** usa **4 vídeos diferentes** em seções diferentes
da mesma página (Hero, Mission, Solution, CTA) todos com o mesmo estilo
visual (escuro, atmosférico). Cada seção tem seu próprio vídeo mas todos
compartilham a mesma estética, criando uma narrativa visual contínua.

**Ideia CRMiner:** a landing tem 1 vídeo usado em algumas seções. Ideia de expansão:
- **Hero:** vídeo atual do dashboard (já existe)
- **Problem section:** vídeo curto de alguém gerenciando 4 abas diferentes
  (ilustra o caos) — fundo escuro, enquadramento próximo
- **CTA final:** vídeo atmosférico tipo "pôr do sol / luz de escritório" —
  energia de encerramento positivo

Sem adicionar novos ativos: reusar o vídeo atual com `object-position`
diferente em cada seção para que pareça uma tomada diferente.

---

## Prioridade sugerida de implementação (consolidado)

| # | Ideia | Origem | Esforço | Impacto |
|---|-------|--------|---------|---------|
| 9 | Segmento cycling no hero | Michael | Baixo | ⭐⭐⭐⭐⭐ |
| 1 | Scroll-driven marquee nos segmentos | Jack | Médio | ⭐⭐⭐⭐⭐ |
| 2 | Sticky stacking cards nos módulos | Jack | Alto | ⭐⭐⭐⭐⭐ |
| 14 | Bento grid assimétrico para módulos | Michael | Alto | ⭐⭐⭐⭐⭐ |
| 12 | Gradient hover border ring nos CTAs | Michael | Baixo | ⭐⭐⭐⭐ |
| 13 | GSAP power3.out entradas hero | Michael | Médio | ⭐⭐⭐⭐ |
| 3 | AnimatedText nas frases âncora | Jack | Baixo | ⭐⭐⭐⭐ |
| 4 | Magnetic hover no device hero | Jack | Médio | ⭐⭐⭐⭐ |
| 15 | GSAP Marquee no footer | Michael | Baixo | ⭐⭐⭐ |
| 16 | Footer com video invertido | Michael | Baixo | ⭐⭐⭐ |
| 10 | Loading screen | Michael | Médio | ⭐⭐⭐ |
| 17 | Halftone overlay nos mocks | Michael | Baixo | ⭐⭐⭐ |
| 18 | Scroll indicator no hero | Michael | Baixo | ⭐⭐ |
| 11 | Navbar pill centrada | Michael | Baixo | ⭐⭐ |
| 5 | Hero h1 maior com gradiente | Jack | Baixo | ⭐⭐⭐ |
| 6 | Rounded-top agressivo entre seções | Jack | Baixo | ⭐⭐⭐ |
| 7 | Stagger sistemático nos reveals | Jack | Baixo | ⭐⭐⭐ |
| 8 | Número decorativo nos cards | Jack | Baixo | ⭐⭐ |
| 19 | Login two-column com video puro | Aurora | Médio | ⭐⭐⭐⭐⭐ |
| 20 | Steps laterais no onboarding | Aurora | Baixo | ⭐⭐⭐⭐ |
| 22 | selection + active:scale + micro-polish | Aurora | Baixo | ⭐⭐⭐⭐ |
| 21 | Brand gray inputs (ring-on-focus) | Aurora | Baixo | ⭐⭐⭐ |
| 23 | Social buttons 2-col no login | Aurora | Baixo | ⭐⭐⭐ |
| 24 | Chips de segmentos como pílulas com hover gradiente | Icon Scroller | Baixo | ⭐⭐⭐⭐ |
| 25 | Navigation cards com ícone + subtitle + hover lift | 404 Page | Baixo | ⭐⭐⭐⭐ |
| 26 | `floatSlow` animation em ícones decorativos | 404 Page | Baixo | ⭐⭐⭐ |
| 27 | Dashed border via background-image gradient | 404 Page | Baixo | ⭐⭐⭐ |
| 28 | Gradient text fill em ícones SVG/Material | 404 Page | Baixo | ⭐⭐⭐ |
| 29 | Two-column card layout no fundo de seção | 404 Page | Baixo | ⭐⭐⭐ |
| 30 | Background único contínuo — tudo conectado | Mindloop | Médio | ⭐⭐⭐⭐⭐ |
| 31 | Vídeo com fade gradiente → transição invisível | Mindloop | Baixo | ⭐⭐⭐⭐⭐ |
| 32 | Liquid Glass Effect — classe `.liquid-glass` | Mindloop | Baixo | ⭐⭐⭐⭐ |
| 33 | Scroll word-reveal — palavra por palavra | Mindloop | Médio | ⭐⭐⭐⭐⭐ |
| 34 | `fadeUp` helper — animações de entrada unificadas | Mindloop | Baixo | ⭐⭐⭐⭐ |
| 35 | Vídeos temáticos por seção — narrativa visual | Mindloop | Alto | ⭐⭐⭐ |
