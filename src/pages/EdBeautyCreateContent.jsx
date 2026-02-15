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
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import {
  GraduationCap, ArrowLeft, Upload, Sparkles, Zap, CheckCircle,
  XCircle, Video, Globe, MapPin, X
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

export default function EdBeautyCreateContent() {
  const queryClient = useQueryClient();
  const [loadingAI, setLoadingAI] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [aiGeneratedThumbnail, setAiGeneratedThumbnail] = useState(null);
  const [statusMessage, setStatusMessage] = useState({ type: '', text: '' });

  const [formData, setFormData] = useState({
    titulo: "",
    descricao: "",
    tipo: "video",
    tipo_acesso: "gratuito",
    publico_alvo: "todos",
    preco: 0,
    url_video: "",
    url_curso: "",
    url_ebook: "",
    thumbnail: "",
    categoria: "Estética Facial",
    categoria_outros: "",
    duracao: "",
    nivel: "Iniciante",
    data_evento: "",
    rua: "",
    numero: "",
    complemento: "",
    bairro: "",
    cidade: "",
    estado: "",
    pais: "Brasil"
  });

  const { data: user } = useQuery({
    queryKey: ['current-user-edbeauty-create'],
    queryFn: () => base44.auth.me(),
  });

  const createContentMutation = useMutation({
    mutationFn: (data) => base44.entities.EdBeautyContent.create({
      ...data,
      autor_email: user?.email,
      autor_nome: user?.full_name
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['edbeauty-contents'] });
      setStatusMessage({ type: 'success', text: 'Conteúdo publicado com sucesso!' });
      setTimeout(() => {
        window.location.href = createPageUrl("EdBeauty");
      }, 2000);
    },
    onError: (error) => {
      console.error('Erro ao criar conteúdo:', error);
      setStatusMessage({ type: 'error', text: 'Erro ao publicar conteúdo. Tente novamente.' });
    }
  });

  const handleGenerateTituloWithAI = async () => {
    if (!formData.descricao && !formData.titulo) {
      alert('Preencha a descrição ou título para usar a IA.');
      return;
    }
    setLoadingAI(true);
    try {
      const result = await base44.integrations.Core.InvokeLLM({
        prompt: `Com base neste conteúdo educacional de estética/beleza: "${formData.titulo || formData.descricao}", crie um título chamativo e profissional de no máximo 60 caracteres.`,
      });
      setFormData(prev => ({ ...prev, titulo: result }));
    } catch (error) {
      console.error('Erro ao gerar título:', error);
      alert('Erro ao gerar título. Tente novamente.');
    }
    setLoadingAI(false);
  };

  const handleGenerateDescricaoWithAI = async () => {
    if (!formData.titulo && !formData.descricao) {
      alert('Preencha o título ou descrição para usar a IA.');
      return;
    }
    setLoadingAI(true);
    try {
      const result = await base44.integrations.Core.InvokeLLM({
        prompt: `Com base neste tema de conteúdo educacional de estética/beleza: "${formData.titulo || formData.descricao}", crie uma descrição profissional e detalhada (2-3 parágrafos).`,
      });
      setFormData(prev => ({ ...prev, descricao: result }));
    } catch (error) {
      console.error('Erro ao gerar descrição:', error);
      alert('Erro ao gerar descrição. Tente novamente.');
    }
    setLoadingAI(false);
  };

  const handleGenerarDuracaoWithAI = async () => {
    if (!formData.titulo && !formData.descricao && !formData.categoria) {
      alert('Preencha pelo menos o título, descrição ou categoria.');
      return;
    }
    setLoadingAI(true);
    try {
      const result = await base44.integrations.Core.InvokeLLM({
        prompt: `Analise o seguinte conteúdo educacional de estética:
Tipo: ${formData.tipo}
Título: ${formData.titulo}
Descrição: ${formData.descricao}
Categoria: ${formData.categoria}

Estime uma duração realista. Para vídeo use formato "XXminutos" (ex: 45minutos), para curso use "XhYZminutos" (ex: 2h30minutos), para ebook use "XXX páginas" (ex: 150 páginas). Retorne APENAS a duração no formato apropriado, nada mais.`,
      });
      setFormData(prev => ({ ...prev, duracao: result.trim() }));
    } catch (error) {
      console.error('Erro ao gerar duração:', error);
      alert('Erro ao gerar duração. Tente novamente.');
    }
    setLoadingAI(false);
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    try {
      const result = await base44.integrations.Core.UploadFile({ file });
      setFormData(prev => ({ ...prev, thumbnail: result.file_url }));
      setAiGeneratedThumbnail(null);
    } catch (error) {
      console.error('Erro ao fazer upload:', error);
      alert('Erro ao fazer upload da imagem.');
    }
    setUploadingImage(false);
  };

  const handleRemoveAIThumbnail = () => {
    setAiGeneratedThumbnail(null);
    setFormData(prev => ({ ...prev, thumbnail: '' }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.titulo || !formData.descricao) {
      alert('Por favor, preencha título e descrição.');
      return;
    }

    if (formData.tipo === 'video' && !formData.url_video) {
      alert('Por favor, adicione a URL do vídeo.');
      return;
    }

    if (formData.tipo === 'curso' && !formData.url_curso) {
      alert('Por favor, adicione o link do curso.');
      return;
    }

    if (formData.tipo === 'ebook' && !formData.url_ebook) {
      alert('Por favor, adicione o link do e-book.');
      return;
    }

    createContentMutation.mutate(formData);
  };

  const canCreate = user?.role === 'admin' || user?.tipo_usuario === 'profissional';

  if (!canCreate) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white via-[#F5EFE6] to-white py-20 px-6">
        <div className="max-w-2xl mx-auto text-center space-y-6">
          <XCircle className="w-16 h-16 text-red-600 mx-auto" />
          <h2 className="font-serif text-3xl font-bold text-gray-800">
            Acesso Restrito
          </h2>
          <p className="text-gray-600">
            Apenas profissionais podem criar conteúdo educacional.
          </p>
          <Link to={createPageUrl("EdBeauty")}>
            <Button className="bg-gradient-to-r from-[#D4AF37] to-[#C8A882] text-white">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar para Universidade da Beleza
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const cidadesDisponiveis = formData.estado ? (cidadesPrincipaisPorEstado[formData.estado] || []) : [];

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-[#F5EFE6] to-white">
      <div className="relative py-20 px-6 overflow-hidden bg-gradient-to-br from-[#D4AF37] via-[#C8A882] to-[#D4AF37]">
        <div className="relative z-10 max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center space-y-6"
          >
            <Badge className="bg-white/20 text-white border-white/30 px-4 py-2 text-base backdrop-blur-sm">
              <GraduationCap className="w-4 h-4 mr-2" />
              Compartilhe Conhecimento
            </Badge>

            <h1 className="font-serif text-5xl md:text-6xl font-bold text-white">
              Criar Novo Conteúdo
            </h1>

            <p className="text-xl text-white/90">
              Adicione vídeos, cursos ou e-books para a comunidade
            </p>
          </motion.div>
        </div>
      </div>

      <div className="py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <Card className="border-[#E8DCC4] shadow-2xl">
            <CardHeader className="bg-gradient-to-r from-[#F5EFE6] to-[#E8DCC4]">
              <CardTitle className="font-serif text-2xl">
                Detalhes do Conteúdo
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="p-4 bg-purple-50 rounded-lg border-2 border-purple-200">
                  <div className="flex items-start gap-3">
                    <Sparkles className="w-5 h-5 text-purple-600 flex-shrink-0 mt-1" />
                    <p className="text-sm text-purple-700">
                      💡 Use os botões com IA ao lado dos campos para preencher conteúdo inteligentemente!
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>Título do Conteúdo *</Label>
                    {formData.descricao && !formData.titulo && (
                      <Button
                        type="button"
                        onClick={handleGenerateTituloWithAI}
                        disabled={loadingAI}
                        variant="outline"
                        size="sm"
                      >
                        <Sparkles className="w-3 h-3 mr-1" />
                        {loadingAI ? 'Gerando...' : 'Gerar com IA'}
                      </Button>
                    )}
                  </div>
                  <Input
                    value={formData.titulo}
                    onChange={(e) => setFormData({...formData, titulo: e.target.value})}
                    placeholder="Ex: Técnicas Avançadas de Harmonização Facial"
                    required
                    className="border-[#E8DCC4]"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>Descrição *</Label>
                    {formData.titulo && !formData.descricao && (
                      <Button
                        type="button"
                        onClick={handleGenerateDescricaoWithAI}
                        disabled={loadingAI}
                        variant="outline"
                        size="sm"
                      >
                        <Sparkles className="w-3 h-3 mr-1" />
                        {loadingAI ? 'Gerando...' : 'Gerar com IA'}
                      </Button>
                    )}
                  </div>
                  <Textarea
                    value={formData.descricao}
                    onChange={(e) => setFormData({...formData, descricao: e.target.value})}
                    placeholder="Descreva o conteúdo..."
                    required
                    className="border-[#E8DCC4] h-32"
                  />
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Tipo de Conteúdo *</Label>
                    <Select value={formData.tipo} onValueChange={(value) => setFormData({...formData, tipo: value})}>
                      <SelectTrigger className="border-[#E8DCC4]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="video">Vídeo Aula</SelectItem>
                        <SelectItem value="curso">Curso</SelectItem>
                        <SelectItem value="ebook">E-book</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Tipo de Acesso *</Label>
                    <Select value={formData.tipo_acesso} onValueChange={(value) => setFormData({...formData, tipo_acesso: value})}>
                      <SelectTrigger className="border-[#E8DCC4]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="gratuito">Gratuito</SelectItem>
                        <SelectItem value="pago">Pago</SelectItem>
                        <SelectItem value="exclusivo">Exclusivo (Membros)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Público Alvo *</Label>
                    <Select value={formData.publico_alvo} onValueChange={(value) => setFormData({...formData, publico_alvo: value})}>
                      <SelectTrigger className="border-[#E8DCC4]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="todos">Todos</SelectItem>
                        <SelectItem value="paciente-light">Pacientes Light+</SelectItem>
                        <SelectItem value="paciente-gold">Pacientes Gold+</SelectItem>
                        <SelectItem value="paciente-vip">Pacientes VIP</SelectItem>
                        <SelectItem value="profissional-light">Profissionais Light+</SelectItem>
                        <SelectItem value="profissional-gold">Profissionais Gold+</SelectItem>
                        <SelectItem value="profissional-vip">Profissionais VIP</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {formData.tipo === 'video' && (
                  <div className="space-y-2">
                    <Label>URL do Vídeo (YouTube, Vimeo, etc) *</Label>
                    <Input
                      type="url"
                      value={formData.url_video}
                      onChange={(e) => setFormData({...formData, url_video: e.target.value})}
                      placeholder="https://youtube.com/..."
                      className="border-[#E8DCC4]"
                    />
                  </div>
                )}

                {formData.tipo === 'curso' && (
                  <div className="space-y-2">
                    <Label>Link do Curso *</Label>
                    <Input
                      type="url"
                      value={formData.url_curso}
                      onChange={(e) => setFormData({...formData, url_curso: e.target.value})}
                      placeholder="https://..."
                      className="border-[#E8DCC4]"
                    />
                  </div>
                )}

                {formData.tipo === 'ebook' && (
                  <div className="space-y-2">
                    <Label>Link do E-book *</Label>
                    <Input
                      type="url"
                      value={formData.url_ebook}
                      onChange={(e) => setFormData({...formData, url_ebook: e.target.value})}
                      placeholder="https://..."
                      className="border-[#E8DCC4]"
                    />
                  </div>
                )}

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>Imagem de Capa</Label>
                    {aiGeneratedThumbnail && (
                      <Button
                        type="button"
                        onClick={handleRemoveAIThumbnail}
                        variant="ghost"
                        size="sm"
                        className="text-red-600"
                      >
                        <X className="w-4 h-4 mr-1" />
                        Remover IA
                      </Button>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Input
                      type="url"
                      value={formData.thumbnail}
                      onChange={(e) => setFormData({...formData, thumbnail: e.target.value})}
                      placeholder="URL da imagem ou faça upload"
                      className="border-[#E8DCC4]"
                    />
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
                  {formData.thumbnail && (
                    <div className="relative mt-2">
                      <img src={formData.thumbnail} alt="Preview" className="w-full h-48 object-cover rounded-lg" />
                      {aiGeneratedThumbnail && (
                        <Badge className="absolute top-2 left-2 bg-purple-600 text-white">
                          <Sparkles className="w-3 h-3 mr-1" />
                          Gerada por IA
                        </Badge>
                      )}
                    </div>
                  )}
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Categoria *</Label>
                    <Select value={formData.categoria} onValueChange={(value) => setFormData({...formData, categoria: value})}>
                      <SelectTrigger className="border-[#E8DCC4]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
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
                  </div>

                  {formData.categoria === 'Outros' && (
                    <div className="space-y-2">
                      <Label>Especifique a Categoria</Label>
                      <Input
                        value={formData.categoria_outros}
                        onChange={(e) => setFormData({...formData, categoria_outros: e.target.value})}
                        placeholder="Ex: Podologia Avançada"
                        className="border-[#E8DCC4]"
                      />
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label>Nível</Label>
                    <Select value={formData.nivel} onValueChange={(value) => setFormData({...formData, nivel: value})}>
                      <SelectTrigger className="border-[#E8DCC4]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Iniciante">Iniciante</SelectItem>
                        <SelectItem value="Intermediário">Intermediário</SelectItem>
                        <SelectItem value="Avançado">Avançado</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label>Duração Estimada</Label>
                      {(formData.titulo || formData.descricao || formData.categoria) && !formData.duracao && (
                        <Button
                          type="button"
                          onClick={handleGenerarDuracaoWithAI}
                          disabled={loadingAI}
                          variant="outline"
                          size="sm"
                        >
                          <Sparkles className="w-3 h-3 mr-1" />
                          {loadingAI ? 'Gerando...' : 'Gerar com IA'}
                        </Button>
                      )}
                    </div>
                    <Input
                      value={formData.duracao}
                      onChange={(e) => setFormData({...formData, duracao: e.target.value})}
                      placeholder="Ex: 2h30min, 150 páginas, 45minutos"
                      className="border-[#E8DCC4]"
                    />
                  </div>
                </div>

                {formData.tipo_acesso === 'pago' && (
                  <div className="space-y-2">
                    <Label>Preço (R$)</Label>
                    <Input
                      type="number"
                      step="0.01"
                      value={formData.preco}
                      onChange={(e) => setFormData({...formData, preco: parseFloat(e.target.value) || 0})}
                      className="border-[#E8DCC4]"
                    />
                  </div>
                )}

                <div className="space-y-2">
                  <Label>Data e Horário do Evento (Opcional - para aulas ao vivo)</Label>
                  <Input
                    type="datetime-local"
                    value={formData.data_evento}
                    onChange={(e) => setFormData({...formData, data_evento: e.target.value})}
                    className="border-[#E8DCC4]"
                  />
                </div>

                {formData.data_evento && (
                  <div className="p-4 bg-blue-50 rounded-lg border-2 border-blue-200 space-y-4">
                    <h4 className="font-semibold text-blue-800">Localização do Evento (Opcional)</h4>
                    
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

                    <div className="grid md:grid-cols-3 gap-4">
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

                      <div className="space-y-2 md:col-span-3">
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

                {statusMessage.text && (
                  <div className={`p-4 rounded-lg flex items-center gap-3 ${
                    statusMessage.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
                  }`}>
                    {statusMessage.type === 'success' ? (
                      <CheckCircle className="w-5 h-5" />
                    ) : (
                      <XCircle className="w-5 h-5" />
                    )}
                    <p>{statusMessage.text}</p>
                  </div>
                )}

                <div className="flex gap-3 pt-4">
                  <Link to={createPageUrl("EdBeauty")} className="flex-1">
                    <Button variant="outline" className="w-full border-[#E8DCC4]">
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      Cancelar
                    </Button>
                  </Link>
                  <Button
                    type="submit"
                    disabled={createContentMutation.isPending}
                    className="flex-1 bg-gradient-to-r from-[#D4AF37] to-[#C8A882] text-white"
                  >
                    {createContentMutation.isPending ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                        Publicando...
                      </>
                    ) : (
                      <>
                        <GraduationCap className="w-4 h-4 mr-2" />
                        Publicar Conteúdo
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}