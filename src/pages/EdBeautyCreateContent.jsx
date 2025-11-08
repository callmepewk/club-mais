import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { motion } from "framer-motion";
import { Upload, CheckCircle, AlertCircle, ArrowLeft, Locate, MapPin, Image } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";

export default function EdBeautyCreateContent() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [loadingLocation, setLoadingLocation] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
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
    nivel: "Intermediário",
    data_evento: "",
    localizacao: "",
    latitude: "",
    longitude: "",
  });
  const [uploadStatus, setUploadStatus] = useState(null);

  const { data: user } = useQuery({
    queryKey: ['current-user-edbeauty'],
    queryFn: () => base44.auth.me(),
  });

  const createContentMutation = useMutation({
    mutationFn: (data) => base44.entities.EdBeautyContent.create({
      ...data,
      autor_email: user?.email,
      autor_nome: user?.full_name,
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['edbeauty-contents'] });
      queryClient.invalidateQueries({ queryKey: ['my-edbeauty-contents'] });
      setUploadStatus('success');
      setTimeout(() => {
        navigate(createPageUrl("EdBeauty"));
      }, 2000);
    },
    onError: () => {
      setUploadStatus('error');
    }
  });

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const getUserLocation = async () => {
    setLoadingLocation(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${position.coords.latitude}&lon=${position.coords.longitude}&zoom=18&addressdetails=1`
            );
            const data = await response.json();

            const locationString = [
              data.address.road,
              data.address.suburb || data.address.neighbourhood,
              data.address.city || data.address.town,
              data.address.state
            ].filter(Boolean).join(', ');

            setFormData(prev => ({
              ...prev,
              localizacao: locationString,
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            }));
          } catch (error) {
            console.error('Erro ao obter localização:', error);
            alert('Não foi possível obter o endereço. Preencha manualmente.');
          }
          setLoadingLocation(false);
        },
        (error) => {
          console.error('Erro de geolocalização:', error);
          alert('Não foi possível obter sua localização. Verifique as permissões.');
          setLoadingLocation(false);
        }
      );
    } else {
      alert('Geolocalização não é suportada pelo seu navegador.');
      setLoadingLocation(false);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    try {
      const { file_url } = await base44.integrations.Core.UploadFile({ file });
      setFormData(prev => ({ ...prev, thumbnail: file_url }));
      alert('Imagem enviada com sucesso!');
    } catch (error) {
      console.error('Erro ao enviar imagem:', error);
      alert('Erro ao enviar imagem. Tente novamente.');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.titulo || !formData.descricao) {
      alert('Por favor, preencha o título e descrição.');
      return;
    }

    // Validate based on content type
    if (formData.tipo === 'video' && !formData.url_video) {
      alert('Por favor, forneça o link do vídeo.');
      return;
    }
    if (formData.tipo === 'curso' && !formData.url_curso) {
      alert('Por favor, forneça o link de acesso ao curso.');
      return;
    }
    if (formData.tipo === 'ebook' && !formData.url_ebook) {
      alert('Por favor, forneça o link do e-book.');
      return;
    }

    if (formData.categoria === 'Outros' && !formData.categoria_outros) {
      alert('Por favor, especifique a categoria.');
      return;
    }

    createContentMutation.mutate(formData);
  };

  // Check if user has permission
  if (!user || (user.role !== 'admin' && user.tipo_usuario !== 'profissional')) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white via-[#F5EFE6] to-white py-20 px-6">
        <div className="max-w-2xl mx-auto text-center space-y-6">
          <AlertCircle className="w-16 h-16 text-amber-600 mx-auto" />
          <h2 className="font-serif text-3xl font-bold text-gray-800">
            Acesso Restrito a Profissionais
          </h2>
          <p className="text-gray-600">
            Apenas profissionais podem enviar conteúdos. Se você é um profissional, atualize seu perfil.
          </p>
          <Link to={createPageUrl("EdBeauty")}>
            <Button variant="outline" className="border-[#D4AF37] text-[#D4AF37]">
              Voltar
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-[#F5EFE6] to-white py-12 px-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-4xl mx-auto mb-8"
      >
        <Link to={createPageUrl("EdBeauty")}>
          <Button variant="ghost" className="mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Button>
        </Link>

        <h1 className="font-serif text-4xl md:text-5xl font-bold mb-4">
          <span className="bg-gradient-to-r from-[#D4AF37] to-[#C8A882] bg-clip-text text-transparent">
            Adicionar Conteúdo
          </span>
        </h1>
        <p className="text-gray-600 text-lg">
          Compartilhe seu conhecimento com a comunidade EdBeauty
        </p>
      </motion.div>

      {/* Form */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="max-w-4xl mx-auto"
      >
        <Card className="border-[#E8DCC4] shadow-xl">
          <CardContent className="p-8">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Basic Info */}
              <div className="space-y-6">
                <h3 className="font-serif text-xl font-bold text-gray-800 border-b border-[#E8DCC4] pb-2">
                  Informações Básicas
                </h3>

                <div className="space-y-2">
                  <Label htmlFor="titulo">Título *</Label>
                  <Input
                    id="titulo"
                    value={formData.titulo}
                    onChange={(e) => handleInputChange("titulo", e.target.value)}
                    placeholder="Ex: Técnicas Avançadas de Harmonização Facial"
                    className="border-[#E8DCC4] focus:border-[#D4AF37]"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="descricao">Descrição *</Label>
                  <Textarea
                    id="descricao"
                    value={formData.descricao}
                    onChange={(e) => handleInputChange("descricao", e.target.value)}
                    placeholder="Descreva o conteúdo, o que será abordado, para quem é indicado..."
                    className="border-[#E8DCC4] focus:border-[#D4AF37] h-32"
                    required
                  />
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="tipo">Tipo de Conteúdo *</Label>
                    <Select value={formData.tipo} onValueChange={(value) => handleInputChange("tipo", value)}>
                      <SelectTrigger className="border-[#E8DCC4] focus:border-[#D4AF37]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="video">Vídeo Aula</SelectItem>
                        <SelectItem value="curso">Curso Completo</SelectItem>
                        <SelectItem value="ebook">E-book</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="tipo_acesso">Tipo de Acesso *</Label>
                    <Select value={formData.tipo_acesso} onValueChange={(value) => handleInputChange("tipo_acesso", value)}>
                      <SelectTrigger className="border-[#E8DCC4] focus:border-[#D4AF37]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="gratuito">Gratuito</SelectItem>
                        <SelectItem value="pago">Pago</SelectItem>
                        <SelectItem value="exclusivo">Exclusivo</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="publico_alvo">Público Alvo *</Label>
                    <Select value={formData.publico_alvo} onValueChange={(value) => handleInputChange("publico_alvo", value)}>
                      <SelectTrigger className="border-[#E8DCC4] focus:border-[#D4AF37]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="todos">Todos</SelectItem>
                        <SelectItem value="paciente-light">Pacientes - Light</SelectItem>
                        <SelectItem value="paciente-gold">Pacientes - Gold</SelectItem>
                        <SelectItem value="paciente-vip">Pacientes - VIP</SelectItem>
                        <SelectItem value="profissional-light">Profissionais - Light</SelectItem>
                        <SelectItem value="profissional-gold">Profissionais - Gold</SelectItem>
                        <SelectItem value="profissional-vip">Profissionais - VIP</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {formData.tipo_acesso === 'pago' && (
                  <div className="space-y-2">
                    <Label htmlFor="preco">Preço (R$) *</Label>
                    <Input
                      id="preco"
                      type="number"
                      step="0.01"
                      min="0"
                      value={formData.preco}
                      onChange={(e) => handleInputChange("preco", parseFloat(e.target.value))}
                      placeholder="0.00"
                      className="border-[#E8DCC4] focus:border-[#D4AF37]"
                    />
                  </div>
                )}
              </div>

              {/* Links */}
              <div className="space-y-6">
                <h3 className="font-serif text-xl font-bold text-gray-800 border-b border-[#E8DCC4] pb-2">
                  Links de Acesso
                </h3>

                {formData.tipo === 'video' && (
                  <div className="space-y-2">
                    <Label htmlFor="url_video">Link do Vídeo *</Label>
                    <Input
                      id="url_video"
                      type="url"
                      value={formData.url_video}
                      onChange={(e) => handleInputChange("url_video", e.target.value)}
                      placeholder="https://youtube.com/... ou https://vimeo.com/..."
                      className="border-[#E8DCC4] focus:border-[#D4AF37]"
                    />
                  </div>
                )}

                {formData.tipo === 'curso' && (
                  <div className="space-y-2">
                    <Label htmlFor="url_curso">Link de Acesso ao Curso *</Label>
                    <Input
                      id="url_curso"
                      type="url"
                      value={formData.url_curso}
                      onChange={(e) => handleInputChange("url_curso", e.target.value)}
                      placeholder="https://..."
                      className="border-[#E8DCC4] focus:border-[#D4AF37]"
                    />
                  </div>
                )}

                {formData.tipo === 'ebook' && (
                  <div className="space-y-2">
                    <Label htmlFor="url_ebook">Link do E-book *</Label>
                    <Input
                      id="url_ebook"
                      type="url"
                      value={formData.url_ebook}
                      onChange={(e) => handleInputChange("url_ebook", e.target.value)}
                      placeholder="https://..."
                      className="border-[#E8DCC4] focus:border-[#D4AF37]"
                    />
                  </div>
                )}
              </div>

              {/* Image Upload */}
              <div className="space-y-6">
                <h3 className="font-serif text-xl font-bold text-gray-800 border-b border-[#E8DCC4] pb-2">
                  Imagem de Capa
                </h3>

                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      id="thumbnail-upload"
                    />
                    <label htmlFor="thumbnail-upload">
                      <Button
                        type="button"
                        variant="outline"
                        className="border-[#D4AF37] text-[#D4AF37]"
                        disabled={uploadingImage}
                        onClick={() => document.getElementById('thumbnail-upload').click()}
                      >
                        {uploadingImage ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#D4AF37] mr-2" />
                            Enviando...
                          </>
                        ) : (
                          <>
                            <Image className="w-4 h-4 mr-2" />
                            Enviar Imagem
                          </>
                        )}
                      </Button>
                    </label>
                  </div>

                  {formData.thumbnail && (
                    <div className="relative w-full h-48 rounded-xl overflow-hidden border-2 border-[#E8DCC4]">
                      <img
                        src={formData.thumbnail}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Category and Details */}
              <div className="space-y-6">
                <h3 className="font-serif text-xl font-bold text-gray-800 border-b border-[#E8DCC4] pb-2">
                  Categoria e Detalhes
                </h3>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="categoria">Categoria *</Label>
                    <Select value={formData.categoria} onValueChange={(value) => handleInputChange("categoria", value)}>
                      <SelectTrigger className="border-[#E8DCC4] focus:border-[#D4AF37]">
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
                      <Label htmlFor="categoria_outros">Especificar Categoria *</Label>
                      <Input
                        id="categoria_outros"
                        value={formData.categoria_outros}
                        onChange={(e) => handleInputChange("categoria_outros", e.target.value)}
                        placeholder="Ex: Nutrição Estética, Cosmiatria..."
                        className="border-[#E8DCC4] focus:border-[#D4AF37]"
                      />
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="nivel">Nível</Label>
                    <Select value={formData.nivel} onValueChange={(value) => handleInputChange("nivel", value)}>
                      <SelectTrigger className="border-[#E8DCC4] focus:border-[#D4AF37]">
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
                    <Label htmlFor="duracao">Duração</Label>
                    <Input
                      id="duracao"
                      value={formData.duracao}
                      onChange={(e) => handleInputChange("duracao", e.target.value)}
                      placeholder="Ex: 2h30min, 50 páginas"
                      className="border-[#E8DCC4] focus:border-[#D4AF37]"
                    />
                  </div>
                </div>
              </div>

              {/* Location and Date (Optional) */}
              <div className="space-y-6">
                <h3 className="font-serif text-xl font-bold text-gray-800 border-b border-[#E8DCC4] pb-2">
                  Localização e Data (Opcional)
                </h3>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="data_evento">Data e Horário</Label>
                    <Input
                      id="data_evento"
                      type="datetime-local"
                      value={formData.data_evento}
                      onChange={(e) => handleInputChange("data_evento", e.target.value)}
                      className="border-[#E8DCC4] focus:border-[#D4AF37]"
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="localizacao">Localização</Label>
                      <Button
                        type="button"
                        onClick={getUserLocation}
                        disabled={loadingLocation}
                        variant="outline"
                        size="sm"
                        className="border-[#D4AF37] text-[#D4AF37]"
                      >
                        {loadingLocation ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#D4AF37] mr-2" />
                            Obtendo...
                          </>
                        ) : (
                          <>
                            <Locate className="w-4 h-4 mr-2" />
                            Usar Localização Atual
                          </>
                        )}
                      </Button>
                    </div>
                    <Input
                      id="localizacao"
                      value={formData.localizacao}
                      onChange={(e) => handleInputChange("localizacao", e.target.value)}
                      placeholder="Ex: Rua Exemplo, 123 - Belo Horizonte, MG"
                      className="border-[#E8DCC4] focus:border-[#D4AF37]"
                    />
                  </div>
                </div>
              </div>

              {/* Status Messages */}
              {uploadStatus === 'success' && (
                <div className="flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <p className="text-green-800">Conteúdo enviado com sucesso! Redirecionando...</p>
                </div>
              )}

              {uploadStatus === 'error' && (
                <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <AlertCircle className="w-5 h-5 text-red-600" />
                  <p className="text-red-800">Erro ao enviar conteúdo. Tente novamente.</p>
                </div>
              )}

              <Button
                type="submit"
                disabled={createContentMutation.isPending}
                className="w-full bg-gradient-to-r from-[#D4AF37] to-[#C8A882] hover:from-[#C8A882] hover:to-[#D4AF37] text-white py-6 text-lg font-semibold"
              >
                {createContentMutation.isPending ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" />
                    Publicando...
                  </>
                ) : (
                  <>
                    <Upload className="w-5 h-5 mr-2" />
                    Publicar Conteúdo
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}