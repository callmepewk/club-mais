import React, { useState } from "react";
import { useTranslation, languages } from "../utils/i18n";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Globe, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function LanguageSelector() {
  const { currentLanguage, changeLanguage } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  const currentLang = languages.find(l => l.code === currentLanguage) || languages[0];

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          className="gap-2 bg-white/90 hover:bg-white border-[#E8DCC4] hover:border-[#D4AF37] transition-all"
        >
          <span className="text-xl">{currentLang.flag}</span>
          <span className="hidden md:inline text-sm font-medium text-gray-700">
            {currentLang.code.toUpperCase()}
          </span>
          <Globe className="w-4 h-4 text-gray-600" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        align="end" 
        className="w-56 bg-white border-[#E8DCC4] shadow-2xl"
      >
        <AnimatePresence>
          {languages.map((lang, index) => (
            <motion.div
              key={lang.code}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, delay: index * 0.03 }}
            >
              <DropdownMenuItem
                onClick={() => changeLanguage(lang.code)}
                className={`cursor-pointer py-3 px-4 flex items-center justify-between hover:bg-gradient-to-r hover:from-[#F5EFE6] hover:to-[#E8DCC4] transition-all ${
                  currentLanguage === lang.code ? 'bg-gradient-to-r from-[#F5EFE6] to-[#E8DCC4]' : ''
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{lang.flag}</span>
                  <span className="text-sm font-medium text-gray-700">{lang.name}</span>
                </div>
                {currentLanguage === lang.code && (
                  <Check className="w-4 h-4 text-[#D4AF37]" />
                )}
              </DropdownMenuItem>
            </motion.div>
          ))}
        </AnimatePresence>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}