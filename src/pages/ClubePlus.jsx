
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import {
  CreditCard, Sparkles, Gift, Percent, Star,
  Coins, TrendingUp, Award, CheckCircle, Crown,
  ArrowRight, Zap, Shield
} from "lucide-react";

const cardBenefits = [
  {
    icon: Percent,
    title: "Descontos Exclusivos",
    description: "Até 25% de desconto em toda rede parceira"
  },
  {
    icon: Coins,
    title: "Beauty Coins",
    description: "Ganhe criptomoedas exclusivas a cada compra"
  },
  {
    icon: Gift,
    title: "Cashback Garantido",
    description: "Até 10% de volta em todas as transações"
  },
  {
    icon: Star,
    title: "Programa de Pontos",
    description: "Acumule pontos e troque por serviços"
  },
  {
    icon: Crown,
    title: "Status Premium",
    description: "Reconhecimento VIP em toda rede"
  },
  {
    icon: Zap,
    title: "Prioridade Total",
    description: "Agendamento e atendimento prioritário"
  }
];

const cardTiers = [
  {
    name: "Cartão Light",
    color: "from-gray-400 to-gray-500",
    image: "https://images.unsplash.com/photo-1614680376739-414d95ff43df?w=800&q=80",
    benefits: [
      "Acesso básico à rede",
      "Programa de pontos padrão",
      "Cashback de 2%",
      "Suporte por email"
    ],
    price: "Grátis"
  },
  {
    name: "Cartão Gold",
    color: "from-[#D4AF37] to-[#C8A882]",
    image: "https://images.unsplash.com/photo-1614680376408-81e91ffe3db7?w=800&q=80",
    benefits: [
      "15% desconto na rede",
      "100 pontos mensais",
      "Cashback de 5%",
      "50 Beauty Coins mensais",
      "Suporte prioritário"
    ],
    price: "R$ 49,90/mês",
    popular: true
  },
  {
    name: "Cartão VIP",
    color: "from-purple-600 to-purple-800",
    image: "https://images.unsplash.com/photo-1614680376593-902f74cf0d41?w=800&q=80",
    benefits: [
      "25% desconto na rede",
      "300 pontos mensais",
      "Cashback de 10%",
      "150 Beauty Coins mensais",
      "Suporte 24/7",
      "Eventos exclusivos"
    ],
    price: "R$ 99,90/mês"
  }
];

const beautyCoinFeatures = [
  {
    icon: Coins,
    title: "Criptomoeda Exclusiva",
    description: "Beauty Coin é nossa moeda digital exclusiva para o universo da beleza e estética"
  },
  {
    icon: Shield,
    title: "Segura e Confiável",
    description: "Tecnologia blockchain garantindo segurança em todas as transações"
  },
  {
    icon: TrendingUp,
    title: "Valorização Real",
    description: "Sua Beauty Coin pode se valorizar com o crescimento da nossa rede"
  },
  {
    icon: Gift,
    title: "Múltiplos Usos",
    description: "Use em produtos, serviços, eventos e troque com outros membros"
  }
];

const beautyClubCards = [
  {
    name: "Beauty Club Basic",
    image: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/690ca5886318e973c6e913bb/cecaeee22_cartobeautyclub1.jpeg",
    tier: "Standard",
    price: "A definir",
    benefits: [
      "Descontos básicos",
      "Cashback padrão",
      "Programa de pontos",
      "Suporte via email"
    ]
  },
  {
    name: "Beauty Club Pro",
    image: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/690ca5886318e973c6e913bb/f1022619b_cartobeautyclub2.jpeg",
    tier: "Premium",
    price: "A definir",
    benefits: [
      "Descontos especiais",
      "Cashback gold",
      "Acesso a eventos",
      "Suporte dedicado"
    ]
  },
  {
    name: "Beauty Club Exclusive",
    image: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/690ca5886318e973c6e913bb/a5baa0dd0_cartobeautyclub3.jpeg",
    tier: "VIP",
    price: "A definir",
    benefits: [
      "Acesso VIP a todos os estabelecimentos",
      "Cashback premium",
      "Eventos exclusivos",
      "Prioridade máxima",
      "Concierge personalizado"
    ]
  }
];

export default function ClubePlus() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-[#F5EFE6] to-white">
      {/* Hero Section */}
      <div className="relative py-20 px-6 overflow-hidden bg-gradient-to-br from-[#D4AF37] via-[#C8A882] to-[#D4AF37]">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNiIgc3Ryb2tlPSIjRkZGIiBzdHJva2Utd2lkdGg9IjIiIG9wYWNpdHk9Ii4xIi8+PC9nPjwvc3ZnPg==')] opacity-10"></div>

        <div className="relative z-10 max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center space-y-8"
          >
            <motion.div
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="inline-block"
            >
              <CreditCard className="w-24 h-24 text-white mx-auto" />
            </motion.div>

            <div className="space-y-4">
              <Badge className="bg-white/20 text-white border-white/30 px-4 py-2 text-base backdrop-blur-sm">
                Exclusivo para Membros
              </Badge>

              <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight">
                Clube+
              </h1>

              <p className="text-2xl md:text-3xl text-white/90 font-medium">
                Seu Cartão Premium de Beleza
              </p>

              <p className="text-xl text-white/80 max-w-3xl mx-auto leading-relaxed">
                Tenha acesso a benefícios exclusivos, descontos especiais e Beauty Coins
                com o cartão Club da Beleza
              </p>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Card Benefits */}
      <div className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16 space-y-4"
          >
            <h2 className="font-serif text-4xl md:text-5xl font-bold">
              <span className="text-gray-800">Benefícios do</span>
              <span className="bg-gradient-to-r from-[#D4AF37] to-[#C8A882] bg-clip-text text-transparent"> Cartão</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Vantagens exclusivas em toda a nossa rede parceira
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {cardBenefits.map((benefit, index) => (
              <motion.div
                key={benefit.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="h-full border-[#E8DCC4] hover:border-[#D4AF37] transition-all duration-300 hover:shadow-xl group bg-white">
                  <CardContent className="p-8 space-y-4 text-center">
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

      {/* Beauty Club Cards Section */}
      <div className="py-24 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16 space-y-4"
          >
            <Badge className="bg-[#F5EFE6] text-[#D4AF37] px-4 py-2 text-base">
              <CreditCard className="w-4 h-4 mr-2" />
              Beauty Club Cards
            </Badge>

            <h2 className="font-serif text-4xl md:text-5xl font-bold">
              <span className="bg-gradient-to-r from-[#D4AF37] to-[#C8A882] bg-clip-text text-transparent">
                Cartões Beauty Club
              </span>
              <br />
              <span className="text-gray-800">Exclusivos e Elegantes</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Receba seu cartão Beauty Club personalizado com design premium
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {beautyClubCards.map((card, index) => (
              <motion.div
                key={card.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="h-full overflow-hidden border-[#E8DCC4] hover:border-[#D4AF37] transition-all duration-300 hover:shadow-2xl group">
                  {/* Card Image */}
                  <div className="relative h-64 overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center p-8">
                    <img
                      src={card.image}
                      alt={card.name}
                      className="w-full h-auto object-contain group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-4 right-4 z-20">
                      <Badge className="bg-white/90 text-[#D4AF37] border-[#D4AF37]/20 font-bold">
                        {card.tier}
                      </Badge>
                    </div>
                  </div>

                  <CardContent className="p-6 space-y-4">
                    <div>
                      <h3 className="font-serif text-2xl font-bold text-gray-800 mb-2">
                        {card.name}
                      </h3>
                      <div className="flex items-baseline gap-2 mb-4">
                        <span className="text-2xl font-bold bg-gradient-to-r from-[#D4AF37] to-[#C8A882] bg-clip-text text-transparent">
                          {card.price}
                        </span>
                      </div>
                    </div>

                    <ul className="space-y-2">
                      {card.benefits.map((benefit, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <CheckCircle className="w-4 h-4 text-[#D4AF37] flex-shrink-0 mt-0.5" />
                          <span className="text-sm text-gray-600">{benefit}</span>
                        </li>
                      ))}
                    </ul>

                    <Link to={createPageUrl("Join")} className="block">
                      <Button
                        className="w-full bg-gradient-to-r from-[#D4AF37] to-[#C8A882] text-white py-6 text-lg font-semibold group-hover:shadow-xl transition-all"
                      >
                        Solicitar Cartão
                        <ArrowRight className="w-5 h-5 ml-2" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-gradient-to-r from-[#F5EFE6] to-[#E8DCC4] rounded-2xl p-8"
          >
            <div className="flex items-start gap-4">
              <Sparkles className="w-8 h-8 text-[#D4AF37] flex-shrink-0" />
              <div>
                <h4 className="font-serif text-xl font-bold text-gray-800 mb-2">
                  Cartões Premium com Design Exclusivo
                </h4>
                <p className="text-gray-700 leading-relaxed">
                  Os cartões Beauty Club são produzidos com materiais premium e design elegante.
                  Cada cartão é personalizado com seu nome e oferece acesso a benefícios exclusivos
                  em toda nossa rede parceira. Os valores e planos estão sendo definidos para oferecer
                  a melhor experiência aos nossos membros.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Card Tiers */}
      <div className="py-24 px-6 bg-gradient-to-br from-white to-[#F5EFE6]">
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
                Categorias
              </span>
              <span className="text-gray-800"> de Cartões</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Escolha o cartão ideal para seu perfil
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {cardTiers.map((card, index) => (
              <motion.div
                key={card.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className={`h-full overflow-hidden ${
                  card.popular ? 'border-[#D4AF37] border-2 shadow-2xl scale-105' : 'border-[#E8DCC4]'
                }`}>
                  {card.popular && (
                    <div className="bg-gradient-to-r from-[#D4AF37] to-[#C8A882] text-white text-center py-2 text-sm font-semibold">
                      Mais Popular
                    </div>
                  )}

                  {/* Card Visual */}
                  <div className="relative h-48 overflow-hidden">
                    <div className={`absolute inset-0 bg-gradient-to-br ${card.color}`}>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <CreditCard className="w-32 h-32 text-white/20" />
                      </div>
                    </div>
                    <div className="absolute inset-0 bg-black/20"></div>
                    <div className="absolute bottom-6 left-6 right-6">
                      <h3 className="font-serif text-2xl font-bold text-white">
                        {card.name}
                      </h3>
                      <p className="text-white/90 text-lg font-semibold mt-1">
                        {card.price}
                      </p>
                    </div>
                  </div>

                  <CardContent className="p-8 space-y-4">
                    <ul className="space-y-3">
                      {card.benefits.map((benefit, i) => (
                        <li key={i} className="flex items-start gap-3">
                          <CheckCircle className="w-5 h-5 text-[#D4AF37] flex-shrink-0 mt-0.5" />
                          <span className="text-gray-700">{benefit}</span>
                        </li>
                      ))}
                    </ul>

                    <Link to={createPageUrl("Join")} className="block">
                      <Button
                        className={`w-full py-6 text-lg font-semibold ${
                          card.popular
                            ? 'bg-gradient-to-r from-[#D4AF37] to-[#C8A882] hover:from-[#C8A882] hover:to-[#D4AF37] text-white'
                            : 'bg-white border-2 border-[#D4AF37] text-[#D4AF37] hover:bg-[#F5EFE6]'
                        }`}
                      >
                        Solicitar Cartão
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

      {/* Beauty Coin Section */}
      <div className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="space-y-6"
            >
              <div className="space-y-4">
                <Badge className="bg-gradient-to-r from-[#D4AF37] to-[#C8A882] text-white px-4 py-2 text-base">
                  Inovação em Pagamentos
                </Badge>

                <h2 className="font-serif text-4xl md:text-5xl font-bold">
                  <span className="bg-gradient-to-r from-[#D4AF37] to-[#C8A882] bg-clip-text text-transparent">
                    Beauty Coin
                  </span>
                  <br />
                  <span className="text-gray-800">Nossa Criptomoeda</span>
                </h2>
              </div>

              <div className="space-y-4 text-gray-600 leading-relaxed text-lg">
                <p>
                  A <strong className="text-[#C8A882]">Beauty Coin</strong> é nossa criptomoeda exclusiva,
                  criada especialmente para revolucionar a forma como você paga por serviços e produtos
                  de beleza e estética.
                </p>

                <p>
                  Com tecnologia blockchain, garantimos segurança, transparência e a possibilidade de
                  valorização da sua moeda. Quanto mais a nossa rede cresce, mais valor suas Beauty Coins
                  podem ter!
                </p>

                <p>
                  Use suas Beauty Coins para pagar tratamentos, comprar produtos, participar de eventos
                  exclusivos ou até mesmo trocar com outros membros da comunidade.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4">
                {beautyCoinFeatures.slice(0, 2).map((feature, index) => (
                  <Card key={index} className="border-[#E8DCC4] bg-gradient-to-br from-white to-[#F5EFE6]">
                    <CardContent className="p-6 space-y-3">
                      <feature.icon className="w-8 h-8 text-[#D4AF37]" />
                      <h4 className="font-semibold text-gray-800">{feature.title}</h4>
                      <p className="text-sm text-gray-600">{feature.description}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <div className="relative rounded-3xl overflow-hidden shadow-2xl">
                <div className="bg-gradient-to-br from-[#D4AF37] via-[#C8A882] to-[#D4AF37] p-12 min-h-[500px] flex items-center justify-center">
                  <motion.div
                    animate={{
                      rotate: 360,
                      scale: [1, 1.1, 1]
                    }}
                    transition={{
                      rotate: { duration: 20, repeat: Infinity, ease: "linear" },
                      scale: { duration: 2, repeat: Infinity, ease: "easeInOut" }
                    }}
                    className="w-64 h-64 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center border-4 border-white/30"
                  >
                    <Coins className="w-32 h-32 text-white" />
                  </motion.div>
                </div>

                {/* Stats */}
                <div className="absolute bottom-8 left-8 right-8 bg-white/95 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-[#E8DCC4]">
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <div className="text-2xl font-bold bg-gradient-to-r from-[#D4AF37] to-[#C8A882] bg-clip-text text-transparent">
                        1000+
                      </div>
                      <div className="text-xs text-gray-600">Transações</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold bg-gradient-to-r from-[#D4AF37] to-[#C8A882] bg-clip-text text-transparent">
                        500+
                      </div>
                      <div className="text-xs text-gray-600">Membros</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold bg-gradient-to-r from-[#D4AF37] to-[#C8A882] bg-clip-text text-transparent">
                        R$ 50k+
                      </div>
                      <div className="text-xs text-gray-600">Volume</div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-24 px-6 bg-gradient-to-br from-[#D4AF37] via-[#C8A882] to-[#D4AF37]">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="space-y-6"
          >
            <h2 className="font-serif text-4xl md:text-5xl font-bold text-white leading-tight">
              Solicite seu cartão agora e comece a acumular benefícios!
            </h2>

            <p className="text-xl text-white/90">
              Junte-se aos milhares de membros que já estão economizando e acumulando Beauty Coins
            </p>

            <Link to={createPageUrl("Join")}>
              <Button
                size="lg"
                className="bg-white text-[#D4AF37] hover:bg-white/90 shadow-2xl hover:shadow-3xl transition-all duration-300 px-10 py-7 text-lg font-semibold group"
              >
                <CreditCard className="w-5 h-5 mr-2" />
                Solicitar Meu Cartão
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
