import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Coins, QrCode, CheckCircle, Clock, Plus, Minus, ShoppingCart } from "lucide-react";
import { motion } from "framer-motion";

const PRESET_AMOUNTS = [1, 5, 10, 50, 100, 1000];
const COIN_PRICE = 0.10; // R$ 0,10 por Beauty Coin

export default function BuyBeautyCoinModal({ isOpen, onClose }) {
  const [amount, setAmount] = useState(10);
  const [pixCode, setPixCode] = useState('');
  const [expiresAt, setExpiresAt] = useState(null);
  const [timeLeft, setTimeLeft] = useState(60);
  const [transactionId, setTransactionId] = useState(null);
  const queryClient = useQueryClient();

  const { data: user } = useQuery({
    queryKey: ['current-user-buy-coins'],
    queryFn: () => base44.auth.me(),
    enabled: isOpen
  });

  const generatePixMutation = useMutation({
    mutationFn: async () => {
      const qrCode = `BEAUTYCOIN${Date.now()}${Math.random().toString(36).substr(2, 15).toUpperCase()}`;
      const expiration = new Date(Date.now() + 60000);
      const valorTotal = amount * COIN_PRICE;
      
      // Create a generic transaction record
      const transaction = await base44.entities.PixTransaction.create({
        conta_id: user?.id || 'guest',
        qr_code: qrCode,
        valor: valorTotal,
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

      // Update user's beauty coins
      if (user) {
        await base44.auth.updateMe({
          beauty_coins: (user.beauty_coins || 0) + amount
        });

        // Update card account if exists
        try {
          const accounts = await base44.entities.CardAccount.filter({ user_email: user.email });
          if (accounts.length > 0) {
            await base44.entities.CardAccount.update(accounts[0].id, {
              beauty_coins: (accounts[0].beauty_coins || 0) + amount
            });
          }
        } catch (e) {}
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['current-user-buy-coins']);
      queryClient.invalidateQueries(['current-card-account']);
      alert(`${amount} Beauty Coins adicionados com sucesso!`);
      handleReset();
      onClose();
    }
  });

  useEffect(() => {
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
    if (!user) {
      alert('Faça login para comprar Beauty Coins');
      return;
    }
    if (amount <= 0) {
      alert('Selecione uma quantidade válida');
      return;
    }
    generatePixMutation.mutate();
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(pixCode);
    alert('Código PIX copiado!');
  };

  const handleReset = () => {
    setPixCode('');
    setExpiresAt(null);
    setTimeLeft(60);
    setTransactionId(null);
  };

  const handleClose = () => {
    handleReset();
    onClose();
  };

  const totalPrice = (amount * COIN_PRICE).toFixed(2);

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-serif flex items-center gap-2">
            <Coins className="w-6 h-6 text-[#D4AF37]" />
            Comprar Beauty Coins
          </DialogTitle>
        </DialogHeader>

        {!pixCode ? (
          <div className="space-y-6">
            <div className="bg-gradient-to-br from-[#F5EFE6] to-[#E8DCC4] rounded-lg p-6 space-y-4">
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-2">Você está comprando</p>
                <div className="flex items-center justify-center gap-2">
                  <Coins className="w-8 h-8 text-[#D4AF37]" />
                  <span className="text-5xl font-bold text-[#D4AF37]">{amount}</span>
                </div>
                <p className="text-xl font-semibold text-gray-800 mt-2">Beauty Coins</p>
                <p className="text-3xl font-bold text-gray-900 mt-4">R$ {totalPrice}</p>
                <p className="text-xs text-gray-500 mt-1">R$ {COIN_PRICE.toFixed(2)} por coin</p>
              </div>
            </div>

            <div>
              <p className="text-sm font-medium text-gray-700 mb-3">Quantidade</p>
              <div className="grid grid-cols-3 gap-3 mb-4">
                {PRESET_AMOUNTS.map((preset) => (
                  <button
                    key={preset}
                    onClick={() => setAmount(preset)}
                    className={`p-4 rounded-lg border-2 transition-all font-bold ${
                      amount === preset
                        ? 'border-[#D4AF37] bg-[#F5EFE6] text-[#D4AF37]'
                        : 'border-gray-200 text-gray-600 hover:border-[#D4AF37]'
                    }`}
                  >
                    {preset}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => setAmount(Math.max(1, amount - 1))}
                  className="border-[#D4AF37] text-[#D4AF37]"
                >
                  <Minus className="w-4 h-4" />
                </Button>
                
                <Input
                  type="number"
                  min="1"
                  value={amount}
                  onChange={(e) => setAmount(Math.max(1, parseInt(e.target.value) || 1))}
                  className="text-center text-xl font-bold border-[#D4AF37] focus:border-[#C8A882]"
                />
                
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => setAmount(amount + 1)}
                  className="border-[#D4AF37] text-[#D4AF37]"
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {!user && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-center">
                <p className="text-yellow-800 font-medium">Você precisa estar logado para comprar Beauty Coins</p>
              </div>
            )}

            <Button
              onClick={handleGenerate}
              disabled={generatePixMutation.isPending || !user}
              className="w-full bg-gradient-to-r from-[#D4AF37] to-[#C8A882] text-white py-6 text-lg font-semibold"
            >
              {generatePixMutation.isPending ? 'Gerando...' : (
                <>
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  Gerar QR Code PIX
                </>
              )}
            </Button>

            <p className="text-xs text-gray-500 text-center">
              O código PIX será válido por 1 minuto após a geração
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-gradient-to-br from-[#D4AF37] to-[#C8A882] p-6 rounded-lg text-center text-white space-y-2"
            >
              <div className="flex items-center justify-center gap-2">
                <Coins className="w-6 h-6" />
                <span className="text-2xl font-bold">{amount} Beauty Coins</span>
              </div>
              <p className="text-3xl font-bold">R$ {totalPrice}</p>
            </motion.div>

            <div className="bg-gray-50 border-2 border-[#D4AF37] rounded-lg p-6 space-y-4">
              <div className="flex items-center justify-center">
                <QrCode className="w-40 h-40 text-gray-800" />
              </div>

              <div className="bg-white p-4 rounded border border-gray-200">
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
                <motion.div
                  animate={{ scale: timeLeft <= 10 ? [1, 1.05, 1] : 1 }}
                  transition={{ duration: 0.5, repeat: timeLeft <= 10 ? Infinity : 0 }}
                  className={`inline-flex items-center gap-2 px-6 py-3 rounded-full ${
                    timeLeft > 30 ? 'bg-green-100 text-green-800' :
                    timeLeft > 10 ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}
                >
                  <Clock className="w-5 h-5" />
                  <span className="font-mono font-bold text-xl">{timeLeft}s</span>
                </motion.div>
                <p className="text-xs text-gray-500 mt-2">Tempo restante para pagamento</p>
              </div>
            </div>

            <div className="space-y-3">
              <Button
                onClick={() => confirmPaymentMutation.mutate()}
                disabled={confirmPaymentMutation.isPending}
                className="w-full bg-green-600 hover:bg-green-700 text-white py-6 text-lg font-semibold"
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

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-800 text-center">
                <strong>Importante:</strong> Após realizar o pagamento no seu banco, clique em "Confirmar Pagamento" para receber suas Beauty Coins imediatamente.
              </p>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}