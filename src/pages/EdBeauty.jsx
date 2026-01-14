import React, { useState, useMemo } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import {
  GraduationCap, Search, BookOpen, Video, FileText,
  Clock, Award, ExternalLink, Sparkles, Lock, ArrowRight, Plus
} from "lucide-react";
import BeautySearcher from "../components/BeautySearcher";

const typeIcons = {
  video: Video,
  curso: GraduationCap,
  ebook: BookOpen
};

const planoLabels = {
  none: "Nenhum",
  light: "Light",
  gold: "Gold",
  vip: "VIP"
};

const planoColors = {
  none: "bg-gray-200 text-gray-700",
  light: "bg-gray-100 text-gray-800",
  gold: "bg-gradient-to-r from-[#D4AF37] to-[#C8A882] text-white",
  vip: "bg-gradient-to-r from-purple-600 to-purple-800 text-white"
};

const tipoAcessoLabels = {
  gratuito: "Gratuito",
  pago: "Pago",
  exclusivo: "Exclusivo"
};

const tipoAcessoColors = {
  gratuito: "bg-green-100 text-green-800",
  pago: "bg-blue-100 text-blue-800",
  exclusivo: "bg-purple-100 text-purple-800"
};

export default function EdBeauty() {
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("Todas");
  const [typeFilter, setTypeFilter] = useState("Todos");
  const [tipoAcessoFilter, setTipoAcessoFilter] = useState("Todos");
  const [publicoAlvoFilter, setPublicoAlvoFilter] = useState("Todos");
  const [user, setUser] = useState(null);

  const { data: contents = [], isLoading: loadingContents } = useQuery({
    queryKey: ['edbeauty-contents'],
    queryFn: () => base44.entities.EdBeautyContent.list('-created_date'),
    initialData: [],
  });

  const { data: userData, isLoading: loadingUser } = useQuery({
    queryKey: ['current-user'],
    queryFn: async () => {
      try {
        const currentUser = await base44.auth.me();
        setUser(currentUser);
        return currentUser;
      } catch (error) {
        return null;
      }
    },
  });

  const canAccessContent = (content) => {
    // Conteúdo gratuito: todos podem acessar
    if (content.tipo_acesso === 'gratuito') return true;

    // Se não estiver logado, não pode acessar conteúdo pago/exclusivo
    if (!user) return false;

    // Admin pode tudo
    if (user.role === 'admin') return true;

    // Verificar público-alvo com hierarquia
    if (content.publico_alvo !== 'todos') {
      const [targetTipo, targetPlano] = content.publico_alvo.split('-');
      
      // Se o conteúdo não é para o tipo de usuário, não pode acessar
      if (user.tipo_usuario !== targetTipo) return false;
      
      // Hierarquia de planos: none < light < gold < vip
      // Usuário com plano superior pode ver conteúdos de planos inferiores
      const planHierarchy = { none: 0, light: 1, gold: 2, vip: 3 };
      const userPlan = user.clube_plano || 'none';
      const userLevel = planHierarchy[userPlan];
      const targetLevel = planHierarchy[targetPlano];
      
      // REGRA: light vê só light, gold vê gold+light, vip vê vip+gold+light
      // Usuário precisa ter plano >= ao plano do conteúdo
      if (userLevel < targetLevel) return false;
    }

    return true;
  };

  const canUploadContent = () => {
    if (!user) return false;
    if (user.role === 'admin') return true;
    return user.tipo_usuario === 'profissional';
  };

  const filteredContents = useMemo(() => {
    return contents.filter(content => {
      const matchSearch = !searchQuery ||
        content.titulo?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        content.descricao?.toLowerCase().includes(searchQuery.toLowerCase());

      const matchCategory = categoryFilter === "Todas" || content.categoria === categoryFilter;
      const matchType = typeFilter === "Todos" || content.tipo === typeFilter;
      const matchTipoAcesso = tipoAcessoFilter === "Todos" || content.tipo_acesso === tipoAcessoFilter;
      const matchPublicoAlvo = publicoAlvoFilter === "Todos" || content.publico_alvo === publicoAlvoFilter;

      return matchSearch && matchCategory && matchType && matchTipoAcesso && matchPublicoAlvo;
    });
  }, [contents, searchQuery, categoryFilter, typeFilter, tipoAcessoFilter, publicoAlvoFilter]);

  const userPlan = user?.clube_plano || 'none';

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-[#F5EFE6] to-white">
      {/* Hero Section */}
      <div className="relative py-12 md:py-20 px-4 md:px-6 overflow-hidden bg-gradient-to-br from-[#D4AF37] via-[#C8A882] to-[#D4AF37]">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNiIgc3Ryb2tlPSIjRkZGIiBzdHJva2Utd2lkdGg9IjIiIG9wYWNpdHk9Ii4xIi8+PC9nPjwvc3ZnPg==')] opacity-10"></div>

        <div className="relative z-10 max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center space-y-6 md:space-y-8"
          >
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="inline-block"
            >
              <div className="w-16 h-16 md:w-24 md:h-24 mx-auto bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center shadow-2xl border-4 border-white/30">
                <GraduationCap className="w-8 h-8 md:w-12 md:h-12 text-white" />
              </div>
            </motion.div>

            <div className="space-y-3 md:space-y-4 px-4">
              <Badge className="bg-white/20 text-white border-white/30 px-3 md:px-4 py-1.5 md:py-2 text-sm md:text-base backdrop-blur-sm">
                Plataforma Educacional
              </Badge>

              <h1 className="font-serif text-3xl md:text-5xl lg:text-7xl font-bold text-white leading-tight">
                Universidade da Beleza
              </h1>

              <p className="text-lg md:text-2xl lg:text-3xl text-white/90 font-medium">
                Aprenda com os Melhores Profissionais
              </p>

              <p className="text-base md:text-xl text-white/80 max-w-3xl mx-auto leading-relaxed">
                Cursos, vídeo aulas e e-books exclusivos para elevar sua carreira na estética e beleza
              </p>
            </div>

            {canUploadContent() && (
              <Link to={createPageUrl("EdBeautyCreateContent")}>
                <Button
                  size="lg"
                  className="bg-white text-[#D4AF37] hover:bg-white/90 shadow-2xl hover:shadow-3xl transition-all duration-300 px-6 md:px-10 py-5 md:py-7 text-base md:text-lg font-semibold group"
                >
                  Enviar Conteúdo
                  <ArrowRight className="w-4 h-4 md:w-5 md:h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            )}
          </motion.div>
        </div>
      </div>

      {/* Access Info */}
      {userPlan === 'none' && user?.role !== 'admin' && (
        <div className="py-8 md:py-12 px-4 md:px-6 bg-amber-50 border-y border-amber-200">
          <div className="max-w-4xl mx-auto text-center space-y-4">
            <Lock className="w-10 h-10 md:w-12 md:h-12 text-amber-600 mx-auto" />
            <h3 className="text-xl md:text-2xl font-bold text-gray-800">
              Conteúdo Exclusivo para Membros
            </h3>
            <p className="text-sm md:text-base text-gray-600 px-4">
              Para acessar a plataforma Universidade da Beleza, você precisa ser membro do Club da Beleza
            </p>
            <Link to={createPageUrl("Join")}>
              <Button className="bg-gradient-to-r from-[#D4AF37] to-[#C8A882] hover:from-[#C8A882] hover:to-[#D4AF37] text-white">
                Ver Planos do Clube
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      )}

      {/* Beauty Searcher Section */}
      <div className="py-12 md:py-24 px-4 md:px-6 bg-white border-y border-[#E8DCC4]">
        <div className="max-w-7xl mx-auto">
          <BeautySearcher />
        </div>
      </div>

      {/* Filters */}
      <div className="py-8 md:py-12 px-4 md:px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="mb-6 md:mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h2 className="font-serif text-2xl md:text-3xl font-bold text-gray-800 mb-2">
                Cursos e Conteúdos Educacionais
              </h2>
              <p className="text-sm md:text-base text-gray-600">
                Explore nossa biblioteca de cursos, vídeo aulas e e-books
              </p>
            </div>

            {canUploadContent() && (
              <Link to={createPageUrl("EdBeautyCreateContent")} className="w-full md:w-auto">
                <Button
                  className="w-full md:w-auto bg-gradient-to-r from-[#D4AF37] to-[#C8A882] hover:from-[#C8A882] hover:to-[#D4AF37] text-white"
                >
                  <Plus className="w-5 h-5 mr-2" />
                  Adicionar Conteúdo
                </Button>
              </Link>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-3 md:gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar conteúdos..."
                className="pl-10 border-[#E8DCC4] focus:border-[#D4AF37]"
              />
            </div>

            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="border-[#E8DCC4] focus:border-[#D4AF37]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Todas">Todas as Categorias</SelectItem>
                <SelectItem value="Estética Facial">Estética Facial</SelectItem>
                <SelectItem value="Estética Corporal">Estética Corporal</SelectItem>
                <SelectItem value="Harmonização">Harmonização</SelectItem>
                <SelectItem value="Micropigmentação">Micropigmentação</SelectItem>
                <SelectItem value="Depilação a Laser">Depilação a Laser</SelectItem>
                <SelectItem value="Marketing">Marketing</SelectItem>
                <SelectItem value="Gestão">Gestão</SelectItem>
                <SelectItem value="Técnicas Avançadas">Técnicas Avançadas</SelectItem>
                <SelectItem value="Outros">Outros</SelectItem>
              </SelectContent>
            </Select>

            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="border-[#E8DCC4] focus:border-[#D4AF37]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Todos">Todos os Tipos</SelectItem>
                <SelectItem value="video">Vídeo Aulas</SelectItem>
                <SelectItem value="curso">Cursos</SelectItem>
                <SelectItem value="ebook">E-books</SelectItem>
              </SelectContent>
            </Select>

            <Select value={tipoAcessoFilter} onValueChange={setTipoAcessoFilter}>
              <SelectTrigger className="border-[#E8DCC4] focus:border-[#D4AF37]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Todos">Todos os Acessos</SelectItem>
                <SelectItem value="gratuito">Gratuito</SelectItem>
                <SelectItem value="pago">Pago</SelectItem>
                <SelectItem value="exclusivo">Exclusivo</SelectItem>
              </SelectContent>
            </Select>

            <Select value={publicoAlvoFilter} onValueChange={setPublicoAlvoFilter}>
              <SelectTrigger className="border-[#E8DCC4] focus:border-[#D4AF37]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Todos">Todos os Públicos</SelectItem>
                <SelectItem value="todos">Para Todos</SelectItem>
                <SelectItem value="paciente-light">Pacientes - Light</SelectItem>
                <SelectItem value="paciente-gold">Pacientes - Gold</SelectItem>
                <SelectItem value="paciente-vip">Pacientes - VIP</SelectItem>
                <SelectItem value="profissional-light">Profissionais - Light</SelectItem>
                <SelectItem value="profissional-gold">Profissionais - Gold</SelectItem>
                <SelectItem value="profissional-vip">Profissionais - VIP</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Content Grid */}
      <div className="py-8 md:py-16 px-4 md:px-6">
        <div className="max-w-7xl mx-auto">
          {loadingContents || loadingUser ? (
            <div className="text-center py-12 md:py-20">
              <div className="animate-spin w-10 h-10 md:w-12 md:h-12 border-4 border-[#D4AF37] border-t-transparent rounded-full mx-auto"></div>
              <p className="text-gray-600 mt-4 text-sm md:text-base">Carregando conteúdos...</p>
            </div>
          ) : filteredContents.length === 0 ? (
            <div className="text-center py-12 md:py-20">
              <GraduationCap className="w-12 h-12 md:w-16 md:h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-lg md:text-xl text-gray-600">Nenhum conteúdo encontrado</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
              {filteredContents.map((content, index) => {
                const TypeIcon = typeIcons[content.tipo];
                const userCanAccess = canAccessContent(content);
                const isPago = content.tipo_acesso === 'pago';

                return (
                  <motion.div
                    key={content.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                  >
                    <Card className={`h-full border-[#E8DCC4] transition-all duration-300 hover:shadow-xl group relative ${
                      !userCanAccess ? 'opacity-75' : ''
                    }`}>
                      {!userCanAccess && (
                        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm z-10 flex items-center justify-center rounded-lg">
                          <div className="text-center text-white p-4 md:p-6">
                            <Lock className="w-10 h-10 md:w-12 md:h-12 mx-auto mb-3" />
                            {!user ? (
                              <p className="font-semibold text-sm md:text-base">Faça login para acessar</p>
                            ) : (
                              <p className="font-semibold text-sm md:text-base">Conteúdo não disponível para seu plano</p>
                            )}
                          </div>
                        </div>
                      )}

                      <div className="relative h-40 md:h-48 overflow-hidden">
                        <img
                          src={content.thumbnail || "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=800&q=80"}
                          alt={content.titulo}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>

                        <div className="absolute top-3 md:top-4 left-3 md:left-4 right-3 md:right-4 flex justify-between items-start flex-wrap gap-2">
                          <Badge className="bg-gradient-to-r from-[#D4AF37] to-[#C8A882] text-white border-0 text-xs">
                            {content.publico_alvo === 'todos' ? 'Para Todos' : 
                             content.publico_alvo.replace('-', ' - ').replace('paciente', 'Pac').replace('profissional', 'Prof')}
                          </Badge>
                          <div className="flex gap-2 flex-wrap">
                            <Badge className={`${tipoAcessoColors[content.tipo_acesso]} border-0 text-xs`}>
                              {tipoAcessoLabels[content.tipo_acesso]}
                              {isPago && content.preco && ` - R$ ${content.preco.toFixed(2)}`}
                            </Badge>
                            <Badge className="bg-white/90 text-gray-800 text-xs">
                              <TypeIcon className="w-3 h-3 mr-1" />
                              {content.tipo}
                            </Badge>
                          </div>
                        </div>
                      </div>

                      <CardContent className="p-4 md:p-6 space-y-3 md:space-y-4">
                        <div>
                          <h3 className="font-serif text-lg md:text-xl font-bold text-gray-800 mb-2 line-clamp-2">
                            {content.titulo}
                          </h3>
                          <p className="text-xs md:text-sm text-gray-600 line-clamp-3">
                            {content.descricao}
                          </p>
                        </div>

                        <div className="flex flex-wrap items-center gap-2 text-xs md:text-sm text-gray-500">
                          <Badge variant="outline" className="border-[#E8DCC4]">
                            {content.categoria === 'Outros' && content.categoria_outros ? content.categoria_outros : content.categoria}
                          </Badge>
                          {content.nivel && (
                            <Badge variant="outline" className="border-[#E8DCC4]">
                              <Award className="w-3 h-3 mr-1" />
                              {content.nivel}
                            </Badge>
                          )}
                        </div>

                        {content.duracao && (
                          <div className="flex items-center gap-2 text-xs md:text-sm text-gray-500">
                            <Clock className="w-4 h-4" />
                            <span>{content.duracao}</span>
                          </div>
                        )}

                        {userCanAccess && (content.url_video || content.url_curso || content.url_ebook) && (
                          <a
                            href={content.url_video || content.url_curso || content.url_ebook}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block"
                          >
                            <Button className="w-full bg-gradient-to-r from-[#D4AF37] to-[#C8A882] hover:from-[#C8A882] hover:to-[#D4AF37] text-white group text-sm md:text-base">
                              Acessar Conteúdo
                              <ExternalLink className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                            </Button>
                          </a>
                        )}
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* CTA for Professionals */}
      {user?.tipo_usuario === 'paciente' && (
        <div className="py-12 md:py-20 px-4 md:px-6 bg-gradient-to-br from-[#F5EFE6] to-white">
          <div className="max-w-4xl mx-auto text-center space-y-6 md:space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="space-y-4 md:space-y-6"
            >
              <GraduationCap className="w-12 h-12 md:w-16 md:h-16 text-[#D4AF37] mx-auto" />

              <h2 className="font-serif text-2xl md:text-3xl lg:text-4xl font-bold">
                <span className="text-gray-800">Você é um</span>
                <span className="bg-gradient-to-r from-[#D4AF37] to-[#C8A882] bg-clip-text text-transparent"> Profissional?</span>
              </h2>

              <p className="text-base md:text-lg text-gray-600 px-4">
                Compartilhe seu conhecimento e alcance milhares de profissionais de estética
              </p>

              <Link to={createPageUrl("EdBeautyPlans")}>
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-[#D4AF37] to-[#C8A882] hover:from-[#C8A882] hover:to-[#D4AF37] text-white shadow-xl hover:shadow-2xl transition-all duration-300 px-6 md:px-10 py-5 md:py-7 text-base md:text-lg font-semibold group"
                >
                  Ver Planos para Profissionais
                  <ArrowRight className="w-4 h-4 md:w-5 md:h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </motion.div>
          </div>
        </div>
      )}
    </div>
  );
}