import React, { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import {
  Sparkles, Bot, ArrowRight, TrendingUp, Users, 
  CheckCircle, Brain, Zap, LineChart, Heart, User, Clock
} from "lucide-react";

const metrics = [
  {
    icon: Users,
    label: "Pacientes Atendidos",
    value: "50k+",
    color: "from-blue-500 to-blue-600"
  },
  {
    icon: TrendingUp,
    label: "Taxa de Sucesso",
    value: "94%",
    color: "from-green-500 to-green-600"
  },
  {
    icon: Clock,
    label: "Tempo de Resposta",
    value: "< 2min",
    color: "from-orange-500 to-orange-600"
  },
  {
    icon: CheckCircle,
    label: "Diagnósticos Precisos",
    value: "99%+",
    color: "from-purple-500 to-purple-600"
  }
];

const features = [
  {
    icon: Brain,
    title: "IA Conversacional Avançada",
    description: "Algoritmos de aprendizado que entendem seu perfil dermatológico único",
    impact: "Personaliza recomendações em tempo real"
  },
  {
    icon: Zap,
    title: "Análise Visual Instantânea",
    description: "Envie uma foto e receba análise profissional em segundos",
    impact: "Reduz tempo de consulta em 80%"
  },
  {
    icon: Heart,
    title: "Monitoramento Contínuo",
    description: "Acompanhamento de tratamentos com histórico detalhado",
    impact: "Melhora adesão ao tratamento em 70%"
  },
  {
    icon: LineChart,
    title: "Métricas de Efetividade",
    description: "Visualize resultados com antes e depois documentados",
    impact: "Aumenta confiança em 3x"
  }
];

export default function DrBelezaHeroImmersive() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="relative overflow-hidden">
      {/* Background com gradiente imersivo */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900 via-indigo-900 to-black opacity-90"></div>
      
      {/* Animated background elements */}
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
        className="absolute top-20 right-20 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl"
      />
      
      <motion.div
        animate={{
          scale: [1.2, 1, 1.2],
          rotate: [90, 0, 90],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "linear"
        }}
        className="absolute bottom-20 left-20 w-80 h-80 bg-indigo-500/20 rounded-full blur-3xl"
      />

      <div className="relative z-10 py-16 md:py-32 px-4 md:px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center space-y-6 md:space-y-8"
          >
            {/* Hero Title */}
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="inline-block"
            >
              <div className="w-24 h-24 md:w-32 md:h-32 mx-auto bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full overflow-hidden shadow-2xl border-4 border-purple-300/30 flex items-center justify-center">
                <Bot className="w-12 md:w-16 h-12 md:h-16 text-white" />
              </div>
            </motion.div>

            <div className="space-y-4 md:space-y-6">
              <Badge className="bg-white/10 text-purple-200 border-purple-400/30 px-4 md:px-6 py-2 text-xs md:text-base backdrop-blur-sm hover:bg-white/20 transition-all inline-flex">
                <Sparkles className="w-3 md:w-4 h-3 md:h-4 mr-2" />
                <span className="hidden sm:inline">Assistente de IA Revolucionário</span>
                <span className="sm:hidden">IA Revolucionária</span>
              </Badge>

              <h1 className="font-serif text-4xl md:text-5xl lg:text-7xl xl:text-8xl font-bold text-white leading-tight">
                <span className="bg-gradient-to-r from-purple-300 via-indigo-300 to-cyan-300 bg-clip-text text-transparent">
                  Dr. Beleza AI
                </span>
              </h1>

              <p className="text-lg md:text-2xl lg:text-3xl text-purple-100 font-light max-w-3xl mx-auto leading-relaxed px-2">
                Inteligência Artificial que Impacta em <span className="font-semibold text-cyan-300">94% das Decisões</span> de Tratamento
              </p>

              <p className="text-sm md:text-base lg:text-lg text-purple-200 max-w-2xl mx-auto leading-relaxed px-2">
                Sistema de IA avançado que combina análise visual inteligente, conversação natural e histórico de resultados para guiar pacientes nas melhores decisões estéticas
              </p>

              <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center pt-4 md:pt-6">
                <a 
                  href="https://dr-da-beleza-ai.base44.app" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex w-full sm:w-auto"
                >
                  <Button 
                    size="lg"
                    className="w-full sm:w-auto bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white shadow-2xl hover:shadow-purple-500/50 transition-all duration-300 px-6 md:px-10 py-5 md:py-7 text-sm md:text-lg font-semibold group"
                  >
                    <Bot className="w-4 md:w-5 h-4 md:h-5 mr-2" />
                    <span className="hidden sm:inline">Acessar Agora</span>
                    <span className="sm:hidden">Acessar</span>
                    <ArrowRight className="w-4 md:w-5 h-4 md:h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </a>
              </div>
            </div>
          </motion.div>

          {/* Metrics Grid */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6 mt-12 md:mt-20 pt-12 md:pt-20 border-t border-purple-500/20"
          >
            {metrics.map((metric, index) => {
              const Icon = metric.icon;
              return (
                <motion.div
                  key={metric.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="bg-white/5 backdrop-blur-sm border border-purple-500/20 rounded-lg md:rounded-2xl p-4 md:p-6 text-center hover:bg-white/10 hover:border-purple-500/40 transition-all duration-300 group"
                >
                  <div className={`w-10 md:w-14 h-10 md:h-14 mx-auto mb-2 md:mb-4 bg-gradient-to-br ${metric.color} rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
                    <Icon className="w-5 md:w-7 h-5 md:h-7 text-white" />
                  </div>
                  <div className="text-xl md:text-3xl font-bold text-cyan-300 mb-1 md:mb-2">
                    {metric.value}
                  </div>
                  <div className="text-xs md:text-sm text-purple-200">
                    {metric.label}
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </div>

      {/* Features Section */}
      <div className="relative z-10 py-16 md:py-24 px-4 md:px-6 bg-gradient-to-b from-transparent via-black/50 to-black">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 md:mb-16 space-y-4">
            <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-white px-2">
              Impacto Comprovado
            </h2>
            <p className="text-base md:text-lg lg:text-xl text-purple-200 max-w-2xl mx-auto px-2">
              Como o Dr. Beleza AI influencia a decisão do paciente
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="bg-white/5 backdrop-blur-sm border border-purple-500/20 rounded-xl md:rounded-2xl p-5 md:p-8 hover:border-purple-500/40 transition-all duration-300 group"
                >
                  <div className="w-12 md:w-16 h-12 md:h-16 bg-gradient-to-br from-cyan-500/30 to-purple-500/30 rounded-lg md:rounded-xl flex items-center justify-center mb-4 md:mb-6 group-hover:scale-110 transition-transform">
                    <Icon className="w-6 md:w-8 h-6 md:h-8 text-cyan-300" />
                  </div>

                  <h3 className="text-lg md:text-xl font-semibold text-white mb-2 md:mb-3">
                    {feature.title}
                  </h3>

                  <p className="text-sm md:text-base text-purple-200 mb-3 md:mb-4">
                    {feature.description}
                  </p>

                  <div className="flex items-start gap-3 p-3 md:p-4 bg-cyan-500/10 rounded-lg">
                    <TrendingUp className="w-4 md:w-5 h-4 md:h-5 text-cyan-400 flex-shrink-0 mt-0.5" />
                    <span className="text-cyan-300 text-xs md:text-sm font-semibold">
                      {feature.impact}
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="relative z-10 py-12 md:py-16 px-4 md:px-6 bg-gradient-to-b from-black to-purple-900/50">
        <div className="max-w-4xl mx-auto text-center space-y-6 md:space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="space-y-4 md:space-y-6"
          >
            <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight px-2">
              Experimente a IA que Muda Decisões
            </h2>

            <p className="text-base md:text-lg lg:text-xl text-purple-200 px-2">
              Comece uma conversa agora e descubra tratamentos personalizados
            </p>

            <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center pt-4 md:pt-6">
              <a 
                href="https://dr-da-beleza-ai.base44.app" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-full sm:w-auto"
              >
                <Button 
                  size="lg"
                  className="w-full sm:w-auto bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 text-white shadow-xl hover:shadow-cyan-500/50 transition-all duration-300 px-6 md:px-10 py-5 md:py-7 text-sm md:text-lg font-semibold group"
                >
                  <Bot className="w-4 md:w-5 h-4 md:h-5 mr-2" />
                  <span className="hidden sm:inline">Iniciar Chat Agora</span>
                  <span className="sm:hidden">Iniciar Chat</span>
                  <ArrowRight className="w-4 md:w-5 h-4 md:h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}