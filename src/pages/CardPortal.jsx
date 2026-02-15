import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  CreditCard, Wallet, Coins, Calendar, MapPin, 
  Users, LogOut, Eye, EyeOff, TrendingUp, Gift,
  AlertCircle, CheckCircle, Clock, QrCode, X, Upload, Sparkles, Plus, Edit, Trash
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import AdminEventManager from "../components/card/AdminEventManager";
import BuyBeautyCoinModal from "../components/BuyBeautyCoinModal";

export default function CardPortal() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentAccount, setCurrentAccount] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [loginData, setLoginData] = useState({ nome: "", cpf: "", senha: "" });
  const [isNewAccount, setIsNewAccount] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showEventModal, setShowEventModal] = useState(false);
  const [showAddBalanceModal, setShowAddBalanceModal] = useState(false);
  const [showBuyCoinsModal, setShowBuyCoinsModal] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const queryClient = useQueryClient();

  React.useEffect(() => {
    if (isLoggedIn) {
      base44.auth.me().then(user => {
        if (user && user.role === 'admin') {
          setIsAdmin(true);
        }
      }).catch(() => {});
      
      const savedName = localStorage.getItem('last_logged_name');
      if (savedName && !loginData.nome) {
        setLoginData(prev => ({ ...prev, nome: savedName }));
      }
    }
  }, [isLoggedIn]);

  const { data: savedAccounts = [] } = useQuery({
    queryKey: ['card-accounts-local'],
    queryFn: () => {
      const saved = localStorage.getItem('card_accounts');
      return saved ? JSON.parse(saved) : [];
    },
    enabled: !isLoggedIn
  });

  const { data: account, refetch: refetchAccount } = useQuery({
    queryKey: ['current-card-account'],
    queryFn: async () => {
      const acc = await base44.entities.CardAccount.filter({ id: currentAccount.id });
      if (acc.length > 0) {
        // Sync beauty coins with user profile if linked
        const updated = acc[0];
        if (updated.user_email) {
          try {
            const users = await base44.entities.User.filter({ email: updated.user_email });
            if (users.length > 0) {
              const user = users[0];
              if (user.beauty_coins !== updated.beauty_coins) {
                await base44.entities.CardAccount.update(updated.id, {
                  beauty_coins: user.beauty_coins || 0
                });
                updated.beauty_coins = user.beauty_coins || 0;
              }
            }
          } catch (e) {}
        }
        return updated;
      }
      return currentAccount;
    },
    enabled: isLoggedIn,
    refetchInterval: 10000
  });

  const { data: events = [] } = useQuery({
    queryKey: ['card-events'],
    queryFn: () => base44.entities.CardEvent.filter({ ativo: true }, '-data_hora'),
    enabled: isLoggedIn
  });

  const { data: myRegistrations = [] } = useQuery({
    queryKey: ['my-registrations', account?.id],
    queryFn: () => base44.entities.EventRegistration.filter({ conta_id: account?.id }),
    enabled: isLoggedIn && !!account
  });

  const loginMutation = useMutation({
    mutationFn: async (data) => {
      const accounts = await base44.entities.CardAccount.filter({ cpf: data.cpf });
      if (accounts.length > 0) {
        const acc = accounts[0];
        if (acc.senha_hash === data.senha) {
          return acc;
        }
        throw new Error("Senha incorreta");
      }
      throw new Error("Conta não encontrada");
    },
    onSuccess: (acc) => {
      setCurrentAccount(acc);
      setIsLoggedIn(true);
      const accounts = savedAccounts.filter(a => a.cpf !== acc.cpf);
      accounts.push({ nome: acc.nome_completo, cpf: acc.cpf });
      localStorage.setItem('card_accounts', JSON.stringify(accounts.slice(-3)));
      localStorage.setItem('last_logged_name', acc.nome_completo);
    }
  });

  const registerMutation = useMutation({
    mutationFn: async (data) => {
      const numeroCartao = Math.floor(1000000000000000 + Math.random() * 9000000000000000).toString();
      
      // Check if user exists and sync beauty coins
      try {
        const users = await base44.entities.User.filter({ cpf: data.cpf });
        if (users.length > 0) {
          const user = users[0];
          return await base44.entities.CardAccount.create({
            ...data,
            numero_cartao: numeroCartao,
            tipo_cartao: 'basic',
            beauty_coins: user.beauty_coins || 0,
            user_email: user.email
          });
        }
      } catch (e) {}
      
      return await base44.entities.CardAccount.create({
        ...data,
        numero_cartao: numeroCartao,
        tipo_cartao: 'basic'
      });
    },
    onSuccess: (acc) => {
      setCurrentAccount(acc);
      setIsLoggedIn(true);
      localStorage.setItem('last_logged_name', acc.nome_completo);
    }
  });

  const handleLogin = (e) => {
    e.preventDefault();
    if (isNewAccount) {
      registerMutation.mutate({
        nome_completo: loginData.nome,
        cpf: loginData.cpf,
        senha_hash: loginData.senha
      });
    } else {
      loginMutation.mutate(loginData);
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentAccount(null);
    setLoginData({ nome: "", cpf: "", senha: "" });
  };

  const handleEventClick = (event) => {
    setSelectedEvent(event);
    setShowEventModal(true);
  };

  const beautyCoinToReais = (coins) => (coins * 0.10).toFixed(2);

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#D4AF37] via-[#C8A882] to-[#D4AF37] flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <Card className="shadow-2xl border-[#E8DCC4]">
            <CardHeader className="text-center space-y-4 pb-8">
              <div className="w-20 h-20 mx-auto bg-gradient-to-br from-[#D4AF37] to-[#C8A882] rounded-full flex items-center justify-center">
                <CreditCard className="w-10 h-10 text-white" />
              </div>
              <div>
                <CardTitle className="text-2xl font-serif text-gray-800">
                  Portal do Cartão
                </CardTitle>
                <p className="text-gray-600 mt-2">Acesse sua conta Beauty Club</p>
              </div>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <Label>Nome Completo</Label>
                  <Input 
                    value={loginData.nome}
                    onChange={(e) => setLoginData({...loginData, nome: e.target.value})}
                    placeholder="Seu nome completo"
                    required
                    list="saved-accounts"
                  />
                  <datalist id="saved-accounts">
                    {savedAccounts.map((acc, i) => (
                      <option key={i} value={acc.nome} />
                    ))}
                  </datalist>
                </div>

                <div>
                  <Label>CPF</Label>
                  <Input 
                    value={loginData.cpf}
                    onChange={(e) => setLoginData({...loginData, cpf: e.target.value})}
                    placeholder="000.000.000-00"
                    required
                  />
                </div>

                <div>
                  <Label>Senha</Label>
                  <div className="relative">
                    <Input 
                      type={showPassword ? "text" : "password"}
                      value={loginData.senha}
                      onChange={(e) => setLoginData({...loginData, senha: e.target.value})}
                      placeholder={isNewAccount ? "Crie sua senha" : "Sua senha"}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-sm">
                  <input 
                    type="checkbox" 
                    id="new-account"
                    checked={isNewAccount}
                    onChange={(e) => setIsNewAccount(e.target.checked)}
                    className="rounded"
                  />
                  <label htmlFor="new-account" className="text-gray-600 cursor-pointer">
                    Primeira vez? Criar nova conta
                  </label>
                </div>

                <Button 
                  type="submit" 
                  className="w-full bg-gradient-to-r from-[#D4AF37] to-[#C8A882] text-white py-6"
                  disabled={loginMutation.isPending || registerMutation.isPending}
                >
                  {loginMutation.isPending || registerMutation.isPending ? 'Acessando...' : isNewAccount ? 'Criar Conta' : 'Entrar'}
                </Button>

                {(loginMutation.isError || registerMutation.isError) && (
                  <p className="text-red-600 text-sm text-center">
                    {loginMutation.error?.message || registerMutation.error?.message}
                  </p>
                )}
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  const cardTiers = {
    basic: { name: "Basic", color: "bg-gradient-to-br from-gray-400 to-gray-600" },
    pro: { name: "Pro", color: "bg-gradient-to-br from-[#C8A882] to-[#D4AF37]" },
    exclusive: { name: "Exclusive", color: "bg-gradient-to-br from-gray-800 to-black" }
  };

  const tier = cardTiers[account?.tipo_cartao] || cardTiers.basic;

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-[#F5EFE6] to-white py-8 px-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-serif font-bold text-gray-800">Olá, {account?.nome_completo?.split(' ')[0]}</h1>
            <p className="text-gray-600">Bem-vindo ao seu portal Beauty Club</p>
          </div>
          <Button onClick={handleLogout} variant="outline" className="gap-2">
            <LogOut className="w-4 h-4" /> Sair
          </Button>
        </div>

        {/* Card Display */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`${tier.color} rounded-2xl p-8 text-white shadow-2xl relative overflow-hidden`}
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32"></div>
          <div className="relative z-10 space-y-6">
            <div className="flex justify-between items-start">
              <div>
                <Badge className="bg-white/20 text-white mb-2">{tier.name}</Badge>
                <h2 className="text-2xl font-bold">Beauty Club Card</h2>
              </div>
              <CreditCard className="w-12 h-12" />
            </div>
            <div>
              <p className="text-white/80 text-sm mb-1">Número do Cartão</p>
              <p className="text-xl font-mono">{account?.numero_cartao}</p>
            </div>
            <div className="flex justify-between items-end">
              <div>
                <p className="text-white/80 text-sm">Titular</p>
                <p className="font-semibold">{account?.nome_completo}</p>
              </div>
              <div className="text-right">
                <p className="text-white/80 text-sm">Pontos</p>
                <p className="font-bold text-2xl">{account?.pontos || 0}</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Balances */}
        <div className="grid md:grid-cols-2 gap-6">
          <Card className="border-[#E8DCC4]">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center">
                    <Wallet className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Saldo em Reais</p>
                    <p className="text-3xl font-bold text-gray-800">R$ {(account?.saldo_reais || 0).toFixed(2)}</p>
                  </div>
                </div>
              </div>
              <Button 
                onClick={() => setShowAddBalanceModal(true)}
                className="w-full bg-green-600 hover:bg-green-700 text-white"
              >
                <Wallet className="w-4 h-4 mr-2" /> Adicionar Saldo
              </Button>
            </CardContent>
          </Card>

          <Card className="border-[#E8DCC4]">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-[#D4AF37] to-[#C8A882] rounded-full flex items-center justify-center">
                    <Coins className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Beauty Coins</p>
                    <p className="text-3xl font-bold text-gray-800">{account?.beauty_coins || 0}</p>
                    <p className="text-xs text-gray-500">≈ R$ {beautyCoinToReais(account?.beauty_coins || 0)}</p>
                  </div>
                </div>
              </div>
              <Button 
                onClick={() => setShowBuyCoinsModal(true)}
                variant="outline"
                className="w-full border-[#D4AF37] text-[#D4AF37] hover:bg-[#F5EFE6]"
              >
                <Coins className="w-4 h-4 mr-2" /> Comprar Coins
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="events" className="space-y-6">
          <TabsList className={`grid w-full ${isAdmin ? 'grid-cols-3' : 'grid-cols-2'}`}>
            <TabsTrigger value="events">Eventos Disponíveis</TabsTrigger>
            <TabsTrigger value="my-events">Minhas Inscrições</TabsTrigger>
            {isAdmin && <TabsTrigger value="admin-events">Gerenciar Eventos</TabsTrigger>}
          </TabsList>

          <TabsContent value="events" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              {events.length === 0 ? (
                <div className="col-span-2 text-center py-12 text-gray-500">
                  <Calendar className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>Nenhum evento disponível no momento</p>
                </div>
              ) : events.map((event) => {
                const canRegister = event.tipos_cartao_permitidos.includes(account?.tipo_cartao);
                const isRegistered = myRegistrations.some(r => r.evento_id === event.id);
                
                return (
                  <Card key={event.id} className="border-[#E8DCC4] hover:border-[#D4AF37] transition-all">
                    <CardContent className="p-6 space-y-4">
                      {event.imagem && (
                        <img src={event.imagem} alt={event.titulo} className="w-full h-48 object-cover rounded-lg" />
                      )}
                      <div>
                        <h3 className="text-xl font-bold text-gray-800">{event.titulo}</h3>
                        <p className="text-gray-600 mt-2 line-clamp-2">{event.descricao}</p>
                      </div>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2 text-gray-600">
                          <Clock className="w-4 h-4" />
                          {format(new Date(event.data_hora), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                          <MapPin className="w-4 h-4" />
                          {event.localizacao}
                        </div>
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4 text-gray-600" />
                          <span className="text-gray-600">{event.vagas_disponiveis || 0} vagas disponíveis</span>
                        </div>
                      </div>
                      <div className="flex gap-2 items-center">
                        {event.tipo_inscricao === 'gratuito' && (
                          <Badge className="bg-green-100 text-green-800">Gratuito</Badge>
                        )}
                        {event.tipo_inscricao === 'pago' && (
                          <Badge className="bg-blue-100 text-blue-800">R$ {event.valor_inscricao}</Badge>
                        )}
                        {event.tipo_inscricao.startsWith('beneficio') && (
                          <Badge className="bg-purple-100 text-purple-800">Benefício do Cartão</Badge>
                        )}
                        {!canRegister && (
                          <Badge variant="outline" className="text-red-600 border-red-300">Não disponível para seu cartão</Badge>
                        )}
                        {isRegistered && (
                          <Badge className="bg-green-100 text-green-800"><CheckCircle className="w-3 h-3 mr-1" /> Inscrito</Badge>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <Button 
                          onClick={() => handleEventClick(event)}
                          disabled={!canRegister || isRegistered || (event.vagas_disponiveis || 0) === 0}
                          className="flex-1 bg-gradient-to-r from-[#D4AF37] to-[#C8A882] text-white py-2 text-sm"
                        >
                          {isRegistered ? 'Já Inscrito' : 'Detalhes'}
                        </Button>
                        <a 
                          href="https://wa.me/5521980343873?text=Olá! Gostaria de saber o valor da inscrição e mais informações sobre o próximo encontro."
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1"
                        >
                          <Button className="w-full bg-green-600 hover:bg-green-700 text-white py-2 text-sm">
                            Comprar
                          </Button>
                        </a>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          <TabsContent value="my-events">
            <div className="space-y-4">
              {myRegistrations.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <Calendar className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>Você ainda não tem inscrições</p>
                </div>
              ) : myRegistrations.map((reg) => {
                const event = events.find(e => e.id === reg.evento_id);
                if (!event) return null;

                return (
                  <Card key={reg.id} className="border-[#E8DCC4]">
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start">
                        <div className="space-y-2">
                          <h3 className="text-xl font-bold text-gray-800">{event.titulo}</h3>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Clock className="w-4 h-4" />
                            {format(new Date(event.data_hora), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <MapPin className="w-4 h-4" />
                            {event.localizacao}
                          </div>
                        </div>
                        <Badge className={
                          reg.status_pagamento === 'confirmado' ? 'bg-green-100 text-green-800' :
                          reg.status_pagamento === 'pendente' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }>
                          {reg.status_pagamento === 'confirmado' ? 'Confirmado' :
                           reg.status_pagamento === 'pendente' ? 'Pagamento Pendente' :
                           'Cancelado'}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          {isAdmin && (
            <TabsContent value="admin-events">
              <AdminEventManager />
            </TabsContent>
          )}
        </Tabs>
      </div>

      {/* Event Registration Modal */}
      {selectedEvent && (
        <EventRegistrationModal 
          event={selectedEvent}
          account={account}
          isOpen={showEventModal}
          onClose={() => {
            setShowEventModal(false);
            setSelectedEvent(null);
          }}
          onSuccess={() => {
            queryClient.invalidateQueries(['my-registrations']);
            queryClient.invalidateQueries(['card-events']);
            setShowEventModal(false);
            setSelectedEvent(null);
          }}
        />
      )}

      {/* Add Balance Modal */}
      <AddBalanceModal
        account={account}
        isOpen={showAddBalanceModal}
        onClose={() => setShowAddBalanceModal(false)}
        onSuccess={() => {
          queryClient.invalidateQueries(['current-card-account']);
          setShowAddBalanceModal(false);
        }}
      />

      <BuyBeautyCoinModal 
        isOpen={showBuyCoinsModal}
        onClose={() => setShowBuyCoinsModal(false)}
      />
    </div>
  );
}

function AddBalanceModal({ account, isOpen, onClose, onSuccess }) {
  const [amount, setAmount] = useState('');
  const [pixCode, setPixCode] = useState('');
  const [expiresAt, setExpiresAt] = useState(null);
  const [timeLeft, setTimeLeft] = useState(60);
  const [transactionId, setTransactionId] = useState(null);
  const queryClient = useQueryClient();

  const generatePixMutation = useMutation({
    mutationFn: async (valor) => {
      const qrCode = `PIX${Date.now()}${Math.random().toString(36).substr(2, 15).toUpperCase()}`;
      const expiration = new Date(Date.now() + 60000); // 1 minute
      
      const transaction = await base44.entities.PixTransaction.create({
        conta_id: account.id,
        qr_code: qrCode,
        valor: parseFloat(valor),
        data_expiracao: expiration.toISOString(),
        status: 'pendente'
      });

      return { qrCode, expiration, transactionId: transaction.id };
    },
    onSuccess: ({ qrCode, expiration, transactionId }) => {
      setPixCode(qrCode);
      setExpiresAt(expiration);
      setTransactionId(transactionId);
      setTimeLeft(60);
    }
  });

  const confirmPaymentMutation = useMutation({
    mutationFn: async () => {
      await base44.entities.PixTransaction.update(transactionId, {
        status: 'confirmado',
        confirmado_em: new Date().toISOString()
      });

      await base44.entities.CardAccount.update(account.id, {
        saldo_reais: account.saldo_reais + parseFloat(amount)
      });
    },
    onSuccess: () => {
      onSuccess();
      handleReset();
    }
  });

  React.useEffect(() => {
    if (!pixCode || !expiresAt) return;

    const interval = setInterval(() => {
      const now = Date.now();
      const diff = expiresAt.getTime() - now;
      const seconds = Math.max(0, Math.floor(diff / 1000));
      
      setTimeLeft(seconds);

      if (seconds === 0) {
        base44.entities.PixTransaction.update(transactionId, { status: 'expirado' });
        clearInterval(interval);
        alert('QR Code expirado! Gere um novo código.');
        handleReset();
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [pixCode, expiresAt]);

  const handleGenerate = () => {
    if (!amount || parseFloat(amount) <= 0) {
      alert('Digite um valor válido');
      return;
    }
    generatePixMutation.mutate(amount);
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(pixCode);
    alert('Código PIX copiado!');
  };

  const handleReset = () => {
    setAmount('');
    setPixCode('');
    setExpiresAt(null);
    setTimeLeft(60);
    setTransactionId(null);
  };

  const handleClose = () => {
    handleReset();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-serif">Adicionar Saldo</DialogTitle>
        </DialogHeader>

        {!pixCode ? (
          <div className="space-y-4">
            <div>
              <Label>Valor a Adicionar</Label>
              <Input
                type="number"
                step="0.01"
                min="1"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="R$ 0,00"
                className="text-2xl font-bold"
              />
            </div>

            <Button
              onClick={handleGenerate}
              disabled={generatePixMutation.isPending}
              className="w-full bg-gradient-to-r from-[#D4AF37] to-[#C8A882] text-white py-6 text-lg"
            >
              {generatePixMutation.isPending ? 'Gerando...' : 'Gerar QR Code PIX'}
            </Button>

            <p className="text-xs text-gray-500 text-center">
              O código PIX será válido por 1 minuto
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="bg-gradient-to-br from-[#D4AF37] to-[#C8A882] p-6 rounded-lg text-center text-white">
              <p className="text-lg font-bold mb-2">Valor</p>
              <p className="text-4xl font-bold">R$ {parseFloat(amount).toFixed(2)}</p>
            </div>

            <div className="bg-gray-50 border-2 border-[#D4AF37] rounded-lg p-6 space-y-4">
              <div className="flex items-center justify-center">
                <QrCode className="w-32 h-32 text-gray-800" />
              </div>

              <div className="bg-white p-3 rounded border border-gray-200">
                <p className="font-mono text-xs break-all text-center">{pixCode}</p>
              </div>

              <Button
                onClick={handleCopyCode}
                variant="outline"
                className="w-full border-[#D4AF37] text-[#D4AF37] hover:bg-[#F5EFE6]"
              >
                Copiar Código PIX
              </Button>

              <div className="text-center">
                <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${
                  timeLeft > 30 ? 'bg-green-100 text-green-800' :
                  timeLeft > 10 ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  <Clock className="w-4 h-4" />
                  <span className="font-mono font-bold">{timeLeft}s</span>
                </div>
                <p className="text-xs text-gray-500 mt-2">Tempo restante para pagamento</p>
              </div>
            </div>

            <div className="space-y-2">
              <Button
                onClick={() => confirmPaymentMutation.mutate()}
                disabled={confirmPaymentMutation.isPending}
                className="w-full bg-green-600 hover:bg-green-700 text-white py-6"
              >
                <CheckCircle className="w-5 h-5 mr-2" />
                {confirmPaymentMutation.isPending ? 'Confirmando...' : 'Confirmar Pagamento'}
              </Button>

              <Button
                onClick={handleReset}
                variant="outline"
                className="w-full"
              >
                Gerar Novo Código
              </Button>
            </div>

            <p className="text-xs text-gray-500 text-center">
              Após realizar o pagamento, clique em "Confirmar Pagamento" para adicionar o saldo à sua conta.
            </p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

function EventRegistrationModal({ event, account, isOpen, onClose, onSuccess }) {
  const [paymentMethod, setPaymentMethod] = useState('');
  const [pixQrCode, setPixQrCode] = useState('');
  const queryClient = useQueryClient();

  const registerMutation = useMutation({
    mutationFn: async (data) => {
      // Generate PIX QR Code if needed
      let qrCode = null;
      if (data.tipo_pagamento === 'pix') {
        qrCode = `PIX-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
        setPixQrCode(qrCode);
      }

      const registration = await base44.entities.EventRegistration.create({
        ...data,
        qr_code_pix: qrCode,
        status_pagamento: data.tipo_pagamento === 'pix' ? 'pendente' : 'confirmado'
      });

      // Update account balance if paid with saldo or beauty_coins
      if (data.tipo_pagamento === 'saldo') {
        await base44.entities.CardAccount.update(account.id, {
          saldo_reais: account.saldo_reais - event.valor_inscricao
        });
      } else if (data.tipo_pagamento === 'beauty_coins') {
        const coinsToDeduct = event.valor_inscricao / 0.10;
        await base44.entities.CardAccount.update(account.id, {
          beauty_coins: account.beauty_coins - coinsToDeduct
        });
      }

      // Update event available slots
      await base44.entities.CardEvent.update(event.id, {
        vagas_disponiveis: (event.vagas_disponiveis || 0) - 1
      });

      return registration;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['current-card-account']);
      if (paymentMethod !== 'pix') {
        onSuccess();
      }
    }
  });

  const handleRegister = () => {
    let tipo = paymentMethod;
    if (event.tipo_inscricao === 'gratuito' || event.tipo_inscricao.startsWith('beneficio')) {
      tipo = 'gratuito';
    }

    registerMutation.mutate({
      evento_id: event.id,
      conta_id: account.id,
      nome_participante: account.nome_completo,
      cpf_participante: account.cpf,
      tipo_pagamento: tipo,
      valor_pago: event.valor_inscricao || 0
    });
  };

  const isFree = event.tipo_inscricao === 'gratuito' || event.tipo_inscricao.startsWith('beneficio');
  const beautyCoinValue = (event.valor_inscricao || 0) / 0.10;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-serif">{event.titulo}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {event.imagem && (
            <img src={event.imagem} alt={event.titulo} className="w-full h-64 object-cover rounded-lg" />
          )}

          <div className="space-y-4">
            <p className="text-gray-700">{event.descricao}</p>
            
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex items-center gap-2 text-gray-600">
                <Clock className="w-4 h-4" />
                {format(new Date(event.data_hora), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <MapPin className="w-4 h-4" />
                {event.localizacao}
              </div>
            </div>
          </div>

          {pixQrCode ? (
            <div className="space-y-4 text-center">
              <div className="p-8 bg-white border-2 border-[#D4AF37] rounded-lg">
                <QrCode className="w-32 h-32 mx-auto text-gray-800 mb-4" />
                <p className="font-mono text-sm bg-gray-100 p-3 rounded">{pixQrCode}</p>
              </div>
              <p className="text-sm text-gray-600">Escaneie o QR Code ou copie o código para pagar</p>
              <Button onClick={onSuccess} className="w-full bg-green-600 text-white">
                <CheckCircle className="w-4 h-4 mr-2" /> Já Paguei
              </Button>
            </div>
          ) : (
            <>
              {!isFree && (
                <div className="space-y-4">
                  <div className="bg-[#F5EFE6] rounded-lg p-4">
                    <p className="text-sm text-gray-600 mb-2">Valor da Inscrição:</p>
                    <p className="text-3xl font-bold text-[#D4AF37]">R$ {event.valor_inscricao?.toFixed(2)}</p>
                    <p className="text-xs text-gray-500 mt-1">ou {beautyCoinValue.toFixed(0)} Beauty Coins</p>
                  </div>

                  <div className="space-y-3">
                    <Label>Forma de Pagamento</Label>
                    <div className="grid gap-3">
                      <button
                        onClick={() => setPaymentMethod('saldo')}
                        disabled={account.saldo_reais < event.valor_inscricao}
                        className={`p-4 border-2 rounded-lg text-left transition-all ${
                          paymentMethod === 'saldo' 
                            ? 'border-[#D4AF37] bg-[#F5EFE6]' 
                            : 'border-gray-200 hover:border-gray-300'
                        } ${account.saldo_reais < event.valor_inscricao ? 'opacity-50 cursor-not-allowed' : ''}`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <Wallet className="w-5 h-5 text-green-600" />
                            <div>
                              <p className="font-medium">Saldo do Cartão</p>
                              <p className="text-xs text-gray-500">Disponível: R$ {account.saldo_reais?.toFixed(2)}</p>
                            </div>
                          </div>
                        </div>
                      </button>

                      <button
                        onClick={() => setPaymentMethod('beauty_coins')}
                        disabled={account.beauty_coins < beautyCoinValue}
                        className={`p-4 border-2 rounded-lg text-left transition-all ${
                          paymentMethod === 'beauty_coins' 
                            ? 'border-[#D4AF37] bg-[#F5EFE6]' 
                            : 'border-gray-200 hover:border-gray-300'
                        } ${account.beauty_coins < beautyCoinValue ? 'opacity-50 cursor-not-allowed' : ''}`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <Coins className="w-5 h-5 text-[#D4AF37]" />
                            <div>
                              <p className="font-medium">Beauty Coins</p>
                              <p className="text-xs text-gray-500">Disponível: {account.beauty_coins || 0} coins</p>
                            </div>
                          </div>
                        </div>
                      </button>

                      <button
                        onClick={() => setPaymentMethod('pix')}
                        className={`p-4 border-2 rounded-lg text-left transition-all ${
                          paymentMethod === 'pix' 
                            ? 'border-[#D4AF37] bg-[#F5EFE6]' 
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <QrCode className="w-5 h-5 text-blue-600" />
                          <div>
                            <p className="font-medium">PIX</p>
                            <p className="text-xs text-gray-500">Pagamento instantâneo</p>
                          </div>
                        </div>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex gap-3">
                <Button onClick={onClose} variant="outline" className="flex-1">
                  Cancelar
                </Button>
                <Button 
                  onClick={handleRegister}
                  disabled={registerMutation.isPending || (!isFree && !paymentMethod)}
                  className="flex-1 bg-gradient-to-r from-[#D4AF37] to-[#C8A882] text-white"
                >
                  {registerMutation.isPending ? 'Processando...' : isFree ? 'Confirmar Inscrição' : 'Confirmar Pagamento'}
                </Button>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}