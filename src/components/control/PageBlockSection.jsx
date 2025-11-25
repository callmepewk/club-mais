import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Lock, Unlock, AlertTriangle, Clock, Calendar, X, Check } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

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
  const [scheduledActions, setScheduledActions] = useState({});
  const [openSchedulePopover, setOpenSchedulePopover] = useState(null);

  useEffect(() => {
    const saved = localStorage.getItem('blocked_pages');
    if (saved) setBlockedPages(JSON.parse(saved));
    
    const savedSchedules = localStorage.getItem('page_schedules');
    if (savedSchedules) setScheduledActions(JSON.parse(savedSchedules));
  }, []);

  // Check scheduled actions every minute
  useEffect(() => {
    const checkSchedules = () => {
      const now = new Date();
      let updated = false;
      const newSchedules = { ...scheduledActions };
      let newBlocked = [...blockedPages];

      Object.entries(scheduledActions).forEach(([pageId, schedule]) => {
        if (schedule && new Date(schedule.datetime) <= now) {
          if (schedule.action === 'block' && !newBlocked.includes(pageId)) {
            newBlocked.push(pageId);
            updated = true;
          } else if (schedule.action === 'unblock' && newBlocked.includes(pageId)) {
            newBlocked = newBlocked.filter(p => p !== pageId);
            updated = true;
          }
          delete newSchedules[pageId];
        }
      });

      if (updated) {
        setBlockedPages(newBlocked);
        localStorage.setItem('blocked_pages', JSON.stringify(newBlocked));
        setScheduledActions(newSchedules);
        localStorage.setItem('page_schedules', JSON.stringify(newSchedules));
      }
    };

    checkSchedules();
    const interval = setInterval(checkSchedules, 60000);
    return () => clearInterval(interval);
  }, [scheduledActions, blockedPages]);

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

  const scheduleAction = (pageId, action, datetime) => {
    const newSchedules = {
      ...scheduledActions,
      [pageId]: { action, datetime }
    };
    setScheduledActions(newSchedules);
    localStorage.setItem('page_schedules', JSON.stringify(newSchedules));
    setOpenSchedulePopover(null);
  };

  const cancelSchedule = (pageId) => {
    const newSchedules = { ...scheduledActions };
    delete newSchedules[pageId];
    setScheduledActions(newSchedules);
    localStorage.setItem('page_schedules', JSON.stringify(newSchedules));
  };

  const SchedulePopover = ({ pageId, isBlocked }) => {
    const [scheduleDate, setScheduleDate] = useState('');
    const [scheduleTime, setScheduleTime] = useState('');
    const action = isBlocked ? 'unblock' : 'block';
    const actionLabel = isBlocked ? 'Desbloquear' : 'Bloquear';

    const handleSchedule = () => {
      if (scheduleDate && scheduleTime) {
        const datetime = `${scheduleDate}T${scheduleTime}`;
        scheduleAction(pageId, action, datetime);
      }
    };

    return (
      <Popover open={openSchedulePopover === pageId} onOpenChange={(open) => setOpenSchedulePopover(open ? pageId : null)}>
        <PopoverTrigger asChild>
          <Button variant="ghost" size="sm" className="text-gray-500 hover:text-[#D4AF37]">
            <Clock className="w-4 h-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-72 p-4">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-[#D4AF37]" />
              <h4 className="font-medium">Agendar {actionLabel}</h4>
            </div>
            <div className="space-y-3">
              <div>
                <label className="text-xs text-gray-500">Data</label>
                <Input 
                  type="date" 
                  value={scheduleDate}
                  onChange={(e) => setScheduleDate(e.target.value)}
                  min={format(new Date(), 'yyyy-MM-dd')}
                  className="mt-1"
                />
              </div>
              <div>
                <label className="text-xs text-gray-500">Horário</label>
                <Input 
                  type="time" 
                  value={scheduleTime}
                  onChange={(e) => setScheduleTime(e.target.value)}
                  className="mt-1"
                />
              </div>
            </div>
            <Button 
              onClick={handleSchedule}
              disabled={!scheduleDate || !scheduleTime}
              className="w-full bg-[#D4AF37] hover:bg-[#C8A882] text-white"
            >
              <Clock className="w-4 h-4 mr-2" />
              Agendar {actionLabel}
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    );
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
              const schedule = scheduledActions[page.id];
              return (
                <div
                  key={page.id}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    isBlocked 
                      ? 'border-red-300 bg-red-50' 
                      : 'border-green-300 bg-green-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
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
                    <div className="flex items-center gap-2">
                      <Badge className={isBlocked ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}>
                        {isBlocked ? 'Bloqueada' : 'Liberada'}
                      </Badge>
                      <SchedulePopover pageId={page.id} isBlocked={isBlocked} />
                      <Switch
                        checked={!isBlocked}
                        onCheckedChange={() => togglePage(page.id)}
                      />
                    </div>
                  </div>
                  
                  {schedule && (
                    <div className="mt-3 flex items-center justify-between bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-amber-600" />
                        <span className="text-xs text-amber-800">
                          {schedule.action === 'block' ? 'Bloquear' : 'Desbloquear'} em{' '}
                          <strong>{format(new Date(schedule.datetime), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}</strong>
                        </span>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => cancelSchedule(page.id)}
                        className="h-6 w-6 p-0 text-amber-600 hover:text-red-600 hover:bg-red-50"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  )}
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