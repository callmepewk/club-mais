import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { motion } from "framer-motion";
import { X, User, Briefcase, MapPin, Locate } from "lucide-react";

export default function SignUpModal({ onClose }) {
  const queryClient = useQueryClient();
  const [loadingLocation, setLoadingLocation] = useState(false);
  const [formData, setFormData] = useState({
    tipo_usuario: "paciente",
    full_name: "",
    email: "",
    telefone: "",
    whatsapp: "",
    cpf: "",
    endereco: "",
    cidade: "",
    estado: "",
    pais: "Brasil",
    bairro: "",
    numero: "",
    complemento: "",
    clube_plano: "none",
    beauty_club_plano: "none",
    edbeauty_plano: "none",
    is_golden_doctor: false,
    pontos_clube: 0,
    beauty_coins: 0
  });

  const updateUserMutation = useMutation({
    mutationFn: (data) => base44.auth.updateMe(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['current-user'] });
      alert('Cadastro realizado com sucesso! Bem-vindo ao Club da Beleza!');
      onClose();
    },
    onError: (error) => {
      console.error('Erro ao cadastrar:', error);
      alert('Erro ao realizar cadastro. Tente novamente.');
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

            setFormData(prev => ({
              ...prev,
              endereco: data.address.road || '',
              numero: data.address.house_number || '',
              bairro: data.address.suburb || data.address.neighbourhood || '',
              cidade: data.address.city || data.address.town || data.address.village || '',
              estado: data.address.state || '',
              pais: data.address.country || 'Brasil',
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

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.full_name || !formData.email || !formData.telefone || !formData.cpf) {
      alert('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    updateUserMutation.mutate(formData);
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[200] p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-3xl w-full max-h-[90vh] overflow-y-auto"
      >
        <Card className="border-[#E8DCC4] shadow-2xl">
          <CardHeader className="bg-gradient-to-r from-[#D4AF37] to-[#C8A882] text-white sticky top-0 z-10">
            <div className="flex items-center justify-between">
              <CardTitle className="font-serif text-2xl">
                Registre-se no Club da Beleza
              </CardTitle>
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="text-white hover:bg-white/20"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>
          </CardHeader>

          <CardContent className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Tipo de Usuário */}
              <div className="space-y-2">
                <Label>Tipo de Conta *</Label>
                <div className="grid grid-cols-2 gap-4">
                  <div
                    onClick={() => handleInputChange("tipo_usuario", "paciente")}
                    className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                      formData.tipo_usuario === "paciente"
                        ? 'border-[#D4AF37] bg-gradient-to-r from-[#F5EFE6] to-[#E8DCC4]'
                        : 'border-[#E8DCC4] hover:border-[#C8A882]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <User className="w-6 h-6 text-[#D4AF37]" />
                      <div>
                        <p className="font-semibold">Paciente</p>
                        <p className="text-xs text-gray-600">Busco tratamentos</p>
                      </div>
                    </div>
                  </div>

                  <div
                    onClick={() => handleInputChange("tipo_usuario", "profissional")}
                    className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                      formData.tipo_usuario === "profissional"
                        ? 'border-[#D4AF37] bg-gradient-to-r from-[#F5EFE6] to-[#E8DCC4]'
                        : 'border-[#E8DCC4] hover:border-[#C8A882]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Briefcase className="w-6 h-6 text-[#D4AF37]" />
                      <div>
                        <p className="font-semibold">Profissional</p>
                        <p className="text-xs text-gray-600">Ofereço serviços</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Dados Pessoais */}
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="full_name">Nome Completo *</Label>
                  <Input
                    id="full_name"
                    value={formData.full_name}
                    onChange={(e) => handleInputChange("full_name", e.target.value)}
                    placeholder="Seu nome completo"
                    className="border-[#E8DCC4]"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">E-mail *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    placeholder="seu@email.com"
                    className="border-[#E8DCC4]"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="telefone">Telefone/WhatsApp *</Label>
                  <Input
                    id="telefone"
                    value={formData.telefone}
                    onChange={(e) => {
                      handleInputChange("telefone", e.target.value);
                      handleInputChange("whatsapp", e.target.value);
                    }}
                    placeholder="(00) 00000-0000"
                    className="border-[#E8DCC4]"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cpf">CPF *</Label>
                  <Input
                    id="cpf"
                    value={formData.cpf}
                    onChange={(e) => handleInputChange("cpf", e.target.value)}
                    placeholder="000.000.000-00"
                    className="border-[#E8DCC4]"
                    required
                  />
                </div>
              </div>

              {/* Localização */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label className="text-lg font-semibold">Localização</Label>
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

                <div className="grid md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="endereco">Endereço</Label>
                    <Input
                      id="endereco"
                      value={formData.endereco}
                      onChange={(e) => handleInputChange("endereco", e.target.value)}
                      placeholder="Rua, Avenida..."
                      className="border-[#E8DCC4]"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="numero">Número</Label>
                    <Input
                      id="numero"
                      value={formData.numero}
                      onChange={(e) => handleInputChange("numero", e.target.value)}
                      placeholder="123"
                      className="border-[#E8DCC4]"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="complemento">Complemento</Label>
                    <Input
                      id="complemento"
                      value={formData.complemento}
                      onChange={(e) => handleInputChange("complemento", e.target.value)}
                      placeholder="Apto, Bloco..."
                      className="border-[#E8DCC4]"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bairro">Bairro</Label>
                    <Input
                      id="bairro"
                      value={formData.bairro}
                      onChange={(e) => handleInputChange("bairro", e.target.value)}
                      placeholder="Seu bairro"
                      className="border-[#E8DCC4]"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="cidade">Cidade</Label>
                    <Input
                      id="cidade"
                      value={formData.cidade}
                      onChange={(e) => handleInputChange("cidade", e.target.value)}
                      placeholder="Sua cidade"
                      className="border-[#E8DCC4]"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="estado">Estado</Label>
                    <Input
                      id="estado"
                      value={formData.estado}
                      onChange={(e) => handleInputChange("estado", e.target.value)}
                      placeholder="UF"
                      maxLength={2}
                      className="border-[#E8DCC4]"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="pais">País</Label>
                    <Input
                      id="pais"
                      value={formData.pais}
                      onChange={(e) => handleInputChange("pais", e.target.value)}
                      placeholder="Brasil"
                      className="border-[#E8DCC4]"
                    />
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={updateUserMutation.isPending}
                className="w-full bg-gradient-to-r from-[#D4AF37] to-[#C8A882] text-white py-6 text-lg font-semibold"
              >
                {updateUserMutation.isPending ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" />
                    Cadastrando...
                  </>
                ) : (
                  'Registrar-se'
                )}
              </Button>

              <p className="text-xs text-gray-500 text-center">
                Ao se registrar, você concorda com nossos Termos de Uso e Política de Privacidade
              </p>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}