import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { 
  Sparkles, Crown, Heart, Gift, Star, Zap, 
  Percent, Calendar, MapPin, Award, Users, TrendingUp,
  ArrowRight, Check
} from "lucide-react";

const benefitCategories = [
  {
    title: "Descontos Exclusivos",
    icon: Percent,
    color: "from-[#D4AF37] to-[#C8A882]",
    items: [
      "Até 50% de desconto em tratamentos estéticos",
      "30% off em produtos de beleza premium",
      "20% de desconto em serviços de salão",
      "Descontos especiais em spas parceiros"
    ]
  },
  {
    title: "Experiências Premium",
    icon: Crown,
    color: "from-[#C8A882] to-[#E8DCC4]",
    items: [
      "Acesso a eventos exclusivos do setor",
      "Workshops e masterclasses gratuitas",
      "Preview de novos produtos e serviços",
      "Consultoria personalizada de beleza"
    ]
  },
  {
    title: "Programa de Recompensas",
    icon: Gift,
    color: "from-[#D4AF37] to-[#C8A882]",
    items: [
      "Ganhe pontos a cada compra",
      "Troque pontos por serviços gratuitos",
      "Bônus de aniversário",
      "Recompensas por indicação de amigos"
    ]
  },
  {
    title: "Acesso Prioritário",
    icon: Zap,
    color: "from-[#C8A882] to-[#E8DCC4]",
    items: [
      "Agendamento prioritário",
      "Atendimento VIP nos parceiros",
      "Acesso antecipado a promoções",
      "Suporte dedicado 24/7"
    ]
  }
];

const features = [
  {
    icon: MapPin,
    title: "Rede Nacional",
    description: "Mais de 100 estabelecimentos parceiros em todo o país"
  },
  {
    icon: Award,
    title: "Qualidade Garantida",
    description: "Todos os parceiros são criteriosamente selecionados"
  },
  {
    icon: Users,
    title: "Comunidade",
    description: "Faça parte de uma rede de pessoas apaixonadas por beleza"
  },
  {
    icon: TrendingUp,
    title: "Economia Real",
    description: "Economize em média 30% em serviços de beleza"
  }
];

const plans = [
  {
    name: "Mensal",
    price: "R$ 29,90",
    period: "/mês",
    description: "Ideal para quem quer testar",
    features: [
      "Acesso a todos os benefícios",
      "Descontos em parceiros",
      "Programa de pontos",
      "Suporte por e-mail"
    ],
    highlighted: false
  },
  {
    name: "Anual",
    price: "R$ 299,90",
    period: "/ano",
    description: "Melhor custo-benefício",
    features: [
      "Todos os benefícios do plano mensal",
      "2 meses grátis",
      "Eventos exclusivos",
      "Suporte prioritário",
      "Brindes especiais"
    ],
    highlighted: true,
    badge: "Mais Popular"
  }
];

export default function Benefits() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F5EFE6] to-white">
      {/* Hero Section */}
      <div className="relative py-20 px-6 overflow-hidden bg-gradient-to-br from-white via-[#F5EFE6] to-[#E8DCC4]">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center space-y-6"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full border border-[#D4AF37]/20 shadow-lg">
              <Sparkles className="w-4 h-4 text-[#D4AF37]" />
              <span className="text-sm font-medium text-[#C8A882]">
                Conheça todos os benefícios
              </span>
            </div>

            <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl font-bold">
              <span className="bg-gradient-to-r from-[#D4AF37] to-[#C8A882] bg-clip-text text-transparent">
                Vantagens exclusivas
              </span>
              <br />
              <span className="text-gray-800">para você</span>
            </h1>

            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Descubra como o Club da Beleza pode transformar sua experiência de autocuidado 
              com benefícios exclusivos e economia real
            </p>
          </motion.div>
        </div>
      </div>

      {/* Benefits Grid */}
      <div className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8 mb-20">
            {benefitCategories.map((category, index) => (
              <motion.div
                key={category.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="h-full border-[#E8DCC4] hover:border-[#D4AF37] transition-all duration-300 hover:shadow-xl bg-white">
                  <CardHeader className="pb-4">
                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${category.color} flex items-center justify-center shadow-lg mb-4`}>
                      <category.icon className="w-7 h-7 text-white" />
                    </div>
                    <CardTitle className="font-serif text-2xl text-gray-800">
                      {category.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {category.items.map((item, i) => (
                        <li key={i} className="flex items-start gap-3">
                          <Check className="w-5 h-5 text-[#D4AF37] flex-shrink-0 mt-0.5" />
                          <span className="text-gray-600">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Features */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="bg-white rounded-3xl shadow-xl p-12 border border-[#E8DCC4]"
          >
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-center mb-12">
              <span className="bg-gradient-to-r from-[#D4AF37] to-[#C8A882] bg-clip-text text-transparent">
                Por que escolher
              </span>
              <span className="text-gray-800"> o Club da Beleza?</span>
            </h2>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="text-center space-y-4"
                >
                  <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-[#F5EFE6] to-[#E8DCC4] flex items-center justify-center">
                    <feature.icon className="w-8 h-8 text-[#D4AF37]" />
                  </div>
                  <h3 className="font-semibold text-xl text-gray-800">{feature.title}</h3>
                  <p className="text-gray-600 text-sm">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Pricing */}
      <div className="py-20 px-6 bg-gradient-to-br from-[#F5EFE6] to-white">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16 space-y-4"
          >
            <h2 className="font-serif text-4xl md:text-5xl font-bold">
              <span className="text-gray-800">Escolha seu</span>
              <span className="bg-gradient-to-r from-[#D4AF37] to-[#C8A882] bg-clip-text text-transparent"> plano</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Invista no seu bem-estar e comece a economizar hoje mesmo
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {plans.map((plan, index) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className={`h-full relative overflow-hidden ${
                  plan.highlighted 
                    ? 'border-[#D4AF37] border-2 shadow-2xl' 
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
                      <span className="font-serif text-5xl font-bold bg-gradient-to-r from-[#D4AF37] to-[#C8A882] bg-clip-text text-transparent">
                        {plan.price}
                      </span>
                      <span className="text-gray-600">{plan.period}</span>
                    </div>

                    <ul className="space-y-3">
                      {plan.features.map((feature, i) => (
                        <li key={i} className="flex items-start gap-3">
                          <Check className="w-5 h-5 text-[#D4AF37] flex-shrink-0 mt-0.5" />
                          <span className="text-gray-700">{feature}</span>
                        </li>
                      ))}
                    </ul>

                    <Link to={createPageUrl("Join")} className="block">
                      <Button 
                        className={`w-full py-6 text-lg font-semibold ${
                          plan.highlighted
                            ? 'bg-gradient-to-r from-[#D4AF37] to-[#C8A882] hover:from-[#C8A882] hover:to-[#D4AF37] text-white'
                            : 'bg-white border-2 border-[#D4AF37] text-[#D4AF37] hover:bg-[#F5EFE6]'
                        }`}
                      >
                        Começar Agora
                        <ArrowRight className="w-5 h-5 ml-2" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}