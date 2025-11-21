import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Sparkles, Heart, Leaf, Gift, Users, Crown } from "lucide-react";
import { motion } from "framer-motion";
import { useTranslation } from "../TranslationProvider";

export default function BenefitsSection() {
  const { t } = useTranslation();
  
  const benefits = [
    {
      icon: Crown,
      title: t("benefits.exclusive"),
      description: t("benefits.exclusiveDesc"),
      color: "from-[#D4AF37] to-[#C8A882]"
    },
    {
      icon: Heart,
      title: t("benefits.selfcare"),
      description: t("benefits.selfcareDesc"),
      color: "from-[#C8A882] to-[#E8DCC4]"
    },
    {
      icon: Leaf,
      title: t("benefits.sustainability"),
      description: t("benefits.sustainabilityDesc"),
      color: "from-[#D4AF37] to-[#C8A882]"
    },
    {
      icon: Gift,
      title: t("benefits.rewards"),
      description: t("benefits.rewardsDesc"),
      color: "from-[#C8A882] to-[#E8DCC4]"
    },
    {
      icon: Users,
      title: t("benefits.community"),
      description: t("benefits.communityDesc"),
      color: "from-[#D4AF37] to-[#C8A882]"
    },
    {
      icon: Sparkles,
      title: t("benefits.experiences"),
      description: t("benefits.experiencesDesc"),
      color: "from-[#C8A882] to-[#E8DCC4]"
    }
  ];
  
  return (
    <div id="benefits" className="py-24 px-6 bg-white scroll-mt-20">
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
              {t("benefits.why")}
            </span>
          </div>
          
          <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold">
            <span className="bg-gradient-to-r from-[#D4AF37] to-[#C8A882] bg-clip-text text-transparent">
              {t("benefits.title")}
            </span>
            <br />
            <span className="text-gray-800">{t("benefits.subtitle")}</span>
          </h2>
          
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {t("benefits.description")}
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