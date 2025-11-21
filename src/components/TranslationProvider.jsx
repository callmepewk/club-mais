import React, { createContext, useContext, useState, useEffect } from 'react';

const TranslationContext = createContext();

const translations = {
  pt: {
    common: { welcome: "Bem-vindo", loading: "Carregando...", save: "Salvar", cancel: "Cancelar", delete: "Excluir", edit: "Editar", search: "Buscar", filter: "Filtrar", close: "Fechar", yes: "Sim", no: "Não", back: "Voltar", next: "Próximo", submit: "Enviar", continue: "Continuar" },
    nav: { home: "Início", news: "Notícias", products: "Nossos Produtos", beautyCoin: "Beauty Coin", drBeleza: "Dr. Beleza", map: "Mapa da Estética", edBeauty: "EdBeauty", goldenDoctors: "Golden Doctors", clubePlus: "Clube+", events: "Eventos", plans: "Planos", profile: "Meu Perfil", control: "Controle", contact: "Contato" },
    hero: { title: "Transforme sua", titleHighlight: "Beleza", subtitle: "O maior clube de benefícios exclusivos para quem valoriza beleza, estética e autocuidado", cta: "Começar Agora", learnMore: "Saiba Mais", members: "Associados", partners: "Parceiros", satisfaction: "Satisfação" },
    benefits: { title: "Benefícios Exclusivos", subtitle: "Tudo o que você precisa em um só lugar" },
    cta: { title: "Faça parte do maior clube de beleza do Brasil", subtitle: "Junte-se a milhares de pessoas que já transformaram sua rotina de autocuidado", button: "Começar Agora" },
    footer: { description: "O maior clube de benefícios de beleza e estética do Brasil", rights: "Todos os direitos reservados" }
  },
  en: null, es: null, fr: null, de: null, it: null, ja: null, zh: null, ru: null, ar: null
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