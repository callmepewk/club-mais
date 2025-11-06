import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Sparkles, Heart, Leaf, Gift, Users, Crown } from "lucide-react";
import { motion } from "framer-motion";

const benefits = [
  {
    icon: Crown,
    title: "Benefícios Exclusivos",
    description: "Acesso a descontos especiais em centenas de estabelecimentos parceiros de beleza e estética.",
    color: "from-[#D4AF37] to-[#C8A882]"
  },
  {
    icon: Heart,
    title: "Autocuidado",
    description: "Cuide de você com os melhores profissionais e produtos selecionados especialmente para você.",
    color: "from-[#C8A882] to-[#E8DCC4]"
  },
  {
    icon: Leaf,
    title: "Sustentabilidade",
    description: "Apoie marcas e profissionais comprometidos com práticas sustentáveis e um planeta mais saudável.",
    color: "from-[#D4AF37] to-[#C8A882]"
  },
  {
    icon: Gift,
    title: "Recompensas",
    description: "Acumule pontos e ganhe prêmios exclusivos a cada compra ou serviço utilizado.",
    color: "from-[#C8A882] to-[#E8DCC4]"
  },
  {
    icon: Users,
    title: "Comunidade",
    description: "Faça parte de uma comunidade apaixonada por beleza, bem-estar e autocuidado.",
    color: "from-[#D4AF37] to-[#C8A882]"
  },
  {
    icon: Sparkles,
    title: "Experiências Únicas",
    description: "Acesso a eventos exclusivos, workshops e lançamentos de produtos em primeira mão.",
    color: "from-[#C8A882] to-[#E8DCC4]"
  }
];

export default function BenefitsSection() {
  return (
    <div className="py-24 px-6 bg-white">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16 space-y-4"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#F5EFE6] rounded-full border border-[#D4AF37]/20">
            <Sparkles className="w-4 h-4 text-[#D4AF37]" />
            <span className="text-sm font-medium text-[#C8A882]">
              Por que se associar?
            </span>
          </div>
          
          <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold">
            <span className="bg-gradient-to-r from-[#D4AF37] to-[#C8A882] bg-clip-text text-transparent">
              Um clube completo
            </span>
            <br />
            <span className="text-gray-800">de benefícios</span>
          </h2>
          
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Descubra todas as vantagens de fazer parte do maior clube de beleza e bem-estar
          </p>
        </motion.div>

        {/* Benefits Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {benefits.map((benefit, index) => (
            <motion.div
              key={benefit.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Card className="h-full border-[#E8DCC4] hover:border-[#D4AF37] transition-all duration-300 hover:shadow-xl group bg-white/80 backdrop-blur-sm">
                <CardContent className="p-8 space-y-4">
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${benefit.color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    <benefit.icon className="w-8 h-8 text-white" />
                  </div>
                  
                  <h3 className="font-serif text-2xl font-bold text-gray-800">
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
  );
}