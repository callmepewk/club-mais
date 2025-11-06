
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { motion } from "framer-motion";
import { Sparkles, Check, Crown, ArrowRight, User, Briefcase } from "lucide-react";

const plans = [
  {
    id: "light",
    name: "Plano Light",
    price: "Grátis",
    period: "",
    description: "Comece sua jornada sem custos",
    features: [
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
    price: "R$ 49,90",
    period: "/mês",
    description: "O plano mais escolhido pelos membros",
    badge: "Mais Popular",
    highlighted: true,
    features: [
      "Todos os benefícios do LIGHT",
      "15% de desconto na rede parceira",
      "100 pontos mensais",
      "Agendamento prioritário",
      "Suporte por WhatsApp",
      "Acesso a promoções exclusivas",
      "Programa de indicação",
      "Cashback de 5% em compras"
    ]
  },
  {
    id: "vip",
    name: "Plano VIP",
    price: "R$ 99,90",
    period: "/mês",
    description: "Experiência premium completa",
    features: [
      "Todos os benefícios do GOLD",
      "25% de desconto na rede parceira",
      "300 pontos mensais",
      "Agendamento VIP (prioridade máxima)",
      "Suporte 24/7 dedicado",
      "Teleconsulta gratuita com especialistas",
      "Acesso a eventos exclusivos",
      "Tratamentos personalizados mensais",
      "Cashback de 10% em compras",
      "Cartão físico premium personalizado"
    ]
  }
];

const benefits = [
  "Descontos exclusivos em parceiros",
  "Acesso a eventos e workshops",
  "Programa de recompensas com pontos",
  "Suporte dedicado",
  "Cancelamento gratuito a qualquer momento"
];

export default function Join() {
  const [selectedPlan, setSelectedPlan] = useState("gold");
  const [userType, setUserType] = useState("paciente");
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    cpf: ""
  });

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", { ...formData, plan: selectedPlan, userType });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F5EFE6] via-white to-[#E8DCC4] py-12 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12 space-y-4"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full border border-[#D4AF37]/20 shadow-lg">
            <Crown className="w-4 h-4 text-[#D4AF37]" />
            <span className="text-sm font-medium text-[#C8A882]">
              Seja um membro exclusivo
            </span>
          </div>

          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold">
            <span className="bg-gradient-to-r from-[#D4AF37] to-[#C8A882] bg-clip-text text-transparent">
              Junte-se ao
            </span>
            <br />
            <span className="text-gray-800">Club da Beleza</span>
          </h1>

          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Escolha seu plano e comece a aproveitar todos os benefícios exclusivos hoje mesmo
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left - Plans and Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* User Type Selection */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
            >
              <Card className="border-[#E8DCC4] shadow-xl bg-white">
                <CardHeader>
                  <CardTitle className="font-serif text-2xl text-gray-800">
                    Tipo de Cadastro
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div
                      onClick={() => setUserType("paciente")}
                      className={`relative p-6 rounded-xl border-2 cursor-pointer transition-all duration-300 ${
                        userType === "paciente"
                          ? 'border-[#D4AF37] bg-gradient-to-r from-[#F5EFE6] to-[#E8DCC4] shadow-lg'
                          : 'border-[#E8DCC4] hover:border-[#C8A882] bg-white'
                      }`}
                    >
                      <div className="flex items-start gap-4">
                        <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${
                          userType === "paciente" ? 'from-[#D4AF37] to-[#C8A882]' : 'from-gray-400 to-gray-500'
                        } flex items-center justify-center shadow-lg transition-all`}>
                          <User className="w-7 h-7 text-white" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-serif text-xl font-bold text-gray-800 mb-2">
                            Paciente
                          </h3>
                          <p className="text-sm text-gray-600">
                            Acesse conteúdos educacionais, descontos exclusivos e a rede de profissionais
                          </p>
                        </div>
                      </div>
                    </div>

                    <div
                      onClick={() => setUserType("profissional")}
                      className={`relative p-6 rounded-xl border-2 cursor-pointer transition-all duration-300 ${
                        userType === "profissional"
                          ? 'border-[#D4AF37] bg-gradient-to-r from-[#F5EFE6] to-[#E8DCC4] shadow-lg'
                          : 'border-[#E8DCC4] hover:border-[#C8A882] bg-white'
                      }`}
                    >
                      <div className="flex items-start gap-4">
                        <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${
                          userType === "profissional" ? 'from-[#D4AF37] to-[#C8A882]' : 'from-gray-400 to-gray-500'
                        } flex items-center justify-center shadow-lg transition-all`}>
                          <Briefcase className="w-7 h-7 text-white" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-serif text-xl font-bold text-gray-800 mb-2">
                            Profissional
                          </h3>
                          <p className="text-sm text-gray-600">
                            Compartilhe conteúdos, alcance clientes e tenha acesso a ferramentas profissionais
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {userType === "profissional" && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      className="p-4 bg-blue-50 border border-blue-200 rounded-lg"
                    >
                      <p className="text-sm text-blue-800">
                        <strong>Profissionais:</strong> Após o cadastro, você poderá assinar os planos EdBeauty para enviar conteúdos educacionais.
                      </p>
                    </motion.div>
                  )}
                </CardContent>
              </Card>
            </motion.div>

            {/* Plan Selection */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <Card className="border-[#E8DCC4] shadow-xl bg-white">
                <CardHeader>
                  <CardTitle className="font-serif text-2xl text-gray-800">
                    Escolha seu plano
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {plans.map((plan) => (
                    <div
                      key={plan.id}
                      onClick={() => setSelectedPlan(plan.id)}
                      className={`relative p-6 rounded-xl border-2 cursor-pointer transition-all duration-300 ${
                        selectedPlan === plan.id
                          ? 'border-[#D4AF37] bg-gradient-to-r from-[#F5EFE6] to-[#E8DCC4] shadow-lg'
                          : 'border-[#E8DCC4] hover:border-[#C8A882] bg-white'
                      }`}
                    >
                      {plan.badge && (
                        <div className="absolute top-3 right-3 bg-gradient-to-r from-[#D4AF37] to-[#C8A882] text-white px-3 py-1 text-xs font-semibold rounded-full">
                          {plan.badge}
                        </div>
                      )}

                      <div className="flex items-start justify-between">
                        <div className="space-y-2 flex-1">
                          <h3 className="font-serif text-xl font-bold text-gray-800">
                            {plan.name}
                          </h3>
                          <p className="text-sm text-gray-600">{plan.description}</p>
                          <div className="flex items-baseline gap-2">
                            <span className="font-serif text-3xl font-bold bg-gradient-to-r from-[#D4AF37] to-[#C8A882] bg-clip-text text-transparent">
                              {plan.price}
                            </span>
                            {plan.period && <span className="text-gray-600">{plan.period}</span>}
                          </div>
                        </div>

                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                          selectedPlan === plan.id
                            ? 'border-[#D4AF37] bg-[#D4AF37]'
                            : 'border-gray-300'
                        }`}>
                          {selectedPlan === plan.id && (
                            <Check className="w-4 h-4 text-white" />
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </motion.div>

            {/* Registration Form */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <Card className="border-[#E8DCC4] shadow-xl bg-white">
                <CardHeader>
                  <CardTitle className="font-serif text-2xl text-gray-800">
                    Seus dados
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="fullName" className="text-gray-700">Nome Completo</Label>
                      <Input
                        id="fullName"
                        value={formData.fullName}
                        onChange={(e) => handleInputChange("fullName", e.target.value)}
                        placeholder="Seu nome completo"
                        className="border-[#E8DCC4] focus:border-[#D4AF37]"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-gray-700">E-mail</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange("email", e.target.value)}
                        placeholder="seu@email.com"
                        className="border-[#E8DCC4] focus:border-[#D4AF37]"
                        required
                      />
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="phone" className="text-gray-700">Telefone</Label>
                        <Input
                          id="phone"
                          value={formData.phone}
                          onChange={(e) => handleInputChange("phone", e.target.value)}
                          placeholder="(00) 00000-0000"
                          className="border-[#E8DCC4] focus:border-[#D4AF37]"
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="cpf" className="text-gray-700">CPF</Label>
                        <Input
                          id="cpf"
                          value={formData.cpf}
                          onChange={(e) => handleInputChange("cpf", e.target.value)}
                          placeholder="000.000.000-00"
                          className="border-[#E8DCC4] focus:border-[#D4AF37]"
                          required
                        />
                      </div>
                    </div>

                    <Button
                      type="submit"
                      className="w-full bg-gradient-to-r from-[#D4AF37] to-[#C8A882] hover:from-[#C8A882] hover:to-[#D4AF37] text-white py-6 text-lg font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 group"
                    >
                      Finalizar Associação
                      <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Right - Summary */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="space-y-6"
          >
            {/* Summary Card */}
            <Card className="border-[#E8DCC4] shadow-xl bg-white sticky top-6">
              <CardHeader>
                <CardTitle className="font-serif text-2xl text-gray-800">
                  Resumo
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="p-4 rounded-xl bg-gradient-to-br from-[#F5EFE6] to-[#E8DCC4]">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-700 font-medium">
                      {plans.find(p => p.id === selectedPlan)?.name}
                    </span>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="font-serif text-3xl font-bold bg-gradient-to-r from-[#D4AF37] to-[#C8A882] bg-clip-text text-transparent">
                      {plans.find(p => p.id === selectedPlan)?.price}
                    </span>
                    <span className="text-gray-600">
                      {plans.find(p => p.id === selectedPlan)?.period}
                    </span>
                  </div>
                </div>

                <div className="space-y-3 pt-4 border-t border-[#E8DCC4]">
                  <h4 className="font-semibold text-gray-800 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[#D4AF37]" />
                    Incluído no plano:
                  </h4>
                  <ul className="space-y-2">
                    {benefits.map((benefit, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm text-gray-600">
                        <Check className="w-4 h-4 text-[#D4AF37] flex-shrink-0 mt-0.5" />
                        {benefit}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-4 border-t border-[#E8DCC4]">
                  <p className="text-xs text-gray-500 text-center">
                    Pagamento seguro e protegido. Cancele quando quiser.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Image Card */}
            <Card className="border-[#E8DCC4] shadow-xl bg-white overflow-hidden">
              <img
                src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/user_68ca933db3f173d5b5ee5174/424de1767_clubeimg.jpeg"
                alt="Club da Beleza"
                className="w-full h-48 object-cover"
              />
              <CardContent className="p-6">
                <p className="text-sm text-gray-600 text-center">
                  Junte-se a centenas de pessoas que já transformaram sua rotina de beleza
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
