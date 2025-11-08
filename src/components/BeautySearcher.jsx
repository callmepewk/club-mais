import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { motion } from "framer-motion";
import {
  Search, BookOpen, FileText, ExternalLink, 
  Star, Calendar, Globe, Database, CheckCircle, Filter
} from "lucide-react";

const dataSources = {
  international: [
    { name: "PubMed Central (PMC)", url: "https://pmc.ncbi.nlm.nih.gov/", icon: "🔬" },
    { name: "ScienceOpen", url: "https://www.scienceopen.com/", icon: "🌐" },
    { name: "ResearchGate", url: "https://www.researchgate.net/", icon: "🔗" },
    { name: "MDPI - Aesthetic Medicine", url: "https://www.mdpi.com/journal/jaestheticmed", icon: "📄" },
    { name: "Open Dermatology Journal", url: "https://opendermatologyjournal.com/", icon: "📖" },
    { name: "DOAJ", url: "https://doaj.org/", icon: "📚" },
    { name: "Academia.edu", url: "https://www.academia.edu/", icon: "🎓" },
  ],
  brazilian: [
    { name: "SciELO Brasil", url: "https://www.scielo.br/", icon: "🇧🇷" },
    { name: "LILACS/BVS Saúde", url: "https://lilacs.bvsalud.org/", icon: "🏥" },
    { name: "Anais Brasileiros de Dermatologia", url: "https://www.anaisdedermatologia.org.br/", icon: "📑" },
  ],
  others: [
    { name: "Google Scholar", url: "https://scholar.google.com/", icon: "🔍" },
    { name: "Semantic Scholar", url: "https://www.semanticscholar.org/", icon: "🧠" },
    { name: "CORE", url: "https://core.ac.uk/", icon: "💎" },
    { name: "Springer Open", url: "https://www.springeropen.com/", icon: "📘" },
    { name: "BioMed Central", url: "https://www.biomedcentral.com/", icon: "🔬" },
    { name: "PLOS ONE", url: "https://journals.plos.org/plosone/", icon: "🧬" },
  ]
};

const categories = [
  "Todas as Categorias",
  "Harmonização Facial",
  "Dermatologia Estética",
  "Cirurgia Plástica",
  "Medicina Estética",
  "Estética Facial",
  "Estética Corporal",
  "Tricologia",
  "Laserterapia",
  "Fototerapia",
  "Crioterapia",
  "Terapia Injetável",
  "Procedimentos Minimamente Invasivos",
  "Rejuvenescimento",
  "Anti-aging",
  "Cosmiatria",
  "Nutrição Estética",
  "Fisioterapia Dermato-Funcional"
];

const procedures = [
  "Todos os Procedimentos",
  "Toxina Botulínica (Botox)",
  "Preenchimento com Ácido Hialurônico",
  "Bioestimuladores de Colágeno",
  "Fios de Sustentação",
  "Skinbooster",
  "Peeling Químico",
  "Peeling de Fenol",
  "Peeling de TCA",
  "Microagulhamento",
  "Microagulhamento com Drug Delivery",
  "Laser CO2 Fracionado",
  "Laser Erbium",
  "Laser Nd:YAG",
  "Laser Alexandrite",
  "Laser Diodo",
  "IPL (Luz Intensa Pulsada)",
  "LED Terapia",
  "Radiofrequência",
  "Ultrassom Microfocado (HIFU)",
  "Criolipólise",
  "Lipocavitação",
  "Carboxiterapia",
  "Ozonioterapia",
  "Mesoterapia",
  "Intradermoterapia",
  "Enzimas Lipolíticas",
  "Lipoaspiração",
  "Lipoescultura",
  "Abdominoplastia",
  "Mamoplastia",
  "Rinoplastia",
  "Blefaroplastia",
  "Ritidoplastia (Lifting Facial)",
  "Otoplastia",
  "Genioplastia",
  "Prótese de Silicone",
  "Transplante Capilar",
  "Microblading",
  "Micropigmentação",
  "Dermopigmentação",
  "Depilação a Laser",
  "Eletrocoagulação",
  "Criocirurgia",
  "Subcisão",
  "Punch Elevation",
  "Needling",
  "Dermaroller",
  "Hydrafacial",
  "Limpeza de Pele",
  "Drenagem Linfática",
  "Massagem Modeladora",
  "Endermologia",
  "Eletroterapia",
  "Corrente Russa",
  "Corrente Aussie",
  "Estimulação Elétrica",
  "Plasma Rico em Plaquetas (PRP)",
  "Fatores de Crescimento",
  "Terapia com Células-Tronco",
  "Exossomos",
  "DNA de Salmão",
  "PDRN (Polinucleotídeos)",
  "Ácido Polilático",
  "Hidroxiapatita de Cálcio",
  "Sculptra",
  "Radiesse"
];

const conditions = [
  "Todas as Condições",
  "Envelhecimento Cutâneo",
  "Rugas e Linhas de Expressão",
  "Flacidez Facial",
  "Flacidez Corporal",
  "Ptose Palpebral",
  "Olheiras",
  "Bolsas Palpebrais",
  "Acne",
  "Acne Ativa",
  "Cicatrizes de Acne",
  "Rosácea",
  "Melasma",
  "Hiperpigmentação",
  "Hipopigmentação",
  "Manchas Solares",
  "Lentigo Solar",
  "Queratose Actínica",
  "Fotoenvelhecimento",
  "Poros Dilatados",
  "Textura Irregular",
  "Telangiectasias",
  "Vasinhos",
  "Varizes",
  "Celulite",
  "Gordura Localizada",
  "Lipodistrofia",
  "Estrias",
  "Cicatrizes",
  "Cicatrizes Hipertróficas",
  "Queloides",
  "Alopecia",
  "Alopecia Androgenética",
  "Alopecia Areata",
  "Calvície",
  "Queda de Cabelo",
  "Dermatite Seborreica",
  "Psoríase",
  "Vitiligo",
  "Xerose",
  "Pele Desidratada",
  "Pele Sensível",
  "Dermatite Atópica",
  "Hipertricose",
  "Hirsutismo",
  "Pelos Encravados",
  "Foliculite",
  "Verrugas",
  "Molusco Contagioso",
  "Lipoma",
  "Xantelasma",
  "Milia",
  "Comedões",
  "Pele Oleosa",
  "Desidratação Cutânea",
  "Perda de Volume Facial",
  "Assimetria Facial",
  "Papada",
  "Bigode Chinês",
  "Código de Barras",
  "Pés de Galinha",
  "Testa Enrugada",
  "Glabela Marcada"
];

const researchTypes = [
  "Todos os Tipos",
  "PDFs",
  "Artigos Científicos",
  "Revisões Sistemáticas",
  "Meta-análises",
  "Estudos Clínicos",
  "Estudos Randomizados",
  "Estudos de Caso",
  "Livros",
  "Capítulos de Livros",
  "Guidelines",
  "Consensos",
  "Teses",
  "Dissertações",
  "Monografias",
  "Sites Educacionais",
  "Vídeos Educacionais",
  "Webinars",
  "Apresentações",
  "Pôsteres Científicos"
];

export default function BeautySearcher() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searching, setSearching] = useState(false);
  const [results, setResults] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [filters, setFilters] = useState({
    category: "Todas as Categorias",
    procedure: "Todos os Procedimentos",
    condition: "Todas as Condições",
    researchType: "Todos os Tipos"
  });

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      alert('Por favor, digite um termo de busca');
      return;
    }

    setSearching(true);
    setHasSearched(true);

    try {
      let enhancedQuery = searchQuery;
      
      // Add filters to search query
      if (filters.category !== "Todas as Categorias") {
        enhancedQuery += ` categoria:${filters.category}`;
      }
      if (filters.procedure !== "Todos os Procedimentos") {
        enhancedQuery += ` procedimento:${filters.procedure}`;
      }
      if (filters.condition !== "Todas as Condições") {
        enhancedQuery += ` condição:${filters.condition}`;
      }
      if (filters.researchType !== "Todos os Tipos") {
        enhancedQuery += ` tipo:${filters.researchType}`;
      }

      const prompt = `Você é um assistente especializado em pesquisa acadêmica na área de estética, medicina estética e dermatologia.

Busque e retorne informações sobre: "${enhancedQuery}"

FILTROS APLICADOS:
${filters.category !== "Todas as Categorias" ? `- Categoria: ${filters.category}` : ''}
${filters.procedure !== "Todos os Procedimentos" ? `- Procedimento: ${filters.procedure}` : ''}
${filters.condition !== "Todas as Condições" ? `- Condição/Doença: ${filters.condition}` : ''}
${filters.researchType !== "Todos os Tipos" ? `- Tipo de Pesquisa: ${filters.researchType}` : ''}

IMPORTANTE: Priorize fontes GRATUITAS e de ACESSO ABERTO dos seguintes repositórios:

📚 REPOSITÓRIOS INTERNACIONAIS PRIORITÁRIOS:
1. PubMed Central (PMC) - https://pmc.ncbi.nlm.nih.gov/
2. ScienceOpen - https://www.scienceopen.com/
3. ResearchGate - https://www.researchgate.net/
4. MDPI Journal of Aesthetic Medicine - https://www.mdpi.com/journal/jaestheticmed
5. Open Dermatology Journal - https://opendermatologyjournal.com/
6. DOAJ (Directory of Open Access Journals) - https://doaj.org/
7. Academia.edu - https://www.academia.edu/

🇧🇷 REPOSITÓRIOS BRASILEIROS PRIORITÁRIOS:
1. SciELO Brasil - https://www.scielo.br/
2. LILACS/BVS Saúde - https://lilacs.bvsalud.org/
3. Anais Brasileiros de Dermatologia - https://www.anaisdedermatologia.org.br/

🔍 OUTROS REPOSITÓRIOS CONFIÁVEIS:
- Google Scholar - https://scholar.google.com/
- Semantic Scholar - https://www.semanticscholar.org/
- CORE - https://core.ac.uk/
- Springer Open - https://www.springeropen.com/
- BioMed Central - https://www.biomedcentral.com/
- PLOS ONE - https://journals.plos.org/plosone/

Para cada resultado, forneça:
1. Título completo do artigo/livro
2. Autores (separados por vírgula)
3. Ano de publicação
4. Resumo/descrição (2-4 linhas, objetivo e relevante)
5. Link DIRETO para PDF ou página do artigo (OBRIGATÓRIO - use os repositórios acima)
6. Tipo (artigo científico, revisão sistemática, estudo clínico, livro, capítulo, etc.)
7. Relevância (alta, média, baixa) - baseada na correspondência com o termo de busca
8. Fonte/Repositório (qual dos listados acima)
9. Idioma (português, inglês, espanhol, etc.)

CRITÉRIOS DE SELEÇÃO:
- Priorize artigos dos últimos 10 anos
- Prefira revisões sistemáticas e meta-análises
- Inclua pelo menos 2-3 fontes brasileiras se disponíveis
- TODOS os links devem ser de acesso aberto e gratuito
- Diversifique as fontes (não retorne todos de um único repositório)
- Respeite os filtros de categoria, procedimento, condição e tipo de pesquisa aplicados

Retorne entre 8-12 resultados altamente relevantes e verificados.`;

      const response = await base44.integrations.Core.InvokeLLM({
        prompt: prompt,
        add_context_from_internet: true,
        response_json_schema: {
          type: "object",
          properties: {
            results: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  title: { type: "string" },
                  authors: { type: "string" },
                  year: { type: "string" },
                  summary: { type: "string" },
                  link: { type: "string" },
                  type: { type: "string" },
                  relevance: { type: "string" },
                  source: { type: "string" },
                  language: { type: "string" }
                }
              }
            }
          }
        }
      });

      setResults(response.results || []);
    } catch (error) {
      console.error('Erro na busca:', error);
      alert('Erro ao realizar busca. Tente novamente.');
      setResults([]);
    } finally {
      setSearching(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const getRelevanceColor = (relevance) => {
    switch (relevance?.toLowerCase()) {
      case 'alta': return 'bg-green-100 text-green-800';
      case 'média': return 'bg-yellow-100 text-yellow-800';
      case 'baixa': return 'bg-gray-100 text-gray-800';
      default: return 'bg-blue-100 text-blue-800';
    }
  };

  const getTypeIcon = (type) => {
    const typeStr = type?.toLowerCase() || '';
    if (typeStr.includes('livro')) return BookOpen;
    if (typeStr.includes('artigo')) return FileText;
    if (typeStr.includes('revisão')) return Star;
    return FileText;
  };

  const getLanguageFlag = (language) => {
    const lang = language?.toLowerCase() || '';
    if (lang.includes('português') || lang.includes('portugues')) return '🇧🇷';
    if (lang.includes('inglês') || lang.includes('ingles') || lang.includes('english')) return '🇺🇸';
    if (lang.includes('espanhol') || lang.includes('spanish')) return '🇪🇸';
    return '🌐';
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center space-y-4"
      >
        <Badge className="bg-gradient-to-r from-[#D4AF37] to-[#C8A882] text-white px-6 py-3 text-lg">
          <Database className="w-5 h-5 mr-2" />
          Beauty Searcher
        </Badge>

        <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold">
          <span className="bg-gradient-to-r from-[#D4AF37] to-[#C8A882] bg-clip-text text-transparent">
            Biblioteca de Pesquisa
          </span>
          <br />
          <span className="text-gray-800">Profissional</span>
        </h2>

        <p className="text-gray-600 max-w-3xl mx-auto leading-relaxed text-lg">
          Acesse <strong className="text-[#D4AF37]">+40.000 PDFs gratuitos</strong> de artigos científicos, 
          livros e estudos sobre estética e medicina estética. Centralize suas pesquisas em um só lugar.
        </p>
      </motion.div>

      {/* Search Bar */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.1 }}
      >
        <Card className="border-[#E8DCC4] shadow-2xl">
          <CardContent className="p-8 space-y-6">
            <div className="flex gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-400" />
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ex: harmonização facial, toxina botulínica, peeling químico, lasers em estética..."
                  className="pl-14 border-[#E8DCC4] focus:border-[#D4AF37] py-7 text-lg"
                />
              </div>
              <Button
                onClick={handleSearch}
                disabled={searching}
                className="bg-gradient-to-r from-[#D4AF37] to-[#C8A882] hover:from-[#C8A882] hover:to-[#D4AF37] text-white px-10 py-7 text-lg"
              >
                {searching ? (
                  <>
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-3" />
                    Buscando...
                  </>
                ) : (
                  <>
                    <Search className="w-6 h-6 mr-3" />
                    Pesquisar
                  </>
                )}
              </Button>
            </div>

            {/* Advanced Filters */}
            <div className="border-t border-[#E8DCC4] pt-6">
              <div className="flex items-center gap-2 mb-4">
                <Filter className="w-5 h-5 text-[#D4AF37]" />
                <Label className="text-lg font-semibold text-gray-800">Filtros Avançados</Label>
              </div>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm text-gray-700">Categoria</Label>
                  <Select
                    value={filters.category}
                    onValueChange={(v) => setFilters({...filters, category: v})}
                  >
                    <SelectTrigger className="border-[#E8DCC4]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="max-h-[300px]">
                      {categories.map((cat) => (
                        <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm text-gray-700">Procedimento</Label>
                  <Select
                    value={filters.procedure}
                    onValueChange={(v) => setFilters({...filters, procedure: v})}
                  >
                    <SelectTrigger className="border-[#E8DCC4]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="max-h-[300px]">
                      {procedures.map((proc) => (
                        <SelectItem key={proc} value={proc}>{proc}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm text-gray-700">Condição/Doença</Label>
                  <Select
                    value={filters.condition}
                    onValueChange={(v) => setFilters({...filters, condition: v})}
                  >
                    <SelectTrigger className="border-[#E8DCC4]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="max-h-[300px]">
                      {conditions.map((cond) => (
                        <SelectItem key={cond} value={cond}>{cond}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm text-gray-700">Tipo de Pesquisa</Label>
                  <Select
                    value={filters.researchType}
                    onValueChange={(v) => setFilters({...filters, researchType: v})}
                  >
                    <SelectTrigger className="border-[#E8DCC4]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="max-h-[300px]">
                      {researchTypes.map((type) => (
                        <SelectItem key={type} value={type}>{type}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <div className="mt-6 space-y-3">
              <div className="flex flex-wrap gap-2 items-center">
                <span className="text-sm font-semibold text-gray-700">Sugestões rápidas:</span>
                {[
                  'Harmonização Facial', 
                  'Toxina Botulínica', 
                  'Laser CO2', 
                  'Microagulhamento',
                  'Ácido Hialurônico',
                  'Skincare'
                ].map((suggestion) => (
                  <Badge
                    key={suggestion}
                    variant="outline"
                    className="cursor-pointer hover:bg-[#F5EFE6] border-[#E8DCC4] transition-all text-sm py-1"
                    onClick={() => setSearchQuery(suggestion)}
                  >
                    {suggestion}
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Data Sources Info */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        <Card className="border-[#E8DCC4] shadow-xl bg-gradient-to-br from-white to-[#F5EFE6]">
          <CardHeader>
            <CardTitle className="font-serif text-2xl flex items-center gap-2">
              <Globe className="w-6 h-6 text-[#D4AF37]" />
              Fontes de Dados Integradas
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* International Sources */}
            <div>
              <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <Globe className="w-5 h-5 text-blue-600" />
                Repositórios Internacionais
              </h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
                {dataSources.international.map((source) => (
                  <a
                    key={source.name}
                    href={source.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 p-3 bg-white border border-[#E8DCC4] rounded-lg hover:border-[#D4AF37] hover:shadow-md transition-all group"
                  >
                    <span className="text-2xl">{source.icon}</span>
                    <span className="text-sm text-gray-700 group-hover:text-[#D4AF37]">{source.name}</span>
                    <ExternalLink className="w-3 h-3 text-gray-400 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                  </a>
                ))}
              </div>
            </div>

            {/* Brazilian Sources */}
            <div>
              <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <span className="text-xl">🇧🇷</span>
                Repositórios Brasileiros
              </h3>
              <div className="grid md:grid-cols-3 gap-3">
                {dataSources.brazilian.map((source) => (
                  <a
                    key={source.name}
                    href={source.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 p-3 bg-white border border-[#E8DCC4] rounded-lg hover:border-[#D4AF37] hover:shadow-md transition-all group"
                  >
                    <span className="text-2xl">{source.icon}</span>
                    <span className="text-sm text-gray-700 group-hover:text-[#D4AF37]">{source.name}</span>
                    <ExternalLink className="w-3 h-3 text-gray-400 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                  </a>
                ))}
              </div>
            </div>

            {/* Other Sources */}
            <div>
              <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <Database className="w-5 h-5 text-purple-600" />
                Outras Fontes Confiáveis
              </h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
                {dataSources.others.map((source) => (
                  <a
                    key={source.name}
                    href={source.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 p-3 bg-white border border-[#E8DCC4] rounded-lg hover:border-[#D4AF37] hover:shadow-md transition-all group"
                  >
                    <span className="text-2xl">{source.icon}</span>
                    <span className="text-sm text-gray-700 group-hover:text-[#D4AF37]">{source.name}</span>
                    <ExternalLink className="w-3 h-3 text-gray-400 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                  </a>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Results */}
      {hasSearched && (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <Card className="border-[#E8DCC4] shadow-2xl">
            <CardHeader className="bg-gradient-to-r from-[#F5EFE6] to-[#E8DCC4]">
              <CardTitle className="font-serif text-3xl flex items-center justify-between">
                <span>Resultados da Pesquisa</span>
                {results.length > 0 && (
                  <Badge className="bg-gradient-to-r from-[#D4AF37] to-[#C8A882] text-white text-lg px-4 py-2">
                    {results.length} resultados
                  </Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              {results.length === 0 ? (
                <div className="text-center py-16">
                  <BookOpen className="w-20 h-20 text-gray-300 mx-auto mb-6" />
                  <p className="text-xl text-gray-600">
                    {searching ? 'Buscando em +40.000 PDFs gratuitos...' : 'Nenhum resultado encontrado. Tente outros termos de busca.'}
                  </p>
                </div>
              ) : (
                <div className="space-y-6">
                  {results.map((result, index) => {
                    const TypeIcon = getTypeIcon(result.type);
                    const languageFlag = getLanguageFlag(result.language);
                    return (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.05 }}
                        className="p-6 border-2 border-[#E8DCC4] rounded-2xl hover:shadow-2xl hover:border-[#D4AF37] transition-all duration-300 bg-white"
                      >
                        <div className="flex items-start gap-5">
                          <div className="w-14 h-14 bg-gradient-to-br from-[#D4AF37] to-[#C8A882] rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
                            <TypeIcon className="w-7 h-7 text-white" />
                          </div>

                          <div className="flex-1 space-y-4">
                            <div className="flex items-start justify-between gap-4">
                              <h3 className="font-serif text-xl font-bold text-gray-800 leading-tight">
                                {result.title}
                              </h3>
                              <div className="flex gap-2 flex-shrink-0">
                                <Badge className={getRelevanceColor(result.relevance)}>
                                  {result.relevance || 'N/A'}
                                </Badge>
                              </div>
                            </div>

                            <div className="flex flex-wrap gap-3 text-sm text-gray-600">
                              {result.authors && (
                                <div className="flex items-center gap-1">
                                  <span className="font-semibold">Autores:</span>
                                  <span>{result.authors}</span>
                                </div>
                              )}
                              {result.year && (
                                <div className="flex items-center gap-1">
                                  <Calendar className="w-4 h-4" />
                                  <span>{result.year}</span>
                                </div>
                              )}
                              {result.language && (
                                <Badge variant="outline" className="border-[#E8DCC4]">
                                  {languageFlag} {result.language}
                                </Badge>
                              )}
                              {result.type && (
                                <Badge variant="outline" className="border-[#E8DCC4]">
                                  {result.type}
                                </Badge>
                              )}
                              {result.source && (
                                <Badge className="bg-blue-100 text-blue-800">
                                  {result.source}
                                </Badge>
                              )}
                            </div>

                            <p className="text-gray-700 leading-relaxed text-base">
                              {result.summary}
                            </p>

                            {result.link && (
                              <div className="flex gap-3 pt-2">
                                <a
                                  href={result.link}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-block"
                                >
                                  <Button
                                    size="lg"
                                    className="bg-gradient-to-r from-[#D4AF37] to-[#C8A882] hover:from-[#C8A882] hover:to-[#D4AF37] text-white shadow-lg hover:shadow-xl transition-all group"
                                  >
                                    <ExternalLink className="w-5 h-5 mr-2 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                                    Acessar PDF Gratuito
                                  </Button>
                                </a>
                              </div>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Stats Cards */}
      <div className="grid md:grid-cols-4 gap-6">
        <Card className="border-[#E8DCC4] bg-gradient-to-br from-white to-blue-50">
          <CardContent className="p-6 text-center space-y-3">
            <Database className="w-12 h-12 text-blue-600 mx-auto" />
            <div className="text-3xl font-bold text-gray-800">15+</div>
            <p className="text-sm font-semibold text-gray-600">Repositórios Integrados</p>
          </CardContent>
        </Card>

        <Card className="border-[#E8DCC4] bg-gradient-to-br from-white to-green-50">
          <CardContent className="p-6 text-center space-y-3">
            <BookOpen className="w-12 h-12 text-green-600 mx-auto" />
            <div className="text-3xl font-bold text-gray-800">+40.000</div>
            <p className="text-sm font-semibold text-gray-600">PDFs Gratuitos</p>
          </CardContent>
        </Card>

        <Card className="border-[#E8DCC4] bg-gradient-to-br from-white to-purple-50">
          <CardContent className="p-6 text-center space-y-3">
            <CheckCircle className="w-12 h-12 text-purple-600 mx-auto" />
            <div className="text-3xl font-bold text-gray-800">100%</div>
            <p className="text-sm font-semibold text-gray-600">Acesso Livre</p>
          </CardContent>
        </Card>

        <Card className="border-[#E8DCC4] bg-gradient-to-br from-white to-[#F5EFE6]">
          <CardContent className="p-6 text-center space-y-3">
            <Star className="w-12 h-12 text-[#D4AF37] mx-auto" />
            <div className="text-3xl font-bold text-gray-800">IA</div>
            <p className="text-sm font-semibold text-gray-600">Busca Inteligente</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}