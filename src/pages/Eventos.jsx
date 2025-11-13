import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar as CalendarIcon, MapPin, Users, ExternalLink,
  Plus, X, CheckCircle, Clock, Sparkles, Upload, Video,
  Locate, Zap, Globe
} from "lucide-react";

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
  "SP": ["São Paulo", "Campinas", "Santos", "Ribeirão Preto", "Sorocaba", "São José dos Campos", "Guarulhos", "Osasco", "Santo André", "São Bernardo do Campo"],
  "RJ": ["Rio de Janeiro", "Niterói", "Duque de Caxias", "Nova Iguaçu", "São Gonçalo", "Petrópolis", "Volta Redonda", "Campos dos Goytacazes", "Macaé"],
  "MG": ["Belo Horizonte", "Uberlândia", "Contagem", "Juiz de Fora", "Betim", "Montes Claros", "Ribeirão das Neves", "Uberaba", "Governador Valadares", "Ipatinga"],
  "BA": ["Salvador", "Feira de Santana", "Vitória da Conquista", "Camaçari", "Juazeiro", "Ilhéus", "Itabuna", "Lauro de Freitas", "Barreiras"],
  "PR": ["Curitiba", "Londrina", "Maringá", "Ponta Grossa", "Cascavel", "São José dos Pinhais", "Foz do Iguaçu", "Colombo", "Guarapuava"],
  "RS": ["Porto Alegre", "Caxias do Sul", "Pelotas", "Canoas", "Santa Maria", "Gravataí", "Viamão", "Novo Hamburgo", "São Leopoldo"],
  "PE": ["Recife", "Jaboatão dos Guararapes", "Olinda", "Caruaru", "Petrolina", "Paulista", "Cabo de Santo Agostinho", "Camaragibe"],
  "CE": ["Fortaleza", "Caucaia", "Juazeiro do Norte", "Maracanaú", "Sobral", "Crato", "Itapipoca", "Maranguape"],
  "PA": ["Belém", "Ananindeua", "Santarém", "Marabá", "Castanhal", "Parauapebas", "Itaituba", "Cametá"],
  "SC": ["Florianópolis", "Joinville", "Blumenau", "Chapecó", "Criciúma", "Itajaí", "Jaraguá do Sul", "Lages", "Palhoça"],
  "GO": ["Goiânia", "Aparecida de Goiânia", "Anápolis", "Rio Verde", "Luziânia", "Águas Lindas de Goiás", "Valparaíso de Goiás"],
  "MA": ["São Luís", "Imperatriz", "São José de Ribamar", "Timon", "Caxias", "Codó", "Paço do Lumiar"],
  "ES": ["Vitória", "Vila Velha", "Serra", "Cariacica", "Linhares", "Cachoeiro de Itapemirim", "Colatina"],
  "PB": ["João Pessoa", "Campina Grande", "Santa Rita", "Patos", "Bayeux", "Sousa", "Cajazeiras"],
  "RN": ["Natal", "Mossoró", "Parnamirim", "São Gonçalo do Amarante", "Macaíba", "Ceará-Mirim"],
  "AL": ["Maceió", "Arapiraca", "Rio Largo", "Palmeira dos Índios", "União dos Palmares"],
  "SE": ["Aracaju", "Nossa Senhora do Socorro", "Lagarto", "Itabaiana", "Estância"],
  "PI": ["Teresina", "Parnaíba", "Picos", "Piripiri", "Floriano", "Campo Maior"],
  "MT": ["Cuiabá", "Várzea Grande", "Rondonópolis", "Sinop", "Tangará da Serra", "Cáceres"],
  "MS": ["Campo Grande", "Dourados", "Três Lagoas", "Corumbá", "Ponta Porã", "Aquidauana"],
  "AC": ["Rio Branco", "Cruzeiro do Sul", "Sena Madureira", "Tarauacá"],
  "RO": ["Porto Velho", "Ji-Paraná", "Ariquemes", "Vilhena", "Cacoal"],
  "RR": ["Boa Vista", "Rorainópolis", "Caracaraí"],
  "AP": ["Macapá", "Santana", "Laranjal do Jari"],
  "TO": ["Palmas", "Araguaína", "Gurupi", "Porto Nacional"],
  "DF": ["Brasília", "Taguatinga", "Ceilândia", "Samambaia", "Planaltina"]
};

export default function Eventos() {
  const queryClient = useQueryClient();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [useAI, setUseAI] = useState(false);
  const [loadingAI, setLoadingAI] = useState(false);
  const [loadingLocation, setLoadingLocation] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadingVideo, setUploadingVideo] = useState(false);

  const [formData, setFormData] = useState({
    titulo: "",
    descricao: "",
    imagem: "",
    video_url: "",
    data_evento: "",
    tipo_evento: "presencial",
    rua: "",
    numero: "",
    complemento: "",
    bairro: "",
    cidade: "",
    estado: "",
    pais: "Brasil",
    categoria: "Outros",
    publico_alvo: "todos",
    link_inscricao: "",
    vagas_tipo: "ilimitadas",
    vagas: 0,
    status: "ativo"
  });

  const { data: user } = useQuery({
    queryKey: ['current-user-eventos'],
    queryFn: async () => {
      try {
        return await base44.auth.me();
      } catch (error) {
        return null;
      }
    },
  });

  const { data: eventos = [], isLoading } = useQuery({
    queryKey: ['eventos'],
    queryFn: () => base44.entities.Evento.filter({ status: 'ativo' }, '-data_evento'),
    initialData: [],
  });

  const createEventoMutation = useMutation({
    mutationFn: async (data) => {
      const evento = await base44.entities.Evento.create(data);
      
      const { data: usuarios } = await base44.entities.User.list();
      
      let usuariosAlvo = [];
      
      if (data.publico_alvo === 'todos') {
        usuariosAlvo = usuarios;
      } else {
        const [targetTipo, targetPlano] = data.publico_alvo.split('-');
        const planHierarchy = { none: 0, light: 1, gold: 2, vip: 3 };
        const targetLevel = planHierarchy[targetPlano] || 0;

        usuariosAlvo = usuarios.filter(u => {
          if (u.tipo_usuario !== targetTipo) return false;
          const userPlan = u.clube_plano || 'none';
          const userLevel = planHierarchy[userPlan] || 0;
          return userLevel >= targetLevel;
        });
      }

      for (const usuario of usuariosAlvo) {
        await base44.integrations.Core.SendEmail({
          to: usuario.email,
          subject: `🎉 Novo Evento: ${data.titulo}`,
          body: `
            <h2>Olá ${usuario.full_name}!</h2>
            <p>Temos um novo evento exclusivo para você no Club da Beleza!</p>
            <hr/>
            <h3>${data.titulo}</h3>
            <p><strong>📂 Categoria:</strong> ${data.categoria}</p>
            <p>${data.descricao}</p>
            <p><strong>📅 Data:</strong> ${new Date(data.data_evento).toLocaleString('pt-BR')}</p>
            ${data.tipo_evento === 'presencial' ? `
              <p><strong>📍 Local:</strong> ${[data.rua, data.numero, data.bairro, data.cidade, data.estado, data.pais].filter(Boolean).join(', ')}</p>
            ` : `
              <p><strong>🌐 Evento Online</strong></p>
            `}
            ${data.vagas_tipo === 'limitadas' && data.vagas ? `<p><strong>👥 Vagas:</strong> ${data.vagas}</p>` : ''}
            ${data.link_inscricao ? `<p><a href="${data.link_inscricao}" style="background: linear-gradient(to right, #D4AF37, #C8A882); color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; display: inline-block; margin-top: 16px;">Inscrever-se Agora</a></p>` : ''}
            <hr/>
            <p><small>Club da Beleza - Seu clube de benefícios</small></p>
          `
        });
      }

      return evento;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['eventos'] });
      setShowCreateForm(false);
      setFormData({
        titulo: "",
        descricao: "",
        imagem: "",
        video_url: "",
        data_evento: "",
        tipo_evento: "presencial",
        rua: "",
        numero: "",
        complemento: "",
        bairro: "",
        cidade: "",
        estado: "",
        pais: "Brasil",
        categoria: "Outros",
        publico_alvo: "todos",
        link_inscricao: "",
        vagas_tipo: "ilimitadas",
        vagas: 0,
        status: "ativo"
      });
      alert('Evento criado e notificações enviadas com sucesso!');
    },
  });

  const handleGenerateWithAI = async (field) => {
    setLoadingAI(true);
    
    try {
      if (field === 'descricao' && formData.titulo) {
        const result = await base44.integrations.Core.InvokeLLM({
          prompt: `Crie uma descrição atrativa e profissional para um evento de estética/beleza com o título: "${formData.titulo}". 
          Categoria: ${formData.categoria}. 
          A descrição deve ter de 2-3 parágrafos, ser persuasiva e destacar os benefícios de participar.`,
        });
        setFormData(prev => ({ ...prev, descricao: result }));
      } else if (field === 'titulo' && formData.descricao) {
        const result = await base44.integrations.Core.InvokeLLM({
          prompt: `Com base nesta descrição de evento: "${formData.descricao}", crie um título chamativo e profissional de no máximo 60 caracteres.`,
        });
        setFormData(prev => ({ ...prev, titulo: result }));
      } else if (field === 'imagem') {
        const imagePrompt = `Professional event banner for beauty and aesthetics industry, ${formData.titulo || 'beauty event'}, ${formData.categoria}, elegant, modern, high quality, professional photography`;
        const imageResult = await base44.integrations.Core.GenerateImage({
          prompt: imagePrompt
        });
        setFormData(prev => ({ ...prev, imagem: imageResult.url }));
      }
    } catch (error) {
      console.error('Erro ao gerar com IA:', error);
      alert('Erro ao gerar conteúdo. Tente novamente.');
    }
    
    setLoadingAI(false);
  };

  const handleCreateWithAI = async () => {
    if (!formData.titulo || !formData.categoria || !formData.data_evento) {
      alert('Preencha título, categoria e data do evento para usar a IA.');
      return;
    }

    setLoadingAI(true);

    try {
      const descricaoPrompt = `Crie uma descrição profissional e atrativa para um evento de estética/beleza:
      Título: ${formData.titulo}
      Categoria: ${formData.categoria}
      Tipo: ${formData.tipo_evento}
      Data: ${new Date(formData.data_evento).toLocaleDateString('pt-BR')}
      Público: ${formData.publico_alvo}
      ${formData.vagas_tipo === 'limitadas' ? `Vagas limitadas: ${formData.vagas}` : 'Vagas ilimitadas'}
      
      A descrição deve ter 2-3 parágrafos, ser persuasiva e destacar os benefícios.`;

      const descricao = await base44.integrations.Core.InvokeLLM({
        prompt: descricaoPrompt
      });

      const imagePrompt = `Professional event banner for beauty and aesthetics industry, ${formData.titulo}, ${formData.categoria}, elegant, modern, sophisticated, high quality`;
      
      const imageResult = await base44.integrations.Core.GenerateImage({
        prompt: imagePrompt
      });

      setFormData(prev => ({
        ...prev,
        descricao: descricao,
        imagem: imageResult.url
      }));

      alert('Conteúdo gerado com IA! Revise e ajuste conforme necessário.');
    } catch (error) {
      console.error('Erro ao criar com IA:', error);
      alert('Erro ao gerar conteúdo completo. Tente novamente.');
    }

    setLoadingAI(false);
  };

  const getUserLocation = async () => {
    setLoadingLocation(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${position.coords.latitude}&lon=${position.coords.longitude}&zoom=18&addressdetails=1`
            );
            const data = await response.json();

            setFormData(prev => ({
              ...prev,
              rua: data.address.road || '',
              numero: data.address.house_number || '',
              bairro: data.address.suburb || data.address.neighbourhood || '',
              cidade: data.address.city || data.address.town || data.address.village || '',
              estado: data.address.state_code || '',
              pais: data.address.country || 'Brasil',
            }));
          } catch (error) {
            console.error('Erro ao obter endereço:', error);
            alert('Não foi possível obter o endereço. Por favor, preencha manualmente.');
          }
          setLoadingLocation(false);
        },
        (error) => {
          console.error('Erro de geolocalização:', error);
          alert('Não foi possível obter sua localização.');
          setLoadingLocation(false);
        }
      );
    } else {
      alert('Geolocalização não é suportada pelo seu navegador.');
      setLoadingLocation(false);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    try {
      const result = await base44.integrations.Core.UploadFile({ file });
      setFormData(prev => ({ ...prev, imagem: result.file_url }));
    } catch (error) {
      console.error('Erro ao fazer upload:', error);
      alert('Erro ao fazer upload da imagem.');
    }
    setUploadingImage(false);
  };

  const handleVideoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingVideo(true);
    try {
      const result = await base44.integrations.Core.UploadFile({ file });
      setFormData(prev => ({ ...prev, video_url: result.file_url }));
    } catch (error) {
      console.error('Erro ao fazer upload:', error);
      alert('Erro ao fazer upload do vídeo.');
    }
    setUploadingVideo(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    createEventoMutation.mutate(formData);
  };

  const isAdmin = user?.role === 'admin';

  const canViewEvent = (evento) => {
    if (!user) return evento.publico_alvo === 'todos';
    if (user.role === 'admin') return true;
    if (evento.publico_alvo === 'todos') return true;
    
    const [targetTipo, targetPlano] = evento.publico_alvo.split('-');
    const userTipo = user.tipo_usuario;
    const userPlan = user.clube_plano || 'none';

    if (userTipo !== targetTipo) return false;
    
    const planHierarchy = { none: 0, light: 1, gold: 2, vip: 3 };
    const userLevel = planHierarchy[userPlan] || 0;
    const targetLevel = planHierarchy[targetPlano] || 0;
    
    return userLevel >= targetLevel;
  };

  const eventosVisiveis = eventos.filter(canViewEvent);

  const cidadesDisponiveis = formData.estado ? (cidadesPrincipaisPorEstado[formData.estado] || []) : [];

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-[#F5EFE6] to-white">
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
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="inline-block"
            >
              <CalendarIcon className="w-24 h-24 text-white mx-auto" />
            </motion.div>

            <div className="space-y-4">
              <Badge className="bg-white/20 text-white border-white/30 px-4 py-2 text-base backdrop-blur-sm">
                Exclusivo para Membros
              </Badge>

              <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight">
                Eventos
              </h1>

              <p className="text-2xl md:text-3xl text-white/90 font-medium">
                Experiências Exclusivas do Club da Beleza
              </p>
            </div>

            {isAdmin && (
              <Button
                onClick={() => setShowCreateForm(!showCreateForm)}
                size="lg"
                className="bg-white text-[#D4AF37] hover:bg-white/90 shadow-2xl hover:shadow-3xl transition-all duration-300 px-8 py-6 text-lg font-semibold group"
              >
                <Plus className="w-5 h-5 mr-2" />
                Criar Novo Evento
              </Button>
            )}
          </motion.div>
        </div>
      </div>

      <div className="py-16 px-6">
        <div className="max-w-7xl mx-auto space-y-12">
          <AnimatePresence>
            {showCreateForm && isAdmin && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Card className="border-[#E8DCC4] shadow-2xl">
                  <CardHeader className="bg-gradient-to-r from-[#F5EFE6] to-[#E8DCC4]">
                    <div className="flex items-center justify-between">
                      <CardTitle className="font-serif text-2xl text-gray-800">
                        Criar Novo Evento
                      </CardTitle>
                      <div className="flex gap-2">
                        <Button
                          variant={useAI ? "default" : "outline"}
                          size="sm"
                          onClick={() => setUseAI(!useAI)}
                          className={useAI ? "bg-gradient-to-r from-purple-500 to-purple-600 text-white" : ""}
                        >
                          <Sparkles className="w-4 h-4 mr-2" />
                          {useAI ? 'Modo IA Ativo' : 'Usar IA'}
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setShowCreateForm(false)}
                        >
                          <X className="w-5 h-5" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-8">
                    <form onSubmit={handleSubmit} className="space-y-6">
                      {useAI && (
                        <div className="p-4 bg-purple-50 rounded-lg border-2 border-purple-200">
                          <div className="flex items-start gap-3 mb-4">
                            <Sparkles className="w-5 h-5 text-purple-600 flex-shrink-0 mt-1" />
                            <div className="flex-1">
                              <h4 className="font-semibold text-purple-800 mb-1">Criar Evento com IA</h4>
                              <p className="text-sm text-purple-700">
                                Preencha apenas: título, categoria, tipo, data/hora, vagas e público-alvo. 
                                A IA irá gerar descrição e imagem automaticamente!
                              </p>
                            </div>
                          </div>
                          <Button
                            type="button"
                            onClick={handleCreateWithAI}
                            disabled={loadingAI || !formData.titulo}
                            className="w-full bg-gradient-to-r from-purple-500 to-purple-600 text-white"
                          >
                            {loadingAI ? (
                              <>
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                                Gerando com IA...
                              </>
                            ) : (
                              <>
                                <Zap className="w-4 h-4 mr-2" />
                                Gerar Descrição e Imagem com IA
                              </>
                            )}
                          </Button>
                        </div>
                      )}

                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Título do Evento *</Label>
                          <div className="flex gap-2">
                            <Input
                              value={formData.titulo}
                              onChange={(e) => setFormData({...formData, titulo: e.target.value})}
                              required
                              className="border-[#E8DCC4]"
                            />
                            {formData.descricao && !formData.titulo && (
                              <Button
                                type="button"
                                onClick={() => handleGenerateWithAI('titulo')}
                                disabled={loadingAI}
                                variant="outline"
                                size="icon"
                              >
                                <Sparkles className="w-4 h-4" />
                              </Button>
                            )}
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label>Data e Hora *</Label>
                          <Input
                            type="datetime-local"
                            value={formData.data_evento}
                            onChange={(e) => setFormData({...formData, data_evento: e.target.value})}
                            required
                            className="border-[#E8DCC4]"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label>Descrição *</Label>
                        <div className="flex flex-col gap-2">
                          <Textarea
                            value={formData.descricao}
                            onChange={(e) => setFormData({...formData, descricao: e.target.value})}
                            required
                            className="border-[#E8DCC4] h-32"
                          />
                          {formData.titulo && (
                            <Button
                              type="button"
                              onClick={() => handleGenerateWithAI('descricao')}
                              disabled={loadingAI}
                              variant="outline"
                              size="sm"
                              className="self-end"
                            >
                              <Sparkles className="w-4 h-4 mr-2" />
                              {loadingAI ? 'Gerando...' : 'Gerar Descrição com IA'}
                            </Button>
                          )}
                        </div>
                      </div>

                      <div className="grid md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <Label>Categoria *</Label>
                          <Select 
                            value={formData.categoria} 
                            onValueChange={(value) => setFormData({...formData, categoria: value})}
                          >
                            <SelectTrigger className="border-[#E8DCC4]">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Workshop">Workshop</SelectItem>
                              <SelectItem value="Palestra">Palestra</SelectItem>
                              <SelectItem value="Curso">Curso</SelectItem>
                              <SelectItem value="Networking">Networking</SelectItem>
                              <SelectItem value="Feira">Feira</SelectItem>
                              <SelectItem value="Congresso">Congresso</SelectItem>
                              <SelectItem value="Lançamento">Lançamento</SelectItem>
                              <SelectItem value="Outros">Outros</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label>Tipo de Evento *</Label>
                          <Select 
                            value={formData.tipo_evento} 
                            onValueChange={(value) => setFormData({...formData, tipo_evento: value})}
                          >
                            <SelectTrigger className="border-[#E8DCC4]">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="presencial">
                                <div className="flex items-center gap-2">
                                  <MapPin className="w-4 h-4" />
                                  Presencial
                                </div>
                              </SelectItem>
                              <SelectItem value="online">
                                <div className="flex items-center gap-2">
                                  <Globe className="w-4 h-4" />
                                  Online
                                </div>
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label>Público Alvo *</Label>
                          <Select 
                            value={formData.publico_alvo} 
                            onValueChange={(value) => setFormData({...formData, publico_alvo: value})}
                          >
                            <SelectTrigger className="border-[#E8DCC4]">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="todos">Todos</SelectItem>
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

                      {formData.tipo_evento === 'presencial' && (
                        <div className="p-4 bg-blue-50 rounded-lg border-2 border-blue-200 space-y-4">
                          <div className="flex items-center justify-between">
                            <h4 className="font-semibold text-blue-800">Localização do Evento</h4>
                            <Button
                              type="button"
                              onClick={getUserLocation}
                              disabled={loadingLocation}
                              variant="outline"
                              size="sm"
                              className="border-blue-300 text-blue-600"
                            >
                              {loadingLocation ? (
                                <>
                                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2" />
                                  Obtendo...
                                </>
                              ) : (
                                <>
                                  <Locate className="w-4 h-4 mr-2" />
                                  Usar Minha Localização
                                </>
                              )}
                            </Button>
                          </div>

                          <div className="grid md:grid-cols-3 gap-4">
                            <div className="space-y-2">
                              <Label>País</Label>
                              <Select 
                                value={formData.pais} 
                                onValueChange={(value) => setFormData({...formData, pais: value})}
                              >
                                <SelectTrigger className="border-blue-300">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="max-h-[300px]">
                                  {paises.map(pais => (
                                    <SelectItem key={pais} value={pais}>{pais}</SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>

                            <div className="space-y-2">
                              <Label>Estado</Label>
                              <Select 
                                value={formData.estado} 
                                onValueChange={(value) => setFormData({...formData, estado: value, cidade: ''})}
                              >
                                <SelectTrigger className="border-blue-300">
                                  <SelectValue placeholder="Selecione o estado" />
                                </SelectTrigger>
                                <SelectContent className="max-h-[300px]">
                                  {estadosBrasileiros.map(estado => (
                                    <SelectItem key={estado.sigla} value={estado.sigla}>
                                      {estado.nome} ({estado.sigla})
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>

                            <div className="space-y-2">
                              <Label>Cidade</Label>
                              {cidadesDisponiveis.length > 0 ? (
                                <Select 
                                  value={formData.cidade} 
                                  onValueChange={(value) => setFormData({...formData, cidade: value})}
                                >
                                  <SelectTrigger className="border-blue-300">
                                    <SelectValue placeholder="Selecione a cidade" />
                                  </SelectTrigger>
                                  <SelectContent className="max-h-[300px]">
                                    {cidadesDisponiveis.map(cidade => (
                                      <SelectItem key={cidade} value={cidade}>{cidade}</SelectItem>
                                    ))}
                                    <SelectItem value="__custom__">Outra cidade...</SelectItem>
                                  </SelectContent>
                                </Select>
                              ) : (
                                <Input
                                  value={formData.cidade}
                                  onChange={(e) => setFormData({...formData, cidade: e.target.value})}
                                  placeholder={formData.estado ? "Digite a cidade" : "Selecione o estado primeiro"}
                                  className="border-blue-300"
                                  disabled={!formData.estado}
                                />
                              )}
                              {formData.cidade === '__custom__' && (
                                <Input
                                  value=""
                                  onChange={(e) => setFormData({...formData, cidade: e.target.value})}
                                  placeholder="Digite o nome da cidade"
                                  className="border-blue-300 mt-2"
                                  autoFocus
                                />
                              )}
                            </div>
                          </div>

                          <div className="grid md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label>Bairro</Label>
                              <Input
                                value={formData.bairro}
                                onChange={(e) => setFormData({...formData, bairro: e.target.value})}
                                placeholder="Bairro"
                                className="border-blue-300"
                              />
                            </div>

                            <div className="space-y-2">
                              <Label>Rua</Label>
                              <Input
                                value={formData.rua}
                                onChange={(e) => setFormData({...formData, rua: e.target.value})}
                                placeholder="Nome da rua"
                                className="border-blue-300"
                              />
                            </div>

                            <div className="space-y-2">
                              <Label>Número</Label>
                              <Input
                                value={formData.numero}
                                onChange={(e) => setFormData({...formData, numero: e.target.value})}
                                placeholder="123"
                                className="border-blue-300"
                              />
                            </div>

                            <div className="space-y-2">
                              <Label>Complemento</Label>
                              <Input
                                value={formData.complemento}
                                onChange={(e) => setFormData({...formData, complemento: e.target.value})}
                                placeholder="Sala, Andar..."
                                className="border-blue-300"
                              />
                            </div>
                          </div>
                        </div>
                      )}

                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Tipo de Vagas *</Label>
                          <Select 
                            value={formData.vagas_tipo} 
                            onValueChange={(value) => setFormData({...formData, vagas_tipo: value, vagas: value === 'ilimitadas' ? 0 : formData.vagas})}
                          >
                            <SelectTrigger className="border-[#E8DCC4]">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="ilimitadas">Vagas Ilimitadas</SelectItem>
                              <SelectItem value="limitadas">Número Específico de Vagas</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        {formData.vagas_tipo === 'limitadas' && (
                          <div className="space-y-2">
                            <Label>Número de Vagas</Label>
                            <Input
                              type="number"
                              min="1"
                              value={formData.vagas}
                              onChange={(e) => setFormData({...formData, vagas: parseInt(e.target.value) || 0})}
                              className="border-[#E8DCC4]"
                            />
                          </div>
                        )}

                        <div className="space-y-2">
                          <Label>Link de Inscrição/Pagamento</Label>
                          <Input
                            type="url"
                            value={formData.link_inscricao}
                            onChange={(e) => setFormData({...formData, link_inscricao: e.target.value})}
                            placeholder="https://..."
                            className="border-[#E8DCC4]"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label>Imagem do Evento</Label>
                          {useAI && formData.titulo && (
                            <Button
                              type="button"
                              onClick={() => handleGenerateWithAI('imagem')}
                              disabled={loadingAI}
                              variant="outline"
                              size="sm"
                            >
                              <Sparkles className="w-4 h-4 mr-2" />
                              {loadingAI ? 'Gerando...' : 'Gerar Imagem com IA'}
                            </Button>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <div className="flex-1">
                            <Input
                              type="url"
                              value={formData.imagem}
                              onChange={(e) => setFormData({...formData, imagem: e.target.value})}
                              placeholder="URL da imagem"
                              className="border-[#E8DCC4]"
                            />
                          </div>
                          <Label className="flex items-center justify-center px-4 py-2 border-2 border-dashed border-[#E8DCC4] rounded-lg cursor-pointer hover:border-[#D4AF37] transition-colors">
                            <input
                              type="file"
                              accept="image/*"
                              onChange={handleImageUpload}
                              className="hidden"
                            />
                            {uploadingImage ? (
                              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-[#D4AF37]" />
                            ) : (
                              <Upload className="w-5 h-5 text-[#D4AF37]" />
                            )}
                          </Label>
                        </div>
                        {formData.imagem && (
                          <img src={formData.imagem} alt="Preview" className="mt-2 w-full h-48 object-cover rounded-lg" />
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label>Vídeo do Evento (Opcional)</Label>
                        <div className="flex gap-2">
                          <div className="flex-1">
                            <Input
                              type="url"
                              value={formData.video_url}
                              onChange={(e) => setFormData({...formData, video_url: e.target.value})}
                              placeholder="URL do vídeo ou faça upload"
                              className="border-[#E8DCC4]"
                            />
                          </div>
                          <Label className="flex items-center justify-center px-4 py-2 border-2 border-dashed border-[#E8DCC4] rounded-lg cursor-pointer hover:border-[#D4AF37] transition-colors">
                            <input
                              type="file"
                              accept="video/*"
                              onChange={handleVideoUpload}
                              className="hidden"
                            />
                            {uploadingVideo ? (
                              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-[#D4AF37]" />
                            ) : (
                              <Video className="w-5 h-5 text-[#D4AF37]" />
                            )}
                          </Label>
                        </div>
                      </div>

                      <Button
                        type="submit"
                        disabled={createEventoMutation.isPending}
                        className="w-full bg-gradient-to-r from-[#D4AF37] to-[#C8A882] text-white py-6 text-lg font-semibold"
                      >
                        {createEventoMutation.isPending ? (
                          <>
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" />
                            Criando e enviando notificações...
                          </>
                        ) : (
                          <>
                            <Plus className="w-5 h-5 mr-2" />
                            Criar Evento e Notificar Usuários
                          </>
                        )}
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>

          {isLoading ? (
            <div className="text-center py-20">
              <div className="animate-spin w-12 h-12 border-4 border-[#D4AF37] border-t-transparent rounded-full mx-auto"></div>
              <p className="text-gray-600 mt-4">Carregando eventos...</p>
            </div>
          ) : eventosVisiveis.length === 0 ? (
            <div className="text-center py-20">
              <CalendarIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-xl text-gray-600">Nenhum evento disponível no momento</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {eventosVisiveis.map((evento, index) => (
                <motion.div
                  key={evento.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <Card className="h-full border-[#E8DCC4] hover:border-[#D4AF37] transition-all duration-300 hover:shadow-2xl group">
                    {evento.imagem && (
                      <div className="relative h-48 overflow-hidden">
                        <img
                          src={evento.imagem}
                          alt={evento.titulo}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                        
                        <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                          <Badge className="bg-gradient-to-r from-[#D4AF37] to-[#C8A882] text-white border-0">
                            {evento.categoria}
                          </Badge>
                          {evento.tipo_evento === 'online' ? (
                            <Badge className="bg-green-600 text-white">
                              <Globe className="w-3 h-3 mr-1" />
                              Online
                            </Badge>
                          ) : (
                            <Badge className="bg-blue-600 text-white">
                              <MapPin className="w-3 h-3 mr-1" />
                              Presencial
                            </Badge>
                          )}
                          <Badge className="bg-white/90 text-gray-800">
                            {evento.publico_alvo === 'todos' ? 'Para Todos' : 
                             evento.publico_alvo.replace('paciente', 'Paciente').replace('profissional', 'Profissional').replace('-', ' - ')}
                          </Badge>
                        </div>
                      </div>
                    )}

                    <CardContent className="p-6 space-y-4">
                      <div>
                        <h3 className="font-serif text-2xl font-bold text-gray-800 mb-2">
                          {evento.titulo}
                        </h3>
                        <p className="text-gray-600 line-clamp-3">
                          {evento.descricao}
                        </p>
                      </div>

                      <div className="space-y-2 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-[#D4AF37]" />
                          <span>{new Date(evento.data_evento).toLocaleString('pt-BR')}</span>
                        </div>

                        {evento.tipo_evento === 'presencial' && (evento.cidade || evento.rua) && (
                          <div className="flex items-start gap-2">
                            <MapPin className="w-4 h-4 text-[#D4AF37] flex-shrink-0 mt-0.5" />
                            <span>
                              {[evento.rua, evento.numero, evento.bairro, evento.cidade, evento.estado, evento.pais]
                                .filter(Boolean)
                                .join(', ')}
                            </span>
                          </div>
                        )}

                        {evento.vagas_tipo === 'limitadas' && evento.vagas > 0 && (
                          <div className="flex items-center gap-2">
                            <Users className="w-4 h-4 text-[#D4AF37]" />
                            <span>{evento.vagas} vagas disponíveis</span>
                          </div>
                        )}

                        {evento.vagas_tipo === 'ilimitadas' && (
                          <div className="flex items-center gap-2">
                            <Users className="w-4 h-4 text-[#D4AF37]" />
                            <span>Vagas ilimitadas</span>
                          </div>
                        )}
                      </div>

                      {evento.link_inscricao && (
                        <a
                          href={evento.link_inscricao}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block"
                        >
                          <Button className="w-full bg-gradient-to-r from-[#D4AF37] to-[#C8A882] text-white group">
                            Inscrever-se
                            <ExternalLink className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                          </Button>
                        </a>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}