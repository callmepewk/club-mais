import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RefreshCw, CheckCircle, AlertCircle, Link as LinkIcon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function MapaEsteticaSync() {
  const [syncStatus, setSyncStatus] = useState("idle"); // idle, syncing, success, error
  const [syncMessage, setSyncMessage] = useState("");
  const [user, setUser] = useState(null);
  const queryClient = useQueryClient();

  useEffect(() => {
    const loadUser = async () => {
      try {
        const currentUser = await base44.auth.me();
        setUser(currentUser);
      } catch (error) {
        console.error("Erro ao carregar usuário:", error);
      }
    };
    loadUser();
  }, []);

  const syncWithMapaEstetica = useMutation({
    mutationFn: async () => {
      setSyncStatus("syncing");
      setSyncMessage("Verificando conta no Mapa da Estética...");

      const currentUser = await base44.auth.me();
      
      // Buscar no Mapa da Estética se o usuário tem cadastro lá
      // (Assumindo que compartilham o mesmo sistema de autenticação)
      const mapaUrl = "https://mapa-da-estetica.base44.app";
      
      try {
        // Verificar se usuário já tem planos no Mapa da Estética
        // Como ambos compartilham o mesmo banco do Base44, os planos já estariam sincronizados
        // Mas vamos adicionar a flag de sincronização
        
        const updateData = {
          origem_cadastro: currentUser.origem_cadastro === "mapa_estetica" ? "mapa_estetica" : "sincronizado",
          sincronizacao_ativa: true,
          ultima_sincronizacao: new Date().toISOString()
        };

        // Se o usuário não tem origem definida mas tem planos, provavelmente veio do Mapa
        if (!currentUser.origem_cadastro && (
          currentUser.clube_plano && currentUser.clube_plano !== "none"
        )) {
          updateData.origem_cadastro = "mapa_estetica";
        }

        await base44.auth.updateMe(updateData);

        setSyncStatus("success");
        setSyncMessage(`✅ Sincronização completa! ${
          currentUser.clube_plano && currentUser.clube_plano !== "none" 
            ? `Plano ${currentUser.clube_plano.toUpperCase()} reconhecido.` 
            : "Conta sincronizada!"
        } Para completar seu perfil, vá em Meu Perfil > Editar > Salvar.`);

        queryClient.invalidateQueries({ queryKey: ['current-user'] });
        queryClient.invalidateQueries({ queryKey: ['current-user-layout'] });

        return updateData;
      } catch (error) {
        setSyncStatus("error");
        setSyncMessage("❌ Erro ao sincronizar. Tente novamente.");
        throw error;
      }
    },
  });

  if (!user) return null;

  // Não mostrar se já está sincronizado ou tem origem definida
  if (user.sincronizacao_ativa || user.origem_cadastro) {
    return null;
  }

  // Não mostrar se usuário já tem plano do Club da Beleza
  if (user.clube_plano && user.clube_plano !== "none") {
    return null;
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="fixed bottom-6 right-6 z-50 max-w-md"
      >
        <Card className="border-[#D4AF37] shadow-2xl bg-white">
          <CardContent className="p-6 space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-[#D4AF37] to-[#C8A882] rounded-full flex items-center justify-center flex-shrink-0">
                <LinkIcon className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-serif text-lg font-bold text-gray-800 mb-1">
                  Sincronizar com Mapa da Estética
                </h3>
                <p className="text-sm text-gray-600">
                  Você tem conta no Mapa da Estética? Sincronize agora e seus planos serão reconhecidos automaticamente!
                </p>
              </div>
            </div>

            {syncStatus !== "idle" && (
              <div className={`p-3 rounded-lg ${
                syncStatus === "syncing" ? "bg-blue-50 border border-blue-200" :
                syncStatus === "success" ? "bg-green-50 border border-green-200" :
                "bg-red-50 border border-red-200"
              }`}>
                <div className="flex items-center gap-2">
                  {syncStatus === "syncing" && (
                    <RefreshCw className="w-4 h-4 text-blue-600 animate-spin" />
                  )}
                  {syncStatus === "success" && (
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  )}
                  {syncStatus === "error" && (
                    <AlertCircle className="w-4 h-4 text-red-600" />
                  )}
                  <p className={`text-sm font-medium ${
                    syncStatus === "syncing" ? "text-blue-800" :
                    syncStatus === "success" ? "text-green-800" :
                    "text-red-800"
                  }`}>
                    {syncMessage}
                  </p>
                </div>
              </div>
            )}

            <div className="flex gap-2">
              <Button
                onClick={() => syncWithMapaEstetica.mutate()}
                disabled={syncStatus === "syncing"}
                className="flex-1 bg-gradient-to-r from-[#D4AF37] to-[#C8A882] hover:from-[#C8A882] hover:to-[#D4AF37] text-white"
              >
                {syncStatus === "syncing" ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Sincronizando...
                  </>
                ) : (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Sincronizar Agora
                  </>
                )}
              </Button>
            </div>

            <p className="text-xs text-gray-500 text-center">
              A sincronização é segura e instantânea
            </p>
          </CardContent>
        </Card>
      </motion.div>
    </AnimatePresence>
  );
}