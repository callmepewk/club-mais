
import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar as CalendarIcon, MapPin, Users, ExternalLink,
  Plus, X, CheckCircle, Clock, Sparkles
} from "lucide-react";

export default function Eventos() {
  const queryClient = useQueryClient();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState({
    titulo: "",
    descricao: "",
    imagem: "",
    data_evento: "",
    local: "",
    publico_alvo: "todos",
    link_inscricao: "",
    vagas: 0,
    status: "ativo"
  });

  const { data: user } = useQuery({
    queryKey: ['current-user'],
    queryFn: async () => {
      try {
        return await base44.auth.me();
      } catch (error) {
        return null;
      }
    },
  });

  const { data: eventos = [], isLoading } = useQuery({
    queryKey: ['eventos'],
    queryFn: () => base44.entities.Evento.filter({ status: 'ativo' }, '-data_evento'),
    initialData: [],
  });

  const createEventoMutation = useMutation({
    mutationFn: async (data) => {
      const evento = await base44.entities.Evento.create(data);
      
      // Enviar notificações por email
      const { data: usuarios } = await base44.entities.User.list();
      const usuariosAlvo = usuarios.filter(u => 
        data.publico_alvo === 'todos' || u.tipo_usuario === data.publico_alvo
      );

      // Enviar email para cada usuário
      for (const usuario of usuariosAlvo) {
        await base44.integrations.Core.SendEmail({
          to: usuario.email,
          subject: `🎉 Novo Evento: ${data.titulo}`,
          body: `
            <h2>Olá ${usuario.full_name}!</h2>
            <p>Temos um novo evento exclusivo para você no Club da Beleza!</p>
            <hr/>
            <h3>${data.titulo}</h3>
            <p>${data.descricao}</p>
            <p><strong>📅 Data:</strong> ${new Date(data.data_evento).toLocaleString('pt-BR')}</p>
            <p><strong>📍 Local:</strong> ${data.local}</p>
            ${data.vagas ? `<p><strong>👥 Vagas:</strong> ${data.vagas}</p>` : ''}
            ${data.link_inscricao ? `<p><a href="${data.link_inscricao}" style="background: linear-gradient(to right, #D4AF37, #C8A882); color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; display: inline-block; margin-top: 16px;">Inscrever-se Agora</a></p>` : ''}
            <hr/>
            <p><small>Club da Beleza - Seu clube de benefícios</small></p>
          `
        });
      }

      return evento;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['eventos'] });
      setShowCreateForm(false);
      setFormData({
        titulo: "",
        descricao: "",
        imagem: "",
        data_evento: "",
        local: "",
        publico_alvo: "todos",
        link_inscricao: "",
        vagas: 0,
        status: "ativo"
      });
      alert('Evento criado e notificações enviadas com sucesso!');
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    createEventoMutation.mutate(formData);
  };

  const isAdmin = user?.role === 'admin';

  // Todos podem ver eventos - sem restrição por tipo de usuário
  const eventosVisiveis = eventos;

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-[#F5EFE6] to-white">
      {/* Hero Section */}
      <div className="relative py-20 px-6 overflow-hidden bg-gradient-to-br from-[#D4AF37] via-[#C8A882] to-[#D4AF37]">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNiIgc3Ryb2tlPSIjRkZGIiBzdHJva2Utd2lkdGg9IjIiIG9wYWNpdHk9Ii4xIi8+PC9nPjwvc3ZnPg==')] opacity-10"></div>

        <div className="relative z-10 max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center space-y-8"
          >
            <motion.div
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="inline-block"
            >
              <CalendarIcon className="w-24 h-24 text-white mx-auto" />
            </motion.div>

            <div className="space-y-4">
              <Badge className="bg-white/20 text-white border-white/30 px-4 py-2 text-base backdrop-blur-sm">
                Exclusivo para Membros
              </Badge>

              <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight">
                Eventos
              </h1>

              <p className="text-2xl md:text-3xl text-white/90 font-medium">
                Experiências Exclusivas do Club da Beleza
              </p>
            </div>

            {isAdmin && (
              <Button
                onClick={() => setShowCreateForm(!showCreateForm)}
                size="lg"
                className="bg-white text-[#D4AF37] hover:bg-white/90 shadow-2xl hover:shadow-3xl transition-all duration-300 px-8 py-6 text-lg font-semibold group"
              >
                <Plus className="w-5 h-5 mr-2" />
                Criar Novo Evento
              </Button>
            )}
          </motion.div>
        </div>
      </div>

      <div className="py-16 px-6">
        <div className="max-w-7xl mx-auto space-y-12">
          {/* Create Form */}
          <AnimatePresence>
            {showCreateForm && isAdmin && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Card className="border-[#E8DCC4] shadow-2xl">
                  <CardHeader className="bg-gradient-to-r from-[#F5EFE6] to-[#E8DCC4]">
                    <div className="flex items-center justify-between">
                      <CardTitle className="font-serif text-2xl text-gray-800">
                        Criar Novo Evento
                      </CardTitle>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setShowCreateForm(false)}
                      >
                        <X className="w-5 h-5" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="p-8">
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Título do Evento *</Label>
                          <Input
                            value={formData.titulo}
                            onChange={(e) => setFormData({...formData, titulo: e.target.value})}
                            required
                            className="border-[#E8DCC4]"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label>Data e Hora *</Label>
                          <Input
                            type="datetime-local"
                            value={formData.data_evento}
                            onChange={(e) => setFormData({...formData, data_evento: e.target.value})}
                            required
                            className="border-[#E8DCC4]"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label>Descrição *</Label>
                        <Textarea
                          value={formData.descricao}
                          onChange={(e) => setFormData({...formData, descricao: e.target.value})}
                          required
                          className="border-[#E8DCC4] h-32"
                        />
                      </div>

                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Local</Label>
                          <Input
                            value={formData.local}
                            onChange={(e) => setFormData({...formData, local: e.target.value})}
                            className="border-[#E8DCC4]"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label>Número de Vagas</Label>
                          <Input
                            type="number"
                            value={formData.vagas}
                            onChange={(e) => setFormData({...formData, vagas: parseInt(e.target.value)})}
                            className="border-[#E8DCC4]"
                          />
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Público Alvo *</Label>
                          <Select 
                            value={formData.publico_alvo} 
                            onValueChange={(value) => setFormData({...formData, publico_alvo: value})}
                          >
                            <SelectTrigger className="border-[#E8DCC4]">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="todos">Todos</SelectItem>
                              <SelectItem value="paciente">Pacientes</SelectItem>
                              <SelectItem value="profissional">Profissionais</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label>Link de Inscrição</Label>
                          <Input
                            type="url"
                            value={formData.link_inscricao}
                            onChange={(e) => setFormData({...formData, link_inscricao: e.target.value})}
                            className="border-[#E8DCC4]"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label>URL da Imagem</Label>
                        <Input
                          type="url"
                          value={formData.imagem}
                          onChange={(e) => setFormData({...formData, imagem: e.target.value})}
                          className="border-[#E8DCC4]"
                        />
                      </div>

                      <Button
                        type="submit"
                        disabled={createEventoMutation.isPending}
                        className="w-full bg-gradient-to-r from-[#D4AF37] to-[#C8A882] text-white py-6 text-lg font-semibold"
                      >
                        {createEventoMutation.isPending ? (
                          <>
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" />
                            Criando e enviando notificações...
                          </>
                        ) : (
                          <>
                            <Plus className="w-5 h-5 mr-2" />
                            Criar Evento e Notificar Usuários
                          </>
                        )}
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Events List */}
          {isLoading ? (
            <div className="text-center py-20">
              <div className="animate-spin w-12 h-12 border-4 border-[#D4AF37] border-t-transparent rounded-full mx-auto"></div>
              <p className="text-gray-600 mt-4">Carregando eventos...</p>
            </div>
          ) : eventosVisiveis.length === 0 ? (
            <div className="text-center py-20">
              <CalendarIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-xl text-gray-600">Nenhum evento disponível no momento</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {eventosVisiveis.map((evento, index) => (
                <motion.div
                  key={evento.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <Card className="h-full border-[#E8DCC4] hover:border-[#D4AF37] transition-all duration-300 hover:shadow-2xl group">
                    {evento.imagem && (
                      <div className="relative h-48 overflow-hidden">
                        <img
                          src={evento.imagem}
                          alt={evento.titulo}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                        
                        <div className="absolute top-4 left-4">
                          <Badge className="bg-gradient-to-r from-[#D4AF37] to-[#C8A882] text-white border-0">
                            {evento.publico_alvo === 'todos' ? 'Para Todos' : 
                             evento.publico_alvo === 'paciente' ? 'Pacientes' : 'Profissionais'}
                          </Badge>
                        </div>
                      </div>
                    )}

                    <CardContent className="p-6 space-y-4">
                      <div>
                        <h3 className="font-serif text-2xl font-bold text-gray-800 mb-2">
                          {evento.titulo}
                        </h3>
                        <p className="text-gray-600 line-clamp-3">
                          {evento.descricao}
                        </p>
                      </div>

                      <div className="space-y-2 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-[#D4AF37]" />
                          <span>{new Date(evento.data_evento).toLocaleString('pt-BR')}</span>
                        </div>

                        {evento.local && (
                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-[#D4AF37]" />
                            <span>{evento.local}</span>
                          </div>
                        )}

                        {evento.vagas > 0 && (
                          <div className="flex items-center gap-2">
                            <Users className="w-4 h-4 text-[#D4AF37]" />
                            <span>{evento.vagas} vagas disponíveis</span>
                          </div>
                        )}
                      </div>

                      {evento.link_inscricao && (
                        <a
                          href={evento.link_inscricao}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block"
                        >
                          <Button className="w-full bg-gradient-to-r from-[#D4AF37] to-[#C8A882] text-white group">
                            Inscrever-se
                            <ExternalLink className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                          </Button>
                        </a>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
