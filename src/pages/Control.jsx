
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
  Shield, Search, Edit, Trash2, Eye, AlertCircle,
  Users, Crown, Star, Coins, TrendingUp, CheckCircle, FileText, XCircle,
  RefreshCw, Calendar, Bell, History, Zap, GitBranch, Package, FileDown, Ban, UserCheck
} from "lucide-react";
import UserDetailsModal from "../components/UserDetailsModal";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

const planColors = {
  none: "bg-gray-200 text-gray-700",
  light: "bg-blue-100 text-blue-800",
  gold: "bg-gradient-to-r from-yellow-400 to-yellow-600 text-white", // Updated gold from outline
  vip: "bg-gradient-to-r from-purple-500 to-purple-700 text-white", // Updated vip from outline
  basic: "bg-green-100 text-green-800", // Kept from original
  pro: "bg-indigo-100 text-indigo-800", // Kept from original
  exclusive: "bg-pink-100 text-pink-800", // Kept from original
  premium: "bg-orange-100 text-orange-800" // Kept from original
};

const planLabels = {
  none: "Sem Plano", // Updated from outline
  light: "Light",
  gold: "Gold",
  vip: "VIP",
  basic: "Basic", // Kept from original
  pro: "Pro", // Kept from original
  exclusive: "Exclusive", // Kept from original
  premium: "Premium" // Kept from original
};

export default function Control() {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterTipo, setFilterTipo] = useState("todos");
  const [filterPlano, setFilterPlano] = useState("todos");
  const [selectedUser, setSelectedUser] = useState(null);
  const [editingUser, setEditingUser] = useState(null);
  const [editFormData, setEditFormData] = useState({});
  const [showDetailsModal, setShowDetailsModal] = useState(false); // Kept from original

  const [showVersionModal, setShowVersionModal] = useState(false);
  const [versionFormData, setVersionFormData] = useState({
    versao: "",
    tipo_release: "patch",
    changelog: "",
    arquivos_alterados: [],
    data_agendada: "",
  });

  const { data: user } = useQuery({ // Renamed from currentUser to user
    queryKey: ['current-user-control'],
    queryFn: () => base44.auth.me(),
  });

  const { data: users = [], isLoading } = useQuery({
    queryKey: ['all-users'],
    queryFn: async () => { // Added async and data check as per outline
      const { data } = await base44.entities.User.list('-created_date'); // Kept original sort
      return data || [];
    },
    initialData: [],
  });

  // Removed updateHistory query

  const { data: versions = [] } = useQuery({
    queryKey: ['app-versions'],
    queryFn: () => base44.entities.AppVersion.list('-created_date'),
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
    onError: (error) => { // Kept original onError for robustness
      alert('Erro ao excluir usuário. Verifique se não há dependências.');
    }
  });

  // Removed createUpdateMutation

  const createVersionMutation = useMutation({
    mutationFn: (data) => base44.entities.AppVersion.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['app-versions'] });
      setShowVersionModal(false);
      setVersionFormData({
        versao: "",
        tipo_release: "patch",
        changelog: "",
        arquivos_alterados: [],
        data_agendada: "",
      });
      alert('Nova versão criada com sucesso!'); // Added success alert
    },
    onError: (error) => { // Added onError for robustness
      console.error("Erro ao criar versão:", error);
      alert("Erro ao criar versão. Detalhes no console.");
    }
  });

  const publishVersionMutation = useMutation({
    mutationFn: async (versionId) => {
      const version = versions.find(v => v.id === versionId);
      if (!version) throw new Error("Version not found."); // Added check

      // Update version status
      await base44.entities.AppVersion.update(versionId, {
        status: 'publicada',
        data_publicacao: new Date().toISOString(),
        cache_version: Date.now().toString(),
      });

      // Notify all users
      const { data: allUsers } = await base44.entities.User.list();
      
      for (const currentUser of allUsers) { // Renamed user to currentUser to avoid conflict
        await base44.integrations.Core.SendEmail({
          to: currentUser.email,
          subject: `🚀 Nova Versão ${version.versao} Disponível!`,
          body: `
            <h2>Nova Atualização Disponível!</h2>
            <p>Olá ${currentUser.full_name || 'Usuário'}!</p>
            <p>O Club da Beleza foi atualizado para a versão <strong>${version.versao}</strong>!</p>
            <hr/>
            <h3>📋 O que há de novo:</h3>
            <p>${version.changelog.replace(/\n/g, '<br/>')}</p>
            <hr/>
            <p><strong>🔄 Ação recomendada:</strong> Ao acessar o site, você verá um aviso de atualização. Clique em "Atualizar Agora" para aproveitar as novidades!</p>
            <p><small>Club da Beleza - Versão ${version.versao}</small></p>
          `
        });
      }

      return { ...version, usuarios_notificados: allUsers.length };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['app-versions'] });
      alert('Versão publicada e usuários notificados com sucesso!');
    },
    onError: (error) => { // Added onError for robustness
      console.error("Erro ao publicar versão:", error);
      alert("Erro ao publicar versão. Detalhes no console.");
    }
  });

  const scheduleVersionMutation = useMutation({
    mutationFn: async ({ versionId, data_agendada }) => {
      const version = versions.find(v => v.id === versionId);
      if (!version) throw new Error("Version not found."); // Added check

      // Update version with scheduled date
      await base44.entities.AppVersion.update(versionId, {
        status: 'agendada',
        data_agendada: data_agendada,
      });

      // Notify users about scheduled update
      const { data: allUsers } = await base44.entities.User.list();
      
      for (const currentUser of allUsers) { // Renamed user to currentUser to avoid conflict
        await base44.integrations.Core.SendEmail({
          to: currentUser.email,
          subject: `📅 Atualização Agendada: Versão ${version.versao}`,
          body: `
            <h2>Manutenção Programada</h2>
            <p>Olá ${currentUser.full_name || 'Usuário'}!</p>
            <p>O Club da Beleza será atualizado para a versão <strong>${version.versao}</strong></p>
            <p><strong>📅 Data e Horário:</strong> ${new Date(data_agendada).toLocaleString('pt-BR')}</p>
            <hr/>
            <h3>📋 Melhorias previstas:</h3>
            <p>${version.changelog.replace(/\n/g, '<br/>')}</p>
            <hr/>
            <p><strong>ℹ️ Importante:</strong> Durante o horário programado, você pode ser solicitado a recarregar a página para aplicar as atualizações.</p>
            <p><small>Club da Beleza</small></p>
          `
        });
      }

      return allUsers.length;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['app-versions'] });
      alert('Atualização agendada e usuários notificados!');
    },
    onError: (error) => { // Added onError for robustness
      console.error("Erro ao agendar versão:", error);
      alert("Erro ao agendar versão. Detalhes no console.");
    }
  });

  // Replaced handleEdit
  const handleEditUser = (user) => {
    setEditingUser(user);
    setEditFormData({
      tipo_usuario: user.tipo_usuario || 'visitante', // Kept this for functionality, was removed in outline
      clube_plano: user.clube_plano || 'none',
      beauty_club_plano: user.beauty_club_plano || 'none', // Kept this for functionality, was removed in outline
      edbeauty_plano: user.edbeauty_plano || 'none',
      is_golden_doctor: user.is_golden_doctor || false, // Kept this for functionality, was removed in outline
      pontos_clube: user.pontos_clube || 0,
      beauty_coins: user.beauty_coins || 0,
      account_suspended: user.account_suspended || false, // Kept this for functionality, was removed in outline
    });
  };

  // Replaced handleSaveEdit
  const handleSaveUser = () => {
    if (editingUser) {
      updateUserMutation.mutate({
        id: editingUser.id,
        data: editFormData
      });
    }
  };

  // Replaced handleSuspendToggle
  const handleSuspendUser = (userToSuspend) => {
    if (confirm(`Deseja ${userToSuspend.account_suspended ? 'reativar' : 'suspender'} o acesso de ${userToSuspend.full_name}?`)) {
      updateUserMutation.mutate({
        id: userToSuspend.id,
        data: { account_suspended: !userToSuspend.account_suspended }
      });
    }
  };

  // Replaced handleDeleteUser
  const handleDeleteUser = (userToDelete) => {
    if (confirm(`ATENÇÃO: Deseja realmente EXCLUIR permanentemente o usuário ${userToDelete.full_name}? Esta ação não pode ser desfeita!`)) {
      if (confirm('Tem certeza? Digite "CONFIRMAR" para continuar.')) {
        deleteUserMutation.mutate(userToDelete.id);
      }
    }
  };

  const handleViewDetails = (user) => { // Kept from original
    setSelectedUser(user);
    setShowDetailsModal(true);
  };

  const handleCreateVersion = () => {
    if (!versionFormData.versao || !versionFormData.changelog) {
      alert('Por favor, preencha versão e changelog.');
      return;
    }

    createVersionMutation.mutate({
      ...versionFormData,
      status: 'em_desenvolvimento',
      // cache_version: Date.now().toString(), // this should be set on publish, not create
      criado_por: user?.email,
    });
  };

  const handleForcePublish = (versionId) => {
    if (confirm('⚠️ FORÇAR PUBLICAÇÃO: Isso enviará a atualização imediatamente para TODOS os usuários. Continuar?')) {
      publishVersionMutation.mutate(versionId);
    }
  };

  const handleScheduleVersion = (versionId) => {
    const dataAgendada = prompt('Digite a data e hora para publicação (formato: YYYY-MM-DDTHH:mm):');
    
    if (dataAgendada) {
      scheduleVersionMutation.mutate({ 
        versionId, 
        data_agendada: dataAgendada 
      });
    }
  };

  const filteredUsers = useMemo(() => {
    return users.filter(u => {
      const matchSearch = !searchTerm || 
        u.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.email?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchTipo = filterTipo === "todos" || u.tipo_usuario === filterTipo;
      const matchPlano = filterPlano === "todos" || (u.clube_plano || 'none') === filterPlano;
      
      return matchSearch && matchTipo && matchPlano;
    });
  }, [users, searchTerm, filterTipo, filterPlano]);

  const stats = useMemo(() => {
    const total = users.length;
    const pacientes = users.filter(u => u.tipo_usuario === 'paciente').length;
    const profissionais = users.filter(u => u.tipo_usuario === 'profissional').length;
    const planosAtivos = users.filter(u => u.clube_plano && u.clube_plano !== 'none').length;
    const goldenDoctors = users.filter(u => u.is_golden_doctor).length; // Kept from original
    const totalPontos = users.reduce((sum, u) => sum + (u.pontos_clube || 0), 0); // Kept from original
    const totalCoins = users.reduce((sum, u) => sum + (u.beauty_coins || 0), 0); // Kept from original
    const suspended = users.filter(u => u.account_suspended).length; // Kept from original

    return { total, pacientes, profissionais, planosAtivos, goldenDoctors, totalPontos, totalCoins, suspended };
  }, [users]);

  const generatePDFReport = () => { // Kept from original
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
            ${filteredUsers.map(u => `
              <tr>
                <td>${u.full_name || 'N/A'}</td>
                <td>${u.email}</td>
                <td>${u.tipo_usuario || 'visitante'}</td>
                <td>${planLabels[u.clube_plano || 'none']}</td>
                <td>${planLabels[u.beauty_club_plano || 'none']}</td>
                <td>${u.is_golden_doctor ? '✓' : '✗'}</td>
                <td>${u.pontos_clube || 0}</td>
                <td>${u.beauty_coins || 0}</td>
                <td>${u.account_suspended ? 'SUSPENSO' : 'Ativo'}</td>
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
  if (!user || user.role !== 'admin') { // Changed currentUser to user
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
        <div className="relative z-10 max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center space-y-6"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full border border-white/30">
              <Shield className="w-5 h-5 text-white" />
              <span className="text-white font-medium">Painel Administrativo</span>
            </div>

            <h1 className="font-serif text-5xl md:text-6xl font-bold text-white">
              Controle Total
            </h1>

            <p className="text-xl text-white/90 max-w-2xl mx-auto">
              Gerencie usuários, planos, versões e atualizações do sistema
            </p>
          </motion.div>
        </div>
      </div>

      <div className="py-12 px-6">
        <div className="max-w-7xl mx-auto space-y-12">
          {/* Version Management Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Card className="border-[#E8DCC4] shadow-2xl bg-gradient-to-br from-white to-[#F5EFE6]">
              <CardHeader className="bg-gradient-to-r from-indigo-500 to-indigo-600 text-white">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                      <GitBranch className="w-6 h-6" />
                    </div>
                    <div>
                      <CardTitle className="font-serif text-2xl">
                        Sistema de Versões (CI/CD Interno)
                      </CardTitle>
                      <p className="text-white/90 text-sm mt-1">
                        Deploy automático de alterações - Publique ou agende atualizações
                      </p>
                    </div>
                  </div>
                  <Button
                    onClick={() => setShowVersionModal(true)}
                    className="bg-white text-indigo-600 hover:bg-white/90"
                  >
                    <Package className="w-4 h-4 mr-2" />
                    Nova Versão
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-8">
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                  <Card className="border-2 border-indigo-200 bg-gradient-to-br from-indigo-50 to-white">
                    <CardContent className="p-6 text-center">
                      <div className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-indigo-800 bg-clip-text text-transparent">
                        {versions.filter(v => v.status === 'publicada').length}
                      </div>
                      <p className="text-sm text-gray-600 mt-1">Versões Publicadas</p>
                    </CardContent>
                  </Card>

                  <Card className="border-2 border-orange-200 bg-gradient-to-br from-orange-50 to-white">
                    <CardContent className="p-6 text-center">
                      <div className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-orange-800 bg-clip-text text-transparent">
                        {versions.filter(v => v.status === 'agendada').length}
                      </div>
                      <p className="text-sm text-gray-600 mt-1">Atualizações Agendadas</p>
                    </CardContent>
                  </Card>

                  <Card className="border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-white">
                    <CardContent className="p-6 text-center">
                      <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                        {versions.filter(v => v.status === 'em_desenvolvimento').length}
                      </div>
                      <p className="text-sm text-gray-600 mt-1">Em Desenvolvimento</p>
                    </CardContent>
                  </Card>

                  <Card className="border-2 border-green-200 bg-gradient-to-br from-green-50 to-white">
                    <CardContent className="p-6 text-center">
                      <div className="text-3xl font-bold bg-gradient-to-r from-green-600 to-green-800 bg-clip-text text-transparent">
                        {versions[0]?.versao || '0.0.0'}
                      </div>
                      <p className="text-sm text-gray-600 mt-1">Versão Atual</p>
                    </CardContent>
                  </Card>
                </div>

                {/* Version List */}
                <div className="space-y-4">
                  <h3 className="font-serif text-xl font-bold text-gray-800">
                    Histórico de Versões
                  </h3>
                  {versions.length === 0 ? (
                    <div className="text-center py-12 bg-gray-50 rounded-lg">
                      <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-600">Nenhuma versão criada ainda</p>
                    </div>
                  ) : (
                    versions.map((version) => (
                      <Card key={version.id} className="border-[#E8DCC4]">
                        <CardContent className="p-6">
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <h4 className="font-bold text-xl text-gray-800">
                                  v{version.versao}
                                h4>
                                <Badge className={
                                  version.status === 'publicada' ? 'bg-green-100 text-green-800' :
                                  version.status === 'agendada' ? 'bg-orange-100 text-orange-800' :
                                  version.status === 'em_desenvolvimento' ? 'bg-blue-100 text-blue-800' :
                                  'bg-gray-100 text-gray-800'
                                }>
                                  {version.status === 'publicada' && <CheckCircle className="w-3 h-3 mr-1" />}
                                  {version.status === 'agendada' && <Calendar className="w-3 h-3 mr-1" />}
                                  {version.status.replace('_', ' ')}
                                </Badge>
                                <Badge variant="outline" className="border-indigo-200 text-indigo-800">
                                  {version.tipo_release}
                                </Badge>
                              </div>
                              
                              <p className="text-gray-700 mb-3 whitespace-pre-line">{version.changelog}</p>
                              
                              <div className="flex flex-wrap gap-3 text-xs text-gray-500">
                                <span>Criado: {new Date(version.created_date).toLocaleString('pt-BR')}</span>
                                {version.data_agendada && (
                                  <span className="text-orange-600 font-semibold">
                                    📅 Agendado: {new Date(version.data_agendada).toLocaleString('pt-BR')}
                                  </span>
                                )}
                                {version.data_publicacao && (
                                  <span className="text-green-600 font-semibold">
                                    ✅ Publicado: {new Date(version.data_publicacao).toLocaleString('pt-BR')}
                                  </span>
                                )}
                                {version.criado_por && <span>Por: {version.criado_por}</span>}
                              </div>
                            </div>

                            {version.status === 'em_desenvolvimento' && (
                              <div className="flex gap-2">
                                <Button
                                  onClick={() => handleForcePublish(version.id)}
                                  disabled={publishVersionMutation.isPending}
                                  size="sm"
                                  className="bg-gradient-to-r from-red-500 to-red-600 text-white"
                                >
                                  <Zap className="w-4 h-4 mr-2" />
                                  Forçar Agora
                                </Button>
                                <Button
                                  onClick={() => handleScheduleVersion(version.id)}
                                  disabled={scheduleVersionMutation.isPending}
                                  size="sm"
                                  variant="outline"
                                  className="border-orange-500 text-orange-600"
                                >
                                  <Calendar className="w-4 h-4 mr-2" />
                                  Agendar
                                </Button>
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
          >
            <div className="grid md:grid-cols-6 gap-4">
              <Card className="border-[#E8DCC4] bg-gradient-to-br from-white to-[#F5EFE6]">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-[#D4AF37] to-[#C8A882] rounded-full flex items-center justify-center">
                      <Users className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Total de Usuários</p>
                      <p className="text-2xl font-bold text-gray-800">{stats.total}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-[#E8DCC4] bg-gradient-to-br from-white to-blue-50">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                      <Users className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Pacientes</p>
                      <p className="text-2xl font-bold text-gray-800">{stats.pacientes}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-[#E8DCC4] bg-gradient-to-br from-white to-purple-50">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center">
                      <Users className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Profissionais</p>
                      <p className="text-2xl font-bold text-gray-800">{stats.profissionais}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-[#E8DCC4] bg-gradient-to-br from-white to-green-50">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center">
                      <Crown className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Planos Ativos</p>
                      <p className="text-2xl font-bold text-gray-800">{stats.planosAtivos}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-[#E8DCC4]"> {/* Kept from original */}
                <CardContent className="p-6 text-center">
                  <Star className="w-8 h-8 text-orange-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-gray-800">{stats.totalPontos.toLocaleString()}</div>
                  <div className="text-xs text-gray-600">Total Pontos</div>
                </CardContent>
              </Card>

              <Card className="border-[#E8DCC4]"> {/* Kept from original */}
                <CardContent className="p-6 text-center">
                  <Coins className="w-8 h-8 text-[#D4AF37] mx-auto mb-2" />
                  <div className="text-2xl font-bold text-gray-800">{stats.totalCoins.toLocaleString()}</div>
                  <div className="text-xs text-gray-600">Total Coins</div>
                </CardContent>
              </Card>
            </div>
          </motion.div>

          {/* Filters */}
          <Card className="border-[#E8DCC4] shadow-xl">
            <CardContent className="p-6">
              <div className="grid md:grid-cols-3 gap-4 mb-4"> {/* Added mb-4 for spacing */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    value={searchTerm} // Changed to searchTerm
                    onChange={(e) => setSearchTerm(e.target.value)} // Changed to setSearchTerm
                    placeholder="Buscar por nome ou email..."
                    className="pl-10 border-[#E8DCC4]"
                  />
                </div>

                <Select value={filterTipo} onValueChange={setFilterTipo}> {/* Changed to filterTipo */}
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

                <Select value={filterPlano} onValueChange={setFilterPlano}> {/* Changed to filterPlano */}
                  <SelectTrigger className="border-[#E8DCC4]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todos os Planos</SelectItem>
                    <SelectItem value="none">Sem Plano</SelectItem>
                    <SelectItem value="light">Light</SelectItem>
                    <SelectItem value="gold">Gold</SelectItem>
                    <SelectItem value="vip">VIP</SelectItem>
                    <SelectItem value="basic">Basic</SelectItem> {/* Added from original */}
                    <SelectItem value="pro">Pro</SelectItem> {/* Added from original */}
                    <SelectItem value="exclusive">Exclusive</SelectItem> {/* Added from original */}
                    <SelectItem value="premium">Premium</SelectItem> {/* Added from original */}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex justify-end"> {/* Added PDF button here */}
                <Button
                  onClick={generatePDFReport}
                  className="bg-white/90 text-[#D4AF37] hover:bg-white transition-colors border border-[#D4AF37]"
                  variant="outline"
                >
                  <FileDown className="w-4 h-4 mr-2" />
                  Gerar Relatório PDF
                </Button>
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
                            <Badge className={planColors[user.clube_plano || 'none']}> {/* Changed to planColors */}
                              {planLabels[user.clube_plano || 'none']} {/* Changed to planLabels */}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge className={planColors[user.beauty_club_plano || 'none']}> {/* Changed to planColors */}
                              {planLabels[user.beauty_club_plano || 'none']} {/* Changed to planLabels */}
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
                                onClick={() => handleEditUser(user)}
                                title="Editar"
                              >
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleSuspendUser(user)}
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
                <div className="space-y-2"> {/* Kept from original */}
                  <Label>Tipo de Usuário</Label>
                  <Select
                    value={editFormData.tipo_usuario}
                    onValueChange={(v) => setEditFormData({...editFormData, tipo_usuario: v})}
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
                    value={editFormData.clube_plano}
                    onValueChange={(v) => setEditFormData({...editFormData, clube_plano: v})}
                  >
                    <SelectTrigger className="border-[#E8DCC4]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">Sem Plano</SelectItem> {/* Changed to planLabels */}
                      <SelectItem value="light">Light</SelectItem>
                      <SelectItem value="gold">Gold</SelectItem>
                      <SelectItem value="vip">VIP</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2"> {/* Kept from original */}
                  <Label>Plano Beauty Club (Clube+)</Label>
                  <Select
                    value={editFormData.beauty_club_plano}
                    onValueChange={(v) => setEditFormData({...editFormData, beauty_club_plano: v})}
                  >
                    <SelectTrigger className="border-[#E8DCC4]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">Sem Plano</SelectItem> {/* Changed to planLabels */}
                      <SelectItem value="basic">Basic</SelectItem>
                      <SelectItem value="pro">Pro</SelectItem>
                      <SelectItem value="exclusive">Exclusive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Plano EdBeauty</Label>
                  <Select
                    value={editFormData.edbeauty_plano}
                    onValueChange={(v) => setEditFormData({...editFormData, edbeauty_plano: v})}
                  >
                    <SelectTrigger className="border-[#E8DCC4]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">Sem Plano</SelectItem> {/* Changed to planLabels */}
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
                    value={editFormData.pontos_clube || 0}
                    onChange={(e) => setEditFormData({...editFormData, pontos_clube: parseInt(e.target.value) || 0})}
                    className="border-[#E8DCC4]"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Beauty Coins</Label>
                  <Input
                    type="number"
                    value={editFormData.beauty_coins || 0}
                    onChange={(e) => setEditFormData({...editFormData, beauty_coins: parseInt(e.target.value) || 0})}
                    className="border-[#E8DCC4]"
                  />
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2"> {/* Kept from original */}
                  <input
                    type="checkbox"
                    id="is_golden_doctor"
                    checked={editFormData.is_golden_doctor}
                    onChange={(e) => setEditFormData({...editFormData, is_golden_doctor: e.target.checked})}
                    className="w-4 h-4"
                  />
                  <Label htmlFor="is_golden_doctor">
                    Membro Golden Doctors
                  </Label>
                </div>

                <div className="flex items-center gap-2"> {/* Kept from original */}
                  <input
                    type="checkbox"
                    id="account_suspended"
                    checked={editFormData.account_suspended}
                    onChange={(e) => setEditFormData({...editFormData, account_suspended: e.target.checked})}
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
                  onClick={handleSaveUser} {/* Changed to handleSaveUser */}
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

      {/* Version Modal */}
      <AnimatePresence>
        {showVersionModal && (
          <Dialog open={showVersionModal} onOpenChange={setShowVersionModal}>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle className="font-serif text-2xl flex items-center gap-2">
                  <Package className="w-6 h-6 text-indigo-600" />
                  Criar Nova Versão
                </DialogTitle>
                <DialogDescription>
                  Crie uma nova versão para deploy manual ou agendado
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4 py-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Versão *</Label>
                    <Input
                      value={versionFormData.versao}
                      onChange={(e) => setVersionFormData({...versionFormData, versao: e.target.value})}
                      placeholder="Ex: 1.2.0"
                      className="border-[#E8DCC4]"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Tipo de Release *</Label>
                    <Select 
                      value={versionFormData.tipo_release} 
                      onValueChange={(v) => setVersionFormData({...versionFormData, tipo_release: v})}
                    >
                      <SelectTrigger className="border-[#E8DCC4]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="major">Major (mudanças grandes)</SelectItem>
                        <SelectItem value="minor">Minor (novas features)</SelectItem>
                        <SelectItem value="patch">Patch (correções)</SelectItem>
                        <SelectItem value="hotfix">Hotfix (urgente)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Changelog (O que mudou?) *</Label>
                  <Textarea
                    value={versionFormData.changelog}
                    onChange={(e) => setVersionFormData({...versionFormData, changelog: e.target.value})}
                    placeholder={`Ex:\n- Adicionado sistema de notificações\n- Corrigido bug no login\n- Melhorada performance do mapa`}
                    className="border-[#E8DCC4] h-32"
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setShowVersionModal(false);
                      setVersionFormData({
                        versao: "",
                        tipo_release: "patch",
                        changelog: "",
                        arquivos_alterados: [],
                        data_agendada: "",
                      });
                    }}
                    className="flex-1"
                  >
                    Cancelar
                  </Button>
                  <Button
                    onClick={handleCreateVersion}
                    disabled={createVersionMutation.isPending}
                    className="flex-1 bg-gradient-to-r from-indigo-500 to-indigo-600 text-white"
                  >
                    {createVersionMutation.isPending ? 'Criando...' : 'Criar Versão'}
                  </Button>
                </div>
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
