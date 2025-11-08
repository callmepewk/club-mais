
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
      // Method 1: Remove by text content and HTML content (most aggressive, targeting any element)
      const allElements = document.querySelectorAll('*');
      allElements.forEach(el => {
        const text = el.textContent?.toLowerCase() || '';
        const html = el.innerHTML?.toLowerCase() || '';
        
        if ((text.includes('edit') && text.includes('base44')) ||
            (html.includes('edit') && html.includes('base44'))) {
          // Add a check to prevent removing the entire body or too broad elements
          if (el.tagName !== 'BODY' && el.tagName !== 'HTML' && el.parentElement) {
            // Attempt to remove the element itself or its closest interactive parent
            if (el.tagName === 'BUTTON' || el.tagName === 'A' || el.getAttribute('role') === 'button' || el.getAttribute('aria-label')?.toLowerCase().includes('edit') || el.getAttribute('title')?.toLowerCase().includes('edit')) {
              el.remove();
            } else {
              // If not an interactive element, try to remove its closest interactive parent
              let current = el;
              let removed = false;
              while(current && current !== document.body && current !== document.documentElement) {
                if (current.tagName === 'BUTTON' || current.tagName === 'A' || current.getAttribute('role') === 'button' || current.getAttribute('aria-label')?.toLowerCase().includes('edit') || current.getAttribute('title')?.toLowerCase().includes('edit')) {
                  current.remove();
                  removed = true;
                  break;
                }
                current = current.parentElement;
              }
              if (!removed && el.parentElement && el.children.length === 0) { // If it's a leaf node with the text
                el.remove();
              }
            }
          }
        }
      });

      // Method 2: Remove by class patterns
      const classPatterns = [
        '[class*="base44" i]',
        '[class*="edit-with" i]',
        '[class*="base44-editor" i]'
      ];
      
      classPatterns.forEach(pattern => {
        document.querySelectorAll(pattern).forEach(el => {
          const text = el.textContent?.toLowerCase() || '';
          if (text.includes('edit') && text.includes('base44')) {
            el.remove();
          }
        });
      });

      // Method 3: Remove by attributes
      const attrPatterns = [
        '[aria-label*="edit" i]',
        '[title*="edit" i]',
        '[data-base44-editor]',
        '[data-base44-edit-button]'
      ];
      
      attrPatterns.forEach(pattern => {
        document.querySelectorAll(pattern).forEach(el => {
          const ariaLabel = el.getAttribute('aria-label')?.toLowerCase() || '';
          const title = el.getAttribute('title')?.toLowerCase() || '';
          if ((ariaLabel.includes('base44') || title.includes('base44')) || el.hasAttribute('data-base44-editor') || el.hasAttribute('data-base44-edit-button')) {
            el.remove();
          }
        });
      });

      // Method 4: Check shadow DOM
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

      // Method 5: Remove Radix/Portal content
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

      // Method 6: Remove fixed/absolute positioned suspicious elements
      document.querySelectorAll('button, a, [role="button"], div').forEach(el => { // Include div as it might be a container
        const style = window.getComputedStyle(el);
        const text = el.textContent?.toLowerCase() || '';
        
        if ((style.position === 'fixed' || style.position === 'absolute') &&
            text.includes('edit') && text.includes('base44')) {
          el.remove();
        }
      });
    };

    // Execute immediately
    removeBase44Button();

    // MutationObserver for DOM changes
    const observer = new MutationObserver((mutations) => {
      // Small debounce for observer to avoid excessive calls
      clearTimeout(window._base44_remove_debounce);
      window._base44_remove_debounce = setTimeout(removeBase44Button, 50);
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['class', 'id', 'style', 'aria-label', 'title', 'data-base44-editor', 'data-base44-edit-button']
    });

    // Interval backup (every 50ms for maximum coverage)
    const interval = setInterval(removeBase44Button, 50);

    // Event listeners for common triggers (capture phase for earlier detection)
    const events = ['DOMContentLoaded', 'load', 'mousemove', 'scroll', 'click', 'focusin', 'focusout', 'resize', 'transitionend', 'animationend'];
    events.forEach(event => {
      window.addEventListener(event, removeBase44Button, true);
    });

    // RequestAnimationFrame loop (catches async renders more smoothly)
    let animationFrameId;
    const rafLoop = () => {
      removeBase44Button();
      animationFrameId = requestAnimationFrame(rafLoop);
    };
    rafLoop();

    // Cleanup
    return () => {
      observer.disconnect();
      clearInterval(interval);
      clearTimeout(window._base44_remove_debounce);
      cancelAnimationFrame(animationFrameId);
      events.forEach(event => {
        window.removeEventListener(event, removeBase44Button, true);
      });
    };
  }, []);

  // CSS to hide any potential button (multiple layers)
  useEffect(() => {
    const style = document.createElement('style');
    style.id = 'hide-base44-button-style';
    style.innerHTML = `
      /* ULTRA-AGGRESSIVE HIDE - Layer 1: Direct targeting by attributes/classes */
      [aria-label*="edit" i][aria-label*="base44" i],
      [title*="edit" i][title*="base44" i],
      [class*="base44" i],
      [class*="Base44" i],
      [class*="edit-with" i],
      [class*="base44-editor" i],
      [id*="base44" i],
      [id*="Base44" i],
      [data-base44-editor],
      [data-base44-edit-button],
      [data-base44-toolbar],
      /* Broader class/ID matches combined */
      [class*="edit" i][class*="base" i],
      [id*="edit" i][id*="base" i] {
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
        content-visibility: hidden !important; /* modern property */
      }

      /* Layer 2: Radix UI Portals - targeting any element inside with base44 identifiers */
      [data-radix-portal] [class*="base44" i],
      [data-radix-portal] [aria-label*="base44" i],
      [data-radix-portal] [data-base44-editor],
      [data-radix-popper-content-wrapper] [class*="base44" i],
      [data-radix-popper-content-wrapper] [aria-label*="base44" i],
      [data-radix-popper-content-wrapper] [data-base44-editor],
      [data-radix-tooltip-content] [class*="base44" i],
      [data-radix-tooltip-content] [aria-label*="base44" i],
      [data-radix-tooltip-content] [data-base44-editor] {
        display: none !important;
      }

      /* Layer 3: Fixed/Absolute positioned elements (targeting parent or child) */
      /* If the container is fixed/absolute AND contains a base44 identifier */
      [style*="position: fixed"] [class*="base44" i],
      [style*="position: absolute"] [class*="base44" i],
      [style*="position: fixed"] [aria-label*="base44" i],
      [style*="position: absolute"] [aria-label*="base44" i],
      /* If the element itself is fixed/absolute AND has a base44 identifier */
      [class*="base44" i][style*="position: fixed"],
      [class*="base44" i][style*="position: absolute"],
      [aria-label*="base44" i][style*="position: fixed"],
      [aria-label*="base44" i][style*="position: absolute"],
      [data-base44-editor][style*="position: fixed"],
      [data-base44-editor][style*="position: absolute"] {
        display: none !important;
      }

      /* Layer 4: Shadow DOM pierce (if content is exposed via ::part) */
      ::part(base44-editor),
      ::part(edit-button) {
        display: none !important;
      }

      /* Layer 5: Hide any button/link containing the text (less specific but broad) */
      button[aria-label*="edit" i],
      a[aria-label*="edit" i],
      [role="button"][aria-label*="edit" i],
      button[title*="edit" i],
      a[title*="edit" i],
      [role="button"][title*="edit" i] {
        /* This rule is intentionally less specific to avoid hiding too much,
           relying on JS for text content check. */
        /* If it's a base44 edit button, it should be caught by Layer 1/2/3 or JS. */
      }
    `;
    
    // Insert at the very beginning of head to maximize priority
    document.head.insertBefore(style, document.head.firstChild);

    return () => {
      const existingStyle = document.getElementById('hide-base44-button-style');
      if (existingStyle) {
        existingStyle.remove();
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
