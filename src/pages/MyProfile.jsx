import React from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { 
  Crown, Award, Sparkles, CheckCircle, ArrowRight,
  CreditCard, GraduationCap, Calendar, TrendingUp, User, Mail, Shield
} from "lucide-react";

// ... keep existing code (planDetails and edbeautyPlanDetails) ...

export default function MyProfile() {
  const { data: user, isLoading } = useQuery({
    queryKey: ['current-user'],
    queryFn: () => base44.auth.me(),
  });

  // ... keep existing code (variable declarations) ...

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-[#F5EFE6] to-white">
      {/* Hero Section */}
      <div className="relative py-20 px-6 overflow-hidden bg-gradient-to-br from-white via-[#F5EFE6] to-[#E8DCC4]">
        {/* ... keep existing code (background animation) ... */}

        <div className="relative z-10 max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center space-y-6"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full border border-[#D4AF37]/20 shadow-lg">
              <User className="w-4 h-4 text-[#D4AF37]" />
              <span className="text-sm font-medium text-[#C8A882]">
                Meu Perfil
              </span>
            </div>

            <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl font-bold">
              <span className="text-gray-800">Olá,</span>
              <br />
              <span className="bg-gradient-to-r from-[#D4AF37] to-[#C8A882] bg-clip-text text-transparent">
                {user?.full_name || 'Visitante'}
              </span>
            </h1>

            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Gerencie suas informações e aproveite todos os benefícios
            </p>
          </motion.div>
        </div>
      </div>

      {/* Loading State */}
      {isLoading ? (
        <div className="py-20 px-6 text-center">
          <div className="animate-spin w-12 h-12 border-4 border-[#D4AF37] border-t-transparent rounded-full mx-auto"></div>
          <p className="text-gray-600 mt-4">Carregando informações...</p>
        </div>
      ) : (
        <div className="py-20 px-6">
          <div className="max-w-5xl mx-auto space-y-8">
            {/* User Info Card */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <Card className="border-[#E8DCC4] shadow-xl overflow-hidden">
                <div className="bg-gradient-to-r from-[#D4AF37] to-[#C8A882] p-6">
                  <div className="flex items-center gap-4 text-white">
                    <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-4xl font-bold">
                      {user?.full_name?.charAt(0).toUpperCase() || 'U'}
                    </div>
                    <div>
                      <h2 className="font-serif text-3xl font-bold">
                        {user?.full_name || 'Usuário'}
                      </h2>
                      <div className="flex items-center gap-2 mt-1">
                        <Mail className="w-4 h-4" />
                        <span className="text-white/90">{user?.email}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <CardContent className="p-8">
                  <div className="grid md:grid-cols-3 gap-6">
                    <div className="text-center p-4 bg-[#F5EFE6] rounded-xl">
                      <Shield className="w-8 h-8 text-[#D4AF37] mx-auto mb-2" />
                      <p className="text-sm text-gray-600">Tipo de Conta</p>
                      <p className="text-lg font-bold text-gray-800">
                        {userType === 'profissional' ? 'Profissional' : 'Paciente'}
                      </p>
                    </div>

                    <div className="text-center p-4 bg-[#F5EFE6] rounded-xl">
                      <Award className="w-8 h-8 text-[#D4AF37] mx-auto mb-2" />
                      <p className="text-sm text-gray-600">Plano Club</p>
                      <p className="text-lg font-bold text-gray-800">
                        {clubePlanInfo.name}
                      </p>
                    </div>

                    <div className="text-center p-4 bg-[#F5EFE6] rounded-xl">
                      <Calendar className="w-8 h-8 text-[#D4AF37] mx-auto mb-2" />
                      <p className="text-sm text-gray-600">Membro desde</p>
                      <p className="text-lg font-bold text-gray-800">
                        {user?.created_date ? new Date(user.created_date).toLocaleDateString('pt-BR') : '-'}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* ... keep existing code (Club da Beleza Plan and EdBeauty Plan cards) ... */}

            {/* ... keep existing code (Summary Stats) ... */}
          </div>
        </div>
      )}
    </div>
  );
}