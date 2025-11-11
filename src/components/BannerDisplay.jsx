import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { X, ExternalLink, AlertCircle, Info, Megaphone, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

const bannerTypeConfig = {
  informativo: {
    icon: Info,
    gradient: "from-blue-500 to-blue-600",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-200"
  },
  promocional: {
    icon: Megaphone,
    gradient: "from-purple-500 to-purple-600",
    bgColor: "bg-purple-50",
    borderColor: "border-purple-200"
  },
  urgente: {
    icon: AlertTriangle,
    gradient: "from-red-500 to-red-600",
    bgColor: "bg-red-50",
    borderColor: "border-red-200"
  },
  aviso: {
    icon: AlertCircle,
    gradient: "from-orange-500 to-orange-600",
    bgColor: "bg-orange-50",
    borderColor: "border-orange-200"
  }
};

export default function BannerDisplay() {
  const queryClient = useQueryClient();
  const [activeBanner, setActiveBanner] = useState(null);
  const [canClose, setCanClose] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);

  const { data: user } = useQuery({
    queryKey: ['current-user-banner'],
    queryFn: async () => {
      try {
        return await base44.auth.me();
      } catch (error) {
        return null;
      }
    },
  });

  const { data: banners = [] } = useQuery({
    queryKey: ['active-banners'],
    queryFn: async () => {
      const now = new Date().toISOString();
      const allBanners = await base44.entities.Banner.filter({ status: 'ativo' }, '-prioridade');
      
      return allBanners.filter(banner => {
        const isDateValid = (!banner.data_inicio || banner.data_inicio <= now) &&
                          (!banner.data_fim || banner.data_fim >= now);
        return isDateValid;
      });
    },
    refetchInterval: 60000,
  });

  const incrementViewMutation = useMutation({
    mutationFn: (bannerId) => 
      base44.entities.Banner.update(bannerId, { 
        visualizacoes: (activeBanner?.visualizacoes || 0) + 1 
      }),
  });

  const incrementClickMutation = useMutation({
    mutationFn: (bannerId) => 
      base44.entities.Banner.update(bannerId, { 
        cliques: (activeBanner?.cliques || 0) + 1 
      }),
  });

  useEffect(() => {
    if (!banners || banners.length === 0 || !user) return;

    const viewedBanners = JSON.parse(localStorage.getItem('viewedBanners') || '{}');
    
    const eligibleBanner = banners.find(banner => {
      if (viewedBanners[banner.id]) return false;

      if (banner.publico_alvo === 'todos') return true;

      if (banner.publico_alvo === 'paciente' && user.tipo_usuario === 'paciente') return true;
      if (banner.publico_alvo === 'profissional' && user.tipo_usuario === 'profissional') return true;

      if (banner.publico_alvo.includes('-')) {
        const [tipo, plano] = banner.publico_alvo.split('-');
        if (user.tipo_usuario !== tipo) return false;

        const userPlan = user.clube_plano || 'none';
        const planHierarchy = { none: 0, light: 1, gold: 2, vip: 3 };
        const userLevel = planHierarchy[userPlan] || 0;
        const targetLevel = planHierarchy[plano] || 0;
        
        return userLevel >= targetLevel;
      }

      return false;
    });

    if (eligibleBanner) {
      setActiveBanner(eligibleBanner);
      setTimeLeft(eligibleBanner.duracao_minima || 5);
      setCanClose(false);
      incrementViewMutation.mutate(eligibleBanner.id);
    }
  }, [banners, user]);

  useEffect(() => {
    if (!activeBanner || timeLeft <= 0) {
      if (timeLeft === 0 && activeBanner) {
        setCanClose(true);
      }
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          setCanClose(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [activeBanner, timeLeft]);

  const handleClose = () => {
    if (!canClose || !activeBanner) return;

    const viewedBanners = JSON.parse(localStorage.getItem('viewedBanners') || '{}');
    viewedBanners[activeBanner.id] = Date.now();
    localStorage.setItem('viewedBanners', JSON.stringify(viewedBanners));

    setActiveBanner(null);
    setTimeLeft(0);
  };

  const handleClick = () => {
    if (!activeBanner) return;

    incrementClickMutation.mutate(activeBanner.id);

    if (activeBanner.link_acao) {
      window.open(activeBanner.link_acao, '_blank');
    }
  };

  if (!activeBanner) return null;

  const config = bannerTypeConfig[activeBanner.tipo_banner] || bannerTypeConfig.informativo;
  const Icon = config.icon;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4"
      >
        <motion.div
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, y: 20 }}
          className="relative max-w-2xl w-full"
        >
          <div className={`bg-white rounded-2xl shadow-2xl overflow-hidden border-4 ${config.borderColor}`}>
            {activeBanner.imagem && (
              <div className="relative h-48 md:h-64 overflow-hidden">
                <img
                  src={activeBanner.imagem}
                  alt={activeBanner.titulo}
                  className="w-full h-full object-cover"
                />
                <div className={`absolute inset-0 bg-gradient-to-t from-black/60 to-transparent`}></div>
              </div>
            )}

            <div className={`absolute top-4 right-4 z-10 ${activeBanner.imagem ? 'text-white' : ''}`}>
              {canClose ? (
                <button
                  onClick={handleClose}
                  className="w-10 h-10 rounded-full bg-black/50 hover:bg-black/70 backdrop-blur-sm flex items-center justify-center transition-all duration-300 group"
                  aria-label="Fechar"
                >
                  <X className="w-5 h-5 text-white group-hover:rotate-90 transition-transform" />
                </button>
              ) : (
                <div className="w-10 h-10 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center">
                  <span className="text-white font-bold text-sm">{timeLeft}s</span>
                </div>
              )}
            </div>

            <div className="p-6 md:p-8 space-y-4">
              <div className="flex items-start gap-4">
                <div className={`w-16 h-16 bg-gradient-to-br ${config.gradient} rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg`}>
                  <Icon className="w-8 h-8 text-white" />
                </div>
                <div className="flex-1">
                  <h2 className="font-serif text-2xl md:text-3xl font-bold text-gray-800 mb-2">
                    {activeBanner.titulo}
                  </h2>
                  <p className="text-gray-600 leading-relaxed text-base md:text-lg">
                    {activeBanner.descricao}
                  </p>
                </div>
              </div>

              {activeBanner.link_acao && activeBanner.texto_botao && (
                <Button
                  onClick={handleClick}
                  className={`w-full bg-gradient-to-r ${config.gradient} hover:opacity-90 text-white py-6 text-lg font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 group`}
                >
                  {activeBanner.texto_botao}
                  <ExternalLink className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              )}

              {!canClose && (
                <p className="text-center text-sm text-gray-500">
                  Você poderá fechar este anúncio em {timeLeft} segundo{timeLeft !== 1 ? 's' : ''}
                </p>
              )}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}