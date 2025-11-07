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
  CreditCard, GraduationCap, Calendar, TrendingUp, User, Mail, Shield
} from "lucide-react";

const planDetails = {
  none: {
    name: "Sem Plano",
    color: "gray",
    benefits: ["Acesso básico à plataforma"]
  },
  light: {
    name: "Light",
    color: "blue",
    benefits: [
      "Acesso ao aplicativo localizador",
      "Busca de profissionais",
      "Visualização de avaliações"
    ]
  },
  gold: {
    name: "Gold",
    color: "yellow",
    benefits: [
      "15% de desconto na rede",
      "100 pontos mensais",
      "Agendamento prioritário",
      "Suporte por WhatsApp"
    ]
  },
  vip: {
    name: "VIP",
    color: "purple",
    benefits: [
      "25% de desconto na rede",
      "300 pontos mensais",
      "Agendamento VIP",
      "Suporte 24/7",
      "Eventos exclusivos"
    ]
  }
};

const edbeautyPlanDetails = {
  none: {
    name: "Sem Plano EdBeauty",
    color: "gray",
    benefits: []
  },
  basic: {
    name: "EdBeauty Basic",
    color: "blue",
    benefits: [
      "10 uploads por mês",
      "Acesso a cursos básicos"
    ]
  },
  pro: {
    name: "EdBeauty Pro",
    color: "indigo",
    benefits: [
      "50 uploads por mês",
      "Todos os cursos",
      "Certificados"
    ]
  },
  premium: {
    name: "EdBeauty Premium",
    color: "purple",
    benefits: [
      "Uploads ilimitados",
      "Mentoria exclusiva",
      "Ferramentas avançadas"
    ]
  }
};

export default function MyProfile() {
  const { data: user, isLoading } = useQuery({
    queryKey: ['current-user'],
    queryFn: () => base44.auth.me(),
  });

  const userType = user?.tipo_usuario || 'paciente';
  const clubePlano = user?.clube_plano || 'none';
  const edbeautyPlano = user?.edbeauty_plano || 'none';
  
  const clubePlanInfo = planDetails[clubePlano];
  const edbeautyPlanInfo = edbeautyPlanDetails[edbeautyPlano];

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-[#F5EFE6] to-white">
      {/* Hero Section */}
      <div className="relative py-20 px-6 overflow-hidden bg-gradient-to-br from-white via-[#F5EFE6] to-[#E8DCC4]">
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0] }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
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
              <User className="w-4 h-4 text-[#D4AF37]" />
              <span className="text-sm font-medium text-[#C8A882]">
                Meu Perfil
              </span>
            </div>

            <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl font-bold">
              <span className="text-gray-800">Olá,</span>
              <br />
              <span className="bg-gradient-to-r from-[#D4AF37] to-[#C8A882] bg-clip-text text-transparent">
                {user?.full_name || 'Visitante'}
              </span>
            </h1>

            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Gerencie suas informações e aproveite todos os benefícios
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
            {/* User Info Card */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <Card className="border-[#E8DCC4] shadow-xl overflow-hidden">
                <div className="bg-gradient-to-r from-[#D4AF37] to-[#C8A882] p-6">
                  <div className="flex items-center gap-4 text-white">
                    <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-4xl font-bold">
                      {user?.full_name?.charAt(0).toUpperCase() || 'U'}
                    </div>
                    <div>
                      <h2 className="font-serif text-3xl font-bold">
                        {user?.full_name || 'Usuário'}
                      </h2>
                      <div className="flex items-center gap-2 mt-1">
                        <Mail className="w-4 h-4" />
                        <span className="text-white/90">{user?.email}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <CardContent className="p-8">
                  <div className="grid md:grid-cols-3 gap-6">
                    <div className="text-center p-4 bg-[#F5EFE6] rounded-xl">
                      <Shield className="w-8 h-8 text-[#D4AF37] mx-auto mb-2" />
                      <p className="text-sm text-gray-600">Tipo de Conta</p>
                      <p className="text-lg font-bold text-gray-800">
                        {userType === 'profissional' ? 'Profissional' : 'Paciente'}
                      </p>
                    </div>

                    <div className="text-center p-4 bg-[#F5EFE6] rounded-xl">
                      <Award className="w-8 h-8 text-[#D4AF37] mx-auto mb-2" />
                      <p className="text-sm text-gray-600">Plano Club</p>
                      <p className="text-lg font-bold text-gray-800">
                        {clubePlanInfo.name}
                      </p>
                    </div>

                    <div className="text-center p-4 bg-[#F5EFE6] rounded-xl">
                      <Calendar className="w-8 h-8 text-[#D4AF37] mx-auto mb-2" />
                      <p className="text-sm text-gray-600">Membro desde</p>
                      <p className="text-lg font-bold text-gray-800">
                        {user?.created_date ? new Date(user.created_date).toLocaleDateString('pt-BR') : '-'}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Club da Beleza Plan */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
            >
              <Card className="border-[#E8DCC4] shadow-xl">
                <CardHeader className="bg-gradient-to-r from-[#F5EFE6] to-[#E8DCC4]">
                  <CardTitle className="font-serif text-2xl text-gray-800 flex items-center gap-2">
                    <Crown className="w-6 h-6 text-[#D4AF37]" />
                    Plano Club da Beleza
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-8">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h3 className="text-2xl font-bold text-gray-800">{clubePlanInfo.name}</h3>
                      <p className="text-gray-600">Plano atual</p>
                    </div>
                    {clubePlano !== 'vip' && (
                      <Link to={createPageUrl("Join")}>
                        <Button className="bg-gradient-to-r from-[#D4AF37] to-[#C8A882] text-white">
                          <TrendingUp className="w-4 h-4 mr-2" />
                          Fazer Upgrade
                        </Button>
                      </Link>
                    )}
                  </div>

                  <div className="space-y-3">
                    <p className="font-semibold text-gray-700">Benefícios inclusos:</p>
                    {clubePlanInfo.benefits.map((benefit, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <CheckCircle className="w-5 h-5 text-[#D4AF37]" />
                        <span className="text-gray-600">{benefit}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* EdBeauty Plan (for professionals) */}
            {userType === 'profissional' && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <Card className="border-[#E8DCC4] shadow-xl">
                  <CardHeader className="bg-gradient-to-r from-[#F5EFE6] to-[#E8DCC4]">
                    <CardTitle className="font-serif text-2xl text-gray-800 flex items-center gap-2">
                      <GraduationCap className="w-6 h-6 text-[#D4AF37]" />
                      Plano EdBeauty
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-8">
                    <div className="flex items-center justify-between mb-6">
                      <div>
                        <h3 className="text-2xl font-bold text-gray-800">{edbeautyPlanInfo.name}</h3>
                        <p className="text-gray-600">Plano atual</p>
                      </div>
                      {edbeautyPlano !== 'premium' && (
                        <Link to={createPageUrl("EdBeautyPlans")}>
                          <Button className="bg-gradient-to-r from-[#D4AF37] to-[#C8A882] text-white">
                            <TrendingUp className="w-4 h-4 mr-2" />
                            Fazer Upgrade
                          </Button>
                        </Link>
                      )}
                    </div>

                    {edbeautyPlanInfo.benefits.length > 0 ? (
                      <div className="space-y-3">
                        <p className="font-semibold text-gray-700">Benefícios inclusos:</p>
                        {edbeautyPlanInfo.benefits.map((benefit, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <CheckCircle className="w-5 h-5 text-[#D4AF37]" />
                            <span className="text-gray-600">{benefit}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <p className="text-gray-600 mb-4">Você ainda não tem um plano EdBeauty</p>
                        <Link to={createPageUrl("EdBeautyPlans")}>
                          <Button className="bg-gradient-to-r from-[#D4AF37] to-[#C8A882] text-white">
                            Ver Planos EdBeauty
                            <ArrowRight className="w-4 h-4 ml-2" />
                          </Button>
                        </Link>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Summary Stats */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              <Card className="border-[#E8DCC4] shadow-xl bg-gradient-to-br from-white to-[#F5EFE6]">
                <CardContent className="p-8">
                  <h3 className="font-serif text-xl font-bold text-gray-800 mb-6">
                    Resumo da Conta
                  </h3>
                  <div className="grid md:grid-cols-3 gap-6">
                    <div className="text-center">
                      <div className="text-3xl font-bold bg-gradient-to-r from-[#D4AF37] to-[#C8A882] bg-clip-text text-transparent">
                        {clubePlano === 'none' ? '0%' : clubePlano === 'light' ? '5%' : clubePlano === 'gold' ? '15%' : '25%'}
                      </div>
                      <p className="text-sm text-gray-600 mt-1">Desconto Disponível</p>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold bg-gradient-to-r from-[#D4AF37] to-[#C8A882] bg-clip-text text-transparent">
                        {clubePlano === 'gold' ? '100' : clubePlano === 'vip' ? '300' : '0'}
                      </div>
                      <p className="text-sm text-gray-600 mt-1">Pontos Mensais</p>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold bg-gradient-to-r from-[#D4AF37] to-[#C8A882] bg-clip-text text-transparent">
                        {userType === 'profissional' ? 'Pro' : 'Cliente'}
                      </div>
                      <p className="text-sm text-gray-600 mt-1">Tipo de Conta</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      )}
    </div>
  );
}