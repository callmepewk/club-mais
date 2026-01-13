import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { 
  Coins, Shield, TrendingUp, Gift, Sparkles, 
  CheckCircle, ArrowRight, Lock, Zap, Globe,
  Users, Award, Target, ShoppingCart
} from "lucide-react";
import BuyBeautyCoinModal from "../components/BuyBeautyCoinModal";

const features = [
  {
    icon: Coins,
    title: "Moeda Digital Exclusiva",
    description: "Beauty Coin é a primeira criptomoeda criada especificamente para o mercado de beleza e estética brasileiro."
  },
  {
    icon: Shield,
    title: "Segurança Blockchain",
    description: "Tecnologia blockchain de ponta garantindo máxima segurança em todas as suas transações."
  },
  {
    icon: TrendingUp,
    title: "Valorização Real",
    description: "Quanto maior nossa rede, maior o potencial de valorização da sua Beauty Coin."
  },
  {
    icon: Gift,
    title: "Múltiplos Usos",
    description: "Pague tratamentos, produtos, eventos exclusivos e troque com outros membros da comunidade."
  },
  {
    icon: Zap,
    title: "Transações Rápidas",
    description: "Pagamentos instantâneos sem taxas abusivas e com total transparência."
  },
  {
    icon: Globe,
    title: "Ecossistema Completo",
    description: "Use em toda nossa rede parceira de estabelecimentos e profissionais."
  }
];

const howItWorks = [
  {
    step: "1",
    title: "Ganhe Coins",
    description: "Receba Beauty Coins ao se associar ao clube, por indicações, compras e participação em eventos.",
    icon: Gift
  },
  {
    step: "2",
    title: "Acumule e Valorize",
    description: "Suas coins ficam seguras na carteira digital e podem se valorizar com o crescimento da rede.",
    icon: TrendingUp
  },
  {
    step: "3",
    title: "Use e Troque",
    description: "Pague serviços, compre produtos ou troque com outros membros do Club da Beleza.",
    icon: Coins
  }
];

const stats = [
  { number: "1000+", label: "Transações Realizadas" },
  { number: "R$ 50k+", label: "Volume Transacionado" },
  { number: "500+", label: "Usuários Ativos" },
  { number: "100+", label: "Parceiros Aceitando" }
];

const benefits = [
  "Ganhe 50 Beauty Coins ao se associar ao plano Gold",
  "Ganhe 150 Beauty Coins ao se associar ao plano VIP",
  "Receba coins extras a cada indicação de amigos",
  "Cashback em coins em todas as compras",
  "Participe de eventos exclusivos e ganhe coins",
  "Troque coins por serviços premium"
];

export default function BeautyCoin() {
  const [showBuyModal, setShowBuyModal] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-black">
      {/* Hero Section */}
      <div className="relative py-20 md:py-32 px-6 overflow-hidden bg-gradient-to-br from-black via-gray-900 to-black">
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.3, 0.5, 0.3]
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-[#D4AF37]/20 to-[#C8A882]/20 rounded-full blur-3xl"
          />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-8"
            >
              <Badge className="bg-gradient-to-r from-[#D4AF37] to-[#C8A882] text-white px-4 py-2 text-base border-0">
                <Coins className="w-4 h-4 mr-2" />
                Criptomoeda Exclusiva
              </Badge>

              <div className="space-y-4">
                <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl font-bold leading-tight">
                  <span className="bg-gradient-to-r from-[#D4AF37] via-[#E8DCC4] to-[#C8A882] bg-clip-text text-transparent">
                    Beauty Coin
                  </span>
                </h1>

                <p className="text-2xl md:text-3xl text-gray-300 font-medium">
                  A moeda do futuro da beleza
                </p>

                <p className="text-xl text-gray-400 leading-relaxed">
                  A primeira criptomoeda brasileira dedicada exclusivamente ao universo da 
                  beleza, estética e bem-estar. Revolucione a forma como você paga por autocuidado.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  size="lg"
                  onClick={() => setShowBuyModal(true)}
                  className="bg-gradient-to-r from-[#D4AF37] to-[#C8A882] hover:from-[#C8A882] hover:to-[#D4AF37] text-white shadow-2xl hover:shadow-3xl transition-all duration-300 px-8 py-6 text-lg font-semibold group"
                >
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  Comprar Beauty Coins
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
                <Link to={createPageUrl("Join")}>
                  <Button 
                    size="lg"
                    variant="outline"
                    className="border-2 border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-white shadow-2xl transition-all duration-300 px-8 py-6 text-lg font-semibold"
                  >
                    Ganhar Coins Grátis
                  </Button>
                </Link>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <motion.div
                animate={{ 
                  rotateY: 360,
                  scale: [1, 1.05, 1]
                }}
                transition={{ 
                  rotateY: { duration: 20, repeat: Infinity, ease: "linear" },
                  scale: { duration: 3, repeat: Infinity, ease: "easeInOut" }
                }}
                className="relative"
              >
                <img
                  src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/690ca5886318e973c6e913bb/0f335cbc2_beautycoin.png"
                  alt="Beauty Coin"
                  className="w-full h-auto max-w-md mx-auto drop-shadow-2xl"
                />
              </motion.div>

              {/* Glow Effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-[#D4AF37]/30 to-[#C8A882]/30 blur-3xl rounded-full"></div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="py-16 px-6 border-y border-white/10">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="text-3xl md:text-5xl font-bold bg-gradient-to-r from-[#D4AF37] to-[#C8A882] bg-clip-text text-transparent mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-400 text-sm md:text-base font-medium">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* How It Works */}
      <div className="py-20 md:py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16 space-y-4"
          >
            <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold">
              <span className="bg-gradient-to-r from-[#D4AF37] to-[#C8A882] bg-clip-text text-transparent">
                Como Funciona
              </span>
            </h2>
            <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto">
              Simples, seguro e revolucionário
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {howItWorks.map((item, index) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
              >
                <Card className="h-full bg-gray-800/50 border-[#D4AF37]/20 backdrop-blur-sm hover:border-[#D4AF37] transition-all duration-300 hover:shadow-xl hover:shadow-[#D4AF37]/20">
                  <CardContent className="p-8 space-y-6">
                    <div className="flex items-center justify-between">
                      <div className="text-6xl font-bold bg-gradient-to-r from-[#D4AF37] to-[#C8A882] bg-clip-text text-transparent opacity-20">
                        {item.step}
                      </div>
                      <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#D4AF37] to-[#C8A882] flex items-center justify-center shadow-lg shadow-[#D4AF37]/30">
                        <item.icon className="w-8 h-8 text-white" />
                      </div>
                    </div>
                    
                    <h3 className="font-serif text-2xl font-bold text-white">
                      {item.title}
                    </h3>
                    
                    <p className="text-gray-400 leading-relaxed">
                      {item.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20 md:py-24 px-6 bg-gray-900/50">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16 space-y-4"
          >
            <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold">
              <span className="text-white">Por que</span>
              <span className="bg-gradient-to-r from-[#D4AF37] to-[#C8A882] bg-clip-text text-transparent"> Beauty Coin?</span>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="h-full bg-gray-800/50 border-[#D4AF37]/20 backdrop-blur-sm hover:border-[#D4AF37] transition-all duration-300 hover:shadow-xl group">
                  <CardContent className="p-6 md:p-8 space-y-4">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#D4AF37] to-[#C8A882] flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                      <feature.icon className="w-7 h-7 text-white" />
                    </div>
                    
                    <h3 className="font-serif text-xl font-bold text-white">
                      {feature.title}
                    </h3>
                    
                    <p className="text-gray-400 leading-relaxed">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="py-20 md:py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <Card className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 border-[#D4AF37]/30 backdrop-blur-sm shadow-2xl">
              <CardContent className="p-8 md:p-12 space-y-8">
                <div className="text-center space-y-4">
                  <div className="w-20 h-20 mx-auto bg-gradient-to-br from-[#D4AF37] to-[#C8A882] rounded-full flex items-center justify-center shadow-lg shadow-[#D4AF37]/30">
                    <Coins className="w-10 h-10 text-white" />
                  </div>
                  <h2 className="font-serif text-3xl md:text-4xl font-bold text-white">
                    Como Ganhar Beauty Coins
                  </h2>
                  <p className="text-gray-400 max-w-2xl mx-auto">
                    Diversas formas de acumular sua criptomoeda exclusiva
                  </p>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  {benefits.map((benefit, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.6, delay: index * 0.1 }}
                      className="flex items-start gap-3 p-4 rounded-xl hover:bg-gray-700/30 transition-colors"
                    >
                      <CheckCircle className="w-6 h-6 text-[#D4AF37] flex-shrink-0 mt-0.5" />
                      <span className="text-gray-300">{benefit}</span>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20 md:py-24 px-6 bg-gradient-to-br from-[#D4AF37] via-[#C8A882] to-[#D4AF37]">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="space-y-6"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full border border-white/30">
              <Sparkles className="w-4 h-4 text-white" />
              <span className="text-sm font-medium text-white">
                Comece Agora
              </span>
            </div>

            <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight">
              Pronto para entrar no futuro dos pagamentos de beleza?
            </h2>

            <p className="text-lg md:text-xl text-white/90">
              Associe-se ao Club da Beleza e comece a acumular Beauty Coins hoje mesmo
            </p>

            <Link to={createPageUrl("Join")}>
              <Button 
                size="lg"
                className="bg-white text-[#D4AF37] hover:bg-white/90 shadow-2xl hover:shadow-3xl transition-all duration-300 px-8 md:px-10 py-6 md:py-7 text-lg font-semibold group"
              >
                <Coins className="w-5 h-5 mr-2" />
                Ganhar Minhas Coins
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </div>

      <BuyBeautyCoinModal 
        isOpen={showBuyModal}
        onClose={() => setShowBuyModal(false)}
      />
    </div>
  );
}