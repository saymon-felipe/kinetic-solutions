// Conteúdo das páginas /privacidade e /termos. Dados da empresa em `company`.
export const company = {
  brand: 'KSI',
  brandFull: 'Kinetic Solutions',
  legalName: '69.925.748 SAYMON FELIPE DE LIMA',
  cnpj: '69.925.748/0001-00',
  address: 'Avenida Pedro Viriato Parigot de Souza, 885, Chácara Manella, Cambé/PR, CEP 86186-020',
  email: 'ksikineticsolutions@gmail.com',
  dpoName: 'Saymon Felipe de Lima',
  site: 'https://kineticsolutions.com.br',
  lastUpdate: '19 de novembro de 2026',
};

export type LegalSection = { title: string; paragraphs?: string[]; items?: string[] };
export type LegalDoc = { slug: 'privacidade' | 'termos'; title: string; description: string; intro: string; sections: LegalSection[] };

const c = company;
const who = `${c.brandFull} ("${c.brand}", "nós"), nome de fantasia de ${c.legalName}, inscrita no CNPJ sob o nº ${c.cnpj}, com sede na ${c.address}`;

export const privacy: LegalDoc = {
  slug: 'privacidade',
  title: 'Política de Privacidade',
  description: 'Como a Kinetic Solutions (KSI) coleta, usa e protege os dados pessoais de quem visita o site, fala conosco ou usa o blog.',
  intro: `Esta Política explica como tratamos dados pessoais no site ${c.site.replace('https://', '')} e nos canais de atendimento da ${c.brandFull}, em conformidade com a Lei Geral de Proteção de Dados (Lei nº 13.709/2018 – LGPD).`,
  sections: [
    {
      title: '1. Quem é o controlador dos dados',
      paragraphs: [
        `O controlador é a ${who}.`,
        `Encarregado pelo tratamento de dados pessoais (DPO): ${c.dpoName}, pelo e-mail ${c.email}.`,
      ],
    },
    {
      title: '2. Quais dados coletamos',
      paragraphs: ['Coletamos apenas o necessário para cada finalidade, nas situações abaixo:'],
      items: [
        'Formulário de contato e pedido de orçamento: nome, e-mail, telefone, tipo de solicitação e a mensagem que você escrever.',
        'Atendimento por WhatsApp (KSI e KSI TECH): seu número, nome de perfil, o conteúdo da conversa e, quando você informar, dados do equipamento, cidade e bairro para avaliar o atendimento.',
        'Login com Google no blog (KSI Lab): nome, e-mail e demais dados do perfil que você autorizar na tela de permissão do Google, usados para identificar você em comentários e curtidas.',
        'Interações no blog: comentários, curtidas e compartilhamentos associados à sua conta.',
        'Dados de navegação e métricas de uso: endereço IP, localização aproximada (país, estado e cidade, estimada a partir do IP), tipo de dispositivo, navegador, páginas visitadas, origem do acesso (parâmetros UTM), tempo na página, profundidade de rolagem, cliques e áreas da tela mais usadas.',
      ],
    },
    {
      title: '3. Para que usamos os dados e em que base legal',
      items: [
        'Responder contatos, elaborar orçamentos e prestar os serviços contratados — execução de contrato ou de procedimentos preliminares a pedido do titular (art. 7º, V, da LGPD).',
        'Manter sua conta e permitir comentários e curtidas no blog — execução de contrato e consentimento (art. 7º, I e V).',
        'Medir e melhorar o desempenho do site, a experiência de uso e a segurança contra abusos e fraudes — legítimo interesse (art. 7º, IX).',
        'Cumprir obrigações legais, fiscais e regulatórias e exercer direitos em processos — obrigação legal e exercício regular de direitos (art. 7º, II e VI).',
        'Enviar comunicações sobre novidades, somente quando você concordar, podendo revogar a qualquer momento — consentimento (art. 7º, I).',
      ],
    },
    {
      title: '4. Cookies e armazenamento no navegador',
      paragraphs: ['Usamos tecnologias de armazenamento no seu navegador para o funcionamento e a medição do site:'],
      items: [
        'Cookie de sessão de autenticação, criado quando você entra com sua conta Google no blog.',
        'Identificador de sessão de navegação (sessionStorage), usado em nossas métricas e apagado quando você fecha a aba.',
        'Preferência de idioma e posição de rolagem, guardadas no seu navegador (localStorage e sessionStorage).',
        'Google Analytics (Google Tag), que usa cookies para gerar estatísticas agregadas de audiência.',
      ],
    },
    {
      title: '5. Com quem compartilhamos',
      paragraphs: [
        'Não vendemos dados pessoais. Podemos compartilhá-los apenas com prestadores que nos ajudam a operar o serviço, sob contrato e para finalidades específicas:',
      ],
      items: [
        'Hospedagem e infraestrutura do site e da API.',
        'Google (login, Google Analytics e fontes tipográficas) e Meta (WhatsApp), conforme as próprias políticas de privacidade.',
        'Serviço de geolocalização por IP, usado para estimar a localização aproximada nas métricas.',
        'Autoridades públicas, quando houver obrigação legal ou ordem judicial.',
      ],
    },
    {
      title: '6. Transferência internacional',
      paragraphs: [
        'Alguns prestadores (como Google e Meta) podem tratar dados fora do Brasil. Nesses casos, adotamos fornecedores que oferecem garantias adequadas de proteção, conforme o art. 33 da LGPD.',
      ],
    },
    {
      title: '7. Por quanto tempo guardamos os dados',
      items: [
        'Mensagens de contato e orçamentos: pelo tempo necessário para atender você e, depois, pelos prazos legais aplicáveis.',
        'Conta e interações do blog: enquanto a conta estiver ativa ou até você pedir a exclusão.',
        'Métricas de navegação: pelo tempo necessário às análises de desempenho do site.',
        'Dados fiscais e contratuais: pelos prazos exigidos em lei.',
      ],
    },
    {
      title: '8. Seus direitos',
      paragraphs: [
        `Nos termos do art. 18 da LGPD, você pode, a qualquer momento, pedir: confirmação do tratamento; acesso; correção; anonimização, bloqueio ou eliminação de dados desnecessários; portabilidade; informação sobre compartilhamento; revogação do consentimento; e oposição a tratamentos feitos com base em legítimo interesse. Envie o pedido para ${c.email}. Responderemos em prazo razoável.`,
        'Você também pode reclamar à Autoridade Nacional de Proteção de Dados (ANPD).',
      ],
    },
    {
      title: '9. Segurança',
      paragraphs: [
        'Adotamos medidas técnicas e administrativas razoáveis para proteger os dados, como conexão criptografada (HTTPS), controle de acesso e restrição interna. Nenhum sistema é totalmente imune a incidentes; se ocorrer um que possa causar risco relevante, comunicaremos você e a ANPD, conforme a lei.',
      ],
    },
    {
      title: '10. Crianças e adolescentes',
      paragraphs: [
        'O site não é dirigido a menores de 18 anos e não coletamos intencionalmente seus dados. Se perceber que um menor nos enviou dados, fale com a gente para removê-los.',
      ],
    },
    {
      title: '11. Alterações desta Política',
      paragraphs: [
        `Podemos atualizar esta Política. A data da última revisão fica no topo da página (${c.lastUpdate}). Mudanças relevantes serão destacadas no site.`,
      ],
    },
    {
      title: '12. Contato',
      paragraphs: [`Dúvidas ou pedidos sobre seus dados: ${c.email}. ${c.legalName}, CNPJ ${c.cnpj}, ${c.address}.`],
    },
  ],
};

export const terms: LegalDoc = {
  slug: 'termos',
  title: 'Termos de Uso',
  description: 'Condições para usar o site da Kinetic Solutions (KSI), o blog KSI Lab e os canais de atendimento.',
  intro: `Estes Termos regem o uso do site ${c.site.replace('https://', '')}, do blog KSI Lab e dos canais de atendimento da ${c.brandFull}. Ao usar o site, você declara que leu e concorda com eles e com a nossa Política de Privacidade.`,
  sections: [
    {
      title: '1. Quem somos',
      paragraphs: [`O site é operado pela ${who}. Contato: ${c.email}.`],
    },
    {
      title: '2. O que oferecemos',
      items: [
        'Kinetic Solutions: consultoria e desenvolvimento de sites, aplicativos, sistemas e soluções digitais sob medida.',
        'KSI TECH: manutenção, formatação, otimização e pequenos reparos de computadores e notebooks em Londrina e região.',
        'KSI Lab: blog com artigos técnicos, em que usuários logados podem comentar e curtir.',
      ],
      paragraphs: ['As informações do site têm caráter informativo e não constituem proposta vinculante. Cada serviço é contratado após orçamento aprovado por você.'],
    },
    {
      title: '3. Orçamentos e contratação',
      items: [
        'O orçamento é combinado pelo WhatsApp, e-mail ou formulário e só começa a ser executado após a sua aprovação.',
        'Prazos, valores, escopo e forma de pagamento são os definidos no orçamento ou em contrato específico, que prevalece sobre estes Termos no que for diferente.',
        'No atendimento técnico de equipamentos, o diagnóstico e a possibilidade de visita dependem de avaliação. Recomendamos fazer backup antes de qualquer formatação; combinaremos com você o tratamento dos seus arquivos antes de agir.',
      ],
    },
    {
      title: '4. Conta e conduta no blog',
      items: [
        'O login é feito com sua conta Google; você é responsável pelo uso dela.',
        'É proibido publicar conteúdo ilegal, ofensivo, discriminatório, fraudulento, spam ou que viole direitos de terceiros.',
        'Você mantém a titularidade dos seus comentários e nos concede licença não exclusiva, gratuita, para exibi-los no blog. Podemos remover conteúdos que violem estes Termos e suspender contas em caso de abuso.',
        'É vedado tentar acessar áreas restritas, sobrecarregar a infraestrutura, fazer varredura automatizada abusiva ou explorar vulnerabilidades.',
      ],
    },
    {
      title: '5. Propriedade intelectual',
      paragraphs: [
        'Marcas, logotipos, textos, imagens, código e demais conteúdos do site pertencem à KSI ou a seus licenciantes e são protegidos pela legislação aplicável. É proibida a reprodução ou o uso comercial sem autorização prévia por escrito. Citações com indicação da fonte e do link são bem-vindas.',
        'Os direitos sobre projetos desenvolvidos para clientes seguem o contrato firmado com cada um.',
      ],
    },
    {
      title: '6. Links e serviços de terceiros',
      paragraphs: [
        'O site pode apontar para serviços de terceiros (como Google, WhatsApp, LinkedIn, Instagram e GitHub). Eles têm termos e políticas próprios, pelos quais não nos responsabilizamos.',
      ],
    },
    {
      title: '7. Disponibilidade e responsabilidade',
      paragraphs: [
        'Trabalhamos para manter o site no ar e correto, mas ele é oferecido “no estado em que se encontra”, sem garantia de funcionamento ininterrupto ou livre de erros. Na extensão permitida pela lei, não respondemos por danos indiretos decorrentes do uso do site ou de indisponibilidades fora do nosso controle. Nada nestes Termos exclui direitos garantidos ao consumidor pelo Código de Defesa do Consumidor.',
      ],
    },
    {
      title: '8. Privacidade',
      paragraphs: [
        'O tratamento de dados pessoais é descrito na Política de Privacidade, que integra estes Termos.',
      ],
    },
    {
      title: '9. Alterações',
      paragraphs: [
        `Podemos alterar estes Termos a qualquer momento. A versão vigente fica publicada nesta página com a data da última revisão (${c.lastUpdate}). O uso do site após a mudança indica a concordância com a nova versão.`,
      ],
    },
    {
      title: '10. Lei aplicável e foro',
      paragraphs: [
        'Estes Termos são regidos pelas leis da República Federativa do Brasil. Fica eleito o foro da comarca de Cambé/PR, ressalvado o direito do consumidor de propor ação no foro do seu domicílio.',
      ],
    },
    {
      title: '11. Contato',
      paragraphs: [`${c.legalName}, CNPJ ${c.cnpj}, ${c.address}. E-mail: ${c.email}.`],
    },
  ],
};
