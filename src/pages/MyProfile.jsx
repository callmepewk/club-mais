
import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Crown, Award, Sparkles, CheckCircle, ArrowRight,
  CreditCard, GraduationCap, Calendar, TrendingUp, User, Mail, Shield,
  Send, MessageSquare, Scan, Users, Copy, Star, Coins, MapPin, Locate,
  Edit, Trash2, Plus
} from "lucide-react";

const planDetails = {
  none: {
    name: "Sem Plano",
    color: "gray",
    benefits: ["Acesso básico à plataforma"]
  },
  light: {
    name: "Light",
    color: "blue",
    benefits: [
      "Acesso ao aplicativo localizador",
      "Busca de profissionais",
      "Visualização de avaliações"
    ]
  },
  gold: {
    name: "Gold",
    color: "yellow",
    benefits: [
      "15% de desconto na rede",
      "100 pontos mensais",
      "Agendamento prioritário",
      "Suporte por WhatsApp"
    ]
  },
  vip: {
    name: "VIP",
    color: "purple",
    benefits: [
      "25% de desconto na rede",
      "300 pontos mensais",
      "Agendamento VIP",
      "Suporte 24/7",
      "Eventos exclusivos"
    ]
  }
};

const edbeautyPlanDetails = {
  none: {
    name: "Sem Plano EdBeauty",
    color: "gray",
    benefits: []
  },
  basic: {
    name: "EdBeauty Basic",
    color: "blue",
    benefits: [
      "10 uploads por mês",
      "Acesso a cursos básicos"
    ]
  },
  pro: {
    name: "EdBeauty Pro",
    color: "indigo",
    benefits: [
      "50 uploads por mês",
      "Todos os cursos",
      "Certificados"
    ]
  },
  premium: {
    name: "EdBeauty Premium",
    color: "purple",
    benefits: [
      "Uploads ilimitados",
      "Mentoria exclusiva",
      "Ferramentas avançadas"
    ]
  }
};

export default function MyProfile() {
  const [isEditing, setIsEditing] = useState(false);
  const [editFormData, setEditFormData] = useState({});
  const [loadingLocation, setLoadingLocation] = useState(false);

  const { data: user, isLoading } = useQuery({
    queryKey: ['current-user'],
    queryFn: () => base44.auth.me(),
  });

  const { data: avatarData } = useQuery({
    queryKey: ['user-avatar', user?.email],
    queryFn: () => base44.entities.AvatarData.filter({ user_email: user?.email }, '-created_date', 1),
    enabled: !!user?.email,
    initialData: [],
  });

  const { data: myContents = [] } = useQuery({
    queryKey: ['my-edbeauty-contents', user?.email],
    queryFn: () => base44.entities.EdBeautyContent.filter({ autor_email: user?.email }, '-created_date'),
    enabled: !!user?.email && user?.tipo_usuario === 'profissional',
    initialData: [],
  });

  const userAvatar = avatarData?.[0] || null;

  const queryClient = useQueryClient();

  const updateProfileMutation = useMutation({
    mutationFn: (data) => base44.auth.updateMe(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['current-user'] });
      setIsEditing(false);
      alert('Perfil atualizado com sucesso!');
    },
    onError: (error) => {
      console.error("Error updating profile:", error);
      alert('Erro ao atualizar perfil. Tente novamente.');
    }
  });

  const deleteContentMutation = useMutation({
    mutationFn: (id) => base44.entities.EdBeautyContent.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-edbeauty-contents'] });
      queryClient.invalidateQueries({ queryKey: ['edbeauty-contents'] });
      alert('Conteúdo excluído com sucesso!');
    },
    onError: (error) => {
      console.error("Error deleting content:", error);
      alert('Erro ao excluir conteúdo. Tente novamente.');
    }
  });

  const userType = user?.tipo_usuario || 'paciente';
  const clubePlano = user?.clube_plano || 'none';
  const edbeautyPlano = user?.edbeauty_plano || 'none';
  const pontosClube = user?.pontos_clube || 0;
  const beautyCoins = user?.beauty_coins || 0;
  
  const clubePlanInfo = planDetails[clubePlano];
  const edbeautyPlanInfo = edbeautyPlanDetails[edbeautyPlano];

  // Gerar link de convite
  const inviteLink = `${window.location.origin}${createPageUrl("Home")}?ref=${user?.id || ''}`;

  const handleCopyInviteLink = () => {
    navigator.clipboard.writeText(inviteLink);
    alert('Link de convite copiado!');
  };

  const handleEditProfile = () => {
    setEditFormData({
      full_name: user?.full_name || '',
      telefone: user?.telefone || '',
      whatsapp: user?.whatsapp || '',
      cpf: user?.cpf || '',
      endereco: user?.endereco || '',
      numero: user?.numero || '',
      complemento: user?.complemento || '',
      bairro: user?.bairro || '',
      cidade: user?.cidade || '',
      estado: user?.estado || '',
      pais: user?.pais || 'Brasil',
      cep: user?.cep || '',
      data_nascimento: user?.data_nascimento ? new Date(user.data_nascimento).toISOString().split('T')[0] : '', // Format date for input type="date"
    });
    setIsEditing(true);
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

            setEditFormData(prev => ({
              ...prev,
              endereco: data.address.road || '',
              numero: data.address.house_number || '',
              bairro: data.address.suburb || data.address.neighbourhood || '',
              cidade: data.address.city || data.address.town || data.address.village || '',
              estado: data.address.state || '',
              pais: data.address.country || 'Brasil',
              cep: data.address.postcode || '',
            }));
          } catch (error) {
            console.error('Erro ao obter endereço a partir da localização:', error);
            alert('Não foi possível obter o endereço. Por favor, preencha manualmente.');
          }
          setLoadingLocation(false);
        },
        (error) => {
          console.error('Erro de geolocalização:', error);
          alert('Não foi possível obter sua localização. Verifique as permissões do navegador.');
          setLoadingLocation(false);
        }
      );
    } else {
      alert('Geolocalização não é suportada pelo seu navegador.');
      setLoadingLocation(false);
    }
  };

  const handleSaveProfile = () => {
    updateProfileMutation.mutate(editFormData);
  };

  const handleDeleteContent = (content) => {
    if (confirm(`Deseja realmente excluir "${content.titulo}"?`)) {
      deleteContentMutation.mutate(content.id);
    }
  };

  const [supportForm, setSupportForm] = useState({
    title: "",
    description: ""
  });

  const sendSupportEmail = useMutation({
    mutationFn: async (data) => {
      const emailBody = `
        <h2>Nova Solicitação de Suporte</h2>
        <hr/>
        <p><strong>De:</strong> ${user?.full_name || 'N/A'} (${user?.email || 'N/A'})</p>
        <p><strong>Tipo de Usuário:</strong> ${userType === 'profissional' ? 'Profissional' : 'Paciente'}</p>
        <p><strong>Plano Club:</strong> ${clubePlanInfo.name}</p>
        ${userType === 'profissional' ? `<p><strong>Plano EdBeauty:</strong> ${edbeautyPlanInfo.name}</p>` : ''}
        <hr/>
        <h3>Título: ${data.title}</h3>
        <p><strong>Descrição:</strong></p>
        <p>${data.description}</p>
        <hr/>
        <p><small>Data: ${new Date().toLocaleString('pt-BR')}</small></p>
      `;
      return base44.integrations.Core.SendEmail({
        to: "pedro_hbfreitas@hotmail.com",
        subject: `[Suporte] ${data.title} - ${user?.full_name || 'Usuário Desconhecido'}`,
        body: emailBody
      });
    },
    onSuccess: () => {
      alert('Mensagem enviada com sucesso! Nossa equipe entrará em contato em breve.');
      setSupportForm({ title: "", description: "" });
    },
    onError: (error) => {
      console.error("Error sending support email:", error);
      alert('Erro ao enviar mensagem. Tente novamente.');
    }
  });

  const handleSupportSubmit = (e) => {
    e.preventDefault();
    if (!supportForm.title || !supportForm.description) {
      alert('Por favor, preencha o título e a descrição.');
      return;
    }
    sendSupportEmail.mutate(supportForm);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-[#F5EFE6] to-white">
      {/* Hero Section */}
      <div className="relative py-20 px-6 overflow-hidden bg-gradient-to-br from-white via-[#F5EFE6] to-[#E8DCC4]">
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0] }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute -top-24 -right-24 w-96 h-96 bg-gradient-to-br from-[#D4AF37]/10 to-transparent rounded-full blur-3xl"
          />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center space-y-6"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full border border-[#D4AF37]/20 shadow-lg">
              <User className="w-4 h-4 text-[#D4AF37]" />
              <span className="text-sm font-medium text-[#C8A882]">
                Meu Perfil
              </span>
            </div>

            <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl font-bold">
              <span className="text-gray-800">Olá,</span>
              <br />
              <span className="bg-gradient-to-r from-[#D4AF37] to-[#C8A882] bg-clip-text text-transparent">
                {user?.full_name || 'Visitante'}
              </span>
            </h1>

            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Gerencie suas informações e aproveite todos os benefícios
            </p>
          </motion.div>
        </div>
      </div>

      {/* Loading State */}
      {isLoading ? (
        <div className="py-20 px-6 text-center">
          <div className="animate-spin w-12 h-12 border-4 border-[#D4AF37] border-t-transparent rounded-full mx-auto"></div>
          <p className="text-gray-600 mt-4">Carregando informações...</p>
        </div>
      ) : (
        <div className="py-20 px-6">
          <div className="max-w-5xl mx-auto space-y-8">
            {/* User Info Card with Edit */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <Card className="border-[#E8DCC4] shadow-xl overflow-hidden">
                <div className="bg-gradient-to-r from-[#D4AF37] to-[#C8A882] p-6">
                  <div className="flex items-center justify-between text-white">
                    <div className="flex items-center gap-4">
                      <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-4xl font-bold">
                        {user?.full_name?.charAt(0).toUpperCase() || 'U'}
                      </div>
                      <div>
                        <h2 className="font-serif text-3xl font-bold">
                          {user?.full_name || 'Usuário'}
                        </h2>
                        <div className="flex items-center gap-2 mt-1">
                          <Mail className="w-4 h-4" />
                          <span className="text-white/90">{user?.email}</span>
                        </div>
                      </div>
                    </div>
                    <Button
                      onClick={handleEditProfile}
                      variant="ghost"
                      className="text-white hover:bg-white/20"
                    >
                      <User className="w-4 h-4 mr-2" />
                      Editar Perfil
                    </Button>
                  </div>
                </div>

                <CardContent className="p-8">
                  {isEditing ? (
                    <div className="space-y-6">
                      <h3 className="font-semibold text-gray-800 text-lg flex items-center gap-2">
                        <User className="w-5 h-5 text-[#D4AF37]" />
                        Informações Pessoais
                      </h3>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Nome Completo</Label>
                          <Input
                            value={editFormData.full_name}
                            onChange={(e) => setEditFormData({...editFormData, full_name: e.target.value})}
                            className="border-[#E8DCC4]"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Telefone/WhatsApp</Label>
                          <Input
                            value={editFormData.telefone}
                            onChange={(e) => {
                              setEditFormData({
                                ...editFormData,
                                telefone: e.target.value,
                                whatsapp: e.target.value
                              });
                            }}
                            className="border-[#E8DCC4]"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>CPF</Label>
                          <Input
                            value={editFormData.cpf}
                            onChange={(e) => setEditFormData({...editFormData, cpf: e.target.value})}
                            placeholder="000.000.000-00"
                            className="border-[#E8DCC4]"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Data de Nascimento</Label>
                          <Input
                            type="date"
                            value={editFormData.data_nascimento}
                            onChange={(e) => setEditFormData({...editFormData, data_nascimento: e.target.value})}
                            className="border-[#E8DCC4]"
                          />
                        </div>
                      </div>

                      <div className="pt-4 border-t border-[#E8DCC4]">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="font-semibold text-gray-800 text-lg flex items-center gap-2">
                            <MapPin className="w-5 h-5 text-[#D4AF37]" />
                            Localização
                          </h3>
                          <Button
                            type="button"
                            onClick={getUserLocation}
                            disabled={loadingLocation}
                            variant="outline"
                            size="sm"
                            className="border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37]/10 hover:text-[#D4AF37]"
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
                            <Label>Endereço</Label>
                            <Input
                              value={editFormData.endereco}
                              onChange={(e) => setEditFormData({...editFormData, endereco: e.target.value})}
                              placeholder="Rua, Avenida..."
                              className="border-[#E8DCC4]"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Número</Label>
                            <Input
                              value={editFormData.numero}
                              onChange={(e) => setEditFormData({...editFormData, numero: e.target.value})}
                              placeholder="123"
                              className="border-[#E8DCC4]"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Complemento</Label>
                            <Input
                              value={editFormData.complemento}
                              onChange={(e) => setEditFormData({...editFormData, complemento: e.target.value})}
                              placeholder="Apto, Bloco..."
                              className="border-[#E8DCC4]"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Bairro</Label>
                            <Input
                              value={editFormData.bairro}
                              onChange={(e) => setEditFormData({...editFormData, bairro: e.target.value})}
                              placeholder="Seu bairro"
                              className="border-[#E8DCC4]"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Cidade</Label>
                            <Input
                              value={editFormData.cidade}
                              onChange={(e) => setEditFormData({...editFormData, cidade: e.target.value})}
                              placeholder="Sua cidade"
                              className="border-[#E8DCC4]"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Estado</Label>
                            <Input
                              value={editFormData.estado}
                              onChange={(e) => setEditFormData({...editFormData, estado: e.target.value})}
                              placeholder="UF"
                              maxLength={2}
                              className="border-[#E8DCC4]"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>País</Label>
                            <Input
                              value={editFormData.pais}
                              onChange={(e) => setEditFormData({...editFormData, pais: e.target.value})}
                              placeholder="Brasil"
                              className="border-[#E8DCC4]"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>CEP</Label>
                            <Input
                              value={editFormData.cep}
                              onChange={(e) => setEditFormData({...editFormData, cep: e.target.value})}
                              placeholder="00000-000"
                              className="border-[#E8DCC4]"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-3 justify-end pt-4">
                        <Button
                          variant="outline"
                          onClick={() => setIsEditing(false)}
                          className="border-[#E8DCC4]"
                        >
                          Cancelar
                        </Button>
                        <Button
                          onClick={handleSaveProfile}
                          disabled={updateProfileMutation.isPending}
                          className="bg-gradient-to-r from-[#D4AF37] to-[#C8A882] text-white"
                        >
                          {updateProfileMutation.isPending ? 'Salvando...' : 'Salvar Alterações'}
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      <div className="grid md:grid-cols-3 gap-6">
                        <div className="text-center p-4 bg-[#F5EFE6] rounded-xl">
                          <Shield className="w-8 h-8 text-[#D4AF37] mx-auto mb-2" />
                          <p className="text-sm text-gray-600">Tipo de Conta</p>
                          <p className="text-lg font-bold text-gray-800">
                            {userType === 'profissional' ? 'Profissional' : 'Paciente'}
                          </p>
                        </div>

                        <div className="text-center p-4 bg-[#F5EFE6] rounded-xl">
                          <Award className="w-8 h-8 text-[#D4AF37] mx-auto mb-2" />
                          <p className="text-sm text-gray-600">Plano Club</p>
                          <p className="text-lg font-bold text-gray-800">
                            {clubePlanInfo.name}
                          </p>
                        </div>

                        <div className="text-center p-4 bg-[#F5EFE6] rounded-xl">
                          <Calendar className="w-8 h-8 text-[#D4AF37] mx-auto mb-2" />
                          <p className="text-sm text-gray-600">Membro desde</p>
                          <p className="text-lg font-bold text-gray-800">
                            {user?.created_date ? new Date(user.created_date).toLocaleDateString('pt-BR') : '-'}
                          </p>
                        </div>
                      </div>

                      {(user?.telefone || user?.cpf || user?.endereco || user?.cidade) && (
                        <div className="pt-4 border-t border-[#E8DCC4]">
                          <h3 className="font-semibold text-gray-800 mb-4">Informações de Contato</h3>
                          <div className="grid md:grid-cols-2 gap-4">
                            {user?.telefone && (
                              <div className="p-3 bg-[#F5EFE6] rounded-lg">
                                <p className="text-xs text-gray-600 mb-1">Telefone/WhatsApp</p>
                                <p className="font-semibold text-gray-800">{user.telefone}</p>
                              </div>
                            )}
                            {user?.cpf && (
                              <div className="p-3 bg-[#F5EFE6] rounded-lg">
                                <p className="text-xs text-gray-600 mb-1">CPF</p>
                                <p className="font-semibold text-gray-800">{user.cpf}</p>
                              </div>
                            )}
                          </div>
                          
                          {(user?.endereco || user?.numero || user?.complemento || user?.bairro || user?.cidade || user?.estado || user?.cep) && (
                            <div className="mt-4 p-4 bg-[#F5EFE6] rounded-lg">
                              <p className="text-xs text-gray-600 mb-2">Endereço Completo</p>
                              <p className="font-semibold text-gray-800">
                                {[
                                  user?.endereco,
                                  user?.numero,
                                  user?.complemento,
                                  user?.bairro,
                                  user?.cidade,
                                  user?.estado,
                                  user?.cep
                                ].filter(Boolean).join(', ')}
                              </p>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>

            {/* Pontos e Beauty Coins */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.05 }}
            >
              <Card className="border-[#E8DCC4] shadow-xl bg-gradient-to-br from-white to-[#F5EFE6]">
                <CardContent className="p-8">
                  <h3 className="font-serif text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                    <Sparkles className="w-6 h-6 text-[#D4AF37]" />
                    Meus Pontos e Coins
                  </h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="text-center p-6 bg-white rounded-xl border-2 border-[#D4AF37]/20">
                      <Star className="w-12 h-12 text-[#D4AF37] mx-auto mb-3" />
                      <p className="text-sm text-gray-600 mb-1">Pontos do Clube</p>
                      <p className="text-4xl font-bold bg-gradient-to-r from-[#D4AF37] to-[#C8A882] bg-clip-text text-transparent">
                        {pontosClube.toLocaleString('pt-BR')}
                      </p>
                    </div>
                    <div className="text-center p-6 bg-white rounded-xl border-2 border-[#D4AF37]/20">
                      <Coins className="w-12 h-12 text-[#D4AF37] mx-auto mb-3" />
                      <p className="text-sm text-gray-600 mb-1">Beauty Coins</p>
                      <p className="text-4xl font-bold bg-gradient-to-r from-[#D4AF37] to-[#C8A882] bg-clip-text text-transparent">
                        {beautyCoins.toLocaleString('pt-BR')}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Link de Convite */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
            >
              <Card className="border-[#E8DCC4] shadow-xl">
                <CardHeader className="bg-gradient-to-r from-[#F5EFE6] to-[#E8DCC4]">
                  <CardTitle className="font-serif text-2xl text-gray-800 flex items-center gap-2">
                    <Users className="w-6 h-6 text-[#D4AF37]" />
                    Convide Amigos
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-8 space-y-4">
                  <p className="text-gray-600">
                    Compartilhe seu link de convite e ganhe pontos e Beauty Coins quando seus amigos se cadastrarem!
                  </p>
                  <div className="flex gap-3">
                    <Input
                      value={inviteLink}
                      readOnly
                      className="border-[#E8DCC4] bg-[#F5EFE6]"
                    />
                    <Button
                      onClick={handleCopyInviteLink}
                      className="bg-gradient-to-r from-[#D4AF37] to-[#C8A882] text-white flex-shrink-0"
                    >
                      <Copy className="w-4 h-4 mr-2" />
                      Copiar
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* My Avatar Card */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.15 }}
            >
              <Card className="border-[#E8DCC4] shadow-xl">
                <CardHeader className="bg-gradient-to-r from-[#F5EFE6] to-[#E8DCC4]">
                  <CardTitle className="font-serif text-2xl text-gray-800 flex items-center gap-2">
                    <User className="w-6 h-6 text-[#D4AF37]" />
                    Meu Avatar
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-8">
                  {userAvatar ? (
                    <div className="space-y-6">
                      <div className="flex flex-col md:flex-row gap-6 items-center">
                        {userAvatar.avatar_thumbnail ? (
                          <div className="relative w-64 h-64 rounded-2xl overflow-hidden shadow-2xl border-4 border-[#E8DCC4]">
                            <img
                              src={userAvatar.avatar_thumbnail}
                              alt="Meu Avatar"
                              className="w-full h-full object-cover"
                            />
                          </div>
                        ) : (
                          <div className="w-64 h-64 bg-gradient-to-br from-[#F5EFE6] to-[#E8DCC4] rounded-2xl flex items-center justify-center border-4 border-[#E8DCC4]">
                            <User className="w-32 h-32 text-[#D4AF37] opacity-50" />
                          </div>
                        )}
                        
                        <div className="flex-1 space-y-4">
                          <h3 className="font-serif text-2xl font-bold text-gray-800">
                            Avatar Criado com Sucesso!
                          </h3>
                          <p className="text-gray-600">
                            Seu avatar foi criado usando tecnologia de IA avançada. Você pode visualizá-lo e atualizá-lo a qualquer momento.
                          </p>
                          
                          <div className="grid grid-cols-2 gap-3 text-sm">
                            <div className="p-3 bg-[#F5EFE6] rounded-lg">
                              <p className="text-gray-600 text-xs mb-1">Largura</p>
                              <p className="font-bold text-gray-800">{userAvatar.meta_width || 'N/A'}px</p>
                            </div>
                            <div className="p-3 bg-[#F5EFE6] rounded-lg">
                              <p className="text-gray-600 text-xs mb-1">Altura</p>
                              <p className="font-bold text-gray-800">{userAvatar.meta_height || 'N/A'}px</p>
                            </div>
                          </div>

                          {userAvatar.capture_timestamp && (
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <Calendar className="w-4 h-4 text-[#D4AF37]" />
                              <span>Criado em: {new Date(userAvatar.capture_timestamp).toLocaleDateString('pt-BR')}</span>
                            </div>
                          )}

                          <Link to={createPageUrl("DrBeleza")} className="block">
                            <Button className="w-full bg-gradient-to-r from-[#D4AF37] to-[#C8A882] text-white">
                              <Sparkles className="w-4 h-4 mr-2" />
                              Atualizar Avatar
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <div className="w-32 h-32 mx-auto bg-gradient-to-br from-[#F5EFE6] to-[#E8DCC4] rounded-full flex items-center justify-center mb-6">
                        <User className="w-16 h-16 text-[#D4AF37] opacity-50" />
                      </div>
                      <h3 className="font-serif text-xl font-bold text-gray-800 mb-2">
                        Você ainda não criou seu avatar
                      </h3>
                      <p className="text-gray-600 mb-6">
                        Crie seu avatar personalizado usando nossa tecnologia de IA
                      </p>
                      <Link to={createPageUrl("DrBeleza")}>
                        <Button className="bg-gradient-to-r from-[#D4AF37] to-[#C8A882] text-white">
                          <Scan className="w-4 h-4 mr-2" />
                          Criar Meu Avatar
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                      </Link>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>

            {/* Club da Beleza Plan */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
            >
              <Card className="border-[#E8DCC4] shadow-xl">
                <CardHeader className="bg-gradient-to-r from-[#F5EFE6] to-[#E8DCC4]">
                  <CardTitle className="font-serif text-2xl text-gray-800 flex items-center gap-2">
                    <Crown className="w-6 h-6 text-[#D4AF37]" />
                    Plano Club da Beleza
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-8">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h3 className="text-2xl font-bold text-gray-800">{clubePlanInfo.name}</h3>
                      <p className="text-gray-600">Plano atual</p>
                    </div>
                    {clubePlano !== 'vip' && (
                      <Link to={createPageUrl("Join")}>
                        <Button className="bg-gradient-to-r from-[#D4AF37] to-[#C8A882] text-white">
                          <TrendingUp className="w-4 h-4 mr-2" />
                          Fazer Upgrade
                        </Button>
                      </Link>
                    )}
                  </div>

                  <div className="space-y-3">
                    <p className="font-semibold text-gray-700">Benefícios inclusos:</p>
                    {clubePlanInfo.benefits.map((benefit, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <CheckCircle className="w-5 h-5 text-[#D4AF37]" />
                        <span className="text-gray-600">{benefit}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* EdBeauty Plan (for professionals) */}
            {userType === 'profissional' && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <Card className="border-[#E8DCC4] shadow-xl">
                  <CardHeader className="bg-gradient-to-r from-[#F5EFE6] to-[#E8DCC4]">
                    <CardTitle className="font-serif text-2xl text-gray-800 flex items-center gap-2">
                      <GraduationCap className="w-6 h-6 text-[#D4AF37]" />
                      Plano EdBeauty
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-8">
                    <div className="flex items-center justify-between mb-6">
                      <div>
                        <h3 className="text-2xl font-bold text-gray-800">{edbeautyPlanInfo.name}</h3>
                        <p className="text-gray-600">Plano atual</p>
                      </div>
                      {edbeautyPlano !== 'premium' && (
                        <Link to={createPageUrl("EdBeautyPlans")}>
                          <Button className="bg-gradient-to-r from-[#D4AF37] to-[#C8A882] text-white">
                            <TrendingUp className="w-4 h-4 mr-2" />
                            Fazer Upgrade
                          </Button>
                        </Link>
                      )}
                    </div>

                    {edbeautyPlanInfo.benefits.length > 0 ? (
                      <div className="space-y-3">
                        <p className="font-semibold text-gray-700">Benefícios inclusos:</p>
                        {edbeautyPlanInfo.benefits.map((benefit, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <CheckCircle className="w-5 h-5 text-[#D4AF37]" />
                            <span className="text-gray-600">{benefit}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <p className="text-gray-600 mb-4">Você ainda não tem um plano EdBeauty</p>
                        <Link to={createPageUrl("EdBeautyPlans")}>
                          <Button className="bg-gradient-to-r from-[#D4AF37] to-[#C8A882] text-white">
                            Ver Planos EdBeauty
                            <ArrowRight className="w-4 h-4 ml-2" />
                          </Button>
                        </Link>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* My EdBeauty Contents (for professionals) */}
            {userType === 'profissional' && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.25 }}
              >
                <Card className="border-[#E8DCC4] shadow-xl">
                  <CardHeader className="bg-gradient-to-r from-[#F5EFE6] to-[#E8DCC4]">
                    <div className="flex items-center justify-between">
                      <CardTitle className="font-serif text-2xl text-gray-800 flex items-center gap-2">
                        <GraduationCap className="w-6 h-6 text-[#D4AF37]" />
                        Meus Conteúdos EdBeauty
                      </CardTitle>
                      <Link to={createPageUrl("EdBeautyCreateContent")}>
                        <Button className="bg-gradient-to-r from-[#D4AF37] to-[#C8A882] text-white">
                          <Plus className="w-4 h-4 mr-2" />
                          Adicionar
                        </Button>
                      </Link>
                    </div>
                  </CardHeader>
                  <CardContent className="p-8">
                    {myContents.length === 0 ? (
                      <div className="text-center py-12">
                        <GraduationCap className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-600 mb-4">
                          Você ainda não publicou nenhum conteúdo
                        </p>
                        <Link to={createPageUrl("EdBeautyCreateContent")}>
                          <Button className="bg-gradient-to-r from-[#D4AF37] to-[#C8A882] text-white">
                            <Plus className="w-4 h-4 mr-2" />
                            Criar Primeiro Conteúdo
                          </Button>
                        </Link>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {myContents.map((content) => (
                          <div
                            key={content.id}
                            className="flex items-center gap-4 p-4 border border-[#E8DCC4] rounded-xl hover:border-[#D4AF37] transition-all"
                          >
                            {content.thumbnail && (
                              <img
                                src={content.thumbnail}
                                alt={content.titulo}
                                className="w-24 h-24 object-cover rounded-lg flex-shrink-0"
                              />
                            )}
                            
                            <div className="flex-1 min-w-0">
                              <h3 className="font-serif text-lg font-bold text-gray-800 mb-1 truncate">
                                {content.titulo}
                              </h3>
                              <div className="flex flex-wrap gap-2 mb-2">
                                <Badge className="bg-blue-100 text-blue-800 text-xs">
                                  {content.tipo}
                                </Badge>
                                <Badge className="bg-purple-100 text-purple-800 text-xs">
                                  {content.categoria === 'Outros' && content.categoria_outros ? content.categoria_outros : content.categoria}
                                </Badge>
                                <Badge className="bg-green-100 text-green-800 text-xs">
                                  {content.tipo_acesso}
                                </Badge>
                              </div>
                              <p className="text-sm text-gray-600 line-clamp-2">
                                {content.descricao}
                              </p>
                            </div>

                            <div className="flex gap-2 flex-shrink-0">
                              <Link to={createPageUrl("EdBeautyEditContent") + `?id=${content.id}`}>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="border-[#D4AF37] text-[#D4AF37]"
                                >
                                  <Edit className="w-4 h-4" />
                                </Button>
                              </Link>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleDeleteContent(content)}
                                disabled={deleteContentMutation.isPending}
                                className="border-red-500 text-red-500 hover:bg-red-50"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Summary Stats */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              <Card className="border-[#E8DCC4] shadow-xl bg-gradient-to-br from-white to-[#F5EFE6]">
                <CardContent className="p-8">
                  <h3 className="font-serif text-xl font-bold text-gray-800 mb-6">
                    Resumo da Conta
                  </h3>
                  <div className="grid md:grid-cols-4 gap-6">
                    <div className="text-center">
                      <div className="text-3xl font-bold bg-gradient-to-r from-[#D4AF37] to-[#C8A882] bg-clip-text text-transparent">
                        {clubePlano === 'none' ? '0%' : clubePlano === 'light' ? '5%' : clubePlano === 'gold' ? '15%' : '25%'}
                      </div>
                      <p className="text-sm text-gray-600 mt-1">Desconto Disponível</p>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold bg-gradient-to-r from-[#D4AF37] to-[#C8A882] bg-clip-text text-transparent">
                        {pontosClube.toLocaleString('pt-BR')}
                      </div>
                      <p className="text-sm text-gray-600 mt-1">Pontos Acumulados</p>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold bg-gradient-to-r from-[#D4AF37] to-[#C8A882] bg-clip-text text-transparent">
                        {beautyCoins.toLocaleString('pt-BR')}
                      </div>
                      <p className="text-sm text-gray-600 mt-1">Beauty Coins</p>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold bg-gradient-to-r from-[#D4AF37] to-[#C8A882] bg-clip-text text-transparent">
                        {userType === 'profissional' ? 'Profissional' : 'Paciente'}
                      </div>
                      <p className="text-sm text-gray-600 mt-1">Tipo de Conta</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Support Section */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <Card className="border-[#E8DCC4] shadow-xl">
                <CardHeader className="bg-gradient-to-r from-[#F5EFE6] to-[#E8DCC4]">
                  <CardTitle className="font-serif text-2xl text-gray-800 flex items-center gap-2">
                    <MessageSquare className="w-6 h-6 text-[#D4AF37]" />
                    Suporte
                  </CardTitle>
                  <p className="text-gray-600 mt-2">
                    Precisa de ajuda? Entre em contato conosco
                  </p>
                </CardHeader>
                <CardContent className="p-8">
                  <form onSubmit={handleSupportSubmit} className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="support-title" className="text-gray-700">
                        Título
                      </Label>
                      <Input
                        id="support-title"
                        value={supportForm.title}
                        onChange={(e) => setSupportForm(prev => ({ ...prev, title: e.target.value }))}
                        placeholder="Resumo do problema ou dúvida"
                        className="border-[#E8DCC4] focus:border-[#D4AF37]"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="support-description" className="text-gray-700">
                        Descrição
                      </Label>
                      <Textarea
                        id="support-description"
                        value={supportForm.description}
                        onChange={(e) => setSupportForm(prev => ({ ...prev, description: e.target.value }))}
                        placeholder="Descreva detalhadamente seu problema ou dúvida"
                        className="border-[#E8DCC4] focus:border-[#D4AF37] min-h-[150px]"
                        required
                      />
                    </div>

                    <div className="bg-[#F5EFE6] rounded-lg p-4">
                      <p className="text-sm text-gray-700">
                        <strong>Email de suporte:</strong> pedro_hbfreitas@hotmail.com
                      </p>
                      <p className="text-xs text-gray-600 mt-2">
                        Responderemos sua solicitação o mais breve possível
                      </p>
                    </div>

                    <Button
                      type="submit"
                      disabled={sendSupportEmail.isPending}
                      className="w-full bg-gradient-to-r from-[#D4AF37] to-[#C8A882] text-white py-6 text-lg font-semibold"
                    >
                      {sendSupportEmail.isPending ? (
                        <>
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" />
                          Enviando...
                        </>
                      ) : (
                        <>
                          <Send className="w-5 h-5 mr-2" />
                          Enviar Mensagem
                        </>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      )}
    </div>
  );
}
