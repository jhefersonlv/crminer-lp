/* Fonte editorial da homepage. Nenhuma pauta é publicada automaticamente.
 * Para publicar: incluir conteúdo real, URL revisada e status: 'published'.
 * Temas: Captura, Conversão, Relacionamento.
 * Categorias: Na mídia, Aprenda, Cases, Parcerias, Novidades.
 * A homepage exibe até 3 itens; o botão revela os demais no mesmo componente.
 */
window.crmContents = {
  items: [
    {
      id: 'abioptica-programa-crminer',
      status: 'published',
      category: 'Na mídia',
      topic: 'Captura',
      title: 'Abióptica e CRMiner lançam programa para ajudar óticas a transformar intenção de compra em oportunidades de negócio',
      description: 'A parceria ajuda óticas associadas a identificar potenciais clientes e manter o relacionamento antes mesmo da conclusão da venda.',
      image: 'assets/contents/abioptica-crminer.png',
      imageAlt: 'Abióptica e CRMiner apresentam programa de captação estratégica para óticas',
      url: 'https://www.abioptica.com.br/abioptica-e-crminer-lancam-programa-para-ajudar-oticas-a-transformar-intencao-de-compra-em-oportunidades-de-negocio/'
    },
    {
      id: 'opticanet-programa-crminer',
      status: 'published',
      category: 'Na mídia',
      topic: 'Captura',
      title: 'Abióptica e CRMiner lançam programa especial para óticas associadas',
      description: 'O Portal Opticanet apresenta a iniciativa que ajuda óticas a identificar sinais de interesse antes da venda e acompanhar clientes em decisão.',
      image: 'assets/contents/opticanet-crminer.png',
      imageAlt: 'Publicação do Portal Opticanet sobre o programa CRMiner e Abióptica',
      url: 'https://opticanet.com.br/secao/lancamentos/abioptica-e-crminer-lancam-programa-especial-para-oticas-associadas/32117'
    },
    {
      id: 'crminer-instagram-reel-dcqvsa2xq8w',
      status: 'published',
      category: 'Na mídia',
      topic: 'Na mídia',
      title: 'CRMiner no Instagram',
      description: 'Confira este conteúdo do CRMiner no Instagram.',
      url: 'https://www.instagram.com/reels/DcQvSA2xq8w/'
    }
  ],
  // Exemplo exclusivo de desenvolvimento; nunca entra na lista pública.
  developmentExample: {
    id: 'placeholder-desenvolvimento',
    status: 'draft',
    placeholder: true,
    category: 'Aprenda',
    topic: 'Captura',
    title: '[PLACEHOLDER DE DESENVOLVIMENTO] Título do conteúdo',
    description: '[PLACEHOLDER DE DESENVOLVIMENTO] Resumo do conteúdo real.',
    url: ''
  }
};
