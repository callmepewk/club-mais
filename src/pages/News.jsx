import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import { 
  Newspaper, ExternalLink, Calendar, Search, 
  Sparkles, TrendingUp, Clock, Eye
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export default function News() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    setLoading(true);
    try {
      const response = await base44.integrations.Core.InvokeLLM({
        prompt: `Busque as últimas 10 notícias recentes e relevantes sobre estética, beleza, saúde da pele, tratamentos estéticos, e medicina estética. 
        
        Para cada notícia, forneça:
        - title: título da notícia
        - description: resumo de 2-3 frases
        - source: nome da fonte/jornal
        - url: link para a notícia original (use URLs reais e verificáveis de sites brasileiros de notícias sobre beleza e saúde)
        - image_url: URL de uma imagem relevante do Unsplash
        - published_date: data de publicação no formato ISO
        - category: uma das categorias: "Estética Facial", "Estética Corporal", "Saúde da Pele", "Tendências", "Tecnologia"
        
        Priorize fontes confiáveis brasileiras como Vogue, Marie Claire, Glamour, revistas de dermatologia, etc.`,
        add_context_from_internet: true,
        response_json_schema: {
          type: "object",
          properties: {
            articles: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  title: { type: "string" },
                  description: { type: "string" },
                  source: { type: "string" },
                  url: { type: "string" },
                  image_url: { type: "string" },
                  published_date: { type: "string" },
                  category: { type: "string" }
                }
              }
            }
          }
        }
      });

      setNews(response.articles || []);
    } catch (error) {
      console.error("Error fetching news:", error);
      // Fallback data
      setNews([
        {
          title: "Novas Tendências em Harmonização Facial para 2025",
          description: "Descubra as técnicas mais inovadoras que estão revolucionando os tratamentos de harmonização facial no Brasil.",
          source: "Vogue Brasil",
          url: "https://vogue.globo.com",
          image_url: "https://images.unsplash.com/photo-1560750588-73207b1ef5b8?w=800&q=80",
          published_date: new Date().toISOString(),
          category: "Estética Facial"
        }
      ]);
    }
    setLoading(false);
  };

  const filteredNews = news.filter(article =>
    article.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    article.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    article.category?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const categoryColors = {
    "Estética Facial": "bg-blue-100 text-blue-800 border-blue-200",
    "Estética Corporal": "bg-purple-100 text-purple-800 border-purple-200",
    "Saúde da Pele": "bg-green-100 text-green-800 border-green-200",
    "Tendências": "bg-pink-100 text-pink-800 border-pink-200",
    "Tecnologia": "bg-orange-100 text-orange-800 border-orange-200"
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-[#F5EFE6] to-white">
      {/* Hero Section */}
      <div className="relative py-20 px-6 overflow-hidden bg-gradient-to-br from-white via-[#F5EFE6] to-[#E8DCC4]">
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
            className="text-center space-y-6"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full border border-[#D4AF37]/20 shadow-lg">
              <TrendingUp className="w-4 h-4 text-[#D4AF37]" />
              <span className="text-sm font-medium text-[#C8A882]">
                Sempre atualizado
              </span>
            </div>

            <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl font-bold">
              <span className="text-gray-800">Notícias de</span>
              <br />
              <span className="bg-gradient-to-r from-[#D4AF37] to-[#C8A882] bg-clip-text text-transparent">
                Beleza & Estética
              </span>
            </h1>

            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Fique por dentro das últimas tendências, novidades e descobertas do mundo da estética e saúde
            </p>
          </motion.div>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="py-12 px-6 bg-white border-b border-[#E8DCC4]">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative flex-1 w-full max-w-2xl">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar notícias..."
                className="pl-12 py-6 text-lg border-[#E8DCC4] focus:border-[#D4AF37]"
              />
            </div>
            <Button
              onClick={fetchNews}
              variant="outline"
              className="border-[#D4AF37] text-[#D4AF37] hover:bg-[#F5EFE6]"
            >
              Atualizar
            </Button>
          </div>
        </div>
      </div>

      {/* News Grid */}
      <div className="py-16 px-6">
        <div className="max-w-7xl mx-auto">
          {loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {Array(6).fill(0).map((_, i) => (
                <Card key={i} className="overflow-hidden">
                  <Skeleton className="h-48 w-full" />
                  <CardContent className="p-6 space-y-3">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-6 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : filteredNews.length === 0 ? (
            <div className="text-center py-20">
              <Newspaper className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-xl text-gray-500">Nenhuma notícia encontrada</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredNews.map((article, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <Card className="h-full overflow-hidden border-[#E8DCC4] hover:border-[#D4AF37] transition-all duration-300 hover:shadow-xl group bg-white">
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={article.image_url}
                        alt={article.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                      <Badge 
                        className={`absolute top-4 left-4 ${categoryColors[article.category] || 'bg-gray-100 text-gray-800'} border`}
                      >
                        {article.category}
                      </Badge>
                    </div>

                    <CardContent className="p-6 space-y-4">
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Clock className="w-4 h-4" />
                        <span>
                          {article.published_date 
                            ? format(new Date(article.published_date), "dd 'de' MMMM, yyyy", { locale: ptBR })
                            : "Data não disponível"
                          }
                        </span>
                      </div>

                      <h3 className="font-serif text-xl font-bold text-gray-800 line-clamp-2 group-hover:text-[#D4AF37] transition-colors">
                        {article.title}
                      </h3>

                      <p className="text-gray-600 line-clamp-3">
                        {article.description}
                      </p>

                      <div className="flex items-center justify-between pt-4 border-t border-[#E8DCC4]">
                        <div className="flex items-center gap-2">
                          <Newspaper className="w-4 h-4 text-[#C8A882]" />
                          <span className="text-sm font-medium text-[#C8A882]">
                            {article.source}
                          </span>
                        </div>

                        <a
                          href={article.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-[#D4AF37] hover:text-[#C8A882] hover:bg-[#F5EFE6] group"
                          >
                            Ler mais
                            <ExternalLink className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                          </Button>
                        </a>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Newsletter Section */}
      <div className="py-20 px-6 bg-gradient-to-br from-[#D4AF37] via-[#C8A882] to-[#D4AF37]">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="space-y-6"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full border border-white/30">
              <Sparkles className="w-4 h-4 text-white" />
              <span className="text-sm font-medium text-white">
                Fique sempre atualizado
              </span>
            </div>

            <h2 className="font-serif text-4xl md:text-5xl font-bold text-white leading-tight">
              Receba as novidades em primeira mão
            </h2>

            <p className="text-xl text-white/90">
              Cadastre-se e receba as últimas tendências e notícias direto no seu e-mail
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center max-w-md mx-auto pt-4">
              <Input
                placeholder="Seu e-mail"
                className="bg-white/90 backdrop-blur-sm border-white/30 py-6 text-lg"
              />
              <Button 
                size="lg"
                className="bg-white text-[#D4AF37] hover:bg-white/90 shadow-xl px-8 py-6 font-semibold"
              >
                Inscrever
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}