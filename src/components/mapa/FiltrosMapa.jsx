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
  "Outros"
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
            placeholder="Cidade, estabelecimento..."
            className="pl-10 border-[#E8DCC4] focus:border-[#D4AF37]"
          />
        </div>
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
          <SelectContent>
            {categorias.map((cat) => (
              <SelectItem key={cat} value={cat}>{cat}</SelectItem>
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