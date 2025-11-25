import React, { useState, useMemo, lazy, Suspense } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import {
  Shield, GitBranch, Clock, Megaphone, BarChart3, Users
} from "lucide-react";

// Lazy load sections for better performance
const VersionsSection = lazy(() => import("../components/control/VersionsSection"));
const TestAccountsSection = lazy(() => import("../components/control/TestAccountsSection"));
const BannersSection = lazy(() => import("../components/control/BannersSection"));
const SEOReportsSection = lazy(() => import("../components/control/SEOReportsSection"));
const UsersSection = lazy(() => import("../components/control/UsersSection"));

const tabs = [
  { id: "versions", label: "Sistema de Versões", icon: GitBranch, color: "from-indigo-500 to-indigo-600" },
  { id: "test-accounts", label: "Contas Teste (7 dias)", icon: Clock, color: "from-green-500 to-green-600" },
  { id: "banners", label: "Banners e Anúncios", icon: Megaphone, color: "from-purple-500 to-purple-600" },
  { id: "seo", label: "Relatórios SEO", icon: BarChart3, color: "from-orange-500 to-orange-600" },
  { id: "users", label: "Lista de Usuários", icon: Users, color: "from-[#D4AF37] to-[#C8A882]" },
];

export default function Control() {
  const [activeTab, setActiveTab] = useState("versions");

  const { data: user } = useQuery({
    queryKey: ['current-user-control'],
    queryFn: () => base44.auth.me(),
  });

  if (!user || user.role !== 'admin') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white via-[#F5EFE6] to-white py-20 px-6">
        <div className="max-w-2xl mx-auto text-center space-y-6">
          <Shield className="w-16 h-16 text-red-600 mx-auto" />
          <h2 className="font-serif text-3xl font-bold text-gray-800">Acesso Restrito</h2>
          <p className="text-gray-600">Você não tem permissão para acessar o painel de controle.</p>
        </div>
      </div>
    );
  }

  const LoadingSpinner = () => (
    <div className="flex items-center justify-center py-20">
      <div className="animate-spin w-8 h-8 border-4 border-[#D4AF37] border-t-transparent rounded-full"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-[#F5EFE6] to-white">
      {/* Hero Header */}
      <div className="relative py-12 px-6 overflow-hidden bg-gradient-to-br from-[#D4AF37] via-[#C8A882] to-[#D4AF37]">
        <div className="relative z-10 max-w-7xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full border border-white/30">
            <Shield className="w-5 h-5 text-white" />
            <span className="text-white font-medium">Painel Administrativo</span>
          </div>
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-white">Controle Total</h1>
          <p className="text-lg text-white/90">Gerencie usuários, planos, versões e atualizações do sistema</p>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4">
          <nav className="flex overflow-x-auto scrollbar-hide -mb-px">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-4 text-sm font-medium whitespace-nowrap border-b-2 transition-all ${
                  activeTab === tab.id
                    ? 'border-[#D4AF37] text-[#D4AF37]'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                <span className="hidden sm:inline">{tab.label}</span>
                <span className="sm:hidden">{tab.label.split(' ')[0]}</span>
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Content */}
      <div className="py-8 px-4 md:px-6">
        <div className="max-w-7xl mx-auto">
          <Suspense fallback={<LoadingSpinner />}>
            {activeTab === "versions" && <VersionsSection />}
            {activeTab === "test-accounts" && <TestAccountsSection />}
            {activeTab === "banners" && <BannersSection />}
            {activeTab === "seo" && <SEOReportsSection />}
            {activeTab === "users" && <UsersSection />}
          </Suspense>
        </div>
      </div>
    </div>
  );
}