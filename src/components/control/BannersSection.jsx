import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Megaphone, Ban, CheckCircle, Trash2 } from "lucide-react";

export default function BannersSection() {
  const queryClient = useQueryClient();
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    titulo: "", descricao: "", imagem: "", link_acao: "", texto_botao: "", duracao_minima: 5,
    tipo_banner: "informativo", publico_alvo: "todos", status: "ativo", prioridade: 1
  });

  const { data: banners = [] } = useQuery({
    queryKey: ['all-banners'],
    queryFn: () => base44.entities.Banner.list('-created_date'),
  });

  const createMutation = useMutation({
    mutationFn: (data) => base44.entities.Banner.create(data),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['all-banners'] }); setShowModal(false); setFormData({ titulo: "", descricao: "", imagem: "", link_acao: "", texto_botao: "", duracao_minima: 5, tipo_banner: "informativo", publico_alvo: "todos", status: "ativo", prioridade: 1 }); },
  });

  const toggleMutation = useMutation({
    mutationFn: ({ id, status }) => base44.entities.Banner.update(id, { status: status === 'ativo' ? 'inativo' : 'ativo' }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['all-banners'] }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.Banner.delete(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['all-banners'] }),
  });

  const totalViews = banners.reduce((s, b) => s + (b.visualizacoes || 0), 0);
  const totalClicks = banners.reduce((s, b) => s + (b.cliques || 0), 0);

  return (
    <div className="space-y-6">
      <Card className="border-[#E8DCC4]">
        <CardHeader className="bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-t-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3"><Megaphone className="w-6 h-6" /><CardTitle>Banners e Anúncios</CardTitle></div>
            <Button onClick={() => setShowModal(true)} className="bg-white text-purple-600 hover:bg-white/90"><Megaphone className="w-4 h-4 mr-2" /> Novo Banner</Button>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid md:grid-cols-4 gap-4 mb-6">
            <Card className="border-purple-200 bg-purple-50"><CardContent className="p-4 text-center"><div className="text-2xl font-bold text-purple-600">{banners.filter(b => b.status === 'ativo').length}</div><p className="text-sm text-gray-600">Ativos</p></CardContent></Card>
            <Card className="border-green-200 bg-green-50"><CardContent className="p-4 text-center"><div className="text-2xl font-bold text-green-600">{totalViews}</div><p className="text-sm text-gray-600">Visualizações</p></CardContent></Card>
            <Card className="border-blue-200 bg-blue-50"><CardContent className="p-4 text-center"><div className="text-2xl font-bold text-blue-600">{totalClicks}</div><p className="text-sm text-gray-600">Cliques</p></CardContent></Card>
            <Card className="border-orange-200 bg-orange-50"><CardContent className="p-4 text-center"><div className="text-2xl font-bold text-orange-600">{totalViews > 0 ? ((totalClicks / totalViews) * 100).toFixed(1) : 0}%</div><p className="text-sm text-gray-600">CTR</p></CardContent></Card>
          </div>

          {banners.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-lg"><Megaphone className="w-12 h-12 text-gray-300 mx-auto mb-4" /><p className="text-gray-500">Nenhum banner criado</p></div>
          ) : (
            <Table>
              <TableHeader><TableRow><TableHead>Título</TableHead><TableHead>Tipo</TableHead><TableHead>Status</TableHead><TableHead>Views</TableHead><TableHead>Cliques</TableHead><TableHead>Ações</TableHead></TableRow></TableHeader>
              <TableBody>
                {banners.map((b) => (
                  <TableRow key={b.id}>
                    <TableCell className="font-medium">{b.titulo}</TableCell>
                    <TableCell><Badge className={b.tipo_banner === 'urgente' ? 'bg-red-100 text-red-800' : b.tipo_banner === 'promocional' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'}>{b.tipo_banner}</Badge></TableCell>
                    <TableCell><Badge className={b.status === 'ativo' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>{b.status}</Badge></TableCell>
                    <TableCell>{b.visualizacoes || 0}</TableCell>
                    <TableCell>{b.cliques || 0}</TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button size="sm" variant="outline" onClick={() => toggleMutation.mutate({ id: b.id, status: b.status })}>{b.status === 'ativo' ? <Ban className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}</Button>
                        <Button size="sm" variant="outline" className="text-red-600" onClick={() => deleteMutation.mutate(b.id)}><Trash2 className="w-4 h-4" /></Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>Novo Banner</DialogTitle></DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2"><Label>Título</Label><Input value={formData.titulo} onChange={(e) => setFormData({...formData, titulo: e.target.value})} /></div>
              <div className="space-y-2"><Label>Tipo</Label><Select value={formData.tipo_banner} onValueChange={(v) => setFormData({...formData, tipo_banner: v})}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="informativo">Informativo</SelectItem><SelectItem value="promocional">Promocional</SelectItem><SelectItem value="urgente">Urgente</SelectItem></SelectContent></Select></div>
            </div>
            <div className="space-y-2"><Label>Descrição</Label><Textarea value={formData.descricao} onChange={(e) => setFormData({...formData, descricao: e.target.value})} /></div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2"><Label>URL Imagem</Label><Input value={formData.imagem} onChange={(e) => setFormData({...formData, imagem: e.target.value})} /></div>
              <div className="space-y-2"><Label>Link Ação</Label><Input value={formData.link_acao} onChange={(e) => setFormData({...formData, link_acao: e.target.value})} /></div>
              <div className="space-y-2"><Label>Texto Botão</Label><Input value={formData.texto_botao} onChange={(e) => setFormData({...formData, texto_botao: e.target.value})} /></div>
              <div className="space-y-2"><Label>Duração (seg)</Label><Input type="number" value={formData.duracao_minima} onChange={(e) => setFormData({...formData, duracao_minima: parseInt(e.target.value)})} /></div>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setShowModal(false)} className="flex-1">Cancelar</Button>
              <Button onClick={() => createMutation.mutate(formData)} disabled={createMutation.isPending} className="flex-1 bg-purple-600 text-white">{createMutation.isPending ? 'Criando...' : 'Criar'}</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}