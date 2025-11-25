import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Clock, UserPlus, Zap, Edit, Trash2 } from "lucide-react";

const planLabels = { none: "Sem Plano", light: "Light", gold: "Gold", vip: "VIP", basic: "Basic", pro: "Pro", exclusive: "Exclusive", premium: "Premium" };

export default function TestAccountsSection() {
  const queryClient = useQueryClient();
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    full_name: "", email: "", telefone: "", password: "", tipo_usuario: "paciente",
    clube_plano: "none", beauty_club_plano: "none", edbeauty_plano: "none", is_golden_doctor: false
  });

  const { data: users = [] } = useQuery({
    queryKey: ['all-users'],
    queryFn: async () => { const { data } = await base44.entities.User.list('-created_date'); return data || []; },
  });

  const testUsers = users.filter(u => u.is_test_account);
  const expiredCount = testUsers.filter(u => u.test_expiration_date && new Date(u.test_expiration_date) <= new Date()).length;

  const createMutation = useMutation({
    mutationFn: async (data) => {
      const expDate = new Date(); expDate.setDate(expDate.getDate() + 7);
      await base44.integrations.Core.SendEmail({
        to: data.email,
        subject: '🎉 Conta Teste Club da Beleza (7 dias)',
        body: `<h2>Olá ${data.full_name}!</h2><p>Email: ${data.email}</p><p>Senha: ${data.password}</p><p>Expira: ${expDate.toLocaleDateString('pt-BR')}</p>`
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['all-users'] });
      setShowModal(false);
      setFormData({ full_name: "", email: "", telefone: "", password: "", tipo_usuario: "paciente", clube_plano: "none", beauty_club_plano: "none", edbeauty_plano: "none", is_golden_doctor: false });
    },
  });

  const checkExpiredMutation = useMutation({
    mutationFn: async () => {
      const expired = testUsers.filter(u => u.test_expiration_date && new Date(u.test_expiration_date) <= new Date() && !u.test_expiration_notified);
      for (const acc of expired) {
        await base44.entities.User.update(acc.id, { test_expiration_notified: true, account_suspended: true });
      }
      return expired.length;
    },
    onSuccess: (count) => {
      queryClient.invalidateQueries({ queryKey: ['all-users'] });
      alert(count > 0 ? `${count} conta(s) expirada(s) suspensa(s)` : 'Nenhuma conta expirada');
    },
  });

  return (
    <div className="space-y-6">
      <Card className="border-[#E8DCC4]">
        <CardHeader className="bg-gradient-to-r from-green-500 to-green-600 text-white rounded-t-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Clock className="w-6 h-6" />
              <CardTitle>Contas Teste (7 dias)</CardTitle>
            </div>
            <div className="flex gap-2">
              <Button onClick={() => checkExpiredMutation.mutate()} disabled={checkExpiredMutation.isPending} className="bg-white/20 text-white hover:bg-white/30">
                <Zap className="w-4 h-4 mr-2" /> Verificar Expirados
              </Button>
              <Button onClick={() => setShowModal(true)} className="bg-white text-green-600 hover:bg-white/90">
                <UserPlus className="w-4 h-4 mr-2" /> Nova Conta
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid md:grid-cols-3 gap-4 mb-6">
            <Card className="border-green-200 bg-green-50"><CardContent className="p-4 text-center"><div className="text-2xl font-bold text-green-600">{testUsers.length}</div><p className="text-sm text-gray-600">Contas Teste</p></CardContent></Card>
            <Card className="border-red-200 bg-red-50"><CardContent className="p-4 text-center"><div className="text-2xl font-bold text-red-600">{expiredCount}</div><p className="text-sm text-gray-600">Expiradas</p></CardContent></Card>
            <Card className="border-blue-200 bg-blue-50"><CardContent className="p-4 text-center"><div className="text-2xl font-bold text-blue-600">{testUsers.length - expiredCount}</div><p className="text-sm text-gray-600">Válidas</p></CardContent></Card>
          </div>

          {testUsers.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-lg"><Clock className="w-12 h-12 text-gray-300 mx-auto mb-4" /><p className="text-gray-500">Nenhuma conta teste</p></div>
          ) : (
            <Table>
              <TableHeader><TableRow><TableHead>Nome</TableHead><TableHead>Email</TableHead><TableHead>Tipo</TableHead><TableHead>Expira</TableHead><TableHead>Status</TableHead></TableRow></TableHeader>
              <TableBody>
                {testUsers.map((u) => {
                  const isExpired = u.test_expiration_date && new Date(u.test_expiration_date) <= new Date();
                  return (
                    <TableRow key={u.id} className={isExpired ? 'bg-red-50' : ''}>
                      <TableCell className="font-medium">{u.full_name}</TableCell>
                      <TableCell>{u.email}</TableCell>
                      <TableCell><Badge className="bg-blue-100 text-blue-800">{u.tipo_usuario}</Badge></TableCell>
                      <TableCell>{u.test_expiration_date ? new Date(u.test_expiration_date).toLocaleDateString('pt-BR') : 'N/A'}</TableCell>
                      <TableCell><Badge className={isExpired ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}>{isExpired ? 'Expirada' : 'Ativa'}</Badge></TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader><DialogTitle>Nova Conta Teste</DialogTitle></DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2"><Label>Nome</Label><Input value={formData.full_name} onChange={(e) => setFormData({...formData, full_name: e.target.value})} /></div>
              <div className="space-y-2"><Label>Email</Label><Input value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} /></div>
              <div className="space-y-2"><Label>Telefone</Label><Input value={formData.telefone} onChange={(e) => setFormData({...formData, telefone: e.target.value})} /></div>
              <div className="space-y-2"><Label>Senha</Label><Input value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} /></div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2"><Label>Tipo</Label><Select value={formData.tipo_usuario} onValueChange={(v) => setFormData({...formData, tipo_usuario: v})}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="paciente">Paciente</SelectItem><SelectItem value="profissional">Profissional</SelectItem></SelectContent></Select></div>
              <div className="space-y-2"><Label>Club Plano</Label><Select value={formData.clube_plano} onValueChange={(v) => setFormData({...formData, clube_plano: v})}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{Object.entries(planLabels).map(([k,v]) => <SelectItem key={k} value={k}>{v}</SelectItem>)}</SelectContent></Select></div>
              <div className="space-y-2"><Label>Clube+ Plano</Label><Select value={formData.beauty_club_plano} onValueChange={(v) => setFormData({...formData, beauty_club_plano: v})}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{Object.entries(planLabels).map(([k,v]) => <SelectItem key={k} value={k}>{v}</SelectItem>)}</SelectContent></Select></div>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setShowModal(false)} className="flex-1">Cancelar</Button>
              <Button onClick={() => createMutation.mutate(formData)} disabled={createMutation.isPending} className="flex-1 bg-green-600 text-white">
                {createMutation.isPending ? 'Criando...' : 'Criar Conta'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}