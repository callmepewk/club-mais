import React from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { 
  Crown, Award, Sparkles, CheckCircle, ArrowRight,
  CreditCard, GraduationCap, Calendar, TrendingUp
} from "lucide-react";

const planDetails = {
  none: {
    name: "Sem Plano",
    color: "from-gray-400 to-gray-500",
    icon: CreditCard,
    benefits: []
  },
  light: {
    name: "Light",
    color: "from-gray-400 to-gray-500",
    icon: Award,
    benefits: [
      "Acesso ao aplicativo localizador",
      "Busca de profissionais",
      "Visualização de avaliações",
      "Suporte por email"
    ]
  },
  gold: {
    name: "Gold",
    color: "from-[#D4AF37] to-[#C8A882]",
    icon: Award,
    benefits: [
      "15% de desconto na rede",
      "100 pontos mensais",
      "50 Beauty Coins mensais",
      "Agendamento prioritário",
      "Acesso ao EdBeauty",
      "Suporte por WhatsApp"
    ]
  },
  vip: {
    name: "VIP",
    color: "from-purple-600 to-purple-800",
    icon: Crown,
    benefits: [
      "25% de desconto na rede",
      "300 pontos mensais",
      "150 Beauty Coins mensais",
      "Agendamento VIP",
      "Acesso ao EdBeauty",
      "Suporte 24/7",
      "Eventos exclusivos"
    ]
  }
};

const edbeautyPlanDetails = {
  none: {
    name: "Sem Plano EdBeauty",
    color: "from-gray-400 to-gray-500",
    benefits: []
  },
  basic: {
    name: "Basic",
    color: "from-blue-400 to-blue-600",
    benefits: [
      "Upload de até 5 conteúdos/mês",
      "Estatísticas básicas",
      "Suporte por email"
    ]
  },
  pro: {
    name: "Pro",
    color: "from-[#D4AF37] to-[#C8A882]",
    benefits: [
      "Upload ilimitado",
      "Estatísticas avançadas",
      "Badge de verificação",
      "Possibilidade de monetização"
    ]
  },
  premium: {
    name: "Premium",
    color: "from-purple-600 to-purple-800",
    benefits: [
      "Página personalizada",
      "Lives exclusivas",
      "Marketing exclusivo",
      "Badge Golden Instructor"
    ]
  }
};

export default function MyPlan() {
  const { data: user, isLoading } = useQuery({
    queryKey: ['current-user'],
    queryFn: () => base44.auth.me(),
  });

  const clubePlan = user?.clube_plano || 'none';
  const edbeautyPlan = user?.edbeauty_plano || 'none';
  const clubePlanInfo = planDetails[clubePlan];
  const edbeautyPlanInfo = edbeautyPlanDetails[edbeautyPlan];

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-[#F5EFE6] to-white">
      {/* Hero Section */}
      <div className="relative py-20 px-6 overflow-hidden bg-gradient-to-br from-white via-[#F5EFE6] to-[#E8DCC4]">
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 90, 0],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "linear"
            }}
            className="absolute -top-24 -right-24 w-96 h-96 bg-gradient-to-br from-[#D4AF37]/10 to-transparent rounded-full blur-3xl"
          />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center space-y-6"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full border border-[#D4AF37]/20 shadow-lg">
              <Sparkles className="w-4 h-4 text-[#D4AF37]" />
              <span className="text-sm font-medium text-[#C8A882]">
                Sua Assinatura
              </span>
            </div>

            <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl font-bold">
              <span className="text-gray-800">Meu</span>
              <br />
              <span className="bg-gradient-to-r from-[#D4AF37] to-[#C8A882] bg-clip-text text-transparent">
                Plano
              </span>
            </h1>

            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Gerencie suas assinaturas e aproveite todos os benefícios
            </p>
          </motion.div>
        </div>
      </div>

      {/* Loading State */}
      {isLoading ? (
        <div className="py-20 px-6 text-center">
          <div className="animate-spin w-12 h-12 border-4 border-[#D4AF37] border-t-transparent rounded-full mx-auto"></div>
          <p className="text-gray-600 mt-4">Carregando informações...</p>
        </div>
      ) : (
        <div className="py-20 px-6">
          <div className="max-w-5xl mx-auto space-y-8">
            {/* Club da Beleza Plan */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <Card className="border-[#E8DCC4] shadow-xl overflow-hidden">
                <div className={`bg-gradient-to-r ${clubePlanInfo.color} p-6`}>
                  <div className="flex items-center justify-between text-white">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                        <clubePlanInfo.icon className="w-8 h-8" />
                      </div>
                      <div>
                        <p className="text-white/80 text-sm">Club da Beleza</p>
                        <h2 className="font-serif text-3xl font-bold">
                          Plano {clubePlanInfo.name}
                        </h2>
                      </div>
                    </div>
                    {clubePlan !== 'none' && (
                      <Badge className="bg-white/20 border-white/30 text-white">
                        Ativo
                      </Badge>
                    )}
                  </div>
                </div>

                <CardContent className="p-8">
                  {clubePlan === 'none' ? (
                    <div className="text-center py-8 space-y-6">
                      <p className="text-gray-600 text-lg">
                        Você ainda não possui um plano ativo no Club da Beleza
                      </p>
                      <Link to={createPageUrl("Join")}>
                        <Button className="bg-gradient-to-r from-[#D4AF37] to-[#C8A882] hover:from-[#C8A882] hover:to-[#D4AF37] text-white">
                          Escolher Plano
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                      </Link>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      <div>
                        <h3 className="font-semibold text-lg text-gray-800 mb-4">
                          Seus Benefícios:
                        </h3>
                        <div className="grid md:grid-cols-2 gap-3">
                          {clubePlanInfo.benefits.map((benefit, index) => (
                            <div key={index} className="flex items-start gap-3">
                              <CheckCircle className="w-5 h-5 text-[#D4AF37] flex-shrink-0 mt-0.5" />
                              <span className="text-gray-700">{benefit}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="pt-6 border-t border-[#E8DCC4] flex justify-between items-center">
                        <div className="flex items-center gap-2 text-gray-500">
                          <Calendar className="w-4 h-4" />
                          <span className="text-sm">Renovação automática mensal</span>
                        </div>
                        <Link to={createPageUrl("Benefits")}>
                          <Button variant="outline" className="border-[#D4AF37] text-[#D4AF37]">
                            Ver Outros Planos
                          </Button>
                        </Link>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>

            {/* EdBeauty Plan */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <Card className="border-[#E8DCC4] shadow-xl overflow-hidden">
                <div className={`bg-gradient-to-r ${edbeautyPlanInfo.color} p-6`}>
                  <div className="flex items-center justify-between text-white">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                        <GraduationCap className="w-8 h-8" />
                      </div>
                      <div>
                        <p className="text-white/80 text-sm">EdBeauty (Profissional)</p>
                        <h2 className="font-serif text-3xl font-bold">
                          {edbeautyPlanInfo.name}
                        </h2>
                      </div>
                    </div>
                    {edbeautyPlan !== 'none' && (
                      <Badge className="bg-white/20 border-white/30 text-white">
                        Ativo
                      </Badge>
                    )}
                  </div>
                </div>

                <CardContent className="p-8">
                  {edbeautyPlan === 'none' ? (
                    <div className="text-center py-8 space-y-6">
                      <p className="text-gray-600 text-lg">
                        Você não possui um plano EdBeauty para profissionais
                      </p>
                      <Link to={createPageUrl("EdBeautyPlans")}>
                        <Button className="bg-gradient-to-r from-[#D4AF37] to-[#C8A882] hover:from-[#C8A882] hover:to-[#D4AF37] text-white">
                          Ver Planos EdBeauty
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                      </Link>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      <div>
                        <h3 className="font-semibold text-lg text-gray-800 mb-4">
                          Benefícios EdBeauty:
                        </h3>
                        <div className="grid md:grid-cols-2 gap-3">
                          {edbeautyPlanInfo.benefits.map((benefit, index) => (
                            <div key={index} className="flex items-start gap-3">
                              <CheckCircle className="w-5 h-5 text-[#D4AF37] flex-shrink-0 mt-0.5" />
                              <span className="text-gray-700">{benefit}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="pt-6 border-t border-[#E8DCC4] flex justify-between items-center">
                        <Link to={createPageUrl("EdBeautyUpload")}>
                          <Button className="bg-gradient-to-r from-[#D4AF37] to-[#C8A882] hover:from-[#C8A882] hover:to-[#D4AF37] text-white">
                            Enviar Conteúdo
                          </Button>
                        </Link>
                        <Link to={createPageUrl("EdBeautyPlans")}>
                          <Button variant="outline" className="border-[#D4AF37] text-[#D4AF37]">
                            Fazer Upgrade
                          </Button>
                        </Link>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>

            {/* Summary Stats */}
            {(clubePlan !== 'none' || edbeautyPlan !== 'none') && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                <Card className="border-[#E8DCC4] bg-gradient-to-br from-white to-[#F5EFE6]">
                  <CardContent className="p-8">
                    <div className="grid md:grid-cols-3 gap-6 text-center">
                      <div>
                        <TrendingUp className="w-8 h-8 text-[#D4AF37] mx-auto mb-2" />
                        <p className="text-3xl font-bold bg-gradient-to-r from-[#D4AF37] to-[#C8A882] bg-clip-text text-transparent">
                          {clubePlan === 'gold' ? '15%' : clubePlan === 'vip' ? '25%' : '0%'}
                        </p>
                        <p className="text-sm text-gray-600">Desconto Ativo</p>
                      </div>

                      <div>
                        <Sparkles className="w-8 h-8 text-[#D4AF37] mx-auto mb-2" />
                        <p className="text-3xl font-bold bg-gradient-to-r from-[#D4AF37] to-[#C8A882] bg-clip-text text-transparent">
                          {clubePlan === 'gold' ? '100' : clubePlan === 'vip' ? '300' : '0'}
                        </p>
                        <p className="text-sm text-gray-600">Pontos Mensais</p>
                      </div>

                      <div>
                        <Award className="w-8 h-8 text-[#D4AF37] mx-auto mb-2" />
                        <p className="text-3xl font-bold bg-gradient-to-r from-[#D4AF37] to-[#C8A882] bg-clip-text text-transparent">
                          {clubePlan === 'gold' ? '50' : clubePlan === 'vip' ? '150' : '0'}
                        </p>
                        <p className="text-sm text-gray-600">Beauty Coins/Mês</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}