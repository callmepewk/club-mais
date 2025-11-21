import React from "react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { ArrowRight, Sparkles } from "lucide-react";
import { useTranslation } from "../TranslationProvider";

export default function CallToActionSection() {
  const { t } = useTranslation();
  
  return (
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
              {t("common.joinUs")}
            </span>
          </div>

          <h2 className="font-serif text-4xl md:text-5xl font-bold text-white leading-tight">
            {t("common.ready")}
          </h2>

          <p className="text-xl text-white/90">
            {t("common.joinNow")}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-6">
            <Link to={createPageUrl("Join")}>
              <Button 
                size="lg"
                className="bg-white text-[#D4AF37] hover:bg-white/90 shadow-2xl hover:shadow-3xl transition-all duration-300 px-10 py-7 text-lg font-semibold group"
              >
                {t("common.startNow")}
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
                </Link>

                <Link to={createPageUrl("Join")}>
                <Button 
                size="lg"
                variant="outline"
                className="bg-transparent border-2 border-white text-white hover:bg-white/10 shadow-2xl hover:shadow-3xl transition-all duration-300 px-10 py-7 text-lg font-semibold group"
                >
                {t("common.viewBenefits")}
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
                </Link>
                </div>

                <p className="text-sm text-white/70 pt-4">
                500+ {t("common.members")}
                </p>
        </motion.div>
      </div>
    </div>
  );
}