import React, { useState } from "react";
import { useTranslation, languages } from "./TranslationProvider";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Globe, Check } from "lucide-react";

export default function LanguageSelector() {
  const { currentLanguage, changeLanguage } = useTranslation();
  const currentLang = languages.find(l => l.code === currentLanguage) || languages[0];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="gap-2 bg-white hover:bg-white/90 border-[#D4AF37] shadow-sm">
          <span className="text-xl">{currentLang.flag}</span>
          <span className="text-sm font-medium text-gray-800">{currentLang.code.toUpperCase()}</span>
          <Globe className="w-4 h-4 text-[#D4AF37]" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        {languages.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => changeLanguage(lang.code)}
            className={`cursor-pointer ${currentLanguage === lang.code ? 'bg-[#F5EFE6]' : ''}`}
          >
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{lang.flag}</span>
                <span className="text-sm">{lang.name}</span>
              </div>
              {currentLanguage === lang.code && <Check className="w-4 h-4 text-[#D4AF37]" />}
            </div>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}