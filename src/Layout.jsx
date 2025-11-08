
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
        
        // Check if user needs to complete registration
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

  // ULTRA-AGGRESSIVE: Remove "Edit with Base44" button
  useEffect(() => {
    const removeBase44Button = () => {
      // Method 1: Remove by class
      const buttons = document.querySelectorAll('[class*="base44" i], [class*="edit" i]');
      buttons.forEach(btn => {
        const text = btn.textContent?.toLowerCase() || '';
        if (text.includes('edit') && text.includes('base44')) {
          btn.remove();
        }
      });

      // Method 2: Remove by text content
      const allButtons = document.querySelectorAll('button, a, div[role="button"]');
      allButtons.forEach(btn => {
        const text = btn.textContent?.toLowerCase() || '';
        if (text.includes('edit') && text.includes('base44')) {
          btn.remove();
        }
      });

      // Method 3: Remove by aria-label
      const ariaButtons = document.querySelectorAll('[aria-label*="edit" i], [aria-label*="base44" i]');
      ariaButtons.forEach(btn => {
        const ariaLabel = btn.getAttribute('aria-label')?.toLowerCase() || '';
        if (ariaLabel.includes('edit') && ariaLabel.includes('base44')) {
          btn.remove();
        }
      });

      // Method 4: Remove by title
      const titleButtons = document.querySelectorAll('[title*="edit" i], [title*="base44" i]');
      titleButtons.forEach(btn => {
        const titleText = btn.getAttribute('title')?.toLowerCase() || '';
        if (titleText.includes('edit') && titleText.includes('base44')) {
          btn.remove();
        }
      });

      // Method 5: Check shadow DOM
      const allElements = document.querySelectorAll('*');
      allElements.forEach(el => {
        if (el.shadowRoot) {
          const shadowButtons = el.shadowRoot.querySelectorAll('button, a, div[role="button"]');
          shadowButtons.forEach(btn => {
            const text = btn.textContent?.toLowerCase() || '';
            if (text.includes('edit') && text.includes('base44')) {
              btn.remove();
            }
          });
        }
      });

      // Method 6: Remove Radix Portal content
      const portals = document.querySelectorAll('[data-radix-portal], [data-radix-popper-content-wrapper]');
      portals.forEach(portal => {
        const buttonsInPortal = portal.querySelectorAll('button, a');
        buttonsInPortal.forEach(btn => {
          const text = btn.textContent?.toLowerCase() || '';
          if (text.includes('edit') && text.includes('base44')) {
            btn.remove();
          }
        });
      });
    };

    // Execute immediately
    removeBase44Button();

    // Execute on DOM changes (MutationObserver)
    const observer = new MutationObserver(() => {
      removeBase44Button();
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['class', 'id', 'style', 'aria-label', 'title'] // Watch for relevant attribute changes
    });

    // Execute repeatedly with setInterval (backup)
    const interval = setInterval(removeBase44Button, 100);

    // Execute on common events
    const events = ['DOMContentLoaded', 'load', 'mousemove', 'scroll', 'click', 'animationend', 'transitionend']; // Added more events
    events.forEach(event => {
      window.addEventListener(event, removeBase44Button);
    });

    // Cleanup
    return () => {
      observer.disconnect();
      clearInterval(interval);
      events.forEach(event => {
        window.removeEventListener(event, removeBase44Button);
      });
    };
  }, []);

  // CSS to hide any potential button
  useEffect(() => {
    const style = document.createElement('style');
    style.innerHTML = `
      /* Hide Base44 Edit Button - Multiple Strategies (Valid CSS only) */
      [class*="base44" i],
      [aria-label*="edit" i][aria-label*="base44" i],
      [title*="edit" i][title*="base44" i],
      /* Specific selector if a known pattern exists */
      /* For example, if there's a specific data attribute like data-base44-editor-button */
      /* [data-base44-editor-button] { display: none !important; } */

      /* Hide in Radix portals */
      [data-radix-portal] button[class*="edit" i],
      [data-radix-portal] a[class*="edit" i],
      [data-radix-popper-content-wrapper] button[class*="edit" i],
      [data-radix-popper-content-wrapper] a[class*="edit" i] {
        display: none !important;
        visibility: hidden !important;
        opacity: 0 !important;
        pointer-events: none !important;
        position: absolute !important;
        left: -9999px !important;
        width: 0 !important;
        height: 0 !important;
        overflow: hidden !important;
      }
    `;
    document.head.appendChild(style);

    return () => {
      // Only remove if it's still attached to the head
      if (document.head.contains(style)) {
        document.head.removeChild(style);
      }
    };
  }, []);

  return (
    <SidebarProvider>
      <style>{`
        :root {
          --gold: #D4AF37;
          --gold-light: #E8DCC4;
          --beige: #F5EFE6;
          --beige-dark: #E8DCC4;
          --accent-gold: #C8A882;
        }
      `}</style>
      <div className="min-h-screen flex w-full bg-[#F5EFE6]">
        <Sidebar className="border-r border-[#E8DCC4] bg-white/95 backdrop-blur-sm">
          <SidebarHeader className="border-b border-[#E8DCC4] p-6">
            <Link to={createPageUrl("Home")} className="flex items-center gap-3 group">
              <div className="w-12 h-12 bg-gradient-to-br from-[#D4AF37] to-[#C8A882] rounded-full flex items-center justify-center shadow-lg">
                <img 
                  src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/user_68ca933db3f173d5b5ee5174/424de1767_clubeimg.jpeg"
                  alt="Club Logo"
                  className="w-8 h-8 object-contain"
                />
              </div>
              <div>
                <h2 className="font-serif text-xl font-bold bg-gradient-to-r from-[#D4AF37] to-[#C8A882] bg-clip-text text-transparent">
                  Club da Beleza
                </h2>
                <p className="text-xs text-[#C8A882]">Seu clube de benefícios</p>
              </div>
            </Link>
          </SidebarHeader>
          
          <SidebarContent className="p-3">
            <SidebarGroup>
              <SidebarGroupLabel className="text-xs font-medium text-[#C8A882] uppercase tracking-wider px-2 py-2">
                Navegação
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {navigationItems.map((item) => {
                    // Hide Control menu item for non-admins
                    if (item.title === "Controle" && user?.role !== 'admin') {
                      return null;
                    }
                    
                    return (
                      <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton 
                          asChild 
                          className={`hover:bg-[#F5EFE6] hover:text-[#D4AF37] transition-all duration-300 rounded-xl my-1 ${
                            location.pathname === item.url ? 'bg-gradient-to-r from-[#F5EFE6] to-[#E8DCC4] text-[#D4AF37] shadow-sm' : ''
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

          <SidebarFooter className="border-t border-[#E8DCC4] p-4">
            <a href="tel:+5531972595643" className="flex items-center gap-3 p-3 hover:bg-[#F5EFE6] rounded-xl transition-all duration-300 group">
              <div className="w-10 h-10 bg-gradient-to-br from-[#D4AF37] to-[#C8A882] rounded-full flex items-center justify-center">
                <Phone className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-xs text-[#C8A882] font-medium">Contato</p>
                <p className="text-sm font-semibold text-gray-800">(31) 97259-5643</p>
              </div>
            </a>
          </SidebarFooter>
        </Sidebar>

        <main className="flex-1 flex flex-col">
          {/* Top Signup Banner */}
          <AnimatePresence>
            {showTopBanner && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="bg-gradient-to-r from-[#D4AF37] via-[#C8A882] to-[#D4AF37] text-white overflow-hidden"
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
                        className="bg-white text-[#D4AF37] hover:bg-white/90 text-xs px-3 py-1 h-auto font-semibold"
                      >
                        <Users className="w-3 h-3 mr-1" />
                        Registrar
                      </Button>
                      
                      <Button
                        onClick={handleWhatsAppSignup}
                        size="sm"
                        className="bg-white text-[#D4AF37] hover:bg-white/90 text-xs px-3 py-1 h-auto font-semibold"
                      >
                        <MessageCircle className="w-3 h-3 mr-1" />
                        WhatsApp
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

          {/* Mobile Header */}
          <header className="bg-white/80 backdrop-blur-md border-b border-[#E8DCC4] px-6 py-4 md:hidden sticky top-0 z-50">
            <div className="flex items-center gap-4">
              <SidebarTrigger className="hover:bg-[#F5EFE6] p-2 rounded-lg transition-colors duration-200" />
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[#D4AF37]" />
                <h1 className="text-lg font-serif font-semibold bg-gradient-to-r from-[#D4AF37] to-[#C8A882] bg-clip-text text-transparent">
                  Club da Beleza
                </h1>
              </div>
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
        
        {/* Sign Up Modal */}
        {showSignUpModal && (
          <SignUpModal onClose={() => setShowSignUpModal(false)} />
        )}
      </div>
    </SidebarProvider>
  );
}
