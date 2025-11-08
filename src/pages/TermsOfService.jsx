import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { FileText, Shield, CheckCircle, AlertTriangle, Users, CreditCard, Lock } from "lucide-react";

const sections = [
  {
    icon: FileText,
    title: "1. Aceitação dos Termos",
    content: `Ao acessar e usar a plataforma Club da Beleza, você concorda com estes Termos de Uso. 
    Se você não concorda com qualquer parte destes termos, não deve usar nossa plataforma.

**Capacidade Legal:**
- Você deve ter pelo menos 18 anos de idade
- Ou ter autorização de responsável legal
- Capacidade legal para celebrar contratos vinculativos

**Atualizações:**
- Reservamo-nos o direito de modificar estes termos
- Você será notificado sobre mudanças significativas
- Uso continuado implica aceitação das modificações`
  },
  {
    icon: Users,
    title: "2. Cadastro e Conta",
    content: `**Criação de Conta:**
- Você deve fornecer informações precisas e completas
- É responsável por manter a confidencialidade da sua senha
- Não compartilhe suas credenciais de acesso
- Notifique-nos imediatamente sobre uso não autorizado

**Tipos de Conta:**
- **Visitante:** Acesso limitado à visualização de conteúdo
- **Paciente:** Acesso a serviços e benefícios para pacientes
- **Profissional:** Capacidade de oferecer serviços e conteúdo

**Responsabilidades:**
- Manter informações de contato atualizadas
- Não criar múltiplas contas sem autorização
- Não usar a conta de outra pessoa
- Respeitar os direitos de outros usuários`
  },
  {
    icon: CreditCard,
    title: "3. Planos e Pagamentos",
    content: `**Planos Disponíveis:**

**Club da Beleza:**
- Light: R$ 1,00/dia
- Gold: 12x de R$ 397 (de R$ 997)
- VIP: Sob consulta

**Beauty Club (Clube+):**
- Basic, Pro, Exclusive (valores a definir)

**EdBeauty:**
- Basic, Pro, Premium (para profissionais)

**Condições de Pagamento:**
- Pagamentos processados por sistemas seguros
- Renovação automática (quando aplicável)
- Possibilidade de cancelamento a qualquer momento
- Sem reembolso para períodos já utilizados (salvo exceções legais)

**Taxas e Impostos:**
- Preços incluem impostos aplicáveis
- Podemos ajustar preços mediante notificação prévia
- Promoções sujeitas a termos específicos`
  },
  {
    icon: CheckCircle,
    title: "4. Uso Aceitável",
    content: `Você concorda em NÃO:

**Atividades Proibidas:**
- Violar leis ou regulamentos aplicáveis
- Infringir direitos de propriedade intelectual
- Transmitir conteúdo ofensivo, difamatório ou ilegal
- Enviar spam ou comunicações não solicitadas
- Usar a plataforma para fraudes ou esquemas
- Tentar acessar áreas restritas sem autorização
- Fazer engenharia reversa ou copiar o sistema

**Conteúdo do Usuário:**
- Você é responsável pelo conteúdo que publica
- Concede-nos licença para usar, exibir e distribuir seu conteúdo
- Garantimos que você possui direitos sobre o conteúdo
- Podemos remover conteúdo que viole estes termos

**Profissionais:**
- Devem possuir qualificações e licenças necessárias
- São responsáveis pelos serviços prestados
- Devem seguir código de ética profissional
- Informações prestadas devem ser precisas`
  },
  {
    icon: Shield,
    title: "5. Propriedade Intelectual",
    content: `**Direitos do Club da Beleza:**
- Todo conteúdo da plataforma é protegido por direitos autorais
- Marcas, logos e design são propriedade exclusiva
- Não é permitido copiar, modificar ou distribuir sem autorização
- Software e código-fonte são confidenciais

**Uso Permitido:**
- Visualizar e usar a plataforma conforme pretendido
- Compartilhar links para páginas públicas
- Fazer capturas de tela para uso pessoal

**Seu Conteúdo:**
- Você mantém direitos sobre conteúdo original que publica
- Concede-nos licença mundial, não exclusiva para usar
- Podemos usar para marketing e promoção (com crédito)
- Você pode remover conteúdo a qualquer momento`
  },
  {
    icon: AlertTriangle,
    title: "6. Limitações e Isenções",
    content: `**Plataforma "Como Está":**
- Fornecemos a plataforma na condição em que se encontra
- Não garantimos funcionamento ininterrupto ou livre de erros
- Podemos modificar ou descontinuar recursos sem aviso prévio

**Limitação de Responsabilidade:**
- Não somos responsáveis por:
  - Qualidade dos serviços prestados por profissionais
  - Resultados de tratamentos ou procedimentos
  - Danos diretos ou indiretos do uso da plataforma
  - Perda de dados ou lucros
  - Ações de terceiros

**Interações com Profissionais:**
- Você é responsável por avaliar qualificações
- Contratos são diretamente entre você e o profissional
- Não somos parte em disputas entre usuários
- Recomendamos verificar credenciais e avaliações

**Indenização:**
- Você concorda em nos indenizar por:
  - Uso indevido da plataforma
  - Violação destes termos
  - Violação de direitos de terceiros
  - Conteúdo que você publica`
  },
  {
    icon: Lock,
    title: "7. Privacidade e Dados",
    content: `**Proteção de Dados:**
- Consulte nossa Política de Privacidade completa
- Cumprimos integralmente a LGPD
- Seus dados são protegidos com segurança adequada
- Você tem direitos sobre seus dados pessoais

**Uso de Dados:**
- Coletamos apenas dados necessários
- Usamos para melhorar a experiência
- Não vendemos dados a terceiros
- Compartilhamos apenas conforme necessário

**Beauty Coins e Pontos:**
- São propriedade do Club da Beleza
- Não possuem valor monetário direto
- Não são transferíveis ou reembolsáveis
- Podem expirar conforme regras do programa
- Podem ser alterados ou descontinuados`
  },
  {
    icon: FileText,
    title: "8. Cancelamento e Suspensão",
    content: `**Cancelamento por Você:**
- Pode cancelar sua conta a qualquer momento
- Acesse configurações da conta ou contate suporte
- Cancelamento efetivo ao final do período pago
- Dados podem ser mantidos conforme Política de Privacidade

**Suspensão por Nós:**
- Podemos suspender ou encerrar sua conta se:
  - Violar estes Termos de Uso
  - Realizar atividades fraudulentas
  - Representar risco à plataforma ou outros usuários
  - Não pagar taxas devidas

**Efeitos do Cancelamento:**
- Perda de acesso a conteúdo e benefícios
- Beauty Coins e pontos serão perdidos
- Conteúdo pode ser removido após período de retenção
- Algumas informações mantidas por obrigação legal`
  }
];

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-[#F5EFE6] to-white py-12 px-6">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center space-y-4"
        >
          <Badge className="bg-gradient-to-r from-[#D4AF37] to-[#C8A882] text-white px-4 py-2 text-base">
            <FileText className="w-4 h-4 mr-2" />
            Termos Legais
          </Badge>

          <h1 className="font-serif text-4xl md:text-5xl font-bold">
            <span className="bg-gradient-to-r from-[#D4AF37] to-[#C8A882] bg-clip-text text-transparent">
              Termos de Uso
            </span>
          </h1>

          <p className="text-gray-600 leading-relaxed">
            Última atualização: {new Date().toLocaleDateString('pt-BR')}
          </p>

          <div className="bg-gradient-to-r from-[#F5EFE6] to-[#E8DCC4] rounded-xl p-6 text-left">
            <p className="text-gray-700 leading-relaxed">
              Bem-vindo ao <strong>Club da Beleza</strong>. Estes Termos de Uso regem seu acesso e 
              uso de nossa plataforma. Ao utilizar nossos serviços, você concorda em cumprir estes 
              termos. Por favor, leia atentamente antes de prosseguir.
            </p>
          </div>
        </motion.div>

        {/* Content Sections */}
        <div className="space-y-6">
          {sections.map((section, index) => (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Card className="border-[#E8DCC4] shadow-lg hover:shadow-xl transition-shadow">
                <CardHeader className="bg-gradient-to-r from-[#F5EFE6] to-white">
                  <CardTitle className="font-serif text-xl flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-[#D4AF37] to-[#C8A882] rounded-lg flex items-center justify-center">
                      <section.icon className="w-5 h-5 text-white" />
                    </div>
                    {section.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="prose prose-sm max-w-none">
                    {section.content.split('\n').map((paragraph, i) => (
                      <p key={i} className="text-gray-700 leading-relaxed mb-4 whitespace-pre-line">
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Contact Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <Card className="border-[#E8DCC4] shadow-xl bg-gradient-to-br from-white to-[#F5EFE6]">
            <CardContent className="p-8 text-center space-y-4">
              <FileText className="w-16 h-16 text-[#D4AF37] mx-auto" />
              <h3 className="font-serif text-2xl font-bold text-gray-800">
                Dúvidas sobre os Termos?
              </h3>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Se você tiver qualquer dúvida sobre nossos Termos de Uso, entre em contato:
              </p>
              <div className="space-y-2 text-sm text-gray-700">
                <p><strong>Email:</strong> suporte@clubdabeleza.com.br</p>
                <p><strong>WhatsApp:</strong> (31) 97259-5643</p>
                <p><strong>Horário:</strong> Segunda a Sexta, 9h às 18h</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Agreement */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="bg-gradient-to-r from-[#D4AF37] to-[#C8A882] rounded-xl p-6 text-center text-white"
        >
          <p className="text-lg font-medium">
            Ao usar o Club da Beleza, você confirma ter lido, compreendido e concordado 
            com estes Termos de Uso e nossa Política de Privacidade.
          </p>
        </motion.div>
      </div>
    </div>
  );
}