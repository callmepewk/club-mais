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
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { GitBranch, Package, Calendar, CheckCircle, Zap, Sparkles } from "lucide-react";

export default function VersionsSection() {
  const queryClient = useQueryClient();
  const [showModal, setShowModal] = useState(false);
  const [generatingAI, setGeneratingAI] = useState(false);
  const [formData, setFormData] = useState({
    versao: "", tipo_release: "patch", changelog: "", mudancas_tecnicas: ""
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
    mutationFn: async (versionId) => {
      const version = versions.find(v => v.id === versionId);
      await base44.entities.AppVersion.update(versionId, {
        status: 'publicada', data_publicacao: new Date().toISOString(), cache_version: Date.now().toString(),
      });
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['app-versions'] }),
  });

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
                    {version.status === 'em_desenvolvimento' && (
                      <Button size="sm" onClick={() => publishMutation.mutate(version.id)}
                        className="bg-gradient-to-r from-red-500 to-red-600 text-white">
                        <Zap className="w-4 h-4 mr-1" /> Publicar
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Nova Versão</DialogTitle>
            <DialogDescription>Crie uma nova versão do sistema</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Versão</Label>
                <Input value={formData.versao} onChange={(e) => setFormData({...formData, versao: e.target.value})} placeholder="1.0.0" />
              </div>
              <div className="space-y-2">
                <Label>Tipo</Label>
                <Select value={formData.tipo_release} onValueChange={(v) => setFormData({...formData, tipo_release: v})}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="major">Major</SelectItem>
                    <SelectItem value="minor">Minor</SelectItem>
                    <SelectItem value="patch">Patch</SelectItem>
                    <SelectItem value="hotfix">Hotfix</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Mudanças Técnicas (para IA)</Label>
              <Textarea value={formData.mudancas_tecnicas} onChange={(e) => setFormData({...formData, mudancas_tecnicas: e.target.value})} placeholder="Descreva o que foi alterado..." className="h-20" />
              <Button type="button" onClick={handleGenerateAI} disabled={generatingAI} variant="outline" className="w-full">
                <Sparkles className="w-4 h-4 mr-2" /> {generatingAI ? 'Gerando...' : 'Gerar com IA'}
              </Button>
            </div>
            <div className="space-y-2">
              <Label>Changelog (descrição para usuários)</Label>
              <Textarea value={formData.changelog} onChange={(e) => setFormData({...formData, changelog: e.target.value})} placeholder="Descrição amigável..." className="h-32" />
            </div>
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setShowModal(false)} className="flex-1">Cancelar</Button>
              <Button onClick={() => createMutation.mutate({ ...formData, status: 'em_desenvolvimento', criado_por: user?.email })} 
                disabled={createMutation.isPending} className="flex-1 bg-indigo-600 text-white">
                {createMutation.isPending ? 'Criando...' : 'Criar'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}