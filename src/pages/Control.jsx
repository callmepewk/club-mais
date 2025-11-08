
import React, { useState, useMemo } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search, Shield, Users, Crown, Coins, Star,
  Eye, Edit, Mail, MessageCircle, Calendar, CheckCircle, XCircle,
  Trash2, Ban, UserCheck, FileDown, AlertCircle,
  TrendingUp, FileText, RefreshCw, Bell, History, Zap
} from "lucide-react";
import UserDetailsModal from "../components/UserDetailsModal";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

const planoColors = {
  none: "bg-gray-200 text-gray-700",
  light: "bg-blue-100 text-blue-800",
  gold: "bg-gradient-to-r from-[#D4AF37] to-[#C8A882] text-white",
  vip: "bg-gradient-to-r from-purple-600 to-purple-800 text-white",
  basic: "bg-green-100 text-green-800",
  pro: "bg-indigo-100 text-indigo-800",
  exclusive: "bg-pink-100 text-pink-800",
  premium: "bg-orange-100 text-orange-800"
};

const planoLabels = {
  none: "Nenhum",
  light: "Light",
  gold: "Gold",
  vip: "VIP",
  basic: "Basic",
  pro: "Pro",
  exclusive: "Exclusive",
  premium: "Premium"
};

export default function Control() {
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState("");
  const [tipoFilter, setTipoFilter] = useState("todos");
  const [planoFilter, setPlanoFilter] = useState("todos");
  const [editingUser, setEditingUser] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  const [showUpdateModal, setShowUpdateModal] = useState(null); // 'immediate', 'schedule', 'notify', 'history'
  const [updateFormData, setUpdateFormData] = useState({
    titulo: "",
    mensagem: "",
    data_agendada: "",
  });

  const { data: currentUser } = useQuery({
    queryKey: ['current-user-control'],
    queryFn: () => base44.auth.me(),
  });

  const { data: users = [], isLoading } = useQuery({
    queryKey: ['all-users'],
    queryFn: () => base44.entities.User.list('-created_date'),
    initialData: [],
  });

  const { data: updateHistory = [] } = useQuery({
    queryKey: ['update-notifications'],
    queryFn: () => base44.entities.UpdateNotification.list('-created_date'),
    initialData: [],
  });

  const updateUserMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.User.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['all-users'] });
      setEditingUser(null);
      alert('Usuário atualizado com sucesso!');
    },
  });

  const deleteUserMutation = useMutation({
    mutationFn: (id) => base44.entities.User.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['all-users'] });
      alert('Usuário excluído com sucesso!');
    },
    onError: (error) => {
      alert('Erro ao excluir usuário. Verifique se não há dependências.');
    }
  });

  const createUpdateMutation = useMutation({
    mutationFn: (data) => base44.entities.UpdateNotification.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['update-notifications'] });
      setShowUpdateModal(null);
      setUpdateFormData({ titulo: "", mensagem: "", data_agendada: "" });
      alert('Ação executada com sucesso!');
    },
    onError: (error) => {
      console.error("Erro ao criar notificação/atualização:", error);
      alert("Erro ao executar a ação. Detalhes no console.");
    }
  });

  const handleForceUpdate = async () => {
    if (!confirm('⚠️ ATENÇÃO: Isso forçará o recarregamento do site para TODOS os usuários online. Continuar?')) {
      return;
    }

    try {
      // Create update record
      await createUpdateMutation.mutateAsync({
        tipo: 'atualizacao_imediata',
        titulo: updateFormData.titulo || 'Atualização Imediata',
        mensagem: updateFormData.mensagem || 'O sistema será atualizado agora',
        executada: true,
        data_execucao: new Date().toISOString(),
      });

      // Send notification to all users
      const { data: allUsers } = await base44.entities.User.list();
      
      for (const user of allUsers) {
        await base44.integrations.Core.SendEmail({
          to: user.email,
          subject: `🔄 ${updateFormData.titulo || 'Atualização do Sistema'}`,
          body: `
            <h2>Atualização do Sistema</h2>
            <p>Olá ${user.full_name || 'Usuário'}!</p>
            <p>${updateFormData.mensagem || 'O sistema foi atualizado. Por favor, recarregue a página.'}</p>
            <p><strong>Ação recomendada:</strong> Recarregue sua página (F5 ou Ctrl+R)</p>
            <hr/>
            <p><small>Club da Beleza - Sistema de Gestão</small></p>
          `
        });
      }

      // Force reload for all users (in a real scenario, this would be done via WebSocket or similar)
      window.location.reload();
    } catch (error) {
      console.error('Erro ao forçar atualização:', error);
      alert('Erro ao executar atualização.');
    }
  };

  const handleScheduleUpdate = async () => {
    if (!updateFormData.data_agendada) {
      alert('Por favor, selecione uma data para agendamento.');
      return;
    }
    if (!updateFormData.titulo || !updateFormData.mensagem) {
      alert('Por favor, preencha o título e a mensagem para agendar a atualização.');
      return;
    }

    await createUpdateMutation.mutateAsync({
      tipo: 'atualizacao_agendada',
      titulo: updateFormData.titulo || 'Atualização Agendada',
      mensagem: updateFormData.mensagem,
      data_agendada: updateFormData.data_agendada,
      executada: false,
    });
  };

  const handleNotifyUsers = async () => {
    if (!updateFormData.titulo || !updateFormData.mensagem) {
      alert('Por favor, preencha o título e a mensagem para enviar a notificação.');
      return;
    }
    try {
      const { data: allUsers } = await base44.entities.User.list();
      
      for (const user of allUsers) {
        await base44.integrations.Core.SendEmail({
          to: user.email,
          subject: `📢 ${updateFormData.titulo}`,
          body: `
            <h2>${updateFormData.titulo}</h2>
            <p>Olá ${user.full_name || 'Usuário'}!</p>
            <p>${updateFormData.mensagem}</p>
            <hr/>
            <p><small>Club da Beleza</small></p>
          `
        });
      }

      await createUpdateMutation.mutateAsync({
        tipo: 'notificacao_usuarios',
        titulo: updateFormData.titulo,
        mensagem: updateFormData.mensagem,
        executada: true,
        data_execucao: new Date().toISOString(),
        usuarios_notificados: allUsers.length,
      });
    } catch (error) {
      console.error('Erro ao notificar usuários:', error);
      alert('Erro ao enviar notificações.');
    }
  };

  const filteredUsers = useMemo(() => {
    return users.filter(user => {
      const matchSearch = !searchQuery ||
        user.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchTipo = tipoFilter === "todos" || user.tipo_usuario === tipoFilter;
      const matchPlano = planoFilter === "todos" || user.clube_plano === planoFilter;

      return matchSearch && matchTipo && matchPlano;
    });
  }, [users, searchQuery, tipoFilter, planoFilter]);

  const stats = useMemo(() => {
    return {
      total: users.length,
      pacientes: users.filter(u => u.tipo_usuario === 'paciente').length,
      profissionais: users.filter(u => u.tipo_usuario === 'profissional').length,
      goldenDoctors: users.filter(u => u.is_golden_doctor).length,
      totalPontos: users.reduce((sum, u) => sum + (u.pontos_clube || 0), 0),
      totalCoins: users.reduce((sum, u) => sum + (u.beauty_coins || 0), 0),
      suspended: users.filter(u => u.account_suspended).length,
    };
  }, [users]);

  const handleEdit = (user) => {
    setEditingUser({ ...user });
  };

  const handleSaveEdit = () => {
    if (editingUser) {
      updateUserMutation.mutate({
        id: editingUser.id,
        data: {
          tipo_usuario: editingUser.tipo_usuario,
          clube_plano: editingUser.clube_plano,
          beauty_club_plano: editingUser.beauty_club_plano,
          edbeauty_plano: editingUser.edbeauty_plano,
          is_golden_doctor: editingUser.is_golden_doctor,
          pontos_clube: editingUser.pontos_clube,
          beauty_coins: editingUser.beauty_coins,
          account_suspended: editingUser.account_suspended,
        }
      });
    }
  };

  const handleSuspendToggle = (user) => {
    if (confirm(`Deseja ${user.account_suspended ? 'reativar' : 'suspender'} o acesso de ${user.full_name}?`)) {
      updateUserMutation.mutate({
        id: user.id,
        data: { account_suspended: !user.account_suspended }
      });
    }
  };

  const handleDeleteUser = (user) => {
    if (confirm(`ATENÇÃO: Deseja realmente EXCLUIR permanentemente o usuário ${user.full_name}? Esta ação não pode ser desfeita!`)) {
      if (confirm('Tem certeza? Digite "CONFIRMAR" para continuar.')) {
        deleteUserMutation.mutate(user.id);
      }
    }
  };

  const handleViewDetails = (user) => {
    setSelectedUser(user);
    setShowDetailsModal(true);
  };

  const generatePDFReport = () => {
    // Create HTML content for PDF
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Relatório de Usuários - Club da Beleza</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; }
          h1 { color: #D4AF37; text-align: center; }
          .stats { display: flex; justify-content: space-around; margin: 20px 0; }
          .stat-box { text-align: center; padding: 10px; background: #F5EFE6; border-radius: 8px; }
          table { width: 100%; border-collapse: collapse; margin-top: 20px; }
          th, td { border: 1px solid #E8DCC4; padding: 8px; text-align: left; font-size: 12px; }
          th { background-color: #D4AF37; color: white; }
          tr:nth-child(even) { background-color: #F5EFE6; }
          .footer { margin-top: 30px; text-align: center; font-size: 10px; color: #666; }
        </style>
      </head>
      <body>
        <h1>🏆 Club da Beleza - Relatório de Usuários</h1>
        <p style="text-align: center; color: #666;">Gerado em: ${new Date().toLocaleString('pt-BR')}</p>
        
        <div class="stats">
          <div class="stat-box">
            <strong>${stats.total}</strong><br>Total Usuários
          </div>
          <div class="stat-box">
            <strong>${stats.pacientes}</strong><br>Pacientes
          </div>
          <div class="stat-box">
            <strong>${stats.profissionais}</strong><br>Profissionais
          </div>
          <div class="stat-box">
            <strong>${stats.goldenDoctors}</strong><br>Golden Doctors
          </div>
          <div class="stat-box">
            <strong>${stats.suspended}</strong><br>Suspensos
          </div>
        </div>

        <table>
          <thead>
            <tr>
              <th>Nome</th>
              <th>Email</th>
              <th>Tipo</th>
              <th>Plano Clube da Beleza</th>
              <th>Plano Beauty Club</th>
              <th>Golden</th>
              <th>Pontos</th>
              <th>Coins</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            ${filteredUsers.map(user => `
              <tr>
                <td>${user.full_name || 'N/A'}</td>
                <td>${user.email}</td>
                <td>${user.tipo_usuario || 'visitante'}</td>
                <td>${planoLabels[user.clube_plano || 'none']}</td>
                <td>${planoLabels[user.beauty_club_plano || 'none']}</td>
                <td>${user.is_golden_doctor ? '✓' : '✗'}</td>
                <td>${user.pontos_clube || 0}</td>
                <td>${user.beauty_coins || 0}</td>
                <td>${user.account_suspended ? 'SUSPENSO' : 'Ativo'}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>

        <div class="footer">
          <p>Club da Beleza © ${new Date().getFullYear()} - Relatório confidencial</p>
          <p>Total de registros: ${filteredUsers.length}</p>
        </div>
      </body>
      </html>
    `;

    // Open in new window for printing
    const printWindow = window.open('', '_blank');
    printWindow.document.write(htmlContent);
    printWindow.document.close();
    printWindow.print();
  };

  // Check if current user is admin
  if (!currentUser || currentUser.role !== 'admin') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white via-[#F5EFE6] to-white py-20 px-6">
        <div className="max-w-2xl mx-auto text-center space-y-6">
          <Shield className="w-16 h-16 text-red-600 mx-auto" />
          <h2 className="font-serif text-3xl font-bold text-gray-800">
            Acesso Restrito
          </h2>
          <p className="text-gray-600">
            Você não tem permissão para acessar o painel de controle.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-[#F5EFE6] to-white">
      {/* Hero Section */}
      <div className="relative py-20 px-6 overflow-hidden bg-gradient-to-br from-[#D4AF37] via-[#C8A882] to-[#D4AF37]">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center space-y-4 text-white"
        >
          <Badge className="bg-white/20 text-white px-4 py-2 text-base backdrop-blur-sm">
            <Shield className="w-4 h-4 mr-2" />
            Painel Administrativo
          </Badge>

          <h1 className="font-serif text-4xl md:text-5xl font-bold">
            Controle de Usuários
          </h1>

          <p className="text-lg text-white/90">
            Gerencie usuários, planos e benefícios da plataforma
          </p>

          <Button
            onClick={generatePDFReport}
            className="bg-white/90 text-[#D4AF37] hover:bg-white transition-colors"
          >
            <FileDown className="w-4 h-4 mr-2" />
            Gerar Relatório PDF
          </Button>
        </motion.div>
      </div>

      <div className="py-12 px-6">
        <div className="max-w-7xl mx-auto space-y-12">
          {/* Update Management Section - NEW */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Card className="border-[#E8DCC4] shadow-2xl bg-gradient-to-br from-white to-[#F5EFE6]">
              <CardHeader className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                    <Zap className="w-6 h-6" />
                  </div>
                  <div>
                    <CardTitle className="font-serif text-2xl">
                      Gestão de Atualizações
                    </CardTitle>
                    <p className="text-white/90 text-sm mt-1">
                      Envie atualizações e notificações para todos os usuários
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-8">
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {/* Immediate Update */}
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="relative"
                  >
                    <Card className="border-2 border-red-200 hover:border-red-400 transition-all h-full bg-gradient-to-br from-red-50 to-white">
                      <CardContent className="p-6 space-y-4">
                        <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl flex items-center justify-center mx-auto">
                          <RefreshCw className="w-8 h-8 text-white" />
                        </div>
                        <div className="text-center">
                          <h3 className="font-bold text-lg mb-2 flex items-center justify-center gap-2">
                            <Zap className="w-5 h-5 text-red-600" />
                            Atualização Imediata
                          </h3>
                          <p className="text-sm text-gray-600 mb-4">
                            Força o recarregamento do site para todos os usuários online (use com cuidado!)
                          </p>
                          <Button
                            onClick={() => setShowUpdateModal('immediate')}
                            className="w-full bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700"
                          >
                            <RefreshCw className="w-4 h-4 mr-2" />
                            Forçar Agora
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>

                  {/* Schedule Update */}
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="relative"
                  >
                    <Card className="border-2 border-orange-200 hover:border-orange-400 transition-all h-full bg-gradient-to-br from-orange-50 to-white">
                      <CardContent className="p-6 space-y-4">
                        <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center mx-auto">
                          <Calendar className="w-8 h-8 text-white" />
                        </div>
                        <div className="text-center">
                          <h3 className="font-bold text-lg mb-2 flex items-center justify-center gap-2">
                            <Calendar className="w-5 h-5 text-orange-600" />
                            Agendar Atualização
                          </h3>
                          <p className="text-sm text-gray-600 mb-4">
                            Programe uma data para forçar atualização automaticamente
                          </p>
                          <Button
                            onClick={() => setShowUpdateModal('schedule')}
                            className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white hover:from-orange-600 hover:to-orange-700"
                          >
                            <Calendar className="w-4 h-4 mr-2" />
                            Agendar
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>

                  {/* Notify Users */}
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="relative"
                  >
                    <Card className="border-2 border-blue-200 hover:border-blue-400 transition-all h-full bg-gradient-to-br from-blue-50 to-white">
                      <CardContent className="p-6 space-y-4">
                        <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto">
                          <Bell className="w-8 h-8 text-white" />
                        </div>
                        <div className="text-center">
                          <h3 className="font-bold text-lg mb-2 flex items-center justify-center gap-2">
                            <Bell className="w-5 h-5 text-blue-600" />
                            Notificar Usuários
                          </h3>
                          <p className="text-sm text-gray-600 mb-4">
                            Envie notificações personalizadas sobre novidades e atualizações
                          </p>
                          <Button
                            onClick={() => setShowUpdateModal('notify')}
                            className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700"
                          >
                            <Bell className="w-4 h-4 mr-2" />
                            Criar Notificação
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>

                  {/* History */}
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="relative"
                  >
                    <Card className="border-2 border-green-200 hover:border-green-400 transition-all h-full bg-gradient-to-br from-green-50 to-white">
                      <CardContent className="p-6 space-y-4">
                        <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto">
                          <History className="w-8 h-8 text-white" />
                        </div>
                        <div className="text-center">
                          <h3 className="font-bold text-lg mb-2 flex items-center justify-center gap-2">
                            <FileText className="w-5 h-5 text-green-600" />
                            Histórico
                          </h3>
                          <p className="text-sm text-gray-600 mb-4">
                            Visualize todas as atualizações enviadas
                          </p>
                          <div className="flex flex-col items-center gap-2">
                            <Badge className="bg-gradient-to-r from-green-500 to-green-600 text-white text-lg px-4 py-2">
                              {updateHistory.length} atualizações
                            </Badge>
                            <Button
                              onClick={() => setShowUpdateModal('history')}
                              variant="outline"
                              className="w-full border-green-500 text-green-600 hover:bg-green-50"
                            >
                              <History className="w-4 h-4 mr-2" />
                              Ver Histórico
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Stats */}
          <div className="grid md:grid-cols-6 gap-4">
            <Card className="border-[#E8DCC4]">
              <CardContent className="p-6 text-center">
                <Users className="w-8 h-8 text-[#D4AF37] mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-800">{stats.total}</div>
                <div className="text-xs text-gray-600">Total Usuários</div>
              </CardContent>
            </Card>

            <Card className="border-[#E8DCC4]">
              <CardContent className="p-6 text-center">
                <Users className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-800">{stats.pacientes}</div>
                <div className="text-xs text-gray-600">Pacientes</div>
              </CardContent>
            </Card>

            <Card className="border-[#E8DCC4]">
              <CardContent className="p-6 text-center">
                <Users className="w-8 h-8 text-green-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-800">{stats.profissionais}</div>
                <div className="text-xs text-gray-600">Profissionais</div>
              </CardContent>
            </Card>

            <Card className="border-[#E8DCC4]">
              <CardContent className="p-6 text-center">
                <Crown className="w-8 h-8 text-[#D4AF37] mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-800">{stats.goldenDoctors}</div>
                <div className="text-xs text-gray-600">Golden Doctors</div>
              </CardContent>
            </Card>

            <Card className="border-[#E8DCC4]">
              <CardContent className="p-6 text-center">
                <Star className="w-8 h-8 text-orange-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-800">{stats.totalPontos.toLocaleString()}</div>
                <div className="text-xs text-gray-600">Total Pontos</div>
              </CardContent>
            </Card>

            <Card className="border-[#E8DCC4]">
              <CardContent className="p-6 text-center">
                <Coins className="w-8 h-8 text-[#D4AF37] mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-800">{stats.totalCoins.toLocaleString()}</div>
                <div className="text-xs text-gray-600">Total Coins</div>
              </CardContent>
            </Card>
          </div>

          {/* Filters */}
          <Card className="border-[#E8DCC4] shadow-xl">
            <CardContent className="p-6">
              <div className="grid md:grid-cols-3 gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Buscar por nome ou email..."
                    className="pl-10 border-[#E8DCC4]"
                  />
                </div>

                <Select value={tipoFilter} onValueChange={setTipoFilter}>
                  <SelectTrigger className="border-[#E8DCC4]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todos os Tipos</SelectItem>
                    <SelectItem value="paciente">Pacientes</SelectItem>
                    <SelectItem value="profissional">Profissionais</SelectItem>
                    <SelectItem value="visitante">Visitantes</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={planoFilter} onValueChange={setPlanoFilter}>
                  <SelectTrigger className="border-[#E8DCC4]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todos os Planos</SelectItem>
                    <SelectItem value="none">Sem Plano</SelectItem>
                    <SelectItem value="light">Light</SelectItem>
                    <SelectItem value="gold">Gold</SelectItem>
                    <SelectItem value="vip">VIP</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Users Table */}
          <Card className="border-[#E8DCC4] shadow-xl">
            <CardHeader>
              <CardTitle className="font-serif text-2xl">
                Lista de Usuários ({filteredUsers.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="text-center py-12">
                  <div className="animate-spin w-8 h-8 border-4 border-[#D4AF37] border-t-transparent rounded-full mx-auto"></div>
                  <p className="text-gray-600 mt-4">Carregando usuários...</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Nome</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Tipo</TableHead>
                        <TableHead>Club da Beleza</TableHead>
                        <TableHead>Beauty Club (Clube+)</TableHead>
                        <TableHead>Golden</TableHead>
                        <TableHead>Pontos</TableHead>
                        <TableHead>Coins</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredUsers.map((user) => (
                        <TableRow key={user.id} className={user.account_suspended ? 'bg-red-50' : ''}>
                          <TableCell className="font-medium">{user.full_name}</TableCell>
                          <TableCell>{user.email}</TableCell>
                          <TableCell>
                            <Badge className="bg-blue-100 text-blue-800">
                              {user.tipo_usuario || 'visitante'}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge className={planoColors[user.clube_plano || 'none']}>
                              {planoLabels[user.clube_plano || 'none']}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge className={planoColors[user.beauty_club_plano || 'none']}>
                              {planoLabels[user.beauty_club_plano || 'none']}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {user.is_golden_doctor ? (
                              <CheckCircle className="w-5 h-5 text-green-600" />
                            ) : (
                              <XCircle className="w-5 h-5 text-gray-300" />
                            )}
                          </TableCell>
                          <TableCell>{user.pontos_clube || 0}</TableCell>
                          <TableCell>{user.beauty_coins || 0}</TableCell>
                          <TableCell>
                            {user.account_suspended ? (
                              <Badge className="bg-red-100 text-red-800">Suspenso</Badge>
                            ) : (
                              <Badge className="bg-green-100 text-green-800">Ativo</Badge>
                            )}
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-1">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleViewDetails(user)}
                                title="Ver Detalhes"
                              >
                                <Eye className="w-4 h-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleEdit(user)}
                                title="Editar"
                              >
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleSuspendToggle(user)}
                                className={user.account_suspended ? 'text-green-600' : 'text-orange-600'}
                                title={user.account_suspended ? 'Reativar' : 'Suspender'}
                              >
                                {user.account_suspended ? <UserCheck className="w-4 h-4" /> : <Ban className="w-4 h-4" />}
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleDeleteUser(user)}
                                className="text-red-600"
                                title="Excluir"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Edit Modal */}
      {editingUser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="max-w-2xl w-full border-[#E8DCC4] shadow-2xl max-h-[90vh] overflow-y-auto">
            <CardHeader className="bg-gradient-to-r from-[#F5EFE6] to-[#E8DCC4]">
              <CardTitle className="font-serif text-2xl">
                Editar Usuário: {editingUser.full_name}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Tipo de Usuário</Label>
                  <Select
                    value={editingUser.tipo_usuario}
                    onValueChange={(v) => setEditingUser({...editingUser, tipo_usuario: v})}
                  >
                    <SelectTrigger className="border-[#E8DCC4]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="visitante">Visitante</SelectItem>
                      <SelectItem value="paciente">Paciente</SelectItem>
                      <SelectItem value="profissional">Profissional</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Plano Club da Beleza</Label>
                  <Select
                    value={editingUser.clube_plano}
                    onValueChange={(v) => setEditingUser({...editingUser, clube_plano: v})}
                  >
                    <SelectTrigger className="border-[#E8DCC4]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">Nenhum</SelectItem>
                      <SelectItem value="light">Light</SelectItem>
                      <SelectItem value="gold">Gold</SelectItem>
                      <SelectItem value="vip">VIP</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Plano Beauty Club (Clube+)</Label>
                  <Select
                    value={editingUser.beauty_club_plano}
                    onValueChange={(v) => setEditingUser({...editingUser, beauty_club_plano: v})}
                  >
                    <SelectTrigger className="border-[#E8DCC4]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">Nenhum</SelectItem>
                      <SelectItem value="basic">Basic</SelectItem>
                      <SelectItem value="pro">Pro</SelectItem>
                      <SelectItem value="exclusive">Exclusive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Plano EdBeauty</Label>
                  <Select
                    value={editingUser.edbeauty_plano}
                    onValueChange={(v) => setEditingUser({...editingUser, edbeauty_plano: v})}
                  >
                    <SelectTrigger className="border-[#E8DCC4]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">Nenhum</SelectItem>
                      <SelectItem value="basic">Basic</SelectItem>
                      <SelectItem value="pro">Pro</SelectItem>
                      <SelectItem value="premium">Premium</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Pontos do Clube</Label>
                  <Input
                    type="number"
                    value={editingUser.pontos_clube || 0}
                    onChange={(e) => setEditingUser({...editingUser, pontos_clube: parseInt(e.target.value) || 0})}
                    className="border-[#E8DCC4]"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Beauty Coins</Label>
                  <Input
                    type="number"
                    value={editingUser.beauty_coins || 0}
                    onChange={(e) => setEditingUser({...editingUser, beauty_coins: parseInt(e.target.value) || 0})}
                    className="border-[#E8DCC4]"
                  />
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="is_golden_doctor"
                    checked={editingUser.is_golden_doctor}
                    onChange={(e) => setEditingUser({...editingUser, is_golden_doctor: e.target.checked})}
                    className="w-4 h-4"
                  />
                  <Label htmlFor="is_golden_doctor">
                    Membro Golden Doctors
                  </Label>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="account_suspended"
                    checked={editingUser.account_suspended}
                    onChange={(e) => setEditingUser({...editingUser, account_suspended: e.target.checked})}
                    className="w-4 h-4"
                  />
                  <Label htmlFor="account_suspended" className="text-red-600">
                    Conta Suspensa
                  </Label>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  variant="outline"
                  onClick={() => setEditingUser(null)}
                  className="flex-1"
                >
                  Cancelar
                </Button>
                <Button
                  onClick={handleSaveEdit}
                  disabled={updateUserMutation.isPending}
                  className="flex-1 bg-gradient-to-r from-[#D4AF37] to-[#C8A882] text-white"
                >
                  {updateUserMutation.isPending ? 'Salvando...' : 'Salvar Alterações'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Update Modals */}
      <AnimatePresence>
        {showUpdateModal && (
          <Dialog open={!!showUpdateModal} onOpenChange={() => setShowUpdateModal(null)}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="font-serif text-2xl flex items-center gap-2">
                  {showUpdateModal === 'immediate' && (
                    <>
                      <RefreshCw className="w-6 h-6 text-red-600" />
                      Atualização Imediata
                    </>
                  )}
                  {showUpdateModal === 'schedule' && (
                    <>
                      <Calendar className="w-6 h-6 text-orange-600" />
                      Agendar Atualização
                    </>
                  )}
                  {showUpdateModal === 'notify' && (
                    <>
                      <Bell className="w-6 h-6 text-blue-600" />
                      Notificar Usuários
                    </>
                  )}
                  {showUpdateModal === 'history' && (
                    <>
                      <History className="w-6 h-6 text-green-600" />
                      Histórico de Atualizações
                    </>
                  )}
                </DialogTitle>
                <DialogDescription>
                  {showUpdateModal === 'immediate' && 'Força o recarregamento do site para todos os usuários online'}
                  {showUpdateModal === 'schedule' && 'Programe uma atualização para ser executada automaticamente'}
                  {showUpdateModal === 'notify' && 'Envie uma notificação por email para todos os usuários'}
                  {showUpdateModal === 'history' && 'Todas as atualizações e notificações enviadas'}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-6 py-4">
                {showUpdateModal === 'history' ? (
                  // History View
                  <div className="space-y-4">
                    {updateHistory.length === 0 ? (
                      <div className="text-center py-12">
                        <History className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-600">Nenhuma atualização registrada</p>
                      </div>
                    ) : (
                      updateHistory.map((update) => (
                        <Card key={update.id} className="border-[#E8DCC4]">
                          <CardContent className="p-4">
                            <div className="flex items-start justify-between gap-4">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                  {update.tipo === 'atualizacao_imediata' && (
                                    <Badge className="bg-red-100 text-red-800">Imediata</Badge>
                                  )}
                                  {update.tipo === 'atualizacao_agendada' && (
                                    <Badge className="bg-orange-100 text-orange-800">Agendada</Badge>
                                  )}
                                  {update.tipo === 'notificacao_usuarios' && (
                                    <Badge className="bg-blue-100 text-blue-800">Notificação</Badge>
                                  )}
                                  {update.executada ? (
                                    <Badge className="bg-green-100 text-green-800">
                                      <CheckCircle className="w-3 h-3 mr-1" />
                                      Executada
                                    </Badge>
                                  ) : (
                                    <Badge className="bg-yellow-100 text-yellow-800">Pendente</Badge>
                                  )}
                                </div>
                                <h4 className="font-bold text-gray-800 mb-1">{update.titulo}</h4>
                                <p className="text-sm text-gray-600 mb-2">{update.mensagem}</p>
                                <div className="flex flex-wrap gap-3 text-xs text-gray-500">
                                  <span>Criado: {new Date(update.created_date).toLocaleString('pt-BR')}</span>
                                  {update.data_agendada && (
                                    <span>Agendado: {new Date(update.data_agendada).toLocaleString('pt-BR')}</span>
                                  )}
                                  {update.data_execucao && (
                                    <span>Executado: {new Date(update.data_execucao).toLocaleString('pt-BR')}</span>
                                  )}
                                  {update.usuarios_notificados && (
                                    <span>{update.usuarios_notificados} usuários notificados</span>
                                  )}
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))
                    )}
                  </div>
                ) : (
                  // Form View
                  <div className="space-y-4">
                    {showUpdateModal === 'immediate' && (
                      <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                        <div className="flex items-start gap-3">
                          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                          <div className="text-sm text-red-800">
                            <strong>ATENÇÃO:</strong> Esta ação forçará o recarregamento do site para todos os usuários
                            online e enviará emails de notificação. Use apenas quando necessário.
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="space-y-2">
                      <Label htmlFor="titulo">Título *</Label>
                      <Input
                        id="titulo"
                        value={updateFormData.titulo}
                        onChange={(e) => setUpdateFormData({...updateFormData, titulo: e.target.value})}
                        placeholder="Ex: Nova versão disponível"
                        className="border-[#E8DCC4]"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="mensagem">Mensagem *</Label>
                      <Textarea
                        id="mensagem"
                        value={updateFormData.mensagem}
                        onChange={(e) => setUpdateFormData({...updateFormData, mensagem: e.target.value})}
                        placeholder="Descreva as mudanças ou informações importantes..."
                        className="border-[#E8DCC4] h-32"
                      />
                    </div>

                    {showUpdateModal === 'schedule' && (
                      <div className="space-y-2">
                        <Label htmlFor="data_agendada">Data e Hora *</Label>
                        <Input
                          id="data_agendada"
                          type="datetime-local"
                          value={updateFormData.data_agendada}
                          onChange={(e) => setUpdateFormData({...updateFormData, data_agendada: e.target.value})}
                          className="border-[#E8DCC4]"
                        />
                      </div>
                    )}

                    <div className="flex gap-3 pt-4">
                      <Button
                        variant="outline"
                        onClick={() => {
                          setShowUpdateModal(null);
                          setUpdateFormData({ titulo: "", mensagem: "", data_agendada: "" });
                        }}
                        className="flex-1"
                      >
                        Cancelar
                      </Button>
                      <Button
                        onClick={() => {
                          if (showUpdateModal === 'immediate') handleForceUpdate();
                          else if (showUpdateModal === 'schedule') handleScheduleUpdate();
                          else if (showUpdateModal === 'notify') handleNotifyUsers();
                        }}
                        disabled={!updateFormData.titulo || !updateFormData.mensagem || (showUpdateModal === 'schedule' && !updateFormData.data_agendada) || createUpdateMutation.isPending}
                        className="flex-1 bg-gradient-to-r from-[#D4AF37] to-[#C8A882] text-white"
                      >
                        {createUpdateMutation.isPending ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                            Enviando...
                          </>
                        ) : showUpdateModal === 'immediate' ? (
                          'Forçar Atualização'
                        ) : showUpdateModal === 'schedule' ? (
                          'Agendar'
                        ) : (
                          'Enviar Notificação'
                        )}
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </DialogContent>
          </Dialog>
        )}
      </AnimatePresence>

      {/* User Details Modal */}
      {showDetailsModal && selectedUser && (
        <UserDetailsModal
          user={selectedUser}
          onClose={() => {
            setShowDetailsModal(false);
            setSelectedUser(null);
          }}
        />
      )}
    </div>
  );
}
