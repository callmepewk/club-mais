import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { motion } from "framer-motion";
import { 
  Newspaper, ExternalLink, Calendar, Search, 
  Sparkles, TrendingUp, Clock, Eye, Plus, Shield
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export default function News() {
  const [searchQuery, setSearchQuery] = useState("");
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [newsUrl, setNewsUrl] = useState("");
  const queryClient = useQueryClient();

  const { data: user } = useQuery({
    queryKey: ['current-user-news'],
    queryFn: () => base44.auth.me().catch(() => null),
  });

  const { data: news = [], isLoading: loading } = useQuery({
    queryKey: ['news-articles'],
    queryFn: async () => {
      const articles = await base44.entities.NewsArticle.filter({ ativa: true }, '-created_date');
      
      // Check if need to auto-update (every 7 days)
      const lastUpdate = localStorage.getItem('newsLastAutoUpdate');
      const now = Date.now();
      const sevenDays = 7 * 24 * 60 * 60 * 1000;
      
      if (!lastUpdate || (now - parseInt(lastUpdate)) > sevenDays) {
        autoGenerateNews();
        localStorage.setItem('newsLastAutoUpdate', now.toString());
      }
      
      return articles;
    },
    refetchInterval: 60000, // Refetch every minute to check for new articles
  });

  const autoGenerateNews = async () => {
    try {
      const response = await base44.integrations.Core.InvokeLLM({
        prompt: `Gere 6 notícias REAIS e ATUAIS sobre: saúde, medicina, medicina estética, qualidade de vida.
        
        Use fontes brasileiras confiáveis como:
        - Ministério da Saúde (gov.br/saude)
        - Sociedade Brasileira de Dermatologia (sbd.org.br)
        - Vogue Brasil (vogue.globo.com)
        - Bem Estar - G1 (g1.globo.com/bemestar)
        
        Para cada notícia forneça:
        - titulo: título da notícia
        - descricao: resumo em 2-3 frases
        - link_original: URL real da fonte
        - imagem_url: imagem do Unsplash relacionada (use termos: health, medicine, wellness, beauty, skincare)
        - categoria: saude, medicina, estetica, ou qualidade_vida
        - fonte: nome do portal
        - data_publicacao: data atual`,
        add_context_from_internet: true,
        response_json_schema: {
          type: "object",
          properties: {
            noticias: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  titulo: { type: "string" },
                  descricao: { type: "string" },
                  link_original: { type: "string" },
                  imagem_url: { type: "string" },
                  categoria: { type: "string" },
                  fonte: { type: "string" },
                  data_publicacao: { type: "string" }
                }
              }
            }
          }
        }
      });

      if (response?.noticias) {
        const proxima = new Date();
        proxima.setDate(proxima.getDate() + 7);
        
        for (const noticia of response.noticias) {
          await base44.entities.NewsArticle.create({
            ...noticia,
            gerada_por_ia: true,
            ativa: true,
            proxima_atualizacao: proxima.toISOString()
          });
        }
        
        queryClient.invalidateQueries(['news-articles']);
      }
    } catch (e) {
      console.error('Erro ao gerar notícias:', e);
    }
  };

  useEffect(() => {
    checkAutoUpdate();
  }, []);

  const checkAutoUpdate = async () => {
    const lastUpdate = localStorage.getItem('newsLastAutoUpdate');
    const now = Date.now();
    const sevenDays = 7 * 24 * 60 * 60 * 1000;
    
    if (!lastUpdate || (now - parseInt(lastUpdate)) > sevenDays) {
      await autoGenerateNews();
      localStorage.setItem('newsLastAutoUpdate', now.toString());
    }
  };

  const addNewsMutation = useMutation({
    mutationFn: async (url) => {
      const response = await base44.integrations.Core.InvokeLLM({
        prompt: `Extraia informações da notícia no link: ${url}
        
        Forneça:
        - titulo: título da notícia
        - descricao: resumo em 2-3 frases
        - link_original: ${url}
        - imagem_url: encontre uma imagem relevante no artigo ou use uma do Unsplash sobre o tema
        - categoria: saude, medicina, estetica, ou qualidade_vida
        - fonte: nome do site/portal
        - data_publicacao: data de publicação da notícia`,
        add_context_from_internet: true,
        response_json_schema: {
          type: "object",
          properties: {
            titulo: { type: "string" },
            descricao: { type: "string" },
            link_original: { type: "string" },
            imagem_url: { type: "string" },
            categoria: { type: "string" },
            fonte: { type: "string" },
            data_publicacao: { type: "string" }
          }
        }
      });

      const proxima = new Date();
      proxima.setDate(proxima.getDate() + 7);
      
      return await base44.entities.NewsArticle.create({
        ...response,
        gerada_por_ia: false,
        ativa: true,
        proxima_atualizacao: proxima.toISOString()
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['news-articles']);
      setShowAdminModal(false);
      setNewsUrl("");
      alert('Notícia adicionada com sucesso!');
    },
  });

  const filteredNews = news.filter(article =>
    article.titulo?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    article.descricao?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    article.categoria?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const categoryColors = {
    "saude": "bg-green-100 text-green-800 border-green-200",
    "medicina": "bg-blue-100 text-blue-800 border-blue-200",
    "estetica": "bg-purple-100 text-purple-800 border-purple-200",
    "qualidade_vida": "bg-pink-100 text-pink-800 border-pink-200",
    "tecnologia": "bg-orange-100 text-orange-800 border-orange-200",
    "procedimentos": "bg-indigo-100 text-indigo-800 border-indigo-200"
  };

  const categoryLabels = {
    "saude": "Saúde",
    "medicina": "Medicina",
    "estetica": "Estética",
    "qualidade_vida": "Qualidade de Vida",
    "tecnologia": "Tecnologia",
    "procedimentos": "Procedimentos"
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

            {user?.role === 'admin' && (
              <Button
                onClick={() => setShowAdminModal(true)}
                className="mt-4 bg-gradient-to-r from-[#D4AF37] to-[#C8A882] text-white"
              >
                <Plus className="w-4 h-4 mr-2" />
                Adicionar Notícia
              </Button>
            )}
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
              onClick={() => {
                autoGenerateNews();
                queryClient.invalidateQueries(['news-articles']);
              }}
              variant="outline"
              className="border-[#D4AF37] text-[#D4AF37] hover:bg-[#F5EFE6]"
            >
              <TrendingUp className="w-4 h-4 mr-2" />
              Atualizar Notícias
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
                   <div className="relative h-48 overflow-hidden bg-gray-100">
                     {article.imagem_url ? (
                       <img
                         src={article.imagem_url}
                         alt={article.titulo}
                         className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                         onError={(e) => {
                           e.target.style.display = 'none';
                         }}
                       />
                     ) : (
                       <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#F5EFE6] to-[#E8DCC4]">
                         <Newspaper className="w-16 h-16 text-[#D4AF37] opacity-30" />
                       </div>
                     )}
                     <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                     <Badge 
                       className={`absolute top-4 left-4 ${categoryColors[article.categoria] || 'bg-gray-100 text-gray-800'} border`}
                     >
                       {categoryLabels[article.categoria] || article.categoria}
                     </Badge>
                   </div>

                   <CardContent className="p-6 space-y-4">
                     <div className="flex items-center gap-2 text-sm text-gray-500">
                       <Clock className="w-4 h-4" />
                       <span>
                         {article.data_publicacao || article.created_date
                           ? format(new Date(article.data_publicacao || article.created_date), "dd 'de' MMMM, yyyy", { locale: ptBR })
                           : "Data não disponível"
                         }
                       </span>
                     </div>

                     <h3 className="font-serif text-xl font-bold text-gray-800 line-clamp-2 group-hover:text-[#D4AF37] transition-colors">
                       {article.titulo}
                     </h3>

                     <p className="text-gray-600 line-clamp-3">
                       {article.descricao}
                     </p>

                     <div className="flex items-center justify-between pt-4 border-t border-[#E8DCC4]">
                       <div className="flex items-center gap-2">
                         <Newspaper className="w-4 h-4 text-[#C8A882]" />
                         <span className="text-sm font-medium text-[#C8A882]">
                           {article.fonte || 'Fonte'}
                         </span>
                       </div>

                       <a
                         href={article.link_original}
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

      {/* Admin Modal */}
      <Dialog open={showAdminModal} onOpenChange={setShowAdminModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl font-serif flex items-center gap-2">
              <Shield className="w-6 h-6 text-[#D4AF37]" />
              Adicionar Notícia
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Link da Notícia</Label>
              <Input
                value={newsUrl}
                onChange={(e) => setNewsUrl(e.target.value)}
                placeholder="https://exemplo.com/noticia"
                className="mt-2"
              />
              <p className="text-xs text-gray-500 mt-1">
                Cole o link de uma notícia oficial e a IA gerará automaticamente o card
              </p>
            </div>

            <div className="flex gap-3">
              <Button
                onClick={() => setShowAdminModal(false)}
                variant="outline"
                className="flex-1"
              >
                Cancelar
              </Button>
              <Button
                onClick={() => addNewsMutation.mutate(newsUrl)}
                disabled={!newsUrl || addNewsMutation.isPending}
                className="flex-1 bg-gradient-to-r from-[#D4AF37] to-[#C8A882] text-white"
              >
                {addNewsMutation.isPending ? 'Gerando...' : 'Adicionar'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}