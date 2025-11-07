
import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, Sparkles, HelpCircle, Play, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

const quickQuestions = [
  {
    question: "Como funciona o Club da Beleza?",
    answer: "O Club da Beleza é uma plataforma que conecta você aos melhores profissionais de estética e beleza, oferecendo descontos exclusivos, programa de pontos e benefícios especiais em nossa rede parceira."
  },
  {
    question: "Quais procedimentos para simetria facial?",
    answer: "Para aumentar a simetria do rosto, os procedimentos mais indicados são:\n\n• Harmonização Facial (HOF)\n• Preenchimento com Ácido Hialurônico\n• Toxina Botulínica (Botox)\n• Bioestimuladores de Colágeno\n• Fios de Sustentação\n\nCategoria: Harmonização Facial\n\nVocê pode encontrar profissionais especializados no Mapa da Estética!"
  },
  {
    question: "Como modificar o nariz sem cirurgia?",
    answer: "Para modificar o nariz (tamanho e estrutura) sem cirurgia, você pode optar por:\n\n• Rinomodelação (preenchimento nasal)\n• Harmonização Nasal\n• Fios de Sustentação\n• Toxina Botulínica para ponta nasal\n\nPara mudanças mais significativas:\n• Rinoplastia (cirurgia plástica)\n\nCategoria: Harmonização Facial e Cirurgia Plástica\n\nPesquise profissionais qualificados no Mapa da Estética!"
  },
  {
    question: "Tratamentos para rejuvenescimento facial",
    answer: "Os melhores tratamentos para rejuvenescimento facial incluem:\n\n• Toxina Botulínica (Botox)\n• Preenchimento Facial\n• Bioestimuladores de Colágeno\n• Skinbooster\n• Peeling Químico\n• Laser CO2 Fracionado\n• Microagulhamento\n• Radiofrequência Facial\n\nCategoria: Estética Facial\n\nEncontre especialistas no Mapa da Estética!"
  },
  {
    question: "Procedimentos para papada e contorno",
    answer: "Para reduzir papada e melhorar o contorno facial:\n\n• Criolipólise de Papada\n• Lipo Enzimática\n• Radiofrequência\n• Ultrassom Microfocado (HIFU)\n• Harmonização de Mandíbula\n• Fios de Sustentação\n• Lipoaspiração de Papada (cirúrgico)\n\nCategoria: Estética Corporal e Harmonização\n\nBusque profissionais no Mapa da Estética!"
  },
  {
    question: "Tratamentos para manchas e melasma",
    answer: "Para tratar manchas e melasma:\n\n• Peeling Químico\n• Laser Q-Switched\n• Luz Intensa Pulsada (IPL)\n• Microagulhamento\n• Tratamento com Ácidos\n• Clareadores Tópicos\n• Skinbooster Clareador\n\nCategoria: Dermatologia e Estética Facial\n\nImportante: Sempre use protetor solar!\n\nEncontre dermatologistas no Mapa da Estética!"
  }
];

const tutorialSteps = [
  {
    id: 1,
    title: "Bem-vindo ao Club da Beleza!",
    description: "Vou te mostrar como usar nossa plataforma. Clique em 'Próximo' para continuar.",
    target: null,
    position: "center"
  },
  {
    id: 2,
    title: "Menu de Navegação",
    description: "Aqui você encontra todas as seções do Club da Beleza. Use o menu para navegar entre as páginas.",
    target: "sidebar", // Assuming a sidebar with data-tutorial="sidebar"
    position: "right"
  },
  {
    id: 3,
    title: "Meu Perfil",
    description: "Acesse seu perfil para ver suas informações, planoa ctual e benefícios disponíveis.",
    target: "MeuPerfil", // Assuming a link with href containing "MeuPerfil" or data-tutorial="nav-MeuPerfil"
    position: "right"
  },
  {
    id: 4,
    title: "Mapa da Estética",
    description: "Encontre profissionais certificados perto de você. Busque por especialidade e localização.",
    target: "MapaDaEstetica", // Assuming a link with href containing "MapaDaEstetica" or data-tutorial="nav-MapaDaEstetica"
    position: "right"
  },
  {
    id: 5,
    title: "Dr. Beleza",
    description: "Use minha página para buscar tratamentos, fazer perguntas e obter recomendações personalizadas.",
    target: "DrBeleza", // Assuming a link with href containing "DrBeleza" or data-tutorial="nav-DrBeleza"
    position: "right"
  },
  {
    id: 6,
    title: "Beauty Coin",
    description: "Conheça nossa criptomoeda exclusiva e descubra como usá-la para adquirir produtos e serviços.",
    target: "BeautyCoin", // Assuming a link with href containing "BeautyCoin" or data-tutorial="nav-BeautyCoin"
    position: "right"
  },
  {
    id: 7,
    title: "Pronto!",
    description: "Agora você já conhece o básico! Explore a plataforma e aproveite todos os benefícios. Estou sempre aqui para ajudar!",
    target: null,
    position: "center"
  }
];

export default function DrBelezaChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      type: "bot",
      text: "Olá! Sou o Dr. Beleza 💫\n\nEstou aqui para te ajudar com dúvidas sobre procedimentos estéticos, tratamentos e muito mais!\n\nO que você gostaria de saber?"
    }
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const chatRef = useRef(null);
  const messagesEndRef = useRef(null);

  const [showTutorial, setShowTutorial] = useState(false);
  const [tutorialStep, setTutorialStep] = useState(0);
  const [highlightedElement, setHighlightedElement] = useState(null);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Handle click outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (chatRef.current && !chatRef.current.contains(event.target) && isOpen) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const startTutorial = () => {
    setShowTutorial(true);
    setTutorialStep(0);
    setIsOpen(false);
  };

  const nextTutorialStep = () => {
    if (tutorialStep < tutorialSteps.length - 1) {
      const nextStep = tutorialStep + 1;
      setTutorialStep(nextStep);
      
      const step = tutorialSteps[nextStep];
      if (step.target) {
        scrollToElement(step.target);
      } else {
        // If no specific target, just ensure general scroll
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } else {
      endTutorial();
    }
  };

  const endTutorial = () => {
    setShowTutorial(false);
    setTutorialStep(0);
    setHighlightedElement(null);
    setIsOpen(true);
  };

  const scrollToElement = (targetId) => {
    setTimeout(() => {
      // Prioritize data-tutorial attribute, then href containing the targetId
      let element = document.querySelector(`[data-tutorial="${targetId}"]`);
      if (!element) {
        // Fallback for links if data-tutorial is not present
        const links = document.querySelectorAll('a');
        for (const link of links) {
          if (link.href && link.href.includes(targetId)) {
            element = link;
            break;
          }
        }
      }

      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        setHighlightedElement(targetId);
        
        // Add highlight animation
        element.classList.add('tutorial-highlight');
        setTimeout(() => {
          element.classList.remove('tutorial-highlight');
        }, 2000); // Highlight for 2 seconds
      } else {
        // If element not found, just scroll to top for context
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }, 100); // Small delay to allow potential DOM updates or page transitions
  };

  const handleQuickQuestion = (question, answer) => {
    setMessages(prev => [
      ...prev,
      { type: "user", text: question },
      { type: "bot", text: answer }
    ]);
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage = inputMessage;
    setMessages(prev => [...prev, { type: "user", text: userMessage }]);
    setInputMessage("");

    // Simulate intelligent response
    setTimeout(() => {
      let response = "";
      const msgLower = userMessage.toLowerCase();

      // Check for specific keywords and provide intelligent responses
      if (msgLower.includes("simetria") || msgLower.includes("simetrico") || msgLower.includes("assimetria")) {
        response = "Para melhorar a simetria facial, recomendo:\n\n• Harmonização Facial (HOF)\n• Preenchimento com Ácido Hialurônico\n• Toxina Botulínica\n• Fios de Sustentação\n\nCategoria: Harmonização Facial\n\nProcure por profissionais especializados no Mapa da Estética! 📍";
      } else if (msgLower.includes("nariz") || msgLower.includes("rinomodelação") || msgLower.includes("rinoplastia")) {
        response = "Para modificar o nariz:\n\n**Sem cirurgia:**\n• Rinomodelação\n• Harmonização Nasal\n• Fios de Sustentação\n\n**Com cirurgia:**\n• Rinoplastia\n\nCategoria: Harmonização Facial / Cirurgia Plástica\n\nEncontre especialistas no Mapa da Estética! 📍";
      } else if (msgLower.includes("rejuvenescimento") || msgLower.includes("rugas") || msgLower.includes("envelhecimento")) {
        response = "Para rejuvenescimento facial:\n\n• Toxina Botulínica (Botox)\n• Preenchimento Facial\n• Bioestimuladores\n• Skinbooster\n• Peeling Químico\n• Laser\n\nCategoria: Estética Facial\n\nBusque profissionais no Mapa da Estética! 📍";
      } else if (msgLower.includes("papada") || msgLower.includes("queixo") || msgLower.includes("contorno")) {
        response = "Para tratar papada e contorno:\n\n• Criolipólise\n• Lipo Enzimática\n• Radiofrequência\n• HIFU\n• Harmonização de Mandíbula\n\nCategoria: Estética Corporal\n\nPesquise no Mapa da Estética! 📍";
      } else if (msgLower.includes("mancha") || msgLower.includes("melasma") || msgLower.includes("clareamento")) {
        response = "Para manchas e melasma:\n\n• Peeling Químico\n• Laser Q-Switched\n• IPL\n• Microagulhamento\n• Ácidos Clareadores\n\nCategoria: Dermatologia\n\nEncontre dermatologistas no Mapa da Estética! 📍";
      } else if (msgLower.includes("acne") || msgLower.includes("espinha") || msgLower.includes("oleosidade")) {
        response = "Para tratamento de acne:\n\n• Limpeza de Pele Profunda\n• Peeling Químico\n• Laser\n• Microagulhamento\n• Tratamento com Ácidos\n\nCategoria: Dermatologia / Estética Facial\n\nBusque especialistas no Mapa da Estética! 📍";
      } else if (msgLower.includes("celulite") || msgLower.includes("estria") || msgLower.includes("flacidez")) {
        response = "Para celulite, estrias e flacidez:\n\n• Radiofrequência\n• Ondas de Choque\n• Subcisão\n• Carboxiterapia\n• Endermologia\n• Massagem Modeladora\n\nCategoria: Estética Corporal\n\nEncontre profissionais no Mapa da Estética! 📍";
      } else if (msgLower.includes("gordura") || msgLower.includes("emagrecer") || msgLower.includes("gordura localizada")) {
        response = "Para redução de gordura:\n\n• Criolipólise\n• Lipo Enzimática\n• Ultracavitação\n• Radiofrequência\n• Carboxiterapia\n• Lipoaspiração (cirúrgico)\n\nCategoria: Estética Corporal\n\nPesquise profissionais no Mapa da Estética! 📍";
      } else {
        response = "Obrigado pela sua pergunta! 😊\n\nPara respostas mais específicas e personalizadas, recomendo:\n\n1. Usar a busca do Dr. Beleza na página principal\n2. Explorar o Mapa da Estética para encontrar profissionais especializados\n3. Entrar em contato conosco pelo WhatsApp: (31) 97259-5643\n\nEstou sempre aqui para ajudar! 💫";
      }

      setMessages(prev => [
        ...prev,
        { type: "bot", text: response }
      ]);
    }, 1000);
  };

  return (
    <>
      <style>{`
        .tutorial-highlight {
          animation: pulse-highlight 2s ease-in-out;
          position: relative;
          z-index: 9999; /* Ensure highlighted element is on top */
        }
        
        @keyframes pulse-highlight {
          0% {
            box-shadow: 0 0 0 0 rgba(212, 175, 55, 0.7);
            outline: 2px solid rgba(212, 175, 55, 0.7);
            border-radius: 0.5rem; /* Adjust based on element's border-radius */
          }
          50% {
            box-shadow: 0 0 0 20px rgba(212, 175, 55, 0);
            outline: 2px solid rgba(212, 175, 55, 0);
          }
          100% {
            box-shadow: 0 0 0 0 rgba(212, 175, 55, 0.7);
            outline: 2px solid rgba(212, 175, 55, 0.7);
          }
        }
      `}</style>

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
            ref={chatRef}
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
                        <p className="text-sm whitespace-pre-line">{message.text}</p>
                      </div>
                    </motion.div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>

                {/* Quick Questions */}
                <div className="p-4 border-t border-[#E8DCC4] bg-white">
                  <p className="text-xs text-gray-500 mb-2 font-medium">Perguntas Rápidas:</p>
                  <div className="flex flex-wrap gap-2 mb-3 max-h-32 overflow-y-auto">
                    {quickQuestions.map((item, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        size="sm"
                        onClick={() => handleQuickQuestion(item.question, item.answer)}
                        className="text-xs border-[#E8DCC4] hover:border-[#D4AF37] hover:bg-[#F5EFE6] whitespace-normal h-auto py-2"
                      >
                        {item.question}
                      </Button>
                    ))}
                  </div>

                  <Button
                    onClick={startTutorial}
                    variant="outline"
                    size="sm"
                    className="w-full text-xs border-[#D4AF37] text-[#D4AF37] hover:bg-[#F5EFE6] mb-2"
                  >
                    <Play className="w-3 h-3 mr-2" />
                    Iniciar Tutorial
                  </Button>

                  <Link to={createPageUrl("DrBeleza")} onClick={() => setIsOpen(false)} className="block w-full">
                    <Button
                      variant="link"
                      className="text-xs text-[#D4AF37] hover:text-[#C8A882] p-0 w-full"
                    >
                      Buscar profissionais no Mapa da Estética →
                    </Button>
                  </Link>
                </div>

                {/* Input */}
                <div className="p-4 border-t border-[#E8DCC4] bg-white">
                  <div className="flex gap-2">
                    <Input
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          handleSendMessage();
                        }
                      }}
                      placeholder="Digite sua mensagem..."
                      className="border-[#E8DCC4] focus:border-[#D4AF37]"
                    />
                    <Button
                      onClick={handleSendMessage}
                      disabled={!inputMessage.trim()}
                      className="bg-gradient-to-r from-[#D4AF37] to-[#C8A882] hover:from-[#C8A882] hover:to-[#D4AF37] disabled:opacity-50"
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

      {/* Tutorial Overlay */}
      <AnimatePresence>
        {showTutorial && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 z-[60] flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden"
            >
              <div className="bg-gradient-to-r from-[#D4AF37] to-[#C8A882] p-6 relative">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full overflow-hidden flex-shrink-0">
                    <img 
                      src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/690ca5886318e973c6e913bb/9af1641b0_drbeleza.png"
                      alt="Dr. Beleza"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="text-white flex-1">
                    <p className="text-sm opacity-90">Tutorial - Passo {tutorialStep + 1} de {tutorialSteps.length}</p>
                    <h3 className="font-serif text-2xl font-bold">
                      {tutorialSteps[tutorialStep].title}
                    </h3>
                  </div>
                </div>
              </div>

              <div className="p-8 space-y-6">
                <p className="text-gray-700 text-lg leading-relaxed">
                  {tutorialSteps[tutorialStep].description}
                </p>

                <div className="flex gap-3">
                  {tutorialStep > 0 && (
                    <Button
                      onClick={() => setTutorialStep(tutorialStep - 1)}
                      variant="outline"
                      className="flex-1"
                    >
                      Voltar
                    </Button>
                  )}
                  
                  <Button
                    onClick={nextTutorialStep}
                    className="flex-1 bg-gradient-to-r from-[#D4AF37] to-[#C8A882] text-white group"
                  >
                    {tutorialStep === tutorialSteps.length - 1 ? (
                      <>Pronto!</>
                    ) : (
                      <>
                        Próximo
                        <ChevronRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </Button>
                </div>

                <Button
                  onClick={endTutorial}
                  variant="ghost"
                  size="sm"
                  className="w-full text-gray-500"
                >
                  Pular Tutorial
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
