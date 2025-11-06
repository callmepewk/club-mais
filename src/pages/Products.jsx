
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { 
  ExternalLink, MapPin, Zap, Stethoscope, 
  Sparkles, CheckCircle, ArrowRight, Star
} from "lucide-react";

const products = [
  {
    name: "Mapa da Estética",
    tagline: "Encontre os melhores profissionais perto de você",
    description: "A maior plataforma de busca e conexão com profissionais de estética e beleza do Brasil. Mais de 500 profissionais certificados em todo o país.",
    icon: MapPin,
    color: "from-[#D4AF37] to-[#C8A882]",
    url: "https://mapa-da-estetica.base44.app",
    image: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/690ca5886318e973c6e913bb/0067369f9_mapainicioimg.jpg",
    features: [
      "Busca por localização e especialidade",
      "Perfis verificados de profissionais",
      "Avaliações e depoimentos reais",
      "Agendamento online facilitado",
      "Dr. Beleza - Assistente com IA"
    ],
    stats: [
      { label: "Profissionais", value: "500+" },
      { label: "Cidades", value: "50+" },
      { label: "Categorias", value: "12+" }
    ]
  },
  {
    name: "Laser Code Pro",
    tagline: "Tecnologia de ponta para depilação a laser",
    description: "Sistema profissional completo para gestão e otimização de tratamentos de depilação a laser, com protocolos personalizados e acompanhamento em tempo real.",
    icon: Zap,
    color: "from-[#C8A882] to-[#E8DCC4]",
    url: "https://laser-code-pro.base44.app",
    image: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/690ca5886318e973c6e913bb/b5c2dbd3d_lasercodeinicioimg.jpg",
    features: [
      "Protocolos personalizados por tipo de pele",
      "Gestão completa de clientes",
      "Controle de sessões e resultados",
      "Relatórios de progresso detalhados",
      "Interface intuitiva e profissional"
    ],
    stats: [
      { label: "Clínicas", value: "100+" },
      { label: "Sessões", value: "10k+" },
      { label: "Satisfação", value: "98%" }
    ]
  },
  {
    name: "Dr. Spok PD",
    tagline: "Sua saúde na palma da mão",
    description: "Plataforma de telemedicina e gestão de saúde que conecta pacientes a profissionais qualificados, com prontuários digitais e acompanhamento personalizado.",
    icon: Stethoscope,
    color: "from-[#D4AF37] to-[#C8A882]",
    url: "https://dr-spok-pd.base44.app",
    image: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/690ca5886318e973c6e913bb/c7ece5305_drspokinicioimg.jpg",
    features: [
      "Consultas online com especialistas",
      "Prontuário eletrônico seguro",
      "Receitas e prescrições digitais",
      "Lembretes de medicamentos",
      "Histórico médico completo"
    ],
    stats: [
      { label: "Médicos", value: "200+" },
      { label: "Consultas", value: "5k+" },
      { label: "Usuários", value: "3k+" }
    ]
  }
];

export default function Products() {
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
                Conheça nosso ecossistema
              </span>
            </div>

            <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl font-bold">
              <span className="text-gray-800">Nossos</span>
              <br />
              <span className="bg-gradient-to-r from-[#D4AF37] to-[#C8A882] bg-clip-text text-transparent">
                Produtos
              </span>
            </h1>

            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Plataformas inovadoras que transformam a experiência de beleza, estética e saúde
            </p>
          </motion.div>
        </div>
      </div>

      {/* Products Section */}
      <div className="py-24 px-6">
        <div className="max-w-7xl mx-auto space-y-32">
          {products.map((product, index) => (
            <motion.div
              key={product.name}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <div className={`grid lg:grid-cols-2 gap-12 items-center ${
                index % 2 === 1 ? 'lg:flex-row-reverse' : ''
              }`}>
                {/* Content */}
                <div className={`space-y-8 ${index % 2 === 1 ? 'lg:order-2' : ''}`}>
                  <div className="space-y-4">
                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${product.color} flex items-center justify-center shadow-lg`}>
                      <product.icon className="w-8 h-8 text-white" />
                    </div>

                    <div className="space-y-2">
                      <h2 className="font-serif text-4xl md:text-5xl font-bold text-gray-800">
                        {product.name}
                      </h2>
                      <p className="text-xl text-[#C8A882] font-medium">
                        {product.tagline}
                      </p>
                    </div>

                    <p className="text-lg text-gray-600 leading-relaxed">
                      {product.description}
                    </p>
                  </div>

                  {/* Features */}
                  <div className="space-y-3">
                    {product.features.map((feature, i) => (
                      <div key={i} className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-[#D4AF37] flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700">{feature}</span>
                      </div>
                    ))}
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-4 pt-4">
                    {product.stats.map((stat, i) => (
                      <div key={i} className="text-center p-4 bg-gradient-to-br from-[#F5EFE6] to-[#E8DCC4] rounded-xl">
                        <div className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-[#D4AF37] to-[#C8A882] bg-clip-text text-transparent">
                          {stat.value}
                        </div>
                        <div className="text-xs md:text-sm text-gray-600 mt-1">
                          {stat.label}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* CTA Button */}
                  <a 
                    href={product.url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button 
                      size="lg"
                      className={`bg-gradient-to-r ${product.color} hover:opacity-90 text-white shadow-xl hover:shadow-2xl transition-all duration-300 px-8 py-6 text-lg font-medium group`}
                    >
                      Acessar Plataforma
                      <ExternalLink className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </a>
                </div>

                {/* Image */}
                <div className={`relative ${index % 2 === 1 ? 'lg:order-1' : ''}`}>
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="relative rounded-3xl overflow-hidden shadow-2xl"
                  >
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-[500px] object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                    
                    {/* Floating Badge */}
                    <div className="absolute bottom-6 left-6 right-6 bg-white/95 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-[#E8DCC4]">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-serif text-xl font-bold text-gray-800">
                            {product.name}
                          </h3>
                          <p className="text-sm text-gray-600 mt-1">
                            Disponível Agora
                          </p>
                        </div>
                        <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${product.color} flex items-center justify-center shadow-lg`}>
                          <Star className="w-6 h-6 text-white" />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          ))}
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
              Faça parte do nosso ecossistema de beleza e saúde
            </h2>

            <p className="text-xl text-white/90">
              Acesse todas as plataformas e transforme sua experiência de autocuidado
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
              <a href="https://mapa-da-estetica.base44.app" target="_blank" rel="noopener noreferrer">
                <Button 
                  size="lg"
                  className="bg-white text-[#D4AF37] hover:bg-white/90 shadow-xl hover:shadow-2xl transition-all duration-300 px-10 py-7 text-lg font-semibold group"
                >
                  Explorar Mapa da Estética
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
