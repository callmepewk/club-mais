import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Phone, Clock, Navigation, MessageCircle, ExternalLink } from "lucide-react";

const planBadges = {
  light: { label: "Light", color: "bg-gray-100 text-gray-800" },
  gold: { label: "Gold - 15% OFF", color: "bg-gradient-to-r from-[#D4AF37] to-[#C8A882] text-white" },
  vip: { label: "VIP - 25% OFF", color: "bg-gradient-to-r from-purple-600 to-purple-800 text-white" }
};

export default function CardEstabelecimento({ estabelecimento, distancia, onSelect, isSelected }) {
  const handleGetDirections = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const url = `https://www.google.com/maps/dir/?api=1&origin=${position.coords.latitude},${position.coords.longitude}&destination=${estabelecimento.latitude},${estabelecimento.longitude}`;
        window.open(url, '_blank');
      });
    } else {
      window.open(`https://www.google.com/maps/search/?api=1&query=${estabelecimento.latitude},${estabelecimento.longitude}`, '_blank');
    }
  };

  const handleWhatsApp = () => {
    const numero = estabelecimento.whatsapp?.replace(/\D/g, '');
    if (numero) {
      window.open(`https://wa.me/55${numero}`, '_blank');
    }
  };

  const plan = planBadges[estabelecimento.plano_desconto] || planBadges.light;

  return (
    <Card 
      className={`cursor-pointer transition-all duration-300 hover:shadow-xl ${
        isSelected ? 'border-[#D4AF37] border-2 shadow-lg' : 'border-[#E8DCC4]'
      }`}
      onClick={() => onSelect(estabelecimento)}
    >
      <div className="relative h-40 md:h-48 overflow-hidden">
        <img
          src={estabelecimento.foto || "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800&q=80"}
          alt={estabelecimento.nome}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
        
        <Badge className={`absolute top-3 right-3 ${plan.color} border-0`}>
          {plan.label}
        </Badge>

        {distancia !== null && (
          <Badge className="absolute bottom-3 left-3 bg-white/90 text-gray-800 border-0">
            <MapPin className="w-3 h-3 mr-1" />
            {distancia.toFixed(1)} km
          </Badge>
        )}
      </div>

      <CardContent className="p-4 md:p-6 space-y-4">
        <div>
          <h3 className="font-serif text-lg md:text-xl font-bold text-gray-800 mb-1">
            {estabelecimento.nome}
          </h3>
          <p className="text-sm text-[#C8A882] font-medium">{estabelecimento.categoria}</p>
        </div>

        <div className="space-y-2 text-sm text-gray-600">
          <div className="flex items-start gap-2">
            <MapPin className="w-4 h-4 flex-shrink-0 mt-0.5 text-[#D4AF37]" />
            <span>{estabelecimento.endereco}, {estabelecimento.cidade} - {estabelecimento.estado}</span>
          </div>

          {estabelecimento.telefone && (
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-[#D4AF37]" />
              <span>{estabelecimento.telefone}</span>
            </div>
          )}

          {estabelecimento.horario_funcionamento && (
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#D4AF37]" />
              <span>{estabelecimento.horario_funcionamento}</span>
            </div>
          )}
        </div>

        <div className="flex gap-2 pt-2">
          <Button
            onClick={(e) => {
              e.stopPropagation();
              handleGetDirections();
            }}
            size="sm"
            className="flex-1 bg-gradient-to-r from-[#D4AF37] to-[#C8A882] hover:from-[#C8A882] hover:to-[#D4AF37] text-white"
          >
            <Navigation className="w-4 h-4 mr-1" />
            Rota
          </Button>

          {estabelecimento.whatsapp && (
            <Button
              onClick={(e) => {
                e.stopPropagation();
                handleWhatsApp();
              }}
              size="sm"
              variant="outline"
              className="border-[#D4AF37] text-[#D4AF37] hover:bg-[#F5EFE6]"
            >
              <MessageCircle className="w-4 h-4" />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}