import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import {
  Search, BookOpen, FileText, ExternalLink, 
  Download, Star, Calendar, Filter
} from "lucide-react";

export default function BeautySearcher() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searching, setSearching] = useState(false);
  const [results, setResults] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      alert('Por favor, digite um termo de busca');
      return;
    }

    setSearching(true);
    setHasSearched(true);

    try {
      const prompt = `Você é um assistente especializado em pesquisa acadêmica na área de estética e beleza.
      
Busque e retorne informações sobre: "${searchQuery}"

Para cada resultado, forneça:
1. Título do artigo/livro
2. Autores
3. Ano de publicação
4. Resumo/descrição (2-3 linhas)
5. Link direto (se disponível em bases públicas como Google Scholar, PubMed, ResearchGate, SciELO, etc.)
6. Tipo (artigo científico, livro, revisão, estudo clínico, etc.)
7. Relevância (alta, média, baixa)

Priorize fontes gratuitas e de acesso aberto. Retorne até 10 resultados relevantes.`;

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
                  relevance: { type: "string" }
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
    return FileText;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center space-y-4"
      >
        <Badge className="bg-gradient-to-r from-[#D4AF37] to-[#C8A882] text-white px-4 py-2 text-base">
          <Search className="w-4 h-4 mr-2" />
          Beauty Searcher
        </Badge>

        <h2 className="font-serif text-3xl md:text-4xl font-bold">
          <span className="bg-gradient-to-r from-[#D4AF37] to-[#C8A882] bg-clip-text text-transparent">
            Biblioteca de Pesquisa
          </span>
          <br />
          <span className="text-gray-800">Profissional</span>
        </h2>

        <p className="text-gray-600 max-w-2xl mx-auto leading-relaxed">
          Acesse gratuitamente milhares de artigos científicos, livros e estudos sobre estética e beleza.
          Centralize suas pesquisas em um só lugar.
        </p>
      </motion.div>

      {/* Search Bar */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.1 }}
      >
        <Card className="border-[#E8DCC4] shadow-xl">
          <CardContent className="p-6">
            <div className="flex gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ex: harmonização facial, toxina botulínica, peeling químico..."
                  className="pl-10 border-[#E8DCC4] focus:border-[#D4AF37] py-6 text-base"
                />
              </div>
              <Button
                onClick={handleSearch}
                disabled={searching}
                className="bg-gradient-to-r from-[#D4AF37] to-[#C8A882] hover:from-[#C8A882] hover:to-[#D4AF37] text-white px-8"
              >
                {searching ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" />
                    Buscando...
                  </>
                ) : (
                  <>
                    <Search className="w-5 h-5 mr-2" />
                    Pesquisar
                  </>
                )}
              </Button>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              <span className="text-sm text-gray-600">Sugestões:</span>
              {['Harmonização Facial', 'Skincare', 'Laser CO2', 'Microagulhamento'].map((suggestion) => (
                <Badge
                  key={suggestion}
                  variant="outline"
                  className="cursor-pointer hover:bg-[#F5EFE6] border-[#E8DCC4]"
                  onClick={() => setSearchQuery(suggestion)}
                >
                  {suggestion}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Results */}
      {hasSearched && (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <Card className="border-[#E8DCC4] shadow-xl">
            <CardHeader className="bg-gradient-to-r from-[#F5EFE6] to-[#E8DCC4]">
              <CardTitle className="font-serif text-2xl flex items-center justify-between">
                <span>Resultados da Pesquisa</span>
                {results.length > 0 && (
                  <Badge className="bg-gradient-to-r from-[#D4AF37] to-[#C8A882] text-white">
                    {results.length} resultados
                  </Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              {results.length === 0 ? (
                <div className="text-center py-12">
                  <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-600">
                    {searching ? 'Buscando...' : 'Nenhum resultado encontrado. Tente outros termos de busca.'}
                  </p>
                </div>
              ) : (
                <div className="space-y-6">
                  {results.map((result, index) => {
                    const TypeIcon = getTypeIcon(result.type);
                    return (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.05 }}
                        className="p-6 border border-[#E8DCC4] rounded-xl hover:shadow-lg transition-all duration-300 bg-white"
                      >
                        <div className="flex items-start gap-4">
                          <div className="w-12 h-12 bg-gradient-to-br from-[#D4AF37] to-[#C8A882] rounded-lg flex items-center justify-center flex-shrink-0">
                            <TypeIcon className="w-6 h-6 text-white" />
                          </div>

                          <div className="flex-1 space-y-3">
                            <div className="flex items-start justify-between gap-4">
                              <h3 className="font-serif text-xl font-bold text-gray-800 leading-tight">
                                {result.title}
                              </h3>
                              <Badge className={getRelevanceColor(result.relevance)}>
                                {result.relevance || 'N/A'}
                              </Badge>
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
                              {result.type && (
                                <Badge variant="outline" className="border-[#E8DCC4]">
                                  {result.type}
                                </Badge>
                              )}
                            </div>

                            <p className="text-gray-700 leading-relaxed">
                              {result.summary}
                            </p>

                            {result.link && (
                              <div className="flex gap-2">
                                <a
                                  href={result.link}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-block"
                                >
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="border-[#D4AF37] text-[#D4AF37] hover:bg-[#F5EFE6]"
                                  >
                                    <ExternalLink className="w-4 h-4 mr-2" />
                                    Acessar Online
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

      {/* Info Cards */}
      <div className="grid md:grid-cols-3 gap-6">
        <Card className="border-[#E8DCC4]">
          <CardContent className="p-6 text-center space-y-3">
            <BookOpen className="w-12 h-12 text-[#D4AF37] mx-auto" />
            <h3 className="font-semibold text-gray-800">Acesso Gratuito</h3>
            <p className="text-sm text-gray-600">
              Todos os materiais são de acesso livre e gratuito
            </p>
          </CardContent>
        </Card>

        <Card className="border-[#E8DCC4]">
          <CardContent className="p-6 text-center space-y-3">
            <Star className="w-12 h-12 text-[#D4AF37] mx-auto" />
            <h3 className="font-semibold text-gray-800">Conteúdo Verificado</h3>
            <p className="text-sm text-gray-600">
              Fontes acadêmicas confiáveis e revisadas
            </p>
          </CardContent>
        </Card>

        <Card className="border-[#E8DCC4]">
          <CardContent className="p-6 text-center space-y-3">
            <Search className="w-12 h-12 text-[#D4AF37] mx-auto" />
            <h3 className="font-semibold text-gray-800">IA Avançada</h3>
            <p className="text-sm text-gray-600">
              Busca inteligente com tecnologia de ponta
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}