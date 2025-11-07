import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { X, Crown, Sparkles, ArrowRight, MessageCircle } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";

export default function SignUpPopup() {
  const [isVisible, setIsVisible] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);

  const { data: user, isLoading } = useQuery({
    queryKey: ['current-user'],
    queryFn: () => base44.auth.me(),
  });

  useEffect(() => {
    // Only show if user is not authenticated
    if (!isLoading && !user) {
      const dismissed = localStorage.getItem('signupPopupDismissed');
      const lastShown = localStorage.getItem('signupPopupLastShown');
      const now = Date.now();
      
      // Show after 5 seconds, if not dismissed or if 24h passed since last shown
      if (!dismissed || (lastShown && (now - parseInt(lastShown)) > 24 * 60 * 60 * 1000)) {
        setTimeout(() => {
          setIsVisible(true);
          setHasInteracted(false);
        }, 5000);
      }
    }
  }, [user, isLoading]);

  const handleClose = () => {
    setIsVisible(false);
    localStorage.setItem('signupPopupDismissed', 'true');
    localStorage.setItem('signupPopupLastShown', Date.now().toString());
  };

  const handleSignUp = () => {
    setHasInteracted(true);
    // Redirect to WhatsApp
    const whatsappNumber = "5531972595643";
    const message = encodeURIComponent("Olá! Gostaria de me cadastrar no Club da Beleza.");
    window.open(`https://wa.me/${whatsappNumber}?text=${message}`, '_blank');
    handleClose();
  };

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      >
        <motion.div
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, y: 20 }}
          className="w-full max-w-md"
        >
          <Card className="border-[#E8DCC4] shadow-2xl overflow-hidden">
            <div className="bg-gradient-to-r from-[#D4AF37] to-[#C8A882] p-6 relative">
              <Button
                variant="ghost"
                size="icon"
                onClick={handleClose}
                className="absolute top-4 right-4 text-white hover:bg-white/20"
              >
                <X className="w-5 h-5" />
              </Button>

              <div className="text-center text-white space-y-3">
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="w-20 h-20 mx-auto bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center"
                >
                  <Crown className="w-10 h-10" />
                </motion.div>

                <h2 className="font-serif text-3xl font-bold">
                  Cadastre-se Já!
                </h2>

                <p className="text-white/90 text-lg">
                  Transforme sua experiência de beleza
                </p>
              </div>
            </div>

            <CardContent className="p-8 space-y-6">
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#F5EFE6] flex items-center justify-center flex-shrink-0">
                    <Sparkles className="w-4 h-4 text-[#D4AF37]" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800">Descontos Exclusivos</h4>
                    <p className="text-sm text-gray-600">Até 25% em tratamentos e produtos</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#F5EFE6] flex items-center justify-center flex-shrink-0">
                    <Sparkles className="w-4 h-4 text-[#D4AF37]" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800">Programa de Pontos</h4>
                    <p className="text-sm text-gray-600">Acumule pontos e troque por serviços</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#F5EFE6] flex items-center justify-center flex-shrink-0">
                    <Sparkles className="w-4 h-4 text-[#D4AF37]" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800">Rede Nacional</h4>
                    <p className="text-sm text-gray-600">500+ profissionais certificados</p>
                  </div>
                </div>
              </div>

              <div className="space-y-3 pt-4">
                <Button
                  onClick={handleSignUp}
                  className="w-full bg-gradient-to-r from-[#D4AF37] to-[#C8A882] text-white py-6 text-lg font-semibold group"
                >
                  <MessageCircle className="w-5 h-5 mr-2" />
                  Cadastrar pelo WhatsApp
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>

                <Button
                  onClick={handleClose}
                  variant="ghost"
                  className="w-full text-gray-600"
                >
                  Talvez depois
                </Button>
              </div>

              <p className="text-xs text-center text-gray-500">
                Cadastro rápido e gratuito. Sem compromisso!
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}