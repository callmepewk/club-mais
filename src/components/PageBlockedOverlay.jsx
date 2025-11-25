import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Lock, ArrowLeft, RefreshCw } from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

export default function PageBlockedOverlay({ pageName }) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-[#F5EFE6] to-white flex items-center justify-center p-6">
      <Card className="max-w-lg w-full border-[#E8DCC4] shadow-2xl">
        <CardContent className="p-12 text-center space-y-6">
          <div className="w-20 h-20 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center mx-auto">
            <Lock className="w-10 h-10 text-white" />
          </div>
          
          <h1 className="font-serif text-3xl font-bold text-gray-800">
            Página em Manutenção
          </h1>
          
          <p className="text-gray-600 leading-relaxed">
            Esta página está temporariamente indisponível enquanto realizamos atualizações 
            para melhorar sua experiência. Em breve o acesso será liberado novamente.
          </p>

          <div className="bg-[#F5EFE6] rounded-lg p-4">
            <p className="text-sm text-[#C8A882]">
              <RefreshCw className="w-4 h-4 inline mr-2" />
              Estamos trabalhando para voltar o mais rápido possível!
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <Link to={createPageUrl("Home")} className="flex-1">
              <Button 
                variant="outline" 
                className="w-full border-[#D4AF37] text-[#D4AF37]"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Voltar ao Início
              </Button>
            </Link>
            <Button 
              onClick={() => window.location.reload()}
              className="flex-1 bg-gradient-to-r from-[#D4AF37] to-[#C8A882] text-white"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Tentar Novamente
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}