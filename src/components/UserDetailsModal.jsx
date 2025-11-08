import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import {
  X, Mail, Phone, MapPin, Calendar, User,
  MessageCircle, Send, Crown, Coins, Star
} from "lucide-react";

export default function UserDetailsModal({ user, onClose }) {
  const handleWhatsApp = () => {
    const phone = (user.whatsapp || user.telefone || '').replace(/\D/g, '');
    if (phone) {
      window.open(`https://wa.me/${phone}`, '_blank');
    } else {
      alert('Número de WhatsApp não disponível');
    }
  };

  const handleGmail = () => {
    window.open(`https://mail.google.com/mail/?view=cm&fs=1&to=${user.email}`, '_blank');
  };

  const handleOutlook = () => {
    window.open(`https://outlook.office.com/mail/deeplink/compose?to=${user.email}`, '_blank');
  };

  const handleDefaultEmail = () => {
    window.location.href = `mailto:${user.email}`;
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="max-w-3xl w-full"
      >
        <Card className="border-[#E8DCC4] shadow-2xl max-h-[90vh] overflow-y-auto">
          <CardHeader className="bg-gradient-to-r from-[#D4AF37] to-[#C8A882] text-white">
            <div className="flex items-center justify-between">
              <CardTitle className="font-serif text-2xl">
                Detalhes do Usuário
              </CardTitle>
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="text-white hover:bg-white/20"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>
          </CardHeader>

          <CardContent className="p-8 space-y-8">
            {/* Personal Info */}
            <div className="space-y-4">
              <h3 className="font-serif text-xl font-bold text-gray-800 flex items-center gap-2">
                <User className="w-5 h-5 text-[#D4AF37]" />
                Informações Pessoais
              </h3>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-4 bg-[#F5EFE6] rounded-lg">
                  <p className="text-xs text-gray-600 mb-1">Nome Completo</p>
                  <p className="font-semibold text-gray-800">{user.full_name}</p>
                </div>

                <div className="p-4 bg-[#F5EFE6] rounded-lg">
                  <p className="text-xs text-gray-600 mb-1">Email</p>
                  <p className="font-semibold text-gray-800">{user.email}</p>
                </div>

                {user.telefone && (
                  <div className="p-4 bg-[#F5EFE6] rounded-lg">
                    <p className="text-xs text-gray-600 mb-1">Telefone</p>
                    <p className="font-semibold text-gray-800">{user.telefone}</p>
                  </div>
                )}

                {user.whatsapp && (
                  <div className="p-4 bg-[#F5EFE6] rounded-lg">
                    <p className="text-xs text-gray-600 mb-1">WhatsApp</p>
                    <p className="font-semibold text-gray-800">{user.whatsapp}</p>
                  </div>
                )}

                {user.cpf && (
                  <div className="p-4 bg-[#F5EFE6] rounded-lg">
                    <p className="text-xs text-gray-600 mb-1">CPF</p>
                    <p className="font-semibold text-gray-800">{user.cpf}</p>
                  </div>
                )}

                {user.data_nascimento && (
                  <div className="p-4 bg-[#F5EFE6] rounded-lg">
                    <p className="text-xs text-gray-600 mb-1">Data de Nascimento</p>
                    <p className="font-semibold text-gray-800">
                      {new Date(user.data_nascimento).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                )}

                <div className="p-4 bg-[#F5EFE6] rounded-lg">
                  <p className="text-xs text-gray-600 mb-1">Membro desde</p>
                  <p className="font-semibold text-gray-800">
                    {new Date(user.created_date).toLocaleDateString('pt-BR')}
                  </p>
                </div>

                <div className="p-4 bg-[#F5EFE6] rounded-lg">
                  <p className="text-xs text-gray-600 mb-1">Tipo de Usuário</p>
                  <Badge className="bg-blue-100 text-blue-800">
                    {user.tipo_usuario || 'visitante'}
                  </Badge>
                </div>
              </div>

              {user.endereco && (
                <div className="p-4 bg-[#F5EFE6] rounded-lg">
                  <p className="text-xs text-gray-600 mb-1">Endereço</p>
                  <p className="font-semibold text-gray-800">
                    {user.endereco}
                    {user.cidade && `, ${user.cidade}`}
                    {user.estado && ` - ${user.estado}`}
                    {user.cep && ` - CEP: ${user.cep}`}
                  </p>
                </div>
              )}
            </div>

            {/* Plans & Benefits */}
            <div className="space-y-4">
              <h3 className="font-serif text-xl font-bold text-gray-800 flex items-center gap-2">
                <Crown className="w-5 h-5 text-[#D4AF37]" />
                Planos e Benefícios
              </h3>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-4 bg-[#F5EFE6] rounded-lg">
                  <p className="text-xs text-gray-600 mb-2">Club da Beleza</p>
                  <Badge className={
                    user.clube_plano === 'vip' ? 'bg-gradient-to-r from-purple-600 to-purple-800 text-white' :
                    user.clube_plano === 'gold' ? 'bg-gradient-to-r from-[#D4AF37] to-[#C8A882] text-white' :
                    user.clube_plano === 'light' ? 'bg-blue-100 text-blue-800' :
                    'bg-gray-200 text-gray-700'
                  }>
                    {user.clube_plano === 'none' ? 'Nenhum' : user.clube_plano?.toUpperCase()}
                  </Badge>
                </div>

                <div className="p-4 bg-[#F5EFE6] rounded-lg">
                  <p className="text-xs text-gray-600 mb-2">Beauty Club (Clube+)</p>
                  <Badge className={
                    user.beauty_club_plano === 'exclusive' ? 'bg-pink-100 text-pink-800' :
                    user.beauty_club_plano === 'pro' ? 'bg-indigo-100 text-indigo-800' :
                    user.beauty_club_plano === 'basic' ? 'bg-green-100 text-green-800' :
                    'bg-gray-200 text-gray-700'
                  }>
                    {user.beauty_club_plano === 'none' ? 'Nenhum' : user.beauty_club_plano?.toUpperCase()}
                  </Badge>
                </div>

                <div className="p-4 bg-[#F5EFE6] rounded-lg">
                  <p className="text-xs text-gray-600 mb-2">EdBeauty</p>
                  <Badge className={
                    user.edbeauty_plano === 'premium' ? 'bg-orange-100 text-orange-800' :
                    user.edbeauty_plano === 'pro' ? 'bg-indigo-100 text-indigo-800' :
                    user.edbeauty_plano === 'basic' ? 'bg-green-100 text-green-800' :
                    'bg-gray-200 text-gray-700'
                  }>
                    {user.edbeauty_plano === 'none' ? 'Nenhum' : user.edbeauty_plano?.toUpperCase()}
                  </Badge>
                </div>

                <div className="p-4 bg-[#F5EFE6] rounded-lg">
                  <p className="text-xs text-gray-600 mb-2">Golden Doctors</p>
                  <Badge className={user.is_golden_doctor ? 'bg-gradient-to-r from-[#D4AF37] to-[#C8A882] text-white' : 'bg-gray-200 text-gray-700'}>
                    {user.is_golden_doctor ? '✓ MEMBRO' : '✗ Não membro'}
                  </Badge>
                </div>

                <div className="p-4 bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg border-2 border-orange-200">
                  <div className="flex items-center gap-2 mb-1">
                    <Star className="w-4 h-4 text-orange-600" />
                    <p className="text-xs text-orange-700 font-semibold">Pontos do Clube</p>
                  </div>
                  <p className="text-2xl font-bold text-orange-800">{user.pontos_clube || 0}</p>
                </div>

                <div className="p-4 bg-gradient-to-br from-[#F5EFE6] to-[#E8DCC4] rounded-lg border-2 border-[#D4AF37]">
                  <div className="flex items-center gap-2 mb-1">
                    <Coins className="w-4 h-4 text-[#D4AF37]" />
                    <p className="text-xs text-[#C8A882] font-semibold">Beauty Coins</p>
                  </div>
                  <p className="text-2xl font-bold text-[#D4AF37]">{user.beauty_coins || 0}</p>
                </div>
              </div>
            </div>

            {/* Contact Actions */}
            <div className="space-y-4">
              <h3 className="font-serif text-xl font-bold text-gray-800 flex items-center gap-2">
                <Send className="w-5 h-5 text-[#D4AF37]" />
                Contato Rápido
              </h3>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <Button
                  onClick={handleWhatsApp}
                  className="bg-green-500 hover:bg-green-600 text-white"
                >
                  <MessageCircle className="w-4 h-4 mr-2" />
                  WhatsApp
                </Button>

                <Button
                  onClick={handleGmail}
                  className="bg-red-500 hover:bg-red-600 text-white"
                >
                  <Mail className="w-4 h-4 mr-2" />
                  Gmail
                </Button>

                <Button
                  onClick={handleOutlook}
                  className="bg-blue-500 hover:bg-blue-600 text-white"
                >
                  <Mail className="w-4 h-4 mr-2" />
                  Outlook
                </Button>

                <Button
                  onClick={handleDefaultEmail}
                  variant="outline"
                  className="border-[#E8DCC4]"
                >
                  <Mail className="w-4 h-4 mr-2" />
                  Email
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}