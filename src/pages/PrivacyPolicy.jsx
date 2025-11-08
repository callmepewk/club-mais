import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { Shield, Lock, Eye, Database, UserCheck, FileText, AlertCircle } from "lucide-react";

const sections = [
  {
    icon: FileText,
    title: "1. Informações que Coletamos",
    content: `Coletamos as seguintes informações quando você utiliza nossa plataforma:

**Dados Pessoais:**
- Nome completo
- Endereço de e-mail
- Número de telefone e WhatsApp
- CPF
- Data de nascimento
- Endereço completo (rua, cidade, estado, CEP)

**Dados de Uso:**
- Informações sobre como você usa nossa plataforma
- Endereço IP
- Tipo de navegador e dispositivo
- Páginas visitadas e tempo de permanência
- Dados de geolocalização (quando autorizado)

**Dados Financeiros:**
- Informações de pagamento para processamento de assinaturas
- Histórico de transações
- Beauty Coins e pontos acumulados

**Dados de Avatar e Preferências:**
- Configurações de avatar personalizado
- Preferências de tratamentos estéticos
- Fotos enviadas para análise (quando autorizado)`
  },
  {
    icon: Database,
    title: "2. Como Usamos Seus Dados",
    content: `Utilizamos suas informações para:

**Prestação de Serviços:**
- Criar e gerenciar sua conta
- Processar pagamentos e assinaturas
- Fornecer acesso aos recursos premium
- Conectar você com profissionais de estética
- Personalizar sua experiência na plataforma

**Comunicação:**
- Enviar notificações sobre eventos e novidades
- Responder suas solicitações e dúvidas
- Enviar confirmações de transações
- Marketing e comunicações promocionais (quando autorizado)

**Melhorias e Análises:**
- Analisar o uso da plataforma
- Desenvolver novos recursos
- Melhorar a experiência do usuário
- Realizar pesquisas e estatísticas

**Segurança:**
- Prevenir fraudes e atividades ilegais
- Proteger a segurança da plataforma
- Cumprir obrigações legais`
  },
  {
    icon: UserCheck,
    title: "3. Compartilhamento de Dados",
    content: `Seus dados podem ser compartilhados nas seguintes situações:

**Com Profissionais Parceiros:**
- Quando você solicita serviços através da plataforma
- Apenas as informações necessárias para prestação do serviço

**Com Prestadores de Serviços:**
- Processadores de pagamento (transações seguras)
- Serviços de hospedagem e armazenamento em nuvem
- Ferramentas de análise e marketing
- Provedores de comunicação (e-mail, SMS)

**Por Obrigação Legal:**
- Quando exigido por lei ou autoridade competente
- Para proteger nossos direitos legais
- Em caso de investigações de fraude ou segurança

**Nunca Compartilhamos:**
- Seus dados não são vendidos a terceiros
- Não compartilhamos informações sensíveis sem seu consentimento
- Mantemos confidencialidade de dados médicos e de saúde`
  },
  {
    icon: Lock,
    title: "4. Segurança dos Dados",
    content: `Implementamos medidas rigorosas de segurança:

**Proteção Técnica:**
- Criptografia SSL/TLS em todas as comunicações
- Armazenamento seguro em servidores protegidos
- Backups regulares e redundância de dados
- Firewalls e sistemas de detecção de intrusão
- Autenticação de dois fatores disponível

**Proteção Organizacional:**
- Acesso restrito aos dados apenas por pessoal autorizado
- Treinamento regular de equipe em segurança
- Políticas internas de proteção de dados
- Auditorias de segurança periódicas

**Monitoramento:**
- Monitoramento contínuo de atividades suspeitas
- Sistemas de alerta para tentativas de acesso não autorizado
- Registro de todas as atividades administrativas`
  },
  {
    icon: Eye,
    title: "5. Seus Direitos (LGPD)",
    content: `De acordo com a LGPD, você tem os seguintes direitos:

**Acesso e Portabilidade:**
- Confirmar a existência de tratamento de dados
- Acessar seus dados pessoais
- Solicitar cópia dos seus dados em formato estruturado

**Correção e Atualização:**
- Corrigir dados incompletos, inexatos ou desatualizados
- Atualizar suas informações a qualquer momento

**Exclusão e Anonimização:**
- Solicitar a exclusão dos seus dados
- Requerer a anonimização dos seus dados
- Revogar consentimento a qualquer momento

**Oposição e Restrição:**
- Opor-se a tratamentos de dados
- Solicitar limitação do uso de dados
- Revogar consentimento para finalidades específicas

**Para Exercer Seus Direitos:**
Entre em contato conosco através de:
- Email: privacidade@clubdabeleza.com.br
- WhatsApp: (31) 97259-5643
- Formulário de contato no site

Responderemos sua solicitação em até 15 dias.`
  },
  {
    icon: AlertCircle,
    title: "6. Cookies e Tecnologias Similares",
    content: `Utilizamos cookies e tecnologias similares:

**Tipos de Cookies:**
- **Essenciais:** Necessários para funcionamento básico
- **Funcionais:** Lembram suas preferências e escolhas
- **Analíticos:** Coletam informações sobre uso da plataforma
- **Marketing:** Personalizam anúncios e comunicações

**Gerenciamento:**
- Você pode gerenciar cookies através das configurações do navegador
- Desativar cookies pode limitar algumas funcionalidades
- A barra de consentimento permite escolhas granulares

**Outras Tecnologias:**
- Web beacons e pixels de rastreamento
- Local storage e session storage
- Identificadores de dispositivo`
  },
  {
    icon: Database,
    title: "7. Retenção de Dados",
    content: `Mantemos seus dados pelo tempo necessário:

**Durante a Relação:**
- Enquanto você mantiver conta ativa
- Para prestação dos serviços contratados
- Conforme necessário para finalidades descritas

**Após Encerramento:**
- Dados podem ser mantidos para:
  - Cumprimento de obrigações legais (5 anos)
  - Resolução de disputas
  - Prevenção de fraudes
  - Requisitos fiscais e contábeis

**Exclusão:**
- Após períodos de retenção, dados são excluídos ou anonimizados
- Você pode solicitar exclusão antecipada (sujeito a obrigações legais)`
  },
  {
    icon: Shield,
    title: "8. Transferência Internacional",
    content: `Seus dados podem ser armazenados e processados:

**Localização:**
- Primariamente em servidores no Brasil
- Alguns serviços podem utilizar servidores internacionais
- Garantimos nível adequado de proteção em todas as transferências

**Proteção:**
- Cláusulas contratuais padrão
- Certificações internacionais de segurança
- Conformidade com LGPD e regulamentações aplicáveis`
  }
];

export default function PrivacyPolicy() {
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
            <Shield className="w-4 h-4 mr-2" />
            Proteção de Dados
          </Badge>

          <h1 className="font-serif text-4xl md:text-5xl font-bold">
            <span className="bg-gradient-to-r from-[#D4AF37] to-[#C8A882] bg-clip-text text-transparent">
              Política de Privacidade
            </span>
          </h1>

          <p className="text-gray-600 leading-relaxed">
            Última atualização: {new Date().toLocaleDateString('pt-BR')}
          </p>

          <div className="bg-gradient-to-r from-[#F5EFE6] to-[#E8DCC4] rounded-xl p-6 text-left">
            <p className="text-gray-700 leading-relaxed">
              O <strong>Club da Beleza</strong> está comprometido com a proteção da sua privacidade 
              e segurança dos seus dados pessoais. Esta Política de Privacidade descreve como coletamos, 
              usamos, compartilhamos e protegemos suas informações, em conformidade com a 
              <strong> Lei Geral de Proteção de Dados (LGPD - Lei nº 13.709/2018)</strong>.
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
              <Shield className="w-16 h-16 text-[#D4AF37] mx-auto" />
              <h3 className="font-serif text-2xl font-bold text-gray-800">
                Dúvidas sobre Privacidade?
              </h3>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Se você tiver qualquer dúvida sobre nossa Política de Privacidade ou sobre como 
                tratamos seus dados pessoais, entre em contato conosco:
              </p>
              <div className="space-y-2 text-sm text-gray-700">
                <p><strong>Email:</strong> privacidade@clubdabeleza.com.br</p>
                <p><strong>WhatsApp:</strong> (31) 97259-5643</p>
                <p><strong>Endereço:</strong> Belo Horizonte, MG - Brasil</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}