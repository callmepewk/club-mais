import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { GitBranch, Package, Calendar, CheckCircle, Zap, Sparkles, Send, Clock, AlertTriangle, Users } from "lucide-react";

export default function VersionsSection() {
  const queryClient = useQueryClient();
  const [showModal, setShowModal] = useState(false);
  const [generatingAI, setGeneratingAI] = useState(false);
  const [formData, setFormData] = useState({
    versao: "", tipo_release: "patch", changelog: "", mudancas_tecnicas: "",
    forcar_atualizacao: false, data_agendada: ""
  });
  

  const { data: versions = [] } = useQuery({
    queryKey: ['app-versions'],
    queryFn: () => base44.entities.AppVersion.list('-created_date'),
  });

  const { data: user } = useQuery({
    queryKey: ['current-user-control'],
    queryFn: () => base44.auth.me(),
  });

  const createMutation = useMutation({
    mutationFn: (data) => base44.entities.AppVersion.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['app-versions'] });
      setShowModal(false);
      setFormData({ versao: "", tipo_release: "patch", changelog: "", mudancas_tecnicas: "" });
    },
  });

  const publishMutation = useMutation({
    mutationFn: async ({ versionId, forceUpdate, notifyUsers }) => {
      const version = versions.find(v => v.id === versionId);
      const cacheVersion = Date.now().toString();
      
      await base44.entities.AppVersion.update(versionId, {
        status: 'publicada', 
        data_publicacao: new Date().toISOString(), 
        cache_version: cacheVersion,
        forcar_atualizacao: forceUpdate || false,
      });
      
      // If force update, notify all users
      if (notifyUsers) {
        const users = await base44.entities.User.list();
        const emailPromises = users.slice(0, 100).map(u => 
          base44.integrations.Core.SendEmail({
            to: u.email,
            subject: `🚀 Atualização v${version.versao} - Club da Beleza`,
            body: `
              <div style="font-family:Arial;max-width:600px;margin:0 auto">
                <div style="background:linear-gradient(135deg,#D4AF37,#C8A882);padding:30px;text-align:center;border-radius:10px 10px 0 0">
                  <h1 style="color:white;margin:0">🎉 Nova Versão Disponível!</h1>
                  <p style="color:white;margin:10px 0 0">v${version.versao}</p>
                </div>
                <div style="background:white;padding:30px;border-radius:0 0 10px 10px;box-shadow:0 4px 15px rgba(0,0,0,0.1)">
                  <p>Olá <strong>${u.full_name || 'Membro'}</strong>!</p>
                  <h3>O que há de novo:</h3>
                  <p style="background:#f5f5f5;padding:15px;border-radius:8px;white-space:pre-line">${version.changelog}</p>
                  <p style="margin-top:20px">Para garantir a melhor experiência, <strong>recarregue a página</strong> ou limpe o cache do navegador.</p>
                  <p style="text-align:center;margin:30px 0">
                    <a href="${window.location.origin}" style="background:linear-gradient(135deg,#D4AF37,#C8A882);color:white;padding:15px 40px;text-decoration:none;border-radius:30px;font-weight:bold;display:inline-block">Acessar Agora</a>
                  </p>
                </div>
              </div>
            `
          }).catch(() => {})
        );
        await Promise.all(emailPromises);
        
        await base44.entities.AppVersion.update(versionId, { usuarios_notificados: true });
      }
      
      return { cacheVersion };
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['app-versions'] }),
  });

  const scheduleMutation = useMutation({
    mutationFn: async ({ versionId, scheduledDate }) => {
      await base44.entities.AppVersion.update(versionId, {
        status: 'agendada',
        data_agendada: scheduledDate,
      });
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['app-versions'] }),
  });

  const [notifyingVersionId, setNotifyingVersionId] = useState(null);

  const notifyAllUsers = async (version) => {
    setNotifyingVersionId(version.id);
    try {
      const users = await base44.entities.User.list();
      const emailPromises = users.slice(0, 100).map(u => 
        base44.integrations.Core.SendEmail({
          to: u.email,
          subject: `🔔 Atualize seu Club da Beleza - v${version.versao}`,
          body: `
            <div style="font-family:Arial;max-width:600px;margin:0 auto">
              <div style="background:linear-gradient(135deg,#D4AF37,#C8A882);padding:30px;text-align:center;border-radius:10px 10px 0 0">
                <h1 style="color:white;margin:0">⚡ Atualização v${version.versao}</h1>
              </div>
              <div style="background:white;padding:30px;border-radius:0 0 10px 10px">
                <p>Olá <strong>${u.full_name || 'Membro'}</strong>!</p>
                <h3>O que há de novo:</h3>
                <p style="background:#f5f5f5;padding:15px;border-radius:8px">${version.changelog}</p>
                <p>Para continuar usando o Club da Beleza sem problemas:</p>
                <ol>
                  <li>Feche todas as abas do site</li>
                  <li>Limpe o cache (Ctrl+Shift+Del)</li>
                  <li>Acesse novamente</li>
                </ol>
                <p style="text-align:center;margin:20px 0">
                  <a href="${window.location.origin}?v=${Date.now()}" style="background:#D4AF37;color:white;padding:12px 30px;text-decoration:none;border-radius:25px;font-weight:bold">Acessar Site Atualizado</a>
                </p>
              </div>
            </div>
          `
        }).catch(() => {})
      );
      await Promise.all(emailPromises);
      await base44.entities.AppVersion.update(version.id, { usuarios_notificados: true });
      queryClient.invalidateQueries({ queryKey: ['app-versions'] });
      alert(`Notificação da v${version.versao} enviada para ${Math.min(users.length, 100)} usuários!`);
    } catch (e) {
      console.error(e);
      alert('Erro ao notificar usuários');
    }
    setNotifyingVersionId(null);
  };

  const handleGenerateAI = async () => {
    if (!formData.mudancas_tecnicas || !formData.versao) return;
    setGeneratingAI(true);
    try {
      const result = await base44.integrations.Core.InvokeLLM({
        prompt: `Transforme estas mudanças técnicas em descrição amigável para usuários:\n${formData.mudancas_tecnicas}\nVersão: ${formData.versao}`,
      });
      setFormData(prev => ({ ...prev, changelog: result }));
    } catch (e) { console.error(e); }
    setGeneratingAI(false);
  };

  return (
    <div className="space-y-6">
      <Card className="border-[#E8DCC4]">
        <CardHeader className="bg-gradient-to-r from-indigo-500 to-indigo-600 text-white rounded-t-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <GitBranch className="w-6 h-6" />
              <CardTitle>Sistema de Versões (CI/CD Interno)</CardTitle>
            </div>
            <Button onClick={() => setShowModal(true)} className="bg-white text-indigo-600 hover:bg-white/90">
              <Package className="w-4 h-4 mr-2" /> Nova Versão
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid md:grid-cols-4 gap-4 mb-6">
            {[
              { label: "Publicadas", value: versions.filter(v => v.status === 'publicada').length, color: "green" },
              { label: "Agendadas", value: versions.filter(v => v.status === 'agendada').length, color: "orange" },
              { label: "Desenvolvimento", value: versions.filter(v => v.status === 'em_desenvolvimento').length, color: "blue" },
              { label: "Versão Atual", value: versions[0]?.versao || '0.0.0', color: "indigo" },
            ].map((stat, i) => (
              <Card key={i} className={`border-${stat.color}-200 bg-${stat.color}-50`}>
                <CardContent className="p-4 text-center">
                  <div className={`text-2xl font-bold text-${stat.color}-600`}>{stat.value}</div>
                  <p className="text-sm text-gray-600">{stat.label}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="space-y-4">
            {versions.length === 0 ? (
              <div className="text-center py-12 bg-gray-50 rounded-lg">
                <Package className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">Nenhuma versão criada</p>
              </div>
            ) : versions.map((version) => (
              <Card key={version.id} className="border-gray-200">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-bold text-lg">v{version.versao}</h4>
                        <Badge className={
                          version.status === 'publicada' ? 'bg-green-100 text-green-800' :
                          version.status === 'agendada' ? 'bg-orange-100 text-orange-800' :
                          'bg-blue-100 text-blue-800'
                        }>{version.status}</Badge>
                        <Badge variant="outline">{version.tipo_release}</Badge>
                      </div>
                      <p className="text-gray-600 text-sm whitespace-pre-line">{version.changelog}</p>
                      <p className="text-xs text-gray-400 mt-2">
                        {new Date(version.created_date).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                    <div className="flex flex-col gap-2">
                      {version.status === 'em_desenvolvimento' && (
                        <>
                          <Button size="sm" onClick={() => publishMutation.mutate({ versionId: version.id, forceUpdate: true, notifyUsers: true })}
                            disabled={publishMutation.isPending}
                            className="bg-gradient-to-r from-red-500 to-red-600 text-white">
                            <Zap className="w-4 h-4 mr-1" /> Publicar + Notificar
                          </Button>
                          <Button size="sm" onClick={() => publishMutation.mutate({ versionId: version.id, forceUpdate: false, notifyUsers: false })}
                            disabled={publishMutation.isPending} variant="outline">
                            <CheckCircle className="w-4 h-4 mr-1" /> Publicar Silencioso
                          </Button>
                        </>
                      )}
                      {version.status === 'publicada' && !version.usuarios_notificados && (
                        <Button size="sm" onClick={() => notifyAllUsers(version)}
                          disabled={notifyingVersionId === version.id} variant="outline" className="border-orange-400 text-orange-600">
                          <Send className="w-4 h-4 mr-1" /> {notifyingVersionId === version.id ? 'Enviando...' : 'Notificar Usuários'}
                        </Button>
                      )}
                      {version.status === 'publicada' && version.usuarios_notificados && (
                        <Badge className="bg-green-100 text-green-700">
                          <Users className="w-3 h-3 mr-1" /> Notificados
                        </Badge>
                      )}
                      {version.status === 'agendada' && (
                        <Badge className="bg-orange-100 text-orange-700">
                          <Clock className="w-3 h-3 mr-1" /> {new Date(version.data_agendada).toLocaleString('pt-BR')}
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-lg">Nova Versão</DialogTitle>
            <DialogDescription className="text-xs">Crie uma nova versão do sistema</DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-3">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-sm">Versão</Label>
                <Input value={formData.versao} onChange={(e) => setFormData({...formData, versao: e.target.value})} placeholder="1.0.0" className="h-8 text-sm" />
              </div>
              <div className="space-y-1">
                <Label className="text-sm">Tipo</Label>
                <Select value={formData.tipo_release} onValueChange={(v) => setFormData({...formData, tipo_release: v})}>
                  <SelectTrigger className="h-8 text-sm"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="major">Major</SelectItem>
                    <SelectItem value="minor">Minor</SelectItem>
                    <SelectItem value="patch">Patch</SelectItem>
                    <SelectItem value="hotfix">Hotfix</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-1">
              <Label className="text-sm">Mudanças Técnicas</Label>
              <Textarea value={formData.mudancas_tecnicas} onChange={(e) => setFormData({...formData, mudancas_tecnicas: e.target.value})} placeholder="Descreva o que foi alterado..." className="h-16 text-sm" />
              <Button type="button" onClick={handleGenerateAI} disabled={generatingAI} variant="outline" size="sm" className="w-full text-xs">
                <Sparkles className="w-3 h-3 mr-1" /> {generatingAI ? 'Gerando...' : 'Gerar com IA'}
              </Button>
            </div>
            <div className="space-y-1">
              <Label className="text-sm">Changelog</Label>
              <Textarea value={formData.changelog} onChange={(e) => setFormData({...formData, changelog: e.target.value})} placeholder="Descrição amigável..." className="h-20 text-sm" />
            </div>
            
            <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-orange-600" />
                  <Label className="text-orange-800 font-medium text-xs">Forçar Atualização</Label>
                </div>
                <Switch 
                  checked={formData.forcar_atualizacao} 
                  onCheckedChange={(v) => setFormData({...formData, forcar_atualizacao: v})} 
                />
              </div>
              <p className="text-xs text-orange-700">Força atualização obrigatória para todos usuários.</p>
            </div>

            <div className="space-y-1">
              <Label className="flex items-center gap-2 text-sm">
                <Clock className="w-3 h-3" /> Agendar (opcional)
              </Label>
              <Input 
                type="datetime-local" 
                value={formData.data_agendada} 
                onChange={(e) => setFormData({...formData, data_agendada: e.target.value})}
                className="h-8 text-sm"
              />
            </div>

            <div className="flex gap-2 pt-2">
              <Button variant="outline" onClick={() => setShowModal(false)} size="sm" className="flex-1">Cancelar</Button>
              <Button onClick={() => createMutation.mutate({ 
                ...formData, 
                status: formData.data_agendada ? 'agendada' : 'em_desenvolvimento', 
                criado_por: user?.email 
              })} 
                disabled={createMutation.isPending} size="sm" className="flex-1 bg-indigo-600 text-white">
                {createMutation.isPending ? 'Criando...' : formData.data_agendada ? 'Criar e Agendar' : 'Criar'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}