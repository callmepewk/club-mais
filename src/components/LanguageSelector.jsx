import React, { useState } from "react";
import { useTranslation, languages } from "./TranslationProvider";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Globe, Check } from "lucide-react";

export default function LanguageSelector() {
  const { currentLanguage, changeLanguage } = useTranslation();
  const currentLang = languages.find(l => l.code === currentLanguage) || languages[0];

  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-1 px-3 py-2 bg-white rounded-lg border border-[#D4AF37] shadow-sm">
        <span className="text-lg">{languages[0].flag}</span>
        <span className="text-xs font-medium text-gray-700">BR</span>
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="gap-2 bg-white hover:bg-white/90 border-[#D4AF37] shadow-sm h-auto py-2">
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
        </div>
        );
        }