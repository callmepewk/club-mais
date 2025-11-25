import React, { useState, useMemo } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Users, Search, Eye, Edit, Trash2, Ban, UserCheck, CheckCircle, XCircle, FileDown, Crown, Star, Coins } from "lucide-react";
import UserDetailsModal from "../UserDetailsModal";

const planColors = {
  none: "bg-gray-200 text-gray-700", light: "bg-blue-100 text-blue-800",
  gold: "bg-gradient-to-r from-yellow-400 to-yellow-600 text-white", vip: "bg-gradient-to-r from-purple-500 to-purple-700 text-white",
  basic: "bg-green-100 text-green-800", pro: "bg-indigo-100 text-indigo-800", exclusive: "bg-pink-100 text-pink-800", premium: "bg-orange-100 text-orange-800"
};
const planLabels = { none: "Sem Plano", light: "Light", gold: "Gold", vip: "VIP", basic: "Basic", pro: "Pro", exclusive: "Exclusive", premium: "Premium" };

export default function UsersSection() {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterTipo, setFilterTipo] = useState("todos");
  const [filterPlano, setFilterPlano] = useState("todos");
  const [selectedUser, setSelectedUser] = useState(null);
  const [editingUser, setEditingUser] = useState(null);
  const [editFormData, setEditFormData] = useState({});

  const { data: users = [], isLoading } = useQuery({
    queryKey: ['all-users'],
    queryFn: async () => { const { data } = await base44.entities.User.list('-created_date'); return data || []; },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.User.update(id, data),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['all-users'] }); setEditingUser(null); },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.User.delete(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['all-users'] }),
  });

  const filteredUsers = useMemo(() => {
    return users.filter(u => {
      const matchSearch = !searchTerm || u.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) || u.email?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchTipo = filterTipo === "todos" || u.tipo_usuario === filterTipo;
      const matchPlano = filterPlano === "todos" || (u.clube_plano || 'none') === filterPlano;
      return matchSearch && matchTipo && matchPlano;
    });
  }, [users, searchTerm, filterTipo, filterPlano]);

  const stats = useMemo(() => ({
    total: users.length,
    pacientes: users.filter(u => u.tipo_usuario === 'paciente').length,
    profissionais: users.filter(u => u.tipo_usuario === 'profissional').length,
    planosAtivos: users.filter(u => u.clube_plano && u.clube_plano !== 'none').length,
    goldenDoctors: users.filter(u => u.is_golden_doctor).length,
    totalPontos: users.reduce((s, u) => s + (u.pontos_clube || 0), 0),
    totalCoins: users.reduce((s, u) => s + (u.beauty_coins || 0), 0),
  }), [users]);

  const handleEdit = (user) => {
    setEditingUser(user);
    setEditFormData({
      tipo_usuario: user.tipo_usuario || 'visitante', clube_plano: user.clube_plano || 'none',
      beauty_club_plano: user.beauty_club_plano || 'none', edbeauty_plano: user.edbeauty_plano || 'none',
      is_golden_doctor: user.is_golden_doctor || false, pontos_clube: user.pontos_clube || 0,
      beauty_coins: user.beauty_coins || 0, account_suspended: user.account_suspended || false,
    });
  };

  const generatePDF = () => {
    const html = `<!DOCTYPE html><html><head><title>Relatório</title><style>body{font-family:Arial;margin:20px}h1{color:#D4AF37}table{width:100%;border-collapse:collapse}th,td{border:1px solid #ddd;padding:8px;text-align:left;font-size:11px}th{background:#D4AF37;color:white}</style></head><body><h1>Relatório de Usuários - Club da Beleza</h1><p>Gerado: ${new Date().toLocaleString('pt-BR')}</p><p>Total: ${stats.total} | Pacientes: ${stats.pacientes} | Profissionais: ${stats.profissionais}</p><table><tr><th>Nome</th><th>Email</th><th>Tipo</th><th>Plano</th><th>Golden</th><th>Pontos</th><th>Coins</th></tr>${filteredUsers.map(u => `<tr><td>${u.full_name||'N/A'}</td><td>${u.email}</td><td>${u.tipo_usuario||'visitante'}</td><td>${planLabels[u.clube_plano||'none']}</td><td>${u.is_golden_doctor?'✓':'✗'}</td><td>${u.pontos_clube||0}</td><td>${u.beauty_coins||0}</td></tr>`).join('')}</table></body></html>`;
    const w = window.open('', '_blank'); w.document.write(html); w.document.close(); w.print();
  };

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
        <Card className="border-[#E8DCC4]"><CardContent className="p-3 text-center"><Users className="w-6 h-6 text-[#D4AF37] mx-auto mb-1" /><div className="text-xl font-bold">{stats.total}</div><p className="text-xs text-gray-500">Total</p></CardContent></Card>
        <Card className="border-blue-200"><CardContent className="p-3 text-center"><Users className="w-6 h-6 text-blue-500 mx-auto mb-1" /><div className="text-xl font-bold">{stats.pacientes}</div><p className="text-xs text-gray-500">Pacientes</p></CardContent></Card>
        <Card className="border-purple-200"><CardContent className="p-3 text-center"><Users className="w-6 h-6 text-purple-500 mx-auto mb-1" /><div className="text-xl font-bold">{stats.profissionais}</div><p className="text-xs text-gray-500">Profissionais</p></CardContent></Card>
        <Card className="border-green-200"><CardContent className="p-3 text-center"><Crown className="w-6 h-6 text-green-500 mx-auto mb-1" /><div className="text-xl font-bold">{stats.planosAtivos}</div><p className="text-xs text-gray-500">C/ Plano</p></CardContent></Card>
        <Card className="border-orange-200"><CardContent className="p-3 text-center"><Star className="w-6 h-6 text-orange-500 mx-auto mb-1" /><div className="text-xl font-bold">{stats.totalPontos.toLocaleString()}</div><p className="text-xs text-gray-500">Pontos</p></CardContent></Card>
        <Card className="border-yellow-200"><CardContent className="p-3 text-center"><Coins className="w-6 h-6 text-yellow-500 mx-auto mb-1" /><div className="text-xl font-bold">{stats.totalCoins.toLocaleString()}</div><p className="text-xs text-gray-500">Coins</p></CardContent></Card>
      </div>

      {/* Filters */}
      <Card className="border-[#E8DCC4]">
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-3 items-center">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Buscar..." className="pl-9" />
            </div>
            <Select value={filterTipo} onValueChange={setFilterTipo}>
              <SelectTrigger className="w-36"><SelectValue /></SelectTrigger>
              <SelectContent><SelectItem value="todos">Todos Tipos</SelectItem><SelectItem value="paciente">Pacientes</SelectItem><SelectItem value="profissional">Profissionais</SelectItem></SelectContent>
            </Select>
            <Select value={filterPlano} onValueChange={setFilterPlano}>
              <SelectTrigger className="w-36"><SelectValue /></SelectTrigger>
              <SelectContent>{['todos', ...Object.keys(planLabels)].map(k => <SelectItem key={k} value={k}>{k === 'todos' ? 'Todos Planos' : planLabels[k]}</SelectItem>)}</SelectContent>
            </Select>
            <Button onClick={generatePDF} variant="outline" className="border-[#D4AF37] text-[#D4AF37]"><FileDown className="w-4 h-4 mr-2" /> PDF</Button>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card className="border-[#E8DCC4]">
        <CardHeader><CardTitle className="flex items-center gap-2"><Users className="w-5 h-5" /> Lista de Usuários ({filteredUsers.length})</CardTitle></CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-12"><div className="animate-spin w-8 h-8 border-4 border-[#D4AF37] border-t-transparent rounded-full mx-auto"></div></div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow><TableHead>Nome</TableHead><TableHead>Email</TableHead><TableHead>Tipo</TableHead><TableHead>Plano</TableHead><TableHead>Golden</TableHead><TableHead>Status</TableHead><TableHead>Ações</TableHead></TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map((u) => (
                    <TableRow key={u.id} className={u.account_suspended ? 'bg-red-50' : u.is_test_account ? 'bg-green-50' : ''}>
                      <TableCell className="font-medium">{u.full_name}{u.is_test_account && <Badge className="ml-2 bg-green-600 text-white text-xs">TESTE</Badge>}</TableCell>
                      <TableCell className="text-sm">{u.email}</TableCell>
                      <TableCell><Badge className="bg-blue-100 text-blue-800">{u.tipo_usuario || 'visitante'}</Badge></TableCell>
                      <TableCell><Badge className={planColors[u.clube_plano || 'none']}>{planLabels[u.clube_plano || 'none']}</Badge></TableCell>
                      <TableCell>{u.is_golden_doctor ? <CheckCircle className="w-5 h-5 text-green-600" /> : <XCircle className="w-5 h-5 text-gray-300" />}</TableCell>
                      <TableCell><Badge className={u.account_suspended ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}>{u.account_suspended ? 'Suspenso' : 'Ativo'}</Badge></TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button size="sm" variant="outline" onClick={() => setSelectedUser(u)}><Eye className="w-4 h-4" /></Button>
                          <Button size="sm" variant="outline" onClick={() => handleEdit(u)}><Edit className="w-4 h-4" /></Button>
                          <Button size="sm" variant="outline" onClick={() => updateMutation.mutate({ id: u.id, data: { account_suspended: !u.account_suspended } })} className={u.account_suspended ? 'text-green-600' : 'text-orange-600'}>{u.account_suspended ? <UserCheck className="w-4 h-4" /> : <Ban className="w-4 h-4" />}</Button>
                          <Button size="sm" variant="outline" className="text-red-600" onClick={() => confirm('Excluir usuário?') && deleteMutation.mutate(u.id)}><Trash2 className="w-4 h-4" /></Button>
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
          <Card className="max-w-lg w-full">
            <CardHeader className="bg-gradient-to-r from-[#F5EFE6] to-[#E8DCC4]"><CardTitle>Editar: {editingUser.full_name}</CardTitle></CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2"><Label>Tipo</Label><Select value={editFormData.tipo_usuario} onValueChange={(v) => setEditFormData({...editFormData, tipo_usuario: v})}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="visitante">Visitante</SelectItem><SelectItem value="paciente">Paciente</SelectItem><SelectItem value="profissional">Profissional</SelectItem></SelectContent></Select></div>
                <div className="space-y-2"><Label>Plano Club</Label><Select value={editFormData.clube_plano} onValueChange={(v) => setEditFormData({...editFormData, clube_plano: v})}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{Object.entries(planLabels).map(([k,v]) => <SelectItem key={k} value={k}>{v}</SelectItem>)}</SelectContent></Select></div>
                <div className="space-y-2"><Label>Pontos</Label><Input type="number" value={editFormData.pontos_clube} onChange={(e) => setEditFormData({...editFormData, pontos_clube: parseInt(e.target.value)||0})} /></div>
                <div className="space-y-2"><Label>Coins</Label><Input type="number" value={editFormData.beauty_coins} onChange={(e) => setEditFormData({...editFormData, beauty_coins: parseInt(e.target.value)||0})} /></div>
              </div>
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2"><input type="checkbox" checked={editFormData.is_golden_doctor} onChange={(e) => setEditFormData({...editFormData, is_golden_doctor: e.target.checked})} />Golden Doctor</label>
                <label className="flex items-center gap-2 text-red-600"><input type="checkbox" checked={editFormData.account_suspended} onChange={(e) => setEditFormData({...editFormData, account_suspended: e.target.checked})} />Suspenso</label>
              </div>
              <div className="flex gap-3">
                <Button variant="outline" onClick={() => setEditingUser(null)} className="flex-1">Cancelar</Button>
                <Button onClick={() => updateMutation.mutate({ id: editingUser.id, data: editFormData })} disabled={updateMutation.isPending} className="flex-1 bg-[#D4AF37] text-white">{updateMutation.isPending ? 'Salvando...' : 'Salvar'}</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {selectedUser && <UserDetailsModal user={selectedUser} onClose={() => setSelectedUser(null)} />}
    </div>
  );
}