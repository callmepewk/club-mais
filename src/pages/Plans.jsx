import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { Sparkles, Crown, CreditCard, ArrowRight, Check } from "lucide-react";

const plans = [
  {
    id: "light",
    name: "Plano Light",
    price: "R$ 1,00",
    period: "/dia",
    description: "Comece sua jornada com benefícios diários",
    cardImage: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/690ca5886318e973c6e913bb/4052aa61b_cartoclube1.jpeg",
    features: [
      "Acesso a descontos exclusivos",
      "Benefícios em estabelecimentos parceiros",
      "Acesso ao aplicativo localizador",
      "Busca de profissionais por categoria",
      "Visualização de avaliações",
      "Suporte por email",
      "Notificações de novidades"
    ]
  },
  {
    id: "gold",
    name: "Plano Gold",
    price: "12x de R$ 397",
    originalPrice: "R$ 997",
    period: "",
    description: "Oferta Black November - O plano mais completo",
    badge: "Oferta Black November",
    highlighted: true,
    cardImage: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/690ca5886318e973c6e913bb/74527711e_cartoclube2.jpeg",
    features: [
      "Todos os benefícios do LIGHT",
      "Tratamentos Incluídos:",
      "• Cabelo",
      "• Face, colo, mãos e pés",
      "• Body",
      "• Regenerativa / EBDS (6x)",
      "• Toxinas (3x)",
      "• Lasers (3x)",
      "• DNA de salmão exossomas (4x)",
      "• Fototerapia (6x)",
      "• Chá da beleza (1x)",
      "• Beauty Box",
      "Suporte prioritário por WhatsApp",
      "Programa de indicação",
      "Cashback de 5% em compras"
    ]
  },
  {
    id: "vip",
    name: "Plano VIP",
    price: "Sob Consulta",
    period: "",
    description: "Experiência premium completa e personalizada",
    cardImage: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/690ca5886318e973c6e913bb/73fc11f09_cartoclube3.jpeg",
    features: [
      "Todos os benefícios do GOLD",
      "Chauffeur (leva e trás)",
      "Checkup completo da pele",
      "Chá da beleza infinite",
      "Tratamentos personalizados mensais",
      "Suporte VIP 24/7",
      "Teleconsulta gratuita com especialistas",
      "Acesso a eventos exclusivos VIP",
      "Cashback de 10% em compras",
      "Cartão físico premium personalizado",
      "E muito mais..."
    ]
  }
];

export default function Plans() {
  const handleAcquirePlan = (planId) => {
    const whatsappNumber = "5521980343873";
    const plan = plans.find(p => p.id === planId);
    const planName = plan?.name || "Plano";
    const priceInfo = plan?.price || "";
    const message = encodeURIComponent(`Olá! Gostaria de adquirir o ${planName} (${priceInfo}) do Club da Beleza.`);
    window.open(`https://wa.me/${whatsappNumber}?text=${message}`, '_blank');
  };

  const handleMoreInfo = (planId) => {
    const whatsappNumber = "5521980343873";
    const planName = plans.find(p => p.id === planId)?.name || "Plano";
    const message = encodeURIComponent(`Olá! Gostaria de mais informações sobre o ${planName} do Club da Beleza.`);
    window.open(`https://wa.me/${whatsappNumber}?text=${message}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F5EFE6] via-white to-[#E8DCC4] py-12 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16 space-y-4"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full border border-[#D4AF37]/20 shadow-lg">
            <Crown className="w-4 h-4 text-[#D4AF37]" />
            <span className="text-sm font-medium text-[#C8A882]">
              Seja um membro exclusivo
            </span>
          </div>

          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold">
            <span className="bg-gradient-to-r from-[#D4AF37] to-[#C8A882] bg-clip-text text-transparent">
              Escolha seu Plano
            </span>
            <br />
            <span className="text-gray-800">Club da Beleza</span>
          </h1>

          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Selecione o plano ideal e comece a aproveitar todos os benefícios exclusivos
          </p>
        </motion.div>

        {/* Cards Display Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="mb-16"
        >
          <Card className="border-[#E8DCC4] shadow-2xl bg-white overflow-hidden">
            <div className="bg-gradient-to-r from-[#D4AF37] via-[#C8A882] to-[#D4AF37] p-6 text-center">
              <CreditCard className="w-12 h-12 text-white mx-auto mb-3" />
              <h2 className="font-serif text-3xl font-bold text-white mb-2">
                Seus Cartões de Membro
              </h2>
              <p className="text-white/90">
                Receba seu cartão personalizado com o logotipo do Club da Beleza
              </p>
            </div>

            <CardContent className="p-8">
              <div className="grid md:grid-cols-3 gap-8">
                {plans.map((plan, index) => (
                  <motion.div
                    key={plan.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
                    className="space-y-4"
                  >
                    <div className="relative group">
                      <div className="absolute inset-0 bg-gradient-to-r from-[#D4AF37] to-[#C8A882] rounded-2xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity duration-300"></div>
                      <div className="relative rounded-2xl overflow-hidden shadow-2xl transform group-hover:scale-105 transition-all duration-300">
                        <img 
                          src={plan.cardImage} 
                          alt={`Cartão ${plan.name}`}
                          className="w-full h-auto"
                        />
                      </div>
                    </div>

                    <div className="text-center space-y-3">
                      <h3 className="font-serif text-xl font-bold text-gray-800 mb-1">
                        {plan.name}
                      </h3>
                      <div className="flex flex-col items-center justify-center gap-1">
                        {plan.originalPrice && (
                          <span className="text-lg text-gray-500 line-through">
                            {plan.originalPrice}
                          </span>
                        )}
                        <span className="font-serif text-2xl font-bold bg-gradient-to-r from-[#D4AF37] to-[#C8A882] bg-clip-text text-transparent">
                          {plan.price}
                        </span>
                        {plan.period && <span className="text-gray-600 text-sm">{plan.period}</span>}
                      </div>
                      <p className="text-sm text-gray-600">{plan.description}</p>
                      
                      {plan.badge && (
                        <div className="mt-2">
                          <span className="inline-block bg-gradient-to-r from-red-600 to-red-700 text-white px-3 py-1 text-xs font-semibold rounded-full animate-pulse">
                            🔥 {plan.badge}
                          </span>
                        </div>
                      )}

                      <div className="space-y-2 mt-4">
                        <Button
                          onClick={() => handleAcquirePlan(plan.id)}
                          className="w-full bg-gradient-to-r from-[#D4AF37] to-[#C8A882] hover:from-[#C8A882] hover:to-[#D4AF37] text-white py-6 text-base font-semibold shadow-lg hover:shadow-xl transition-all duration-300 group"
                        >
                          Adquirir Plano
                          <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                        </Button>
                        <Button
                          onClick={() => handleMoreInfo(plan.id)}
                          variant="outline"
                          className="w-full border-[#D4AF37] text-[#D4AF37] hover:bg-[#F5EFE6]"
                        >
                          Quero Mais Informações
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="mt-10 p-6 bg-gradient-to-r from-[#F5EFE6] to-[#E8DCC4] rounded-2xl">
                <div className="flex items-start gap-4">
                  <Sparkles className="w-8 h-8 text-[#D4AF37] flex-shrink-0" />
                  <div>
                    <h4 className="font-serif text-xl font-bold text-gray-800 mb-2">
                      Cartão Personalizado Incluído
                    </h4>
                    <p className="text-gray-700 leading-relaxed">
                      Todos os planos incluem um cartão físico personalizado com seu nome e o logotipo oficial do Club da Beleza. 
                      Use em qualquer estabelecimento parceiro e aproveite todos os benefícios exclusivos!
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Benefits Comparison */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <Card className="border-[#E8DCC4] shadow-xl bg-white">
            <CardContent className="p-8">
              <h3 className="font-serif text-2xl font-bold text-center text-gray-800 mb-8">
                Compare os Benefícios
              </h3>

              <div className="grid md:grid-cols-3 gap-6">
                {plans.map((plan) => (
                  <div key={plan.id} className="space-y-3">
                    <h4 className="font-serif text-lg font-bold text-center text-[#D4AF37] mb-4">
                      {plan.name}
                    </h4>
                    <ul className="space-y-2">
                      {plan.features.map((feature, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                          <Check className="w-4 h-4 text-[#D4AF37] flex-shrink-0 mt-0.5" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-center mt-16"
        >
          <p className="text-gray-600 mb-6">
            Dúvidas sobre qual plano escolher? Entre em contato conosco!
          </p>
          <Button
            onClick={() => {
              const whatsappNumber = "5521980343873";
              const message = encodeURIComponent("Olá! Tenho dúvidas sobre os planos do Club da Beleza.");
              window.open(`https://wa.me/${whatsappNumber}?text=${message}`, '_blank');
            }}
            variant="outline"
            className="border-2 border-[#D4AF37] text-[#D4AF37] hover:bg-[#F5EFE6]"
          >
            Falar com Atendimento
          </Button>
        </motion.div>
      </div>
    </div>
  );
}