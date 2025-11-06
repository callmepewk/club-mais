import React from "react";
import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { 
  Sparkles, Home, Users, Award, Info, Newspaper, Phone, Briefcase, 
  Package, CreditCard, Bot, MapPin, Map as MapIcon, Coins, 
  GraduationCap, User as UserIcon, Scan, Heart
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
import Footer from "./components/Footer";
import DrBelezaChat from "./components/DrBelezaChat";

const navigationItems = [
  {
    title: "Início",
    url: createPageUrl("Home"),
    icon: Home,
  },
  {
    title: "Benefícios",
    url: createPageUrl("Benefits"),
    icon: Award,
  },
  {
    title: "Clube+",
    url: createPageUrl("ClubePlus"),
    icon: Heart,
  },
  {
    title: "EdBeauty",
    url: createPageUrl("EdBeauty"),
    icon: GraduationCap,
  },
  {
    title: "Dr. Beleza",
    url: createPageUrl("DrBeleza"),
    icon: Bot,
  },
  {
    title: "Crie seu Avatar",
    url: createPageUrl("AvatarScanner"),
    icon: Scan,
  },
  {
    title: "Mapa da Estética",
    url: createPageUrl("MapaDaEstetica"),
    icon: MapPin,
  },
  {
    title: "Mapa Interativo",
    url: createPageUrl("MapaInterativo"),
    icon: MapIcon,
  },
  {
    title: "Beauty Coin",
    url: createPageUrl("BeautyCoin"),
    icon: Coins,
  },
  {
    title: "Meu Plano",
    url: createPageUrl("MyPlan"),
    icon: CreditCard,
  },
  {
    title: "Sobre Nós",
    url: createPageUrl("About"),
    icon: Info,
  },
  {
    title: "Nossos Produtos",
    url: createPageUrl("Products"),
    icon: Package,
  },
  {
    title: "Golden Doctors",
    url: createPageUrl("GoldenDoctors"),
    icon: Briefcase,
  },
  {
    title: "Notícias",
    url: createPageUrl("News"),
    icon: Newspaper,
  },
  {
    title: "Associe-se",
    url: createPageUrl("Join"),
    icon: Users,
  },
];

export default function Layout({ children, currentPageName }) {
  const location = useLocation();

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
                  {navigationItems.map((item) => (
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
                  ))}
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

        {/* Dr Beleza Chatbot */}
        <DrBelezaChat />
      </div>
    </SidebarProvider>
  );
}