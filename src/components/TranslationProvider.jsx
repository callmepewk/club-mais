import React, { createContext, useContext, useState, useEffect } from 'react';

const TranslationContext = createContext();

const translations = {
  pt: {
    common: { 
      welcome: "Bem-vindo", loading: "Carregando...", save: "Salvar", cancel: "Cancelar", 
      delete: "Excluir", edit: "Editar", search: "Buscar", filter: "Filtrar", 
      close: "Fechar", yes: "Sim", no: "Não", back: "Voltar", next: "Próximo", 
      submit: "Enviar", continue: "Continuar", seeMore: "Ver Mais", contact: "Contato",
      startNow: "Começar Agora", learnMore: "Saiba Mais", register: "Cadastrar"
    },
    nav: { 
      home: "Início", news: "Notícias", products: "Nossos Produtos", beautyCoin: "Beauty Coin", 
      drBeleza: "Dr. Beleza", map: "Mapa da Estética", edBeauty: "EdBeauty", 
      goldenDoctors: "Golden Doctors", clubePlus: "Clube+", events: "Eventos", 
      plans: "Planos", profile: "Meu Perfil", control: "Controle", navigation: "Navegação"
    },
    hero: { 
      title: "Transforme sua", titleHighlight: "Beleza", 
      subtitle: "O maior clube de benefícios exclusivos para quem valoriza beleza, estética e autocuidado", 
      cta: "Começar Agora", learnMore: "Saiba Mais", 
      members: "Associados", partners: "Parceiros", satisfaction: "Satisfação",
      badge: "Clube Exclusivo de Benefícios",
      welcome: "Bem-vindo ao seu clube",
      description: "Este é o clube de benefícios exclusivo para quem ama o autocuidado e um planeta mais feliz!",
      statsMembers: "Associados", statsPartners: "Parceiros", statsSatisfaction: "Satisfação"
    },
    benefits: { 
      title: "Benefícios Exclusivos", subtitle: "Tudo o que você precisa em um só lugar",
      exclusive: "Acesso Exclusivo", discounts: "Descontos em Estabelecimentos",
      education: "Conteúdo Educacional", coins: "Sistema de Recompensas"
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
      startNow: "Start Now", learnMore: "Learn More", register: "Register"
    },
    nav: { 
      home: "Home", news: "News", products: "Our Products", beautyCoin: "Beauty Coin", 
      drBeleza: "Dr. Beauty", map: "Aesthetic Map", edBeauty: "EdBeauty", 
      goldenDoctors: "Golden Doctors", clubePlus: "Club+", events: "Events", 
      plans: "Plans", profile: "My Profile", control: "Control", navigation: "Navigation"
    },
    hero: { 
      title: "Transform your", titleHighlight: "Beauty", 
      subtitle: "The largest exclusive benefits club for those who value beauty, aesthetics and self-care", 
      cta: "Start Now", learnMore: "Learn More", 
      members: "Members", partners: "Partners", satisfaction: "Satisfaction",
      badge: "Exclusive Benefits Club",
      welcome: "Welcome to your club",
      description: "This is the exclusive benefits club for those who love self-care and a happier planet!",
      statsMembers: "Members", statsPartners: "Partners", statsSatisfaction: "Satisfaction"
    },
    benefits: { 
      title: "Exclusive Benefits", subtitle: "Everything you need in one place",
      exclusive: "Exclusive Access", discounts: "Discounts at Establishments",
      education: "Educational Content", coins: "Rewards System"
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
      startNow: "Comenzar Ahora", learnMore: "Saber Más", register: "Registrarse"
    },
    nav: { 
      home: "Inicio", news: "Noticias", products: "Nuestros Productos", beautyCoin: "Beauty Coin", 
      drBeleza: "Dr. Belleza", map: "Mapa de Estética", edBeauty: "EdBeauty", 
      goldenDoctors: "Golden Doctors", clubePlus: "Club+", events: "Eventos", 
      plans: "Planes", profile: "Mi Perfil", control: "Control", navigation: "Navegación"
    },
    hero: { 
      title: "Transforma tu", titleHighlight: "Belleza", 
      subtitle: "El mayor club de beneficios exclusivos para quienes valoran la belleza, estética y autocuidado", 
      cta: "Comenzar Ahora", learnMore: "Saber Más", 
      members: "Asociados", partners: "Socios", satisfaction: "Satisfacción",
      badge: "Club Exclusivo de Beneficios",
      welcome: "Bienvenido a tu club",
      description: "¡Este es el club de beneficios exclusivo para quienes aman el autocuidado y un planeta más feliz!",
      statsMembers: "Asociados", statsPartners: "Socios", statsSatisfaction: "Satisfacción"
    },
    benefits: { 
      title: "Beneficios Exclusivos", subtitle: "Todo lo que necesitas en un solo lugar",
      exclusive: "Acceso Exclusivo", discounts: "Descuentos en Establecimientos",
      education: "Contenido Educativo", coins: "Sistema de Recompensas"
    },
    cta: { 
      title: "Forma parte del mayor club de belleza de Brasil", 
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
      startNow: "Commencer Maintenant", learnMore: "En Savoir Plus", register: "S'inscrire"
    },
    nav: { 
      home: "Accueil", news: "Actualités", products: "Nos Produits", beautyCoin: "Beauty Coin", 
      drBeleza: "Dr. Beauté", map: "Carte Esthétique", edBeauty: "EdBeauty", 
      goldenDoctors: "Golden Doctors", clubePlus: "Club+", events: "Événements", 
      plans: "Plans", profile: "Mon Profil", control: "Contrôle", navigation: "Navigation"
    },
    hero: { 
      title: "Transformez votre", titleHighlight: "Beauté", 
      subtitle: "Le plus grand club d'avantages exclusifs pour ceux qui valorisent la beauté, l'esthétique et les soins personnels", 
      cta: "Commencer Maintenant", learnMore: "En Savoir Plus", 
      members: "Membres", partners: "Partenaires", satisfaction: "Satisfaction",
      badge: "Club de Bénéfices Exclusifs",
      welcome: "Bienvenue dans votre club",
      description: "C'est le club d'avantages exclusifs pour ceux qui aiment prendre soin d'eux et une planète plus heureuse!",
      statsMembers: "Membres", statsPartners: "Partenaires", statsSatisfaction: "Satisfaction"
    },
    benefits: { 
      title: "Avantages Exclusifs", subtitle: "Tout ce dont vous avez besoin en un seul endroit",
      exclusive: "Accès Exclusif", discounts: "Réductions dans les Établissements",
      education: "Contenu Éducatif", coins: "Système de Récompenses"
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
      startNow: "Jetzt Starten", learnMore: "Mehr Erfahren", register: "Registrieren"
    },
    nav: { 
      home: "Startseite", news: "Nachrichten", products: "Unsere Produkte", beautyCoin: "Beauty Coin", 
      drBeleza: "Dr. Schönheit", map: "Ästhetik-Karte", edBeauty: "EdBeauty", 
      goldenDoctors: "Golden Doctors", clubePlus: "Club+", events: "Veranstaltungen", 
      plans: "Pläne", profile: "Mein Profil", control: "Kontrolle", navigation: "Navigation"
    },
    hero: { 
      title: "Verwandeln Sie Ihre", titleHighlight: "Schönheit", 
      subtitle: "Der größte exklusive Vorteils-Club für alle, die Schönheit, Ästhetik und Selbstpflege schätzen", 
      cta: "Jetzt Starten", learnMore: "Mehr Erfahren", 
      members: "Mitglieder", partners: "Partner", satisfaction: "Zufriedenheit",
      badge: "Exklusiver Vorteils-Club",
      welcome: "Willkommen in Ihrem Club",
      description: "Dies ist der exklusive Vorteils-Club für diejenigen, die Selbstpflege und einen glücklicheren Planeten lieben!",
      statsMembers: "Mitglieder", statsPartners: "Partner", statsSatisfaction: "Zufriedenheit"
    },
    benefits: { 
      title: "Exklusive Vorteile", subtitle: "Alles, was Sie brauchen, an einem Ort",
      exclusive: "Exklusiver Zugang", discounts: "Rabatte in Einrichtungen",
      education: "Bildungsinhalte", coins: "Belohnungssystem"
    },
    cta: { 
      title: "Werden Sie Teil von Brasiliens größtem Beauty-Club", 
      subtitle: "Schließen Sie sich Tausenden von Menschen an, die ihre Selbstpflege-Routine transformiert haben", 
      button: "Jetzt Starten", viewBenefits: "Vorteile Anzeigen"
    },
    footer: { 
      description: "Brasiliens größter Beauty- und Ästhetik-Vorteils-Club", 
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
      startNow: "Inizia Ora", learnMore: "Scopri di Più", register: "Registrati"
    },
    nav: { 
      home: "Home", news: "Notizie", products: "I Nostri Prodotti", beautyCoin: "Beauty Coin", 
      drBeleza: "Dr. Bellezza", map: "Mappa Estetica", edBeauty: "EdBeauty", 
      goldenDoctors: "Golden Doctors", clubePlus: "Club+", events: "Eventi", 
      plans: "Piani", profile: "Il Mio Profilo", control: "Controllo", navigation: "Navigazione"
    },
    hero: { 
      title: "Trasforma la tua", titleHighlight: "Bellezza", 
      subtitle: "Il più grande club di vantaggi esclusivi per chi apprezza bellezza, estetica e cura di sé", 
      cta: "Inizia Ora", learnMore: "Scopri di Più", 
      members: "Membri", partners: "Partner", satisfaction: "Soddisfazione",
      badge: "Club di Vantaggi Esclusivi",
      welcome: "Benvenuto nel tuo club",
      description: "Questo è il club di vantaggi esclusivi per chi ama la cura di sé e un pianeta più felice!",
      statsMembers: "Membri", statsPartners: "Partner", statsSatisfaction: "Soddisfazione"
    },
    benefits: { 
      title: "Vantaggi Esclusivi", subtitle: "Tutto ciò di cui hai bisogno in un unico posto",
      exclusive: "Accesso Esclusivo", discounts: "Sconti presso Strutture",
      education: "Contenuti Educativi", coins: "Sistema di Ricompense"
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
      startNow: "今すぐ始める", learnMore: "詳細を見る", register: "登録"
    },
    nav: { 
      home: "ホーム", news: "ニュース", products: "製品", beautyCoin: "ビューティーコイン", 
      drBeleza: "Dr. ビューティー", map: "美容マップ", edBeauty: "EdBeauty", 
      goldenDoctors: "ゴールデンドクターズ", clubePlus: "クラブ+", events: "イベント", 
      plans: "プラン", profile: "マイプロフィール", control: "コントロール", navigation: "ナビゲーション"
    },
    hero: { 
      title: "あなたの", titleHighlight: "美しさを変える", 
      subtitle: "美容、エステティック、セルフケアを大切にする方のための最大の限定特典クラブ", 
      cta: "今すぐ始める", learnMore: "詳細を見る", 
      members: "会員", partners: "パートナー", satisfaction: "満足度",
      badge: "限定特典クラブ",
      welcome: "クラブへようこそ",
      description: "セルフケアとより幸せな地球を愛する人のための限定特典クラブです！",
      statsMembers: "会員", statsPartners: "パートナー", statsSatisfaction: "満足度"
    },
    benefits: { 
      title: "限定特典", subtitle: "必要なものすべてが一か所に",
      exclusive: "限定アクセス", discounts: "施設での割引",
      education: "教育コンテンツ", coins: "報酬システム"
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
      startNow: "立即开始", learnMore: "了解更多", register: "注册"
    },
    nav: { 
      home: "首页", news: "新闻", products: "我们的产品", beautyCoin: "美丽币", 
      drBeleza: "美丽博士", map: "美容地图", edBeauty: "EdBeauty", 
      goldenDoctors: "黄金医生", clubePlus: "俱乐部+", events: "活动", 
      plans: "计划", profile: "我的资料", control: "控制", navigation: "导航"
    },
    hero: { 
      title: "改变你的", titleHighlight: "美丽", 
      subtitle: "为重视美容、美学和自我护理的人提供的最大独家福利俱乐部", 
      cta: "立即开始", learnMore: "了解更多", 
      members: "会员", partners: "合作伙伴", satisfaction: "满意度",
      badge: "独家福利俱乐部",
      welcome: "欢迎来到您的俱乐部",
      description: "这是为热爱自我护理和更快乐星球的人提供的独家福利俱乐部！",
      statsMembers: "会员", statsPartners: "合作伙伴", statsSatisfaction: "满意度"
    },
    benefits: { 
      title: "独家福利", subtitle: "您需要的一切都在一个地方",
      exclusive: "独家访问", discounts: "机构折扣",
      education: "教育内容", coins: "奖励系统"
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
      startNow: "Начать сейчас", learnMore: "Узнать больше", register: "Зарегистрироваться"
    },
    nav: { 
      home: "Главная", news: "Новости", products: "Наши продукты", beautyCoin: "Beauty Coin", 
      drBeleza: "Доктор Красоты", map: "Карта эстетики", edBeauty: "EdBeauty", 
      goldenDoctors: "Золотые доктора", clubePlus: "Клуб+", events: "События", 
      plans: "Планы", profile: "Мой профиль", control: "Управление", navigation: "Навигация"
    },
    hero: { 
      title: "Преобразите вашу", titleHighlight: "Красоту", 
      subtitle: "Крупнейший клуб эксклюзивных преимуществ для тех, кто ценит красоту, эстетику и уход за собой", 
      cta: "Начать сейчас", learnMore: "Узнать больше", 
      members: "Члены", partners: "Партнеры", satisfaction: "Удовлетворенность",
      badge: "Эксклюзивный клуб преимуществ",
      welcome: "Добро пожаловать в ваш клуб",
      description: "Это эксклюзивный клуб преимуществ для тех, кто любит заботиться о себе и о более счастливой планете!",
      statsMembers: "Члены", statsPartners: "Партнеры", statsSatisfaction: "Удовлетворенность"
    },
    benefits: { 
      title: "Эксклюзивные преимущества", subtitle: "Все, что вам нужно, в одном месте",
      exclusive: "Эксклюзивный доступ", discounts: "Скидки в заведениях",
      education: "Образовательный контент", coins: "Система вознаграждений"
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
      startNow: "ابدأ الآن", learnMore: "اعرف المزيد", register: "تسجيل"
    },
    nav: { 
      home: "الرئيسية", news: "الأخبار", products: "منتجاتنا", beautyCoin: "عملة الجمال", 
      drBeleza: "د. الجمال", map: "خريطة التجميل", edBeauty: "EdBeauty", 
      goldenDoctors: "الأطباء الذهبيون", clubePlus: "النادي+", events: "الفعاليات", 
      plans: "الخطط", profile: "ملفي الشخصي", control: "التحكم", navigation: "التنقل"
    },
    hero: { 
      title: "حول", titleHighlight: "جمالك", 
      subtitle: "أكبر نادي للمزايا الحصرية لمن يقدرون الجمال والتجميل والعناية الذاتية", 
      cta: "ابدأ الآن", learnMore: "اعرف المزيد", 
      members: "الأعضاء", partners: "الشركاء", satisfaction: "الرضا",
      badge: "نادي المزايا الحصرية",
      welcome: "مرحباً بك في ناديك",
      description: "هذا هو نادي المزايا الحصرية لمن يحبون العناية الذاتية وكوكب أكثر سعادة!",
      statsMembers: "الأعضاء", statsPartners: "الشركاء", statsSatisfaction: "الرضا"
    },
    benefits: { 
      title: "مزايا حصرية", subtitle: "كل ما تحتاجه في مكان واحد",
      exclusive: "وصول حصري", discounts: "خصومات في المؤسسات",
      education: "محتوى تعليمي", coins: "نظام المكافآت"
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
  }
};

export const languages = [
  { code: 'pt', name: 'Português (BR)', flag: '🇧🇷' },
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'it', name: 'Italiano', flag: '🇮🇹' },
  { code: 'ja', name: '日本語', flag: '🇯🇵' },
  { code: 'zh', name: '中文', flag: '🇨🇳' },
  { code: 'ru', name: 'Русский', flag: '🇷🇺' },
  { code: 'ar', name: 'العربية', flag: '🇸🇦' }
];

export function TranslationProvider({ children }) {
  const [currentLanguage, setCurrentLanguage] = useState('pt');
  const [forceUpdate, setForceUpdate] = useState(0);

  useEffect(() => {
    const saved = localStorage.getItem('app_language');
    const browser = navigator.language.split('-')[0];
    const initial = saved || (languages.find(l => l.code === browser) ? browser : 'pt');
    setCurrentLanguage(initial);
  }, []);

  const changeLanguage = (newLang) => {
    localStorage.setItem('app_language', newLang);
    setCurrentLanguage(newLang);
    setForceUpdate(prev => prev + 1);
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