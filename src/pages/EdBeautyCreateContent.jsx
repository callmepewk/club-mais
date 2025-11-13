import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import {
  GraduationCap, ArrowLeft, Upload, Sparkles, Zap, CheckCircle,
  XCircle, Video, Globe, MapPin, X
} from "lucide-react";

export default function EdBeautyCreateContent() {
  const queryClient = useQueryClient();
  const [useAI, setUseAI] = useState(false);
  const [loadingAI, setLoadingAI] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [aiGeneratedThumbnail, setAiGeneratedThumbnail] = useState(null);
  const [statusMessage, setStatusMessage] = useState({ type: '', text: '' });

  const [formData, setFormData] = useState({
    titulo: "",
    descricao: "",
    tipo: "video",
    tipo_acesso: "gratuito",
    publico_alvo: "todos",
    preco: 0,
    url_video: "",
    url_curso: "",
    url_ebook: "",
    thumbnail: "",
    categoria: "Estética Facial",
    categoria_outros: "",
    duracao: "",
    nivel: "Iniciante",
    data_evento: "",
    rua: "",
    numero: "",
    complemento: "",
    bairro: "",
    cidade: "",
    estado: "",
    pais: "Brasil"
  });

  const { data: user } = useQuery({
    queryKey: ['current-user-edbeauty-create'],
    queryFn: () => base44.auth.me(),
  });

  const createContentMutation = useMutation({
    mutationFn: (data) => base44.entities.EdBeautyContent.create({
      ...data,
      autor_email: user?.email,
      autor_nome: user?.full_name
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['edbeauty-contents'] });
      setStatusMessage({ type: 'success', text: 'Conteúdo publicado com sucesso!' });
      setTimeout(() => {
        window.location.href = createPageUrl("EdBeauty");
      }, 2000);
    },
    onError: (error) => {
      console.error('Erro ao criar conteúdo:', error);
      setStatusMessage({ type: 'error', text: 'Erro ao publicar conteúdo. Tente novamente.' });
    }
  });

  const handleGenerateContentWithAI = async () => {
    if (!formData.titulo && !formData.descricao) {
      alert('Preencha pelo menos o título ou descrição para usar a IA.');
      return;
    }

    setLoadingAI(true);

    try {
      const basePrompt = formData.titulo || formData.descricao;
      
      const contentDetails = await base44.integrations.Core.InvokeLLM({
        prompt: `Com base neste conteúdo educacional de estética/beleza: "${basePrompt}"
        
        Gere um JSON completo com:
        - titulo: título chamativo e profissional (se não fornecido)
        - descricao: descrição detalhada e profissional (se não fornecida)
        - categoria: escolha a categoria mais apropriada entre: Estética Facial, Estética Corporal, Harmonização, Micropigmentação, Depilação a Laser, Marketing, Gestão, Técnicas Avançadas, Outros
        - categoria_outros: se categoria for "Outros", especifique aqui
        - duracao: estimativa de duração (ex: "2h30min" para cursos, "45min" para vídeos, "120 páginas" para ebooks)
        - nivel: Iniciante, Intermediário ou Avançado
        
        Tipo de conteúdo: ${formData.tipo}
        
        Retorne APENAS o JSON.`,
        response_json_schema: {
          type: "object",
          properties: {
            titulo: { type: "string" },
            descricao: { type: "string" },
            categoria: { type: "string" },
            categoria_outros: { type: "string" },
            duracao: { type: "string" },
            nivel: { type: "string" }
          }
        }
      });

      const imagePrompt = `Professional educational content thumbnail for beauty and aesthetics, ${contentDetails.titulo || formData.titulo}, ${contentDetails.categoria}, elegant, modern, high quality, professional`;
      
      const imageResult = await base44.integrations.Core.GenerateImage({
        prompt: imagePrompt
      });

      setFormData(prev => ({
        ...prev,
        titulo: contentDetails.titulo || prev.titulo,
        descricao: contentDetails.descricao || prev.descricao,
        categoria: contentDetails.categoria || prev.categoria,
        categoria_outros: contentDetails.categoria_outros || prev.categoria_outros,
        duracao: contentDetails.duracao || prev.duracao,
        nivel: contentDetails.nivel || prev.nivel,
      }));

      setAiGeneratedThumbnail(imageResult.url);
      setFormData(prev => ({ ...prev, thumbnail: imageResult.url }));

      alert('Conteúdo gerado com IA! Revise, ajuste e adicione os links necessários.');
    } catch (error) {
      console.error('Erro ao gerar com IA:', error);
      alert('Erro ao gerar conteúdo. Tente novamente.');
    }

    setLoadingAI(false);
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    try {
      const result = await base44.integrations.Core.UploadFile({ file });
      setFormData(prev => ({ ...prev, thumbnail: result.file_url }));
      setAiGeneratedThumbnail(null);
    } catch (error) {
      console.error('Erro ao fazer upload:', error);
      alert('Erro ao fazer upload da imagem.');
    }
    setUploadingImage(false);
  };

  const handleRemoveAIThumbnail = () => {
    setAiGeneratedThumbnail(null);
    setFormData(prev => ({ ...prev, thumbnail: '' }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.titulo || !formData.descricao) {
      alert('Por favor, preencha título e descrição.');
      return;
    }

    if (formData.tipo === 'video' && !formData.url_video) {
      alert('Por favor, adicione a URL do vídeo.');
      return;
    }

    if (formData.tipo === 'curso' && !formData.url_curso) {
      alert('Por favor, adicione o link do curso.');
      return;
    }

    if (formData.tipo === 'ebook' && !formData.url_ebook) {
      alert('Por favor, adicione o link do e-book.');
      return;
    }

    createContentMutation.mutate(formData);
  };

  const canCreate = user?.role === 'admin' || user?.tipo_usuario === 'profissional';

  if (!canCreate) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white via-[#F5EFE6] to-white py-20 px-6">
        <div className="max-w-2xl mx-auto text-center space-y-6">
          <XCircle className="w-16 h-16 text-red-600 mx-auto" />
          <h2 className="font-serif text-3xl font-bold text-gray-800">
            Acesso Restrito
          </h2>
          <p className="text-gray-600">
            Apenas profissionais podem criar conteúdo educacional.
          </p>
          <Link to={createPageUrl("EdBeauty")}>
            <Button className="bg-gradient-to-r from-[#D4AF37] to-[#C8A882] text-white">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar para EdBeauty
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-[#F5EFE6] to-white">
      <div className="relative py-20 px-6 overflow-hidden bg-gradient-to-br from-[#D4AF37] via-[#C8A882] to-[#D4AF37]">
        <div className="relative z-10 max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center space-y-6"
          >
            <Badge className="bg-white/20 text-white border-white/30 px-4 py-2 text-base backdrop-blur-sm">
              <GraduationCap className="w-4 h-4 mr-2" />
              Compartilhe Conhecimento
            </Badge>

            <h1 className="font-serif text-5xl md:text-6xl font-bold text-white">
              Criar Novo Conteúdo
            </h1>

            <p className="text-xl text-white/90">
              Adicione vídeos, cursos ou e-books para a comunidade
            </p>
          </motion.div>
        </div>
      </div>

      <div className="py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <Card className="border-[#E8DCC4] shadow-2xl">
            <CardHeader className="bg-gradient-to-r from-[#F5EFE6] to-[#E8DCC4]">
              <div className="flex items-center justify-between">
                <CardTitle className="font-serif text-2xl">
                  Detalhes do Conteúdo
                </CardTitle>
                <Button
                  variant={useAI ? "default" : "outline"}
                  size="sm"
                  onClick={() => setUseAI(!useAI)}
                  className={useAI ? "bg-gradient-to-r from-purple-500 to-purple-600 text-white" : ""}
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  {useAI ? 'IA Ativada' : 'Ativar IA'}
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                {useAI && (
                  <div className="p-4 bg-purple-50 rounded-lg border-2 border-purple-200">
                    <div className="flex items-start gap-3 mb-4">
                      <Sparkles className="w-5 h-5 text-purple-600 flex-shrink-0 mt-1" />
                      <div className="flex-1">
                        <h4 className="font-semibold text-purple-800 mb-1">Criar Conteúdo com IA</h4>
                        <p className="text-sm text-purple-700 mb-3">
                          Preencha título OU descrição, selecione tipo, acesso e público-alvo. 
                          A IA irá gerar todo o resto automaticamente!
                        </p>
                      </div>
                    </div>
                    <Button
                      type="button"
                      onClick={handleGenerateContentWithAI}
                      disabled={loadingAI || (!formData.titulo && !formData.descricao)}
                      className="w-full bg-gradient-to-r from-purple-500 to-purple-600 text-white"
                    >
                      {loadingAI ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                          Gerando com IA...
                        </>
                      ) : (
                        <>
                          <Zap className="w-4 h-4 mr-2" />
                          Gerar Conteúdo Completo com IA
                        </>
                      )}
                    </Button>
                  </div>
                )}

                <div className="space-y-2">
                  <Label>Título do Conteúdo *</Label>
                  <Input
                    value={formData.titulo}
                    onChange={(e) => setFormData({...formData, titulo: e.target.value})}
                    placeholder="Ex: Técnicas Avançadas de Harmonização Facial"
                    required
                    className="border-[#E8DCC4]"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Descrição *</Label>
                  <Textarea
                    value={formData.descricao}
                    onChange={(e) => setFormData({...formData, descricao: e.target.value})}
                    placeholder="Descreva o conteúdo..."
                    required
                    className="border-[#E8DCC4] h-32"
                  />
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Tipo de Conteúdo *</Label>
                    <Select value={formData.tipo} onValueChange={(value) => setFormData({...formData, tipo: value})}>
                      <SelectTrigger className="border-[#E8DCC4]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="video">Vídeo Aula</SelectItem>
                        <SelectItem value="curso">Curso</SelectItem>
                        <SelectItem value="ebook">E-book</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Tipo de Acesso *</Label>
                    <Select value={formData.tipo_acesso} onValueChange={(value) => setFormData({...formData, tipo_acesso: value})}>
                      <SelectTrigger className="border-[#E8DCC4]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="gratuito">Gratuito</SelectItem>
                        <SelectItem value="pago">Pago</SelectItem>
                        <SelectItem value="exclusivo">Exclusivo (Membros)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Público Alvo *</Label>
                    <Select value={formData.publico_alvo} onValueChange={(value) => setFormData({...formData, publico_alvo: value})}>
                      <SelectTrigger className="border-[#E8DCC4]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="todos">Todos</SelectItem>
                        <SelectItem value="paciente-light">Pacientes Light+</SelectItem>
                        <SelectItem value="paciente-gold">Pacientes Gold+</SelectItem>
                        <SelectItem value="paciente-vip">Pacientes VIP</SelectItem>
                        <SelectItem value="profissional-light">Profissionais Light+</SelectItem>
                        <SelectItem value="profissional-gold">Profissionais Gold+</SelectItem>
                        <SelectItem value="profissional-vip">Profissionais VIP</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {formData.tipo === 'video' && (
                  <div className="space-y-2">
                    <Label>URL do Vídeo (YouTube, Vimeo, etc) *</Label>
                    <Input
                      type="url"
                      value={formData.url_video}
                      onChange={(e) => setFormData({...formData, url_video: e.target.value})}
                      placeholder="https://youtube.com/..."
                      className="border-[#E8DCC4]"
                    />
                  </div>
                )}

                {formData.tipo === 'curso' && (
                  <div className="space-y-2">
                    <Label>Link do Curso *</Label>
                    <Input
                      type="url"
                      value={formData.url_curso}
                      onChange={(e) => setFormData({...formData, url_curso: e.target.value})}
                      placeholder="https://..."
                      className="border-[#E8DCC4]"
                    />
                  </div>
                )}

                {formData.tipo === 'ebook' && (
                  <div className="space-y-2">
                    <Label>Link do E-book *</Label>
                    <Input
                      type="url"
                      value={formData.url_ebook}
                      onChange={(e) => setFormData({...formData, url_ebook: e.target.value})}
                      placeholder="https://..."
                      className="border-[#E8DCC4]"
                    />
                  </div>
                )}

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>Imagem de Capa</Label>
                    {aiGeneratedThumbnail && (
                      <Button
                        type="button"
                        onClick={handleRemoveAIThumbnail}
                        variant="ghost"
                        size="sm"
                        className="text-red-600"
                      >
                        <X className="w-4 h-4 mr-1" />
                        Remover IA
                      </Button>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Input
                      type="url"
                      value={formData.thumbnail}
                      onChange={(e) => setFormData({...formData, thumbnail: e.target.value})}
                      placeholder="URL da imagem ou faça upload"
                      className="border-[#E8DCC4]"
                    />
                    <Label className="flex items-center justify-center px-4 py-2 border-2 border-dashed border-[#E8DCC4] rounded-lg cursor-pointer hover:border-[#D4AF37] transition-colors">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                      {uploadingImage ? (
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-[#D4AF37]" />
                      ) : (
                        <Upload className="w-5 h-5 text-[#D4AF37]" />
                      )}
                    </Label>
                  </div>
                  {formData.thumbnail && (
                    <div className="relative mt-2">
                      <img src={formData.thumbnail} alt="Preview" className="w-full h-48 object-cover rounded-lg" />
                      {aiGeneratedThumbnail && (
                        <Badge className="absolute top-2 left-2 bg-purple-600 text-white">
                          <Sparkles className="w-3 h-3 mr-1" />
                          Gerada por IA
                        </Badge>
                      )}
                    </div>
                  )}
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Categoria *</Label>
                    <Select value={formData.categoria} onValueChange={(value) => setFormData({...formData, categoria: value})}>
                      <SelectTrigger className="border-[#E8DCC4]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Estética Facial">Estética Facial</SelectItem>
                        <SelectItem value="Estética Corporal">Estética Corporal</SelectItem>
                        <SelectItem value="Harmonização">Harmonização</SelectItem>
                        <SelectItem value="Micropigmentação">Micropigmentação</SelectItem>
                        <SelectItem value="Depilação a Laser">Depilação a Laser</SelectItem>
                        <SelectItem value="Marketing">Marketing</SelectItem>
                        <SelectItem value="Gestão">Gestão</SelectItem>
                        <SelectItem value="Técnicas Avançadas">Técnicas Avançadas</SelectItem>
                        <SelectItem value="Outros">Outros</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {formData.categoria === 'Outros' && (
                    <div className="space-y-2">
                      <Label>Especifique a Categoria</Label>
                      <Input
                        value={formData.categoria_outros}
                        onChange={(e) => setFormData({...formData, categoria_outros: e.target.value})}
                        placeholder="Ex: Podologia Avançada"
                        className="border-[#E8DCC4]"
                      />
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label>Nível</Label>
                    <Select value={formData.nivel} onValueChange={(value) => setFormData({...formData, nivel: value})}>
                      <SelectTrigger className="border-[#E8DCC4]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Iniciante">Iniciante</SelectItem>
                        <SelectItem value="Intermediário">Intermediário</SelectItem>
                        <SelectItem value="Avançado">Avançado</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Duração Estimada</Label>
                    <Input
                      value={formData.duracao}
                      onChange={(e) => setFormData({...formData, duracao: e.target.value})}
                      placeholder="Ex: 2h30min, 150 páginas"
                      className="border-[#E8DCC4]"
                    />
                  </div>
                </div>

                {formData.tipo_acesso === 'pago' && (
                  <div className="space-y-2">
                    <Label>Preço (R$)</Label>
                    <Input
                      type="number"
                      step="0.01"
                      value={formData.preco}
                      onChange={(e) => setFormData({...formData, preco: parseFloat(e.target.value) || 0})}
                      className="border-[#E8DCC4]"
                    />
                  </div>
                )}

                <div className="space-y-2">
                  <Label>Data e Horário do Evento (Opcional - para aulas ao vivo)</Label>
                  <Input
                    type="datetime-local"
                    value={formData.data_evento}
                    onChange={(e) => setFormData({...formData, data_evento: e.target.value})}
                    className="border-[#E8DCC4]"
                  />
                </div>

                {formData.data_evento && (
                  <div className="p-4 bg-blue-50 rounded-lg border-2 border-blue-200 space-y-4">
                    <h4 className="font-semibold text-blue-800">Localização do Evento (Opcional)</h4>
                    
                    <div className="grid md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label>Rua</Label>
                        <Input
                          value={formData.rua}
                          onChange={(e) => setFormData({...formData, rua: e.target.value})}
                          placeholder="Nome da rua"
                          className="border-blue-300"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Número</Label>
                        <Input
                          value={formData.numero}
                          onChange={(e) => setFormData({...formData, numero: e.target.value})}
                          placeholder="123"
                          className="border-blue-300"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Complemento</Label>
                        <Input
                          value={formData.complemento}
                          onChange={(e) => setFormData({...formData, complemento: e.target.value})}
                          placeholder="Sala, Andar..."
                          className="border-blue-300"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Bairro</Label>
                        <Input
                          value={formData.bairro}
                          onChange={(e) => setFormData({...formData, bairro: e.target.value})}
                          placeholder="Bairro"
                          className="border-blue-300"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Cidade</Label>
                        <Input
                          value={formData.cidade}
                          onChange={(e) => setFormData({...formData, cidade: e.target.value})}
                          placeholder="Cidade"
                          className="border-blue-300"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Estado</Label>
                        <Input
                          value={formData.estado}
                          onChange={(e) => setFormData({...formData, estado: e.target.value.toUpperCase()})}
                          placeholder="UF"
                          maxLength={2}
                          className="border-blue-300"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>País</Label>
                        <Input
                          value={formData.pais}
                          onChange={(e) => setFormData({...formData, pais: e.target.value})}
                          placeholder="País"
                          className="border-blue-300"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {statusMessage.text && (
                  <div className={`p-4 rounded-lg flex items-center gap-3 ${
                    statusMessage.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
                  }`}>
                    {statusMessage.type === 'success' ? (
                      <CheckCircle className="w-5 h-5" />
                    ) : (
                      <XCircle className="w-5 h-5" />
                    )}
                    <p>{statusMessage.text}</p>
                  </div>
                )}

                <div className="flex gap-3 pt-4">
                  <Link to={createPageUrl("EdBeauty")} className="flex-1">
                    <Button variant="outline" className="w-full border-[#E8DCC4]">
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      Cancelar
                    </Button>
                  </Link>
                  <Button
                    type="submit"
                    disabled={createContentMutation.isPending}
                    className="flex-1 bg-gradient-to-r from-[#D4AF37] to-[#C8A882] text-white"
                  >
                    {createContentMutation.isPending ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                        Publicando...
                      </>
                    ) : (
                      <>
                        <GraduationCap className="w-4 h-4 mr-2" />
                        Publicar Conteúdo
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}