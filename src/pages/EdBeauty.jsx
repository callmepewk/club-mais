
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
  Clock, Award, ExternalLink, Sparkles, Lock, ArrowRight
} from "lucide-react";

const typeIcons = {
  video: Video,
  curso: GraduationCap,
  ebook: BookOpen
};

const planoLabels = {
  none: "Nenhum", // Added 'none' for completeness
  light: "Light",
  gold: "Gold",
  vip: "VIP"
};

const planoColors = {
  none: "bg-gray-200 text-gray-700", // Added 'none'
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
        // User not logged in
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
      
      // Hierarquia de planos
      const planHierarchy = { none: 0, light: 1, gold: 2, vip: 3 };
      const userPlan = user.clube_plano || 'none';
      const userLevel = planHierarchy[userPlan];
      const targetLevel = planHierarchy[targetPlano];
      
      // Usuário pode ver conteúdos do seu nível ou abaixo
      if (userLevel < targetLevel) return false;
    }

    return true;
  };

  const canUploadContent = () => {
    if (!user) return false;
    if (user.role === 'admin') return true;
    // Apenas profissionais com plano EdBeauty podem enviar conteúdo
    return user.tipo_usuario === 'profissional' && user.edbeauty_plano !== 'none';
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
      <div className="relative py-20 px-6 overflow-hidden bg-gradient-to-br from-[#D4AF37] via-[#C8A882] to-[#D4AF37]">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNiIgc3Ryb2tlPSIjRkZGIiBzdHJva2Utd2lkdGg9IjIiIG9wYWNpdHk9Ii4xIi8+PC9nPjwvc3ZnPg==')] opacity-10"></div>

        <div className="relative z-10 max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center space-y-8"
          >
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="inline-block"
            >
              <div className="w-24 h-24 mx-auto bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center shadow-2xl border-4 border-white/30">
                <GraduationCap className="w-12 h-12 text-white" />
              </div>
            </motion.div>

            <div className="space-y-4">
              <Badge className="bg-white/20 text-white border-white/30 px-4 py-2 text-base backdrop-blur-sm">
                Plataforma Educacional
              </Badge>

              <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight">
                EdBeauty
              </h1>

              <p className="text-2xl md:text-3xl text-white/90 font-medium">
                Aprenda com os Melhores Profissionais
              </p>

              <p className="text-xl text-white/80 max-w-3xl mx-auto leading-relaxed">
                Cursos, vídeo aulas e e-books exclusivos para elevar sua carreira na estética e beleza
              </p>
            </div>

            {canUploadContent() && (
              <Link to={createPageUrl("EdBeautyUpload")}>
                <Button
                  size="lg"
                  className="bg-white text-[#D4AF37] hover:bg-white/90 shadow-2xl hover:shadow-3xl transition-all duration-300 px-10 py-7 text-lg font-semibold group"
                >
                  Enviar Conteúdo
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            )}
          </motion.div>
        </div>
      </div>

      {/* Access Info */}
      {userPlan === 'none' && user?.role !== 'admin' && (
        <div className="py-12 px-6 bg-amber-50 border-y border-amber-200">
          <div className="max-w-4xl mx-auto text-center space-y-4">
            <Lock className="w-12 h-12 text-amber-600 mx-auto" />
            <h3 className="text-2xl font-bold text-gray-800">
              Conteúdo Exclusivo para Membros
            </h3>
            <p className="text-gray-600">
              Para acessar a plataforma EdBeauty, você precisa ser membro do Club da Beleza
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

      {/* Filters */}
      <div className="py-12 px-6 bg-white border-b border-[#E8DCC4]">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-5 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
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
      <div className="py-16 px-6">
        <div className="max-w-7xl mx-auto">
          {loadingContents || loadingUser ? (
            <div className="text-center py-20">
              <div className="animate-spin w-12 h-12 border-4 border-[#D4AF37] border-t-transparent rounded-full mx-auto"></div>
              <p className="text-gray-600 mt-4">Carregando conteúdos...</p>
            </div>
          ) : filteredContents.length === 0 ? (
            <div className="text-center py-20">
              <GraduationCap className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-xl text-gray-600">Nenhum conteúdo encontrado</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
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
                          <div className="text-center text-white p-6">
                            <Lock className="w-12 h-12 mx-auto mb-3" />
                            {!user ? (
                              <p className="font-semibold">Faça login para acessar</p>
                            ) : (
                              <p className="font-semibold">Conteúdo não disponível para seu plano</p>
                            )}
                          </div>
                        </div>
                      )}

                      <div className="relative h-48 overflow-hidden">
                        <img
                          src={content.thumbnail || "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=800&q=80"}
                          alt={content.titulo}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>

                        <div className="absolute top-4 left-4 right-4 flex justify-between items-start flex-wrap gap-2">
                          <Badge className="bg-gradient-to-r from-[#D4AF37] to-[#C8A882] text-white border-0">
                            {content.publico_alvo === 'todos' ? 'Para Todos' : 
                             content.publico_alvo.replace('-', ' - ').replace('paciente', 'Pac').replace('profissional', 'Prof')}
                          </Badge>
                          <div className="flex gap-2">
                            <Badge className={`${tipoAcessoColors[content.tipo_acesso]} border-0`}>
                              {tipoAcessoLabels[content.tipo_acesso]}
                              {isPago && content.preco && ` - R$ ${content.preco.toFixed(2)}`}
                            </Badge>
                            <Badge className="bg-white/90 text-gray-800">
                              <TypeIcon className="w-3 h-3 mr-1" />
                              {content.tipo}
                            </Badge>
                          </div>
                        </div>
                      </div>

                      <CardContent className="p-6 space-y-4">
                        <div>
                          <h3 className="font-serif text-xl font-bold text-gray-800 mb-2 line-clamp-2">
                            {content.titulo}
                          </h3>
                          <p className="text-sm text-gray-600 line-clamp-3">
                            {content.descricao}
                          </p>
                        </div>

                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <Badge variant="outline" className="border-[#E8DCC4]">
                            {content.categoria}
                          </Badge>
                          {content.nivel && (
                            <Badge variant="outline" className="border-[#E8DCC4]">
                              <Award className="w-3 h-3 mr-1" />
                              {content.nivel}
                            </Badge>
                          )}
                        </div>

                        {content.duracao && (
                          <div className="flex items-center gap-2 text-sm text-gray-500">
                            <Clock className="w-4 h-4" />
                            <span>{content.duracao}</span>
                          </div>
                        )}

                        {userCanAccess && (
                          <a
                            href={content.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block"
                          >
                            <Button className="w-full bg-gradient-to-r from-[#D4AF37] to-[#C8A882] hover:from-[#C8A882] hover:to-[#D4AF37] text-white group">
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
        <div className="py-20 px-6 bg-gradient-to-br from-[#F5EFE6] to-white">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="space-y-6"
            >
              <GraduationCap className="w-16 h-16 text-[#D4AF37] mx-auto" />

              <h2 className="font-serif text-3xl md:text-4xl font-bold">
                <span className="text-gray-800">Você é um</span>
                <span className="bg-gradient-to-r from-[#D4AF37] to-[#C8A882] bg-clip-text text-transparent"> Profissional?</span>
              </h2>

              <p className="text-lg text-gray-600">
                Compartilhe seu conhecimento e alcance milhares de profissionais de estética
              </p>

              <Link to={createPageUrl("EdBeautyPlans")}>
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-[#D4AF37] to-[#C8A882] hover:from-[#C8A882] hover:to-[#D4AF37] text-white shadow-xl hover:shadow-2xl transition-all duration-300 px-10 py-7 text-lg font-semibold group"
                >
                  Ver Planos para Profissionais
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </motion.div>
          </div>
        </div>
      )}
    </div>
  );
}
