
import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import {
  Sparkles, User, AlertCircle, CheckCircle, Save, Wand2, Download, Upload
} from "lucide-react";
import { Textarea } from "@/components/ui/textarea";

export default function AvatarScanner() {
  const [avatarConfig, setAvatarConfig] = useState({
    gender: 'female',
    skinTone: 'clara',
    hairStyle: 'longo',
    hairColor: 'castanho',
    bodyType: 'medio',
    faceShape: 'oval',
    eyeColor: 'castanho',
    age: 'adulto'
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedAvatarUrl, setGeneratedAvatarUrl] = useState(null);
  const [showDrBelezaDialog, setShowDrBelezaDialog] = useState(false);
  const [recommendedTreatments, setRecommendedTreatments] = useState([]);

  const [showAvatarChat, setShowAvatarChat] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState("");
  const [isGeneratingVariation, setIsGeneratingVariation] = useState(false);

  const [uploadedPhoto, setUploadedPhoto] = useState(null);
  const [isAnalyzingPhoto, setIsAnalyzingPhoto] = useState(false);

  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { data: user, isLoading: loadingUser } = useQuery({
    queryKey: ['current-user'],
    queryFn: () => base44.auth.me(),
  });

  const { data: existingAvatar } = useQuery({
    queryKey: ['user-avatar', user?.email],
    queryFn: async () => {
      if (!user?.email) return null;
      const avatars = await base44.entities.AvatarData.filter({ user_email: user.email });
      return avatars.length > 0 ? avatars[0] : null;
    },
    enabled: !!user?.email,
  });

  const saveAvatarMutation = useMutation({
    mutationFn: async (avatarData) => {
      if (existingAvatar) {
        return base44.entities.AvatarData.update(existingAvatar.id, avatarData);
      }
      return base44.entities.AvatarData.create(avatarData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-avatar'] });
    },
  });

  const handleConfigChange = (field, value) => {
    setAvatarConfig(prev => ({ ...prev, [field]: value }));
  };

  const generatePrompt = () => {
    const genderText = avatarConfig.gender === 'female' ? 'mulher' : 'homem';
    const skinTones = {
      'muito-clara': 'pele muito clara',
      'clara': 'pele clara',
      'morena': 'pele morena',
      'morena-escura': 'pele morena escura',
      'negra': 'pele negra'
    };
    const hairStyles = {
      'curto': 'cabelo curto',
      'medio': 'cabelo médio',
      'longo': 'cabelo longo',
      'coque': 'cabelo preso em coque',
      'careca': 'sem cabelo'
    };
    const hairColors = {
      'loiro': 'cabelo loiro',
      'castanho': 'cabelo castanho',
      'preto': 'cabelo preto',
      'ruivo': 'cabelo ruivo',
      'branco': 'cabelo grisalho'
    };
    const bodyTypes = {
      'magro': 'corpo magro',
      'medio': 'corpo atlético',
      'atletico': 'corpo musculoso',
      'plus': 'corpo plus size'
    };
    const faceShapes = {
      'oval': 'rosto oval',
      'redondo': 'rosto redondo',
      'quadrado': 'rosto quadrado',
      'triangular': 'rosto triangular',
      'alongado': 'rosto alongado'
    };
    const eyeColors = {
      'castanho': 'olhos castanhos',
      'azul': 'olhos azuis',
      'verde': 'olhos verdes',
      'preto': 'olhos pretos'
    };
    const ages = {
      'jovem': '25 anos',
      'adulto': '35 anos',
      'maduro': '50 anos'
    };

    return `Retrato profissional de ${genderText}, ${skinTones[avatarConfig.skinTone]}, ${hairStyles[avatarConfig.hairStyle]}, ${hairColors[avatarConfig.hairColor]}, ${bodyTypes[avatarConfig.bodyType]}, ${faceShapes[avatarConfig.faceShape]}, ${eyeColors[avatarConfig.eyeColor]}, aparentando ${ages[avatarConfig.age]}, foto de estúdio, iluminação profissional, fundo neutro, qualidade fotográfica, realista, detalhado`;
  };

  const handleGenerateAvatar = async () => {
    setIsGenerating(true);
    try {
      const prompt = generatePrompt();
      const result = await base44.integrations.Core.GenerateImage({ prompt });
      setGeneratedAvatarUrl(result.url);
      setChatMessages([]); // Clear chat messages when a new avatar is generated
      setShowAvatarChat(false); // Close chat when a new avatar is generated
    } catch (error) {
      console.error('Erro ao gerar avatar:', error);
      alert('Erro ao gerar avatar. Tente novamente.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSaveAvatar = async () => {
    if (!generatedAvatarUrl || !user) {
      alert('Gere um avatar primeiro antes de salvar');
      return;
    }

    try {
      const avatarData = {
        user_email: user.email,
        polygons_data: { config: avatarConfig },
        avatar_thumbnail: generatedAvatarUrl,
        meta_width: 1024,
        meta_height: 1024,
        capture_timestamp: new Date().toISOString()
      };

      await saveAvatarMutation.mutateAsync(avatarData);
      alert('Avatar salvo com sucesso!');

      // Get treatment recommendations
      const treatments = getTreatmentRecommendations();
      if (treatments.length > 0) {
        setRecommendedTreatments(treatments);
        setShowDrBelezaDialog(true);
      }
    } catch (error) {
      console.error('Erro ao salvar avatar:', error);
      alert('Erro ao salvar avatar: ' + error.message);
    }
  };

  const getTreatmentRecommendations = () => {
    const treatments = new Set();

    if (avatarConfig.faceShape !== 'oval') {
      treatments.add('Harmonização Facial (HOF)');
      treatments.add('Bioestimuladores de Colágeno');
    }

    if (avatarConfig.skinTone === 'muito-clara' || avatarConfig.skinTone === 'clara') {
      treatments.add('Proteção Solar Profissional');
      treatments.add('Tratamento de Manchas');
    }

    if (avatarConfig.bodyType === 'plus' || avatarConfig.bodyType === 'magro') {
      treatments.add('Criolipólise');
      treatments.add('Radiofrequência Corporal');
      treatments.add('Tratamento de Flacidez');
    }

    if (avatarConfig.age === 'maduro') {
      treatments.add('Tratamento Anti-idade');
      treatments.add('Preenchimento Facial');
      treatments.add('Toxina Botulínica (Botox)');
    }

    return Array.from(treatments);
  };

  const handleSearchTreatments = () => {
    if (!recommendedTreatments.length) return;

    navigate(createPageUrl("DrBeleza"), {
      state: {
        treatment: recommendedTreatments[0],
        autoSearch: true
      }
    });
    setShowDrBelezaDialog(false);
  };

  const handlePhotoUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setIsAnalyzingPhoto(true);
    setGeneratedAvatarUrl(null); // Clear previous avatar
    setChatMessages([]); // Clear chat
    setShowAvatarChat(false); // Close chat

    try {
      // Upload file first
      const uploadResult = await base44.integrations.Core.UploadFile({ file });
      setUploadedPhoto(uploadResult.file_url);

      // Analyze photo with AI to extract characteristics
      const analysisPrompt = `Analyze this person's photo and describe their characteristics in detail for avatar creation. Include: gender (male/female), skin tone (muito-clara/clara/morena/morena-escura/negra), hair style (curto/medio/longo/coque/careca), hair color (loiro/castanho/preto/ruivo/branco), body type (magro/medio/atletico/plus), face shape (oval/redondo/quadrado/triangular/alongado), eye color (castanho/azul/verde/preto), approximate age range (jovem/adulto/maduro). Return ONLY a JSON object with these exact keys: gender, skinTone, hairStyle, hairColor, bodyType, faceShape, eyeColor, age`;

      const analysis = await base44.integrations.Core.InvokeLLM({
        prompt: analysisPrompt,
        file_urls: [uploadResult.file_url], // file_urls expects an array
        response_json_schema: {
          type: "object",
          properties: {
            gender: { type: "string" },
            skinTone: { type: "string" },
            hairStyle: { type: "string" },
            hairColor: { type: "string" },
            bodyType: { type: "string" },
            faceShape: { type: "string" },
            eyeColor: { type: "string" },
            age: { type: "string" }
          },
          required: ["gender", "skinTone", "hairStyle", "hairColor", "bodyType", "faceShape", "eyeColor", "age"]
        }
      });

      // Update config with analyzed data, providing fallbacks for robustness
      setAvatarConfig({
        gender: analysis.gender || 'female',
        skinTone: analysis.skinTone || 'clara',
        hairStyle: analysis.hairStyle || 'longo',
        hairColor: analysis.hairColor || 'castanho',
        bodyType: analysis.bodyType || 'medio',
        faceShape: analysis.faceShape || 'oval',
        eyeColor: analysis.eyeColor || 'castanho',
        age: analysis.age || 'adulto'
      });

      // Generate avatar based on analysis
      setIsGenerating(true);
      const prompt = generatePrompt(); // Use the newly updated avatarConfig
      const result = await base44.integrations.Core.GenerateImage({ prompt });
      setGeneratedAvatarUrl(result.url);

      alert('Foto analisada e avatar gerado com sucesso!');
    } catch (error) {
      console.error('Erro ao processar foto:', error);
      alert('Erro ao processar foto. Tente novamente ou use o formulário manual.');
    } finally {
      setIsAnalyzingPhoto(false);
      setIsGenerating(false);
    }
  };

  const handleAvatarChatMessage = async () => {
    if (!chatInput.trim() || !generatedAvatarUrl) return;

    const userMessage = chatInput;
    setChatMessages(prev => [...prev, { type: "user", text: userMessage }]);
    setChatInput("");

    // Check if it's about procedures or avatar changes
    const msgLower = userMessage.toLowerCase();
    const isProcedureQuestion =
      msgLower.includes("procedimento") ||
      msgLower.includes("tratamento") ||
      msgLower.includes("cirurgia") ||
      msgLower.includes("como fazer") ||
      msgLower.includes("quais são") ||
      msgLower.includes("simetria") ||
      msgLower.includes("simetrico") ||
      msgLower.includes("nariz") ||
      msgLower.includes("boca") ||
      msgLower.includes("labio") ||
      msgLower.includes("olhos") ||
      msgLower.includes("olheira") ||
      msgLower.includes("rosto") ||
      msgLower.includes("pele") ||
      msgLower.includes("mancha") ||
      msgLower.includes("acne") ||
      msgLower.includes("rejuvenescer") ||
      msgLower.includes("rugas") ||
      msgLower.includes("idade");

    if (isProcedureQuestion) {
      // Answer with procedure recommendations
      setTimeout(() => {
        let response = "";

        if (msgLower.includes("simetria") || msgLower.includes("simetrico")) {
          response = "Para melhorar a simetria facial como no seu avatar, os procedimentos mais indicados são:\n\n• **Harmonização Facial (HOF)** - Procedimento mais completo para simetria\n• **Preenchimento com Ácido Hialurônico** - Para corrigir assimetrias específicas\n• **Toxina Botulínica (Botox)** - Para equilibrar músculos faciais\n• **Fios de Sustentação** - Para lifting e simetria\n\n📂 **Categoria:** Harmonização Facial\n📍 **Onde encontrar:** Busque por 'Harmonização Facial' no Mapa da Estética";
        } else if (msgLower.includes("nariz")) {
          response = "Para modificar o nariz:\n\n**Sem cirurgia:**\n• **Rinomodelação** - Preenchimento nasal\n• **Harmonização Nasal** - Correção de imperfeições\n• **Fios de Sustentação** - Para levantar ponta\n\n**Com cirurgia:**\n• **Rinoplastia** - Mudança estrutural completa\n\n📂 **Categoria:** Harmonização Facial / Cirurgia Plástica\n📍 **Onde encontrar:** Busque no Mapa da Estética";
        } else if (msgLower.includes("boca") || msgLower.includes("labio")) {
          response = "Para modificar a boca/lábios:\n\n• **Preenchimento Labial** - Aumentar volume\n• **Harmonização Labial** - Simetria e contorno\n• **Micropigmentação Labial** - Cor e definição\n• **Toxina Botulínica** - Para sorriso gengival\n\n📂 **Categoria:** Harmonização Facial\n📍 **Onde encontrar:** Busque no Mapa da Estética";
        } else if (msgLower.includes("olhos") || msgLower.includes("olheira")) {
          response = "Para região dos olhos:\n\n• **Preenchimento de Olheiras** - Com ácido hialurônico\n• **Toxina Botulínica** - Pés de galinha\n• **Blefaroplastia** - Cirurgia de pálpebras\n• **Peeling** - Rejuvenescimento\n\n📂 **Categoria:** Harmonização Facial / Dermatologia\n📍 **Onde encontrar:** Busque no Mapa da Estética";
        } else if (msgLower.includes("pele") || msgLower.includes("mancha") || msgLower.includes("acne")) {
          response = "Para melhorar a pele:\n\n• **Peeling Químico** - Renovação celular\n• **Laser** - Manchas e cicatrizes\n• **Microagulhamento** - Rejuvenescimento\n• **Limpeza de Pele** - Tratamento de acne\n• **Skinbooster** - Hidratação profunda\n\n📂 **Categoria:** Dermatologia / Estética Facial\n📍 **Onde encontrar:** Busque no Mapa da Estética";
        } else if (msgLower.includes("rejuvenescer") || msgLower.includes("rugas") || msgLower.includes("idade")) {
          response = "Para rejuvenescimento:\n\n• **Toxina Botulínica (Botox)** - Rugas dinâmicas\n• **Preenchimento Facial** - Volume e contorno\n• **Bioestimuladores de Colágeno** - Firmeza\n• **Skinbooster** - Hidratação\n• **Laser CO2** - Rejuvenescimento profundo\n\n📂 **Categoria:** Estética Facial\n📍 **Onde encontrar:** Busque no Mapa da Estética";
        } else {
          response = "Para alcançar resultados semelhantes ao seu avatar, recomendo:\n\n• **Harmonização Facial** - Tratamento completo para simetria e proporções\n• **Preenchimento Facial** - Correções específicas\n• **Toxina Botulínica** - Suavização e equilíbrio\n\n💡 **Dica:** Descreva exatamente o que você gostaria de mudar (nariz, boca, rosto, pele, etc) para recomendações mais específicas!\n\n📍 Busque profissionais especializados no Mapa da Estética";
        }

        setChatMessages(prev => [...prev, { type: "bot", text: response }]);
      }, 1000);
    } else {
      // Generate avatar variation
      setIsGeneratingVariation(true);
      try {
        const variationPrompt = `${generatePrompt()}, com as seguintes modificações: ${userMessage}. Mantenha o mesmo estilo, pose e iluminação do original, apenas aplicando as mudanças solicitadas`;

        const result = await base44.integrations.Core.GenerateImage({ prompt: variationPrompt });

        setGeneratedAvatarUrl(result.url);
        setChatMessages(prev => [...prev, {
          type: "bot",
          text: `Pronto! Apliquei as alterações que você pediu. O que acha do resultado?`,
          imageUrl: result.url
        }]);
      } catch (error) {
        console.error('Erro ao gerar variação:', error);
        setChatMessages(prev => [...prev, {
          type: "bot",
          text: "Desculpe, ocorreu um erro ao aplicar as alterações. Tente novamente."
        }]);
      } finally {
        setIsGeneratingVariation(false);
      }
    }
  };

  if (loadingUser) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white via-[#F5EFE6] to-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-12 h-12 border-4 border-[#D4AF37] border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white via-[#F5EFE6] to-white flex items-center justify-center p-6">
        <Card className="max-w-md border-[#E8DCC4] shadow-xl">
          <CardContent className="p-8 text-center space-y-4">
            <AlertCircle className="w-16 h-16 text-amber-600 mx-auto" />
            <h2 className="font-serif text-2xl font-bold text-gray-800">
              Acesso Restrito
            </h2>
            <p className="text-gray-600">
              Você precisa estar autenticado para criar seu avatar.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-[#F5EFE6] to-white">
      {/* Hero */}
      <div className="relative py-12 md:py-20 px-4 md:px-6 overflow-hidden bg-gradient-to-br from-white via-[#F5EFE6] to-[#E8DCC4]">
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0] }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute -top-24 -right-24 w-96 h-96 bg-gradient-to-br from-[#D4AF37]/10 to-transparent rounded-full blur-3xl"
          />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto text-center space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Badge className="bg-white/80 text-[#D4AF37] border-[#D4AF37]/20 px-4 py-2 text-base backdrop-blur-sm mb-4">
              <User className="w-4 h-4 mr-2" />
              Gerador de Avatar IA
            </Badge>

            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold">
              <span className="bg-gradient-to-r from-[#D4AF37] to-[#C8A882] bg-clip-text text-transparent">
                Crie Seu Avatar
              </span>
            </h1>

            <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
              Preencha suas características e nossa IA vai gerar um avatar personalizado para você
            </p>
          </motion.div>
        </div>
      </div>

      {/* Main Content */}
      <div className="py-12 px-4 md:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Left: Form */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <Card className="border-[#E8DCC4] shadow-2xl bg-white mb-6">
                <CardHeader className="bg-gradient-to-r from-[#F5EFE6] to-[#E8DCC4] border-b border-[#E8DCC4]">
                  <CardTitle className="font-serif text-2xl text-gray-800 flex items-center gap-2">
                    <Upload className="w-6 h-6 text-[#D4AF37]" />
                    Upload de Foto (Rápido)
                  </CardTitle>
                </CardHeader>

                <CardContent className="p-6 space-y-4">
                  <p className="text-sm text-gray-600">
                    Envie uma foto sua e nossa IA vai analisar e criar automaticamente seu avatar personalizado!
                  </p>

                  <div className="border-2 border-dashed border-[#E8DCC4] rounded-xl p-8 text-center hover:border-[#D4AF37] transition-colors">
                    <input
                      type="file"
                      id="photo-upload"
                      accept="image/*"
                      onChange={handlePhotoUpload}
                      disabled={isAnalyzingPhoto || isGenerating}
                      className="hidden"
                    />
                    <label
                      htmlFor="photo-upload"
                      className="cursor-pointer flex flex-col items-center gap-3"
                    >
                      <div className="w-16 h-16 bg-gradient-to-br from-[#D4AF37] to-[#C8A882] rounded-full flex items-center justify-center">
                        <Upload className="w-8 h-8 text-white" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-800">
                          {isAnalyzingPhoto || isGenerating ? 'Processando...' : 'Clique para fazer upload'}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">PNG, JPG até 10MB</p>
                      </div>
                    </label>
                  </div>

                  {(isAnalyzingPhoto || isGenerating) && (
                    <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#D4AF37]" />
                      <span>
                        {isAnalyzingPhoto ? 'Analisando foto...' : 'Gerando avatar...'}
                      </span>
                    </div>
                  )}

                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-[#E8DCC4]"></div>
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-white px-2 text-gray-500">Ou preencha manualmente</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-[#E8DCC4] shadow-2xl bg-white">
                <CardHeader className="bg-gradient-to-r from-[#F5EFE6] to-[#E8DCC4] border-b border-[#E8DCC4]">
                  <CardTitle className="font-serif text-2xl text-gray-800 flex items-center gap-2">
                    <Sparkles className="w-6 h-6 text-[#D4AF37]" />
                    Configure Seu Avatar Manualmente
                  </CardTitle>
                </CardHeader>

                <CardContent className="p-6 space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Gênero</Label>
                      <Select value={avatarConfig.gender} onValueChange={(v) => handleConfigChange('gender', v)} disabled={isAnalyzingPhoto}>
                        <SelectTrigger className="border-[#E8DCC4]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="female">Feminino</SelectItem>
                          <SelectItem value="male">Masculino</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Tom de Pele</Label>
                      <Select value={avatarConfig.skinTone} onValueChange={(v) => handleConfigChange('skinTone', v)} disabled={isAnalyzingPhoto}>
                        <SelectTrigger className="border-[#E8DCC4]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="muito-clara">Muito Clara</SelectItem>
                          <SelectItem value="clara">Clara</SelectItem>
                          <SelectItem value="morena">Morena</SelectItem>
                          <SelectItem value="morena-escura">Morena Escura</SelectItem>
                          <SelectItem value="negra">Negra</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Estilo de Cabelo</Label>
                      <Select value={avatarConfig.hairStyle} onValueChange={(v) => handleConfigChange('hairStyle', v)} disabled={isAnalyzingPhoto}>
                        <SelectTrigger className="border-[#E8DCC4]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="curto">Curto</SelectItem>
                          <SelectItem value="medio">Médio</SelectItem>
                          <SelectItem value="longo">Longo</SelectItem>
                          <SelectItem value="coque">Coque</SelectItem>
                          <SelectItem value="careca">Sem Cabelo</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Cor do Cabelo</Label>
                      <Select value={avatarConfig.hairColor} onValueChange={(v) => handleConfigChange('hairColor', v)} disabled={isAnalyzingPhoto}>
                        <SelectTrigger className="border-[#E8DCC4]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="loiro">Loiro</SelectItem>
                          <SelectItem value="castanho">Castanho</SelectItem>
                          <SelectItem value="preto">Preto</SelectItem>
                          <SelectItem value="ruivo">Ruivo</SelectItem>
                          <SelectItem value="branco">Grisalho/Branco</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Tipo de Corpo</Label>
                      <Select value={avatarConfig.bodyType} onValueChange={(v) => handleConfigChange('bodyType', v)} disabled={isAnalyzingPhoto}>
                        <SelectTrigger className="border-[#E8DCC4]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="magro">Magro</SelectItem>
                          <SelectItem value="medio">Médio</SelectItem>
                          <SelectItem value="atletico">Atlético</SelectItem>
                          <SelectItem value="plus">Plus Size</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Formato do Rosto</Label>
                      <Select value={avatarConfig.faceShape} onValueChange={(v) => handleConfigChange('faceShape', v)} disabled={isAnalyzingPhoto}>
                        <SelectTrigger className="border-[#E8DCC4]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="oval">Oval</SelectItem>
                          <SelectItem value="redondo">Redondo</SelectItem>
                          <SelectItem value="quadrado">Quadrado</SelectItem>
                          <SelectItem value="triangular">Triangular</SelectItem>
                          <SelectItem value="alongado">Alongado</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Cor dos Olhos</Label>
                      <Select value={avatarConfig.eyeColor} onValueChange={(v) => handleConfigChange('eyeColor', v)} disabled={isAnalyzingPhoto}>
                        <SelectTrigger className="border-[#E8DCC4]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="castanho">Castanho</SelectItem>
                          <SelectItem value="azul">Azul</SelectItem>
                          <SelectItem value="verde">Verde</SelectItem>
                          <SelectItem value="preto">Preto</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Faixa Etária</Label>
                      <Select value={avatarConfig.age} onValueChange={(v) => handleConfigChange('age', v)} disabled={isAnalyzingPhoto}>
                        <SelectTrigger className="border-[#E8DCC4]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="jovem">Jovem (20-30)</SelectItem>
                          <SelectItem value="adulto">Adulto (30-45)</SelectItem>
                          <SelectItem value="maduro">Maduro (45+)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <Button
                    onClick={handleGenerateAvatar}
                    disabled={isGenerating || isAnalyzingPhoto}
                    className="w-full bg-gradient-to-r from-[#D4AF37] to-[#C8A882] text-white py-6 text-lg"
                  >
                    {isGenerating ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" />
                        Gerando Avatar...
                      </>
                    ) : (
                      <>
                        <Wand2 className="w-5 h-5 mr-2" />
                        Gerar Avatar com IA
                      </>
                    )}
                  </Button>

                  {generatedAvatarUrl && (
                    <Button
                      onClick={handleSaveAvatar}
                      className="w-full bg-green-600 hover:bg-green-700 text-white py-6 text-lg"
                    >
                      <Save className="w-5 h-5 mr-2" />
                      Salvar Avatar
                    </Button>
                  )}
                </CardContent>
              </Card>
            </motion.div>

            {/* Right: Preview */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="space-y-6"
            >
              <Card className="border-[#E8DCC4] shadow-2xl bg-white">
                <CardHeader className="bg-gradient-to-r from-[#F5EFE6] to-[#E8DCC4] border-b border-[#E8DCC4]">
                  <CardTitle className="font-serif text-2xl text-gray-800 flex items-center gap-2">
                    <User className="w-6 h-6 text-[#D4AF37]" />
                    Seu Avatar Gerado
                  </CardTitle>
                </CardHeader>

                <CardContent className="p-6 space-y-6">
                  <div className="relative w-full aspect-square bg-gradient-to-br from-[#87CEEB] to-[#B0E0E6] rounded-xl overflow-hidden shadow-inner flex items-center justify-center">
                    {generatedAvatarUrl ? (
                      <img
                        src={generatedAvatarUrl}
                        alt="Avatar Gerado"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="text-center text-gray-500 p-6">
                        <User className="w-24 h-24 mx-auto mb-4 opacity-30" />
                        <p className="text-lg">Configure e gere seu avatar</p>
                        <p className="text-sm mt-2">Preencha as informações ao lado e clique em "Gerar Avatar"</p>
                      </div>
                    )}
                  </div>

                  {generatedAvatarUrl && !showAvatarChat && (
                    <Button
                      onClick={() => {
                        setShowAvatarChat(true);
                        setChatMessages([{
                          type: "bot",
                          text: "Olá! 👋\n\nComo posso te ajudar?\n\n🎨 Modificar o avatar\n💉 Perguntas sobre procedimentos estéticos\n\nO que você prefere?"
                        }]);
                      }}
                      variant="outline"
                      className="w-full border-[#D4AF37] text-[#D4AF37]"
                    >
                      <Sparkles className="w-4 h-4 mr-2" />
                      Conversar com Dr. Beleza
                    </Button>
                  )}

                  {showAvatarChat && generatedAvatarUrl && (
                    <Card className="border-[#E8DCC4] bg-[#F5EFE6]">
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-lg flex items-center gap-2">
                            <img
                              src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/690ca5886318e973c6e913bb/9af1641b0_drbeleza.png"
                              alt="Dr. Beleza"
                              className="w-8 h-8 rounded-full"
                            />
                            Dr. Beleza
                          </CardTitle>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setShowAvatarChat(false);
                              setChatMessages([]);
                            }}
                          >
                            ✕
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="h-64 overflow-y-auto space-y-3 bg-white rounded-lg p-3">
                          {chatMessages.map((msg, idx) => (
                            <div key={idx} className={`flex ${msg.type === "user" ? "justify-end" : "justify-start"}`}>
                              <div className={`max-w-[85%] p-3 rounded-lg ${
                                msg.type === "user"
                                  ? "bg-[#D4AF37] text-white"
                                  : "bg-gray-100 text-gray-800"
                              }`}>
                                <p className="text-sm whitespace-pre-line">{msg.text}</p>
                              </div>
                            </div>
                          ))}
                          {isGeneratingVariation && (
                            <div className="flex justify-start">
                              <div className="max-w-[80%] p-2 rounded-lg bg-gray-100 text-gray-800 flex items-center">
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600 mr-2" />
                                <span className="text-sm">Gerando...</span>
                              </div>
                            </div>
                          )}
                        </div>

                        {chatMessages.length === 1 && (
                          <div className="grid grid-cols-2 gap-2">
                            <Button
                              onClick={() => {
                                setChatMessages(prev => [...prev,
                                  { type: "user", text: "Quero modificar meu avatar" },
                                  { type: "bot", text: "Perfeito! Descreva as alterações que você gostaria de fazer no seu avatar. Por exemplo:\n\n• 'Deixe o cabelo mais loiro'\n• 'Mude a cor dos olhos para azul'\n• 'Aumente o sorriso'\n\nQual mudança você quer fazer?" }
                                ]);
                              }}
                              variant="outline"
                              size="sm"
                              className="text-xs border-[#E8DCC4] hover:bg-[#F5EFE6]"
                            >
                              🎨 Modificar Avatar
                            </Button>
                            <Button
                              onClick={() => {
                                setChatMessages(prev => [...prev,
                                  { type: "user", text: "Tenho dúvidas sobre procedimentos" },
                                  { type: "bot", text: "Ótimo! Estou aqui para te ajudar! 💫\n\nPode me perguntar sobre qualquer procedimento estético:\n\n• Harmonização facial\n• Preenchimentos\n• Tratamentos de pele\n• Cirurgias\n• E muito mais!\n\nO que você gostaria de saber?" }
                                ]);
                              }}
                              variant="outline"
                              size="sm"
                              className="text-xs border-[#E8DCC4] hover:bg-[#F5EFE6]"
                            >
                              💉 Sobre Procedimentos
                            </Button>
                          </div>
                        )}

                        <div className="flex gap-2">
                          <Textarea
                            value={chatInput}
                            onChange={(e) => setChatInput(e.target.value)}
                            onKeyPress={(e) => {
                              if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                handleAvatarChatMessage();
                              }
                            }}
                            placeholder="Digite sua mensagem..."
                            className="min-h-[60px] border-[#E8DCC4]"
                            disabled={isGeneratingVariation}
                          />
                          <Button
                            onClick={handleAvatarChatMessage}
                            disabled={!chatInput.trim() || isGeneratingVariation}
                            className="bg-[#D4AF37] text-white"
                          >
                            {isGeneratingVariation ? (
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                            ) : (
                              <Wand2 className="w-4 h-4" />
                            )}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {generatedAvatarUrl && (
                    <a
                      href={generatedAvatarUrl}
                      download="meu-avatar.png"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Button variant="outline" className="w-full border-[#D4AF37] text-[#D4AF37]">
                        <Download className="w-4 h-4 mr-2" />
                        Baixar Imagem
                      </Button>
                    </a>
                  )}
                </CardContent>
              </Card>

              {existingAvatar && (
                <Card className="border-[#E8DCC4] shadow-xl">
                  <CardHeader>
                    <CardTitle className="font-serif text-xl flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      Avatar Salvo Anteriormente
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {existingAvatar.avatar_thumbnail && (
                      <div className="relative w-full aspect-square bg-gray-100 rounded-xl overflow-hidden">
                        <img
                          src={existingAvatar.avatar_thumbnail}
                          alt="Avatar Salvo"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <p className="text-sm text-gray-600">
                      Salvo em: {new Date(existingAvatar.capture_timestamp).toLocaleString('pt-BR')}
                    </p>
                  </CardContent>
                </Card>
              )}
            </motion.div>
          </div>
        </div>
      </div>

      {/* Dr. Beleza Dialog */}
      <AnimatePresence>
        {showDrBelezaDialog && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowDrBelezaDialog(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-2xl"
            >
              <Card className="border-[#E8DCC4] shadow-2xl">
                <CardHeader className="bg-gradient-to-r from-[#D4AF37] to-[#C8A882] text-white">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-white rounded-full overflow-hidden flex-shrink-0">
                      <img
                        src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/690ca5886318e973c6e913bb/9af1641b0_drbeleza.png"
                        alt="Dr. Beleza"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <CardTitle className="text-2xl font-serif">Dr. Beleza</CardTitle>
                      <p className="text-white/90">Recomendações Personalizadas</p>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="p-6 space-y-6">
                  <div className="space-y-4">
                    <p className="text-lg text-gray-800">
                      Com base nas características do seu avatar, identifiquei alguns tratamentos que podem te interessar:
                    </p>

                    <div className="bg-[#F5EFE6] rounded-lg p-4">
                      <p className="font-semibold text-gray-800 mb-2">Tratamentos Recomendados:</p>
                      <ul className="space-y-2">
                        {recommendedTreatments.map((treatment, index) => (
                          <li key={index} className="flex items-center gap-2 text-gray-700">
                            <CheckCircle className="w-4 h-4 text-[#D4AF37]" />
                            {treatment}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <Button
                      onClick={() => setShowDrBelezaDialog(false)}
                      variant="outline"
                      className="flex-1"
                    >
                      Fechar
                    </Button>
                    <Button
                      onClick={handleSearchTreatments}
                      className="flex-1 bg-gradient-to-r from-[#D4AF37] to-[#C8A882] text-white"
                    >
                      Buscar Profissionais
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
