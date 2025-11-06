import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { motion } from "framer-motion";
import { 
  Phone, Mail, MapPin, Clock, Send, 
  Sparkles, MessageCircle, Instagram, Facebook
} from "lucide-react";

const contactInfo = [
  {
    icon: Phone,
    title: "Telefone",
    info: "(31) 97259-5643",
    link: "tel:+5531972595643",
    color: "from-[#D4AF37] to-[#C8A882]"
  },
  {
    icon: Mail,
    title: "E-mail",
    info: "contato@clubdabeleza.com",
    link: "mailto:contato@clubdabeleza.com",
    color: "from-[#C8A882] to-[#E8DCC4]"
  },
  {
    icon: MapPin,
    title: "Localização",
    info: "Belo Horizonte, MG",
    color: "from-[#D4AF37] to-[#C8A882]"
  },
  {
    icon: Clock,
    title: "Horário",
    info: "Seg - Sex: 9h às 18h",
    color: "from-[#C8A882] to-[#E8DCC4]"
  }
];

const socialMedia = [
  {
    icon: Instagram,
    name: "Instagram",
    handle: "@clubdabeleza",
    url: "https://instagram.com/clubdabeleza",
    color: "bg-gradient-to-br from-purple-500 to-pink-500"
  },
  {
    icon: Facebook,
    name: "Facebook",
    handle: "/clubdabeleza",
    url: "https://facebook.com/clubdabeleza",
    color: "bg-gradient-to-br from-blue-600 to-blue-400"
  }
];

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: ""
  });

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Contact form submitted:", formData);
    // Here you would handle the actual submission
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-[#F5EFE6] to-white">
      {/* Hero Section */}
      <div className="relative py-20 px-6 overflow-hidden bg-gradient-to-br from-white via-[#F5EFE6] to-[#E8DCC4]">
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 90, 0],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "linear"
            }}
            className="absolute -top-24 -right-24 w-96 h-96 bg-gradient-to-br from-[#D4AF37]/10 to-transparent rounded-full blur-3xl"
          />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center space-y-6"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full border border-[#D4AF37]/20 shadow-lg">
              <MessageCircle className="w-4 h-4 text-[#D4AF37]" />
              <span className="text-sm font-medium text-[#C8A882]">
                Estamos aqui para você
              </span>
            </div>

            <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl font-bold">
              <span className="text-gray-800">Entre em</span>
              <br />
              <span className="bg-gradient-to-r from-[#D4AF37] to-[#C8A882] bg-clip-text text-transparent">
                Contato
              </span>
            </h1>

            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Tire suas dúvidas, envie sugestões ou solicite mais informações. 
              Nossa equipe está pronta para ajudar!
            </p>
          </motion.div>
        </div>
      </div>

      {/* Contact Info Cards */}
      <div className="py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {contactInfo.map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="h-full border-[#E8DCC4] hover:border-[#D4AF37] transition-all duration-300 hover:shadow-xl group text-center bg-white">
                  <CardContent className="p-8 space-y-4">
                    <div className={`w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br ${item.color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                      <item.icon className="w-8 h-8 text-white" />
                    </div>
                    
                    <h3 className="font-serif text-lg font-bold text-gray-800">
                      {item.title}
                    </h3>
                    
                    {item.link ? (
                      <a 
                        href={item.link}
                        className="text-[#C8A882] hover:text-[#D4AF37] font-medium transition-colors block"
                      >
                        {item.info}
                      </a>
                    ) : (
                      <p className="text-gray-600 font-medium">
                        {item.info}
                      </p>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Contact Form and Social */}
      <div className="py-16 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Form */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <Card className="border-[#E8DCC4] shadow-xl bg-white">
                <CardHeader>
                  <CardTitle className="font-serif text-3xl text-gray-800">
                    Envie sua mensagem
                  </CardTitle>
                  <p className="text-gray-600 mt-2">
                    Preencha o formulário e entraremos em contato em breve
                  </p>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-gray-700">Nome Completo</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => handleInputChange("name", e.target.value)}
                        placeholder="Seu nome"
                        className="border-[#E8DCC4] focus:border-[#D4AF37]"
                        required
                      />
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="email" className="text-gray-700">E-mail</Label>
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => handleInputChange("email", e.target.value)}
                          placeholder="seu@email.com"
                          className="border-[#E8DCC4] focus:border-[#D4AF37]"
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="phone" className="text-gray-700">Telefone</Label>
                        <Input
                          id="phone"
                          value={formData.phone}
                          onChange={(e) => handleInputChange("phone", e.target.value)}
                          placeholder="(00) 00000-0000"
                          className="border-[#E8DCC4] focus:border-[#D4AF37]"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="message" className="text-gray-700">Mensagem</Label>
                      <Textarea
                        id="message"
                        value={formData.message}
                        onChange={(e) => handleInputChange("message", e.target.value)}
                        placeholder="Como podemos ajudar?"
                        className="border-[#E8DCC4] focus:border-[#D4AF37] min-h-[150px]"
                        required
                      />
                    </div>

                    <Button
                      type="submit"
                      className="w-full bg-gradient-to-r from-[#D4AF37] to-[#C8A882] hover:from-[#C8A882] hover:to-[#D4AF37] text-white py-6 text-lg font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 group"
                    >
                      Enviar Mensagem
                      <Send className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </motion.div>

            {/* Social & Additional Info */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="space-y-8"
            >
              {/* Social Media */}
              <Card className="border-[#E8DCC4] shadow-xl bg-white">
                <CardHeader>
                  <CardTitle className="font-serif text-2xl text-gray-800">
                    Redes Sociais
                  </CardTitle>
                  <p className="text-gray-600 mt-2">
                    Siga-nos e fique por dentro das novidades
                  </p>
                </CardHeader>
                <CardContent className="space-y-4">
                  {socialMedia.map((social, index) => (
                    <a
                      key={social.name}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-4 p-4 rounded-xl border-2 border-[#E8DCC4] hover:border-[#D4AF37] transition-all duration-300 hover:shadow-md group"
                    >
                      <div className={`w-12 h-12 rounded-xl ${social.color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                        <social.icon className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-800">{social.name}</h4>
                        <p className="text-sm text-gray-600">{social.handle}</p>
                      </div>
                      <Send className="w-5 h-5 text-[#C8A882] group-hover:translate-x-1 transition-transform" />
                    </a>
                  ))}
                </CardContent>
              </Card>

              {/* WhatsApp Direct */}
              <Card className="border-[#E8DCC4] shadow-xl bg-gradient-to-br from-green-50 to-white">
                <CardContent className="p-8 text-center space-y-4">
                  <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center shadow-lg">
                    <MessageCircle className="w-8 h-8 text-white" />
                  </div>
                  
                  <div>
                    <h3 className="font-serif text-2xl font-bold text-gray-800 mb-2">
                      Atendimento via WhatsApp
                    </h3>
                    <p className="text-gray-600">
                      Converse conosco em tempo real
                    </p>
                  </div>

                  <a href="https://wa.me/5531972595643" target="_blank" rel="noopener noreferrer">
                    <Button 
                      size="lg"
                      className="bg-green-500 hover:bg-green-600 text-white shadow-xl hover:shadow-2xl transition-all duration-300 px-8 py-6 text-lg font-semibold"
                    >
                      <Phone className="w-5 h-5 mr-2" />
                      (31) 97259-5643
                    </Button>
                  </a>
                </CardContent>
              </Card>

              {/* Image */}
              <div className="relative rounded-3xl overflow-hidden shadow-2xl">
                <img
                  src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/user_68ca933db3f173d5b5ee5174/424de1767_clubeimg.jpeg"
                  alt="Club da Beleza"
                  className="w-full h-64 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent flex items-end p-6">
                  <p className="text-white font-serif text-xl">
                    Estamos aqui para você! 💫
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}