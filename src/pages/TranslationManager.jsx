import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { Languages, Download, Upload, Sparkles, CheckCircle, AlertCircle } from "lucide-react";
import { languages } from "../utils/i18n";

export default function TranslationManager() {
  const [sourceJson, setSourceJson] = useState('');
  const [targetLanguage, setTargetLanguage] = useState('en');
  const [translatedJson, setTranslatedJson] = useState('');
  const [isTranslating, setIsTranslating] = useState(false);
  const [progress, setProgress] = useState('');

  const translateObject = async (obj, targetLang) => {
    const translated = {};
    
    for (const [key, value] of Object.entries(obj)) {
      if (typeof value === 'string') {
        // Traduzir string
        setProgress(`Traduzindo: ${key}...`);
        
        const result = await base44.integrations.Core.InvokeLLM({
          prompt: `Traduza o seguinte texto de português brasileiro para ${getLanguageName(targetLang)} (código: ${targetLang}).
          
IMPORTANTE:
- Mantenha o mesmo tom e contexto
- Se for um termo técnico de beleza/estética, use o termo correto nesse idioma
- Não adicione explicações, retorne APENAS a tradução
- Mantenha a mesma formatação (ex: se tem emoji, mantenha)

Texto para traduzir:
"${value}"

Retorne APENAS a tradução, sem aspas ou explicações:`,
        });
        
        translated[key] = result.trim();
      } else if (typeof value === 'object' && value !== null) {
        // Traduzir objeto aninhado recursivamente
        translated[key] = await translateObject(value, targetLang);
      } else {
        translated[key] = value;
      }
    }
    
    return translated;
  };

  const getLanguageName = (code) => {
    const langMap = {
      en: 'inglês',
      es: 'espanhol',
      fr: 'francês',
      de: 'alemão',
      it: 'italiano',
      ja: 'japonês',
      zh: 'chinês',
      ru: 'russo',
      ar: 'árabe'
    };
    return langMap[code] || code;
  };

  const handleTranslate = async () => {
    if (!sourceJson) {
      alert('Cole o JSON de origem primeiro (português)');
      return;
    }

    setIsTranslating(true);
    setProgress('Iniciando tradução...');
    
    try {
      const sourceObject = JSON.parse(sourceJson);
      setProgress(`Traduzindo para ${getLanguageName(targetLanguage)}...`);
      
      const translatedObject = await translateObject(sourceObject, targetLanguage);
      
      setTranslatedJson(JSON.stringify(translatedObject, null, 2));
      setProgress('Tradução concluída!');
    } catch (error) {
      console.error('Erro ao traduzir:', error);
      alert('Erro ao traduzir. Verifique o JSON e tente novamente.');
      setProgress('Erro na tradução');
    } finally {
      setIsTranslating(false);
    }
  };

  const handleDownload = () => {
    if (!translatedJson) return;
    
    const blob = new Blob([translatedJson], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `translation_${targetLanguage}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const loadPortugueseBase = async () => {
    try {
      const response = await fetch('/locales/pt/translation.json');
      const data = await response.json();
      setSourceJson(JSON.stringify(data, null, 2));
    } catch (error) {
      alert('Erro ao carregar arquivo base. Certifique-se de que /locales/pt/translation.json existe.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-[#F5EFE6] to-white py-12 px-6">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12 space-y-4"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full border border-[#D4AF37]/20">
            <Languages className="w-5 h-5 text-[#D4AF37]" />
            <span className="text-sm font-medium text-[#C8A882]">Gerenciador de Traduções</span>
          </div>

          <h1 className="font-serif text-4xl md:text-5xl font-bold text-gray-800">
            Tradutor Automático via IA
          </h1>

          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Sistema de tradução automática para gerar arquivos JSON de todos os idiomas
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Painel de Origem */}
          <Card className="border-[#E8DCC4] shadow-xl">
            <CardHeader className="bg-gradient-to-r from-[#D4AF37] to-[#C8A882] text-white">
              <CardTitle className="flex items-center gap-2">
                <Upload className="w-5 h-5" />
                JSON de Origem (Português)
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <Button
                onClick={loadPortugueseBase}
                className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white"
              >
                <Download className="w-4 h-4 mr-2" />
                Carregar /locales/pt/translation.json
              </Button>

              <Textarea
                value={sourceJson}
                onChange={(e) => setSourceJson(e.target.value)}
                placeholder="Cole aqui o JSON em português ou clique no botão acima..."
                className="min-h-[500px] font-mono text-xs"
              />
            </CardContent>
          </Card>

          {/* Painel de Destino */}
          <Card className="border-[#E8DCC4] shadow-xl">
            <CardHeader className="bg-gradient-to-r from-[#C8A882] to-[#E8DCC4] text-white">
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="w-5 h-5" />
                JSON Traduzido
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="flex gap-2 flex-wrap">
                {languages.filter(l => l.code !== 'pt').map((lang) => (
                  <Badge
                    key={lang.code}
                    onClick={() => setTargetLanguage(lang.code)}
                    className={`cursor-pointer transition-all ${
                      targetLanguage === lang.code
                        ? 'bg-gradient-to-r from-[#D4AF37] to-[#C8A882] text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    {lang.flag} {lang.code.toUpperCase()}
                  </Badge>
                ))}
              </div>

              <Button
                onClick={handleTranslate}
                disabled={isTranslating || !sourceJson}
                className="w-full bg-gradient-to-r from-[#D4AF37] to-[#C8A882] text-white"
              >
                {isTranslating ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                    Traduzindo...
                  </>
                ) : (
                  <>
                    <Languages className="w-4 h-4 mr-2" />
                    Traduzir para {targetLanguage.toUpperCase()}
                  </>
                )}
              </Button>

              {progress && (
                <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg">
                  {isTranslating ? (
                    <AlertCircle className="w-4 h-4 text-blue-600 animate-pulse" />
                  ) : (
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  )}
                  <span className="text-sm text-gray-700">{progress}</span>
                </div>
              )}

              <Textarea
                value={translatedJson}
                readOnly
                placeholder="A tradução aparecerá aqui..."
                className="min-h-[400px] font-mono text-xs bg-gray-50"
              />

              {translatedJson && (
                <Button
                  onClick={handleDownload}
                  className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download translation_{targetLanguage}.json
                </Button>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Instruções */}
        <Card className="border-[#E8DCC4] shadow-xl mt-8">
          <CardHeader>
            <CardTitle className="font-serif text-2xl">📋 Como Usar</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-gray-700">
            <ol className="list-decimal list-inside space-y-2">
              <li>Clique em "Carregar /locales/pt/translation.json" para carregar o arquivo base em português</li>
              <li>Selecione o idioma de destino clicando no badge correspondente</li>
              <li>Clique em "Traduzir" e aguarde (pode levar alguns minutos dependendo do tamanho do JSON)</li>
              <li>Após a tradução, clique em "Download" para baixar o arquivo JSON traduzido</li>
              <li>Salve o arquivo baixado em <code className="bg-gray-100 px-2 py-1 rounded">/public/locales/[código]/translation.json</code></li>
              <li>Repita o processo para cada idioma necessário</li>
            </ol>

            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm">
                <strong>⚠️ Nota:</strong> A tradução é feita via IA e pode precisar de revisão manual para termos técnicos ou expressões idiomáticas.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}