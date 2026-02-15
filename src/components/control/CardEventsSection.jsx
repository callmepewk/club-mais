import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, Plus, Edit, Trash, Users, MapPin, Clock, Sparkles } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export default function CardEventsSection() {
  const [showModal, setShowModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [loadingAI, setLoadingAI] = useState(false);
  const [formData, setFormData] = useState({
    titulo: "", descricao: "", data_hora: "", localizacao: "",
    tipo_inscricao: "gratuito", valor_inscricao: 0, imagem: "",
    vagas_totais: 50, tipos_cartao_permitidos: ["basic", "pro", "exclusive"]
  });
  const queryClient = useQueryClient();

  const { data: events = [] } = useQuery({
    queryKey: ['card-events-admin'],
    queryFn: () => base44.entities.CardEvent.list('-data_hora'),
  });

  const createMutation = useMutation({
    mutationFn: (data) => base44.entities.CardEvent.create({
      ...data,
      vagas_disponiveis: data.vagas_totais,
      ativo: true
    }),
    onSuccess: () => {
      queryClient.invalidateQueries(['card-events-admin']);
      setShowModal(false);
      resetForm();
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.CardEvent.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['card-events-admin']);
      setShowModal(false);
      resetForm();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.CardEvent.delete(id),
    onSuccess: () => queryClient.invalidateQueries(['card-events-admin']),
  });

  const resetForm = () => {
    setFormData({
      titulo: "", descricao: "", data_hora: "", localizacao: "",
      tipo_inscricao: "gratuito", valor_inscricao: 0, imagem: "",
      vagas_totais: 50, tipos_cartao_permitidos: ["basic", "pro", "exclusive"]
    });
    setEditingEvent(null);
  };

  const handleGenerateTitleWithAI = async () => {
    if (!formData.descricao) {
      alert('Preencha a descrição primeiro');
      return;
    }
    setLoadingAI(true);
    try {
      const result = await base44.integrations.Core.InvokeLLM({
        prompt: `Com base nesta descrição de evento do cartão Beauty Club: "${formData.descricao}", crie um título chamativo e profissional de no máximo 60 caracteres.`,
      });
      setFormData(prev => ({ ...prev, titulo: result }));
    } catch (error) {
      console.error('Erro ao gerar título:', error);
      alert('Erro ao gerar título. Tente novamente.');
    }
    setLoadingAI(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingEvent) {
      updateMutation.mutate({ id: editingEvent.id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleEdit = (event) => {
    setEditingEvent(event);
    setFormData({
      titulo: event.titulo,
      descricao: event.descricao,
      data_hora: event.data_hora,
      localizacao: event.localizacao,
      tipo_inscricao: event.tipo_inscricao,
      valor_inscricao: event.valor_inscricao || 0,
      imagem: event.imagem || "",
      vagas_totais: event.vagas_totais,
      tipos_cartao_permitidos: event.tipos_cartao_permitidos
    });
    setShowModal(true);
  };

  const toggleCardType = (type) => {
    const current = formData.tipos_cartao_permitidos;
    if (current.includes(type)) {
      setFormData({
        ...formData,
        tipos_cartao_permitidos: current.filter(t => t !== type)
      });
    } else {
      setFormData({
        ...formData,
        tipos_cartao_permitidos: [...current, type]
      });
    }
  };

  return (
    <div className="space-y-6">
      <Card className="border-[#E8DCC4]">
        <CardHeader className="bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-t-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Calendar className="w-6 h-6" />
              <CardTitle>Eventos do Cartão Beauty Club</CardTitle>
            </div>
            <Button onClick={() => { resetForm(); setShowModal(true); }} className="bg-white text-purple-600 hover:bg-white/90">
              <Plus className="w-4 h-4 mr-2" /> Criar Evento
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-4">
            {events.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <Calendar className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Nenhum evento criado</p>
              </div>
            ) : events.map((event) => (
              <Card key={event.id} className="border-gray-200">
                <CardContent className="p-4">
                  <div className="flex justify-between items-start gap-4">
                    <div className="flex-1 space-y-2">
                      <div className="flex items-start justify-between">
                        <h4 className="font-bold text-lg">{event.titulo}</h4>
                        <Badge className={event.ativo ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                          {event.ativo ? 'Ativo' : 'Inativo'}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 line-clamp-2">{event.descricao}</p>
                      <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {format(new Date(event.data_hora), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          {event.localizacao}
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          {event.vagas_disponiveis || 0}/{event.vagas_totais} vagas
                        </div>
                      </div>
                      <div className="flex gap-2 flex-wrap">
                        <Badge variant="outline">{event.tipo_inscricao}</Badge>
                        {event.valor_inscricao > 0 && (
                          <Badge className="bg-blue-100 text-blue-800">R$ {event.valor_inscricao}</Badge>
                        )}
                        {event.tipos_cartao_permitidos.map(type => (
                          <Badge key={type} className="bg-purple-100 text-purple-800">{type}</Badge>
                        ))}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button onClick={() => handleEdit(event)} size="sm" variant="outline">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button onClick={() => deleteMutation.mutate(event.id)} size="sm" variant="outline" className="text-red-600">
                        <Trash className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingEvent ? 'Editar Evento' : 'Criar Novo Evento'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="p-3 bg-purple-50 rounded-lg border border-purple-200 mb-4">
              <p className="text-sm text-purple-800 font-medium">💡 Dica: Use a IA para gerar um título profissional a partir da descrição!</p>
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <Label>Título</Label>
                {formData.descricao && !formData.titulo && (
                  <Button
                    type="button"
                    onClick={handleGenerateTitleWithAI}
                    disabled={loadingAI}
                    variant="outline"
                    size="sm"
                  >
                    <Sparkles className="w-3 h-3 mr-1" />
                    {loadingAI ? 'Gerando...' : 'Gerar com IA'}
                  </Button>
                )}
              </div>
              <Input value={formData.titulo} onChange={(e) => setFormData({...formData, titulo: e.target.value})} required />
            </div>
            <div>
              <Label>Descrição</Label>
              <Textarea value={formData.descricao} onChange={(e) => setFormData({...formData, descricao: e.target.value})} required className="h-24" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Data e Hora</Label>
                <Input type="datetime-local" value={formData.data_hora} onChange={(e) => setFormData({...formData, data_hora: e.target.value})} required />
              </div>
              <div>
                <Label>Localização</Label>
                <Input value={formData.localizacao} onChange={(e) => setFormData({...formData, localizacao: e.target.value})} required />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Tipo de Inscrição</Label>
                <Select value={formData.tipo_inscricao} onValueChange={(v) => setFormData({...formData, tipo_inscricao: v})}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="gratuito">Gratuito</SelectItem>
                    <SelectItem value="beneficio_basic">Benefício Basic</SelectItem>
                    <SelectItem value="beneficio_pro">Benefício Pro</SelectItem>
                    <SelectItem value="beneficio_exclusive">Benefício Exclusive</SelectItem>
                    <SelectItem value="pago">Pago</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Valor (se pago)</Label>
                <Input type="number" step="0.01" value={formData.valor_inscricao} onChange={(e) => setFormData({...formData, valor_inscricao: parseFloat(e.target.value) || 0})} />
              </div>
            </div>
            <div>
              <Label>URL da Imagem</Label>
              <Input value={formData.imagem} onChange={(e) => setFormData({...formData, imagem: e.target.value})} placeholder="https://..." />
            </div>
            <div>
              <Label>Total de Vagas</Label>
              <Input type="number" value={formData.vagas_totais} onChange={(e) => setFormData({...formData, vagas_totais: parseInt(e.target.value) || 50})} required />
            </div>
            <div>
              <Label>Tipos de Cartão Permitidos</Label>
              <div className="flex gap-3 mt-2">
                {['basic', 'pro', 'exclusive'].map(type => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => toggleCardType(type)}
                    className={`px-4 py-2 rounded-lg border-2 transition-all ${
                      formData.tipos_cartao_permitidos.includes(type)
                        ? 'border-purple-500 bg-purple-50 text-purple-700'
                        : 'border-gray-200 text-gray-600'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex gap-3">
              <Button type="button" onClick={() => setShowModal(false)} variant="outline" className="flex-1">Cancelar</Button>
              <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending} className="flex-1 bg-purple-600 text-white">
                {createMutation.isPending || updateMutation.isPending ? 'Salvando...' : editingEvent ? 'Atualizar' : 'Criar'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}