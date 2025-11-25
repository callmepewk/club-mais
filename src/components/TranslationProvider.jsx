import React, { createContext, useContext, useState, useEffect } from 'react';

const TranslationContext = createContext();

const translations = {
  pt: {
    common: { 
      welcome: "Bem-vindo", loading: "Carregando...", save: "Salvar", cancel: "Cancelar", 
      delete: "Excluir", edit: "Editar", search: "Buscar", filter: "Filtrar", 
      close: "Fechar", yes: "Sim", no: "Não", back: "Voltar", next: "Próximo", 
      submit: "Enviar", continue: "Continuar", seeMore: "Ver Mais", contact: "Contato",
      startNow: "Começar Agora", learnMore: "Saiba Mais", register: "Cadastrar",
      joinUs: "Junte-se a nós", ready: "Pronto para transformar sua rotina de beleza?",
      joinNow: "Associe-se agora e comece a aproveitar todos os benefícios exclusivos",
      members: "membros já fazem parte da nossa comunidade", viewBenefits: "Ver Todos os Benefícios"
    },
    nav: { 
      home: "Início", news: "Notícias", products: "Nossos Produtos", beautyCoin: "Beauty Coin", 
      drBeleza: "Dr. Beleza", map: "Mapa da Estética", edBeauty: "EdBeauty", 
      goldenDoctors: "Golden Doctors", clubePlus: "Clube+", events: "Eventos", 
      plans: "Planos", profile: "Meu Perfil", control: "Controle", navigation: "Navegação"
    },
    hero: { 
      title: "Bem-vindo", titleHighlight: "ao seu clube", 
      subtitle: "Este é o clube de benefícios exclusivo para quem ama o autocuidado e um planeta mais feliz!", 
      cta: "Começar Agora", learnMore: "Saiba Mais", 
      members: "Associados", partners: "Parceiros", satisfaction: "Satisfação",
      badge: "Clube Exclusivo de Benefícios", premium: "Premium",
      selfcare: "autocuidado"
    },
    benefits: { 
      title: "Um clube completo", subtitle: "de benefícios",
      why: "Por que se associar?",
      description: "Descubra todas as vantagens de fazer parte do maior clube de beleza e bem-estar",
      exclusive: "Benefícios Exclusivos", 
      exclusiveDesc: "Acesso a descontos especiais em centenas de estabelecimentos parceiros de beleza e estética.",
      selfcare: "Autocuidado",
      selfcareDesc: "Cuide de você com os melhores profissionais e produtos selecionados especialmente para você.",
      sustainability: "Sustentabilidade",
      sustainabilityDesc: "Apoie marcas e profissionais comprometidos com práticas sustentáveis e um planeta mais saudável.",
      rewards: "Recompensas",
      rewardsDesc: "Acumule pontos e ganhe prêmios exclusivos a cada compra ou serviço utilizado.",
      community: "Comunidade",
      communityDesc: "Faça parte de uma comunidade apaixonada por beleza, bem-estar e autocuidado.",
      experiences: "Experiências Únicas",
      experiencesDesc: "Acesso a eventos exclusivos, workshops e lançamentos de produtos em primeira mão."
    },
    about: {
      story: "Nossa História",
      storyP1: "nasceu da visão de democratizar o acesso a serviços de beleza e estética de qualidade no Brasil.",
      storyP2: "Criamos uma plataforma inovadora que não apenas conecta clientes a profissionais certificados, mas também oferece benefícios exclusivos, descontos especiais e uma comunidade engajada em torno do bem-estar e da beleza sustentável.",
      storyP3: "Através do nosso",
      storyP3b: "reunimos mais de 500 profissionais verificados em todo o país.",
      joinPart: "Faça Parte",
      mission: "Nossa Missão",
      missionDesc: "Democratizar o acesso a serviços de beleza e estética de qualidade, conectando pessoas a profissionais qualificados e comprometidos com a excelência.",
      vision: "Nossa Visão",
      visionDesc: "Ser a maior e mais confiável rede de beleza e estética do Brasil, transformando a experiência de autocuidado em algo acessível e prazeroso.",
      values: "Nossos Valores",
      valueSelfcare: "Autocuidado",
      valueSelfcareDesc: "Acreditamos que cuidar de si mesmo é um ato de amor próprio essencial.",
      valueSustainability: "Sustentabilidade",
      valueSustainabilityDesc: "Comprometidos com práticas sustentáveis e responsáveis.",
      valueCommunity: "Comunidade",
      valueCommunityDesc: "Construímos uma rede forte de profissionais e clientes.",
      valueExcellence: "Excelência",
      valueExcellenceDesc: "Selecionamos apenas os melhores profissionais.",
      numbersInspire: "Números que Inspiram",
      activeMembers: "Membros Ativos",
      certifiedPartners: "Parceiros Certificados",
      citiesServed: "Cidades Atendidas"
    },
    cta: { 
      title: "Faça parte do maior clube de beleza do Brasil", 
      subtitle: "Junte-se a milhares de pessoas que já transformaram sua rotina de autocuidado", 
      button: "Começar Agora", viewBenefits: "Ver Benefícios"
    },
    footer: { 
      description: "O maior clube de benefícios de beleza e estética do Brasil", 
      rights: "Todos os direitos reservados",
      community: "Comunidade", ourProducts: "Produtos",
      privacy: "Política de Privacidade", terms: "Termos de Serviço"
    },
    banner: {
      signup: "Cadastre-se agora e ganhe benefícios exclusivos!",
      signupShort: "Cadastre-se e ganhe benefícios!"
    }
  },
  en: {
    common: { 
      welcome: "Welcome", loading: "Loading...", save: "Save", cancel: "Cancel", 
      delete: "Delete", edit: "Edit", search: "Search", filter: "Filter", 
      close: "Close", yes: "Yes", no: "No", back: "Back", next: "Next", 
      submit: "Submit", continue: "Continue", seeMore: "See More", contact: "Contact",
      startNow: "Start Now", learnMore: "Learn More", register: "Register",
      joinUs: "Join us", ready: "Ready to transform your beauty routine?",
      joinNow: "Join now and start enjoying all exclusive benefits",
      members: "members are already part of our community", viewBenefits: "View All Benefits"
    },
    nav: { 
      home: "Home", news: "News", products: "Our Products", beautyCoin: "Beauty Coin", 
      drBeleza: "Dr. Beauty", map: "Aesthetic Map", edBeauty: "EdBeauty", 
      goldenDoctors: "Golden Doctors", clubePlus: "Club+", events: "Events", 
      plans: "Plans", profile: "My Profile", control: "Control", navigation: "Navigation"
    },
    hero: { 
      title: "Welcome", titleHighlight: "to your club", 
      subtitle: "This is the exclusive benefits club for those who love self-care and a happier planet!", 
      cta: "Start Now", learnMore: "Learn More", 
      members: "Members", partners: "Partners", satisfaction: "Satisfaction",
      badge: "Exclusive Benefits Club", premium: "Premium",
      selfcare: "self-care"
    },
    benefits: { 
      title: "A complete club", subtitle: "of benefits",
      why: "Why join?",
      description: "Discover all the advantages of being part of the largest beauty and wellness club",
      exclusive: "Exclusive Benefits", 
      exclusiveDesc: "Access to special discounts at hundreds of beauty and aesthetic partner establishments.",
      selfcare: "Self-care",
      selfcareDesc: "Take care of yourself with the best professionals and products selected especially for you.",
      sustainability: "Sustainability",
      sustainabilityDesc: "Support brands and professionals committed to sustainable practices and a healthier planet.",
      rewards: "Rewards",
      rewardsDesc: "Accumulate points and win exclusive prizes with every purchase or service used.",
      community: "Community",
      communityDesc: "Be part of a community passionate about beauty, wellness and self-care.",
      experiences: "Unique Experiences",
      experiencesDesc: "Access to exclusive events, workshops and product launches first-hand."
    },
    about: {
      story: "Our Story",
      storyP1: "was born from the vision of democratizing access to quality beauty and aesthetic services in Brazil.",
      storyP2: "We created an innovative platform that not only connects clients to certified professionals, but also offers exclusive benefits, special discounts and an engaged community around wellness and sustainable beauty.",
      storyP3: "Through our",
      storyP3b: "we bring together over 500 verified professionals across the country.",
      joinPart: "Join Us",
      mission: "Our Mission",
      missionDesc: "Democratize access to quality beauty and aesthetic services, connecting people to qualified professionals committed to excellence.",
      vision: "Our Vision",
      visionDesc: "To be the largest and most trusted beauty and aesthetic network in Brazil, transforming the self-care experience into something accessible and enjoyable.",
      values: "Our Values",
      valueSelfcare: "Self-care",
      valueSelfcareDesc: "We believe that taking care of yourself is an essential act of self-love.",
      valueSustainability: "Sustainability",
      valueSustainabilityDesc: "Committed to sustainable and responsible practices.",
      valueCommunity: "Community",
      valueCommunityDesc: "We build a strong network of professionals and clients.",
      valueExcellence: "Excellence",
      valueExcellenceDesc: "We select only the best professionals.",
      numbersInspire: "Numbers that Inspire",
      activeMembers: "Active Members",
      certifiedPartners: "Certified Partners",
      citiesServed: "Cities Served"
    },
    cta: { 
      title: "Join Brazil's largest beauty club", 
      subtitle: "Join thousands of people who have transformed their self-care routine", 
      button: "Start Now", viewBenefits: "View Benefits"
    },
    footer: { 
      description: "Brazil's largest beauty and aesthetics benefits club", 
      rights: "All rights reserved",
      community: "Community", ourProducts: "Products",
      privacy: "Privacy Policy", terms: "Terms of Service"
    },
    banner: {
      signup: "Sign up now and get exclusive benefits!",
      signupShort: "Sign up and get benefits!"
    }
  },
  es: {
    common: { 
      welcome: "Bienvenido", loading: "Cargando...", save: "Guardar", cancel: "Cancelar", 
      delete: "Eliminar", edit: "Editar", search: "Buscar", filter: "Filtrar", 
      close: "Cerrar", yes: "Sí", no: "No", back: "Volver", next: "Siguiente", 
      submit: "Enviar", continue: "Continuar", seeMore: "Ver Más", contact: "Contacto",
      startNow: "Comenzar Ahora", learnMore: "Saber Más", register: "Registrarse",
      joinUs: "Únete a nosotros", ready: "¿Listo para transformar tu rutina de belleza?",
      joinNow: "Únete ahora y comienza a disfrutar de todos los beneficios exclusivos",
      members: "miembros ya forman parte de nuestra comunidad", viewBenefits: "Ver Todos los Beneficios"
    },
    nav: { 
      home: "Inicio", news: "Noticias", products: "Nuestros Productos", beautyCoin: "Beauty Coin", 
      drBeleza: "Dr. Belleza", map: "Mapa de Estética", edBeauty: "EdBeauty", 
      goldenDoctors: "Golden Doctors", clubePlus: "Club+", events: "Eventos", 
      plans: "Planes", profile: "Mi Perfil", control: "Control", navigation: "Navegación"
    },
    hero: { 
      title: "Bienvenido", titleHighlight: "a tu club", 
      subtitle: "¡Este es el club de beneficios exclusivos para quienes aman el autocuidado y un planeta más feliz!", 
      cta: "Comenzar Ahora", learnMore: "Saber Más", 
      members: "Miembros", partners: "Socios", satisfaction: "Satisfacción",
      badge: "Club Exclusivo de Beneficios", premium: "Premium",
      selfcare: "autocuidado"
    },
    benefits: { 
      title: "Un club completo", subtitle: "de beneficios",
      why: "¿Por qué unirse?",
      description: "Descubre todas las ventajas de formar parte del mayor club de belleza y bienestar",
      exclusive: "Beneficios Exclusivos", 
      exclusiveDesc: "Acceso a descuentos especiales en cientos de establecimientos asociados de belleza y estética.",
      selfcare: "Autocuidado",
      selfcareDesc: "Cuídate con los mejores profesionales y productos seleccionados especialmente para ti.",
      sustainability: "Sostenibilidad",
      sustainabilityDesc: "Apoya marcas y profesionales comprometidos con prácticas sostenibles y un planeta más saludable.",
      rewards: "Recompensas",
      rewardsDesc: "Acumula puntos y gana premios exclusivos con cada compra o servicio utilizado.",
      community: "Comunidad",
      communityDesc: "Forma parte de una comunidad apasionada por la belleza, el bienestar y el autocuidado.",
      experiences: "Experiencias Únicas",
      experiencesDesc: "Acceso a eventos exclusivos, talleres y lanzamientos de productos de primera mano."
    },
    about: {
      story: "Nuestra Historia",
      storyP1: "nació de la visión de democratizar el acceso a servicios de belleza y estética de calidad en Brasil.",
      storyP2: "Creamos una plataforma innovadora que no solo conecta clientes con profesionales certificados, sino que también ofrece beneficios exclusivos, descuentos especiales y una comunidad comprometida con el bienestar y la belleza sostenible.",
      storyP3: "A través de nuestro",
      storyP3b: "reunimos más de 500 profesionales verificados en todo el país.",
      joinPart: "Únete",
      mission: "Nuestra Misión",
      missionDesc: "Democratizar el acceso a servicios de belleza y estética de calidad, conectando personas con profesionales calificados comprometidos con la excelencia.",
      vision: "Nuestra Visión",
      visionDesc: "Ser la red de belleza y estética más grande y confiable de Brasil, transformando la experiencia de autocuidado en algo accesible y placentero.",
      values: "Nuestros Valores",
      valueSelfcare: "Autocuidado",
      valueSelfcareDesc: "Creemos que cuidarse a uno mismo es un acto esencial de amor propio.",
      valueSustainability: "Sostenibilidad",
      valueSustainabilityDesc: "Comprometidos con prácticas sostenibles y responsables.",
      valueCommunity: "Comunidad",
      valueCommunityDesc: "Construimos una red sólida de profesionales y clientes.",
      valueExcellence: "Excelencia",
      valueExcellenceDesc: "Seleccionamos solo a los mejores profesionales.",
      numbersInspire: "Números que Inspiran",
      activeMembers: "Miembros Activos",
      certifiedPartners: "Socios Certificados",
      citiesServed: "Ciudades Atendidas"
    },
    cta: { 
      title: "Únete al club de belleza más grande de Brasil", 
      subtitle: "Únete a miles de personas que ya transformaron su rutina de autocuidado", 
      button: "Comenzar Ahora", viewBenefits: "Ver Beneficios"
    },
    footer: { 
      description: "El mayor club de beneficios de belleza y estética de Brasil", 
      rights: "Todos los derechos reservados",
      community: "Comunidad", ourProducts: "Productos",
      privacy: "Política de Privacidad", terms: "Términos de Servicio"
    },
    banner: {
      signup: "¡Regístrate ahora y obtén beneficios exclusivos!",
      signupShort: "¡Regístrate y obtén beneficios!"
    }
  },
  fr: {
    common: { 
      welcome: "Bienvenue", loading: "Chargement...", save: "Enregistrer", cancel: "Annuler", 
      delete: "Supprimer", edit: "Modifier", search: "Rechercher", filter: "Filtrer", 
      close: "Fermer", yes: "Oui", no: "Non", back: "Retour", next: "Suivant", 
      submit: "Soumettre", continue: "Continuer", seeMore: "Voir Plus", contact: "Contact",
      startNow: "Commencer Maintenant", learnMore: "En Savoir Plus", register: "S'inscrire",
      joinUs: "Rejoignez-nous", ready: "Prêt à transformer votre routine beauté?",
      joinNow: "Inscrivez-vous maintenant et commencez à profiter de tous les avantages exclusifs",
      members: "membres font déjà partie de notre communauté", viewBenefits: "Voir Tous les Avantages"
    },
    nav: { 
      home: "Accueil", news: "Actualités", products: "Nos Produits", beautyCoin: "Beauty Coin", 
      drBeleza: "Dr. Beauté", map: "Carte Esthétique", edBeauty: "EdBeauty", 
      goldenDoctors: "Golden Doctors", clubePlus: "Club+", events: "Événements", 
      plans: "Plans", profile: "Mon Profil", control: "Contrôle", navigation: "Navigation"
    },
    hero: { 
      title: "Bienvenue", titleHighlight: "dans votre club", 
      subtitle: "C'est le club d'avantages exclusifs pour ceux qui aiment prendre soin d'eux et une planète plus heureuse!", 
      cta: "Commencer Maintenant", learnMore: "En Savoir Plus", 
      members: "Membres", partners: "Partenaires", satisfaction: "Satisfaction",
      badge: "Club de Bénéfices Exclusifs", premium: "Premium",
      selfcare: "soins personnels"
    },
    benefits: { 
      title: "Un club complet", subtitle: "d'avantages",
      why: "Pourquoi rejoindre?",
      description: "Découvrez tous les avantages de faire partie du plus grand club de beauté et bien-être",
      exclusive: "Avantages Exclusifs", 
      exclusiveDesc: "Accès à des réductions spéciales dans des centaines d'établissements partenaires de beauté et esthétique.",
      selfcare: "Soins Personnels",
      selfcareDesc: "Prenez soin de vous avec les meilleurs professionnels et produits sélectionnés spécialement pour vous.",
      sustainability: "Durabilité",
      sustainabilityDesc: "Soutenez des marques et professionnels engagés dans des pratiques durables et une planète plus saine.",
      rewards: "Récompenses",
      rewardsDesc: "Accumulez des points et gagnez des prix exclusifs à chaque achat ou service utilisé.",
      community: "Communauté",
      communityDesc: "Faites partie d'une communauté passionnée par la beauté, le bien-être et les soins personnels.",
      experiences: "Expériences Uniques",
      experiencesDesc: "Accès à des événements exclusifs, ateliers et lancements de produits en avant-première."
    },
    about: {
      story: "Notre Histoire",
      storyP1: "est né de la vision de démocratiser l'accès aux services de beauté et d'esthétique de qualité au Brésil.",
      storyP2: "Nous avons créé une plateforme innovante qui non seulement connecte les clients à des professionnels certifiés, mais offre également des avantages exclusifs, des réductions spéciales et une communauté engagée autour du bien-être et de la beauté durable.",
      storyP3: "Grâce à notre",
      storyP3b: "nous rassemblons plus de 500 professionnels vérifiés dans tout le pays.",
      joinPart: "Rejoignez-nous",
      mission: "Notre Mission",
      missionDesc: "Démocratiser l'accès aux services de beauté et d'esthétique de qualité, en connectant les personnes à des professionnels qualifiés engagés dans l'excellence.",
      vision: "Notre Vision",
      visionDesc: "Être le réseau de beauté et d'esthétique le plus grand et le plus fiable du Brésil, transformant l'expérience de soins personnels en quelque chose d'accessible et agréable.",
      values: "Nos Valeurs",
      valueSelfcare: "Soins Personnels",
      valueSelfcareDesc: "Nous croyons que prendre soin de soi est un acte essentiel d'amour-propre.",
      valueSustainability: "Durabilité",
      valueSustainabilityDesc: "Engagés dans des pratiques durables et responsables.",
      valueCommunity: "Communauté",
      valueCommunityDesc: "Nous construisons un réseau solide de professionnels et de clients.",
      valueExcellence: "Excellence",
      valueExcellenceDesc: "Nous sélectionnons uniquement les meilleurs professionnels.",
      numbersInspire: "Des Chiffres qui Inspirent",
      activeMembers: "Membres Actifs",
      certifiedPartners: "Partenaires Certifiés",
      citiesServed: "Villes Desservies"
    },
    cta: { 
      title: "Rejoignez le plus grand club de beauté du Brésil", 
      subtitle: "Rejoignez des milliers de personnes qui ont transformé leur routine de soins personnels", 
      button: "Commencer Maintenant", viewBenefits: "Voir les Avantages"
    },
    footer: { 
      description: "Le plus grand club d'avantages beauté et esthétique du Brésil", 
      rights: "Tous droits réservés",
      community: "Communauté", ourProducts: "Produits",
      privacy: "Politique de Confidentialité", terms: "Conditions d'Utilisation"
    },
    banner: {
      signup: "Inscrivez-vous maintenant et obtenez des avantages exclusifs!",
      signupShort: "Inscrivez-vous et obtenez des avantages!"
    }
  },
  de: {
    common: { 
      welcome: "Willkommen", loading: "Lädt...", save: "Speichern", cancel: "Abbrechen", 
      delete: "Löschen", edit: "Bearbeiten", search: "Suchen", filter: "Filtern", 
      close: "Schließen", yes: "Ja", no: "Nein", back: "Zurück", next: "Weiter", 
      submit: "Absenden", continue: "Fortfahren", seeMore: "Mehr Sehen", contact: "Kontakt",
      startNow: "Jetzt Starten", learnMore: "Mehr Erfahren", register: "Registrieren",
      joinUs: "Machen Sie mit", ready: "Bereit, Ihre Schönheitsroutine zu transformieren?",
      joinNow: "Treten Sie jetzt bei und genießen Sie alle exklusiven Vorteile",
      members: "Mitglieder sind bereits Teil unserer Community", viewBenefits: "Alle Vorteile Anzeigen"
    },
    nav: { 
      home: "Startseite", news: "Nachrichten", products: "Unsere Produkte", beautyCoin: "Beauty Coin", 
      drBeleza: "Dr. Schönheit", map: "Ästhetik-Karte", edBeauty: "EdBeauty", 
      goldenDoctors: "Golden Doctors", clubePlus: "Club+", events: "Veranstaltungen", 
      plans: "Pläne", profile: "Mein Profil", control: "Kontrolle", navigation: "Navigation"
    },
    hero: { 
      title: "Willkommen", titleHighlight: "in Ihrem Club", 
      subtitle: "Dies ist der exklusive Vorteils-Club für diejenigen, die Selbstpflege und einen glücklicheren Planeten lieben!", 
      cta: "Jetzt Starten", learnMore: "Mehr Erfahren", 
      members: "Mitglieder", partners: "Partner", satisfaction: "Zufriedenheit",
      badge: "Exklusiver Vorteils-Club", premium: "Premium",
      selfcare: "Selbstpflege"
    },
    benefits: { 
      title: "Ein kompletter Club", subtitle: "voller Vorteile",
      why: "Warum beitreten?",
      description: "Entdecken Sie alle Vorteile, Teil des größten Schönheits- und Wellness-Clubs zu sein",
      exclusive: "Exklusive Vorteile", 
      exclusiveDesc: "Zugang zu Sonderrabatten bei Hunderten von Partner-Schönheits- und Ästhetik-Einrichtungen.",
      selfcare: "Selbstpflege",
      selfcareDesc: "Kümmern Sie sich um sich selbst mit den besten Fachleuten und Produkten, die speziell für Sie ausgewählt wurden.",
      sustainability: "Nachhaltigkeit",
      sustainabilityDesc: "Unterstützen Sie Marken und Fachleute, die sich für nachhaltige Praktiken und einen gesünderen Planeten einsetzen.",
      rewards: "Belohnungen",
      rewardsDesc: "Sammeln Sie Punkte und gewinnen Sie exklusive Preise bei jedem Kauf oder jeder genutzten Dienstleistung.",
      community: "Gemeinschaft",
      communityDesc: "Werden Sie Teil einer Gemeinschaft, die sich für Schönheit, Wellness und Selbstpflege begeistert.",
      experiences: "Einzigartige Erlebnisse",
      experiencesDesc: "Zugang zu exklusiven Veranstaltungen, Workshops und Produkteinführungen aus erster Hand."
    },
    about: {
      story: "Unsere Geschichte",
      storyP1: "entstand aus der Vision, den Zugang zu hochwertigen Schönheits- und Ästhetikdienstleistungen in Brasilien zu demokratisieren.",
      storyP2: "Wir haben eine innovative Plattform geschaffen, die nicht nur Kunden mit zertifizierten Fachleuten verbindet, sondern auch exklusive Vorteile, Sonderrabatte und eine engagierte Community rund um Wellness und nachhaltige Schönheit bietet.",
      storyP3: "Durch unsere",
      storyP3b: "bringen wir über 500 verifizierte Fachleute im ganzen Land zusammen.",
      joinPart: "Machen Sie mit",
      mission: "Unsere Mission",
      missionDesc: "Den Zugang zu hochwertigen Schönheits- und Ästhetikdienstleistungen demokratisieren, indem Menschen mit qualifizierten Fachleuten verbunden werden, die sich der Exzellenz verpflichtet haben.",
      vision: "Unsere Vision",
      visionDesc: "Das größte und vertrauenswürdigste Schönheits- und Ästhetiknetzwerk Brasiliens zu sein und die Selbstpflege-Erfahrung in etwas Zugängliches und Angenehmes zu verwandeln.",
      values: "Unsere Werte",
      valueSelfcare: "Selbstpflege",
      valueSelfcareDesc: "Wir glauben, dass die Pflege seiner selbst ein wesentlicher Akt der Selbstliebe ist.",
      valueSustainability: "Nachhaltigkeit",
      valueSustainabilityDesc: "Engagiert für nachhaltige und verantwortungsvolle Praktiken.",
      valueCommunity: "Gemeinschaft",
      valueCommunityDesc: "Wir bauen ein starkes Netzwerk aus Fachleuten und Kunden auf.",
      valueExcellence: "Exzellenz",
      valueExcellenceDesc: "Wir wählen nur die besten Fachleute aus.",
      numbersInspire: "Zahlen, die Inspirieren",
      activeMembers: "Aktive Mitglieder",
      certifiedPartners: "Zertifizierte Partner",
      citiesServed: "Bediente Städte"
    },
    cta: { 
      title: "Werden Sie Teil von Brasiliens größtem Schönheitsclub", 
      subtitle: "Schließen Sie sich Tausenden von Menschen an, die ihre Selbstpflege-Routine transformiert haben", 
      button: "Jetzt Starten", viewBenefits: "Vorteile Anzeigen"
    },
    footer: { 
      description: "Brasiliens größter Schönheits- und Ästhetik-Vorteils-Club", 
      rights: "Alle Rechte vorbehalten",
      community: "Gemeinschaft", ourProducts: "Produkte",
      privacy: "Datenschutzrichtlinie", terms: "Nutzungsbedingungen"
    },
    banner: {
      signup: "Melden Sie sich jetzt an und erhalten Sie exklusive Vorteile!",
      signupShort: "Anmelden und Vorteile erhalten!"
    }
  },
  it: {
    common: { 
      welcome: "Benvenuto", loading: "Caricamento...", save: "Salva", cancel: "Annulla", 
      delete: "Elimina", edit: "Modifica", search: "Cerca", filter: "Filtra", 
      close: "Chiudi", yes: "Sì", no: "No", back: "Indietro", next: "Avanti", 
      submit: "Invia", continue: "Continua", seeMore: "Vedi Altro", contact: "Contatto",
      startNow: "Inizia Ora", learnMore: "Scopri di Più", register: "Registrati",
      joinUs: "Unisciti a noi", ready: "Pronto a trasformare la tua routine di bellezza?",
      joinNow: "Iscriviti ora e inizia a godere di tutti i vantaggi esclusivi",
      members: "membri fanno già parte della nostra community", viewBenefits: "Visualizza Tutti i Vantaggi"
    },
    nav: { 
      home: "Home", news: "Notizie", products: "I Nostri Prodotti", beautyCoin: "Beauty Coin", 
      drBeleza: "Dr. Bellezza", map: "Mappa Estetica", edBeauty: "EdBeauty", 
      goldenDoctors: "Golden Doctors", clubePlus: "Club+", events: "Eventi", 
      plans: "Piani", profile: "Il Mio Profilo", control: "Controllo", navigation: "Navigazione"
    },
    hero: { 
      title: "Benvenuto", titleHighlight: "nel tuo club", 
      subtitle: "Questo è il club di vantaggi esclusivi per chi ama la cura di sé e un pianeta più felice!", 
      cta: "Inizia Ora", learnMore: "Scopri di Più", 
      members: "Membri", partners: "Partner", satisfaction: "Soddisfazione",
      badge: "Club di Vantaggi Esclusivi", premium: "Premium",
      selfcare: "cura di sé"
    },
    benefits: { 
      title: "Un club completo", subtitle: "di vantaggi",
      why: "Perché iscriversi?",
      description: "Scopri tutti i vantaggi di far parte del più grande club di bellezza e benessere",
      exclusive: "Vantaggi Esclusivi", 
      exclusiveDesc: "Accesso a sconti speciali presso centinaia di stabilimenti partner di bellezza ed estetica.",
      selfcare: "Cura di Sé",
      selfcareDesc: "Prenditi cura di te con i migliori professionisti e prodotti selezionati appositamente per te.",
      sustainability: "Sostenibilità",
      sustainabilityDesc: "Sostieni marchi e professionisti impegnati in pratiche sostenibili e un pianeta più sano.",
      rewards: "Ricompense",
      rewardsDesc: "Accumula punti e vinci premi esclusivi ad ogni acquisto o servizio utilizzato.",
      community: "Comunità",
      communityDesc: "Fai parte di una comunità appassionata di bellezza, benessere e cura di sé.",
      experiences: "Esperienze Uniche",
      experiencesDesc: "Accesso a eventi esclusivi, workshop e lanci di prodotti in anteprima."
    },
    about: {
      story: "La Nostra Storia",
      storyP1: "è nato dalla visione di democratizzare l'accesso ai servizi di bellezza ed estetica di qualità in Brasile.",
      storyP2: "Abbiamo creato una piattaforma innovativa che non solo connette i clienti a professionisti certificati, ma offre anche vantaggi esclusivi, sconti speciali e una comunità impegnata intorno al benessere e alla bellezza sostenibile.",
      storyP3: "Attraverso la nostra",
      storyP3b: "riuniamo oltre 500 professionisti verificati in tutto il paese.",
      joinPart: "Unisciti a Noi",
      mission: "La Nostra Missione",
      missionDesc: "Democratizzare l'accesso ai servizi di bellezza ed estetica di qualità, connettendo le persone a professionisti qualificati impegnati nell'eccellenza.",
      vision: "La Nostra Visione",
      visionDesc: "Essere la rete di bellezza ed estetica più grande e affidabile del Brasile, trasformando l'esperienza di cura personale in qualcosa di accessibile e piacevole.",
      values: "I Nostri Valori",
      valueSelfcare: "Cura di Sé",
      valueSelfcareDesc: "Crediamo che prendersi cura di sé sia un atto essenziale di amor proprio.",
      valueSustainability: "Sostenibilità",
      valueSustainabilityDesc: "Impegnati in pratiche sostenibili e responsabili.",
      valueCommunity: "Comunità",
      valueCommunityDesc: "Costruiamo una rete solida di professionisti e clienti.",
      valueExcellence: "Eccellenza",
      valueExcellenceDesc: "Selezioniamo solo i migliori professionisti.",
      numbersInspire: "Numeri che Ispirano",
      activeMembers: "Membri Attivi",
      certifiedPartners: "Partner Certificati",
      citiesServed: "Città Servite"
    },
    cta: { 
      title: "Entra a far parte del più grande club di bellezza del Brasile", 
      subtitle: "Unisciti a migliaia di persone che hanno trasformato la loro routine di cura personale", 
      button: "Inizia Ora", viewBenefits: "Visualizza Vantaggi"
    },
    footer: { 
      description: "Il più grande club di vantaggi bellezza ed estetica del Brasile", 
      rights: "Tutti i diritti riservati",
      community: "Comunità", ourProducts: "Prodotti",
      privacy: "Informativa sulla Privacy", terms: "Termini di Servizio"
    },
    banner: {
      signup: "Iscriviti ora e ottieni vantaggi esclusivi!",
      signupShort: "Iscriviti e ottieni vantaggi!"
    }
  },
  ja: {
    common: { 
      welcome: "ようこそ", loading: "読み込み中...", save: "保存", cancel: "キャンセル", 
      delete: "削除", edit: "編集", search: "検索", filter: "フィルター", 
      close: "閉じる", yes: "はい", no: "いいえ", back: "戻る", next: "次へ", 
      submit: "送信", continue: "続ける", seeMore: "もっと見る", contact: "お問い合わせ",
      startNow: "今すぐ始める", learnMore: "詳細を見る", register: "登録",
      joinUs: "参加する", ready: "あなたの美容ルーティンを変える準備はできていますか？",
      joinNow: "今すぐ登録して、すべての限定特典をお楽しみください",
      members: "メンバーがすでにコミュニティに参加しています", viewBenefits: "すべての特典を見る"
    },
    nav: { 
      home: "ホーム", news: "ニュース", products: "製品", beautyCoin: "ビューティーコイン", 
      drBeleza: "Dr. ビューティー", map: "美容マップ", edBeauty: "EdBeauty", 
      goldenDoctors: "ゴールデンドクターズ", clubePlus: "クラブ+", events: "イベント", 
      plans: "プラン", profile: "マイプロフィール", control: "コントロール", navigation: "ナビゲーション"
    },
    hero: { 
      title: "ようこそ", titleHighlight: "あなたのクラブへ", 
      subtitle: "セルフケアとより幸せな地球を愛する人のための限定特典クラブです！", 
      cta: "今すぐ始める", learnMore: "詳細を見る", 
      members: "会員", partners: "パートナー", satisfaction: "満足度",
      badge: "限定特典クラブ", premium: "プレミアム",
      selfcare: "セルフケア"
    },
    benefits: { 
      title: "完全なクラブ", subtitle: "特典の",
      why: "なぜ参加するのか？",
      description: "最大の美容とウェルネスクラブの一員であることのすべての利点を発見してください",
      exclusive: "限定特典", 
      exclusiveDesc: "数百の美容とエステティックのパートナー施設で特別割引をご利用いただけます。",
      selfcare: "セルフケア",
      selfcareDesc: "あなたのために特別に選ばれた最高のプロフェッショナルと製品であなた自身のケアをしてください。",
      sustainability: "持続可能性",
      sustainabilityDesc: "持続可能な実践とより健康的な地球にコミットしたブランドとプロフェッショナルをサポートします。",
      rewards: "報酬",
      rewardsDesc: "購入またはサービスを利用するたびにポイントを貯めて限定賞品を獲得してください。",
      community: "コミュニティ",
      communityDesc: "美容、ウェルネス、セルフケアに情熱を持つコミュニティの一員になりましょう。",
      experiences: "ユニークな体験",
      experiencesDesc: "限定イベント、ワークショップ、製品発売の最前線へのアクセス。"
    },
    about: {
      story: "私たちの物語",
      storyP1: "ブラジルで質の高い美容とエステティックサービスへのアクセスを民主化するというビジョンから生まれました。",
      storyP2: "私たちは、クライアントを認定されたプロフェッショナルに接続するだけでなく、限定特典、特別割引、ウェルネスと持続可能な美容を中心としたコミュニティを提供する革新的なプラットフォームを作成しました。",
      storyP3: "私たちの",
      storyP3b: "を通じて、全国で500人以上の検証済みプロフェッショナルを集めています。",
      joinPart: "参加する",
      mission: "私たちの使命",
      missionDesc: "質の高い美容とエステティックサービスへのアクセスを民主化し、卓越性にコミットした資格のあるプロフェッショナルと人々を接続します。",
      vision: "私たちのビジョン",
      visionDesc: "ブラジルで最大かつ最も信頼できる美容とエステティックネットワークになり、セルフケア体験をアクセス可能で楽しいものに変えます。",
      values: "私たちの価値観",
      valueSelfcare: "セルフケア",
      valueSelfcareDesc: "自分自身をケアすることは自己愛の本質的な行為であると信じています。",
      valueSustainability: "持続可能性",
      valueSustainabilityDesc: "持続可能で責任ある実践にコミットしています。",
      valueCommunity: "コミュニティ",
      valueCommunityDesc: "プロフェッショナルとクライアントの強力なネットワークを構築します。",
      valueExcellence: "卓越性",
      valueExcellenceDesc: "最高のプロフェッショナルのみを選択します。",
      numbersInspire: "インスパイアする数字",
      activeMembers: "アクティブメンバー",
      certifiedPartners: "認定パートナー",
      citiesServed: "サービス提供都市"
    },
    cta: { 
      title: "ブラジル最大のビューティークラブに参加", 
      subtitle: "セルフケアのルーティンを変えた何千人もの人々に参加しましょう", 
      button: "今すぐ始める", viewBenefits: "特典を見る"
    },
    footer: { 
      description: "ブラジル最大の美容とエステティックの特典クラブ", 
      rights: "全著作権所有",
      community: "コミュニティ", ourProducts: "製品",
      privacy: "プライバシーポリシー", terms: "利用規約"
    },
    banner: {
      signup: "今すぐ登録して限定特典をゲット！",
      signupShort: "登録して特典をゲット！"
    }
  },
  zh: {
    common: { 
      welcome: "欢迎", loading: "加载中...", save: "保存", cancel: "取消", 
      delete: "删除", edit: "编辑", search: "搜索", filter: "筛选", 
      close: "关闭", yes: "是", no: "否", back: "返回", next: "下一步", 
      submit: "提交", continue: "继续", seeMore: "查看更多", contact: "联系",
      startNow: "立即开始", learnMore: "了解更多", register: "注册",
      joinUs: "加入我们", ready: "准备好改变您的美容日常了吗？",
      joinNow: "立即注册并开始享受所有独家福利",
      members: "名成员已经加入我们的社区", viewBenefits: "查看所有福利"
    },
    nav: { 
      home: "首页", news: "新闻", products: "我们的产品", beautyCoin: "美丽币", 
      drBeleza: "美丽博士", map: "美容地图", edBeauty: "EdBeauty", 
      goldenDoctors: "黄金医生", clubePlus: "俱乐部+", events: "活动", 
      plans: "计划", profile: "我的资料", control: "控制", navigation: "导航"
    },
    hero: { 
      title: "欢迎", titleHighlight: "来到您的俱乐部", 
      subtitle: "这是为热爱自我护理和更快乐星球的人提供的独家福利俱乐部！", 
      cta: "立即开始", learnMore: "了解更多", 
      members: "会员", partners: "合作伙伴", satisfaction: "满意度",
      badge: "独家福利俱乐部", premium: "高级",
      selfcare: "自我护理"
    },
    benefits: { 
      title: "一个完整的俱乐部", subtitle: "福利的",
      why: "为什么加入？",
      description: "发现成为最大美容和健康俱乐部成员的所有优势",
      exclusive: "独家福利", 
      exclusiveDesc: "在数百家美容和美学合作机构享受特别折扣。",
      selfcare: "自我护理",
      selfcareDesc: "使用专为您选择的最佳专业人士和产品来照顾自己。",
      sustainability: "可持续性",
      sustainabilityDesc: "支持致力于可持续实践和更健康星球的品牌和专业人士。",
      rewards: "奖励",
      rewardsDesc: "每次购买或使用服务时积累积分并赢取独家奖品。",
      community: "社区",
      communityDesc: "成为热衷于美容、健康和自我护理的社区的一部分。",
      experiences: "独特体验",
      experiencesDesc: "优先获得独家活动、研讨会和产品发布。"
    },
    about: {
      story: "我们的故事",
      storyP1: "诞生于使巴西优质美容和美学服务的获取民主化的愿景。",
      storyP2: "我们创建了一个创新平台，不仅连接客户与认证专业人士，还提供独家福利、特别折扣和围绕健康和可持续美容的参与社区。",
      storyP3: "通过我们的",
      storyP3b: "我们汇集了全国500多名经过验证的专业人士。",
      joinPart: "加入我们",
      mission: "我们的使命",
      missionDesc: "使优质美容和美学服务的获取民主化，连接人们与致力于卓越的合格专业人士。",
      vision: "我们的愿景",
      visionDesc: "成为巴西最大和最值得信赖的美容和美学网络，将自我护理体验转变为可访问和愉快的事物。",
      values: "我们的价值观",
      valueSelfcare: "自我护理",
      valueSelfcareDesc: "我们相信照顾自己是自爱的基本行为。",
      valueSustainability: "可持续性",
      valueSustainabilityDesc: "致力于可持续和负责任的实践。",
      valueCommunity: "社区",
      valueCommunityDesc: "我们建立了一个强大的专业人士和客户网络。",
      valueExcellence: "卓越",
      valueExcellenceDesc: "我们只选择最好的专业人士。",
      numbersInspire: "鼓舞人心的数字",
      activeMembers: "活跃成员",
      certifiedPartners: "认证合作伙伴",
      citiesServed: "服务城市"
    },
    cta: { 
      title: "加入巴西最大的美容俱乐部", 
      subtitle: "加入成千上万已经改变自我护理习惯的人", 
      button: "立即开始", viewBenefits: "查看福利"
    },
    footer: { 
      description: "巴西最大的美容和美学福利俱乐部", 
      rights: "版权所有",
      community: "社区", ourProducts: "产品",
      privacy: "隐私政策", terms: "服务条款"
    },
    banner: {
      signup: "立即注册并获得独家福利！",
      signupShort: "注册并获得福利！"
    }
  },
  ru: {
    common: { 
      welcome: "Добро пожаловать", loading: "Загрузка...", save: "Сохранить", cancel: "Отмена", 
      delete: "Удалить", edit: "Редактировать", search: "Поиск", filter: "Фильтр", 
      close: "Закрыть", yes: "Да", no: "Нет", back: "Назад", next: "Далее", 
      submit: "Отправить", continue: "Продолжить", seeMore: "Узнать больше", contact: "Контакт",
      startNow: "Начать сейчас", learnMore: "Узнать больше", register: "Зарегистрироваться",
      joinUs: "Присоединяйтесь к нам", ready: "Готовы преобразить свой режим красоты?",
      joinNow: "Зарегистрируйтесь сейчас и начните наслаждаться всеми эксклюзивными преимуществами",
      members: "участников уже являются частью нашего сообщества", viewBenefits: "Посмотреть Все Преимущества"
    },
    nav: { 
      home: "Главная", news: "Новости", products: "Наши продукты", beautyCoin: "Beauty Coin", 
      drBeleza: "Доктор Красоты", map: "Карта эстетики", edBeauty: "EdBeauty", 
      goldenDoctors: "Золотые доктора", clubePlus: "Клуб+", events: "События", 
      plans: "Планы", profile: "Мой профиль", control: "Управление", navigation: "Навигация"
    },
    hero: { 
      title: "Добро пожаловать", titleHighlight: "в ваш клуб", 
      subtitle: "Это эксклюзивный клуб преимуществ для тех, кто любит заботиться о себе и о более счастливой планете!", 
      cta: "Начать сейчас", learnMore: "Узнать больше", 
      members: "Члены", partners: "Партнеры", satisfaction: "Удовлетворенность",
      badge: "Эксклюзивный клуб преимуществ", premium: "Премиум",
      selfcare: "забота о себе"
    },
    benefits: { 
      title: "Полный клуб", subtitle: "преимуществ",
      why: "Почему стоит присоединиться?",
      description: "Откройте для себя все преимущества членства в крупнейшем клубе красоты и здоровья",
      exclusive: "Эксклюзивные преимущества", 
      exclusiveDesc: "Доступ к специальным скидкам в сотнях партнерских заведений красоты и эстетики.",
      selfcare: "Забота о себе",
      selfcareDesc: "Заботьтесь о себе с лучшими профессионалами и продуктами, специально подобранными для вас.",
      sustainability: "Устойчивость",
      sustainabilityDesc: "Поддерживайте бренды и профессионалов, приверженных устойчивым практикам и более здоровой планете.",
      rewards: "Награды",
      rewardsDesc: "Накапливайте баллы и выигрывайте эксклюзивные призы с каждой покупкой или использованной услугой.",
      community: "Сообщество",
      communityDesc: "Станьте частью сообщества, увлеченного красотой, здоровьем и заботой о себе.",
      experiences: "Уникальный опыт",
      experiencesDesc: "Доступ к эксклюзивным мероприятиям, мастер-классам и запускам продуктов из первых рук."
    },
    about: {
      story: "Наша история",
      storyP1: "родился из видения демократизации доступа к качественным услугам красоты и эстетики в Бразилии.",
      storyP2: "Мы создали инновационную платформу, которая не только соединяет клиентов с сертифицированными профессионалами, но и предлагает эксклюзивные преимущества, специальные скидки и заинтересованное сообщество вокруг здоровья и устойчивой красоты.",
      storyP3: "Через наш",
      storyP3b: "мы объединяем более 500 проверенных профессионалов по всей стране.",
      joinPart: "Присоединяйтесь",
      mission: "Наша миссия",
      missionDesc: "Демократизировать доступ к качественным услугам красоты и эстетики, соединяя людей с квалифицированными профессионалами, приверженными совершенству.",
      vision: "Наше видение",
      visionDesc: "Быть крупнейшей и наиболее надежной сетью красоты и эстетики в Бразилии, превращая опыт самообслуживания во что-то доступное и приятное.",
      values: "Наши ценности",
      valueSelfcare: "Забота о себе",
      valueSelfcareDesc: "Мы верим, что забота о себе - это важный акт самолюбия.",
      valueSustainability: "Устойчивость",
      valueSustainabilityDesc: "Привержены устойчивым и ответственным практикам.",
      valueCommunity: "Сообщество",
      valueCommunityDesc: "Мы строим сильную сеть профессионалов и клиентов.",
      valueExcellence: "Совершенство",
      valueExcellenceDesc: "Мы выбираем только лучших профессионалов.",
      numbersInspire: "Цифры, которые вдохновляют",
      activeMembers: "Активные участники",
      certifiedPartners: "Сертифицированные партнеры",
      citiesServed: "Обслуживаемые города"
    },
    cta: { 
      title: "Присоединяйтесь к крупнейшему клубу красоты Бразилии", 
      subtitle: "Присоединяйтесь к тысячам людей, которые уже изменили свой режим ухода за собой", 
      button: "Начать сейчас", viewBenefits: "Посмотреть преимущества"
    },
    footer: { 
      description: "Крупнейший клуб преимуществ красоты и эстетики Бразилии", 
      rights: "Все права защищены",
      community: "Сообщество", ourProducts: "Продукты",
      privacy: "Политика конфиденциальности", terms: "Условия использования"
    },
    banner: {
      signup: "Зарегистрируйтесь сейчас и получите эксклюзивные преимущества!",
      signupShort: "Регистрация и получите преимущества!"
    }
  },
  ar: {
    common: { 
      welcome: "مرحباً", loading: "جاري التحميل...", save: "حفظ", cancel: "إلغاء", 
      delete: "حذف", edit: "تعديل", search: "بحث", filter: "تصفية", 
      close: "إغلاق", yes: "نعم", no: "لا", back: "رجوع", next: "التالي", 
      submit: "إرسال", continue: "متابعة", seeMore: "رؤية المزيد", contact: "اتصل",
      startNow: "ابدأ الآن", learnMore: "اعرف المزيد", register: "تسجيل",
      joinUs: "انضم إلينا", ready: "هل أنت مستعد لتحويل روتين جمالك؟",
      joinNow: "سجل الآن وابدأ في الاستمتاع بجميع المزايا الحصرية",
      members: "عضو بالفعل جزء من مجتمعنا", viewBenefits: "عرض جميع المزايا"
    },
    nav: { 
      home: "الرئيسية", news: "الأخبار", products: "منتجاتنا", beautyCoin: "عملة الجمال", 
      drBeleza: "د. الجمال", map: "خريطة التجميل", edBeauty: "EdBeauty", 
      goldenDoctors: "الأطباء الذهبيون", clubePlus: "النادي+", events: "الفعاليات", 
      plans: "الخطط", profile: "ملفي الشخصي", control: "التحكم", navigation: "التنقل"
    },
    hero: { 
      title: "مرحباً بك", titleHighlight: "في ناديك", 
      subtitle: "هذا هو نادي المزايا الحصرية لمن يحبون العناية الذاتية وكوكب أكثر سعادة!", 
      cta: "ابدأ الآن", learnMore: "اعرف المزيد", 
      members: "الأعضاء", partners: "الشركاء", satisfaction: "الرضا",
      badge: "نادي المزايا الحصرية", premium: "مميز",
      selfcare: "العناية الذاتية"
    },
    benefits: { 
      title: "نادي كامل", subtitle: "من المزايا",
      why: "لماذا تنضم؟",
      description: "اكتشف جميع مزايا كونك جزءًا من أكبر نادي للجمال والعافية",
      exclusive: "مزايا حصرية", 
      exclusiveDesc: "الوصول إلى خصومات خاصة في مئات المؤسسات الشريكة للجمال والتجميل.",
      selfcare: "العناية الذاتية",
      selfcareDesc: "اعتن بنفسك مع أفضل المحترفين والمنتجات المختارة خصيصًا لك.",
      sustainability: "الاستدامة",
      sustainabilityDesc: "ادعم العلامات التجارية والمحترفين الملتزمين بالممارسات المستدامة وكوكب أكثر صحة.",
      rewards: "المكافآت",
      rewardsDesc: "اجمع النقاط واربح جوائز حصرية مع كل عملية شراء أو خدمة مستخدمة.",
      community: "المجتمع",
      communityDesc: "كن جزءًا من مجتمع شغوف بالجمال والعافية والعناية الذاتية.",
      experiences: "تجارب فريدة",
      experiencesDesc: "الوصول إلى أحداث حصرية وورش عمل وإطلاقات المنتجات بشكل مباشر."
    },
    about: {
      story: "قصتنا",
      storyP1: "ولد من رؤية إضفاء الطابع الديمقراطي على الوصول إلى خدمات الجمال والتجميل عالية الجودة في البرازيل.",
      storyP2: "أنشأنا منصة مبتكرة لا تربط العملاء بالمحترفين المعتمدين فحسب، بل تقدم أيضًا مزايا حصرية وخصومات خاصة ومجتمع منخرط حول العافية والجمال المستدام.",
      storyP3: "من خلال",
      storyP3b: "نجمع أكثر من 500 محترف تم التحقق منهم في جميع أنحاء البلاد.",
      joinPart: "انضم إلينا",
      mission: "مهمتنا",
      missionDesc: "إضفاء الطابع الديمقراطي على الوصول إلى خدمات الجمال والتجميل عالية الجودة، وربط الناس بالمحترفين المؤهلين الملتزمين بالتميز.",
      vision: "رؤيتنا",
      visionDesc: "أن نكون أكبر وأكثر شبكة جمال وتجميل موثوقة في البرازيل، وتحويل تجربة العناية الذاتية إلى شيء متاح وممتع.",
      values: "قيمنا",
      valueSelfcare: "العناية الذاتية",
      valueSelfcareDesc: "نعتقد أن الاعتناء بالنفس هو فعل أساسي من حب الذات.",
      valueSustainability: "الاستدامة",
      valueSustainabilityDesc: "ملتزمون بالممارسات المستدامة والمسؤولة.",
      valueCommunity: "المجتمع",
      valueCommunityDesc: "نبني شبكة قوية من المحترفين والعملاء.",
      valueExcellence: "التميز",
      valueExcellenceDesc: "نختار فقط أفضل المحترفين.",
      numbersInspire: "أرقام تلهم",
      activeMembers: "أعضاء نشطون",
      certifiedPartners: "شركاء معتمدون",
      citiesServed: "مدن مخدومة"
    },
    cta: { 
      title: "انضم إلى أكبر نادي جمال في البرازيل", 
      subtitle: "انضم إلى الآلاف من الأشخاص الذين حولوا روتين العناية الذاتية", 
      button: "ابدأ الآن", viewBenefits: "عرض المزايا"
    },
    footer: { 
      description: "أكبر نادي مزايا الجمال والتجميل في البرازيل", 
      rights: "جميع الحقوق محفوظة",
      community: "المجتمع", ourProducts: "المنتجات",
      privacy: "سياسة الخصوصية", terms: "شروط الخدمة"
    },
    banner: {
      signup: "سجل الآن واحصل على مزايا حصرية!",
      signupShort: "سجل واحصل على المزايا!"
    }
  },
  hi: {
    common: { 
      welcome: "स्वागत है", loading: "लोड हो रहा है...", save: "सहेजें", cancel: "रद्द करें", 
      delete: "हटाएं", edit: "संपादित करें", search: "खोजें", filter: "फ़िल्टर करें", 
      close: "बंद करें", yes: "हाँ", no: "नहीं", back: "वापस", next: "आगे", 
      submit: "जमा करें", continue: "जारी रखें", seeMore: "और देखें", contact: "संपर्क",
      startNow: "अभी शुरू करें", learnMore: "और जानें", register: "पंजीकरण करें",
      joinUs: "हमसे जुड़ें", ready: "अपनी सौंदर्य दिनचर्या को बदलने के लिए तैयार हैं?",
      joinNow: "अभी पंजीकरण करें और सभी विशेष लाभों का आनंद लें",
      members: "सदस्य पहले से ही हमारे समुदाय का हिस्सा हैं", viewBenefits: "सभी लाभ देखें"
    },
    nav: { 
      home: "होम", news: "समाचार", products: "हमारे उत्पाद", beautyCoin: "ब्यूटी कॉइन", 
      drBeleza: "डॉ. ब्यूटी", map: "सौंदर्य मानचित्र", edBeauty: "EdBeauty", 
      goldenDoctors: "गोल्डन डॉक्टर्स", clubePlus: "क्लब+", events: "कार्यक्रम", 
      plans: "योजनाएं", profile: "मेरी प्रोफ़ाइल", control: "नियंत्रण", navigation: "नेविगेशन"
    },
    hero: { 
      title: "स्वागत है", titleHighlight: "आपके क्लब में", 
      subtitle: "यह उन लोगों के लिए विशेष लाभ क्लब है जो आत्म-देखभाल और एक खुशहाल ग्रह से प्यार करते हैं!", 
      cta: "अभी शुरू करें", learnMore: "और जानें", 
      members: "सदस्य", partners: "साझेदार", satisfaction: "संतुष्टि",
      badge: "विशेष लाभ क्लब", premium: "प्रीमियम",
      selfcare: "आत्म-देखभाल"
    },
    benefits: { 
      title: "एक पूर्ण क्लब", subtitle: "लाभों का",
      why: "क्यों शामिल हों?",
      description: "सबसे बड़े सौंदर्य और कल्याण क्लब का हिस्सा बनने के सभी लाभों की खोज करें",
      exclusive: "विशेष लाभ", 
      exclusiveDesc: "सैकड़ों सौंदर्य और सौंदर्यशास्त्र साझेदार प्रतिष्ठानों पर विशेष छूट तक पहुंच।",
      selfcare: "आत्म-देखभाल",
      selfcareDesc: "विशेष रूप से आपके लिए चुने गए सर्वश्रेष्ठ पेशेवरों और उत्पादों के साथ अपना ध्यान रखें।",
      sustainability: "स्थिरता",
      sustainabilityDesc: "टिकाऊ प्रथाओं और एक स्वस्थ ग्रह के लिए प्रतिबद्ध ब्रांडों और पेशेवरों का समर्थन करें।",
      rewards: "पुरस्कार",
      rewardsDesc: "प्रत्येक खरीद या उपयोग की गई सेवा के साथ अंक जमा करें और विशेष पुरस्कार जीतें।",
      community: "समुदाय",
      communityDesc: "सौंदर्य, कल्याण और आत्म-देखभाल के बारे में भावुक समुदाय का हिस्सा बनें।",
      experiences: "अनोखे अनुभव",
      experiencesDesc: "विशेष कार्यक्रमों, कार्यशालाओं और उत्पाद लॉन्च तक प्रत्यक्ष पहुंच।"
    },
    about: {
      story: "हमारी कहानी",
      storyP1: "ब्राजील में गुणवत्ता सौंदर्य और सौंदर्यशास्त्र सेवाओं तक पहुंच को लोकतांत्रिक बनाने के दृष्टिकोण से पैदा हुआ।",
      storyP2: "हमने एक नवीन मंच बनाया जो न केवल ग्राहकों को प्रमाणित पेशेवरों से जोड़ता है, बल्कि विशेष लाभ, विशेष छूट और कल्याण और टिकाऊ सौंदर्य के आसपास एक लगे हुए समुदाय भी प्रदान करता है।",
      storyP3: "हमारे माध्यम से",
      storyP3b: "हम देश भर में 500 से अधिक सत्यापित पेशेवरों को एक साथ लाते हैं।",
      joinPart: "शामिल हों",
      mission: "हमारा मिशन",
      missionDesc: "गुणवत्ता सौंदर्य और सौंदर्यशास्त्र सेवाओं तक पहुंच को लोकतांत्रिक बनाना, लोगों को उत्कृष्टता के लिए प्रतिबद्ध योग्य पेशेवरों से जोड़ना।",
      vision: "हमारी दृष्टि",
      visionDesc: "ब्राजील का सबसे बड़ा और सबसे विश्वसनीय सौंदर्य और सौंदर्यशास्त्र नेटवर्क बनना, आत्म-देखभाल के अनुभव को सुलभ और सुखद चीज़ में बदलना।",
      values: "हमारे मूल्य",
      valueSelfcare: "आत्म-देखभाल",
      valueSelfcareDesc: "हम मानते हैं कि अपना ध्यान रखना आत्म-प्रेम का एक आवश्यक कार्य है।",
      valueSustainability: "स्थिरता",
      valueSustainabilityDesc: "टिकाऊ और जिम्मेदार प्रथाओं के लिए प्रतिबद्ध।",
      valueCommunity: "समुदाय",
      valueCommunityDesc: "हम पेशेवरों और ग्राहकों का एक मजबूत नेटवर्क बनाते हैं।",
      valueExcellence: "उत्कृष्टता",
      valueExcellenceDesc: "हम केवल सर्वश्रेष्ठ पेशेवरों का चयन करते हैं।",
      numbersInspire: "प्रेरक संख्याएं",
      activeMembers: "सक्रिय सदस्य",
      certifiedPartners: "प्रमाणित साझेदार",
      citiesServed: "सेवा प्रदान शहर"
    },
    cta: { 
      title: "ब्राजील के सबसे बड़े सौंदर्य क्लब में शामिल हों", 
      subtitle: "हजारों लोगों में शामिल हों जिन्होंने अपनी आत्म-देखभाल दिनचर्या बदली है", 
      button: "अभी शुरू करें", viewBenefits: "लाभ देखें"
    },
    footer: { 
      description: "ब्राजील का सबसे बड़ा सौंदर्य और सौंदर्यशास्त्र लाभ क्लब", 
      rights: "सर्वाधिकार सुरक्षित",
      community: "समुदाय", ourProducts: "उत्पाद",
      privacy: "गोपनीयता नीति", terms: "सेवा की शर्तें"
    },
    banner: {
      signup: "अभी पंजीकरण करें और विशेष लाभ प्राप्त करें!",
      signupShort: "पंजीकरण करें और लाभ प्राप्त करें!"
    }
  },
  ko: {
    common: { 
      welcome: "환영합니다", loading: "로딩 중...", save: "저장", cancel: "취소", 
      delete: "삭제", edit: "편집", search: "검색", filter: "필터", 
      close: "닫기", yes: "예", no: "아니오", back: "뒤로", next: "다음", 
      submit: "제출", continue: "계속", seeMore: "더 보기", contact: "문의",
      startNow: "지금 시작", learnMore: "자세히 알아보기", register: "등록",
      joinUs: "가입하기", ready: "뷰티 루틴을 변화시킬 준비가 되셨나요?",
      joinNow: "지금 가입하고 모든 독점 혜택을 누리세요",
      members: "명의 회원이 이미 커뮤니티에 참여하고 있습니다", viewBenefits: "모든 혜택 보기"
    },
    nav: { 
      home: "홈", news: "뉴스", products: "제품", beautyCoin: "뷰티 코인", 
      drBeleza: "닥터 뷰티", map: "미용 지도", edBeauty: "EdBeauty", 
      goldenDoctors: "골든 닥터스", clubePlus: "클럽+", events: "이벤트", 
      plans: "플랜", profile: "내 프로필", control: "관리", navigation: "탐색"
    },
    hero: { 
      title: "환영합니다", titleHighlight: "당신의 클럽에", 
      subtitle: "자기 관리와 더 행복한 지구를 사랑하는 사람들을 위한 독점 혜택 클럽입니다!", 
      cta: "지금 시작", learnMore: "자세히 알아보기", 
      members: "회원", partners: "파트너", satisfaction: "만족도",
      badge: "독점 혜택 클럽", premium: "프리미엄",
      selfcare: "자기 관리"
    },
    benefits: { 
      title: "완전한 클럽", subtitle: "혜택의",
      why: "왜 가입해야 하나요?",
      description: "가장 큰 뷰티 및 웰니스 클럽의 일원이 되는 모든 이점을 발견하세요",
      exclusive: "독점 혜택", 
      exclusiveDesc: "수백 개의 뷰티 및 미용 파트너 업체에서 특별 할인을 받으세요.",
      selfcare: "자기 관리",
      selfcareDesc: "당신을 위해 특별히 선별된 최고의 전문가와 제품으로 자신을 돌보세요.",
      sustainability: "지속 가능성",
      sustainabilityDesc: "지속 가능한 관행과 더 건강한 지구에 전념하는 브랜드와 전문가를 지원하세요.",
      rewards: "보상",
      rewardsDesc: "구매 또는 사용한 서비스마다 포인트를 적립하고 독점 상품을 받으세요.",
      community: "커뮤니티",
      communityDesc: "뷰티, 웰니스, 자기 관리에 열정적인 커뮤니티의 일원이 되세요.",
      experiences: "독특한 경험",
      experiencesDesc: "독점 이벤트, 워크샵 및 제품 출시에 직접 액세스하세요."
    },
    about: {
      story: "우리의 이야기",
      storyP1: "브라질에서 양질의 뷰티 및 미용 서비스에 대한 접근을 민주화하려는 비전에서 탄생했습니다.",
      storyP2: "우리는 고객을 인증된 전문가와 연결할 뿐만 아니라 독점 혜택, 특별 할인 및 웰니스와 지속 가능한 뷰티를 중심으로 참여하는 커뮤니티를 제공하는 혁신적인 플랫폼을 만들었습니다.",
      storyP3: "우리의",
      storyP3b: "를 통해 전국에 걸쳐 500명 이상의 검증된 전문가를 모았습니다.",
      joinPart: "참여하기",
      mission: "우리의 미션",
      missionDesc: "양질의 뷰티 및 미용 서비스에 대한 접근을 민주화하고, 우수성에 전념하는 자격을 갖춘 전문가와 사람들을 연결합니다.",
      vision: "우리의 비전",
      visionDesc: "브라질에서 가장 크고 신뢰할 수 있는 뷰티 및 미용 네트워크가 되어 자기 관리 경험을 접근 가능하고 즐거운 것으로 변화시킵니다.",
      values: "우리의 가치",
      valueSelfcare: "자기 관리",
      valueSelfcareDesc: "우리는 자신을 돌보는 것이 자기애의 필수적인 행위라고 믿습니다.",
      valueSustainability: "지속 가능성",
      valueSustainabilityDesc: "지속 가능하고 책임 있는 관행에 전념합니다.",
      valueCommunity: "커뮤니티",
      valueCommunityDesc: "전문가와 고객의 강력한 네트워크를 구축합니다.",
      valueExcellence: "우수성",
      valueExcellenceDesc: "최고의 전문가만 선택합니다.",
      numbersInspire: "영감을 주는 숫자",
      activeMembers: "활성 회원",
      certifiedPartners: "인증 파트너",
      citiesServed: "서비스 제공 도시"
    },
    cta: { 
      title: "브라질 최대 뷰티 클럽에 가입하세요", 
      subtitle: "자기 관리 루틴을 변화시킨 수천 명의 사람들과 함께하세요", 
      button: "지금 시작", viewBenefits: "혜택 보기"
    },
    footer: { 
      description: "브라질 최대 뷰티 및 미용 혜택 클럽", 
      rights: "모든 권리 보유",
      community: "커뮤니티", ourProducts: "제품",
      privacy: "개인정보 보호정책", terms: "서비스 약관"
    },
    banner: {
      signup: "지금 가입하고 독점 혜택을 받으세요!",
      signupShort: "가입하고 혜택을 받으세요!"
    }
  },
  'pt-PT': {
    common: { 
      welcome: "Bem-vindo", loading: "A carregar...", save: "Guardar", cancel: "Cancelar", 
      delete: "Eliminar", edit: "Editar", search: "Pesquisar", filter: "Filtrar", 
      close: "Fechar", yes: "Sim", no: "Não", back: "Voltar", next: "Seguinte", 
      submit: "Enviar", continue: "Continuar", seeMore: "Ver Mais", contact: "Contacto",
      startNow: "Começar Agora", learnMore: "Saber Mais", register: "Registar",
      joinUs: "Junte-se a nós", ready: "Pronto para transformar a sua rotina de beleza?",
      joinNow: "Associe-se agora e comece a usufruir de todos os benefícios exclusivos",
      members: "membros já fazem parte da nossa comunidade", viewBenefits: "Ver Todos os Benefícios"
    },
    nav: { 
      home: "Início", news: "Notícias", products: "Os Nossos Produtos", beautyCoin: "Beauty Coin", 
      drBeleza: "Dr. Beleza", map: "Mapa da Estética", edBeauty: "EdBeauty", 
      goldenDoctors: "Golden Doctors", clubePlus: "Clube+", events: "Eventos", 
      plans: "Planos", profile: "O Meu Perfil", control: "Controlo", navigation: "Navegação"
    },
    hero: { 
      title: "Bem-vindo", titleHighlight: "ao seu clube", 
      subtitle: "Este é o clube de benefícios exclusivo para quem adora o autocuidado e um planeta mais feliz!", 
      cta: "Começar Agora", learnMore: "Saber Mais", 
      members: "Associados", partners: "Parceiros", satisfaction: "Satisfação",
      badge: "Clube Exclusivo de Benefícios", premium: "Premium",
      selfcare: "autocuidado"
    },
    benefits: { 
      title: "Um clube completo", subtitle: "de benefícios",
      why: "Porquê associar-se?",
      description: "Descubra todas as vantagens de fazer parte do maior clube de beleza e bem-estar",
      exclusive: "Benefícios Exclusivos", 
      exclusiveDesc: "Acesso a descontos especiais em centenas de estabelecimentos parceiros de beleza e estética.",
      selfcare: "Autocuidado",
      selfcareDesc: "Cuide de si com os melhores profissionais e produtos selecionados especialmente para si.",
      sustainability: "Sustentabilidade",
      sustainabilityDesc: "Apoie marcas e profissionais comprometidos com práticas sustentáveis e um planeta mais saudável.",
      rewards: "Recompensas",
      rewardsDesc: "Acumule pontos e ganhe prémios exclusivos a cada compra ou serviço utilizado.",
      community: "Comunidade",
      communityDesc: "Faça parte de uma comunidade apaixonada por beleza, bem-estar e autocuidado.",
      experiences: "Experiências Únicas",
      experiencesDesc: "Acesso a eventos exclusivos, workshops e lançamentos de produtos em primeira mão."
    },
    about: {
      story: "A Nossa História",
      storyP1: "nasceu da visão de democratizar o acesso a serviços de beleza e estética de qualidade no Brasil.",
      storyP2: "Criámos uma plataforma inovadora que não apenas conecta clientes a profissionais certificados, mas também oferece benefícios exclusivos, descontos especiais e uma comunidade empenhada no bem-estar e na beleza sustentável.",
      storyP3: "Através do nosso",
      storyP3b: "reunimos mais de 500 profissionais verificados em todo o país.",
      joinPart: "Faça Parte",
      mission: "A Nossa Missão",
      missionDesc: "Democratizar o acesso a serviços de beleza e estética de qualidade, conectando pessoas a profissionais qualificados e comprometidos com a excelência.",
      vision: "A Nossa Visão",
      visionDesc: "Ser a maior e mais confiável rede de beleza e estética do Brasil, transformando a experiência de autocuidado em algo acessível e prazeroso.",
      values: "Os Nossos Valores",
      valueSelfcare: "Autocuidado",
      valueSelfcareDesc: "Acreditamos que cuidar de si mesmo é um ato de amor próprio essencial.",
      valueSustainability: "Sustentabilidade",
      valueSustainabilityDesc: "Comprometidos com práticas sustentáveis e responsáveis.",
      valueCommunity: "Comunidade",
      valueCommunityDesc: "Construímos uma rede forte de profissionais e clientes.",
      valueExcellence: "Excelência",
      valueExcellenceDesc: "Selecionamos apenas os melhores profissionais.",
      numbersInspire: "Números que Inspiram",
      activeMembers: "Membros Ativos",
      certifiedPartners: "Parceiros Certificados",
      citiesServed: "Cidades Atendidas"
    },
    cta: { 
      title: "Faça parte do maior clube de beleza do Brasil", 
      subtitle: "Junte-se a milhares de pessoas que já transformaram a sua rotina de autocuidado", 
      button: "Começar Agora", viewBenefits: "Ver Benefícios"
    },
    footer: { 
      description: "O maior clube de benefícios de beleza e estética do Brasil", 
      rights: "Todos os direitos reservados",
      community: "Comunidade", ourProducts: "Produtos",
      privacy: "Política de Privacidade", terms: "Termos de Serviço"
    },
    banner: {
      signup: "Registe-se agora e ganhe benefícios exclusivos!",
      signupShort: "Registe-se e ganhe benefícios!"
    }
  }
};

export const languages = [
  { code: 'pt', name: 'Português (BR)', flag: '🇧🇷' },
  { code: 'pt-PT', name: 'Português (PT)', flag: '🇵🇹' },
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'it', name: 'Italiano', flag: '🇮🇹' },
  { code: 'ja', name: '日本語', flag: '🇯🇵' },
  { code: 'zh', name: '中文', flag: '🇨🇳' },
  { code: 'ru', name: 'Русский', flag: '🇷🇺' },
  { code: 'ar', name: 'العربية', flag: '🇸🇦', rtl: true },
  { code: 'hi', name: 'हिन्दी', flag: '🇮🇳' },
  { code: 'ko', name: '한국어', flag: '🇰🇷' }
];

export function TranslationProvider({ children }) {
  const [currentLanguage, setCurrentLanguage] = useState('pt');
  const [forceUpdate, setForceUpdate] = useState(0);

  useEffect(() => {
    const saved = localStorage.getItem('app_language');
    const browser = navigator.language.split('-')[0];
    const initial = saved || (languages.find(l => l.code === browser || l.code === browser.toLowerCase()) ? browser : 'pt');
    setCurrentLanguage(initial);
    
    // Apply RTL for Arabic
    const lang = languages.find(l => l.code === initial);
    if (lang?.rtl) {
      document.documentElement.setAttribute('dir', 'rtl');
    } else {
      document.documentElement.setAttribute('dir', 'ltr');
    }
  }, []);

  const changeLanguage = (newLang) => {
    localStorage.setItem('app_language', newLang);
    setCurrentLanguage(newLang);
    setForceUpdate(prev => prev + 1);
    
    // Apply RTL for Arabic
    const lang = languages.find(l => l.code === newLang);
    if (lang?.rtl) {
      document.documentElement.setAttribute('dir', 'rtl');
    } else {
      document.documentElement.setAttribute('dir', 'ltr');
    }
    
    window.location.reload();
  };

  const t = (key, fallback = key) => {
    if (!translations[currentLanguage]) return fallback;
    const keys = key.split('.');
    let value = translations[currentLanguage];
    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) value = value[k];
      else return fallback;
    }
    return typeof value === 'string' ? value : fallback;
  };

  return (
    <TranslationContext.Provider value={{ currentLanguage, changeLanguage, t, forceUpdate }}>
      {children}
    </TranslationContext.Provider>
  );
}

export function useTranslation() {
  const context = useContext(TranslationContext);
  if (!context) throw new Error('useTranslation must be within TranslationProvider');
  return context;
}