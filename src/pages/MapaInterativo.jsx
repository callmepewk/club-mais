
import React, { useState, useEffect, useMemo } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { Locate, MapPin, Sparkles, Navigation, AlertCircle } from "lucide-react";
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
  const [locationError, setLocationError] = useState(null);
  const [loadingLocation, setLoadingLocation] = useState(false);
  const [filtros, setFiltros] = useState({
    busca: "",
    cidade: "",
    estado: "Todos",
    categoria: "Todas",
    procedimento: "Todos",
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
    setLoadingLocation(true);
    setLocationError(null);

    if (!navigator.geolocation) {
      setLocationError("Geolocalização não é suportada pelo seu navegador");
      setLoadingLocation(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const location = [position.coords.latitude, position.coords.longitude];
        setUserLocation(location);
        setMapCenter(location);
        setLoadingLocation(false);
        setLocationError(null);
      },
      (error) => {
        console.error("Error getting location:", error);
        let errorMessage = "Não foi possível obter sua localização";
        
        switch(error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = "Você negou o acesso à localização. Por favor, habilite nas configurações do navegador.";
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = "Informação de localização não disponível";
            break;
          case error.TIMEOUT:
            errorMessage = "Tempo esgotado ao tentar obter localização";
            break;
        }
        
        setLocationError(errorMessage);
        setLoadingLocation(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );
  };

  const estabelecimentosFiltrados = useMemo(() => {
    return estabelecimentos
      .filter(est => {
        const matchBusca = !filtros.busca || 
          est.nome?.toLowerCase().includes(filtros.busca.toLowerCase()) ||
          est.cidade?.toLowerCase().includes(filtros.busca.toLowerCase()) ||
          est.endereco?.toLowerCase().includes(filtros.busca.toLowerCase());
        
        const matchCidade = !filtros.cidade || 
          est.cidade?.toLowerCase().includes(filtros.cidade.toLowerCase());
        
        const matchEstado = filtros.estado === "Todos" || 
          est.estado === filtros.estado;
        
        const matchCategoria = filtros.categoria === "Todas" || 
          est.categoria === filtros.categoria;
        
        const matchPlano = filtros.plano === "todos" || 
          est.plano_desconto === filtros.plano;
        
        // Para procedimento, podemos adicionar um campo na entidade futuramente
        // Por enquanto, aceita todos se "Todos" estiver selecionado
        const matchProcedimento = filtros.procedimento === "Todos" || 
          est.descricao?.toLowerCase().includes(filtros.procedimento.toLowerCase());
        
        return matchBusca && matchCidade && matchEstado && matchCategoria && matchPlano && matchProcedimento;
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

            <div className="flex flex-col gap-2 w-full md:w-auto">
              <Button
                onClick={getUserLocation}
                disabled={loadingLocation}
                className="bg-white text-[#D4AF37] hover:bg-white/90 shadow-lg disabled:opacity-50 w-full md:w-auto"
              >
                {loadingLocation ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#D4AF37] mr-2" />
                    Obtendo localização...
                  </>
                ) : (
                  <>
                    <Locate className="w-4 h-4 mr-2" />
                    Usar Minha Localização
                  </>
                )}
              </Button>
              
              {locationError && (
                <div className="flex items-start gap-2 text-xs bg-red-100 text-red-800 p-2 rounded">
                  <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  <span>{locationError}</span>
                </div>
              )}
              
              {userLocation && !locationError && (
                <div className="flex items-center gap-2 text-xs bg-white/20 text-white p-2 rounded">
                  <MapPin className="w-4 h-4" />
                  <span>Localização ativada</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Map and List */}
      <div className="max-w-7xl mx-auto p-4 md:p-6">
        <div className="space-y-6">
          {/* Filters - Full Width */}
          <FiltrosMapa filtros={filtros} onChange={setFiltros} />

          {/* Map - Full Width */}
          <div className="w-full h-[400px] md:h-[600px] rounded-xl overflow-hidden shadow-2xl border-4 border-white">
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

          {/* List - Below Map in Grid */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-serif text-2xl md:text-3xl font-bold text-gray-800">
                Estabelecimentos Encontrados
              </h2>
              <p className="text-sm text-gray-600">
                {estabelecimentosFiltrados.length} estabelecimento(s)
              </p>
            </div>

            {isLoading ? (
              <div className="text-center py-12">
                <div className="animate-spin w-12 h-12 border-4 border-[#D4AF37] border-t-transparent rounded-full mx-auto"></div>
                <p className="text-gray-600 mt-4">Carregando estabelecimentos...</p>
              </div>
            ) : estabelecimentosFiltrados.length === 0 ? (
              <Card className="border-[#E8DCC4] p-12 text-center">
                <MapPin className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-lg text-gray-600">Nenhum estabelecimento encontrado</p>
                <p className="text-sm text-gray-500 mt-2">Tente ajustar os filtros para encontrar mais resultados</p>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {estabelecimentosFiltrados.map((est) => (
                  <CardEstabelecimento
                    key={est.id}
                    estabelecimento={est}
                    distancia={est.distancia}
                    onSelect={handleSelectEstabelecimento}
                    isSelected={selectedEstabelecimento?.id === est.id}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
