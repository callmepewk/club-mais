import React, { useState, useEffect, useMemo } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { Locate, MapPin, Sparkles, Navigation } from "lucide-react";
import CardEstabelecimento from "../components/mapa/CardEstabelecimento";
import FiltrosMapa from "../components/mapa/FiltrosMapa";

// Fix leaflet default markers
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom icons
const userIcon = new L.Icon({
  iconUrl: 'data:image/svg+xml;base64,' + btoa(`
    <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#3B82F6" stroke-width="2">
      <circle cx="12" cy="12" r="10" fill="#3B82F6" fill-opacity="0.2"/>
      <circle cx="12" cy="12" r="3" fill="#3B82F6"/>
    </svg>
  `),
  iconSize: [40, 40],
  iconAnchor: [20, 20],
});

const estabelecimentoIcon = new L.Icon({
  iconUrl: 'data:image/svg+xml;base64,' + btoa(`
    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="42" viewBox="0 0 24 36">
      <path d="M12 0C7.589 0 4 3.589 4 8c0 6.5 8 14 8 14s8-7.5 8-14c0-4.411-3.589-8-8-8z" fill="#D4AF37"/>
      <circle cx="12" cy="8" r="3" fill="white"/>
    </svg>
  `),
  iconSize: [32, 42],
  iconAnchor: [16, 42],
  popupAnchor: [0, -42]
});

function calcularDistancia(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

function MapController({ center }) {
  const map = useMap();
  
  useEffect(() => {
    if (center) {
      map.flyTo(center, 14, { duration: 1 });
    }
  }, [center, map]);
  
  return null;
}

export default function MapaInterativo() {
  const [userLocation, setUserLocation] = useState(null);
  const [selectedEstabelecimento, setSelectedEstabelecimento] = useState(null);
  const [mapCenter, setMapCenter] = useState([-19.9167, -43.9345]); // Belo Horizonte default
  const [filtros, setFiltros] = useState({
    busca: "",
    categoria: "Todas",
    plano: "todos"
  });

  const { data: estabelecimentos = [], isLoading } = useQuery({
    queryKey: ['estabelecimentos'],
    queryFn: () => base44.entities.EstabelecimentoParceiro.list(),
    initialData: [],
  });

  useEffect(() => {
    getUserLocation();
  }, []);

  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = [position.coords.latitude, position.coords.longitude];
          setUserLocation(location);
          setMapCenter(location);
        },
        (error) => {
          console.error("Error getting location:", error);
        }
      );
    }
  };

  const estabelecimentosFiltrados = useMemo(() => {
    return estabelecimentos
      .filter(est => {
        const matchBusca = !filtros.busca || 
          est.nome?.toLowerCase().includes(filtros.busca.toLowerCase()) ||
          est.cidade?.toLowerCase().includes(filtros.busca.toLowerCase()) ||
          est.endereco?.toLowerCase().includes(filtros.busca.toLowerCase());
        
        const matchCategoria = filtros.categoria === "Todas" || est.categoria === filtros.categoria;
        const matchPlano = filtros.plano === "todos" || est.plano_desconto === filtros.plano;
        
        return matchBusca && matchCategoria && matchPlano;
      })
      .map(est => ({
        ...est,
        distancia: userLocation ? calcularDistancia(
          userLocation[0],
          userLocation[1],
          est.latitude,
          est.longitude
        ) : null
      }))
      .sort((a, b) => {
        if (a.distancia === null) return 1;
        if (b.distancia === null) return -1;
        return a.distancia - b.distancia;
      });
  }, [estabelecimentos, filtros, userLocation]);

  const handleSelectEstabelecimento = (est) => {
    setSelectedEstabelecimento(est);
    setMapCenter([est.latitude, est.longitude]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-[#F5EFE6] to-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#D4AF37] to-[#C8A882] text-white py-6 md:py-8 px-4 md:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <h1 className="font-serif text-2xl md:text-3xl lg:text-4xl font-bold mb-2">
                Mapa de Estabelecimentos
              </h1>
              <p className="text-white/90 text-sm md:text-base">
                Encontre parceiros próximos a você com descontos exclusivos
              </p>
            </div>

            <Button
              onClick={getUserLocation}
              className="bg-white text-[#D4AF37] hover:bg-white/90 shadow-lg"
            >
              <Locate className="w-4 h-4 mr-2" />
              Minha Localização
            </Button>
          </div>
        </div>
      </div>

      {/* Map and List */}
      <div className="max-w-7xl mx-auto p-4 md:p-6">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Sidebar - Filters and List */}
          <div className="lg:col-span-1 space-y-6">
            <FiltrosMapa filtros={filtros} onChange={setFiltros} />

            <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
              <div className="flex items-center justify-between px-2">
                <p className="text-sm text-gray-600">
                  {estabelecimentosFiltrados.length} estabelecimento(s) encontrado(s)
                </p>
              </div>

              {isLoading ? (
                <div className="text-center py-8">
                  <div className="animate-spin w-8 h-8 border-4 border-[#D4AF37] border-t-transparent rounded-full mx-auto"></div>
                  <p className="text-sm text-gray-600 mt-4">Carregando...</p>
                </div>
              ) : estabelecimentosFiltrados.length === 0 ? (
                <Card className="border-[#E8DCC4] p-8 text-center">
                  <MapPin className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-600">Nenhum estabelecimento encontrado</p>
                </Card>
              ) : (
                estabelecimentosFiltrados.map((est) => (
                  <CardEstabelecimento
                    key={est.id}
                    estabelecimento={est}
                    distancia={est.distancia}
                    onSelect={handleSelectEstabelecimento}
                    isSelected={selectedEstabelecimento?.id === est.id}
                  />
                ))
              )}
            </div>
          </div>

          {/* Map */}
          <div className="lg:col-span-2 h-[500px] md:h-[600px] rounded-xl overflow-hidden shadow-2xl border-4 border-white">
            <MapContainer
              center={mapCenter}
              zoom={13}
              style={{ height: '100%', width: '100%' }}
              className="z-0"
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              
              <MapController center={mapCenter} />

              {userLocation && (
                <Marker position={userLocation} icon={userIcon}>
                  <Popup>
                    <div className="text-center p-2">
                      <p className="font-semibold text-blue-600">Você está aqui</p>
                    </div>
                  </Popup>
                </Marker>
              )}

              {estabelecimentosFiltrados.map((est) => (
                <Marker
                  key={est.id}
                  position={[est.latitude, est.longitude]}
                  icon={estabelecimentoIcon}
                  eventHandlers={{
                    click: () => handleSelectEstabelecimento(est)
                  }}
                >
                  <Popup>
                    <div className="p-2 min-w-[200px]">
                      <h3 className="font-serif font-bold text-gray-800 mb-1">{est.nome}</h3>
                      <p className="text-sm text-[#C8A882] mb-2">{est.categoria}</p>
                      <p className="text-xs text-gray-600 mb-2">{est.endereco}</p>
                      {est.distancia !== null && (
                        <Badge className="bg-[#F5EFE6] text-[#D4AF37] text-xs">
                          {est.distancia.toFixed(1)} km de você
                        </Badge>
                      )}
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </div>
        </div>
      </div>
    </div>
  );
}