import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

export const languages = [
  { code: 'pt-BR', label: 'PT' },
  { code: 'en', label: 'EN' },
  { code: 'es', label: 'ES' },
] as const;

const pt = {
  nav: {
    services: 'Serviços',
    portfolio: 'Portfólio',
    differentials: 'Diferenciais',
    about: 'Sobre',
    budget: 'Orçamento',
    signIn: 'Entrar',
    signOut: 'Sair',
    language: 'Idioma',
    menuOpen: 'Abrir menu',
    menuClose: 'Fechar menu',
    profile: 'Perfil',
    new: 'NOVO',
    signInGoogle: 'Entrar com Google',
    signOutAccount: 'Sair da conta',
    authFailed: 'Falha ao autenticar.',
  },
  hero: {
    headline: 'FORÇA DA INOVAÇÃO. IDEIAS DO FUTURO.',
    quote: 'ORÇAMENTO GRATUITO',
    clients: 'VER CLIENTES',
    scroll: 'Role para explorar',
  },
  services: {
    badge: 'SOLUÇÕES SOB MEDIDA',
    title: 'Nossos',
    titleAccent: 'Serviços',
    subtitle:
      'Tecnologia de ponta e metodologia ágil para construir produtos digitais robustos, velozes e prontos para o futuro.',
    request: 'Solicitar este serviço',
    items: [
      {
        title: 'Sistemas & Aplicações Web',
        description:
          'Desenvolvimento de ERPs sob medida, portais corporativos, plataformas SaaS e sites de altíssimo desempenho.',
        features: [
          'ERPs & Dashboards',
          'Arquitetura Escalável',
          'APIs REST & GraphQL',
          'Segurança de Ponta',
        ],
      },
      {
        title: 'Aplicativos Mobile',
        description:
          'Criação de aplicativos para iOS e Android com experiência fluida, sincronização offline e integração completa.',
        features: [
          'iOS & Android Nativo/Híbrido',
          'UI/UX Fluido',
          'Notificações Push',
          'Integração com APIs',
        ],
      },
      {
        title: 'Cloud & Consultoria Técnica',
        description:
          'Otimização de infraestrutura em nuvem, modernização de código legado, microsserviços e auditoria de performance.',
        features: [
          'AWS & Google Cloud',
          'CI/CD & DevOps',
          'Microsserviços & Bancos',
          'Auditoria de Performance',
        ],
      },
      {
        title: 'Design UI/UX & Prototipagem',
        description:
          'Construção de identidades visuais e interfaces modernas, intuitivas e focadas na retenção e conversão de clientes.',
        features: [
          'Design Systems',
          'Prototipagem Interativa',
          'Testes de Usabilidade',
          'Foco em Conversão',
        ],
      },
    ],
  },
  portfolio: {
    badge: 'CASOS DE SUCESSO & PROJETOS',
    title: 'Nossos',
    titleAccent: 'Trabalhos',
    subtitle:
      'Explore sistemas, aplicativos e plataformas desenvolvidos com foco em alta performance, usabilidade e resultados comerciais.',
    all: 'Todos',
    projects: 'projetos',
    previous: 'Projeto anterior',
    next: 'Próximo projeto',
    zoomPreview: 'Ampliar prévia',
    zoomImage: 'Ampliar imagem',
    details: 'Ver detalhes',
    visit: 'Acessar',
    visitTitle: 'Visitar projeto em produção',
    loadError: 'Não foi possível carregar os projetos agora.',
    empty: 'Nenhum projeto encontrado nesta categoria.',
    loadingTitle: 'Carregando projetos',
    loadingMessage: 'Organizando os cases e plataformas desenvolvidas...',
    goTo: 'Ir para o projeto {{number}}',
  },
  differentials: {
    badge: 'POR QUE A KINETIC SOLUTIONS',
    title: 'Engenharia Digital Que',
    titleAccent: 'Gera Resultados',
    subtitle:
      'Combinamos precisão técnica, design moderno e estratégia de negócios para construir plataformas que impulsionam empresas.',
    items: [
      {
        title: 'Performance & Velocidade',
        description:
          'Aplicações ultra-rápidas desenvolvidas com tecnologias modernas, otimizadas para carregamento instantâneo e máxima retenção.',
        badge: 'Máxima Eficiência',
      },
      {
        title: 'Design Focado em Conversão',
        description:
          'Interfaces intuitivas e elegantes criadas para encantar usuários, guiar a navegação e transformar visitantes em clientes.',
        badge: 'UX / UI Estratégico',
      },
      {
        title: 'Arquitetura Robusta & Segura',
        description:
          'Sistemas estruturados para crescer com o seu negócio, garantindo segurança de dados, alta disponibilidade e código limpo.',
        badge: 'Pronto para Escalar',
      },
      {
        title: 'Suporte & Evolução Contínua',
        description:
          'Acompanhamento próximo em todas as etapas, desde a concepção e lançamento até novas funcionalidades e melhorias contínuas.',
        badge: 'Parceria Estratégica',
      },
    ],
    metrics: [
      'Projetos & Sistemas',
      'Uptime & Estabilidade',
      'Soluções Sob Medida',
      'Entregas Contínuas',
    ],
    agile: 'Ágil',
  },
  founder: {
    badge: 'LIDERANÇA & VISÃO TÉCNICA',
    role: 'Fundador & Arquiteto de Software',
    bio: 'Com sólida experiência em engenharia de software e desenvolvimento de plataformas escaláveis, Saymon Felipe lidera a Kinetic Solutions (KSI) com a missão de construir soluções tecnológicas que aliam alta performance de código, arquitetura limpa e design focado no usuário final.',
    highlights: [
      'Arquitetura de Sistemas & Cloud',
      'Desenvolvimento Full Stack & Mobile',
      'Design de Produtos & UX de Conversão',
    ],
    quote:
      '“Sua visão nos move, nossa expertise te guia. Entregamos soluções dinâmicas para o ritmo do seu negócio, garantindo a solidez que você precisa para crescer com segurança.”',
    linkedin: 'Conectar no LinkedIn',
    imageAlt: 'Saymon Felipe — fundador da Kinetic Solutions',
    availability: 'Disponível para novos projetos e consultorias',
  },
  contact: {
    badge: 'Inicie seu projeto',
    title: 'Fale conosco',
    subtitle:
      'Conte-nos sobre sua ideia ou desafio técnico. Nossa equipe responderá rapidamente com uma proposta personalizada.',
    name: 'Nome completo *',
    namePlaceholder: 'Seu nome ou da sua empresa',
    email: 'E-mail corporativo *',
    emailPlaceholder: 'seuemail@empresa.com',
    phone: 'Telefone / WhatsApp',
    phonePlaceholder: '(00) 00000-0000',
    service: 'Serviço de interesse',
    selectService: 'Selecione um serviço',
    details: 'Detalhes do projeto *',
    detailsPlaceholder:
      'Fale um pouco sobre o que precisa, prazo estimado e objetivos...',
    send: 'Enviar solicitação',
    sending: 'Enviando mensagem...',
    success: 'Mensagem enviada com sucesso! Entraremos em contato em breve.',
    error:
      'Houve um erro ao enviar. Por favor, tente novamente ou use o WhatsApp direto.',
    infoTitle: 'Vamos tirar sua ideia do papel?',
    infoDescription:
      'Preencha o formulário para uma análise técnica detalhada do seu projeto, ou escolha um dos canais diretos abaixo.',
    whatsapp: 'WhatsApp direto',
    whatsappDescription: 'Atendimento ágil em tempo real',
    commercialEmail: 'E-mail comercial',
    responseTime: 'Tempo de resposta',
    responseTimeDescription: 'Em até 2 horas úteis',
    guarantee: 'Orçamento 100% gratuito e sem compromisso',
    whatsappMessage:
      'Olá! Vim através do site da Kinetic Solutions e gostaria de solicitar um orçamento para um projeto.',
    services: [
      'Sistemas & Aplicações Web (ERP / SaaS)',
      'Aplicativos Mobile (iOS / Android)',
      'Cloud & Consultoria Técnica',
      'Design UI/UX & Prototipagem',
      'Outro projeto personalizado',
    ],
  },
  lab: {
    title: 'KSI LAB | Laboratório de Inovações & Pesquisa Tech',
    description:
      'Artigos técnicos, pesquisas em inteligência artificial, engenharia de software e tendências digitais pela Kinetic Solutions.',
    subtitle: 'Inovações, pesquisas avançadas e o futuro do desenvolvimento.',
    search: 'Pesquisar artigos, temas ou tecnologias...',
    all: 'Todos',
    loadingTitle: 'Preparando o Lab',
    loadingMessage:
      'Estamos buscando os artigos e organizando as ideias para você.',
    noArticles: 'Nenhum artigo encontrado',
    noSearch:
      'Não encontramos publicações para "{{query}}". Tente outros termos.',
    noCategory: 'Nenhum artigo publicado nesta categoria no momento.',
    fallbackCategory: 'Inovação',
    fallbackDescription:
      'Clique para ler este artigo completo no nosso laboratório de inovações...',
    team: 'Equipe KSI',
    readFull: 'Ler artigo completo',
    read: 'Ler artigo',
    readTime: '{{minutes}} min de leitura',
    back: 'Voltar para o Lab',
    views: 'visualizações',
    like: 'Curtir artigo',
    share: 'Compartilhar artigo',
    shareAction: 'Compartilhar',
    comments: 'Comentários ({{count}})',
    commentPlaceholder:
      'Compartilhe seus insights, dúvidas ou considerações sobre este artigo...',
    publishing: 'Publicando...',
    publish: 'Publicar comentário',
    commentError: 'Erro ao publicar comentário.',
    commenter: 'Participando como leitor credenciado',
    join: 'Participe da conversa',
    loginPrompt:
      'Faça login com sua conta Google para comentar e interagir com o autor e a comunidade.',
    loginGoogle: 'Entrar com o Google',
    loginSuccess: 'Login realizado com sucesso!',
    loginError: 'Erro ao fazer login.',
    likeThanks: 'Obrigado pelo seu feedback!',
    likeError: 'Erro ao processar a curtida.',
    copied: 'Link copiado para a área de transferência!',
    commentSent: 'Comentário enviado!',
    opening: 'Abrindo o artigo',
    openingMessage: 'Carregando conteúdo, imagem e interações do post.',
    emptyComments:
      'Nenhum comentário publicado ainda. Seja o primeiro a iniciar a discussão!',
  },
  footer: { rights: 'TODOS OS DIREITOS RESERVADOS.' },
};

const en = {
  nav: {
    services: 'Services',
    portfolio: 'Portfolio',
    differentials: 'Advantages',
    about: 'About',
    budget: 'Get a quote',
    signIn: 'Sign in',
    signOut: 'Sign out',
    language: 'Language',
    menuOpen: 'Open menu',
    menuClose: 'Close menu',
    profile: 'Profile',
    new: 'NEW',
    signInGoogle: 'Sign in with Google',
    signOutAccount: 'Sign out',
    authFailed: 'Sign-in failed.',
  },
  hero: {
    headline: 'THE POWER OF INNOVATION. IDEAS FOR THE FUTURE.',
    quote: 'FREE QUOTE',
    clients: 'VIEW CLIENTS',
    scroll: 'Scroll to explore',
  },
  services: {
    badge: 'TAILORED SOLUTIONS',
    title: 'Our',
    titleAccent: 'Services',
    subtitle:
      'Cutting-edge technology and agile methods to build robust, fast digital products ready for the future.',
    request: 'Request this service',
    items: [
      {
        title: 'Web Systems & Applications',
        description:
          'Custom ERPs, corporate portals, SaaS platforms, and high-performance websites.',
        features: [
          'ERPs & Dashboards',
          'Scalable Architecture',
          'REST & GraphQL APIs',
          'Advanced Security',
        ],
      },
      {
        title: 'Mobile Apps',
        description:
          'iOS and Android applications with smooth experiences, offline sync, and complete integration.',
        features: [
          'Native/Hybrid iOS & Android',
          'Smooth UI/UX',
          'Push Notifications',
          'API Integration',
        ],
      },
      {
        title: 'Cloud & Technical Consulting',
        description:
          'Cloud infrastructure optimization, legacy-code modernization, microservices, and performance audits.',
        features: [
          'AWS & Google Cloud',
          'CI/CD & DevOps',
          'Microservices & Databases',
          'Performance Audits',
        ],
      },
      {
        title: 'UI/UX Design & Prototyping',
        description:
          'Visual identities and modern, intuitive interfaces designed for customer retention and conversion.',
        features: [
          'Design Systems',
          'Interactive Prototyping',
          'Usability Testing',
          'Conversion Focus',
        ],
      },
    ],
  },
  portfolio: {
    badge: 'SUCCESS STORIES & PROJECTS',
    title: 'Our',
    titleAccent: 'Work',
    subtitle:
      'Explore systems, apps, and platforms built for high performance, usability, and business outcomes.',
    all: 'All',
    projects: 'projects',
    previous: 'Previous project',
    next: 'Next project',
    zoomPreview: 'Zoom preview',
    zoomImage: 'Zoom image',
    details: 'View details',
    visit: 'Visit',
    visitTitle: 'Visit live project',
    loadError: 'We could not load the projects right now.',
    empty: 'No projects found in this category.',
    loadingTitle: 'Loading projects',
    loadingMessage: 'Organizing our cases and platforms...',
    goTo: 'Go to project {{number}}',
  },
  differentials: {
    badge: 'WHY KINETIC SOLUTIONS',
    title: 'Digital Engineering That',
    titleAccent: 'Delivers Results',
    subtitle:
      'We combine technical precision, modern design, and business strategy to build platforms that move companies forward.',
    items: [
      {
        title: 'Performance & Speed',
        description:
          'Ultra-fast applications built with modern technologies and optimized for instant loading and maximum retention.',
        badge: 'Maximum Efficiency',
      },
      {
        title: 'Conversion-Focused Design',
        description:
          'Intuitive, elegant interfaces created to delight users, guide navigation, and turn visitors into customers.',
        badge: 'Strategic UX / UI',
      },
      {
        title: 'Robust & Secure Architecture',
        description:
          'Systems structured to grow with your business, ensuring data security, high availability, and clean code.',
        badge: 'Ready to Scale',
      },
      {
        title: 'Continuous Support & Evolution',
        description:
          'Close support at every stage, from conception and launch to new features and ongoing improvements.',
        badge: 'Strategic Partnership',
      },
    ],
    metrics: [
      'Projects & Systems',
      'Uptime & Stability',
      'Tailored Solutions',
      'Continuous Deliveries',
    ],
    agile: 'Agile',
  },
  founder: {
    badge: 'LEADERSHIP & TECHNICAL VISION',
    role: 'Founder & Software Architect',
    bio: 'With solid experience in software engineering and scalable-platform development, Saymon Felipe leads Kinetic Solutions (KSI) with the mission of building technology solutions that combine high-performance code, clean architecture, and user-centered design.',
    highlights: [
      'Systems & Cloud Architecture',
      'Full Stack & Mobile Development',
      'Product Design & Conversion UX',
    ],
    quote:
      '“Your vision moves us; our expertise guides you. We deliver dynamic solutions for the pace of your business, with the solidity you need to grow safely.”',
    linkedin: 'Connect on LinkedIn',
    imageAlt: 'Saymon Felipe — founder of Kinetic Solutions',
    availability: 'Available for new projects and consulting',
  },
  contact: {
    badge: 'Start your project',
    title: 'Talk to us',
    subtitle:
      'Tell us about your idea or technical challenge. Our team will quickly reply with a tailored proposal.',
    name: 'Full name *',
    namePlaceholder: 'Your name or company name',
    email: 'Business email *',
    emailPlaceholder: 'you@company.com',
    phone: 'Phone / WhatsApp',
    phonePlaceholder: '+00 000 000 000',
    service: 'Service of interest',
    selectService: 'Select a service',
    details: 'Project details *',
    detailsPlaceholder:
      'Tell us what you need, the estimated timeline and goals...',
    send: 'Send request',
    sending: 'Sending message...',
    success: 'Message sent successfully! We will be in touch shortly.',
    error:
      'We could not send your message. Please try again or contact us on WhatsApp.',
    infoTitle: 'Ready to bring your idea to life?',
    infoDescription:
      'Complete the form for a detailed technical review of your project, or choose one of the direct channels below.',
    whatsapp: 'Direct WhatsApp',
    whatsappDescription: 'Fast, real-time support',
    commercialEmail: 'Business email',
    responseTime: 'Response time',
    responseTimeDescription: 'Within 2 business hours',
    guarantee: '100% free, no-obligation quote',
    whatsappMessage:
      'Hello! I found Kinetic Solutions through the website and would like a quote for a project.',
    services: [
      'Web Systems & Applications (ERP / SaaS)',
      'Mobile Apps (iOS / Android)',
      'Cloud & Technical Consulting',
      'UI/UX Design & Prototyping',
      'Other custom project',
    ],
  },
  lab: {
    title: 'KSI LAB | Innovation & Tech Research Lab',
    description:
      'Technical articles, artificial intelligence research, software engineering, and digital trends by Kinetic Solutions.',
    subtitle: 'Innovation, advanced research, and the future of development.',
    search: 'Search articles, topics, or technologies...',
    all: 'All',
    loadingTitle: 'Preparing the Lab',
    loadingMessage: 'We are finding articles and organizing ideas for you.',
    noArticles: 'No articles found',
    noSearch: 'We found no publications for "{{query}}". Try different terms.',
    noCategory: 'No articles have been published in this category yet.',
    fallbackCategory: 'Innovation',
    fallbackDescription:
      'Click to read this full article in our innovation lab...',
    team: 'KSI Team',
    readFull: 'Read full article',
    read: 'Read article',
    readTime: '{{minutes}} min read',
    back: 'Back to the Lab',
    views: 'views',
    like: 'Like article',
    share: 'Share article',
    shareAction: 'Share',
    comments: 'Comments ({{count}})',
    commentPlaceholder:
      'Share your insights, questions, or thoughts about this article...',
    publishing: 'Publishing...',
    publish: 'Publish comment',
    commentError: 'Could not publish the comment.',
    commenter: 'Participating as a verified reader',
    join: 'Join the conversation',
    loginPrompt:
      'Sign in with your Google account to comment and interact with the author and community.',
    loginGoogle: 'Sign in with Google',
    loginSuccess: 'Signed in successfully!',
    loginError: 'Could not sign in.',
    likeThanks: 'Thanks for your feedback!',
    likeError: 'Could not process your like.',
    copied: 'Link copied to the clipboard!',
    commentSent: 'Comment sent!',
    opening: 'Opening article',
    openingMessage: 'Loading the post content, image, and interactions.',
    emptyComments:
      'No comments have been published yet. Be the first to start the discussion!',
  },
  footer: { rights: 'ALL RIGHTS RESERVED.' },
};

const es = {
  nav: {
    services: 'Servicios',
    portfolio: 'Portafolio',
    differentials: 'Diferenciales',
    about: 'Nosotros',
    budget: 'Solicitar presupuesto',
    signIn: 'Ingresar',
    signOut: 'Cerrar sesión',
    language: 'Idioma',
    menuOpen: 'Abrir menú',
    menuClose: 'Cerrar menú',
    profile: 'Perfil',
    new: 'NUEVO',
    signInGoogle: 'Ingresar con Google',
    signOutAccount: 'Cerrar sesión',
    authFailed: 'Error al iniciar sesión.',
  },
  hero: {
    headline: 'LA FUERZA DE LA INNOVACIÓN. IDEAS DEL FUTURO.',
    quote: 'PRESUPUESTO GRATUITO',
    clients: 'VER CLIENTES',
    scroll: 'Desplázate para explorar',
  },
  services: {
    badge: 'SOLUCIONES A MEDIDA',
    title: 'Nuestros',
    titleAccent: 'Servicios',
    subtitle:
      'Tecnología de vanguardia y metodología ágil para crear productos digitales sólidos, rápidos y preparados para el futuro.',
    request: 'Solicitar este servicio',
    items: [
      {
        title: 'Sistemas y Aplicaciones Web',
        description:
          'ERPs a medida, portales corporativos, plataformas SaaS y sitios web de alto rendimiento.',
        features: [
          'ERPs y Dashboards',
          'Arquitectura Escalable',
          'APIs REST y GraphQL',
          'Seguridad Avanzada',
        ],
      },
      {
        title: 'Aplicaciones Móviles',
        description:
          'Aplicaciones para iOS y Android con experiencia fluida, sincronización sin conexión e integración completa.',
        features: [
          'iOS y Android Nativo/Híbrido',
          'UI/UX Fluida',
          'Notificaciones Push',
          'Integración con APIs',
        ],
      },
      {
        title: 'Cloud y Consultoría Técnica',
        description:
          'Optimización de infraestructura cloud, modernización de código legado, microservicios y auditoría de rendimiento.',
        features: [
          'AWS y Google Cloud',
          'CI/CD y DevOps',
          'Microservicios y Bases de Datos',
          'Auditoría de Rendimiento',
        ],
      },
      {
        title: 'Diseño UI/UX y Prototipado',
        description:
          'Identidades visuales e interfaces modernas e intuitivas enfocadas en la retención y conversión de clientes.',
        features: [
          'Sistemas de Diseño',
          'Prototipado Interactivo',
          'Pruebas de Usabilidad',
          'Enfoque en Conversión',
        ],
      },
    ],
  },
  portfolio: {
    badge: 'CASOS DE ÉXITO Y PROYECTOS',
    title: 'Nuestros',
    titleAccent: 'Trabajos',
    subtitle:
      'Explora sistemas, aplicaciones y plataformas desarrollados con enfoque en alto rendimiento, usabilidad y resultados comerciales.',
    all: 'Todos',
    projects: 'proyectos',
    previous: 'Proyecto anterior',
    next: 'Siguiente proyecto',
    zoomPreview: 'Ampliar vista previa',
    zoomImage: 'Ampliar imagen',
    details: 'Ver detalles',
    visit: 'Acceder',
    visitTitle: 'Visitar proyecto en producción',
    loadError: 'No fue posible cargar los proyectos ahora.',
    empty: 'No se encontraron proyectos en esta categoría.',
    loadingTitle: 'Cargando proyectos',
    loadingMessage: 'Organizando los casos y plataformas desarrolladas...',
    goTo: 'Ir al proyecto {{number}}',
  },
  differentials: {
    badge: 'POR QUÉ KINETIC SOLUTIONS',
    title: 'Ingeniería Digital Que',
    titleAccent: 'Genera Resultados',
    subtitle:
      'Combinamos precisión técnica, diseño moderno y estrategia de negocio para construir plataformas que impulsan empresas.',
    items: [
      {
        title: 'Rendimiento y Velocidad',
        description:
          'Aplicaciones ultrarrápidas desarrolladas con tecnologías modernas y optimizadas para carga instantánea y máxima retención.',
        badge: 'Máxima Eficiencia',
      },
      {
        title: 'Diseño Enfocado en Conversión',
        description:
          'Interfaces intuitivas y elegantes creadas para cautivar usuarios, guiar la navegación y convertir visitantes en clientes.',
        badge: 'UX / UI Estratégico',
      },
      {
        title: 'Arquitectura Robusta y Segura',
        description:
          'Sistemas estructurados para crecer con tu negocio, garantizando seguridad de datos, alta disponibilidad y código limpio.',
        badge: 'Listo para Escalar',
      },
      {
        title: 'Soporte y Evolución Continua',
        description:
          'Acompañamiento cercano en cada etapa, desde la concepción y el lanzamiento hasta nuevas funcionalidades y mejoras continuas.',
        badge: 'Alianza Estratégica',
      },
    ],
    metrics: [
      'Proyectos y Sistemas',
      'Uptime y Estabilidad',
      'Soluciones a Medida',
      'Entregas Continuas',
    ],
    agile: 'Ágil',
  },
  founder: {
    badge: 'LIDERAZGO Y VISIÓN TÉCNICA',
    role: 'Fundador y Arquitecto de Software',
    bio: 'Con sólida experiencia en ingeniería de software y desarrollo de plataformas escalables, Saymon Felipe lidera Kinetic Solutions (KSI) con la misión de crear soluciones tecnológicas que combinan código de alto rendimiento, arquitectura limpia y diseño centrado en el usuario.',
    highlights: [
      'Arquitectura de Sistemas y Cloud',
      'Desarrollo Full Stack y Mobile',
      'Diseño de Producto y UX de Conversión',
    ],
    quote:
      '“Tu visión nos mueve y nuestra experiencia te guía. Entregamos soluciones dinámicas para el ritmo de tu negocio, con la solidez que necesitas para crecer con seguridad.”',
    linkedin: 'Conectar en LinkedIn',
    imageAlt: 'Saymon Felipe — fundador de Kinetic Solutions',
    availability: 'Disponible para nuevos proyectos y consultorías',
  },
  contact: {
    badge: 'Inicia tu proyecto',
    title: 'Hablemos',
    subtitle:
      'Cuéntanos sobre tu idea o desafío técnico. Nuestro equipo responderá rápidamente con una propuesta personalizada.',
    name: 'Nombre completo *',
    namePlaceholder: 'Tu nombre o el de tu empresa',
    email: 'Correo corporativo *',
    emailPlaceholder: 'tu@empresa.com',
    phone: 'Teléfono / WhatsApp',
    phonePlaceholder: '+00 000 000 000',
    service: 'Servicio de interés',
    selectService: 'Selecciona un servicio',
    details: 'Detalles del proyecto *',
    detailsPlaceholder:
      'Cuéntanos qué necesitas, el plazo estimado y tus objetivos...',
    send: 'Enviar solicitud',
    sending: 'Enviando mensaje...',
    success: '¡Mensaje enviado con éxito! Nos pondremos en contacto pronto.',
    error:
      'No pudimos enviar tu mensaje. Inténtalo de nuevo o contáctanos por WhatsApp.',
    infoTitle: '¿Listo para convertir tu idea en realidad?',
    infoDescription:
      'Completa el formulario para un análisis técnico detallado de tu proyecto o elige uno de los canales directos a continuación.',
    whatsapp: 'WhatsApp directo',
    whatsappDescription: 'Atención ágil en tiempo real',
    commercialEmail: 'Correo comercial',
    responseTime: 'Tiempo de respuesta',
    responseTimeDescription: 'Hasta 2 horas hábiles',
    guarantee: 'Presupuesto 100% gratuito y sin compromiso',
    whatsappMessage:
      '¡Hola! Llegué al sitio de Kinetic Solutions y me gustaría solicitar un presupuesto para un proyecto.',
    services: [
      'Sistemas y Aplicaciones Web (ERP / SaaS)',
      'Aplicaciones Móviles (iOS / Android)',
      'Cloud y Consultoría Técnica',
      'Diseño UI/UX y Prototipado',
      'Otro proyecto personalizado',
    ],
  },
  lab: {
    title: 'KSI LAB | Laboratorio de Innovación e Investigación Tech',
    description:
      'Artículos técnicos, investigaciones de inteligencia artificial, ingeniería de software y tendencias digitales de Kinetic Solutions.',
    subtitle: 'Innovación, investigación avanzada y el futuro del desarrollo.',
    search: 'Buscar artículos, temas o tecnologías...',
    all: 'Todos',
    loadingTitle: 'Preparando el Lab',
    loadingMessage: 'Estamos buscando artículos y organizando ideas para ti.',
    noArticles: 'No se encontraron artículos',
    noSearch:
      'No encontramos publicaciones para "{{query}}". Prueba otros términos.',
    noCategory: 'Aún no hay artículos publicados en esta categoría.',
    fallbackCategory: 'Innovación',
    fallbackDescription:
      'Haz clic para leer este artículo completo en nuestro laboratorio de innovación...',
    team: 'Equipo KSI',
    readFull: 'Leer artículo completo',
    read: 'Leer artículo',
    readTime: '{{minutes}} min de lectura',
    back: 'Volver al Lab',
    views: 'visualizaciones',
    like: 'Me gusta el artículo',
    share: 'Compartir artículo',
    shareAction: 'Compartir',
    comments: 'Comentarios ({{count}})',
    commentPlaceholder:
      'Comparte tus ideas, dudas o consideraciones sobre este artículo...',
    publishing: 'Publicando...',
    publish: 'Publicar comentario',
    commentError: 'No se pudo publicar el comentario.',
    commenter: 'Participando como lector acreditado',
    join: 'Únete a la conversación',
    loginPrompt:
      'Inicia sesión con tu cuenta de Google para comentar e interactuar con el autor y la comunidad.',
    loginGoogle: 'Ingresar con Google',
    loginSuccess: '¡Sesión iniciada correctamente!',
    loginError: 'No se pudo iniciar sesión.',
    likeThanks: '¡Gracias por tu opinión!',
    likeError: 'No se pudo procesar tu me gusta.',
    copied: '¡Enlace copiado al portapapeles!',
    commentSent: '¡Comentario enviado!',
    opening: 'Abriendo el artículo',
    openingMessage:
      'Cargando el contenido, la imagen y las interacciones de la publicación.',
    emptyComments:
      'Aún no hay comentarios publicados. ¡Sé la primera persona en iniciar la discusión!',
  },
  footer: { rights: 'TODOS LOS DERECHOS RESERVADOS.' },
};

i18n.use(initReactI18next).init({
  resources: {
    'pt-BR': { translation: pt },
    en: { translation: en },
    es: { translation: es },
  },
  lng: localStorage.getItem('ksi_language') || navigator.language || 'pt-BR',
  fallbackLng: 'pt-BR',
  supportedLngs: languages.map(({ code }) => code),
  interpolation: { escapeValue: false },
  react: { useSuspense: false },
});
i18n.on('languageChanged', (language) => {
  localStorage.setItem('ksi_language', language);
  document.documentElement.lang = language;
});
export default i18n;
