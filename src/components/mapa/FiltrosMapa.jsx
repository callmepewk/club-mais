import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Filter } from "lucide-react";

const categorias = [
  "Todas",
  "Salão de Beleza",
  "Clínica de Estética",
  "Spa",
  "Dermatologia",
  "Cirurgia Plástica",
  "Studio de Micropigmentação",
  "Centro de Depilação",
  "Massoterapia",
  "Nutrição Estética",
  "Fisioterapia Dermato Funcional",
  "Podologia",
  "Medicina Estética",
  "Harmonização Facial",
  "Tricologia",
  "Barbearia",
  "Acupuntura Estética",
  "Terapias Holísticas",
  "Outros"
];

const procedimentos = [
  "Todos",
  // Estética Facial
  "Limpeza de Pele",
  "Hidratação Facial",
  "Esfoliação",
  "Revitalização Facial",
  "Microagulhamento",
  "Skinbooster",
  "Preenchimento Facial",
  "Ácido Hialurônico",
  "Toxina Botulínica (Botox)",
  "Peeling Químico",
  "Peeling Físico",
  "Peeling Enzimático",
  "Radiofrequência Facial",
  "Microdermoabrasão",
  "Tratamento de Acne",
  "Tratamento de Melasma",
  "Tratamento de Manchas",
  "Tratamento de Olheiras",
  "Tratamento de Cicatrizes",
  "Tratamento de Flacidez Facial",
  "Harmonização Facial (HOF)",
  "Bioestimuladores de Colágeno",
  "Fios de Sustentação",
  
  // Estética Corporal
  "Criolipólise",
  "Ultracavitação",
  "Radiofrequência Corporal",
  "Carboxiterapia",
  "Lipoenzimática",
  "Massagem Modeladora",
  "Ondas de Choque",
  "Subcisão",
  "Endermologia",
  "Tratamento de Celulite",
  "Tratamento de Estrias",
  "Ultrassom Microfocado (HIFU)",
  "Correntes Russa",
  "Correntes Aussie",
  "Depilação a Laser",
  "Luz Intensa Pulsada (IPL)",
  "Depilação a LED",
  "Drenagem Linfática Manual",
  "Drenagem Pós-operatória",
  "Drenagem Gestacional",
  
  // Estética Capilar
  "Tratamento de Queda de Cabelo",
  "Tratamento de Alopécia",
  "Tratamento de Caspa",
  "Tratamento de Oleosidade Capilar",
  "Tratamento de Dermatite Seborreica",
  "Microagulhamento Capilar",
  "Mesoterapia Capilar",
  "Laser Capilar",
  "LED Capilar",
  "Transplante Capilar",
  
  // Estética de Mãos e Pés
  "Manicure",
  "Pedicure",
  "Estética Avançada dos Pés",
  "Podologia",
  "Tratamento de Unhas Encravadas",
  "Tratamento de Calosidades",
  "Tratamento de Micoses",
  "Pé Diabético",
  
  // Micropigmentação e Design
  "Design de Sobrancelhas",
  "Micropigmentação Fio a Fio",
  "Shadow",
  "Microblading",
  "Delineador Permanente",
  "Micropigmentação Labial",
  "Revitalização Labial",
  "Extensão de Cílios",
  "Alongamento de Cílios",
  "Lash Lifting",
  
  // Medicina e Saúde
  "Cirurgia Plástica",
  "Dermatologia",
  "Medicina Integrativa",
  "Nutrologia",
  "Fisioterapia Dermato Funcional",
  "Pilates",
  "Nutrição Esportiva",
  "Nutrição Clínica",
  "Nutrição Funcional",
  "Psicologia da Autoestima",
  "Coaching de Imagem Corporal",
  "Acupuntura Estética",
  "Aromaterapia",
  "Terapias Holísticas",
  "Personal Training Estético",
  "Spa e Relaxamento"
];

const estados = [
  "Todos",
  "AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", "MA",
  "MT", "MS", "MG", "PA", "PB", "PR", "PE", "PI", "RJ", "RN",
  "RS", "RO", "RR", "SC", "SP", "SE", "TO"
];

const planos = [
  { value: "todos", label: "Todos os Planos" },
  { value: "light", label: "Light" },
  { value: "gold", label: "Gold (15% OFF)" },
  { value: "vip", label: "VIP (25% OFF)" }
];

export default function FiltrosMapa({ filtros, onChange }) {
  return (
    <div className="space-y-4 p-4 bg-white rounded-xl border border-[#E8DCC4] shadow-lg">
      <div className="flex items-center gap-2 pb-2 border-b border-[#E8DCC4]">
        <Filter className="w-5 h-5 text-[#D4AF37]" />
        <h3 className="font-serif text-lg font-bold text-gray-800">Filtros</h3>
      </div>

      <div className="space-y-2">
        <Label className="text-gray-700 text-sm">Buscar</Label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            value={filtros.busca || ""}
            onChange={(e) => onChange({ ...filtros, busca: e.target.value })}
            placeholder="Estabelecimento, cidade..."
            className="pl-10 border-[#E8DCC4] focus:border-[#D4AF37]"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label className="text-gray-700 text-sm">Cidade</Label>
        <Input
          value={filtros.cidade || ""}
          onChange={(e) => onChange({ ...filtros, cidade: e.target.value })}
          placeholder="Digite a cidade"
          className="border-[#E8DCC4] focus:border-[#D4AF37]"
        />
      </div>

      <div className="space-y-2">
        <Label className="text-gray-700 text-sm">Estado</Label>
        <Select 
          value={filtros.estado || "Todos"} 
          onValueChange={(value) => onChange({ ...filtros, estado: value })}
        >
          <SelectTrigger className="border-[#E8DCC4] focus:border-[#D4AF37]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="max-h-[300px]">
            {estados.map((estado) => (
              <SelectItem key={estado} value={estado}>{estado}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label className="text-gray-700 text-sm">Categoria</Label>
        <Select 
          value={filtros.categoria || "Todas"} 
          onValueChange={(value) => onChange({ ...filtros, categoria: value })}
        >
          <SelectTrigger className="border-[#E8DCC4] focus:border-[#D4AF37]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="max-h-[300px]">
            {categorias.map((cat) => (
              <SelectItem key={cat} value={cat}>{cat}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label className="text-gray-700 text-sm">Tipo de Procedimento</Label>
        <Select 
          value={filtros.procedimento || "Todos"} 
          onValueChange={(value) => onChange({ ...filtros, procedimento: value })}
        >
          <SelectTrigger className="border-[#E8DCC4] focus:border-[#D4AF37]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="max-h-[300px]">
            {procedimentos.map((proc) => (
              <SelectItem key={proc} value={proc}>{proc}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label className="text-gray-700 text-sm">Plano de Desconto</Label>
        <Select 
          value={filtros.plano || "todos"} 
          onValueChange={(value) => onChange({ ...filtros, plano: value })}
        >
          <SelectTrigger className="border-[#E8DCC4] focus:border-[#D4AF37]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {planos.map((plano) => (
              <SelectItem key={plano.value} value={plano.value}>{plano.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}