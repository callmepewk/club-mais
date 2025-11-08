import React, { useState, useMemo } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
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
import { motion } from "framer-motion";
import {
  Search, Shield, Users, Crown, Coins, Star,
  Eye, Edit, Mail, MessageCircle, Calendar, CheckCircle, XCircle
} from "lucide-react";
import UserDetailsModal from "../components/UserDetailsModal";

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

  const { data: currentUser } = useQuery({
    queryKey: ['current-user-control'],
    queryFn: () => base44.auth.me(),
  });

  const { data: users = [], isLoading } = useQuery({
    queryKey: ['all-users'],
    queryFn: () => base44.entities.User.list('-created_date'),
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
        }
      });
    }
  };

  const handleViewDetails = (user) => {
    setSelectedUser(user);
    setShowDetailsModal(true);
  };

  // Check if current user is admin
  if (!currentUser || currentUser.role !== 'admin') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#F5EFE6] to-white flex items-center justify-center p-6">
        <Card className="max-w-md w-full border-[#E8DCC4] shadow-xl">
          <CardContent className="p-12 text-center space-y-4">
            <Shield className="w-16 h-16 text-red-500 mx-auto" />
            <h2 className="font-serif text-2xl font-bold text-gray-800">
              Acesso Negado
            </h2>
            <p className="text-gray-600">
              Você não tem permissão para acessar esta página. Apenas administradores podem visualizar o painel de controle.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-[#F5EFE6] to-white py-12 px-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center space-y-4"
        >
          <Badge className="bg-gradient-to-r from-[#D4AF37] to-[#C8A882] text-white px-4 py-2 text-base">
            <Shield className="w-4 h-4 mr-2" />
            Painel Administrativo
          </Badge>

          <h1 className="font-serif text-4xl md:text-5xl font-bold">
            <span className="bg-gradient-to-r from-[#D4AF37] to-[#C8A882] bg-clip-text text-transparent">
              Controle de Usuários
            </span>
          </h1>

          <p className="text-lg text-gray-600">
            Gerencie usuários, planos e benefícios da plataforma
          </p>
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
                      <TableHead>Clube</TableHead>
                      <TableHead>Beauty Club</TableHead>
                      <TableHead>Golden</TableHead>
                      <TableHead>Pontos</TableHead>
                      <TableHead>Coins</TableHead>
                      <TableHead>Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUsers.map((user) => (
                      <TableRow key={user.id}>
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
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleViewDetails(user)}
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleEdit(user)}
                            >
                              <Edit className="w-4 h-4" />
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
    </div>
  );
}