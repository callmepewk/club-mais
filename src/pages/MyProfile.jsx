
import React from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Crown, Award, Sparkles, CheckCircle, ArrowRight,
  CreditCard, GraduationCap, Calendar, TrendingUp, User, Mail, Shield,
  Send, MessageSquare, Scan // Added Scan icon import
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

  const { data: avatarData } = useQuery({
    queryKey: ['user-avatar', user?.email],
    queryFn: () => base44.entities.AvatarData.filter({ user_email: user?.email }, '-created_date', 1),
    enabled: !!user?.email,
    initialData: [],
  });

  const userAvatar = avatarData?.[0] || null;

  const userType = user?.tipo_usuario || 'paciente';
  const clubePlano = user?.clube_plano || 'none';
  const edbeautyPlano = user?.edbeauty_plano || 'none';
  
  const clubePlanInfo = planDetails[clubePlano];
  const edbeautyPlanInfo = edbeautyPlanDetails[edbeautyPlano];

  const [supportForm, setSupportForm] = React.useState({
    title: "",
    description: ""
  });

  const sendSupportEmail = useMutation({
    mutationFn: async (data) => {
      const emailBody = `
        <h2>Nova Solicitação de Suporte</h2>
        <hr/>
        <p><strong>De:</strong> ${user?.full_name || 'N/A'} (${user?.email || 'N/A'})</p>
        <p><strong>Tipo de Usuário:</strong> ${userType === 'profissional' ? 'Profissional' : 'Paciente'}</p>
        <p><strong>Plano Club:</strong> ${clubePlanInfo.name}</p>
        ${userType === 'profissional' ? `<p><strong>Plano EdBeauty:</strong> ${edbeautyPlanInfo.name}</p>` : ''}
        <hr/>
        <h3>Título: ${data.title}</h3>
        <p><strong>Descrição:</strong></p>
        <p>${data.description}</p>
        <hr/>
        <p><small>Data: ${new Date().toLocaleString('pt-BR')}</small></p>
      `;
      return base44.integrations.Core.SendEmail({
        to: "pedro_hbfreitas@hotmail.com",
        subject: `[Suporte] ${data.title} - ${user?.full_name || 'Usuário Desconhecido'}`,
        body: emailBody
      });
    },
    onSuccess: () => {
      alert('Mensagem enviada com sucesso! Nossa equipe entrará em contato em breve.');
      setSupportForm({ title: "", description: "" });
    },
    onError: (error) => {
      console.error("Error sending support email:", error);
      alert('Erro ao enviar mensagem. Tente novamente.');
    }
  });

  const handleSupportSubmit = (e) => {
    e.preventDefault();
    if (!supportForm.title || !supportForm.description) {
      alert('Por favor, preencha o título e a descrição.');
      return;
    }
    sendSupportEmail.mutate(supportForm);
  };

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

            {/* My Avatar Card */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.15 }}
            >
              <Card className="border-[#E8DCC4] shadow-xl">
                <CardHeader className="bg-gradient-to-r from-[#F5EFE6] to-[#E8DCC4]">
                  <CardTitle className="font-serif text-2xl text-gray-800 flex items-center gap-2">
                    <User className="w-6 h-6 text-[#D4AF37]" />
                    Meu Avatar
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-8">
                  {userAvatar ? (
                    <div className="space-y-6">
                      <div className="flex flex-col md:flex-row gap-6 items-center">
                        {userAvatar.avatar_thumbnail ? (
                          <div className="relative w-64 h-64 rounded-2xl overflow-hidden shadow-2xl border-4 border-[#E8DCC4]">
                            <img
                              src={userAvatar.avatar_thumbnail}
                              alt="Meu Avatar"
                              className="w-full h-full object-cover"
                            />
                          </div>
                        ) : (
                          <div className="w-64 h-64 bg-gradient-to-br from-[#F5EFE6] to-[#E8DCC4] rounded-2xl flex items-center justify-center border-4 border-[#E8DCC4]">
                            <User className="w-32 h-32 text-[#D4AF37] opacity-50" />
                          </div>
                        )}
                        
                        <div className="flex-1 space-y-4">
                          <h3 className="font-serif text-2xl font-bold text-gray-800">
                            Avatar Criado com Sucesso!
                          </h3>
                          <p className="text-gray-600">
                            Seu avatar foi criado usando tecnologia de IA avançada. Você pode visualizá-lo e atualizá-lo a qualquer momento.
                          </p>
                          
                          <div className="grid grid-cols-2 gap-3 text-sm">
                            <div className="p-3 bg-[#F5EFE6] rounded-lg">
                              <p className="text-gray-600 text-xs mb-1">Largura</p>
                              <p className="font-bold text-gray-800">{userAvatar.meta_width || 'N/A'}px</p>
                            </div>
                            <div className="p-3 bg-[#F5EFE6] rounded-lg">
                              <p className="text-gray-600 text-xs mb-1">Altura</p>
                              <p className="font-bold text-gray-800">{userAvatar.meta_height || 'N/A'}px</p>
                            </div>
                          </div>

                          {userAvatar.capture_timestamp && (
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <Calendar className="w-4 h-4 text-[#D4AF37]" />
                              <span>Criado em: {new Date(userAvatar.capture_timestamp).toLocaleDateString('pt-BR')}</span>
                            </div>
                          )}

                          <Link to={createPageUrl("DrBeleza")} className="block">
                            <Button className="w-full bg-gradient-to-r from-[#D4AF37] to-[#C8A882] text-white">
                              <Sparkles className="w-4 h-4 mr-2" />
                              Atualizar Avatar
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <div className="w-32 h-32 mx-auto bg-gradient-to-br from-[#F5EFE6] to-[#E8DCC4] rounded-full flex items-center justify-center mb-6">
                        <User className="w-16 h-16 text-[#D4AF37] opacity-50" />
                      </div>
                      <h3 className="font-serif text-xl font-bold text-gray-800 mb-2">
                        Você ainda não criou seu avatar
                      </h3>
                      <p className="text-gray-600 mb-6">
                        Crie seu avatar personalizado usando nossa tecnologia de IA
                      </p>
                      <Link to={createPageUrl("DrBeleza")}>
                        <Button className="bg-gradient-to-r from-[#D4AF37] to-[#C8A882] text-white">
                          <Scan className="w-4 h-4 mr-2" />
                          Criar Meu Avatar
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                      </Link>
                    </div>
                  )}
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

            {/* Support Section */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <Card className="border-[#E8DCC4] shadow-xl">
                <CardHeader className="bg-gradient-to-r from-[#F5EFE6] to-[#E8DCC4]">
                  <CardTitle className="font-serif text-2xl text-gray-800 flex items-center gap-2">
                    <MessageSquare className="w-6 h-6 text-[#D4AF37]" />
                    Suporte
                  </CardTitle>
                  <p className="text-gray-600 mt-2">
                    Precisa de ajuda? Entre em contato conosco
                  </p>
                </CardHeader>
                <CardContent className="p-8">
                  <form onSubmit={handleSupportSubmit} className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="support-title" className="text-gray-700">
                        Título
                      </Label>
                      <Input
                        id="support-title"
                        value={supportForm.title}
                        onChange={(e) => setSupportForm(prev => ({ ...prev, title: e.target.value }))}
                        placeholder="Resumo do problema ou dúvida"
                        className="border-[#E8DCC4] focus:border-[#D4AF37]"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="support-description" className="text-gray-700">
                        Descrição
                      </Label>
                      <Textarea
                        id="support-description"
                        value={supportForm.description}
                        onChange={(e) => setSupportForm(prev => ({ ...prev, description: e.target.value }))}
                        placeholder="Descreva detalhadamente seu problema ou dúvida"
                        className="border-[#E8DCC4] focus:border-[#D4AF37] min-h-[150px]"
                        required
                      />
                    </div>

                    <div className="bg-[#F5EFE6] rounded-lg p-4">
                      <p className="text-sm text-gray-700">
                        <strong>Email de suporte:</strong> pedro_hbfreitas@hotmail.com
                      </p>
                      <p className="text-xs text-gray-600 mt-2">
                        Responderemos sua solicitação o mais breve possível
                      </p>
                    </div>

                    <Button
                      type="submit"
                      disabled={sendSupportEmail.isPending}
                      className="w-full bg-gradient-to-r from-[#D4AF37] to-[#C8A882] text-white py-6 text-lg font-semibold"
                    >
                      {sendSupportEmail.isPending ? (
                        <>
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" />
                          Enviando...
                        </>
                      ) : (
                        <>
                          <Send className="w-5 h-5 mr-2" />
                          Enviar Mensagem
                        </>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      )}
    </div>
  );
}
