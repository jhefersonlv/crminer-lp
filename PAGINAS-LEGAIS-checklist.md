# Páginas legais (termos.html / privacidade.html / dpa.html) — checklist

> Criadas como **páginas prontas** (branco + logo crminer, CSS embutido, prontas pra abrir como iframe/modal). O conteúdo veio dos rascunhos do cofre (`Termos de Uso.md`, `Política de Privacidade.md`, `DPA — Anexo de Tratamento de Dados.md`).
>
> ⚠️ **ANTES DE PUBLICAR: validar todo o conteúdo com advogado(a)/DPO.** São rascunhos juridicamente não revisados.

## 1. Dados preenchidos nas páginas

- [x] **Razão social** — `CRMINER DATA INTELLIGENCE LTDA` · em `termos.html` (1.1) e `privacidade.html` (1.1)
- [x] **CNPJ** — `67.874.516/0001-36` · `termos.html` (1.1) e `privacidade.html` (1.1)
- [x] **E-mail de suporte** — `contato@crminer.com.br` · `termos.html` (3.2, 6.4, 12.3)
- [x] **Foro eleito** — Comarca da Capital do Estado de São Paulo · `termos.html` (12.2)
- [x] **Canal de privacidade** — `privacidade@crminer.com.br` · `privacidade.html` (10)
- [x] **Data de vigência** — 06/07/2026 · topo das páginas legais
- [x] **DPA / Anexo de Dados** — `dpa.html` criado e linkado nos Termos.
- [x] Conferir o ano do rodapé (`© 2026 crminer`) e a **Versão 1.0**.

## 2. Confirmar / validar com jurídico

- [ ] `privacidade@crminer.com.br` está **ativo** e responde (canal do Encarregado).
- [ ] **Limitação de responsabilidade** — `termos.html` 9.3 (limite de 12 meses): confirmar com advogado.
- [ ] **Transferência internacional** — `privacidade.html` §6: confirmar onde os dados são hospedados (ex.: Neon/EUA) e as cláusulas com o fornecedor.
- [ ] **Foro** — §12.2 dos Termos: confirmar comarca vs. foro do consumidor/domicílio.
- [ ] Retenção (24 meses / 5 anos de prova) e menores (18+) batem com a operação real.

## 3. Publicação e rotas

- [x] Definir as URLs finais: `crminer.com.br/termos`, `/privacidade` e `/anexo-de-dados` (arquivos locais: `termos.html`, `privacidade.html` e `dpa.html`).
- [x] **Linkar no rodapé do site** (`index.html`) para `/termos`, `/privacidade` e `/anexo-de-dados`.
- [ ] Apontar os links do **signup** (app) para estas páginas (gap #10/#11 do produto).

## 4. Embed como iframe/modal

- [x] As páginas são **auto-contidas** (CSS inline, sem JS) — abrem direto em `<iframe>`.
- [ ] Para embutir em **outro domínio** (ex.: `linkminer.app`), configurar no servidor o header **`Content-Security-Policy: frame-ancestors 'self' https://*.crminer.com.br https://linkminer.app`** (sem isso, o navegador pode bloquear o enquadramento).
- [ ] O **termo de consentimento por loja** (com nome da loja injetado) é outra página, servida pelo produto em `linkminer.app/{nomedocliente}/termo` — não está aqui (ver `Kit LGPD — Plano de Implementação` no cofre).

## 5. Manutenção

- [x] **Fonte única:** alterações sincronizadas com os `.md` do cofre (`Termos de Uso.md`, `Política de Privacidade.md`, `DPA — Anexo de Tratamento de Dados.md`).
- [x] Logo usado: `assets/logo/logo_black.png` (escuro sobre branco).
- [x] Conferir que não voltou nenhum "wordvirtua"/"orbit".
