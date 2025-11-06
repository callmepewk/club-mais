import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { 
  MapPin, Shield, Heart, CheckCircle, Star, Users,
  Sparkles, Award, TrendingUp, ExternalLink, ArrowRight,
  Search, Phone, Clock, Target
} from "lucide-react";

const features = [
  {
    icon: Shield,
    title: "Profissionais Verificados",
    description: "Todos os profissionais passam por rigoroso processo de validação para garantir segurança e qualidade."
  },
  {
    icon: Star,
    title: "Avaliações Reais",
    description: "Sistema de avaliações transparente com depoimentos verificados de clientes reais."
  },
  {
    icon: MapPin,
    title: "Geolocalização Inteligente",
    description: "Encontre os melhores profissionais próximos a você com precisão e rapidez."
  },
  {
    icon: Search,
    title: "Busca Avançada",
    description: "Filtre por especialidade, localização, preço, disponibilidade e muito mais."
  },
  {
    icon: Phone,
    title: "Agendamento Facilitado",
    description: "Agende diretamente com o profissional através da plataforma de forma simples."
  },
  {
    icon: Heart,
    title: "Salvando Vidas",
    description: "Nossa missão é evitar procedimentos inseguros e conectar pessoas a profissionais qualificados."
  }
];

const stats = [
  { number: "500+", label: "Profissionais Certificados" },
  { number: "50+", label: "Cidades Atendidas" },
  { number: "12+", label: "Especialidades" },
  { number: "10k+", label: "Procedimentos Realizados" }
];

const categories = [
  "Estética Facial",
  "Estética Corporal",
  "Harmonização Facial",
  "Depilação a Laser",
  "Micropigmentação",
  "Dermatologia",
  "Cirurgia Plástica",
  "Medicina Estética",
  "Massoterapia",
  "Nutrição Estética",
  "Fisioterapia Dermato",
  "Podologia"
];

export default function MapaDaEstetica() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-[#F5EFE6] to-white">
      {/* Hero Section */}
      <div className="relative py-24 px-6 overflow-hidden bg-gradient-to-br from-white via-[#F5EFE6] to-[#E8DCC4]">
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
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-8"
            >
              <Badge className="bg-white/80 text-[#D4AF37] border-[#D4AF37]/20 px-4 py-2 text-base backdrop-blur-sm">
                <Shield className="w-4 h-4 mr-2" />
                Plataforma Oficial
              </Badge>

              <div className="space-y-4">
                <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl font-bold leading-tight">
                  <span className="bg-gradient-to-r from-[#D4AF37] to-[#C8A882] bg-clip-text text-transparent">
                    Mapa da Estética
                  </span>
                </h1>

                <p className="text-2xl md:text-3xl text-gray-700 font-medium">
                  Salvando Vidas, Conectando Profissionais
                </p>

                <p className="text-xl text-gray-600 leading-relaxed">
                  A primeira plataforma do Brasil criada para evitar procedimentos estéticos inseguros 
                  e conectar você aos melhores profissionais certificados.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <a href="https://mapa-da-estetica.base44.app" target="_blank" rel="noopener noreferrer">
                  <Button 
                    size="lg"
                    className="bg-gradient-to-r from-[#D4AF37] to-[#C8A882] hover:from-[#C8A882] hover:to-[#D4AF37] text-white shadow-xl hover:shadow-2xl transition-all duration-300 px-8 py-6 text-lg font-semibold group"
                  >
                    Acessar Plataforma
                    <ExternalLink className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </a>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4">
                {stats.map((stat, index) => (
                  <div key={index} className="text-center p-4 bg-white/80 backdrop-blur-sm rounded-xl border border-[#E8DCC4]">
                    <div className="text-2xl font-bold bg-gradient-to-r from-[#D4AF37] to-[#C8A882] bg-clip-text text-transparent">
                      {stat.number}
                    </div>
                    <div className="text-xs text-gray-600 mt-1">{stat.label}</div>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div className="relative rounded-3xl overflow-hidden shadow-2xl">
                <img
                  src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/690ca5886318e973c6e913bb/0067369f9_mapainicioimg.jpg"
                  alt="Mapa da Estética"
                  className="w-full h-[600px] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                
                <div className="absolute bottom-8 left-8 right-8 bg-white/95 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-[#E8DCC4]">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-[#D4AF37] to-[#C8A882] rounded-full flex items-center justify-center shadow-lg">
                      <MapPin className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <h3 className="font-serif text-xl font-bold text-gray-800">
                        Mais de 500 Profissionais
                      </h3>
                      <p className="text-sm text-gray-600">Verificados e Certificados</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Mission Section */}
      <div className="py-24 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16 space-y-6"
          >
            <Badge className="bg-[#F5EFE6] text-[#D4AF37] px-4 py-2 text-base">
              <Target className="w-4 h-4 mr-2" />
              Nossa Missão
            </Badge>

            <h2 className="font-serif text-4xl md:text-5xl font-bold">
              <span className="text-gray-800">Evitando as</span>
              <span className="bg-gradient-to-r from-[#D4AF37] to-[#C8A882] bg-clip-text text-transparent"> "Macas Mortais"</span>
            </h2>

            <div className="max-w-4xl mx-auto space-y-6 text-lg text-gray-600 leading-relaxed">
              <p>
                O <strong className="text-[#C8A882]">Mapa da Estética</strong> nasceu de uma necessidade urgente: 
                <strong> proteger vidas e evitar tragédias causadas por procedimentos estéticos realizados por 
                profissionais não qualificados</strong>.
              </p>

              <p>
                Diariamente, pessoas buscam tratamentos de beleza e estética sem saber se estão nas mãos de 
                profissionais realmente capacitados. Muitas vezes, procedimentos simples se transformam em 
                complicações graves quando realizados em locais inadequados ou por pessoas sem formação adequada - 
                as chamadas <strong className="text-red-600">"macas mortais"</strong>.
              </p>

              <p>
                Nossa plataforma foi criada para <strong className="text-[#C8A882]">salvar vidas</strong>, 
                garantindo que você encontre apenas profissionais verificados, com formação comprovada, 
                registro profissional ativo e ambiente adequado para procedimentos estéticos.
              </p>

              <div className="bg-gradient-to-r from-[#F5EFE6] to-[#E8DCC4] rounded-2xl p-8 mt-8">
                <div className="flex items-start gap-4">
                  <Heart className="w-12 h-12 text-[#D4AF37] flex-shrink-0" />
                  <div className="text-left">
                    <h3 className="font-serif text-2xl font-bold text-gray-800 mb-2">
                      Segurança em Primeiro Lugar
                    </h3>
                    <p className="text-gray-700">
                      Todos os profissionais cadastrados passam por rigoroso processo de verificação, 
                      incluindo validação de formação, registro profissional, especialização e histórico. 
                      Seu bem-estar e segurança são nossa prioridade absoluta.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Features Section */}
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
                Por que escolher
              </span>
              <br />
              <span className="text-gray-800">o Mapa da Estética?</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Benefícios que fazem toda a diferença na sua jornada de beleza e bem-estar
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="h-full border-[#E8DCC4] hover:border-[#D4AF37] transition-all duration-300 hover:shadow-xl group bg-white">
                  <CardContent className="p-8 space-y-4">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#D4AF37] to-[#C8A882] flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                      <feature.icon className="w-7 h-7 text-white" />
                    </div>
                    
                    <h3 className="font-serif text-xl font-bold text-gray-800">
                      {feature.title}
                    </h3>
                    
                    <p className="text-gray-600 leading-relaxed">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Categories Section */}
      <div className="py-24 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16 space-y-4"
          >
            <h2 className="font-serif text-4xl md:text-5xl font-bold">
              <span className="text-gray-800">Mais de</span>
              <span className="bg-gradient-to-r from-[#D4AF37] to-[#C8A882] bg-clip-text text-transparent"> 12 Especialidades</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Encontre profissionais qualificados em diversas áreas da estética e beleza
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {categories.map((category, index) => (
              <motion.div
                key={category}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
              >
                <div className="p-4 bg-gradient-to-br from-white to-[#F5EFE6] rounded-xl border-2 border-[#E8DCC4] hover:border-[#D4AF37] transition-all duration-300 text-center group cursor-pointer">
                  <CheckCircle className="w-6 h-6 text-[#D4AF37] mx-auto mb-2 group-hover:scale-110 transition-transform" />
                  <p className="font-medium text-gray-800 text-sm">{category}</p>
                </div>
              </motion.div>
            ))}
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
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full border border-white/30">
              <Sparkles className="w-4 h-4 text-white" />
              <span className="text-sm font-medium text-white">
                Pronto para começar?
              </span>
            </div>

            <h2 className="font-serif text-4xl md:text-5xl font-bold text-white leading-tight">
              Encontre o profissional perfeito para você agora mesmo
            </h2>

            <p className="text-xl text-white/90">
              Acesse o Mapa da Estética e descubra mais de 500 profissionais verificados 
              próximos a você
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-6">
              <a href="https://mapa-da-estetica.base44.app" target="_blank" rel="noopener noreferrer">
                <Button 
                  size="lg"
                  className="bg-white text-[#D4AF37] hover:bg-white/90 shadow-2xl hover:shadow-3xl transition-all duration-300 px-10 py-7 text-lg font-semibold group"
                >
                  <MapPin className="w-5 h-5 mr-2" />
                  Explorar Mapa da Estética
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </a>
            </div>

            <p className="text-sm text-white/70 pt-4">
              Plataforma gratuita • Profissionais verificados • Segurança garantida
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}