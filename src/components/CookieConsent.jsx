import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, X } from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

export default function CookieConsent() {
  const [showConsent, setShowConsent] = useState(false);

  useEffect(() => {
    // Check if user has already accepted
    const hasAccepted = localStorage.getItem('cookieConsentAccepted');
    if (!hasAccepted) {
      setShowConsent(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookieConsentAccepted', 'true');
    setShowConsent(false);
  };

  const handleReject = () => {
    localStorage.setItem('cookieConsentAccepted', 'false');
    setShowConsent(false);
  };

  return (
    <AnimatePresence>
      {showConsent && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ duration: 0.4 }}
          className="fixed bottom-0 left-0 right-0 z-[100] bg-white border-t-2 border-[#D4AF37] shadow-2xl"
        >
          <div className="max-w-7xl mx-auto px-4 py-4 md:py-3">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-6">
              {/* Icon */}
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-gradient-to-br from-[#D4AF37] to-[#C8A882] rounded-full flex items-center justify-center">
                  <Shield className="w-5 h-5 text-white" />
                </div>
              </div>

              {/* Text */}
              <div className="flex-1 space-y-1">
                <h3 className="font-semibold text-gray-800 text-sm md:text-base">
                  🍪 Este site usa cookies
                </h3>
                <p className="text-xs md:text-sm text-gray-600 leading-relaxed">
                  Utilizamos cookies para melhorar sua experiência, personalizar conteúdo e analisar nosso tráfego. 
                  Ao continuar navegando, você concorda com nossa{" "}
                  <Link 
                    to={createPageUrl("PrivacyPolicy")} 
                    className="text-[#D4AF37] hover:text-[#C8A882] underline font-medium"
                  >
                    Política de Privacidade
                  </Link>
                  {" "}e{" "}
                  <Link 
                    to={createPageUrl("TermsOfService")} 
                    className="text-[#D4AF37] hover:text-[#C8A882] underline font-medium"
                  >
                    Termos de Uso
                  </Link>
                  . Em conformidade com a LGPD (Lei Geral de Proteção de Dados).
                </p>
              </div>

              {/* Buttons */}
              <div className="flex gap-2 w-full md:w-auto">
                <Button
                  onClick={handleReject}
                  variant="outline"
                  size="sm"
                  className="flex-1 md:flex-none border-gray-300 text-gray-700 hover:bg-gray-100"
                >
                  Recusar
                </Button>
                <Button
                  onClick={handleAccept}
                  size="sm"
                  className="flex-1 md:flex-none bg-gradient-to-r from-[#D4AF37] to-[#C8A882] hover:from-[#C8A882] hover:to-[#D4AF37] text-white"
                >
                  Aceitar
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}