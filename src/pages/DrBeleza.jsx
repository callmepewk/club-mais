
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { motion } from "framer-motion";
import { 
  Sparkles, Search, Calendar, DollarSign, 
  MapPin, Phone, ArrowRight, Award,
  CheckCircle, Heart
} from "lucide-react";

const treatmentCategories = [
  // Estética Facial
  "Limpeza de Pele", "Hidratação Facial", "Esfoliação", "Revitalização Facial",
  "Microagulhamento", "Skinbooster", "Preenchimento Facial", "Ácido Hialurônico",
  "Toxina Botulínica (Botox)", "Peeling Químico", "Peeling Físico", "Peeling Enzimático",
  "Radiofrequência Facial", "Microdermoabrasão",
  "Tratamento de Acne", "Tratamento de Melasma", "Tratamento de Manchas",
  "Tratamento de Olheiras", "Tratamento de Cicatrizes", "Tratamento de Flacidez Facial",
  "Harmonização Facial (HOF)", "Bioestimuladores de Colágeno", "Fios de Sustentação",
  
  // Estética Corporal
  "Criolipólise", "Ultracavitação", "Radiofrequência Corporal", "Carboxiterapia",
  "Lipoenzimática (Intradermoterapia)", "Massagem Modeladora",
  "Ondas de Choque", "Subcisão", "Endermologia",
  "Tratamento de Celulite", "Tratamento de Estrias",
  "Ultrassom Micro e Macrofocado (HIFU)", "Correntes Russa", "Correntes Aussie",
  "Depilação a Laser", "Luz Intensa Pulsada (IPL)", "Depilação a LED",
  "Drenagem Linfática Manual", "Drenagem Pós-operatória", "Drenagem Gestacional",
  
  // Estética Capilar
  "Tratamento de Queda de Cabelo", "Tratamento de Alopécia", "Tratamento de Caspa",
  "Tratamento de Oleosidade Capilar", "Tratamento de Dermatite Seborreica",
  "Microagulhamento Capilar", "Mesoterapia Capilar", "Laser Capilar", "LED Capilar",
  "Transplante Capilar",
  
  // Estética de Mãos e Pés
  "Manicure", "Pedicure", "Estética Avançada dos Pés", "Podologia",
  "Tratamento de Unhas Encravadas", "Tratamento de Calosidades",
  "Tratamento de Micoses", "Pé Diabético",
  
  // Micropigmentação e Design
  "Design de Sobrancelhas", "Micropigmentação Fio a Fio", "Shadow",
  "Microblading", "Delineador Permanente", "Micropigmentação Labial",
  "Revitalização Labial", "Extensão de Cílios", "Alongamento de Cílios", "Lash Lifting",
  
  // Medicina Estética e Cirurgia
  "Cirurgia Plástica", "Dermatologia", "Medicina Integrativa",
  "Nutrologia", "Fisioterapia Dermato Funcional", "Pilates",
  "Nutrição Esportiva", "Nutrição Clínica", "Nutrição Funcional",
  "Psicologia da Autoestima", "Coaching de Imagem Corporal",
  
  // Outros
  "Acupuntura Estética", "Aromaterapia", "Terapias Holísticas",
  "Personal Training Estético", "Spa e Relaxamento"
];

const areas = [
  "Rosto", "Corpo", "Cabelo", "Unhas", "Pele", "Múltiplas Áreas"
];

const budgets = [
  "Até R$ 500",
  "R$ 500 - R$ 1.000",
  "R$ 1.000 - R$ 2.000",
  "R$ 2.000 - R$ 5.000",
  "Acima de R$ 5.000"
];

const timeframes = [
  "Imediato",
  "Próximos 7 dias",
  "Próximos 30 dias",
  "Próximos 3 meses",
  "Planejando para depois"
];

const features = [
  {
    icon: Heart,
    title: "Inteligência Artificial",
    description: "Tecnologia avançada para encontrar o tratamento perfeito"
  },
  {
    icon: MapPin,
    title: "Geolocalização",
    description: "Profissionais próximos a você com um clique"
  },
  {
    icon: Award,
    title: "Profissionais Verificados",
    description: "Apenas os melhores e mais qualificados"
  },
  {
    icon: Heart,
    title: "Personalizado",
    description: "Recomendações baseadas no seu perfil"
  }
];

export default function DrBeleza() {
  const [formData, setFormData] = useState({
    treatment: "",
    area: "",
    budget: "",
    timeframe: "",
    location: ""
  });
  const [isSearching, setIsSearching] = useState(false);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSearch = () => {
    setIsSearching(true);
    console.log("Searching with:", formData);
    
    setTimeout(() => {
      setIsSearching(false);
      window.open('https://mapa-da-estetica.base44.app', '_blank');
    }, 2000);
  };

  const handleTeleconsulta = () => {
    window.open('https://wa.me/5531972595643?text=Olá! Gostaria de agendar uma teleconsulta.', '_blank');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-[#F5EFE6] to-white">
      {/* Hero Section */}
      <div className="relative py-12 md:py-20 px-4 md:px-6 overflow-hidden bg-gradient-to-br from-white via-[#F5EFE6] to-[#E8DCC4]">
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
            className="text-center space-y-6 md:space-y-8"
          >
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="inline-block"
            >
              <div className="w-24 h-24 md:w-32 md:h-32 lg:w-40 lg:h-40 mx-auto bg-gradient-to-br from-[#D4AF37] to-[#C8A882] rounded-full overflow-hidden shadow-2xl border-4 border-white">
                <img 
                  src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/690ca5886318e973c6e913bb/9af1641b0_drbeleza.png"
                  alt="Dr. Beleza"
                  className="w-full h-full object-cover"
                />
              </div>
            </motion.div>

            <div className="space-y-4">
              <Badge className="bg-white/80 text-[#D4AF37] border-[#D4AF37]/20 px-4 py-2 text-sm md:text-base backdrop-blur-sm">
                Seu Assistente Inteligente
              </Badge>
              
              <h1 className="font-serif text-3xl md:text-5xl lg:text-6xl xl:text-7xl font-bold px-4">
                <span className="bg-gradient-to-r from-[#D4AF37] to-[#C8A882] bg-clip-text text-transparent">
                  Dr. Beleza
                </span>
              </h1>

              <p className="text-xl md:text-2xl lg:text-3xl text-gray-700 font-medium px-4">
                Encontre o Tratamento Ideal Para Você
              </p>

              <p className="text-base md:text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed px-4">
                Com inteligência artificial avançada, o Dr. Beleza te ajuda a encontrar os 
                melhores profissionais e tratamentos personalizados para suas necessidades
              </p>
            </div>
          </motion.div>
        </div>
      </div>

      {/* About Dr. Beleza */}
      <div className="py-12 md:py-24 px-4 md:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-8 md:gap-16 items-center mb-12 md:mb-24">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="space-y-6"
            >
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#F5EFE6] rounded-full border border-[#D4AF37]/20">
                  <Sparkles className="w-4 h-4 text-[#D4AF37]" />
                  <span className="text-sm font-medium text-[#C8A882]">
                    Tecnologia de Ponta
                  </span>
                </div>

                <h2 className="font-serif text-4xl md:text-5xl font-bold">
                  <span className="text-gray-800">Quem é o</span>
                  <br />
                  <span className="bg-gradient-to-r from-[#D4AF37] to-[#C8A882] bg-clip-text text-transparent">
                    Dr. Beleza?
                  </span>
                </h2>
              </div>

              <div className="space-y-4 text-gray-600 leading-relaxed text-lg">
                <p>
                  O <strong className="text-[#C8A882]">Dr. Beleza</strong> é seu assistente virtual 
                  inteligente, desenvolvido com tecnologia de IA avançada para ajudar você a encontrar 
                  o tratamento estético perfeito.
                </p>

                <p>
                  Conectado ao <strong className="text-[#C8A882]">Mapa da Estética</strong>, nossa 
                  plataforma com mais de 500 profissionais verificados em todo Brasil, o Dr. Beleza 
                  analisa suas necessidades, preferências e localização para recomendar os melhores 
                  profissionais e tratamentos.
                </p>

                <p>
                  Com poucos cliques, você terá acesso a informações detalhadas, avaliações reais, 
                  preços transparentes e poderá agendar consultas diretamente com os profissionais.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <div className="grid grid-cols-2 gap-6">
                {features.map((feature, index) => (
                  <Card key={index} className="border-[#E8DCC4] hover:border-[#D4AF37] transition-all duration-300 hover:shadow-xl bg-white">
                    <CardContent className="p-6 space-y-3">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#D4AF37] to-[#C8A882] flex items-center justify-center shadow-lg">
                        <feature.icon className="w-6 h-6 text-white" />
                      </div>
                      <h3 className="font-semibold text-gray-800">{feature.title}</h3>
                      <p className="text-sm text-gray-600">{feature.description}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Search Form - GARANTIR RESPONSIVIDADE TOTAL */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="w-full"
          >
            <Card className="border-[#E8DCC4] shadow-2xl bg-white w-full">
              <CardHeader className="text-center p-4 md:p-8 border-b border-[#E8DCC4]">
                <div className="w-20 h-20 md:w-24 md:h-24 mx-auto mb-4 bg-gradient-to-br from-[#D4AF37] to-[#C8A882] rounded-full overflow-hidden shadow-lg border-4 border-white">
                  <img 
                    src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/690ca5886318e973c6e913bb/9af1641b0_drbeleza.png"
                    alt="Dr. Beleza"
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardTitle className="font-serif text-2xl md:text-3xl lg:text-4xl font-bold px-2">
                  <span className="bg-gradient-to-r from-[#D4AF37] to-[#C8A882] bg-clip-text text-transparent">
                    Encontre Seu Tratamento Ideal
                  </span>
                </CardTitle>
                <p className="text-gray-600 mt-2 text-sm md:text-base px-2">
                  Preencha os campos abaixo e deixe o Dr. Beleza encontrar os melhores profissionais para você
                </p>
              </CardHeader>

              <CardContent className="p-4 md:p-8 w-full">
                <div className="space-y-6 w-full">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 w-full">
                    <div className="space-y-2 w-full">
                      <Label htmlFor="treatment" className="text-gray-700 flex items-center gap-2 text-sm md:text-base">
                        <Search className="w-4 h-4 text-[#D4AF37]" />
                        Qual tratamento deseja?
                      </Label>
                      <Select value={formData.treatment} onValueChange={(value) => handleInputChange("treatment", value)}>
                        <SelectTrigger className="border-[#E8DCC4] focus:border-[#D4AF37] w-full">
                          <SelectValue placeholder="Selecione o tratamento" />
                        </SelectTrigger>
                        <SelectContent className="max-h-[300px]">
                          {treatmentCategories.map((cat) => (
                            <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2 w-full">
                      <Label htmlFor="area" className="text-gray-700 flex items-center gap-2 text-sm md:text-base">
                        <MapPin className="w-4 h-4 text-[#D4AF37]" />
                        Área desejada
                      </Label>
                      <Select value={formData.area} onValueChange={(value) => handleInputChange("area", value)}>
                        <SelectTrigger className="border-[#E8DCC4] focus:border-[#D4AF37] w-full">
                          <SelectValue placeholder="Selecione a área" />
                        </SelectTrigger>
                        <SelectContent>
                          {areas.map((area) => (
                            <SelectItem key={area} value={area}>{area}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2 w-full">
                      <Label htmlFor="budget" className="text-gray-700 flex items-center gap-2 text-sm md:text-base">
                        <DollarSign className="w-4 h-4 text-[#D4AF37]" />
                        Valor de investimento
                      </Label>
                      <Select value={formData.budget} onValueChange={(value) => handleInputChange("budget", value)}>
                        <SelectTrigger className="border-[#E8DCC4] focus:border-[#D4AF37] w-full">
                          <SelectValue placeholder="Selecione o orçamento" />
                        </SelectTrigger>
                        <SelectContent>
                          {budgets.map((budget) => (
                            <SelectItem key={budget} value={budget}>{budget}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2 w-full">
                      <Label htmlFor="timeframe" className="text-gray-700 flex items-center gap-2 text-sm md:text-base">
                        <Calendar className="w-4 h-4 text-[#D4AF37]" />
                        Quando deseja o tratamento?
                      </Label>
                      <Select value={formData.timeframe} onValueChange={(value) => handleInputChange("timeframe", value)}>
                        <SelectTrigger className="border-[#E8DCC4] focus:border-[#D4AF37] w-full">
                          <SelectValue placeholder="Selecione o prazo" />
                        </SelectTrigger>
                        <SelectContent>
                          {timeframes.map((time) => (
                            <SelectItem key={time} value={time}>{time}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2 w-full">
                    <Label htmlFor="location" className="text-gray-700 flex items-center gap-2 text-sm md:text-base">
                      <MapPin className="w-4 h-4 text-[#D4AF37]" />
                      Sua localização (opcional)
                    </Label>
                    <Input
                      id="location"
                      value={formData.location}
                      onChange={(e) => handleInputChange("location", e.target.value)}
                      placeholder="Digite sua cidade ou CEP"
                      className="border-[#E8DCC4] focus:border-[#D4AF37] w-full"
                    />
                  </div>

                  <div className="flex flex-col gap-4 pt-4 w-full">
                    <Button
                      onClick={handleSearch}
                      disabled={isSearching}
                      className="w-full bg-gradient-to-r from-[#D4AF37] to-[#C8A882] hover:from-[#C8A882] hover:to-[#D4AF37] text-white py-5 md:py-6 text-base md:text-lg font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 group"
                    >
                      {isSearching ? (
                        <>
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" />
                          Buscando...
                        </>
                      ) : (
                        <>
                          <Search className="w-5 h-5 mr-2" />
                          Buscar Profissionais
                          <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                        </>
                      )}
                    </Button>

                    <Button
                      onClick={handleTeleconsulta}
                      variant="outline"
                      className="w-full border-2 border-[#D4AF37] text-[#D4AF37] hover:bg-[#F5EFE6] py-5 md:py-6 text-base md:text-lg font-semibold"
                    >
                      <Phone className="w-5 h-5 mr-2" />
                      Agendar Teleconsulta
                    </Button>
                  </div>

                  <div className="flex items-center justify-center gap-2 text-xs md:text-sm text-gray-500 pt-4">
                    <CheckCircle className="w-4 h-4 text-[#D4AF37]" />
                    <span className="text-center">Integrado com o Mapa da Estética - Mais de 500 profissionais verificados</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>

      {/* Mapa da Estética Section */}
      <div className="py-12 md:py-24 px-4 md:px-6 bg-gradient-to-br from-white to-[#F5EFE6]">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-8 md:gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="space-y-6"
            >
              <div className="space-y-4">
                <h2 className="font-serif text-4xl md:text-5xl font-bold">
                  <span className="bg-gradient-to-r from-[#D4AF37] to-[#C8A882] bg-clip-text text-transparent">
                    Mapa da Estética
                  </span>
                  <br />
                  <span className="text-gray-800">Conectando Você aos Melhores</span>
                </h2>
              </div>

              <div className="space-y-4 text-gray-600 leading-relaxed text-lg">
                <p>
                  O <strong className="text-[#C8A882]">Mapa da Estética</strong> é a maior plataforma 
                  de busca e conexão com profissionais de beleza e estética do Brasil.
                </p>

                <p>
                  Com mais de <strong className="text-[#C8A882]">500 profissionais certificados</strong> e 
                  verificados, você encontra especialistas em mais de 12 categorias diferentes, desde 
                  depilação a laser até harmonização facial e cirurgia plástica.
                </p>

                <ul className="space-y-3">
                  {[
                    "Busca por localização e geolocalização",
                    "Perfis completos com fotos e portfólio",
                    "Avaliações e depoimentos reais de clientes",
                    "Preços transparentes e comparação fácil",
                    "Agendamento online direto com o profissional",
                    "Assistente virtual Dr. Beleza com IA"
                  ].map((item, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-[#D4AF37] flex-shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <a href="https://mapa-da-estetica.base44.app" target="_blank" rel="noopener noreferrer">
                <Button 
                  size="lg"
                  className="bg-gradient-to-r from-[#D4AF37] to-[#C8A882] hover:from-[#C8A882] hover:to-[#D4AF37] text-white shadow-xl hover:shadow-2xl transition-all duration-300 px-8 py-6 text-lg font-semibold group"
                >
                  Acessar Mapa da Estética
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </a>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <div className="relative rounded-3xl overflow-hidden shadow-2xl">
                <img
                  src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/690ca5886318e973c6e913bb/0067369f9_mapainicioimg.jpg"
                  alt="Mapa da Estética"
                  className="w-full h-[600px] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                
                {/* Stats Overlay */}
                <div className="absolute bottom-8 left-8 right-8 space-y-4">
                  <div className="grid grid-cols-3 gap-4">
                    {[
                      { label: "Profissionais", value: "500+" },
                      { label: "Cidades", value: "50+" },
                      { label: "Categorias", value: "12+" }
                    ].map((stat, index) => (
                      <div key={index} className="bg-white/90 backdrop-blur-sm rounded-xl p-4 text-center">
                        <div className="text-2xl font-bold bg-gradient-to-r from-[#D4AF37] to-[#C8A882] bg-clip-text text-transparent">
                          {stat.value}
                        </div>
                        <div className="text-xs text-gray-600 mt-1">{stat.label}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
