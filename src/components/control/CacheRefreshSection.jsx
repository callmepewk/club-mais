import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RefreshCw, Send, CheckCircle, Users } from "lucide-react";

export default function CacheRefreshSection() {
  const queryClient = useQueryClient();
  const [refreshing, setRefreshing] = useState(false);
  const [notifying, setNotifying] = useState(false);
  const [lastRefresh, setLastRefresh] = useState(localStorage.getItem('last_cache_refresh') || null);

  const { data: users = [] } = useQuery({
    queryKey: ['all-users'],
    queryFn: async () => { const { data } = await base44.entities.User.list(); return data || []; },
  });

  const forceRefreshAll = async () => {
    setRefreshing(true);
    const newVersion = Date.now().toString();
    localStorage.setItem('app_cache_version', newVersion);
    localStorage.setItem('last_cache_refresh', new Date().toISOString());
    setLastRefresh(new Date().toISOString());
    
    // Clear all caches
    if ('caches' in window) {
      const cacheNames = await caches.keys();
      await Promise.all(cacheNames.map(name => caches.delete(name)));
    }
    
    setRefreshing(false);
    alert('Cache local limpo! A página será recarregada.');
    window.location.reload(true);
  };

  const notifyUsersToRefresh = async () => {
    setNotifying(true);
    const newVersion = Date.now().toString();
    
    try {
      // Update app version to trigger refresh on all clients
      await base44.entities.AppVersion.create({
        versao: `refresh-${newVersion}`,
        tipo_release: 'hotfix',
        changelog: 'Atualização de cache para todos os usuários',
        status: 'publicada',
        data_publicacao: new Date().toISOString(),
        cache_version: newVersion,
      });

      // Send email to all users
      const emailPromises = users.slice(0, 50).map(user => 
        base44.integrations.Core.SendEmail({
          to: user.email,
          subject: '🔄 Atualize seu Club da Beleza',
          body: `
            <div style="font-family:Arial;max-width:600px;margin:0 auto">
              <div style="background:linear-gradient(to right,#D4AF37,#C8A882);padding:20px;text-align:center;border-radius:10px 10px 0 0">
                <h1 style="color:white;margin:0">🔄 Atualização Disponível</h1>
              </div>
              <div style="background:white;padding:30px;border-radius:0 0 10px 10px;box-shadow:0 4px 6px rgba(0,0,0,0.1)">
                <p>Olá <strong>${user.full_name || 'Usuário'}</strong>!</p>
                <p>O Club da Beleza recebeu atualizações importantes. Para garantir a melhor experiência:</p>
                <ol>
                  <li>Feche todas as abas do Club da Beleza</li>
                  <li>Limpe o cache do navegador (Ctrl+Shift+Del)</li>
                  <li>Acesse novamente: <a href="${window.location.origin}">${window.location.origin}</a></li>
                </ol>
                <p style="text-align:center;margin-top:20px">
                  <a href="${window.location.origin}" style="background:linear-gradient(to right,#D4AF37,#C8A882);color:white;padding:12px 30px;text-decoration:none;border-radius:8px;font-weight:bold">
                    Acessar Agora
                  </a>
                </p>
              </div>
            </div>
          `
        }).catch(() => {})
      );

      await Promise.all(emailPromises);
      alert(`Notificação enviada para ${Math.min(users.length, 50)} usuários!`);
    } catch (error) {
      console.error(error);
      alert('Erro ao notificar usuários');
    }
    
    setNotifying(false);
  };

  return (
    <div className="space-y-6">
      <Card className="border-[#E8DCC4]">
        <CardHeader className="bg-gradient-to-r from-cyan-500 to-cyan-600 text-white rounded-t-lg">
          <div className="flex items-center gap-3">
            <RefreshCw className="w-6 h-6" />
            <CardTitle>Atualização de Cache / URLs</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-800">
              <strong>Por que isso é importante?</strong><br />
              Quando você faz atualizações no sistema, alguns usuários podem continuar vendo versões antigas 
              devido ao cache do navegador. Use essas ferramentas para forçar todos a verem a versão mais recente.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <Card className="border-gray-200">
              <CardContent className="p-6 text-center space-y-4">
                <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-full flex items-center justify-center mx-auto">
                  <RefreshCw className="w-8 h-8 text-white" />
                </div>
                <h3 className="font-bold text-lg">Limpar Cache Local</h3>
                <p className="text-sm text-gray-600">
                  Limpa o cache do SEU navegador e recarrega com a versão mais recente.
                </p>
                {lastRefresh && (
                  <Badge variant="outline" className="text-xs">
                    Último: {new Date(lastRefresh).toLocaleString('pt-BR')}
                  </Badge>
                )}
                <Button 
                  onClick={forceRefreshAll} 
                  disabled={refreshing}
                  className="w-full bg-gradient-to-r from-cyan-500 to-cyan-600 text-white"
                >
                  {refreshing ? (
                    <><RefreshCw className="w-4 h-4 mr-2 animate-spin" /> Limpando...</>
                  ) : (
                    <><RefreshCw className="w-4 h-4 mr-2" /> Forçar Atualização</>
                  )}
                </Button>
              </CardContent>
            </Card>

            <Card className="border-gray-200">
              <CardContent className="p-6 text-center space-y-4">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto">
                  <Send className="w-8 h-8 text-white" />
                </div>
                <h3 className="font-bold text-lg">Notificar Todos Usuários</h3>
                <p className="text-sm text-gray-600">
                  Envia email para todos os usuários pedindo que atualizem o navegador.
                </p>
                <Badge className="bg-blue-100 text-blue-800">
                  <Users className="w-3 h-3 mr-1" /> {users.length} usuários
                </Badge>
                <Button 
                  onClick={notifyUsersToRefresh} 
                  disabled={notifying}
                  className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white"
                >
                  {notifying ? (
                    <><RefreshCw className="w-4 h-4 mr-2 animate-spin" /> Enviando...</>
                  ) : (
                    <><Send className="w-4 h-4 mr-2" /> Notificar Usuários</>
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>

          <div className="p-4 bg-gray-50 rounded-lg">
            <h4 className="font-medium mb-2">Dicas para usuários com problemas:</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• <strong>Ctrl + Shift + R</strong> - Recarrega ignorando cache</li>
              <li>• <strong>Ctrl + Shift + Del</strong> - Abre limpeza de dados do navegador</li>
              <li>• Modo anônimo/privado sempre carrega versão mais recente</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}