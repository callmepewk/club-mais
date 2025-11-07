
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
import { Upload, CheckCircle, AlertCircle, ArrowLeft } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";

export default function EdBeautyUpload() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    titulo: "",
    descricao: "",
    tipo: "video",
    tipo_acesso: "gratuito",
    publico_alvo: "todos", // Added new field
    preco: 0,
    url: "",
    thumbnail: "",
    categoria: "Estética Facial",
    duracao: "",
    nivel: "Intermediário",
  });
  const [uploadStatus, setUploadStatus] = useState(null);

  const { data: user } = useQuery({
    queryKey: ['current-user'],
    queryFn: () => base44.auth.me(),
  });

  const createContentMutation = useMutation({
    mutationFn: (data) => base44.entities.EdBeautyContent.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['edbeauty-contents'] });
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

  const handleSubmit = (e) => {
    e.preventDefault();
    createContentMutation.mutate(formData);
  };

  // Check if user has permission
  if (user && user.role !== 'admin') {
    // Verifica se é profissional
    if (user.tipo_usuario !== 'profissional') {
      return (
        <div className="min-h-screen bg-gradient-to-b from-white via-[#F5EFE6] to-white py-20 px-6">
          <div className="max-w-2xl mx-auto text-center space-y-6">
            <AlertCircle className="w-16 h-16 text-amber-600 mx-auto" />
            <h2 className="font-serif text-3xl font-bold text-gray-800">
              Acesso Restrito a Profissionais
            </h2>
            <p className="text-gray-600">
              Apenas profissionais podem enviar conteúdos. Se você é um profissional, entre em contato conosco.
            </p>
            <div className="flex gap-4 justify-center">
              <Link to={createPageUrl("EdBeauty")}>
                <Button variant="outline" className="border-[#D4AF37] text-[#D4AF37]">
                  Voltar
                </Button>
              </Link>
              <Link to={createPageUrl("Contact")}>
                <Button className="bg-gradient-to-r from-[#D4AF37] to-[#C8A882] hover:from-[#C8A882] hover:to-[#D4AF37] text-white">
                  Falar com Suporte
                </Button>
              </Link>
            </div>
          </div>
        </div>
      );
    }

    // Verifica se tem plano EdBeauty
    if (user.edbeauty_plano === 'none') {
      return (
        <div className="min-h-screen bg-gradient-to-b from-white via-[#F5EFE6] to-white py-20 px-6">
          <div className="max-w-2xl mx-auto text-center space-y-6">
            <AlertCircle className="w-16 h-16 text-amber-600 mx-auto" />
            <h2 className="font-serif text-3xl font-bold text-gray-800">
              Plano EdBeauty Necessário
            </h2>
            <p className="text-gray-600">
              Você precisa de um plano EdBeauty para profissionais para enviar conteúdos.
            </p>
            <Link to={createPageUrl("EdBeautyPlans")}>
              <Button className="bg-gradient-to-r from-[#D4AF37] to-[#C8A882] hover:from-[#C8A882] hover:to-[#D4AF37] text-white">
                Ver Planos EdBeauty
              </Button>
            </Link>
          </div>
        </div>
      );
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-[#F5EFE6] to-white py-12 px-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="mb-8"
      >
        <Link to={createPageUrl("EdBeauty")}>
          <Button variant="ghost" className="mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Button>
        </Link>

        <h1 className="font-serif text-4xl md:text-5xl font-bold mb-4">
          <span className="bg-gradient-to-r from-[#D4AF37] to-[#C8A882] bg-clip-text text-transparent">
            Enviar Conteúdo
          </span>
        </h1>
        <p className="text-gray-600">
          Compartilhe seu conhecimento com a comunidade EdBeauty
        </p>
      </motion.div>

      {/* Form */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        <Card className="border-[#E8DCC4] shadow-xl">
          <CardHeader>
            <CardTitle className="font-serif text-2xl text-gray-800">
              Informações do Conteúdo
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
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

              {/* Conditionally rendered Preço input */}
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
                    required
                  />
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="url">Link do Conteúdo (URL Externa) *</Label>
                <Input
                  id="url"
                  type="url"
                  value={formData.url}
                  onChange={(e) => handleInputChange("url", e.target.value)}
                  placeholder="https://youtube.com/... ou https://drive.google.com/..."
                  className="border-[#E8DCC4] focus:border-[#D4AF37]"
                  required
                />
                <p className="text-xs text-gray-500">
                  Cole o link do YouTube, Google Drive, Vimeo ou qualquer plataforma onde o conteúdo está hospedado
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="thumbnail">Link da Imagem de Capa (Opcional)</Label>
                <Input
                  id="thumbnail"
                  type="url"
                  value={formData.thumbnail}
                  onChange={(e) => handleInputChange("thumbnail", e.target.value)}
                  placeholder="https://..."
                  className="border-[#E8DCC4] focus:border-[#D4AF37]"
                />
              </div>

              <div className="grid md:grid-cols-3 gap-4">
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
                    Enviando...
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
