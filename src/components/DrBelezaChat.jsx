import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

const quickQuestions = [
  {
    question: "Como funciona o Club da Beleza?",
    answer: "O Club da Beleza é uma plataforma que conecta você aos melhores profissionais de estética e beleza, oferecendo descontos exclusivos, programa de pontos e benefícios especiais em nossa rede parceira."
  },
  {
    question: "Quais são os planos disponíveis?",
    answer: "Temos 3 planos: Light (Grátis), Gold (R$ 49,90/mês com 15% desconto) e VIP (R$ 99,90/mês com 25% desconto). Cada um oferece benefícios exclusivos!"
  },
  {
    question: "Como funciona o programa de pontos?",
    answer: "Você acumula pontos a cada serviço ou produto adquirido. Plano Gold ganha 100 pontos/mês e VIP 300 pontos/mês. Os pontos podem ser trocados por serviços gratuitos!"
  },
  {
    question: "O que é o Mapa da Estética?",
    answer: "É nossa plataforma de busca com mais de 500 profissionais verificados em todo Brasil. Você pode buscar por localização, especialidade e ver avaliações reais."
  },
  {
    question: "Como funciona a Beauty Coin?",
    answer: "Beauty Coin é nossa criptomoeda exclusiva que pode ser usada para adquirir produtos e serviços de estética na nossa rede parceira."
  },
  {
    question: "O que é Golden Doctors?",
    answer: "É nossa comunidade exclusiva dos melhores profissionais de estética do Brasil, com certificação de excelência e benefícios premium."
  }
];

export default function DrBelezaChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      type: "bot",
      text: "Olá! Sou o Dr. Beleza 💫 Como posso ajudar você hoje?"
    }
  ]);
  const [inputMessage, setInputMessage] = useState("");

  const handleQuickQuestion = (question, answer) => {
    setMessages(prev => [
      ...prev,
      { type: "user", text: question },
      { type: "bot", text: answer }
    ]);
  };

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;

    const userMessage = inputMessage;
    setMessages(prev => [...prev, { type: "user", text: userMessage }]);
    setInputMessage("");

    // Simulate bot response
    setTimeout(() => {
      setMessages(prev => [
        ...prev,
        {
          type: "bot",
          text: "Obrigado pela sua pergunta! Para respostas mais detalhadas, recomendo visitar nossa página do Dr. Beleza ou falar com nossa equipe através do WhatsApp (31) 97259-5643."
        }
      ]);
    }, 1000);
  };

  return (
    <>
      {/* Chat Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            className="fixed bottom-6 right-6 z-50"
          >
            <Button
              onClick={() => setIsOpen(true)}
              className="w-20 h-20 rounded-full bg-gradient-to-r from-[#D4AF37] to-[#C8A882] hover:from-[#C8A882] hover:to-[#D4AF37] shadow-2xl hover:shadow-3xl transition-all duration-300 group p-0 overflow-hidden border-4 border-white"
            >
              <img 
                src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/690ca5886318e973c6e913bb/9af1641b0_drbeleza.png"
                alt="Dr. Beleza"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform"
              />
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-6 right-6 z-50 w-[90vw] md:w-96 max-h-[600px]"
          >
            <Card className="border-[#E8DCC4] shadow-2xl overflow-hidden bg-white">
              <CardHeader className="bg-gradient-to-r from-[#D4AF37] to-[#C8A882] text-white p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-white rounded-full overflow-hidden border-2 border-white/20">
                      <img 
                        src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/690ca5886318e973c6e913bb/9af1641b0_drbeleza.png"
                        alt="Dr. Beleza"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <CardTitle className="text-lg font-serif">Dr. Beleza</CardTitle>
                      <p className="text-xs text-white/80">Seu assistente virtual</p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsOpen(false)}
                    className="text-white hover:bg-white/20"
                  >
                    <X className="w-5 h-5" />
                  </Button>
                </div>
              </CardHeader>

              <CardContent className="p-0">
                {/* Messages */}
                <div className="h-80 overflow-y-auto p-4 space-y-3 bg-[#F5EFE6]">
                  {messages.map((message, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}
                    >
                      {message.type === "bot" && (
                        <div className="w-8 h-8 rounded-full overflow-hidden mr-2 flex-shrink-0">
                          <img 
                            src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/690ca5886318e973c6e913bb/9af1641b0_drbeleza.png"
                            alt="Dr. Beleza"
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                      <div
                        className={`max-w-[80%] p-3 rounded-2xl ${
                          message.type === "user"
                            ? "bg-gradient-to-r from-[#D4AF37] to-[#C8A882] text-white"
                            : "bg-white text-gray-800 shadow-sm border border-[#E8DCC4]"
                        }`}
                      >
                        <p className="text-sm">{message.text}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Quick Questions */}
                <div className="p-4 border-t border-[#E8DCC4] bg-white">
                  <p className="text-xs text-gray-500 mb-2 font-medium">Perguntas Rápidas:</p>
                  <div className="flex flex-wrap gap-2">
                    {quickQuestions.slice(0, 3).map((item, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        size="sm"
                        onClick={() => handleQuickQuestion(item.question, item.answer)}
                        className="text-xs border-[#E8DCC4] hover:border-[#D4AF37] hover:bg-[#F5EFE6]"
                      >
                        {item.question}
                      </Button>
                    ))}
                  </div>
                  <Link to={createPageUrl("DrBeleza")} onClick={() => setIsOpen(false)}>
                    <Button
                      variant="link"
                      className="text-xs text-[#D4AF37] hover:text-[#C8A882] mt-2 p-0"
                    >
                      Ver todas as perguntas →
                    </Button>
                  </Link>
                </div>

                {/* Input */}
                <div className="p-4 border-t border-[#E8DCC4] bg-white">
                  <div className="flex gap-2">
                    <Input
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                      placeholder="Digite sua mensagem..."
                      className="border-[#E8DCC4] focus:border-[#D4AF37]"
                    />
                    <Button
                      onClick={handleSendMessage}
                      className="bg-gradient-to-r from-[#D4AF37] to-[#C8A882] hover:from-[#C8A882] hover:to-[#D4AF37]"
                    >
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}