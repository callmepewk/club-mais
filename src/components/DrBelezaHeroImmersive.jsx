import React from "react";
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

      <div className="relative z-10 py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center space-y-8"
          >
            {/* Hero Title */}
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="inline-block"
            >
              <div className="w-32 h-32 mx-auto bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full overflow-hidden shadow-2xl border-4 border-purple-300/30 flex items-center justify-center">
                <Bot className="w-16 h-16 text-white" />
              </div>
            </motion.div>

            <div className="space-y-6">
              <Badge className="bg-white/10 text-purple-200 border-purple-400/30 px-6 py-2 text-base backdrop-blur-sm hover:bg-white/20 transition-all">
                <Sparkles className="w-4 h-4 mr-2" />
                Assistente de IA Revolucionário
              </Badge>

              <h1 className="font-serif text-6xl md:text-7xl lg:text-8xl font-bold text-white leading-tight">
                <span className="bg-gradient-to-r from-purple-300 via-indigo-300 to-cyan-300 bg-clip-text text-transparent">
                  Dr. Beleza AI
                </span>
              </h1>

              <p className="text-2xl md:text-3xl text-purple-100 font-light max-w-3xl mx-auto leading-relaxed">
                O ChatGPT da Saúde e Estética Agora Impacta em <span className="font-semibold text-cyan-300">94% das Decisões</span> de Tratamento
              </p>

              <p className="text-lg text-purple-200 max-w-2xl mx-auto leading-relaxed">
                Sistema de IA avançado que combina análise visual, conversação inteligente e histórico de resultados para orientar pacientes em suas decisões estéticas
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
                <a 
                  href="https://dr-da-beleza-ai.base44.app" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex"
                >
                  <Button 
                    size="lg"
                    className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white shadow-2xl hover:shadow-purple-500/50 transition-all duration-300 px-10 py-7 text-lg font-semibold group"
                  >
                    <Bot className="w-5 h-5 mr-2" />
                    Acessar Agora
                    <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
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
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mt-20 pt-20 border-t border-purple-500/20"
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
                  className="bg-white/5 backdrop-blur-sm border border-purple-500/20 rounded-2xl p-6 text-center hover:bg-white/10 hover:border-purple-500/40 transition-all duration-300 group"
                >
                  <div className={`w-14 h-14 mx-auto mb-4 bg-gradient-to-br ${metric.color} rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                  <div className="text-3xl font-bold text-cyan-300 mb-2">
                    {metric.value}
                  </div>
                  <div className="text-sm text-purple-200">
                    {metric.label}
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </div>

      {/* Features Section */}
      <div className="relative z-10 py-24 px-6 bg-gradient-to-b from-transparent via-black/50 to-black">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 space-y-4">
            <h2 className="font-serif text-4xl md:text-5xl font-bold text-white">
              Impacto Comprovado
            </h2>
            <p className="text-xl text-purple-200 max-w-2xl mx-auto">
              Como o Dr. Beleza AI influencia a decisão do paciente
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="bg-white/5 backdrop-blur-sm border border-purple-500/20 rounded-2xl p-8 hover:border-purple-500/40 transition-all duration-300 group"
                >
                  <div className="w-16 h-16 bg-gradient-to-br from-cyan-500/30 to-purple-500/30 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <Icon className="w-8 h-8 text-cyan-300" />
                  </div>

                  <h3 className="text-xl font-semibold text-white mb-3">
                    {feature.title}
                  </h3>

                  <p className="text-purple-200 mb-4">
                    {feature.description}
                  </p>

                  <div className="flex items-start gap-3 p-4 bg-cyan-500/10 rounded-lg">
                    <TrendingUp className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5" />
                    <span className="text-cyan-300 text-sm font-semibold">
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
      <div className="relative z-10 py-16 px-6 bg-gradient-to-b from-black to-purple-900/50">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="space-y-6"
          >
            <h2 className="font-serif text-4xl md:text-5xl font-bold text-white leading-tight">
              Experimente a IA que Muda Decisões
            </h2>

            <p className="text-xl text-purple-200">
              Comece uma conversa agora e descubra tratamentos personalizados
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
              <a 
                href="https://dr-da-beleza-ai.base44.app" 
                target="_blank" 
                rel="noopener noreferrer"
              >
                <Button 
                  size="lg"
                  className="bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 text-white shadow-xl hover:shadow-cyan-500/50 transition-all duration-300 px-10 py-7 text-lg font-semibold group"
                >
                  <Bot className="w-5 h-5 mr-2" />
                  Iniciar Chat Agora
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