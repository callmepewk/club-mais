import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { 
  GraduationCap, CheckCircle, ArrowRight, Sparkles,
  Upload, Users, TrendingUp, Award
} from "lucide-react";

const plans = [
  {
    id: "basic",
    name: "Basic",
    price: "A definir",
    period: "/mês",
    description: "Para profissionais iniciantes",
    features: [
      "Upload de até 5 conteúdos por mês",
      "Vídeo aulas de até 30 minutos",
      "E-books de até 50 páginas",
      "Estatísticas básicas de visualizações",
      "Suporte por email"
    ],
    highlighted: false
  },
  {
    id: "pro",
    name: "Pro",
    price: "A definir",
    period: "/mês",
    description: "Para profissionais estabelecidos",
    badge: "Mais Popular",
    features: [
      "Upload ilimitado de conteúdos",
      "Vídeo aulas sem limite de duração",
      "E-books e cursos completos",
      "Estatísticas avançadas e analytics",
      "Badge de verificação Pro",
      "Destaque na plataforma",
      "Suporte prioritário por WhatsApp",
      "Possibilidade de monetização"
    ],
    highlighted: true
  },
  {
    id: "premium",
    name: "Premium",
    price: "A definir",
    period: "/mês",
    description: "Para profissionais de elite",
    features: [
      "Todos os benefícios do Pro",
      "Página personalizada de instrutor",
      "Lives exclusivas com alunos",
      "Certificados personalizados",
      "Marketing e divulgação exclusiva",
      "Comissão maior nas vendas",
      "Suporte VIP 24/7",
      "Consultoria de conteúdo",
      "Badge Golden Instructor"
    ],
    highlighted: false
  }
];

const benefits = [
  {
    icon: Upload,
    title: "Compartilhe Conhecimento",
    description: "Publique vídeo aulas, cursos e e-books para milhares de profissionais"
  },
  {
    icon: Users,
    title: "Alcance Nacional",
    description: "Sua audiência em todo o Brasil através da nossa plataforma"
  },
  {
    icon: TrendingUp,
    title: "Monetize seu Saber",
    description: "Ganhe com seus conteúdos através do nosso sistema de comissões"
  },
  {
    icon: Award,
    title: "Construa Autoridade",
    description: "Torne-se referência no seu nicho de atuação"
  }
];

export default function EdBeautyPlans() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-[#F5EFE6] to-white">
      {/* Hero Section */}
      <div className="relative py-20 px-6 overflow-hidden bg-gradient-to-br from-[#D4AF37] via-[#C8A882] to-[#D4AF37]">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNiIgc3Ryb2tlPSIjRkZGIiBzdHJva2Utd2lkdGg9IjIiIG9wYWNpdHk9Ii4xIi8+PC9nPjwvc3ZnPg==')] opacity-10"></div>

        <div className="relative z-10 max-w-7xl mx-auto text-center space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-6"
          >
            <Badge className="bg-white/20 text-white border-white/30 px-4 py-2 text-base backdrop-blur-sm">
              <GraduationCap className="w-4 h-4 mr-2" />
              Para Profissionais
            </Badge>

            <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight">
              Planos Universidade da Beleza
            </h1>

            <p className="text-2xl md:text-3xl text-white/90 font-medium">
              Compartilhe seu Conhecimento
            </p>

            <p className="text-xl text-white/80 max-w-3xl mx-auto leading-relaxed">
              Escolha o plano ideal e comece a ensinar milhares de profissionais de estética
            </p>
          </motion.div>
        </div>
      </div>

      {/* Benefits */}
      <div className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16 space-y-4"
          >
            <h2 className="font-serif text-4xl md:text-5xl font-bold">
              <span className="text-gray-800">Por que ensinar na</span>
              <span className="bg-gradient-to-r from-[#D4AF37] to-[#C8A882] bg-clip-text text-transparent"> Universidade da Beleza?</span>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <motion.div
                key={benefit.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="h-full border-[#E8DCC4] hover:border-[#D4AF37] transition-all duration-300 hover:shadow-xl text-center group">
                  <CardContent className="p-8 space-y-4">
                    <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-[#D4AF37] to-[#C8A882] flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                      <benefit.icon className="w-8 h-8 text-white" />
                    </div>
                    
                    <h3 className="font-serif text-xl font-bold text-gray-800">
                      {benefit.title}
                    </h3>
                    
                    <p className="text-gray-600 leading-relaxed">
                      {benefit.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Plans */}
      <div className="py-20 px-6 bg-gradient-to-br from-white to-[#F5EFE6]">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16 space-y-4"
          >
            <h2 className="font-serif text-4xl md:text-5xl font-bold">
              <span className="bg-gradient-to-r from-[#D4AF37] to-[#C8A882] bg-clip-text text-transparent">
                Escolha seu
              </span>
              <span className="text-gray-800"> Plano</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Valores serão definidos em breve
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {plans.map((plan, index) => (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className={`h-full relative overflow-hidden ${
                  plan.highlighted 
                    ? 'border-[#D4AF37] border-2 shadow-2xl scale-105' 
                    : 'border-[#E8DCC4]'
                }`}>
                  {plan.badge && (
                    <div className="absolute top-0 right-0 bg-gradient-to-r from-[#D4AF37] to-[#C8A882] text-white px-4 py-1 text-sm font-semibold rounded-bl-lg">
                      {plan.badge}
                    </div>
                  )}
                  
                  <CardContent className="p-8 space-y-6">
                    <div>
                      <h3 className="font-serif text-2xl font-bold text-gray-800 mb-2">
                        {plan.name}
                      </h3>
                      <p className="text-gray-600">{plan.description}</p>
                    </div>

                    <div className="flex items-baseline gap-2">
                      <span className="font-serif text-4xl font-bold bg-gradient-to-r from-[#D4AF37] to-[#C8A882] bg-clip-text text-transparent">
                        {plan.price}
                      </span>
                      {plan.period && <span className="text-gray-600">{plan.period}</span>}
                    </div>

                    <ul className="space-y-3">
                      {plan.features.map((feature, i) => (
                        <li key={i} className="flex items-start gap-3">
                          <CheckCircle className="w-5 h-5 text-[#D4AF37] flex-shrink-0 mt-0.5" />
                          <span className="text-gray-700">{feature}</span>
                        </li>
                      ))}
                    </ul>

                    <Button 
                      disabled
                      className={`w-full py-6 text-lg font-semibold ${
                        plan.highlighted
                          ? 'bg-gradient-to-r from-[#D4AF37] to-[#C8A882] hover:from-[#C8A882] hover:to-[#D4AF37] text-white'
                          : 'bg-white border-2 border-[#D4AF37] text-[#D4AF37] hover:bg-[#F5EFE6]'
                      }`}
                    >
                      Em Breve
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="space-y-6"
          >
            <h2 className="font-serif text-4xl md:text-5xl font-bold">
              <span className="text-gray-800">Pronto para compartilhar</span>
              <br />
              <span className="bg-gradient-to-r from-[#D4AF37] to-[#C8A882] bg-clip-text text-transparent">
                seu conhecimento?
              </span>
            </h2>

            <p className="text-xl text-gray-600">
              Entre em contato para mais informações sobre os planos
            </p>

            <Link to={createPageUrl("Contact")}>
              <Button 
                size="lg"
                className="bg-gradient-to-r from-[#D4AF37] to-[#C8A882] hover:from-[#C8A882] hover:to-[#D4AF37] text-white shadow-xl hover:shadow-2xl transition-all duration-300 px-10 py-7 text-lg font-semibold group"
              >
                Falar com Nossa Equipe
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </div>
    </div>
  );
}