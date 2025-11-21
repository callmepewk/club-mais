import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { 
  Heart, Globe, Users, Award, Target, Lightbulb, ArrowRight
} from "lucide-react";
import { useTranslation } from "../TranslationProvider";

export default function AboutSection() {
  const { t } = useTranslation();
  
  const values = [
    {
      icon: Heart,
      title: t("about.valueSelfcare"),
      description: t("about.valueSelfcareDesc")
    },
    {
      icon: Globe,
      title: t("about.valueSustainability"),
      description: t("about.valueSustainabilityDesc")
    },
    {
      icon: Users,
      title: t("about.valueCommunity"),
      description: t("about.valueCommunityDesc")
    },
    {
      icon: Award,
      title: t("about.valueExcellence"),
      description: t("about.valueExcellenceDesc")
    }
  ];

  const achievements = [
    { number: "500+", label: t("about.activeMembers") },
    { number: "100+", label: t("about.certifiedPartners") },
    { number: "50+", label: t("about.citiesServed") },
    { number: "98%", label: t("hero.satisfaction") }
  ];
  
  return (
    <div className="py-24 px-6 bg-white">
      <div className="max-w-7xl mx-auto">
        {/* Story */}
        <div className="grid lg:grid-cols-2 gap-16 items-center mb-24">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="space-y-6"
          >
            <h2 className="font-serif text-4xl md:text-5xl font-bold">
              <span className="bg-gradient-to-r from-[#D4AF37] to-[#C8A882] bg-clip-text text-transparent">
                {t("about.story")}
              </span>
            </h2>

            <div className="space-y-4 text-gray-600 leading-relaxed">
              <p className="text-lg">
                <strong className="text-[#C8A882]">Club da Beleza</strong> {t("about.storyP1")}
              </p>

              <p className="text-lg">
                {t("about.storyP2")}
              </p>

              <p className="text-lg">
                {t("about.storyP3")} <strong className="text-[#C8A882]">{t("nav.map")}</strong>, {t("about.storyP3b")}
              </p>
            </div>

            <Link to={createPageUrl("Join")}>
              <Button 
                size="lg"
                className="bg-gradient-to-r from-[#D4AF37] to-[#C8A882] hover:from-[#C8A882] hover:to-[#D4AF37] text-white shadow-xl hover:shadow-2xl transition-all duration-300 px-8 py-6 text-lg font-medium group"
              >
                {t("about.joinPart")}
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
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
                src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/user_68ca933db3f173d5b5ee5174/424de1767_clubeimg.jpeg"
                alt="Club da Beleza"
                className="w-full h-auto object-cover"
              />
              <div className="absolute inset-0 border-4 border-[#D4AF37]/20 rounded-3xl pointer-events-none"></div>
            </div>
          </motion.div>
        </div>

        {/* Mission & Vision */}
        <div className="grid md:grid-cols-2 gap-8 mb-24">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Card className="h-full border-[#E8DCC4] hover:border-[#D4AF37] transition-all duration-300 hover:shadow-xl bg-gradient-to-br from-white to-[#F5EFE6]">
              <CardContent className="p-8 space-y-4">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#D4AF37] to-[#C8A882] flex items-center justify-center shadow-lg">
                  <Target className="w-8 h-8 text-white" />
                </div>
                
                <h3 className="font-serif text-2xl font-bold text-gray-800">
                  {t("about.mission")}
                </h3>
                
                <p className="text-gray-600 leading-relaxed text-lg">
                  {t("about.missionDesc")}
                </p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card className="h-full border-[#E8DCC4] hover:border-[#D4AF37] transition-all duration-300 hover:shadow-xl bg-gradient-to-br from-white to-[#F5EFE6]">
              <CardContent className="p-8 space-y-4">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#D4AF37] to-[#C8A882] flex items-center justify-center shadow-lg">
                  <Lightbulb className="w-8 h-8 text-white" />
                </div>
                
                <h3 className="font-serif text-2xl font-bold text-gray-800">
                  {t("about.vision")}
                </h3>
                
                <p className="text-gray-600 leading-relaxed text-lg">
                  {t("about.visionDesc")}
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Values */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16 space-y-4"
        >
          <h2 className="font-serif text-4xl md:text-5xl font-bold">
            <span className="bg-gradient-to-r from-[#D4AF37] to-[#C8A882] bg-clip-text text-transparent">{t("about.values")}</span>
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-24">
          {values.map((value, index) => (
            <motion.div
              key={value.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Card className="h-full border-[#E8DCC4] hover:border-[#D4AF37] transition-all duration-300 hover:shadow-xl group text-center bg-white">
                <CardContent className="p-8 space-y-4">
                  <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-[#D4AF37] to-[#C8A882] flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <value.icon className="w-8 h-8 text-white" />
                  </div>
                  
                  <h3 className="font-serif text-xl font-bold text-gray-800">
                    {value.title}
                  </h3>
                  
                  <p className="text-gray-600 leading-relaxed">
                    {value.description}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Achievements */}
        <div className="py-16 px-6 bg-gradient-to-br from-[#D4AF37] via-[#C8A882] to-[#D4AF37] rounded-3xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h2 className="font-serif text-4xl md:text-5xl font-bold text-white">
              {t("about.numbersInspire")}
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-4 gap-8">
            {achievements.map((achievement, index) => (
              <motion.div
                key={achievement.label}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
                  <div className="text-5xl md:text-6xl font-bold text-white mb-2">
                    {achievement.number}
                  </div>
                  <div className="text-white/90 text-lg font-medium">
                    {achievement.label}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}