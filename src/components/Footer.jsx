
import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Sparkles, Instagram, Facebook, Mail, Phone, MapPin } from "lucide-react";

const footerLinks = {
  "Navegação": [
    { name: "Início", url: createPageUrl("Home") },
    { name: "Benefícios", url: createPageUrl("Benefits") },
    { name: "Sobre Nós", url: createPageUrl("About") },
    { name: "Nossos Produtos", url: createPageUrl("Products") }
  ],
  "Comunidade": [
    { name: "Golden Doctors", url: createPageUrl("GoldenDoctors") },
    { name: "Notícias", url: createPageUrl("News") },
    { name: "Contato", url: createPageUrl("Contact") }
  ],
  "Produtos": [
    { name: "Mapa da Estética", url: "https://mapa-da-estetica.base44.app", external: true },
    { name: "Laser Code Pro", url: "https://laser-code-pro.base44.app", external: true },
    { name: "Dr. Spok PD", url: "https://dr-spok-pd.base44.app", external: true }
  ]
};

export default function Footer() {
  return (
    <footer className="bg-gradient-to-br from-gray-900 to-gray-800 text-white">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand Section */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-[#D4AF37] to-[#C8A882] rounded-full flex items-center justify-center shadow-lg">
                <img 
                  src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/user_68ca933db3f173d5b5ee5174/424de1767_clubeimg.jpeg"
                  alt="Club Logo"
                  className="w-8 h-8 object-contain"
                />
              </div>
              <div>
                <h3 className="font-serif text-2xl font-bold bg-gradient-to-r from-[#D4AF37] to-[#C8A882] bg-clip-text text-transparent">
                  Club da Beleza
                </h3>
              </div>
            </div>
            <p className="text-gray-400 leading-relaxed">
              O maior clube de benefícios em beleza e estética do Brasil. 
              Transforme sua rotina de autocuidado.
            </p>
            
            {/* Social Media */}
            <div className="flex gap-3">
              <a 
                href="https://instagram.com/clubdabeleza" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 bg-white/10 hover:bg-gradient-to-br hover:from-[#D4AF37] hover:to-[#C8A882] rounded-lg flex items-center justify-center transition-all duration-300 group"
              >
                <Instagram className="w-5 h-5 text-white group-hover:scale-110 transition-transform" />
              </a>
              <a 
                href="https://facebook.com/clubdabeleza" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 bg-white/10 hover:bg-gradient-to-br hover:from-[#D4AF37] hover:to-[#C8A882] rounded-lg flex items-center justify-center transition-all duration-300 group"
              >
                <Facebook className="w-5 h-5 text-white group-hover:scale-110 transition-transform" />
              </a>
            </div>
          </div>

          {/* Links Sections */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title} className="space-y-4">
              <h4 className="font-serif text-lg font-bold text-[#D4AF37]">
                {title}
              </h4>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.name}>
                    {link.external ? (
                      <a
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-400 hover:text-[#D4AF37] transition-colors duration-300 flex items-center gap-2 group"
                      >
                        <span className="w-1 h-1 bg-[#D4AF37] rounded-full group-hover:scale-150 transition-transform"></span>
                        {link.name}
                      </a>
                    ) : (
                      <Link
                        to={link.url}
                        className="text-gray-400 hover:text-[#D4AF37] transition-colors duration-300 flex items-center gap-2 group"
                      >
                        <span className="w-1 h-1 bg-[#D4AF37] rounded-full group-hover:scale-150 transition-transform"></span>
                        {link.name}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Contact Info */}
        <div className="mt-12 pt-8 border-t border-white/10">
          <div className="grid md:grid-cols-3 gap-6 text-sm">
            <div className="flex items-center gap-3 text-gray-400">
              <Phone className="w-5 h-5 text-[#D4AF37]" />
              <a href="tel:+5531972595643" className="hover:text-[#D4AF37] transition-colors">
                (31) 97259-5643
              </a>
            </div>
            <div className="flex items-center gap-3 text-gray-400">
              <Mail className="w-5 h-5 text-[#D4AF37]" />
              <a href="mailto:contato@clubdabeleza.com" className="hover:text-[#D4AF37] transition-colors">
                contato@clubdabeleza.com
              </a>
            </div>
            <div className="flex items-center gap-3 text-gray-400">
              <MapPin className="w-5 h-5 text-[#D4AF37]" />
              <span>Belo Horizonte, MG</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-700">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-400">
            <p>© {new Date().getFullYear()} Club da Beleza. Todos os direitos reservados.</p>
            <p>CNPJ: 00.000.000/0001-00</p>
            <div className="flex gap-4">
              <Link 
                to={createPageUrl("PrivacyPolicy")} 
                className="hover:text-[#D4AF37] transition-colors"
              >
                Política de Privacidade
              </Link>
              <Link 
                to={createPageUrl("TermsOfService")} 
                className="hover:text-[#D4AF37] transition-colors"
              >
                Termos de Uso
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
