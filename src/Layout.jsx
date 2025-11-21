import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { 
  Sparkles, Home, Users, Award, Info, Newspaper, Phone, Briefcase, 
  Package, CreditCard, Bot, MapPin, Map as MapIcon, Coins, 
  GraduationCap, User as UserIcon, Scan, Heart, X, MessageCircle, Crown, Shield
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarProvider,
  SidebarTrigger,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import Footer from "./components/Footer";
import DrBelezaChat from "./components/DrBelezaChat";
import SignUpPopup from "./components/SignUpPopup";
import CookieConsent from "./components/CookieConsent";
import SignUpModal from "./components/SignUpModal";
import VersionChecker from "./components/VersionChecker";
import BannerDisplay from "./components/BannerDisplay";
import MapaEsteticaSync from "./components/MapaEsteticaSync";
import { TranslationProvider } from "./components/TranslationProvider";
import LanguageSelector from "./components/LanguageSelector";

const navigationItems = [
  {
    title: "Início",
    url: createPageUrl("Home"),
    icon: Home,
  },
  {
    title: "Notícias",
    url: createPageUrl("News"),
    icon: Newspaper,
  },
  {
    title: "Nossos Produtos",
    url: createPageUrl("Products"),
    icon: Package,
  },
  {
    title: "Beauty Coin",
    url: createPageUrl("BeautyCoin"),
    icon: Coins,
  },
  {
    title: "Dr. Beleza",
    url: createPageUrl("DrBeleza"),
    icon: Bot,
  },
  {
    title: "Mapa da Estética",
    url: createPageUrl("MapaDaEstetica"),
    icon: MapPin,
  },
  {
    title: "EdBeauty",
    url: createPageUrl("EdBeauty"),
    icon: GraduationCap,
  },
  {
    title: "Golden Doctors",
    url: createPageUrl("GoldenDoctors"),
    icon: Briefcase,
  },
  {
    title: "Clube+",
    url: createPageUrl("ClubePlus"),
    icon: Heart,
  },
  {
    title: "Eventos",
    url: createPageUrl("Eventos"),
    icon: Award,
  },
  {
    title: "Planos",
    url: createPageUrl("Plans"),
    icon: Users,
  },
  {
    title: "Meu Perfil",
    url: createPageUrl("MyProfile"),
    icon: UserIcon,
  },
  {
    title: "Controle",
    url: createPageUrl("Control"),
    icon: Shield,
  },
];

export default function Layout({ children, currentPageName }) {
  const location = useLocation();
  const [showTopBanner, setShowTopBanner] = useState(true);
  const [showSignUpModal, setShowSignUpModal] = useState(false);

  const { data: user } = useQuery({
    queryKey: ['current-user-layout'],
    queryFn: async () => {
      try {
        const currentUser = await base44.auth.me();
        
        if (currentUser && (!currentUser.tipo_usuario || !currentUser.telefone || !currentUser.cpf)) {
          setShowSignUpModal(true);
        }
        
        return currentUser;
      } catch (error) {
        return null;
      }
    },
  });

  const handleWhatsAppSignup = () => {
    const whatsappNumber = "5531972595643";
    const message = encodeURIComponent("Olá! Gostaria de me cadastrar no Club da Beleza.");
    window.open(`https://wa.me/${whatsappNumber}?text=${message}`, '_blank');
  };

  useEffect(() => {
    const removeBase44Button = () => {
      const allElements = document.querySelectorAll('*');
      allElements.forEach(el => {
        const text = el.textContent?.toLowerCase() || '';
        const html = el.innerHTML?.toLowerCase() || '';
        
        if ((text.includes('edit') && text.includes('base44')) ||
            (html.includes('edit') && html.includes('base44'))) {
          if (el.tagName === 'BUTTON' || el.tagName === 'A' || el.getAttribute('role') === 'button') {
            el.remove();
          }
        }
      });

      const classPatterns = [
        '[class*="base44"]',
        '[class*="Base44"]',
        '[class*="edit"]',
        '[class*="Edit"]'
      ];
      
      classPatterns.forEach(pattern => {
        document.querySelectorAll(pattern).forEach(el => {
          const text = el.textContent?.toLowerCase() || '';
          if (text.includes('edit') && text.includes('base44')) {
            el.remove();
          }
        });
      });

      const attrPatterns = [
        '[aria-label*="edit"]',
        '[aria-label*="Edit"]',
        '[title*="edit"]',
        '[title*="Edit"]',
        '[data-*="edit"]'
      ];
      
      attrPatterns.forEach(pattern => {
        document.querySelectorAll(pattern).forEach(el => {
          const ariaLabel = el.getAttribute('aria-label')?.toLowerCase() || '';
          const title = el.getAttribute('title')?.toLowerCase() || '';
          if ((ariaLabel.includes('base44') || title.includes('base44'))) {
            el.remove();
          }
        });
      });

      document.querySelectorAll('*').forEach(el => {
        if (el.shadowRoot) {
          const shadowEls = el.shadowRoot.querySelectorAll('*');
          shadowEls.forEach(shadowEl => {
            const text = shadowEl.textContent?.toLowerCase() || '';
            if (text.includes('edit') && text.includes('base44')) {
              shadowEl.remove();
            }
          });
        }
      });

      const portals = document.querySelectorAll(
        '[data-radix-portal], [data-radix-popper-content-wrapper], [data-radix-tooltip-content]'
      );
      portals.forEach(portal => {
        const els = portal.querySelectorAll('*');
        els.forEach(el => {
          const text = el.textContent?.toLowerCase() || '';
          if (text.includes('edit') && text.includes('base44')) {
            el.remove();
          }
        });
      });

      document.querySelectorAll('button, a, [role="button"]').forEach(el => {
        const style = window.getComputedStyle(el);
        const text = el.textContent?.toLowerCase() || '';
        
        if ((style.position === 'fixed' || style.position === 'absolute') &&
            text.includes('edit') && text.includes('base44')) {
          el.remove();
        }
      });
    };

    removeBase44Button();

    const observer = new MutationObserver((mutations) => {
      removeBase44Button();
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['class', 'id', 'style', 'aria-label', 'title']
    });

    const interval = setInterval(removeBase44Button, 50);

    const events = ['DOMContentLoaded', 'load', 'mousemove', 'scroll', 'click', 'focus', 'blur', 'resize'];
    events.forEach(event => {
      window.addEventListener(event, removeBase44Button, true);
    });

    const rafLoop = () => {
      removeBase44Button();
      requestAnimationFrame(rafLoop);
    };
    rafLoop();

    return () => {
      observer.disconnect();
      clearInterval(interval);
      events.forEach(event => {
        window.removeEventListener(event, removeBase44Button, true);
      });
    };
  }, []);

  useEffect(() => {
    const style = document.createElement('style');
    style.id = 'hide-base44-button-style';
    style.innerHTML = `
      button:has-text("Edit with Base44"),
      a:has-text("Edit with Base44"),
      [aria-label*="edit" i][aria-label*="base44" i],
      [title*="edit" i][title*="base44" i],
      [class*="base44"],
      [class*="Base44"],
      [class*="edit-with"],
      [id*="base44"],
      [id*="Base44"] {
        display: none !important;
        visibility: hidden !important;
        opacity: 0 !important;
        pointer-events: none !important;
        position: absolute !important;
        left: -99999px !important;
        top: -99999px !important;
        width: 0 !important;
        height: 0 !important;
        overflow: hidden !important;
        z-index: -99999 !important;
      }

      [data-radix-portal] button,
      [data-radix-portal] a,
      [data-radix-popper-content-wrapper] button,
      [data-radix-popper-content-wrapper] a,
      [data-radix-tooltip-content] button,
      [data-radix-tooltip-content] a {
        display: none !important;
      }

      button[style*="position: fixed"],
      button[style*="position: absolute"],
      a[style*="position: fixed"],
      a[style*="position: absolute"] {
        display: none !important;
      }

      *[class*="edit"] *[class*="base"],
      *[id*="edit"] *[id*="base"] {
        display: none !important;
      }

      ::part(edit),
      ::part(base44) {
        display: none !important;
      }

      [data-base44],
      [data-edit-button] {
        display: none !important;
        content-visibility: hidden !important;
      }
    `;
    
    document.head.insertBefore(style, document.head.firstChild);

    return () => {
      const existingStyle = document.getElementById('hide-base44-button-style');
      if (existingStyle) {
        existingStyle.remove();
      }
    };
  }, []);

  return (
    <TranslationProvider>
    <SidebarProvider>
      <style>{`
        :root {
          --black-primary: #000000;
          --gold-primary: #D4AF37;
          --gold-light: #E5C158;
          --off-white: #FAFAFA;
          --gray-light: #F5F5F5;
        }
      `}</style>
      <div className="min-h-screen flex w-full bg-[#F5EFE6]">
        <Sidebar className="border-r border-gray-200 bg-black text-white">
          <SidebarHeader className="border-b border-gray-800 p-6">
            <Link to={createPageUrl("Home")} className="flex items-center gap-3 group">
              <img 
                src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/690ca5886318e973c6e913bb/2fe068660_clublogo.jpeg"
                alt="Club+ Logo"
                className="h-10 object-contain"
              />
            </Link>
          </SidebarHeader>
          
          <SidebarContent className="p-3">
            <SidebarGroup>
              <SidebarGroupLabel className="text-xs font-light text-[#D4AF37] uppercase tracking-widest px-2 py-2">
                Navegação
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {navigationItems.map((item) => {
                    if (item.title === "Controle" && user?.role !== 'admin') {
                      return null;
                    }
                    
                    return (
                      <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton 
                          asChild 
                          className={`hover:bg-gray-900 hover:text-[#D4AF37] transition-all duration-300 rounded-lg my-1 ${
                            location.pathname === item.url ? 'bg-gray-900 text-[#D4AF37] border-l-2 border-[#D4AF37]' : 'text-gray-400'
                          }`}
                        >
                          <Link to={item.url} className="flex items-center gap-3 px-4 py-3">
                            <item.icon className="w-5 h-5" />
                            <span className="font-medium">{item.title}</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    );
                  })}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>

          <SidebarFooter className="border-t border-gray-800 p-4">
            <a href="tel:+5531972595643" className="flex items-center gap-3 p-3 hover:bg-gray-900 rounded-lg transition-all duration-300 group">
              <div className="w-10 h-10 bg-[#D4AF37] rounded-full flex items-center justify-center">
                <Phone className="w-5 h-5 text-black" />
              </div>
              <div>
                <p className="text-xs text-gray-400 font-light">Contato</p>
                <p className="text-sm font-light text-white">(31) 97259-5643</p>
              </div>
            </a>
          </SidebarFooter>
        </Sidebar>

        <main className="flex-1 flex flex-col">
          <AnimatePresence>
            {showTopBanner && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="bg-white text-black overflow-hidden border-b border-[#D4AF37]"
              >
                <div className="relative">
                  <div className="max-w-7xl mx-auto px-4 py-2.5 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3 flex-1">
                      <Crown className="w-5 h-5 hidden md:block flex-shrink-0" />
                      <p className="text-sm font-medium text-center md:text-left flex-1">
                        <span className="hidden md:inline">🎉 Cadastre-se agora e ganhe benefícios exclusivos! </span>
                        <span className="md:hidden">🎉 Cadastre-se e ganhe benefícios!</span>
                      </p>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Button
                        onClick={() => setShowSignUpModal(true)}
                        size="sm"
                        className="bg-[#D4AF37] text-black hover:bg-[#E5C158] text-xs px-3 py-1 h-auto font-medium"
                      >
                        <Users className="w-3 h-3 mr-1" />
                        Cadastrar
                      </Button>
                      
                      <button
                        onClick={() => setShowTopBanner(false)}
                        className="text-white/80 hover:text-white transition-colors p-1"
                        aria-label="Fechar"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <header className="bg-white border-b border-gray-200 px-6 py-4 md:hidden sticky top-0 z-50">
            <div className="flex items-center gap-4 justify-between">
              <div className="flex items-center gap-4">
                <SidebarTrigger className="hover:bg-gray-100 p-2 rounded-lg transition-colors duration-200 text-black" />
                <img 
                  src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/690ca5886318e973c6e913bb/2fe068660_clublogo.jpeg"
                  alt="Club+ Logo"
                  className="h-8 object-contain"
                />
              </div>
              <LanguageSelector />
            </div>
          </header>

          <div className="flex-1 overflow-auto">
            {children}
            <Footer />
          </div>
        </main>

        <DrBelezaChat />
        <SignUpPopup />
        <CookieConsent />
        <VersionChecker />
        <BannerDisplay />
        <MapaEsteticaSync />
        
        {showSignUpModal && (
          <SignUpModal onClose={() => setShowSignUpModal(false)} />
        )}
      </div>
    </SidebarProvider>
    </TranslationProvider>
  );
}