import React from "react";
import { Button } from "@/components/ui/button";
import { Sparkles, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { useTranslation } from "../TranslationProvider";

export default function HeroSection() {
  const { t } = useTranslation();
  
  return (
    <div className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-white">
      {/* Decorative Elements */}
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
          className="absolute -bottom-24 -left-24 w-96 h-96 bg-gradient-to-tr from-[#C8A882]/10 to-transparent rounded-full blur-3xl"
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-16 lg:py-24">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="space-y-8"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full border border-[#D4AF37]/20 shadow-lg"
            >
              <Sparkles className="w-4 h-4 text-[#D4AF37]" />
              <span className="text-sm font-medium text-[#C8A882]">
                {t("hero.badge")}
              </span>
            </motion.div>

            <div className="space-y-6">
              <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl font-bold leading-tight">
                <span className="bg-gradient-to-r from-[#D4AF37] via-[#C8A882] to-[#D4AF37] bg-clip-text text-transparent">
                  {t("hero.title")}
                </span>
                <br />
                <span className="text-gray-800">{t("hero.titleHighlight")}</span>
              </h1>

              <p className="text-lg md:text-xl text-gray-600 leading-relaxed max-w-xl">
                {t("hero.subtitle")}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link to={createPageUrl("Join")}>
                <Button 
                  size="lg"
                  className="bg-gradient-to-r from-[#D4AF37] to-[#C8A882] hover:from-[#C8A882] hover:to-[#D4AF37] text-white shadow-xl hover:shadow-2xl transition-all duration-300 px-8 py-6 text-lg font-medium group"
                >
                  {t("hero.cta")}
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link to={createPageUrl("Benefits")}>
                <Button 
                  size="lg"
                  variant="outline"
                  className="border-2 border-[#D4AF37] text-[#C8A882] hover:bg-[#F5EFE6] px-8 py-6 text-lg font-medium transition-all duration-300"
                >
                  {t("hero.learnMore")}
                </Button>
              </Link>
            </div>

            <div className="flex items-center gap-8 pt-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-[#D4AF37]">500+</div>
                <div className="text-sm text-gray-600">{t("hero.members")}</div>
              </div>
              <div className="w-px h-12 bg-[#E8DCC4]"></div>
              <div className="text-center">
                <div className="text-3xl font-bold text-[#D4AF37]">100+</div>
                <div className="text-sm text-gray-600">{t("hero.partners")}</div>
              </div>
              <div className="w-px h-12 bg-[#E8DCC4]"></div>
              <div className="text-center">
                <div className="text-3xl font-bold text-[#D4AF37]">98%</div>
                <div className="text-sm text-gray-600">{t("hero.satisfaction")}</div>
              </div>
            </div>
          </motion.div>

          {/* Right Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="relative"
          >
            <div className="relative rounded-3xl overflow-hidden shadow-2xl">
              <motion.div
                animate={{ y: [0, -20, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              >
                <img
                  src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/user_68ca933db3f173d5b5ee5174/424de1767_clubeimg.jpeg"
                  alt="Club da Beleza"
                  className="w-full h-auto object-cover"
                />
              </motion.div>
              
              {/* Decorative Border */}
              <div className="absolute inset-0 border-4 border-[#D4AF37]/20 rounded-3xl pointer-events-none"></div>
            </div>

            {/* Floating Badge */}
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -bottom-6 -right-6 bg-white rounded-2xl shadow-xl p-6 border border-[#E8DCC4]"
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-[#D4AF37] to-[#C8A882] rounded-full flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-[#D4AF37]">Club</div>
                  <div className="text-sm text-gray-600">{t("hero.premium")}</div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}