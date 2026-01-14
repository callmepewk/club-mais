import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { motion } from "framer-motion";
import { 
  Crown, Award, Users, Sparkles, Star, 
  TrendingUp, CheckCircle, Gift, Target, Briefcase,
  ArrowRight, Zap, Stethoscope, Ticket, Copy, Clock
} from "lucide-react";

const benefits = [
  {
    icon: Crown,
    title: "Status Premium",
    description: "Seja reconhecido como profissional de elite com selo Golden Circle exclusivo"
  },
  {
    icon: TrendingUp,
    title: "Mais Visibilidade",
    description: "Destaque premium no Mapa da Estética e acesso prioritário a novos clientes"
  },
  {
    icon: Users,
    title: "Networking Exclusivo",
    description: "Conecte-se com os melhores profissionais da área em eventos privados"
  },
  {
    icon: Gift,
    title: "Benefícios VIP",
    description: "Descontos em produtos, equipamentos e capacitações profissionais"
  },
  {
    icon: Target,
    title: "Marketing Personalizado",
    description: "Suporte completo para promover seus serviços e construir sua marca"
  },
  {
    icon: Zap,
    title: "Ferramentas Premium",
    description: "Acesso gratuito ao Laser Code Pro e outras plataformas do ecossistema"
  }
];

const requirements = [
  "Formação comprovada na área de estética ou saúde",
  "Mínimo de 2 anos de experiência profissional",
  "Avaliação média de 4.5+ estrelas no Mapa da Estética",
  "Comprometimento com práticas sustentáveis e éticas",
  "Participação ativa na comunidade"
];

const stats = [
  { number: "100+", label: "Profissionais Golden" },
  { number: "5.0", label: "Avaliação Média" },
  { number: "10k+", label: "Atendimentos" },
  { number: "98%", label: "Satisfação" }
];

export default function GoldenDoctors() {
  const [showInscricaoModal, setShowInscricaoModal] = useState(false);
  const [pixQRCode, setPixQRCode] = useState(null);
  const [timeRemaining, setTimeRemaining] = useState(60);
  const [transactionId, setTransactionId] = useState(null);
  const queryClient = useQueryClient();

  const { data: user } = useQuery({
    queryKey: ['current-user-golden'],
    queryFn: () => base44.auth.me().catch(() => null),
  });

  const handleCandidateseAgora = () => {
    const whatsappNumber = "5531972595643";
    const message = encodeURIComponent("Olá! Gostaria de fazer parte da comunidade exclusiva Golden Circle. Tenho interesse em me candidatar!");
    window.open(`https://wa.me/${whatsappNumber}?text=${message}`, '_blank');
  };

  const gerarPixMutation = useMutation({
    mutationFn: async () => {
      const valor = 500; // Valor da inscrição R$ 500
      
      const qrCode = `00020126580014br.gov.bcb.pix0136${Math.random().toString(36).substring(2, 15)}520400005303986540${valor.toFixed(2)}5802BR5925Club da Beleza6009SAO PAULO62070503***6304`;
      
      const expiracaoDate = new Date();
      expiracaoDate.setMinutes(expiracaoDate.getMinutes() + 1);
      
      const transaction = await base44.entities.PixTransaction.create({
        conta_id: user?.email || 'guest',
        qr_code: qrCode,
        valor: valor,
        status: 'pendente',
        data_expiracao: expiracaoDate.toISOString()
      });
      
      return { qrCode, transactionId: transaction.id };
    },
    onSuccess: (data) => {
      setPixQRCode(data.qrCode);
      setTransactionId(data.transactionId);
      setTimeRemaining(60);
      startTimer();
    },
  });

  const confirmarPagamentoMutation = useMutation({
    mutationFn: async () => {
      await base44.entities.PixTransaction.update(transactionId, {
        status: 'confirmado',
        confirmado_em: new Date().toISOString()
      });
      
      return true;
    },
    onSuccess: () => {
      alert('✅ Pagamento confirmado! Você receberá informações sobre o próximo encontro Golden Circle por e-mail.');
      setShowInscricaoModal(false);
      setPixQRCode(null);
      setTransactionId(null);
    },
  });

  const startTimer = () => {
    const interval = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setPixQRCode(null);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(pixQRCode);
    alert('Código PIX copiado!');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-[#F5EFE6] to-white">
      {/* Hero Section */}
      <div className="relative py-24 px-6 overflow-hidden bg-gradient-to-br from-[#D4AF37] via-[#C8A882] to-[#D4AF37]">
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
                <Stethoscope className="w-12 h-12 text-white" />
              </div>
            </motion.div>

            <div className="space-y-4">
              <Badge className="bg-white/20 text-white border-white/30 px-4 py-2 text-base backdrop-blur-sm">
                Comunidade Exclusiva
              </Badge>
              
              <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight">
                Golden Circle
              </h1>

              <p className="text-2xl md:text-3xl text-white/90 font-medium">
                A Elite da Estética Brasileira
              </p>

              <p className="text-xl text-white/80 max-w-3xl mx-auto leading-relaxed">
                Uma comunidade exclusiva que capacita e reúne os melhores Golden Doctors - 
                profissionais de elite da estética e beleza do país
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-6">
              <Button 
                onClick={handleCandidateseAgora}
                size="lg"
                className="bg-white text-[#D4AF37] hover:bg-white/90 shadow-2xl hover:shadow-3xl transition-all duration-300 px-10 py-7 text-lg font-semibold group"
              >
                Candidate-se Agora
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
              
              <Button 
                onClick={() => setShowInscricaoModal(true)}
                size="lg"
                variant="outline"
                className="bg-white/10 backdrop-blur-sm border-2 border-white text-white hover:bg-white hover:text-[#D4AF37] shadow-2xl hover:shadow-3xl transition-all duration-300 px-10 py-7 text-lg font-semibold group"
              >
                <Ticket className="w-5 h-5 mr-2" />
                Comprar Inscrição - Próximo Encontro
              </Button>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="py-16 px-6 bg-white border-b border-[#E8DCC4]">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="text-5xl font-bold bg-gradient-to-r from-[#D4AF37] to-[#C8A882] bg-clip-text text-transparent mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-600 font-medium">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* About Section */}
      <div className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="space-y-6"
            >
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#F5EFE6] rounded-full border border-[#D4AF37]/20">
                  <Sparkles className="w-4 h-4 text-[#D4AF37]" />
                  <span className="text-sm font-medium text-[#C8A882]">
                    Excelência e Exclusividade
                  </span>
                </div>

                <h2 className="font-serif text-4xl md:text-5xl font-bold">
                  <span className="bg-gradient-to-r from-[#D4AF37] to-[#C8A882] bg-clip-text text-transparent">
                    O que é
                  </span>
                  <br />
                  <span className="text-gray-800">Golden Circle?</span>
                </h2>
              </div>

              <div className="space-y-4 text-gray-600 leading-relaxed text-lg">
                <p>
                  <strong className="text-[#C8A882]">Golden Circle</strong> é a elite da estética brasileira - 
                  uma comunidade exclusiva do Club da Beleza que capacita e reúne os melhores profissionais 
                  da estética, dermatologia, medicina estética e áreas relacionadas, os chamados <strong>Golden Doctors</strong>.
                </p>

                <p>
                  Nossos membros Golden Doctors são criteriosamente selecionados com base em sua experiência, 
                  qualificações, avaliações de clientes e comprometimento com a excelência. 
                  Eles representam o mais alto padrão de qualidade no setor.
                </p>

                <p>
                  Ao fazer parte do Golden Circle, você não apenas ganha reconhecimento 
                  como Golden Doctor e profissional de elite, mas também acessa uma rede de capacitação, 
                  benefícios exclusivos, oportunidades de networking e ferramentas para impulsionar 
                  seu negócio.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <div className="relative rounded-3xl overflow-hidden shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&q=80"
                  alt="Golden Doctors"
                  className="w-full h-[600px] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#D4AF37]/30 to-transparent"></div>
                
                {/* Floating Badge */}
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute bottom-8 left-8 right-8 bg-white/95 backdrop-blur-sm rounded-2xl p-6 shadow-2xl border border-[#E8DCC4]"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-[#D4AF37] to-[#C8A882] rounded-full flex items-center justify-center shadow-lg">
                      <Crown className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <div className="font-serif text-2xl font-bold text-gray-800">
                        Golden Status
                      </div>
                      <div className="text-sm text-gray-600">
                        Certificação de Excelência
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="py-24 px-6 bg-gradient-to-br from-white to-[#F5EFE6]">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16 space-y-4"
          >
            <h2 className="font-serif text-4xl md:text-5xl font-bold">
              <span className="text-gray-800">Benefícios</span>
              <span className="bg-gradient-to-r from-[#D4AF37] to-[#C8A882] bg-clip-text text-transparent"> Exclusivos</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Vantagens especiais para membros do Golden Circle
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <motion.div
                key={benefit.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="h-full border-[#E8DCC4] hover:border-[#D4AF37] transition-all duration-300 hover:shadow-xl group bg-white">
                  <CardContent className="p-8 space-y-4">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#D4AF37] to-[#C8A882] flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                      <benefit.icon className="w-7 h-7 text-white" />
                    </div>
                    
                    <h3 className="font-serif text-xl font-bold text-gray-800">
                      {benefit.title}
                    </h3>
                    
                    <p className="text-gray-600 leading-relaxed">
                      {benefit.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Requirements Section */}
      <div className="py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <Card className="border-[#E8DCC4] shadow-2xl bg-white">
              <CardHeader className="text-center p-8 border-b border-[#E8DCC4]">
                <CardTitle className="font-serif text-3xl md:text-4xl font-bold">
                  <span className="text-gray-800">Requisitos para</span>
                  <span className="bg-gradient-to-r from-[#D4AF37] to-[#C8A882] bg-clip-text text-transparent"> Candidatura</span>
                </CardTitle>
                <p className="text-gray-600 mt-2">
                  Critérios para se tornar um membro Golden Doctor do Circle
                </p>
              </CardHeader>
              <CardContent className="p-8">
                <div className="space-y-4">
                  {requirements.map((requirement, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.6, delay: index * 0.1 }}
                      className="flex items-start gap-4 p-4 rounded-xl hover:bg-[#F5EFE6] transition-colors"
                    >
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#D4AF37] to-[#C8A882] flex items-center justify-center flex-shrink-0 shadow-md">
                        <CheckCircle className="w-5 h-5 text-white" />
                      </div>
                      <p className="text-gray-700 text-lg pt-0.5">{requirement}</p>
                    </motion.div>
                  ))}
                </div>

                <div className="mt-8 pt-8 border-t border-[#E8DCC4] text-center">
                  <p className="text-gray-600 mb-6">
                    Atende aos requisitos? Candidate-se agora e faça parte da elite!
                  </p>
                  <Button 
                    onClick={handleCandidateseAgora}
                    size="lg"
                    className="bg-gradient-to-r from-[#D4AF37] to-[#C8A882] hover:from-[#C8A882] hover:to-[#D4AF37] text-white shadow-xl hover:shadow-2xl transition-all duration-300 px-10 py-7 text-lg font-semibold group"
                  >
                    <Crown className="w-5 h-5 mr-2" />
                    Candidatar-se ao Golden Circle
                    <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>

      {/* Modal de Inscrição */}
      <Dialog open={showInscricaoModal} onOpenChange={setShowInscricaoModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl font-serif flex items-center gap-2">
              <Ticket className="w-6 h-6 text-[#D4AF37]" />
              Inscrição - Próximo Encontro Golden Circle
            </DialogTitle>
          </DialogHeader>

          {!pixQRCode ? (
            <div className="space-y-6">
              <div className="bg-gradient-to-br from-[#F5EFE6] to-[#E8DCC4] rounded-2xl p-6">
                <div className="text-center space-y-3">
                  <Crown className="w-16 h-16 text-[#D4AF37] mx-auto" />
                  <h3 className="font-serif text-2xl font-bold text-gray-800">
                    Encontro Exclusivo
                  </h3>
                  <p className="text-gray-600">
                    Networking premium com os melhores profissionais da estética
                  </p>
                  <div className="pt-4">
                    <div className="text-4xl font-bold text-[#D4AF37]">R$ 500</div>
                    <div className="text-sm text-gray-500">Valor da inscrição</div>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-[#F5EFE6] rounded-lg">
                  <CheckCircle className="w-5 h-5 text-[#D4AF37]" />
                  <span className="text-sm text-gray-700">Coffee break premium</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-[#F5EFE6] rounded-lg">
                  <CheckCircle className="w-5 h-5 text-[#D4AF37]" />
                  <span className="text-sm text-gray-700">Material exclusivo</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-[#F5EFE6] rounded-lg">
                  <CheckCircle className="w-5 h-5 text-[#D4AF37]" />
                  <span className="text-sm text-gray-700">Certificado de participação</span>
                </div>
              </div>

              <Button
                onClick={() => gerarPixMutation.mutate()}
                disabled={gerarPixMutation.isPending || !user}
                className="w-full bg-gradient-to-r from-[#D4AF37] to-[#C8A882] text-white py-6 text-lg"
              >
                {gerarPixMutation.isPending ? 'Gerando PIX...' : user ? 'Gerar QR Code PIX' : 'Faça login para continuar'}
              </Button>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="bg-gradient-to-br from-[#F5EFE6] to-[#E8DCC4] rounded-2xl p-6 text-center">
                <div className="bg-white p-4 rounded-xl inline-block mb-4">
                  <div className="text-6xl">📱</div>
                </div>
                <h3 className="font-serif text-xl font-bold text-gray-800 mb-2">
                  Escaneie o QR Code
                </h3>
                <p className="text-3xl font-bold text-[#D4AF37]">R$ 500,00</p>
                
                <div className="mt-4 flex items-center justify-center gap-2 text-sm text-gray-600">
                  <Clock className="w-4 h-4" />
                  <span>Expira em: {Math.floor(timeRemaining / 60)}:{(timeRemaining % 60).toString().padStart(2, '0')}</span>
                </div>
              </div>

              <div className="bg-white border-2 border-dashed border-[#D4AF37] rounded-xl p-4">
                <p className="text-xs text-gray-600 break-all font-mono">{pixQRCode}</p>
              </div>

              <Button
                onClick={copyToClipboard}
                variant="outline"
                className="w-full border-[#D4AF37] text-[#D4AF37] hover:bg-[#F5EFE6]"
              >
                <Copy className="w-4 h-4 mr-2" />
                Copiar Código PIX
              </Button>

              <div className="space-y-3">
                <Button
                  onClick={() => confirmarPagamentoMutation.mutate()}
                  disabled={confirmarPagamentoMutation.isPending}
                  className="w-full bg-gradient-to-r from-[#D4AF37] to-[#C8A882] text-white py-6"
                >
                  {confirmarPagamentoMutation.isPending ? 'Confirmando...' : 'Confirmar Pagamento'}
                </Button>
                
                <Button
                  onClick={() => {
                    setPixQRCode(null);
                    gerarPixMutation.mutate();
                  }}
                  variant="outline"
                  className="w-full"
                >
                  Gerar Novo QR Code
                </Button>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-xs text-yellow-800">
                  ⚠️ Após realizar o pagamento via PIX, clique em "Confirmar Pagamento" para validar sua inscrição.
                </p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}