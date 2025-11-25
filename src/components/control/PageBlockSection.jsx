import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Lock, Unlock, AlertTriangle } from "lucide-react";

const allPages = [
  { id: "Home", name: "Página Inicial" },
  { id: "News", name: "Notícias" },
  { id: "Products", name: "Nossos Produtos" },
  { id: "BeautyCoin", name: "Beauty Coin" },
  { id: "DrBeleza", name: "Dr. Beleza" },
  { id: "MapaDaEstetica", name: "Mapa da Estética" },
  { id: "EdBeauty", name: "EdBeauty" },
  { id: "GoldenDoctors", name: "Golden Doctors" },
  { id: "ClubePlus", name: "Clube+" },
  { id: "Eventos", name: "Eventos" },
  { id: "Plans", name: "Planos" },
  { id: "MyProfile", name: "Meu Perfil" },
  { id: "Join", name: "Associe-se" },
  { id: "Benefits", name: "Benefícios" },
];

export default function PageBlockSection() {
  const [blockedPages, setBlockedPages] = useState([]);

  useEffect(() => {
    const saved = localStorage.getItem('blocked_pages');
    if (saved) setBlockedPages(JSON.parse(saved));
  }, []);

  const togglePage = (pageId) => {
    const newBlocked = blockedPages.includes(pageId)
      ? blockedPages.filter(p => p !== pageId)
      : [...blockedPages, pageId];
    
    setBlockedPages(newBlocked);
    localStorage.setItem('blocked_pages', JSON.stringify(newBlocked));
  };

  const blockAll = () => {
    const ids = allPages.map(p => p.id);
    setBlockedPages(ids);
    localStorage.setItem('blocked_pages', JSON.stringify(ids));
  };

  const unblockAll = () => {
    setBlockedPages([]);
    localStorage.setItem('blocked_pages', JSON.stringify([]));
  };

  return (
    <div className="space-y-6">
      <Card className="border-[#E8DCC4]">
        <CardHeader className="bg-gradient-to-r from-red-500 to-red-600 text-white rounded-t-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Lock className="w-6 h-6" />
              <CardTitle>Bloqueio de Páginas</CardTitle>
            </div>
            <div className="flex gap-2">
              <Button onClick={unblockAll} variant="outline" className="bg-white/20 text-white border-white/30 hover:bg-white/30">
                <Unlock className="w-4 h-4 mr-2" /> Liberar Todas
              </Button>
              <Button onClick={blockAll} className="bg-white text-red-600 hover:bg-white/90">
                <Lock className="w-4 h-4 mr-2" /> Bloquear Todas
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-yellow-800">Atenção</p>
                <p className="text-sm text-yellow-700">
                  Páginas bloqueadas exibirão uma mensagem informando que estão em manutenção. 
                  Apenas administradores poderão acessá-las normalmente.
                </p>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {allPages.map((page) => {
              const isBlocked = blockedPages.includes(page.id);
              return (
                <div
                  key={page.id}
                  className={`flex items-center justify-between p-4 rounded-lg border-2 transition-all ${
                    isBlocked 
                      ? 'border-red-300 bg-red-50' 
                      : 'border-green-300 bg-green-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {isBlocked ? (
                      <Lock className="w-5 h-5 text-red-600" />
                    ) : (
                      <Unlock className="w-5 h-5 text-green-600" />
                    )}
                    <div>
                      <p className="font-medium text-gray-800">{page.name}</p>
                      <p className="text-xs text-gray-500">/{page.id}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge className={isBlocked ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}>
                      {isBlocked ? 'Bloqueada' : 'Liberada'}
                    </Badge>
                    <Switch
                      checked={!isBlocked}
                      onCheckedChange={() => togglePage(page.id)}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600">
              <strong>Status atual:</strong> {blockedPages.length} página(s) bloqueada(s), {allPages.length - blockedPages.length} liberada(s)
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}