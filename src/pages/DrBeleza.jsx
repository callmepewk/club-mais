import React, { useState, useEffect, useMemo, useRef } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { motion, AnimatePresence } from "framer-motion";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import {
  Sparkles, Search, Calendar, DollarSign,
  MapPin, Phone, ArrowRight, Award,
  CheckCircle, Heart, Locate, Map as MapIcon, User, Scan
} from "lucide-react";
import CardEstabelecimento from "../components/mapa/CardEstabelecimento";
import { Link } from "react-router-dom";
import AvatarScanner from "./AvatarScanner";
import DrBelezaHeroImmersive from "../components/DrBelezaHeroImmersive";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

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

const treatmentCategories = [
  "Limpeza de Pele", "Hidratação Facial", "Esfoliação", "Revitalização Facial",
  "Microagulhamento", "Skinbooster", "Preenchimento Facial", "Ácido Hialurônico",
  "Toxina Botulínica (Botox)", "Peeling Químico", "Peeling Físico", "Peeling Enzimático",
  "Radiofrequência Facial", "Microdermoabrasão",
  "Tratamento de Acne", "Tratamento de Melasma", "Tratamento de Manchas",
  "Tratamento de Olheiras", "Tratamento de Cicatrizes", "Tratamento de Flacidez Facial",
  "Harmonização Facial (HOF)", "Bioestimuladores de Colágeno", "Fios de Sustentação",
  "Criolipólise", "Ultracavitação", "Radiofrequência Corporal", "Carboxiterapia",
  "Lipoenzimática (Intradermoterapia)", "Massagem Modeladora",
  "Ondas de Choque", "Subcisão", "Endermologia",
  "Tratamento de Celulite", "Tratamento de Estrias",
  "Ultrassom Micro e Macrofocado (HIFU)", "Correntes Russa", "Correntes Aussie",
  "Depilação a Laser", "Luz Intensa Pulsada (IPL)", "Depilação a LED",
  "Drenagem Linfática Manual", "Drenagem Pós-operatória", "Drenagem Gestacional",
  "Tratamento de Queda de Cabelo", "Tratamento de Alopécia", "Tratamento de Caspa",
  "Tratamento de Oleosidade Capilar", "Tratamento de Dermatite Seborreica",
  "Microagulhamento Capilar", "Mesoterapia Capilar", "Laser Capilar", "LED Capilar",
  "Transplante Capilar",
  "Manicure", "Pedicure", "Estética Avançada dos Pés", "Podologia",
  "Tratamento de Unhas Encravadas", "Tratamento de Calosidades",
  "Tratamento de Micoses", "Pé Diabético",
  "Design de Sobrancelhas", "Micropigmentação Fio a Fio", "Shadow",
  "Microblading", "Delineador Permanente", "Micropigmentação Labial",
  "Revitalização Labial", "Extensão de Cílios", "Alongamento de Cílios", "Lash Lifting",
  "Cirurgia Plástica", "Dermatologia", "Medicina Integrativa",
  "Nutrologia", "Fisioterapia Dermato Funcional", "Pilates",
  "Nutrição Esportiva", "Nutrição Clínica", "Nutrição Funcional",
  "Psicologia da Autoestima", "Coaching de Imagem Corporal",
  "Acupuntura Estética", "Aromaterapia", "Terapias Holísticas",
  "Personal Training Estético", "Spa e Relaxamento"
];

const treatmentToAreasMap = {
  "Limpeza de Pele": ["Rosto"],
  "Hidratação Facial": ["Rosto"],
  "Esfoliação": ["Rosto", "Corpo"],
  "Revitalização Facial": ["Rosto"],
  "Microagulhamento": ["Rosto", "Corpo", "Couro Cabeludo"],
  "Skinbooster": ["Rosto", "Pescoço", "Colo", "Mãos"],
  "Preenchimento Facial": ["Rosto", "Lábios", "Olheiras", "Maçãs do Rosto"],
  "Ácido Hialurônico": ["Rosto", "Lábios", "Olheiras"],
  "Toxina Botulínica (Botox)": ["Rosto", "Testa", "Olhos", "Pescoço"],
  "Peeling Químico": ["Rosto", "Pescoço", "Colo", "Mãos"],
  "Peeling Físico": ["Rosto", "Corpo"],
  "Peeling Enzimático": ["Rosto"],
  "Radiofrequência Facial": ["Rosto", "Pescoço", "Papada"],
  "Microdermoabrasão": ["Rosto"],
  "Tratamento de Acne": ["Rosto", "Costas", "Peito"],
  "Tratamento de Melasma": ["Rosto"],
  "Tratamento de Manchas": ["Rosto", "Corpo", "Mãos"],
  "Tratamento de Olheiras": ["Olhos", "Área Periocular"],
  "Tratamento de Cicatrizes": ["Rosto", "Corpo"],
  "Tratamento de Flacidez Facial": ["Rosto", "Pescoço", "Papada"],
  "Harmonização Facial (HOF)": ["Rosto", "Mandíbula", "Queixo", "Nariz"],
  "Bioestimuladores de Colágeno": ["Rosto", "Pescoço", "Colo", "Glúteos"],
  "Fios de Sustentação": ["Rosto", "Pescoço"],
  "Criolipólise": ["Abdômen", "Flancos", "Coxas", "Braços", "Costas", "Papada"],
  "Ultracavitação": ["Abdômen", "Flancos", "Coxas", "Braços"],
  "Radiofrequência Corporal": ["Abdômen", "Coxas", "Braços", "Glúteos", "Costas"],
  "Carboxiterapia": ["Abdômen", "Coxas", "Olheiras"],
  "Lipoenzimática (Intradermoterapia)": ["Abdômen", "Flancos", "Coxas", "Papada"],
  "Massagem Modeladora": ["Abdômen", "Coxas", "Glúteos", "Braços", "Costas"],
  "Ondas de Choque": ["Celulite (Coxas, Glúteos)", "Estrias"],
  "Subcisão": ["Celulite", "Cicatrizes"],
  "Endermologia": ["Celulite", "Flacidez Corporal"],
  "Tratamento de Celulite": ["Coxas", "Glúteos", "Abdômen"],
  "Tratamento de Estrias": ["Abdômen", "Coxas", "Glúteos", "Seios"],
  "Ultrassom Micro e Macrofocado (HIFU)": ["Rosto", "Pescoço", "Abdômen"],
  "Correntes Russa": ["Abdômen", "Glúteos", "Coxas"],
  "Correntes Aussie": ["Abdômen", "Glúteos"],
  "Depilação a Laser": ["Rosto", "Buço", "Axilas", "Virilha", "Pernas", "Braços", "Costas", "Peito", "Abdômen"],
  "Luz Intensa Pulsada (IPL)": ["Rosto", "Buço", "Axilas", "Virilha", "Pernas", "Braços"],
  "Depilação a LED": ["Rosto", "Corpo"],
  "Drenagem Linfática Manual": ["Corpo Todo", "Rosto", "Membros"],
  "Drenagem Pós-operatória": ["Área Operada"],
  "Drenagem Gestacional": ["Corpo Todo", "Pernas"],
  "Tratamento de Queda de Cabelo": ["Couro Cabeludo"],
  "Tratamento de Alopécia": ["Couro Cabeludo"],
  "Tratamento de Caspa": ["Couro Cabeludo"],
  "Tratamento de Oleosidade Capilar": ["Couro Cabeludo"],
  "Tratamento de Dermatite Seborreica": ["Couro Cabeludo"],
  "Microagulhamento Capilar": ["Couro Cabeludo"],
  "Mesoterapia Capilar": ["Couro Cabeludo"],
  "Laser Capilar": ["Couro Cabeludo"],
  "LED Capilar": ["Couro Cabeludo"],
  "Transplante Capilar": ["Couro Cabeludo"],
  "Manicure": ["Mãos", "Unhas"],
  "Pedicure": ["Pés", "Unhas"],
  "Estética Avançada dos Pés": ["Pés"],
  "Podologia": ["Pés", "Unhas"],
  "Tratamento de Unhas Encravadas": ["Pés", "Unhas"],
  "Tratamento de Calosidades": ["Pés"],
  "Tratamento de Micoses": ["Pés", "Unhas"],
  "Pé Diabético": ["Pés"],
  "Design de Sobrancelhas": ["Sobrancelhas"],
  "Micropigmentação Fio a Fio": ["Sobrancelhas"],
  "Shadow": ["Sobrancelhas"],
  "Microblading": ["Sobrancelhas"],
  "Delineador Permanente": ["Olhos", "Pálpebras"],
  "Micropigmentação Labial": ["Lábios"],
  "Revitalização Labial": ["Lábios"],
  "Extensão de Cílios": ["Cílios"],
  "Alongamento de Cílios": ["Cílios"],
  "Lash Lifting": ["Cílios"],
  "Cirurgia Plástica": ["Múltiplas Áreas"],
  "Dermatologia": ["Pele (Corpo Todo)"],
  "Medicina Integrativa": ["Corpo Todo"],
  "Nutrologia": ["Corpo Todo"],
  "Fisioterapia Dermato Funcional": ["Múltiplas Áreas"],
  "Pilates": ["Corpo Todo"],
  "Nutrição Esportiva": ["Corpo Todo"],
  "Nutrição Clínica": ["Corpo Todo"],
  "Nutrição Funcional": ["Corpo Todo"],
  "Psicologia da Autoestima": ["Mental"],
  "Coaching de Imagem Corporal": ["Mental"],
  "Acupuntura Estética": ["Rosto", "Corpo"],
  "Aromaterapia": ["Corpo Todo"],
  "Terapias Holísticas": ["Corpo Todo"],
  "Personal Training Estético": ["Corpo Todo"],
  "Spa e Relaxamento": ["Corpo Todo"]
};

const budgets = [
  "Até R$ 500",
  "R$ 500 - R$ 1.000",
  "R$ 1.000 - R$ 2.000",
  "R$ 2.000 - R$ 5.000",
  "Acima de R$ 5.000"
];

const timeframes = [
  "Imediato",
  "Próximos 7 dias",
  "Próximos 30 dias",
  "Próximos 3 meses",
  "Planejando para depois"
];

const estadosBrasileiros = [
  { sigla: "AC", nome: "Acre" },
  { sigla: "AL", nome: "Alagoas" },
  { sigla: "AP", nome: "Amapá" },
  { sigla: "AM", nome: "Amazonas" },
  { sigla: "BA", nome: "Bahia" },
  { sigla: "CE", nome: "Ceará" },
  { sigla: "DF", nome: "Distrito Federal" },
  { sigla: "ES", nome: "Espírito Santo" },
  { sigla: "GO", nome: "Goiás" },
  { sigla: "MA", nome: "Maranhão" },
  { sigla: "MT", nome: "Mato Grosso" },
  { sigla: "MS", nome: "Mato Grosso do Sul" },
  { sigla: "MG", nome: "Minas Gerais" },
  { sigla: "PA", nome: "Pará" },
  { sigla: "PB", nome: "Paraíba" },
  { sigla: "PR", nome: "Paraná" },
  { sigla: "PE", nome: "Pernambuco" },
  { sigla: "PI", nome: "Piauí" },
  { sigla: "RJ", nome: "Rio de Janeiro" },
  { sigla: "RN", nome: "Rio Grande do Norte" },
  { sigla: "RS", nome: "Rio Grande do Sul" },
  { sigla: "RO", nome: "Rondônia" },
  { sigla: "RR", nome: "Roraima" },
  { sigla: "SC", nome: "Santa Catarina" },
  { sigla: "SP", nome: "São Paulo" },
  { sigla: "SE", nome: "Sergipe" },
  { sigla: "TO", nome: "Tocantins" }
];

const paises = [
  "Brasil", "Argentina", "Chile", "Uruguai", "Paraguai", "Bolívia", "Peru", "Colômbia",
  "Venezuela", "Equador", "Estados Unidos", "Canadá", "México", "Portugal", "Espanha",
  "França", "Itália", "Alemanha", "Reino Unido", "Suíça", "Holanda", "Bélgica",
  "Áustria", "Suécia", "Noruega", "Dinamarca", "Finlândia", "Polônia", "República Tcheca",
  "Hungria", "Grécia", "Turquia", "Rússia", "China", "Japão", "Coreia do Sul",
  "Índia", "Tailândia", "Singapura", "Malásia", "Indonésia", "Filipinas", "Vietnã",
  "Austrália", "Nova Zelândia", "África do Sul", "Egito", "Marrocos", "Emirados Árabes",
  "Israel", "Arábia Saudita", "Outros"
];

const cidadesPrincipaisPorEstado = {
  "SP": ["São Paulo", "Campinas", "Santos", "Ribeirão Preto", "Sorocaba", "São José dos Campos", "Guarulhos", "Osasco"],
  "RJ": ["Rio de Janeiro", "Niterói", "Duque de Caxias", "Nova Iguaçu", "São Gonçalo", "Petrópolis"],
  "MG": ["Belo Horizonte", "Uberlândia", "Contagem", "Juiz de Fora", "Betim", "Montes Claros"],
  "BA": ["Salvador", "Feira de Santana", "Vitória da Conquista", "Camaçari", "Juazeiro"],
  "PR": ["Curitiba", "Londrina", "Maringá", "Ponta Grossa", "Cascavel"],
  "RS": ["Porto Alegre", "Caxias do Sul", "Pelotas", "Canoas", "Santa Maria"],
  "PE": ["Recife", "Jaboatão dos Guararapes", "Olinda", "Caruaru"],
  "CE": ["Fortaleza", "Caucaia", "Juazeiro do Norte", "Maracanaú"],
  "PA": ["Belém", "Ananindeua", "Santarém", "Marabá"],
  "SC": ["Florianópolis", "Joinville", "Blumenau", "Chapecó"],
  "GO": ["Goiânia", "Aparecida de Goiânia", "Anápolis"],
  "MA": ["São Luís", "Imperatriz", "São José de Ribamar"],
  "ES": ["Vitória", "Vila Velha", "Serra"],
  "PB": ["João Pessoa", "Campina Grande"],
  "RN": ["Natal", "Mossoró"],
  "AL": ["Maceió", "Arapiraca"],
  "SE": ["Aracaju"],
  "PI": ["Teresina", "Parnaíba"],
  "MT": ["Cuiabá", "Várzea Grande"],
  "MS": ["Campo Grande", "Dourados"],
  "AC": ["Rio Branco"],
  "RO": ["Porto Velho"],
  "RR": ["Boa Vista"],
  "AP": ["Macapá"],
  "TO": ["Palmas"],
  "DF": ["Brasília"]
};

const distanceRanges = [
  { value: "0.5", label: "Até 500m" },
  { value: "1", label: "500m - 1km" },
  { value: "2", label: "1km - 2km" },
  { value: "5", label: "2km - 5km" },
  { value: "10", label: "5km - 10km" },
  { value: "20", label: "10km - 20km" },
  { value: "50", label: "20km - 50km" },
  { value: "100", label: "50km - 100km" },
  { value: "500", label: "100km - 500km" },
  { value: "all", label: "Todas as distâncias" }
];

const features = [
  {
    icon: Heart,
    title: "Inteligência Artificial",
    description: "Tecnologia avançada para encontrar o tratamento perfeito"
  },
  {
    icon: MapPin,
    title: "Geolocalização",
    description: "Profissionais próximos a você com um clique"
  },
  {
    icon: Award,
    title: "Profissionais Verificados",
    description: "Apenas os melhores e mais qualificados"
  },
  {
    icon: Heart,
    title: "Personalizado",
    description: "Recomendações baseadas no seu perfil"
  }
];

async function getCityFromCoordinates(lat, lng) {
  try {
    const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=10&addressdetails=1`);
    const data = await response.json();

    const city = data.address.city || data.address.town || data.address.village || data.address.municipality || data.address.suburb || '';
    const state = data.address.state_code || data.address.state || '';

    return { city, state };
  } catch (error) {
    console.error("Erro ao obter cidade/estado a partir das coordenadas:", error);
    return { city: '', state: '' };
  }
}

const createPageUrl = (pageName) => {
  switch (pageName) {
    case "AvatarScanner":
      return "/avatar-scanner";
    default:
      return `/${pageName.toLowerCase().replace(/\s+/g, '-')}`;
  }
};


export default function DrBeleza() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [formData, setFormData] = useState({
    treatment: "",
    area: "",
    budget: "",
    timeframe: "",
    pais: "Brasil",
    city: "todas",
    state: "todos",
    latitude: "",
    longitude: "",
    maxDistance: "all"
  });
  const [isSearching, setIsSearching] = useState(false);
  const [userLocation, setUserLocation] = useState(null);
  const [loadingLocation, setLoadingLocation] = useState(false);
  const [selectedEstabelecimento, setSelectedEstabelecimento] = useState(null);
  const [mapCenter, setMapCenter] = useState([-19.9167, -43.9345]);
  const [showResults, setShowResults] = useState(false);
  const [showAvatarForm, setShowAvatarForm] = useState(false);

  const { data: estabelecimentos = [] } = useQuery({
    queryKey: ['estabelecimentos'],
    queryFn: () => base44.entities.EstabelecimentoParceiro.list(),
    initialData: [],
  });

  const availableAreas = useMemo(() => {
    if (!formData.treatment) {
      return ["Selecione um tratamento primeiro"];
    }
    return treatmentToAreasMap[formData.treatment] || ["Área não especificada"];
  }, [formData.treatment]);

  const handleInputChange = (field, value) => {
    setFormData(prev => {
      const newData = { ...prev, [field]: value };
      if (field === "treatment") {
        newData.area = "";
      }
      if (field === "state") {
        newData.city = "todas";
      }
      return newData;
    });
  };

  const getUserLocation = async () => {
    setLoadingLocation(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const location = [position.coords.latitude, position.coords.longitude];
          setUserLocation(location);
          setMapCenter(location);

          const { city, state } = await getCityFromCoordinates(
            position.coords.latitude,
            position.coords.longitude
          );

          setFormData(prev => ({
            ...prev,
            latitude: position.coords.latitude.toFixed(6),
            longitude: position.coords.longitude.toFixed(6),
            city: city,
            state: state.substring(0, 2).toUpperCase(),
            pais: "Brasil"
          }));

          setLoadingLocation(false);
        },
        (error) => {
          console.error("Error getting location:", error);
          setLoadingLocation(false);
          alert("Não foi possível obter sua localização. Verifique as permissões do navegador.");
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0
        }
      );
    } else {
      alert("Geolocalização não é suportada pelo seu navegador.");
      setLoadingLocation(false);
    }
  };

  const filteredEstabelecimentos = useMemo(() => {
    if (!showResults) return [];

    return estabelecimentos
      .filter(est => {
        const matchCountry = !formData.pais || est.pais === formData.pais;
        const matchState = formData.state === "todos" ||
                           (formData.pais === "Brasil" && est.estado === formData.state) ||
                           (formData.pais !== "Brasil");
        const matchCity = formData.city === "todas" ||
                          est.cidade?.toLowerCase().includes(formData.city.toLowerCase());

        return matchCountry && matchState && matchCity;
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
      .filter(est => {
        if (formData.maxDistance === "all") return true;
        if (!est.distancia) return true;
        return est.distancia <= parseFloat(formData.maxDistance);
      })
      .sort((a, b) => {
        if (a.distancia === null) return 1;
        if (b.distancia === null) return -1;
        return a.distancia - b.distancia;
      });
  }, [estabelecimentos, formData.pais, formData.city, formData.state, formData.maxDistance, userLocation, showResults]);

  const handleSearch = () => {
    setIsSearching(true);
    setShowResults(true);

    setTimeout(() => {
      setIsSearching(false);
      if (filteredEstabelecimentos.length > 0 && filteredEstabelecimentos[0].latitude) {
        setMapCenter([filteredEstabelecimentos[0].latitude, filteredEstabelecimentos[0].longitude]);
      } else if (userLocation) {
        setMapCenter(userLocation);
      }
    }, 1000);
  };

  const handleTeleconsulta = () => {
    window.open('https://wa.me/5531972595643?text=Olá! Gostaria de agendar uma teleconsulta.', '_blank');
  };

  const handleSelectEstabelecimento = (est) => {
    setSelectedEstabelecimento(est);
    setMapCenter([est.latitude, est.longitude]);
  };

  const cidadesDisponiveis = useMemo(() => {
    if (formData.pais === "Brasil" && formData.state !== "todos") {
      return cidadesPrincipaisPorEstado[formData.state] || [];
    }
    return [];
  }, [formData.pais, formData.state]);


  return (
    <div className="min-h-screen bg-black">
      <DrBelezaHeroImmersive />

      <div className="relative py-12 md:py-20 px-4 md:px-6 overflow-hidden bg-gradient-to-br from-white via-[#F5EFE6] to-[#E8DCC4]">
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 90, 0],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "linear"
            }}
            className="absolute -top-24 -right-24 w-96 h-96 bg-gradient-to-br from-[#D4AF37]/10 to-transparent rounded-full blur-3xl"
          />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center space-y-6 md:space-y-8"
          >
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="inline-block"
            >
              <div className="w-24 h-24 md:w-32 md:h-32 lg:w-40 lg:h-40 mx-auto bg-gradient-to-br from-[#D4AF37] to-[#C8A882] rounded-full overflow-hidden shadow-2xl border-4 border-white">
                <img
                  src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/690ca5886318e973c6e913bb/9af1641b0_drbeleza.png"
                  alt="Dr. Beleza"
                  className="w-full h-full object-cover"
                />
              </div>
            </motion.div>

            <div className="space-y-4">
              <Badge className="bg-white/80 text-[#D4AF37] border-[#D4AF37]/20 px-4 py-2 text-sm md:text-base backdrop-blur-sm">
                Seu Assistente Inteligente
              </Badge>

              <h1 className="font-serif text-3xl md:text-5xl lg:text-6xl xl:text-7xl font-bold px-4">
                <span className="bg-gradient-to-r from-[#D4AF37] to-[#C8A882] bg-clip-text text-transparent">
                  Dr. Beleza
                </span>
              </h1>

              <p className="text-xl md:text-2xl lg:text-3xl text-gray-700 font-medium px-4">
                Encontre o Tratamento Ideal Para Você
              </p>

              <p className="text-base md:text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed px-4">
                Com inteligência artificial avançada, o Dr. Beleza te ajuda a encontrar os
                melhores profissionais e tratamentos personalizados para suas necessidades
              </p>
            </div>

            <div className="pt-6">
              <a 
                href="https://dr-beleza-ai.base44.app" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-800 text-white rounded-full font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
              >
                <Sparkles className="w-5 h-5" />
                Acessar Dr. Beleza AI - O ChatGPT da Saúde e Estética
                <ArrowRight className="w-5 h-5" />
              </a>
              <p className="text-sm text-gray-500 mt-2">
                Converse com IA especializada, envie fotos e receba orientações personalizadas
              </p>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="py-24 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16 space-y-4"
          >
            <Badge className="bg-[#F5EFE6] text-[#D4AF37] px-4 py-2 text-base">
              <Scan className="w-4 h-4 mr-2" />
              Tecnologia Avançada
            </Badge>

            <h2 className="font-serif text-4xl md:text-5xl font-bold">
              <span className="bg-gradient-to-r from-[#D4AF37] to-[#C8A882] bg-clip-text text-transparent">
                Crie Seu Avatar
              </span>
              <br />
              <span className="text-gray-800">Personalize Sua Experiência</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Crie um avatar personalizado e visualize como diferentes tratamentos podem transformar sua aparência
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="space-y-6"
            >
              <div className="space-y-4">
                <h3 className="font-serif text-3xl font-bold text-gray-800">
                  Visualize Seu Futuro
                </h3>
                <p className="text-lg text-gray-600 leading-relaxed">
                  Com nossa tecnologia de IA, você pode criar um avatar personalizado e visualizar
                  como diferentes procedimentos estéticos podem transformar sua aparência antes
                  mesmo de realizar o tratamento.
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex items-start gap-4 p-4 bg-[#F5EFE6] rounded-xl">
                  <div className="w-12 h-12 bg-gradient-to-br from-[#D4AF37] to-[#C8A882] rounded-full flex items-center justify-center flex-shrink-0">
                    <Scan className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-1">Upload de Foto</h4>
                    <p className="text-sm text-gray-600">
                      Envie sua foto e nossa IA analisa automaticamente suas características
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 bg-[#F5EFE6] rounded-xl">
                  <div className="w-12 h-12 bg-gradient-to-br from-[#D4AF37] to-[#C8A882] rounded-full flex items-center justify-center flex-shrink-0">
                    <Sparkles className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-1">Personalização</h4>
                    <p className="text-sm text-gray-600">
                      Configure características e veja o resultado em tempo real
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 bg-[#F5EFE6] rounded-xl">
                  <div className="w-12 h-12 bg-gradient-to-br from-[#D4AF37] to-[#C8A882] rounded-full flex items-center justify-center flex-shrink-0">
                    <Heart className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-1">Recomendações</h4>
                    <p className="text-sm text-gray-600">
                      Receba sugestões de tratamentos baseados no seu perfil
                    </p>
                  </div>
                </div>
              </div>

              <Button
                onClick={() => setShowAvatarForm(!showAvatarForm)}
                size="lg"
                className="w-full bg-gradient-to-r from-[#D4AF37] to-[#C8A882] hover:from-[#C8A882] hover:to-[#D4AF37] text-white py-6 text-lg font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 group"
              >
                <Scan className="w-5 h-5 mr-2" />
                {showAvatarForm ? 'Fechar Criador de Avatar' : 'Criar Meu Avatar Agora'}
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-[#E8DCC4]">
                <img
                  src="https://images.unsplash.com/photo-1616683693504-3ea7e9ad6fec?w=800&q=80"
                  alt="Avatar Preview"
                  className="w-full h-[600px] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>

                <div className="absolute bottom-8 left-8 right-8 bg-white/95 backdrop-blur-sm rounded-2xl p-6 shadow-xl">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-[#D4AF37] to-[#C8A882] rounded-full flex items-center justify-center">
                      <User className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <h4 className="font-serif text-xl font-bold text-gray-800">
                        Seu Avatar Personalizado
                      </h4>
                      <p className="text-sm text-gray-600">Criado com tecnologia de IA</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          <AnimatePresence>
            {showAvatarForm && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.5 }}
                className="mt-12"
              >
                <AvatarScanner />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div className="py-12 md:py-24 px-4 md:px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="w-full"
          >
            <Card className="border-[#E8DCC4] shadow-2xl bg-white w-full">
              <CardHeader className="text-center p-4 md:p-8 border-b border-[#E8DCC4]">
                <div className="w-20 h-20 md:w-24 md:h-24 mx-auto mb-4 bg-gradient-to-br from-[#D4AF37] to-[#C8A882] rounded-full overflow-hidden shadow-lg border-4 border-white">
                  <img
                    src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/690ca5886318e973c6e913bb/9af1641b0_drbeleza.png"
                    alt="Dr. Beleza"
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardTitle className="font-serif text-2xl md:text-3xl lg:text-4xl font-bold px-2">
                  <span className="bg-gradient-to-r from-[#D4AF37] to-[#C8A882] bg-clip-text text-transparent">
                    Encontre Seu Tratamento Ideal
                  </span>
                </CardTitle>
                <p className="text-gray-600 mt-2 text-sm md:text-base px-2">
                  Preencha os campos abaixo e deixe o Dr. Beleza encontrar os melhores profissionais para você
                </p>
              </CardHeader>

              <CardContent className="p-4 md:p-8 w-full">
                <div className="space-y-6 w-full">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 w-full">
                    <div className="space-y-2 w-full">
                      <Label htmlFor="treatment" className="text-gray-700 flex items-center gap-2 text-sm md:text-base">
                        <Search className="w-4 h-4 text-[#D4AF37]" />
                        Qual tratamento deseja?
                      </Label>
                      <Select value={formData.treatment} onValueChange={(value) => handleInputChange("treatment", value)}>
                        <SelectTrigger className="border-[#E8DCC4] focus:border-[#D4AF37] w-full">
                          <SelectValue placeholder="Selecione o tratamento" />
                        </SelectTrigger>
                        <SelectContent className="max-h-[300px]">
                          {treatmentCategories.map((cat) => (
                            <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2 w-full">
                      <Label htmlFor="area" className="text-gray-700 flex items-center gap-2 text-sm md:text-base">
                        <MapPin className="w-4 h-4 text-[#D4AF37]" />
                        Área desejada
                      </Label>
                      <Select
                        value={formData.area}
                        onValueChange={(value) => handleInputChange("area", value)}
                        disabled={!formData.treatment}
                      >
                        <SelectTrigger className="border-[#E8DCC4] focus:border-[#D4AF37] w-full">
                          <SelectValue placeholder={formData.treatment ? "Selecione a área" : "Selecione primeiro o tratamento"} />
                        </SelectTrigger>
                        <SelectContent>
                          {availableAreas.map((area) => (
                            <SelectItem key={area} value={area}>{area}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2 w-full">
                      <Label htmlFor="budget" className="text-gray-700 flex items-center gap-2 text-sm md:text-base">
                        <DollarSign className="w-4 h-4 text-[#D4AF37]" />
                        Valor de investimento
                      </Label>
                      <Select value={formData.budget} onValueChange={(value) => handleInputChange("budget", value)}>
                        <SelectTrigger className="border-[#E8DCC4] focus:border-[#D4AF37] w-full">
                          <SelectValue placeholder="Selecione o orçamento" />
                        </SelectTrigger>
                        <SelectContent>
                          {budgets.map((budget) => (
                            <SelectItem key={budget} value={budget}>{budget}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2 w-full">
                      <Label htmlFor="timeframe" className="text-gray-700 flex items-center gap-2 text-sm md:text-base">
                        <Calendar className="w-4 h-4 text-[#D4AF37]" />
                        Quando deseja o tratamento?
                      </Label>
                      <Select value={formData.timeframe} onValueChange={(value) => handleInputChange("timeframe", value)}>
                        <SelectTrigger className="border-[#E8DCC4] focus:border-[#D4AF37] w-full">
                          <SelectValue placeholder="Selecione o prazo" />
                        </SelectTrigger>
                        <SelectContent>
                          {timeframes.map((time) => (
                            <SelectItem key={time} value={time}>{time}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2 w-full">
                      <Label className="text-gray-700 flex items-center gap-2 text-sm md:text-base">
                        <Locate className="w-4 h-4 text-[#D4AF37]" />
                        Localização Automática
                      </Label>
                      <Button
                        type="button"
                        onClick={getUserLocation}
                        disabled={loadingLocation}
                        variant="outline"
                        className="w-full border-[#E8DCC4] hover:border-[#D4AF37] hover:bg-[#F5EFE6]"
                      >
                        {loadingLocation ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#D4AF37] mr-2" />
                            Obtendo localização...
                          </>
                        ) : userLocation ? (
                          <>
                            <CheckCircle className="w-4 h-4 mr-2 text-green-600" />
                            Localização Obtida
                          </>
                        ) : (
                          <>
                            <Locate className="w-4 h-4 mr-2" />
                            Usar Minha Localização
                          </>
                        )}
                      </Button>
                    </div>

                    <div className="space-y-2 w-full">
                      <Label htmlFor="pais" className="text-gray-700 flex items-center gap-2 text-sm md:text-base">
                        <MapPin className="w-4 h-4 text-[#D4AF37]" />
                        País
                      </Label>
                      <Select
                        value={formData.pais}
                        onValueChange={(value) => handleInputChange("pais", value)}
                      >
                        <SelectTrigger className="border-[#E8DCC4] focus:border-[#D4AF37] w-full">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="max-h-[300px]">
                          {paises.map((pais) => (
                            <SelectItem key={pais} value={pais}>{pais}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2 w-full">
                      <Label htmlFor="state" className="text-gray-700 flex items-center gap-2 text-sm md:text-base">
                        <MapPin className="w-4 h-4 text-[#D4AF37]" />
                        Estado
                      </Label>
                      <Select
                        value={formData.state}
                        onValueChange={(value) => handleInputChange("state", value)}
                      >
                        <SelectTrigger className="border-[#E8DCC4] focus:border-[#D4AF37] w-full">
                          <SelectValue placeholder="Selecione o estado" />
                        </SelectTrigger>
                        <SelectContent className="max-h-[300px]">
                          <SelectItem value="todos">Todos os estados</SelectItem>
                          {estadosBrasileiros.map((estado) => (
                            <SelectItem key={estado.sigla} value={estado.sigla}>
                              {estado.nome} ({estado.sigla})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2 w-full">
                      <Label htmlFor="city" className="text-gray-700 flex items-center gap-2 text-sm md:text-base">
                        <MapPin className="w-4 h-4 text-[#D4AF37]" />
                        Cidade
                      </Label>
                      {formData.pais === "Brasil" && cidadesDisponiveis.length > 0 && formData.state !== "todos" ? (
                        <Select
                          value={formData.city}
                          onValueChange={(value) => handleInputChange("city", value)}
                          disabled={formData.state === "todos"}
                        >
                          <SelectTrigger className="border-[#E8DCC4] focus:border-[#D4AF37] w-full">
                            <SelectValue placeholder="Selecione a cidade" />
                          </SelectTrigger>
                          <SelectContent className="max-h-[300px]">
                            <SelectItem value="todas">Todas as Cidades</SelectItem>
                            {cidadesDisponiveis.map((cidade) => (
                              <SelectItem key={cidade} value={cidade}>{cidade}</SelectItem>
                            ))}
                            <SelectItem value="__custom__">Outra cidade...</SelectItem>
                          </SelectContent>
                        </Select>
                      ) : (
                        <Input
                          id="city"
                          value={formData.city === "todas" ? "" : formData.city}
                          onChange={(e) => handleInputChange("city", e.target.value || "todas")}
                          placeholder={formData.state !== "todos" ? "Digite a cidade" : "Selecione o estado"}
                          className="border-[#E8DCC4] focus:border-[#D4AF37] w-full"
                          disabled={formData.state === "todos" && formData.pais === "Brasil"}
                        />
                      )}
                    </div>


                    <div className="space-y-2 w-full">
                      <Label htmlFor="latitude" className="text-gray-700 flex items-center gap-2 text-sm md:text-base">
                        <MapIcon className="w-4 h-4 text-[#D4AF37]" />
                        Latitude
                      </Label>
                      <Input
                        id="latitude"
                        value={formData.latitude}
                        readOnly
                        placeholder="Obtida automaticamente"
                        className="border-[#E8DCC4] bg-gray-50 w-full"
                      />
                    </div>

                    <div className="space-y-2 w-full">
                      <Label htmlFor="longitude" className="text-gray-700 flex items-center gap-2 text-sm md:text-base">
                        <MapIcon className="w-4 h-4 text-[#D4AF37]" />
                        Longitude
                      </Label>
                      <Input
                        id="longitude"
                        value={formData.longitude}
                        readOnly
                        placeholder="Obtida automaticamente"
                        className="border-[#E8DCC4] bg-gray-50 w-full"
                      />
                    </div>

                    <div className="space-y-2 w-full">
                      <Label htmlFor="maxDistance" className="text-gray-700 flex items-center gap-2 text-sm md:text-base">
                        <MapIcon className="w-4 h-4 text-[#D4AF37]" />
                        Distância Máxima
                      </Label>
                      <Select
                        value={formData.maxDistance}
                        onValueChange={(value) => handleInputChange("maxDistance", value)}
                      >
                        <SelectTrigger className="border-[#E8DCC4] focus:border-[#D4AF37] w-full">
                          <SelectValue placeholder="Selecione a distância" />
                        </SelectTrigger>
                        <SelectContent>
                          {distanceRanges.map((range) => (
                            <SelectItem key={range.value} value={range.value}>{range.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {!userLocation && formData.maxDistance !== "all" && (
                        <p className="text-xs text-amber-600">
                          ⚠️ Distância será calculada apenas com geolocalização ativa
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col gap-4 pt-4 w-full">
                    <Button
                      onClick={handleSearch}
                      disabled={isSearching}
                      className="w-full bg-gradient-to-r from-[#D4AF37] to-[#C8A882] hover:from-[#C8A882] hover:to-[#D4AF37] text-white py-5 md:py-6 text-base md:text-lg font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 group"
                    >
                      {isSearching ? (
                        <>
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" />
                          Buscando...
                        </>
                      ) : (
                        <>
                          <Search className="w-5 h-5 mr-2" />
                          Buscar Profissionais
                          <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                        </>
                      )}
                    </Button>

                    <Button
                      onClick={handleTeleconsulta}
                      variant="outline"
                      className="w-full border-2 border-[#D4AF37] text-[#D4AF37] hover:bg-[#F5EFE6] py-5 md:py-6 text-base md:text-lg font-semibold"
                    >
                      <Phone className="w-5 h-5 mr-2" />
                      Agendar Teleconsulta
                    </Button>
                  </div>

                  <div className="flex items-center justify-center gap-2 text-xs md:text-sm text-gray-500 pt-4">
                    <CheckCircle className="w-4 h-4 text-[#D4AF37]" />
                    <span className="text-center">Integrado com o Mapa da Estética - Mais de 500 profissionais verificados</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {showResults && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="mt-12"
            >
              <Card className="border-[#E8DCC4] shadow-2xl bg-white">
                <CardHeader>
                  <CardTitle className="font-serif text-2xl md:text-3xl">
                    <span className="bg-gradient-to-r from-[#D4AF37] to-[#C8A882] bg-clip-text text-transparent">
                      Resultados da Busca
                    </span>
                  </CardTitle>
                  <p className="text-gray-600 mt-2">
                    {filteredEstabelecimentos.length} estabelecimento(s) encontrado(s)
                  </p>
                </CardHeader>
                <CardContent className="p-4 md:p-6 space-y-6">
                  <div className="w-full h-[400px] md:h-[600px] rounded-xl overflow-hidden shadow-xl border-4 border-[#E8DCC4]">
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

                      {filteredEstabelecimentos.map((est) => (
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

                  <div>
                    <h3 className="font-serif text-xl md:text-2xl font-bold text-gray-800 mb-6">
                      Estabelecimentos Encontrados
                    </h3>
                    {filteredEstabelecimentos.length === 0 ? (
                      <div className="text-center py-12">
                        <MapPin className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-600 text-lg">Nenhum estabelecimento encontrado</p>
                        <p className="text-sm text-gray-500 mt-2">Tente ajustar os filtros ou aumentar a distância de busca</p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredEstabelecimentos.map((est) => (
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
                </CardContent>
              </Card>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}