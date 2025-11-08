import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
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
import { Save, AlertCircle, ArrowLeft, Locate, Image } from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";

export default function EdBeautyEditContent() {
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();
  const [loadingLocation, setLoadingLocation] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [formData, setFormData] = useState(null);

  // Get content ID from URL
  const contentId = new URLSearchParams(location.search).get('id');

  const { data: content, isLoading } = useQuery({
    queryKey: ['edbeauty-content', contentId],
    queryFn: async () => {
      const contents = await base44.entities.EdBeautyContent.filter({ id: contentId });
      return contents[0];
    },
    enabled: !!contentId,
  });

  const { data: user } = useQuery({
    queryKey: ['current-user-edit'],
    queryFn: () => base44.auth.me(),
  });

  useEffect(() => {
    if (content) {
      setFormData({
        ...content,
        data_evento: content.data_evento ? new Date(content.data_evento).toISOString().slice(0, 16) : '',
      });
    }
  }, [content]);

  const updateContentMutation = useMutation({
    mutationFn: (data) => base44.entities.EdBeautyContent.update(contentId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['edbeauty-contents'] });
      queryClient.invalidateQueries({ queryKey: ['my-edbeauty-contents'] });
      alert('Conteúdo atualizado com sucesso!');
      navigate(createPageUrl("MyProfile"));
    },
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
          }
          setLoadingLocation(false);
        },
        () => {
          setLoadingLocation(false);
        }
      );
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
      alert('Erro ao enviar imagem.');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    updateContentMutation.mutate(formData);
  };

  if (isLoading || !formData) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white via-[#F5EFE6] to-white flex items-center justify-center">
        <div className="animate-spin w-12 h-12 border-4 border-[#D4AF37] border-t-transparent rounded-full"></div>
      </div>
    );
  }

  // Check permission
  if (!user || (user.role !== 'admin' && content.autor_email !== user.email)) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white via-[#F5EFE6] to-white py-20 px-6">
        <div className="max-w-2xl mx-auto text-center space-y-6">
          <AlertCircle className="w-16 h-16 text-red-600 mx-auto" />
          <h2 className="font-serif text-3xl font-bold text-gray-800">
            Sem Permissão
          </h2>
          <p className="text-gray-600">
            Você não tem permissão para editar este conteúdo.
          </p>
          <Link to={createPageUrl("MyProfile")}>
            <Button variant="outline">Voltar</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-[#F5EFE6] to-white py-12 px-6">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto"
      >
        <Link to={createPageUrl("MyProfile")}>
          <Button variant="ghost" className="mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Button>
        </Link>

        <h1 className="font-serif text-4xl font-bold mb-8">
          <span className="bg-gradient-to-r from-[#D4AF37] to-[#C8A882] bg-clip-text text-transparent">
            Editar Conteúdo
          </span>
        </h1>

        <Card className="border-[#E8DCC4] shadow-xl">
          <CardContent className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Same form structure as EdBeautyCreateContent but with Save button */}
              <div className="space-y-2">
                <Label>Título</Label>
                <Input
                  value={formData.titulo}
                  onChange={(e) => handleInputChange("titulo", e.target.value)}
                  className="border-[#E8DCC4]"
                />
              </div>

              <div className="space-y-2">
                <Label>Descrição</Label>
                <Textarea
                  value={formData.descricao}
                  onChange={(e) => handleInputChange("descricao", e.target.value)}
                  className="border-[#E8DCC4] h-32"
                />
              </div>

              {/* Image Upload */}
              <div className="space-y-4">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="thumbnail-upload-edit"
                />
                <label htmlFor="thumbnail-upload-edit">
                  <Button
                    type="button"
                    variant="outline"
                    disabled={uploadingImage}
                    onClick={() => document.getElementById('thumbnail-upload-edit').click()}
                  >
                    {uploadingImage ? 'Enviando...' : 'Alterar Imagem'}
                  </Button>
                </label>
                {formData.thumbnail && (
                  <img src={formData.thumbnail} alt="Preview" className="w-full h-48 object-cover rounded-xl" />
                )}
              </div>

              {/* Add all other fields similar to create form */}

              <Button
                type="submit"
                disabled={updateContentMutation.isPending}
                className="w-full bg-gradient-to-r from-[#D4AF37] to-[#C8A882] text-white py-6"
              >
                {updateContentMutation.isPending ? (
                  <>Salvando...</>
                ) : (
                  <>
                    <Save className="w-5 h-5 mr-2" />
                    Salvar Alterações
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