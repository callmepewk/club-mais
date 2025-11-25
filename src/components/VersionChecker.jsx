import React, { useEffect, useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";
import { RefreshCw, X, Sparkles, AlertTriangle } from "lucide-react";

export default function VersionChecker() {
  const [showUpdateBanner, setShowUpdateBanner] = useState(false);
  const [forceUpdate, setForceUpdate] = useState(false);
  const [currentVersion, setCurrentVersion] = useState(null);

  // Get latest published version
  const { data: latestVersion } = useQuery({
    queryKey: ['latest-app-version'],
    queryFn: async () => {
      const versions = await base44.entities.AppVersion.filter(
        { status: 'publicada' },
        '-data_publicacao',
        1
      );
      return versions[0] || null;
    },
    refetchInterval: 15000, // Check every 15 seconds
  });

  // Check for scheduled versions that should be published
  useQuery({
    queryKey: ['scheduled-versions'],
    queryFn: async () => {
      const scheduled = await base44.entities.AppVersion.filter({ status: 'agendada' });
      const now = new Date();
      
      for (const version of scheduled) {
        if (version.data_agendada && new Date(version.data_agendada) <= now) {
          // Auto-publish scheduled version
          await base44.entities.AppVersion.update(version.id, {
            status: 'publicada',
            data_publicacao: now.toISOString(),
            cache_version: Date.now().toString(),
          });
        }
      }
      return scheduled;
    },
    refetchInterval: 60000, // Check every minute
  });

  useEffect(() => {
    const storedVersion = localStorage.getItem('app_version');
    
    if (!storedVersion && latestVersion) {
      localStorage.setItem('app_version', latestVersion.versao);
      localStorage.setItem('cache_version', latestVersion.cache_version || Date.now().toString());
      setCurrentVersion(latestVersion.versao);
    } else if (storedVersion && latestVersion && storedVersion !== latestVersion.versao) {
      setShowUpdateBanner(true);
      setForceUpdate(latestVersion.forcar_atualizacao || false);
      setCurrentVersion(storedVersion);
    } else if (storedVersion) {
      setCurrentVersion(storedVersion);
    }
  }, [latestVersion]);

  const handleUpdate = () => {
    if (latestVersion) {
      // Update version in localStorage
      localStorage.setItem('app_version', latestVersion.versao);
      localStorage.setItem('cache_version', latestVersion.cache_version || Date.now().toString());
      
      // Clear all caches
      if ('caches' in window) {
        caches.keys().then(names => {
          names.forEach(name => {
            caches.delete(name);
          });
        });
      }
      
      // Force reload with cache bust
      window.location.href = window.location.href.split('?')[0] + '?v=' + (latestVersion.cache_version || Date.now());
    }
  };

  // If force update is enabled, block the entire page
  if (forceUpdate && showUpdateBanner) {
    return (
      <div className="fixed inset-0 z-[99999] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-8 text-center"
        >
          <div className="w-20 h-20 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertTriangle className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Atualização Obrigatória</h2>
          <p className="text-gray-600 mb-2">
            Uma nova versão <strong>v{latestVersion?.versao}</strong> está disponível e é necessária para continuar.
          </p>
          <p className="text-sm text-gray-500 mb-6">
            {latestVersion?.changelog}
          </p>
          <Button
            onClick={handleUpdate}
            className="w-full bg-gradient-to-r from-[#D4AF37] to-[#C8A882] text-white py-6 text-lg font-semibold"
          >
            <RefreshCw className="w-5 h-5 mr-2" />
            Atualizar Agora
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <AnimatePresence>
      {showUpdateBanner && !forceUpdate && (
        <motion.div
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -100, opacity: 0 }}
          className="fixed top-0 left-0 right-0 z-[9999] pointer-events-none px-4 pt-4"
        >
          <div className="max-w-4xl mx-auto pointer-events-auto">
            <Card className="bg-gradient-to-r from-[#D4AF37] to-[#C8A882] border-0 shadow-2xl">
              <div className="p-4 flex items-center justify-between gap-4">
                <div className="flex items-center gap-4 flex-1">
                  <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center animate-pulse">
                    <Sparkles className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-bold text-white text-lg">
                        Nova Versão Disponível!
                      </h3>
                      <Badge className="bg-white/20 text-white border-white/30 text-xs">
                        v{latestVersion?.versao}
                      </Badge>
                    </div>
                    <p className="text-white/90 text-sm">
                      Clique para atualizar e aproveitar as novas funcionalidades
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Button
                    onClick={handleUpdate}
                    className="bg-white text-[#D4AF37] hover:bg-white/90 font-semibold"
                  >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Atualizar Agora
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setShowUpdateBanner(false)}
                    className="text-white hover:bg-white/20"
                  >
                    <X className="w-5 h-5" />
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}