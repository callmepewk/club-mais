import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Sparkles, Upload, Edit, Trash, Clock, MapPin, Users } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

const ESTADOS_BRASIL = [
  { uf: "AC", nome: "Acre" },
  { uf: "AL", nome: "Alagoas" },
  { uf: "AP", nome: "Amapá" },
  { uf: "AM", nome: "Amazonas" },
  { uf: "BA", nome: "Bahia" },
  { uf: "CE", nome: "Ceará" },
  { uf: "DF", nome: "Distrito Federal" },
  { uf: "ES", nome: "Espírito Santo" },
  { uf: "GO", nome: "Goiás" },
  { uf: "MA", nome: "Maranhão" },
  { uf: "MT", nome: "Mato Grosso" },
  { uf: "MS", nome: "Mato Grosso do Sul" },
  { uf: "MG", nome: "Minas Gerais" },
  { uf: "PA", nome: "Pará" },
  { uf: "PB", nome: "Paraíba" },
  { uf: "PR", nome: "Paraná" },
  { uf: "PE", nome: "Pernambuco" },
  { uf: "PI", nome: "Piauí" },
  { uf: "RJ", nome: "Rio de Janeiro" },
  { uf: "RN", nome: "Rio Grande do Norte" },
  { uf: "RS", nome: "Rio Grande do Sul" },
  { uf: "RO", nome: "Rondônia" },
  { uf: "RR", nome: "Roraima" },
  { uf: "SC", nome: "Santa Catarina" },
  { uf: "SP", nome: "São Paulo" },
  { uf: "SE", nome: "Sergipe" },
  { uf: "TO", nome: "Tocantins" }
];

const PAISES = [
  "Afeganistão", "África do Sul", "Albânia", "Alemanha", "Andorra", "Angola", "Antígua e Barbuda", 
  "Arábia Saudita", "Argélia", "Argentina", "Armênia", "Austrália", "Áustria", "Azerbaijão", 
  "Bahamas", "Bangladesh", "Barbados", "Bahrein", "Bélgica", "Belize", "Benin", "Bielorrússia", 
  "Bolívia", "Bósnia e Herzegovina", "Botsuana", "Brasil", "Brunei", "Bulgária", "Burkina Faso", 
  "Burundi", "Butão", "Cabo Verde", "Camarões", "Camboja", "Canadá", "Catar", "Cazaquistão", 
  "Chade", "Chile", "China", "Chipre", "Colômbia", "Comores", "Congo", "Coreia do Norte", 
  "Coreia do Sul", "Costa do Marfim", "Costa Rica", "Croácia", "Cuba", "Dinamarca", "Djibuti", 
  "Dominica", "Egito", "El Salvador", "Emirados Árabes Unidos", "Equador", "Eritreia", "Eslováquia", 
  "Eslovênia", "Espanha", "Estados Unidos", "Estônia", "Etiópia", "Fiji", "Filipinas", "Finlândia", 
  "França", "Gabão", "Gâmbia", "Gana", "Geórgia", "Granada", "Grécia", "Guatemala", "Guiana", 
  "Guiné", "Guiné-Bissau", "Guiné Equatorial", "Haiti", "Honduras", "Hungria", "Iêmen", "Ilhas Marshall", 
  "Ilhas Salomão", "Índia", "Indonésia", "Irã", "Iraque", "Irlanda", "Islândia", "Israel", "Itália", 
  "Jamaica", "Japão", "Jordânia", "Kiribati", "Kosovo", "Kuwait", "Laos", "Lesoto", "Letônia", 
  "Líbano", "Libéria", "Líbia", "Liechtenstein", "Lituânia", "Luxemburgo", "Macedônia do Norte", 
  "Madagascar", "Malásia", "Malawi", "Maldivas", "Mali", "Malta", "Marrocos", "Maurícia", "Mauritânia", 
  "México", "Mianmar", "Micronésia", "Moçambique", "Moldávia", "Mônaco", "Mongólia", "Montenegro", 
  "Namíbia", "Nauru", "Nepal", "Nicarágua", "Níger", "Nigéria", "Noruega", "Nova Zelândia", "Omã", 
  "Países Baixos", "Palau", "Panamá", "Papua-Nova Guiné", "Paquistão", "Paraguai", "Peru", "Polônia", 
  "Portugal", "Quênia", "Quirguistão", "Reino Unido", "República Centro-Africana", 
  "República Democrática do Congo", "República Dominicana", "República Tcheca", "Romênia", "Ruanda", 
  "Rússia", "Samoa", "San Marino", "Santa Lúcia", "São Cristóvão e Névis", "São Tomé e Príncipe", 
  "São Vicente e Granadinas", "Seicheles", "Senegal", "Serra Leoa", "Sérvia", "Singapura", "Síria", 
  "Somália", "Sri Lanka", "Suazilândia", "Sudão", "Sudão do Sul", "Suécia", "Suíça", "Suriname", 
  "Tailândia", "Tajiquistão", "Tanzânia", "Timor-Leste", "Togo", "Tonga", "Trinidad e Tobago", 
  "Tunísia", "Turcomenistão", "Turquia", "Tuvalu", "Ucrânia", "Uganda", "Uruguai", "Uzbequistão", 
  "Vanuatu", "Vaticano", "Venezuela", "Vietnã", "Zâmbia", "Zimbábue"
];

const CIDADES_POR_ESTADO = {
  "SP": ["São Paulo", "Campinas", "Santos", "Ribeirão Preto", "São José dos Campos", "Sorocaba", "São Bernardo do Campo", "Santo André"],
  "RJ": ["Rio de Janeiro", "Niterói", "São Gonçalo", "Duque de Caxias", "Nova Iguaçu", "Campos dos Goytacazes", "Petrópolis", "Volta Redonda"],
  "MG": ["Belo Horizonte", "Uberlândia", "Contagem", "Juiz de Fora", "Betim", "Montes Claros", "Ribeirão das Neves", "Uberaba"],
  "BA": ["Salvador", "Feira de Santana", "Vitória da Conquista", "Camaçari", "Itabuna", "Juazeiro", "Lauro de Freitas", "Ilhéus"],
  "PR": ["Curitiba", "Londrina", "Maringá", "Ponta Grossa", "Cascavel", "São José dos Pinhais", "Foz do Iguaçu", "Colombo"],
  "RS": ["Porto Alegre", "Caxias do Sul", "Pelotas", "Canoas", "Santa Maria", "Gravataí", "Viamão", "Novo Hamburgo"],
  "PE": ["Recife", "Jaboatão dos Guararapes", "Olinda", "Caruaru", "Petrolina", "Paulista", "Cabo de Santo Agostinho", "Camaragibe"],
  "CE": ["Fortaleza", "Caucaia", "Juazeiro do Norte", "Maracanaú", "Sobral", "Crato", "Itapipoca", "Maranguape"],
  "PA": ["Belém", "Ananindeua", "Santarém", "Marabá", "Castanhal", "Parauapebas", "Itaituba", "Cametá"],
  "SC": ["Florianópolis", "Joinville", "Blumenau", "São José", "Criciúma", "Chapecó", "Itajaí", "Jaraguá do Sul"],
  "GO": ["Goiânia", "Aparecida de Goiânia", "Anápolis", "Rio Verde", "Luziânia", "Águas Lindas de Goiás", "Valparaíso de Goiás", "Trindade"],
  "MA": ["São Luís", "Imperatriz", "São José de Ribamar", "Timon", "Caxias", "Codó", "Paço do Lumiar", "Açailândia"],
  "AM": ["Manaus", "Parintins", "Itacoatiara", "Manacapuru", "Coari", "Tefé", "Tabatinga", "Maués"],
  "ES": ["Vitória", "Vila Velha", "Serra", "Cariacica", "Cachoeiro de Itapemirim", "Linhares", "São Mateus", "Colatina"],
  "PB": ["João Pessoa", "Campina Grande", "Santa Rita", "Patos", "Bayeux", "Sousa", "Cajazeiras", "Guarabira"],
  "RN": ["Natal", "Mossoró", "Parnamirim", "São Gonçalo do Amarante", "Macaíba", "Ceará-Mirim", "Caicó", "Assu"],
  "AL": ["Maceió", "Arapiraca", "Rio Largo", "Palmeira dos Índios", "União dos Palmares", "Penedo", "Delmiro Gouveia", "Coruripe"],
  "MT": ["Cuiabá", "Várzea Grande", "Rondonópolis", "Sinop", "Tangará da Serra", "Cáceres", "Sorriso", "Lucas do Rio Verde"],
  "MS": ["Campo Grande", "Dourados", "Três Lagoas", "Corumbá", "Ponta Porã", "Aquidauana", "Nova Andradina", "Sidrolândia"],
  "SE": ["Aracaju", "Nossa Senhora do Socorro", "Lagarto", "Itabaiana", "São Cristóvão", "Estância", "Simão Dias", "Tobias Barreto"],
  "RO": ["Porto Velho", "Ji-Paraná", "Ariquemes", "Cacoal", "Vilhena", "Jaru", "Rolim de Moura", "Guajará-Mirim"],
  "TO": ["Palmas", "Araguaína", "Gurupi", "Porto Nacional", "Paraíso do Tocantins", "Colinas do Tocantins", "Guaraí", "Miracema do Tocantins"],
  "AC": ["Rio Branco", "Cruzeiro do Sul", "Sena Madureira", "Tarauacá", "Feijó", "Brasiléia", "Plácido de Castro", "Xapuri"],
  "AP": ["Macapá", "Santana", "Laranjal do Jari", "Oiapoque", "Porto Grande", "Mazagão", "Tartarugalzinho", "Pedra Branca do Amapari"],
  "RR": ["Boa Vista", "Rorainópolis", "Caracaraí", "Mucajaí", "Alto Alegre", "Bonfim", "Cantá", "São João da Baliza"],
  "PI": ["Teresina", "Parnaíba", "Picos", "Piripiri", "Floriano", "Campo Maior", "Barras", "Altos"],
  "DF": ["Brasília", "Gama", "Taguatinga", "Ceilândia", "Samambaia", "Planaltina", "Águas Claras", "Sobradinho"]
};

export default function AdminEventManager() {
  const [showModal, setShowModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [generatingAI, setGeneratingAI] = useState(false);
  const [formData, setFormData] = useState({
    titulo: "", descricao: "", data_hora: "", imagem: "",
    tipo_evento: "publico", tipos_cartao_gratuito: [],
    tipo_inscricao_outros: "pago", valor_inscricao: 0,
    vagas_totais: 50, cidade: "", estado: "", pais: "Brasil"
  });
  const queryClient = useQueryClient();

  const { data: events = [] } = useQuery({
    queryKey: ['card-events-admin'],
    queryFn: () => base44.entities.CardEvent.list('-data_hora'),
  });

  const createMutation = useMutation({
    mutationFn: (data) => {
      const localizacao = `${data.cidade}, ${data.estado}, ${data.pais}`;
      let tipoInscricao = 'pago';
      let tiposCartaoPermitidos = ['basic', 'pro', 'exclusive'];
      
      if (data.tipo_evento === 'publico') {
        tipoInscricao = data.tipo_inscricao_outros;
      } else {
        tipoInscricao = 'beneficio_exclusive';
        tiposCartaoPermitidos = data.tipos_cartao_gratuito.length > 0 ? data.tipos_cartao_gratuito : ['exclusive'];
      }

      return base44.entities.CardEvent.create({
        titulo: data.titulo,
        descricao: data.descricao,
        data_hora: data.data_hora,
        localizacao,
        imagem: data.imagem,
        tipo_inscricao: tipoInscricao,
        valor_inscricao: data.valor_inscricao || 0,
        vagas_totais: data.vagas_totais,
        vagas_disponiveis: data.vagas_totais,
        tipos_cartao_permitidos: tiposCartaoPermitidos,
        ativo: true
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['card-events-admin']);
      queryClient.invalidateQueries(['card-events']);
      setShowModal(false);
      resetForm();
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => {
      const localizacao = `${data.cidade}, ${data.estado}, ${data.pais}`;
      return base44.entities.CardEvent.update(id, {
        titulo: data.titulo,
        descricao: data.descricao,
        data_hora: data.data_hora,
        localizacao,
        imagem: data.imagem,
        tipo_inscricao: data.tipo_inscricao_outros,
        valor_inscricao: data.valor_inscricao || 0,
        vagas_totais: data.vagas_totais,
        tipos_cartao_permitidos: data.tipos_cartao_gratuito.length > 0 ? data.tipos_cartao_gratuito : ['basic', 'pro', 'exclusive']
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['card-events-admin']);
      queryClient.invalidateQueries(['card-events']);
      setShowModal(false);
      resetForm();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.CardEvent.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['card-events-admin']);
      queryClient.invalidateQueries(['card-events']);
    },
  });

  const generateDescription = async () => {
    if (!formData.titulo) {
      alert('Digite um título primeiro');
      return;
    }
    setGeneratingAI(true);
    try {
      const result = await base44.integrations.Core.InvokeLLM({
        prompt: `Crie uma descrição atraente e profissional para um evento de beleza e estética com o título: "${formData.titulo}". A descrição deve ter 2-3 parágrafos e ser convidativa.`
      });
      setFormData({ ...formData, descricao: result });
    } catch (e) {
      alert('Erro ao gerar descrição');
    }
    setGeneratingAI(false);
  };

  const resetForm = () => {
    setFormData({
      titulo: "", descricao: "", data_hora: "", imagem: "",
      tipo_evento: "publico", tipos_cartao_gratuito: [],
      tipo_inscricao_outros: "pago", valor_inscricao: 0,
      vagas_totais: 50, cidade: "", estado: "", pais: "Brasil"
    });
    setEditingEvent(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingEvent) {
      updateMutation.mutate({ id: editingEvent.id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const toggleCartaoGratuito = (tipo) => {
    const current = formData.tipos_cartao_gratuito;
    if (current.includes(tipo)) {
      setFormData({ ...formData, tipos_cartao_gratuito: current.filter(t => t !== tipo) });
    } else {
      setFormData({ ...formData, tipos_cartao_gratuito: [...current, tipo] });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Gerenciar Eventos</h2>
        <Button onClick={() => { resetForm(); setShowModal(true); }} className="bg-gradient-to-r from-[#D4AF37] to-[#C8A882] text-white">
          <Plus className="w-4 h-4 mr-2" /> Criar Evento
        </Button>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {events.map((event) => (
          <Card key={event.id} className="border-[#E8DCC4]">
            <CardContent className="p-4 space-y-3">
              {event.imagem && (
                <img src={event.imagem} alt={event.titulo} className="w-full h-40 object-cover rounded-lg" />
              )}
              <div>
                <h3 className="font-bold text-lg">{event.titulo}</h3>
                <p className="text-sm text-gray-600 line-clamp-2 mt-1">{event.descricao}</p>
              </div>
              <div className="flex flex-wrap gap-2 text-xs text-gray-600">
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {format(new Date(event.data_hora), "dd/MM/yy HH:mm", { locale: ptBR })}
                </div>
                <div className="flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  {event.localizacao}
                </div>
                <div className="flex items-center gap-1">
                  <Users className="w-3 h-3" />
                  {event.vagas_disponiveis}/{event.vagas_totais}
                </div>
              </div>
              <div className="flex gap-2 pt-2">
                <Button onClick={() => deleteMutation.mutate(event.id)} size="sm" variant="outline" className="flex-1 text-red-600">
                  <Trash className="w-4 h-4 mr-1" /> Excluir
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-serif">Criar Novo Evento</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label>Título do Evento</Label>
              <Input value={formData.titulo} onChange={(e) => setFormData({...formData, titulo: e.target.value})} required />
            </div>

            <div>
              <Label>Descrição</Label>
              <Textarea value={formData.descricao} onChange={(e) => setFormData({...formData, descricao: e.target.value})} required className="h-32" />
              <Button type="button" onClick={generateDescription} disabled={generatingAI} variant="outline" className="w-full mt-2">
                <Sparkles className="w-4 h-4 mr-2" /> {generatingAI ? 'Gerando...' : 'Gerar com IA'}
              </Button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Data e Hora</Label>
                <Input type="datetime-local" value={formData.data_hora} onChange={(e) => setFormData({...formData, data_hora: e.target.value})} required />
              </div>
              <div>
                <Label>Total de Vagas</Label>
                <Input type="number" value={formData.vagas_totais} onChange={(e) => setFormData({...formData, vagas_totais: parseInt(e.target.value) || 50})} required />
              </div>
            </div>

            <div>
              <Label>URL da Imagem</Label>
              <Input value={formData.imagem} onChange={(e) => setFormData({...formData, imagem: e.target.value})} placeholder="https://..." />
            </div>

            <div>
              <Label>Tipo de Evento</Label>
              <Select value={formData.tipo_evento} onValueChange={(v) => setFormData({...formData, tipo_evento: v})}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="publico">Público</SelectItem>
                  <SelectItem value="privado">Privado (Exclusivo para Cartões)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {formData.tipo_evento === 'privado' ? (
              <div>
                <Label>Cartões com Acesso Gratuito</Label>
                <div className="flex gap-3 mt-2">
                  {['basic', 'pro', 'exclusive'].map(tipo => (
                    <button
                      key={tipo}
                      type="button"
                      onClick={() => toggleCartaoGratuito(tipo)}
                      className={`px-4 py-2 rounded-lg border-2 transition-all capitalize ${
                        formData.tipos_cartao_gratuito.includes(tipo)
                          ? 'border-[#D4AF37] bg-[#F5EFE6] text-[#D4AF37]'
                          : 'border-gray-200 text-gray-600'
                      }`}
                    >
                      {tipo}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Tipo de Inscrição</Label>
                    <Select value={formData.tipo_inscricao_outros} onValueChange={(v) => setFormData({...formData, tipo_inscricao_outros: v})}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="gratuito">Gratuito</SelectItem>
                        <SelectItem value="pago">Pago</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  {formData.tipo_inscricao_outros === 'pago' && (
                    <div>
                      <Label>Valor (R$)</Label>
                      <Input type="number" step="0.01" value={formData.valor_inscricao} onChange={(e) => setFormData({...formData, valor_inscricao: parseFloat(e.target.value) || 0})} />
                    </div>
                  )}
                </div>
              </>
            )}

            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label>País</Label>
                <Select value={formData.pais} onValueChange={(v) => setFormData({...formData, pais: v, estado: '', cidade: ''})}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent className="max-h-60">
                    {PAISES.map(pais => (
                      <SelectItem key={pais} value={pais}>{pais}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              {formData.pais === 'Brasil' && (
                <>
                  <div>
                    <Label>Estado</Label>
                    <Select value={formData.estado} onValueChange={(v) => setFormData({...formData, estado: v, cidade: ''})}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent className="max-h-60">
                        {ESTADOS_BRASIL.map(estado => (
                          <SelectItem key={estado.uf} value={estado.uf}>{estado.nome}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  {formData.estado && (
                    <div>
                      <Label>Cidade</Label>
                      <Select value={formData.cidade} onValueChange={(v) => setFormData({...formData, cidade: v})}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent className="max-h-60">
                          {(CIDADES_POR_ESTADO[formData.estado] || []).map(cidade => (
                            <SelectItem key={cidade} value={cidade}>{cidade}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                </>
              )}

              {formData.pais !== 'Brasil' && (
                <div className="col-span-2">
                  <Label>Cidade</Label>
                  <Input value={formData.cidade} onChange={(e) => setFormData({...formData, cidade: e.target.value})} placeholder="Nome da cidade" required />
                </div>
              )}
            </div>

            <div className="flex gap-3 pt-4">
              <Button type="button" onClick={() => setShowModal(false)} variant="outline" className="flex-1">Cancelar</Button>
              <Button type="submit" disabled={createMutation.isPending} className="flex-1 bg-gradient-to-r from-[#D4AF37] to-[#C8A882] text-white">
                {createMutation.isPending ? 'Criando...' : 'Criar Evento'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}