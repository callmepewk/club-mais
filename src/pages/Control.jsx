import React, { useState, useMemo } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { motion, AnimatePresence } from "framer-motion";
import {
  Shield, Search, Edit, Trash2, Eye,
  Users, Crown, Star, Coins, CheckCircle, XCircle,
  Calendar, Zap, GitBranch, Package, FileDown, Ban, UserCheck,
  Megaphone, TrendingUp, BarChart, Clock, UserPlus, Sparkles
} from "lucide-react";
import UserDetailsModal from "../components/UserDetailsModal";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

const planColors = {
  none: "bg-gray-200 text-gray-700",
  light: "bg-blue-100 text-blue-800",
  gold: "bg-gradient-to-r from-yellow-400 to-yellow-600 text-white",
  vip: "bg-gradient-to-r from-purple-500 to-purple-700 text-white",
  basic: "bg-green-100 text-green-800",
  pro: "bg-indigo-100 text-indigo-800",
  exclusive: "bg-pink-100 text-pink-800",
  premium: "bg-orange-100 text-orange-800"
};

const planLabels = {
  none: "Sem Plano",
  light: "Light",
  gold: "Gold",
  vip: "VIP",
  basic: "Basic",
  pro: "Pro",
  exclusive: "Exclusive",
  premium: "Premium"
};

export default function Control() {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterTipo, setFilterTipo] = useState("todos");
  const [filterPlano, setFilterPlano] = useState("todos");
  const [selectedUser, setSelectedUser] = useState(null);
  const [editingUser, setEditingUser] = useState(null);
  const [editFormData, setEditFormData] = useState({});
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  const [showVersionModal, setShowVersionModal] = useState(false);
  const [versionFormData, setVersionFormData] = useState({
    versao: "",
    tipo_release: "patch",
    changelog: "",
    mudancas_tecnicas: "",
    arquivos_alterados: [],
    data_agendada: "",
  });
  const [generatingAI, setGeneratingAI] = useState(false);

  const [showBannerModal, setShowBannerModal] = useState(false);
  const [bannerFormData, setBannerFormData] = useState({
    titulo: "",
    descricao: "",
    imagem: "",
    link_acao: "",
    texto_botao: "",
    duracao_minima: 5,
    tipo_banner: "informativo",
    publico_alvo: "todos",
    status: "ativo",
    data_inicio: "",
    data_fim: "",
    prioridade: 1
  });

  const [showTestAccountModal, setShowTestAccountModal] = useState(false);
  const [testAccountFormData, setTestAccountFormData] = useState({
    full_name: "",
    email: "",
    telefone: "",
    password: "",
    tipo_usuario: "paciente",
    clube_plano: "none",
    beauty_club_plano: "none",
    edbeauty_plano: "none",
    is_golden_doctor: false
  });

  const { data: user } = useQuery({
    queryKey: ['current-user-control'],
    queryFn: () => base44.auth.me(),
  });

  const { data: users = [], isLoading } = useQuery({
    queryKey: ['all-users'],
    queryFn: async () => {
      const { data } = await base44.entities.User.list('-created_date');
      return data || [];
    },
    initialData: [],
  });

  const { data: versions = [] } = useQuery({
    queryKey: ['app-versions'],
    queryFn: () => base44.entities.AppVersion.list('-created_date'),
    initialData: [],
  });

  const { data: banners = [] } = useQuery({
    queryKey: ['all-banners'],
    queryFn: () => base44.entities.Banner.list('-created_date'),
    initialData: [],
  });

  const updateUserMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.User.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['all-users'] });
      setEditingUser(null);
      alert('Usuário atualizado com sucesso!');
    },
  });

  const deleteUserMutation = useMutation({
    mutationFn: (id) => base44.entities.User.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['all-users'] });
      alert('Usuário excluído com sucesso!');
    },
    onError: (error) => {
      alert('Erro ao excluir usuário. Verifique se não há dependências.');
    }
  });

  const createVersionMutation = useMutation({
    mutationFn: (data) => base44.entities.AppVersion.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['app-versions'] });
      setShowVersionModal(false);
      setVersionFormData({
        versao: "",
        tipo_release: "patch",
        changelog: "",
        mudancas_tecnicas: "",
        arquivos_alterados: [],
        data_agendada: "",
      });
      alert('Nova versão criada com sucesso!');
    },
    onError: (error) => {
      console.error("Erro ao criar versão:", error);
      alert("Erro ao criar versão. Detalhes no console.");
    }
  });

  const publishVersionMutation = useMutation({
    mutationFn: async (versionId) => {
      const version = versions.find(v => v.id === versionId);
      if (!version) throw new Error("Version not found.");

      await base44.entities.AppVersion.update(versionId, {
        status: 'publicada',
        data_publicacao: new Date().toISOString(),
        cache_version: Date.now().toString(),
      });

      const { data: allUsers } = await base44.entities.User.list();
      
      for (const currentUser of allUsers) {
        await base44.integrations.Core.SendEmail({
          to: currentUser.email,
          subject: `🚀 Nova Versão ${version.versao} Disponível - Club da Beleza!`,
          body: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <div style="background: linear-gradient(to right, #D4AF37, #C8A882); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
                <h1 style="color: white; margin: 0; font-size: 28px;">🚀 Nova Atualização!</h1>
                <p style="color: white; margin: 10px 0 0 0; font-size: 16px;">Versão ${version.versao}</p>
              </div>
              
              <div style="background: white; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                <p style="font-size: 16px; color: #333;">Olá <strong>${currentUser.full_name || 'Usuário'}</strong>!</p>
                
                <p style="font-size: 16px; color: #333; margin-top: 20px;">
                  Acabamos de lançar a versão <strong style="color: #D4AF37;">${version.versao}</strong> do Club da Beleza!
                </p>
                
                <hr style="border: none; border-top: 2px solid #F5EFE6; margin: 25px 0;"/>
                
                <h3 style="color: #D4AF37; font-size: 20px; margin-bottom: 15px;">✨ O que há de novo:</h3>
                <div style="background: #F5EFE6; padding: 20px; border-radius: 8px; margin-bottom: 25px;">
                  <p style="font-size: 15px; color: #333; line-height: 1.6; white-space: pre-line;">${version.changelog}</p>
                </div>
                
                <hr style="border: none; border-top: 2px solid #F5EFE6; margin: 25px 0;"/>
                
                <div style="background: #E8F5E9; padding: 20px; border-radius: 8px; border-left: 4px solid #4CAF50;">
                  <p style="margin: 0; color: #2E7D32; font-size: 14px;">
                    <strong>🔄 Próximo passo:</strong> Na próxima vez que você acessar o Club da Beleza, 
                    verá um aviso de atualização. Clique em "Atualizar Agora" para aproveitar todas as novidades!
                  </p>
                </div>
                
                <div style="text-align: center; margin-top: 30px;">
                  <a href="${window.location.origin}" style="background: linear-gradient(to right, #D4AF37, #C8A882); color: white; padding: 15px 40px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: bold; font-size: 16px;">
                    Acessar Club da Beleza
                  </a>
                </div>
                
                <p style="text-align: center; color: #999; font-size: 12px; margin-top: 30px;">
                  Club da Beleza © ${new Date().getFullYear()} - Versão ${version.versao}
                </p>
              </div>
            </div>
          `
        });
      }

      return { ...version, usuarios_notificados: allUsers.length };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['app-versions'] });
      alert('Versão publicada e todos os usuários foram notificados por email!');
    },
    onError: (error) => {
      console.error("Erro ao publicar versão:", error);
      alert("Erro ao publicar versão. Detalhes no console.");
    }
  });

  const scheduleVersionMutation = useMutation({
    mutationFn: async ({ versionId, data_agendada }) => {
      const version = versions.find(v => v.id === versionId);
      if (!version) throw new Error("Version not found.");

      await base44.entities.AppVersion.update(versionId, {
        status: 'agendada',
        data_agendada: data_agendada,
      });

      const { data: allUsers } = await base44.entities.User.list();
      
      for (const currentUser of allUsers) {
        await base44.integrations.Core.SendEmail({
          to: currentUser.email,
          subject: `📅 Atualização Agendada - Versão ${version.versao} - Club da Beleza`,
          body: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <div style="background: linear-gradient(to right, #FF9800, #F57C00); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
                <h1 style="color: white; margin: 0; font-size: 28px;">📅 Manutenção Programada</h1>
                <p style="color: white; margin: 10px 0 0 0; font-size: 16px;">Versão ${version.versao}</p>
              </div>
              
              <div style="background: white; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                <p style="font-size: 16px; color: #333;">Olá <strong>${currentUser.full_name || 'Usuário'}</strong>!</p>
                
                <p style="font-size: 16px; color: #333; margin-top: 20px;">
                  Informamos que o Club da Beleza receberá uma atualização para a versão <strong style="color: #D4AF37;">${version.versao}</strong>.
                </p>
                
                <div style="background: #FFF3E0; padding: 20px; border-radius: 8px; margin: 25px 0; border-left: 4px solid #FF9800;">
                  <p style="margin: 0; color: #E65100; font-size: 16px;">
                    <strong>📅 Data e Horário:</strong> ${new Date(data_agendada).toLocaleString('pt-BR', { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
                
                <hr style="border: none; border-top: 2px solid #F5EFE6; margin: 25px 0;"/>
                
                <h3 style="color: #D4AF37; font-size: 20px; margin-bottom: 15px;">✨ Melhorias previstas:</h3>
                <div style="background: #F5EFE6; padding: 20px; border-radius: 8px; margin-bottom: 25px;">
                  <p style="font-size: 15px; color: #333; line-height: 1.6; white-space: pre-line;">${version.changelog}</p>
                </div>
                
                <hr style="border: none; border-top: 2px solid #F5EFE6; margin: 25px 0;"/>
                
                <div style="background: #E3F2FD; padding: 20px; border-radius: 8px; border-left: 4px solid #2196F3;">
                  <p style="margin: 0; color: #1565C0; font-size: 14px;">
                    <strong>ℹ️ O que você precisa saber:</strong><br/>
                    Durante o horário programado, você poderá ser solicitado a recarregar a página para aplicar as atualizações.
                    Não se preocupe, é rápido e simples!
                  </p>
                </div>
                
                <p style="text-align: center; color: #999; font-size: 12px; margin-top: 30px;">
                  Club da Beleza © ${new Date().getFullYear()} - Sempre evoluindo para você
                </p>
              </div>
            </div>
          `
        });
      }

      return allUsers.length;
    },
    onSuccess: (count) => {
      queryClient.invalidateQueries({ queryKey: ['app-versions'] });
      alert(`Atualização agendada e ${count} usuários notificados por email!`);
    },
    onError: (error) => {
      console.error("Erro ao agendar versão:", error);
      alert("Erro ao agendar versão. Detalhes no console.");
    }
  });

  const createBannerMutation = useMutation({
    mutationFn: (data) => base44.entities.Banner.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['all-banners'] });
      queryClient.invalidateQueries({ queryKey: ['active-banners'] });
      setShowBannerModal(false);
      setBannerFormData({
        titulo: "",
        descricao: "",
        imagem: "",
        link_acao: "",
        texto_botao: "",
        duracao_minima: 5,
        tipo_banner: "informativo",
        publico_alvo: "todos",
        status: "ativo",
        data_inicio: "",
        data_fim: "",
        prioridade: 1
      });
      alert('Banner criado com sucesso!');
    },
  });

  const updateBannerMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.Banner.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['all-banners'] });
      queryClient.invalidateQueries({ queryKey: ['active-banners'] });
      alert('Banner atualizado!');
    },
  });

  const deleteBannerMutation = useMutation({
    mutationFn: (id) => base44.entities.Banner.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['all-banners'] });
      queryClient.invalidateQueries({ queryKey: ['active-banners'] });
      alert('Banner excluído com sucesso!');
    },
  });

  const createTestAccountMutation = useMutation({
    mutationFn: async (accountData) => {
      const expirationDate = new Date();
      expirationDate.setDate(expirationDate.getDate() + 7);

      const userData = {
        full_name: accountData.full_name,
        email: accountData.email,
        telefone: accountData.telefone,
        whatsapp: accountData.telefone,
        tipo_usuario: accountData.tipo_usuario,
        clube_plano: accountData.clube_plano,
        beauty_club_plano: accountData.beauty_club_plano,
        edbeauty_plano: accountData.edbeauty_plano,
        is_golden_doctor: accountData.is_golden_doctor,
        is_test_account: true,
        test_expiration_date: expirationDate.toISOString(),
        test_expiration_notified: false,
        pontos_clube: 0,
        beauty_coins: 0,
        account_suspended: false,
      };

      const siteUrl = window.location.origin;

      await base44.integrations.Core.SendEmail({
        to: accountData.email,
        subject: '🎉 Bem-vindo ao Club da Beleza - Conta Teste (7 dias)',
        body: `
          <h2>Olá ${accountData.full_name}!</h2>
          <p>Sua conta teste foi criada com sucesso no <strong>Club da Beleza</strong>!</p>
          <hr/>
          <h3>📋 Suas credenciais de acesso:</h3>
          <p><strong>Email:</strong> ${accountData.email}</p>
          <p><strong>Senha:</strong> ${accountData.password}</p>
          <p><strong>Tipo de Conta:</strong> ${accountData.tipo_usuario}</p>
          <hr/>
          <h3>🎁 Seus planos de teste:</h3>
          <p><strong>Club da Beleza:</strong> ${planLabels[accountData.clube_plano]}</p>
          <p><strong>Clube+ (Beauty Club):</strong> ${planLabels[accountData.beauty_club_plano]}</p>
          <p><strong>EdBeauty:</strong> ${planLabels[accountData.edbeauty_plano]}</p>
          ${accountData.is_golden_doctor ? '<p><strong>⭐ Membro Golden Doctors</strong></p>' : ''}
          <hr/>
          <h3>⏰ Período de Teste:</h3>
          <p>Sua conta teste estará ativa por <strong>7 dias</strong>, até <strong>${expirationDate.toLocaleDateString('pt-BR')}</strong>.</p>
          <p>Aproveite este período para explorar todas as funcionalidades e benefícios do Club da Beleza!</p>
          <p>Após este período, você receberá um email com informações sobre como continuar usando nossos serviços.</p>
          <hr/>
          <p style="text-align: center;">
            <a href="${siteUrl}" style="background: linear-gradient(to right, #D4AF37, #C8A882); color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: bold; font-size: 16px;">
              Acessar Plataforma Agora
            </a>
          </p>
          <hr/>
          <p><small>Club da Beleza - Seu clube de benefícios exclusivos</small></p>
        `
      });

      return userData;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['all-users'] });
      setShowTestAccountModal(false);
      setTestAccountFormData({
        full_name: "",
        email: "",
        telefone: "",
        password: "",
        tipo_usuario: "paciente",
        clube_plano: "none",
        beauty_club_plano: "none",
        edbeauty_plano: "none",
        is_golden_doctor: false
      });
      alert('Conta teste criada com sucesso! Email de boas-vindas enviado.');
    },
    onError: (error) => {
      console.error("Erro ao criar conta teste:", error);
      alert("Erro ao criar conta teste. Detalhes no console.");
    }
  });

  const checkExpiredTestAccounts = useMutation({
    mutationFn: async () => {
      const now = new Date();
      const expiredAccounts = users.filter(u => 
        u.is_test_account && 
        u.test_expiration_date && 
        new Date(u.test_expiration_date) <= now &&
        !u.test_expiration_notified
      );

      const siteUrl = window.location.origin;

      for (const account of expiredAccounts) {
        await base44.integrations.Core.SendEmail({
          to: account.email,
          subject: '⏰ Período de Teste Encerrado - Club da Beleza',
          body: `
            <h2>Olá ${account.full_name}!</h2>
            <p>Seu período de teste de <strong>7 dias</strong> no Club da Beleza chegou ao fim.</p>
            <hr/>
            <h3>🌟 Gostou da experiência?</h3>
            <p>Esperamos que você tenha aproveitado ao máximo todos os recursos e benefícios exclusivos que oferecemos!</p>
            <hr/>
            <h3>📱 Como continuar tendo acesso:</h3>
            <ol>
              <li><strong>Escolha um Plano:</strong> Acesse nossa plataforma e escolha o plano ideal para você</li>
              <li><strong>WhatsApp:</strong> Entre em contato conosco: (31) 97259-5643</li>
              <li><strong>Email:</strong> Responda este email com suas dúvidas</li>
            </ol>
            <hr/>
            <h3>🎁 Benefícios de ser membro:</h3>
            <ul>
              <li>Descontos exclusivos em estabelecimentos parceiros</li>
              <li>Acumule pontos e Beauty Coins</li>
              <li>Acesso à plataforma educacional EdBeauty</li>
              <li>Comunidade Golden Doctors</li>
              <li>E muito mais!</li>
            </ul>
            <hr/>
            <p style="text-align: center;">
              <a href="${siteUrl}" style="background: linear-gradient(to right, #D4AF37, #C8A882); color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: bold; font-size: 16px; margin: 10px 0;">
                Acessar Club da Beleza
              </a>
            </p>
            <hr/>
            <p style="text-align: center; color: #666;">
              <small>Estamos ansiosos para tê-lo(a) como membro oficial do Club da Beleza!</small>
            </p>
            <p style="text-align: center;">
              <small>Club da Beleza - Transformando a estética no Brasil</small>
            </p>
          `
        });

        await base44.entities.User.update(account.id, {
          test_expiration_notified: true,
          account_suspended: true
        });
      }

      return expiredAccounts.length;
    },
    onSuccess: (count) => {
      queryClient.invalidateQueries({ queryKey: ['all-users'] });
      if (count > 0) {
        alert(`${count} conta(s) teste expirada(s) notificada(s) e suspensa(s).`);
      } else {
        alert('Nenhuma conta teste expirada encontrada.');
      }
    }
  });

  const handleGenerateChangelogWithAI = async () => {
    if (!versionFormData.mudancas_tecnicas || !versionFormData.versao) {
      alert('Por favor, preencha a versão e descreva as mudanças técnicas primeiro.');
      return;
    }

    setGeneratingAI(true);
    
    try {
      const aiDescription = await base44.integrations.Core.InvokeLLM({
        prompt: `Você é um comunicador profissional do Club da Beleza, uma plataforma premium de estética e beleza.

Versão: ${versionFormData.versao}
Tipo de Release: ${versionFormData.tipo_release}

Mudanças Técnicas (o que você fez):
${versionFormData.mudancas_tecnicas}

Crie uma descrição AMIGÁVEL, EMPOLGANTE e PROFISSIONAL para os usuários sobre esta atualização.

REGRAS IMPORTANTES:
- Use linguagem acessível e não-técnica
- Foque nos BENEFÍCIOS para o usuário final (não em detalhes técnicos)
- Seja positivo, empolgante e acolhedor
- Use emojis sutilmente quando apropriado (máximo 3-4)
- Organize em tópicos se houver várias mudanças
- Máximo de 4-5 parágrafos curtos OU 5-8 bullet points
- Não use jargões técnicos como "bug", "correção de código", etc.

EXEMPLOS DE TRANSFORMAÇÃO:
❌ "Corrigido bug no filtro de cidades"
✅ "Agora você encontra estabelecimentos na sua cidade de forma ainda mais precisa! 🎯"

❌ "Adicionado sistema de notificações por email"
✅ "Você receberá avisos personalizados sobre novidades, eventos e promoções exclusivas! 💌"

❌ "Melhorada performance do mapa"
✅ "O mapa carrega mais rápido e é ainda mais fácil de navegar! 🗺️"

Gere APENAS a descrição amigável, sem introduções, títulos ou explicações extras.`,
      });

      setVersionFormData(prev => ({
        ...prev,
        changelog: aiDescription
      }));

      alert('✨ Descrição gerada com IA! Revise e ajuste se necessário.');
    } catch (error) {
      console.error('Erro ao gerar descrição:', error);
      alert('Erro ao gerar descrição com IA. Tente novamente.');
    }

    setGeneratingAI(false);
  };

  const handleEditUser = (user) => {
    setEditingUser(user);
    setEditFormData({
      tipo_usuario: user.tipo_usuario || 'visitante',
      clube_plano: user.clube_plano || 'none',
      beauty_club_plano: user.beauty_club_plano || 'none',
      edbeauty_plano: user.edbeauty_plano || 'none',
      is_golden_doctor: user.is_golden_doctor || false,
      pontos_clube: user.pontos_clube || 0,
      beauty_coins: user.beauty_coins || 0,
      account_suspended: user.account_suspended || false,
    });
  };

  const handleSaveUser = () => {
    if (editingUser) {
      updateUserMutation.mutate({
        id: editingUser.id,
        data: editFormData
      });
    }
  };

  const handleSuspendUser = (userToSuspend) => {
    if (confirm(`Deseja ${userToSuspend.account_suspended ? 'reativar' : 'suspender'} o acesso de ${userToSuspend.full_name}?`)) {
      updateUserMutation.mutate({
        id: userToSuspend.id,
        data: { account_suspended: !userToSuspend.account_suspended }
      });
    }
  };

  const handleDeleteUser = (userToDelete) => {
    if (confirm(`ATENÇÃO: Deseja realmente EXCLUIR permanentemente o usuário ${userToDelete.full_name}? Esta ação não pode ser desfeita!`)) {
      deleteUserMutation.mutate(userToDelete.id);
    }
  };

  const handleViewDetails = (user) => {
    setSelectedUser(user);
    setShowDetailsModal(true);
  };

  const handleCreateVersion = () => {
    if (!versionFormData.versao || !versionFormData.changelog) {
      alert('Por favor, preencha versão e changelog.');
      return;
    }

    createVersionMutation.mutate({
      ...versionFormData,
      status: 'em_desenvolvimento',
      criado_por: user?.email,
    });
  };

  const handleForcePublish = (versionId) => {
    if (confirm('⚠️ FORÇAR PUBLICAÇÃO: Isso enviará a atualização imediatamente para TODOS os usuários por email. Continuar?')) {
      publishVersionMutation.mutate(versionId);
    }
  };

  const handleScheduleVersion = (versionId) => {
    const dataAgendada = prompt('Digite a data e hora para publicação (formato: YYYY-MM-DDTHH:mm):');
    
    if (dataAgendada) {
      if (confirm(`📅 Confirma agendar para ${new Date(dataAgendada).toLocaleString('pt-BR')}? TODOS os usuários serão notificados por email.`)) {
        scheduleVersionMutation.mutate({ 
          versionId, 
          data_agendada: dataAgendada 
        });
      }
    }
  };

  const handleCreateBanner = () => {
    if (!bannerFormData.titulo || !bannerFormData.descricao) {
      alert('Por favor, preencha título e descrição.');
      return;
    }

    createBannerMutation.mutate(bannerFormData);
  };

  const handleToggleBannerStatus = (banner) => {
    const newStatus = banner.status === 'ativo' ? 'inativo' : 'ativo';
    updateBannerMutation.mutate({
      id: banner.id,
      data: { status: newStatus }
    });
  };

  const handleDeleteBanner = (banner) => {
    if (confirm(`Deseja realmente excluir o banner "${banner.titulo}"?`)) {
      deleteBannerMutation.mutate(banner.id);
    }
  };

  const handleCreateTestAccount = () => {
    if (!testAccountFormData.full_name || !testAccountFormData.email || !testAccountFormData.password) {
      alert('Por favor, preencha nome, email e senha.');
      return;
    }

    createTestAccountMutation.mutate(testAccountFormData);
  };

  const filteredUsers = useMemo(() => {
    return users.filter(u => {
      const matchSearch = !searchTerm || 
        u.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.email?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchTipo = filterTipo === "todos" || u.tipo_usuario === filterTipo;
      const matchPlano = filterPlano === "todos" || (u.clube_plano || 'none') === filterPlano;
      
      return matchSearch && matchTipo && matchPlano;
    });
  }, [users, searchTerm, filterTipo, filterPlano]);

  const stats = useMemo(() => {
    const total = users.length;
    const pacientes = users.filter(u => u.tipo_usuario === 'paciente').length;
    const profissionais = users.filter(u => u.tipo_usuario === 'profissional').length;
    const planosAtivos = users.filter(u => u.clube_plano && u.clube_plano !== 'none').length;
    const goldenDoctors = users.filter(u => u.is_golden_doctor).length;
    const totalPontos = users.reduce((sum, u) => sum + (u.pontos_clube || 0), 0);
    const totalCoins = users.reduce((sum, u) => sum + (u.beauty_coins || 0), 0);
    const suspended = users.filter(u => u.account_suspended).length;
    const testAccounts = users.filter(u => u.is_test_account).length;
    const expiredTests = users.filter(u => 
      u.is_test_account && 
      u.test_expiration_date && 
      new Date(u.test_expiration_date) <= new Date()
    ).length;

    return { total, pacientes, profissionais, planosAtivos, goldenDoctors, totalPontos, totalCoins, suspended, testAccounts, expiredTests };
  }, [users]);

  const generatePDFReport = () => {
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Relatório de Usuários - Club da Beleza</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; }
          h1 { color: #D4AF37; text-align: center; }
          .stats { display: flex; justify-content: space-around; margin: 20px 0; flex-wrap: wrap; }
          .stat-box { text-align: center; padding: 10px; background: #F5EFE6; border-radius: 8px; margin: 5px; }
          table { width: 100%; border-collapse: collapse; margin-top: 20px; }
          th, td { border: 1px solid #E8DCC4; padding: 8px; text-align: left; font-size: 12px; }
          th { background-color: #D4AF37; color: white; }
          tr:nth-child(even) { background-color: #F5EFE6; }
          .footer { margin-top: 30px; text-align: center; font-size: 10px; color: #666; }
        </style>
      </head>
      <body>
        <h1>🏆 Club da Beleza - Relatório de Usuários</h1>
        <p style="text-align: center; color: #666;">Gerado em: ${new Date().toLocaleString('pt-BR')}</p>
        
        <div class="stats">
          <div class="stat-box">
            <strong>${stats.total}</strong><br>Total Usuários
          </div>
          <div class="stat-box">
            <strong>${stats.pacientes}</strong><br>Pacientes
          </div>
          <div class="stat-box">
            <strong>${stats.profissionais}</strong><br>Profissionais
          </div>
          <div class="stat-box">
            <strong>${stats.testAccounts}</strong><br>Contas Teste
          </div>
          <div class="stat-box">
            <strong>${stats.goldenDoctors}</strong><br>Golden Doctors
          </div>
          <div class="stat-box">
            <strong>${stats.suspended}</strong><br>Suspensos
          </div>
        </div>

        <table>
          <thead>
            <tr>
              <th>Nome</th>
              <th>Email</th>
              <th>Tipo</th>
              <th>Plano Club</th>
              <th>Plano Clube+</th>
              <th>Teste</th>
              <th>Golden</th>
              <th>Pontos</th>
              <th>Coins</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            ${filteredUsers.map(u => `
              <tr>
                <td>${u.full_name || 'N/A'}</td>
                <td>${u.email}</td>
                <td>${u.tipo_usuario || 'visitante'}</td>
                <td>${planLabels[u.clube_plano || 'none']}</td>
                <td>${planLabels[u.beauty_club_plano || 'none']}</td>
                <td>${u.is_test_account ? '✓ (7 dias)' : '✗'}</td>
                <td>${u.is_golden_doctor ? '✓' : '✗'}</td>
                <td>${u.pontos_clube || 0}</td>
                <td>${u.beauty_coins || 0}</td>
                <td>${u.account_suspended ? 'SUSPENSO' : 'Ativo'}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>

        <div class="footer">
          <p>Club da Beleza © ${new Date().getFullYear()} - Relatório confidencial</p>
          <p>Total de registros: ${filteredUsers.length}</p>
        </div>
      </body>
      </html>
    `;

    const printWindow = window.open('', '_blank');
    printWindow.document.write(htmlContent);
    printWindow.document.close();
    printWindow.print();
  };

  if (!user || user.role !== 'admin') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white via-[#F5EFE6] to-white py-20 px-6">
        <div className="max-w-2xl mx-auto text-center space-y-6">
          <Shield className="w-16 h-16 text-red-600 mx-auto" />
          <h2 className="font-serif text-3xl font-bold text-gray-800">
            Acesso Restrito
          </h2>
          <p className="text-gray-600">
            Você não tem permissão para acessar o painel de controle.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-[#F5EFE6] to-white">
      <div className="relative py-20 px-6 overflow-hidden bg-gradient-to-br from-[#D4AF37] via-[#C8A882] to-[#D4AF37]">
        <div className="relative z-10 max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center space-y-6"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full border border-white/30">
              <Shield className="w-5 h-5 text-white" />
              <span className="text-white font-medium">Painel Administrativo</span>
            </div>

            <h1 className="font-serif text-5xl md:text-6xl font-bold text-white">
              Controle Total
            </h1>

            <p className="text-xl text-white/90 max-w-2xl mx-auto">
              Gerencie usuários, planos, versões e atualizações do sistema
            </p>
          </motion.div>
        </div>
      </div>

      <div className="py-12 px-6">
        <div className="max-w-7xl mx-auto space-y-12">
          {/* Test Accounts Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Card className="border-[#E8DCC4] shadow-2xl bg-gradient-to-br from-white to-[#F5EFE6]">
              <CardHeader className="bg-gradient-to-r from-green-500 to-green-600 text-white">
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                      <Clock className="w-6 h-6" />
                    </div>
                    <div>
                      <CardTitle className="font-serif text-2xl">
                        Contas Teste (7 dias)
                      </CardTitle>
                      <p className="text-white/90 text-sm mt-1">
                        Crie contas teste com acesso limitado a 7 dias
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      onClick={() => checkExpiredTestAccounts.mutate()}
                      disabled={checkExpiredTestAccounts.isPending}
                      className="bg-white/20 text-white hover:bg-white/30"
                    >
                      <Zap className="w-4 h-4 mr-2" />
                      Verificar Expirados
                    </Button>
                    <Button
                      onClick={() => setShowTestAccountModal(true)}
                      className="bg-white text-green-600 hover:bg-white/90"
                    >
                      <UserPlus className="w-4 h-4 mr-2" />
                      Nova Conta Teste
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-8">
                <div className="grid md:grid-cols-3 gap-6 mb-8">
                  <Card className="border-2 border-green-200 bg-gradient-to-br from-green-50 to-white">
                    <CardContent className="p-6 text-center">
                      <div className="text-3xl font-bold bg-gradient-to-r from-green-600 to-green-800 bg-clip-text text-transparent">
                        {stats.testAccounts}
                      </div>
                      <p className="text-sm text-gray-600 mt-1">Contas Teste Ativas</p>
                    </CardContent>
                  </Card>

                  <Card className="border-2 border-red-200 bg-gradient-to-br from-red-50 to-white">
                    <CardContent className="p-6 text-center">
                      <div className="text-3xl font-bold bg-gradient-to-r from-red-600 to-red-800 bg-clip-text text-transparent">
                        {stats.expiredTests}
                      </div>
                      <p className="text-sm text-gray-600 mt-1">Contas Expiradas</p>
                    </CardContent>
                  </Card>

                  <Card className="border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-white">
                    <CardContent className="p-6 text-center">
                      <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                        {stats.testAccounts - stats.expiredTests}
                      </div>
                      <p className="text-sm text-gray-600 mt-1">Ainda Válidas</p>
                    </CardContent>
                  </Card>
                </div>

                <div className="space-y-4">
                  <h3 className="font-serif text-xl font-bold text-gray-800">
                    Contas Teste Cadastradas
                  </h3>
                  {users.filter(u => u.is_test_account).length === 0 ? (
                    <div className="text-center py-12 bg-gray-50 rounded-lg">
                      <Clock className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-600">Nenhuma conta teste criada ainda</p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Nome</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Tipo</TableHead>
                            <TableHead>Planos</TableHead>
                            <TableHead>Expira Em</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Ações</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {users.filter(u => u.is_test_account).map((testUser) => {
                            const isExpired = testUser.test_expiration_date && 
                              new Date(testUser.test_expiration_date) <= new Date();
                            const daysLeft = testUser.test_expiration_date ?
                              Math.ceil((new Date(testUser.test_expiration_date) - new Date()) / (1000 * 60 * 60 * 24)) : 0;

                            return (
                              <TableRow key={testUser.id} className={isExpired ? 'bg-red-50' : ''}>
                                <TableCell className="font-medium">{testUser.full_name}</TableCell>
                                <TableCell>{testUser.email}</TableCell>
                                <TableCell>
                                  <Badge className="bg-blue-100 text-blue-800">
                                    {testUser.tipo_usuario}
                                  </Badge>
                                </TableCell>
                                <TableCell>
                                  <div className="flex flex-col gap-1">
                                    {testUser.clube_plano && testUser.clube_plano !== 'none' && (
                                      <Badge className={planColors[testUser.clube_plano]} style={{fontSize: '10px'}}>
                                        Club: {planLabels[testUser.clube_plano]}
                                      </Badge>
                                    )}
                                    {testUser.beauty_club_plano && testUser.beauty_club_plano !== 'none' && (
                                      <Badge className={planColors[testUser.beauty_club_plano]} style={{fontSize: '10px'}}>
                                        Clube+: {planLabels[testUser.beauty_club_plano]}
                                      </Badge>
                                    )}
                                    {testUser.edbeauty_plano && testUser.edbeauty_plano !== 'none' && (
                                      <Badge className={planColors[testUser.edbeauty_plano]} style={{fontSize: '10px'}}>
                                        EdB: {planLabels[testUser.edbeauty_plano]}
                                      </Badge>
                                    )}
                                  </div>
                                </TableCell>
                                <TableCell>
                                  {testUser.test_expiration_date ? (
                                    <div className="flex flex-col">
                                      <span className="text-sm">
                                        {new Date(testUser.test_expiration_date).toLocaleDateString('pt-BR')}
                                      </span>
                                      <span className={`text-xs ${isExpired ? 'text-red-600 font-bold' : daysLeft <= 2 ? 'text-orange-600' : 'text-gray-500'}`}>
                                        {isExpired ? 'EXPIRADA' : `${daysLeft} dia(s)`}
                                      </span>
                                    </div>
                                  ) : 'N/A'}
                                </TableCell>
                                <TableCell>
                                  {isExpired ? (
                                    <Badge className="bg-red-100 text-red-800">Expirada</Badge>
                                  ) : testUser.account_suspended ? (
                                    <Badge className="bg-orange-100 text-orange-800">Suspensa</Badge>
                                  ) : (
                                    <Badge className="bg-green-100 text-green-800">Ativa</Badge>
                                  )}
                                </TableCell>
                                <TableCell>
                                  <div className="flex gap-1">
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() => handleEditUser(testUser)}
                                      title="Editar"
                                    >
                                      <Edit className="w-4 h-4" />
                                    </Button>
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() => handleDeleteUser(testUser)}
                                      className="text-red-600"
                                      title="Excluir"
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </Button>
                                  </div>
                                </TableCell>
                              </TableRow>
                            );
                          })}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Banner Management Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.05 }}
          >
            <Card className="border-[#E8DCC4] shadow-2xl bg-gradient-to-br from-white to-[#F5EFE6]">
              <CardHeader className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                      <Megaphone className="w-6 h-6" />
                    </div>
                    <div>
                      <CardTitle className="font-serif text-2xl">
                        Sistema de Banners e Anúncios
                      </CardTitle>
                      <p className="text-white/90 text-sm mt-1">
                        Crie anúncios pop-up que serão exibidos para todos os usuários
                      </p>
                    </div>
                  </div>
                  <Button
                    onClick={() => setShowBannerModal(true)}
                    className="bg-white text-purple-600 hover:bg-white/90"
                  >
                    <Megaphone className="w-4 h-4 mr-2" />
                    Novo Banner
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-8">
                <div className="grid md:grid-cols-4 gap-6 mb-8">
                  <Card className="border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-white">
                    <CardContent className="p-6 text-center">
                      <div className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-purple-800 bg-clip-text text-transparent">
                        {banners.filter(b => b.status === 'ativo').length}
                      </div>
                      <p className="text-sm text-gray-600 mt-1">Banners Ativos</p>
                    </CardContent>
                  </Card>

                  <Card className="border-2 border-green-200 bg-gradient-to-br from-green-50 to-white">
                    <CardContent className="p-6 text-center">
                      <div className="text-3xl font-bold bg-gradient-to-r from-green-600 to-green-800 bg-clip-text text-transparent">
                        {banners.reduce((sum, b) => sum + (b.visualizacoes || 0), 0)}
                      </div>
                      <p className="text-sm text-gray-600 mt-1">Total Visualizações</p>
                    </CardContent>
                  </Card>

                  <Card className="border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-white">
                    <CardContent className="p-6 text-center">
                      <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                        {banners.reduce((sum, b) => sum + (b.cliques || 0), 0)}
                      </div>
                      <p className="text-sm text-gray-600 mt-1">Total Cliques</p>
                    </CardContent>
                  </Card>

                  <Card className="border-2 border-orange-200 bg-gradient-to-br from-orange-50 to-white">
                    <CardContent className="p-6 text-center">
                      <div className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-orange-800 bg-clip-text text-transparent">
                        {banners.length > 0 ? 
                          ((banners.reduce((sum, b) => sum + (b.cliques || 0), 0) / 
                            Math.max(banners.reduce((sum, b) => sum + (b.visualizacoes || 0), 0), 1) * 100) || 0).toFixed(1)
                          : 0}%
                      </div>
                      <p className="text-sm text-gray-600 mt-1">Taxa de Cliques</p>
                    </CardContent>
                  </Card>
                </div>

                <div className="space-y-4">
                  <h3 className="font-serif text-xl font-bold text-gray-800">
                    Todos os Banners
                  </h3>
                  {banners.length === 0 ? (
                    <div className="text-center py-12 bg-gray-50 rounded-lg">
                      <Megaphone className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-600">Nenhum banner criado ainda</p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Título</TableHead>
                            <TableHead>Tipo</TableHead>
                            <TableHead>Público</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Duração</TableHead>
                            <TableHead>Visualizações</TableHead>
                            <TableHead>Cliques</TableHead>
                            <TableHead>Taxa</TableHead>
                            <TableHead>Ações</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {banners.map((banner) => (
                            <TableRow key={banner.id}>
                              <TableCell className="font-medium">{banner.titulo}</TableCell>
                              <TableCell>
                                <Badge className={
                                  banner.tipo_banner === 'urgente' ? 'bg-red-100 text-red-800' :
                                  banner.tipo_banner === 'promocional' ? 'bg-purple-100 text-purple-800' :
                                  banner.tipo_banner === 'aviso' ? 'bg-orange-100 text-orange-800' :
                                  'bg-blue-100 text-blue-800'
                                }>
                                  {banner.tipo_banner}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <span className="text-sm text-gray-600">
                                  {banner.publico_alvo === 'todos' ? 'Todos' : banner.publico_alvo}
                                </span>
                              </TableCell>
                              <TableCell>
                                <Badge className={
                                  banner.status === 'ativo' ? 'bg-green-100 text-green-800' :
                                  banner.status === 'agendado' ? 'bg-orange-100 text-orange-800' :
                                  'bg-gray-100 text-gray-800'
                                }>
                                  {banner.status}
                                </Badge>
                              </TableCell>
                              <TableCell>{banner.duracao_minima}s</TableCell>
                              <TableCell>{banner.visualizacoes || 0}</TableCell>
                              <TableCell>{banner.cliques || 0}</TableCell>
                              <TableCell>
                                {banner.visualizacoes > 0 
                                  ? ((banner.cliques / banner.visualizacoes) * 100).toFixed(1) 
                                  : '0.0'}%
                              </TableCell>
                              <TableCell>
                                <div className="flex gap-1">
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => handleToggleBannerStatus(banner)}
                                    className={banner.status === 'ativo' ? 'text-orange-600' : 'text-green-600'}
                                    title={banner.status === 'ativo' ? 'Desativar' : 'Ativar'}
                                  >
                                    {banner.status === 'ativo' ? <Ban className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => handleDeleteBanner(banner)}
                                    className="text-red-600"
                                    title="Excluir"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Version Management Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
          >
            <Card className="border-[#E8DCC4] shadow-2xl bg-gradient-to-br from-white to-[#F5EFE6]">
              <CardHeader className="bg-gradient-to-r from-indigo-500 to-indigo-600 text-white">
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                      <GitBranch className="w-6 h-6" />
                    </div>
                    <div>
                      <CardTitle className="font-serif text-2xl">
                        Sistema de Versões (CI/CD Interno)
                      </CardTitle>
                      <p className="text-white/90 text-sm mt-1">
                        Deploy automático com notificação por email para todos os usuários
                      </p>
                    </div>
                  </div>
                  <Button
                    onClick={() => setShowVersionModal(true)}
                    className="bg-white text-indigo-600 hover:bg-white/90"
                  >
                    <Package className="w-4 h-4 mr-2" />
                    Nova Versão
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-8">
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                  <Card className="border-2 border-indigo-200 bg-gradient-to-br from-indigo-50 to-white">
                    <CardContent className="p-6 text-center">
                      <div className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-indigo-800 bg-clip-text text-transparent">
                        {versions.filter(v => v.status === 'publicada').length}
                      </div>
                      <p className="text-sm text-gray-600 mt-1">Versões Publicadas</p>
                    </CardContent>
                  </Card>

                  <Card className="border-2 border-orange-200 bg-gradient-to-br from-orange-50 to-white">
                    <CardContent className="p-6 text-center">
                      <div className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-orange-800 bg-clip-text text-transparent">
                        {versions.filter(v => v.status === 'agendada').length}
                      </div>
                      <p className="text-sm text-gray-600 mt-1">Atualizações Agendadas</p>
                    </CardContent>
                  </Card>

                  <Card className="border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-white">
                    <CardContent className="p-6 text-center">
                      <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                        {versions.filter(v => v.status === 'em_desenvolvimento').length}
                      </div>
                      <p className="text-sm text-gray-600 mt-1">Em Desenvolvimento</p>
                    </CardContent>
                  </Card>

                  <Card className="border-2 border-green-200 bg-gradient-to-br from-green-50 to-white">
                    <CardContent className="p-6 text-center">
                      <div className="text-3xl font-bold bg-gradient-to-r from-green-600 to-green-800 bg-clip-text text-transparent">
                        {versions[0]?.versao || '0.0.0'}
                      </div>
                      <p className="text-sm text-gray-600 mt-1">Versão Atual</p>
                    </CardContent>
                  </Card>
                </div>

                <div className="space-y-4">
                  <h3 className="font-serif text-xl font-bold text-gray-800">
                    Histórico de Versões
                  </h3>
                  {versions.length === 0 ? (
                    <div className="text-center py-12 bg-gray-50 rounded-lg">
                      <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-600">Nenhuma versão criada ainda</p>
                    </div>
                  ) : (
                    versions.map((version) => (
                      <Card key={version.id} className="border-[#E8DCC4]">
                        <CardContent className="p-6">
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <h4 className="font-bold text-xl text-gray-800">
                                  v{version.versao}
                                </h4>
                                <Badge className={
                                  version.status === 'publicada' ? 'bg-green-100 text-green-800' :
                                  version.status === 'agendada' ? 'bg-orange-100 text-orange-800' :
                                  version.status === 'em_desenvolvimento' ? 'bg-blue-100 text-blue-800' :
                                  'bg-gray-100 text-gray-800'
                                }>
                                  {version.status === 'publicada' && <CheckCircle className="w-3 h-3 mr-1" />}
                                  {version.status === 'agendada' && <Calendar className="w-3 h-3 mr-1" />}
                                  {version.status.replace('_', ' ')}
                                </Badge>
                                <Badge variant="outline" className="border-indigo-200 text-indigo-800">
                                  {version.tipo_release}
                                </Badge>
                              </div>
                              
                              <p className="text-gray-700 mb-3 whitespace-pre-line">{version.changelog}</p>
                              
                              <div className="flex flex-wrap gap-3 text-xs text-gray-500">
                                <span>Criado: {new Date(version.created_date).toLocaleString('pt-BR')}</span>
                                {version.data_agendada && (
                                  <span className="text-orange-600 font-semibold">
                                    📅 Agendado: {new Date(version.data_agendada).toLocaleString('pt-BR')}
                                  </span>
                                )}
                                {version.data_publicacao && (
                                  <span className="text-green-600 font-semibold">
                                    ✅ Publicado: {new Date(version.data_publicacao).toLocaleString('pt-BR')}
                                  </span>
                                )}
                                {version.criado_por && <span>Por: {version.criado_por}</span>}
                              </div>
                            </div>

                            {version.status === 'em_desenvolvimento' && (
                              <div className="flex gap-2">
                                <Button
                                  onClick={() => handleForcePublish(version.id)}
                                  disabled={publishVersionMutation.isPending}
                                  size="sm"
                                  className="bg-gradient-to-r from-red-500 to-red-600 text-white"
                                >
                                  <Zap className="w-4 h-4 mr-2" />
                                  Forçar Agora
                                </Button>
                                <Button
                                  onClick={() => handleScheduleVersion(version.id)}
                                  disabled={scheduleVersionMutation.isPending}
                                  size="sm"
                                  variant="outline"
                                  className="border-orange-500 text-orange-600"
                                >
                                  <Calendar className="w-4 h-4 mr-2" />
                                  Agendar
                                </Button>
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Stats Cards */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.15 }}
          >
            <div className="grid md:grid-cols-6 gap-4">
              <Card className="border-[#E8DCC4] bg-gradient-to-br from-white to-[#F5EFE6]">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-[#D4AF37] to-[#C8A882] rounded-full flex items-center justify-center">
                      <Users className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Total de Usuários</p>
                      <p className="text-2xl font-bold text-gray-800">{stats.total}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-[#E8DCC4] bg-gradient-to-br from-white to-blue-50">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                      <Users className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Pacientes</p>
                      <p className="text-2xl font-bold text-gray-800">{stats.pacientes}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-[#E8DCC4] bg-gradient-to-br from-white to-purple-50">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center">
                      <Users className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Profissionais</p>
                      <p className="text-2xl font-bold text-gray-800">{stats.profissionais}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-[#E8DCC4] bg-gradient-to-br from-white to-green-50">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center">
                      <Crown className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Planos Ativos</p>
                      <p className="text-2xl font-bold text-gray-800">{stats.planosAtivos}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-[#E8DCC4]">
                <CardContent className="p-6 text-center">
                  <Star className="w-8 h-8 text-orange-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-gray-800">{stats.totalPontos.toLocaleString()}</div>
                  <div className="text-xs text-gray-600">Total Pontos</div>
                </CardContent>
              </Card>

              <Card className="border-[#E8DCC4]">
                <CardContent className="p-6 text-center">
                  <Coins className="w-8 h-8 text-[#D4AF37] mx-auto mb-2" />
                  <div className="text-2xl font-bold text-gray-800">{stats.totalCoins.toLocaleString()}</div>
                  <div className="text-xs text-gray-600">Total Coins</div>
                </CardContent>
              </Card>
            </div>
          </motion.div>

          {/* User Filters */}
          <Card className="border-[#E8DCC4] shadow-xl">
            <CardContent className="p-6">
              <div className="grid md:grid-cols-3 gap-4 mb-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Buscar por nome ou email..."
                    className="pl-10 border-[#E8DCC4]"
                  />
                </div>

                <Select value={filterTipo} onValueChange={setFilterTipo}>
                  <SelectTrigger className="border-[#E8DCC4]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todos os Tipos</SelectItem>
                    <SelectItem value="paciente">Pacientes</SelectItem>
                    <SelectItem value="profissional">Profissionais</SelectItem>
                    <SelectItem value="visitante">Visitantes</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={filterPlano} onValueChange={setFilterPlano}>
                  <SelectTrigger className="border-[#E8DCC4]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todos os Planos</SelectItem>
                    <SelectItem value="none">Sem Plano</SelectItem>
                    <SelectItem value="light">Light</SelectItem>
                    <SelectItem value="gold">Gold</SelectItem>
                    <SelectItem value="vip">VIP</SelectItem>
                    <SelectItem value="basic">Basic</SelectItem>
                    <SelectItem value="pro">Pro</SelectItem>
                    <SelectItem value="exclusive">Exclusive</SelectItem>
                    <SelectItem value="premium">Premium</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex justify-end">
                <Button
                  onClick={generatePDFReport}
                  className="bg-white/90 text-[#D4AF37] hover:bg-white transition-colors border border-[#D4AF37]"
                  variant="outline"
                >
                  <FileDown className="w-4 h-4 mr-2" />
                  Gerar Relatório PDF
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Users Table */}
          <Card className="border-[#E8DCC4] shadow-xl">
            <CardHeader>
              <CardTitle className="font-serif text-2xl">
                Lista de Usuários ({filteredUsers.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="text-center py-12">
                  <div className="animate-spin w-8 h-8 border-4 border-[#D4AF37] border-t-transparent rounded-full mx-auto"></div>
                  <p className="text-gray-600 mt-4">Carregando usuários...</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Nome</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Tipo</TableHead>
                        <TableHead>Club da Beleza</TableHead>
                        <TableHead>Beauty Club (Clube+)</TableHead>
                        <TableHead>Golden</TableHead>
                        <TableHead>Pontos</TableHead>
                        <TableHead>Coins</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredUsers.map((userData) => (
                        <TableRow key={userData.id} className={userData.account_suspended ? 'bg-red-50' : userData.is_test_account ? 'bg-green-50' : ''}>
                          <TableCell className="font-medium">
                            {userData.full_name}
                            {userData.is_test_account && (
                              <Badge className="ml-2 bg-green-600 text-white text-xs">TESTE</Badge>
                            )}
                          </TableCell>
                          <TableCell>{userData.email}</TableCell>
                          <TableCell>
                            <Badge className="bg-blue-100 text-blue-800">
                              {userData.tipo_usuario || 'visitante'}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge className={planColors[userData.clube_plano || 'none']}>
                              {planLabels[userData.clube_plano || 'none']}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge className={planColors[userData.beauty_club_plano || 'none']}>
                              {planLabels[userData.beauty_club_plano || 'none']}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {userData.is_golden_doctor ? (
                              <CheckCircle className="w-5 h-5 text-green-600" />
                            ) : (
                              <XCircle className="w-5 h-5 text-gray-300" />
                            )}
                          </TableCell>
                          <TableCell>{userData.pontos_clube || 0}</TableCell>
                          <TableCell>{userData.beauty_coins || 0}</TableCell>
                          <TableCell>
                            {userData.account_suspended ? (
                              <Badge className="bg-red-100 text-red-800">Suspenso</Badge>
                            ) : (
                              <Badge className="bg-green-100 text-green-800">Ativo</Badge>
                            )}
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-1">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleViewDetails(userData)}
                                title="Ver Detalhes"
                              >
                                <Eye className="w-4 h-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleEditUser(userData)}
                                title="Editar"
                              >
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleSuspendUser(userData)}
                                className={userData.account_suspended ? 'text-green-600' : 'text-orange-600'}
                                title={userData.account_suspended ? 'Reativar' : 'Suspender'}
                              >
                                {userData.account_suspended ? <UserCheck className="w-4 h-4" /> : <Ban className="w-4 h-4" />}
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleDeleteUser(userData)}
                                className="text-red-600"
                                title="Excluir"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Edit User Modal */}
      {editingUser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="max-w-2xl w-full border-[#E8DCC4] shadow-2xl max-h-[90vh] overflow-y-auto">
            <CardHeader className="bg-gradient-to-r from-[#F5EFE6] to-[#E8DCC4]">
              <CardTitle className="font-serif text-2xl">
                Editar Usuário: {editingUser.full_name}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Tipo de Usuário</Label>
                  <Select
                    value={editFormData.tipo_usuario}
                    onValueChange={(v) => setEditFormData({...editFormData, tipo_usuario: v})}
                  >
                    <SelectTrigger className="border-[#E8DCC4]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="visitante">Visitante</SelectItem>
                      <SelectItem value="paciente">Paciente</SelectItem>
                      <SelectItem value="profissional">Profissional</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Plano Club da Beleza</Label>
                  <Select
                    value={editFormData.clube_plano}
                    onValueChange={(v) => setEditFormData({...editFormData, clube_plano: v})}
                  >
                    <SelectTrigger className="border-[#E8DCC4]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">Sem Plano</SelectItem>
                      <SelectItem value="light">Light</SelectItem>
                      <SelectItem value="gold">Gold</SelectItem>
                      <SelectItem value="vip">VIP</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Plano Beauty Club (Clube+)</Label>
                  <Select
                    value={editFormData.beauty_club_plano}
                    onValueChange={(v) => setEditFormData({...editFormData, beauty_club_plano: v})}
                  >
                    <SelectTrigger className="border-[#E8DCC4]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">Sem Plano</SelectItem>
                      <SelectItem value="basic">Basic</SelectItem>
                      <SelectItem value="pro">Pro</SelectItem>
                      <SelectItem value="exclusive">Exclusive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Plano EdBeauty</Label>
                  <Select
                    value={editFormData.edbeauty_plano}
                    onValueChange={(v) => setEditFormData({...editFormData, edbeauty_plano: v})}
                  >
                    <SelectTrigger className="border-[#E8DCC4]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">Sem Plano</SelectItem>
                      <SelectItem value="basic">Basic</SelectItem>
                      <SelectItem value="pro">Pro</SelectItem>
                      <SelectItem value="premium">Premium</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Pontos do Clube</Label>
                  <Input
                    type="number"
                    value={editFormData.pontos_clube || 0}
                    onChange={(e) => setEditFormData({...editFormData, pontos_clube: parseInt(e.target.value) || 0})}
                    className="border-[#E8DCC4]"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Beauty Coins</Label>
                  <Input
                    type="number"
                    value={editFormData.beauty_coins || 0}
                    onChange={(e) => setEditFormData({...editFormData, beauty_coins: parseInt(e.target.value) || 0})}
                    className="border-[#E8DCC4]"
                  />
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="is_golden_doctor"
                    checked={editFormData.is_golden_doctor}
                    onChange={(e) => setEditFormData({...editFormData, is_golden_doctor: e.target.checked})}
                    className="w-4 h-4"
                  />
                  <Label htmlFor="is_golden_doctor">
                    Membro Golden Doctors
                  </Label>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="account_suspended"
                    checked={editFormData.account_suspended}
                    onChange={(e) => setEditFormData({...editFormData, account_suspended: e.target.checked})}
                    className="w-4 h-4"
                  />
                  <Label htmlFor="account_suspended" className="text-red-600">
                    Conta Suspensa
                  </Label>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  variant="outline"
                  onClick={() => setEditingUser(null)}
                  className="flex-1"
                >
                  Cancelar
                </Button>
                <Button
                  onClick={handleSaveUser}
                  disabled={updateUserMutation.isPending}
                  className="flex-1 bg-gradient-to-r from-[#D4AF37] to-[#C8A882] text-white"
                >
                  {updateUserMutation.isPending ? 'Salvando...' : 'Salvar Alterações'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Version Modal */}
      <AnimatePresence>
        {showVersionModal && (
          <Dialog open={showVersionModal} onOpenChange={setShowVersionModal}>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="font-serif text-2xl flex items-center gap-2">
                  <Package className="w-6 h-6 text-indigo-600" />
                  Criar Nova Versão
                </DialogTitle>
                <DialogDescription>
                  Crie uma nova versão. Ao publicar ou agendar, TODOS os usuários serão notificados por email.
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4 py-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Versão *</Label>
                    <Input
                      value={versionFormData.versao}
                      onChange={(e) => setVersionFormData({...versionFormData, versao: e.target.value})}
                      placeholder="Ex: 1.2.0"
                      className="border-[#E8DCC4]"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Tipo de Release *</Label>
                    <Select 
                      value={versionFormData.tipo_release} 
                      onValueChange={(v) => setVersionFormData({...versionFormData, tipo_release: v})}
                    >
                      <SelectTrigger className="border-[#E8DCC4]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="major">Major (mudanças grandes)</SelectItem>
                        <SelectItem value="minor">Minor (novas features)</SelectItem>
                        <SelectItem value="patch">Patch (correções)</SelectItem>
                        <SelectItem value="hotfix">Hotfix (urgente)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="p-4 bg-purple-50 rounded-lg border-2 border-purple-200 space-y-3">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-purple-600" />
                    <h4 className="font-semibold text-purple-800">✨ Gerar Descrição Amigável com IA</h4>
                  </div>
                  
                  <div className="space-y-2">
                    <Label className="text-purple-700">Descreva as mudanças técnicas que você fez</Label>
                    <Textarea
                      value={versionFormData.mudancas_tecnicas}
                      onChange={(e) => setVersionFormData({...versionFormData, mudancas_tecnicas: e.target.value})}
                      placeholder="Ex: Adicionei gerador de descrição com IA no painel de versões, corrigi bug no filtro de cidades do DrBeleza, melhorei layout dos emails de notificação"
                      className="border-purple-300 h-24"
                    />
                  </div>

                  <Button
                    type="button"
                    onClick={handleGenerateChangelogWithAI}
                    disabled={generatingAI || !versionFormData.mudancas_tecnicas || !versionFormData.versao}
                    className="w-full bg-gradient-to-r from-purple-500 to-purple-600 text-white"
                  >
                    {generatingAI ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                        Gerando descrição empolgante para os usuários...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4 mr-2" />
                        Transformar em Descrição Amigável com IA
                      </>
                    )}
                  </Button>
                  
                  <p className="text-xs text-purple-700">
                    💡 A IA vai transformar detalhes técnicos em uma mensagem empolgante e fácil de entender para os usuários!
                  </p>
                </div>

                <div className="space-y-2">
                  <Label>Changelog (Descrição que será enviada por email) *</Label>
                  <Textarea
                    value={versionFormData.changelog}
                    onChange={(e) => setVersionFormData({...versionFormData, changelog: e.target.value})}
                    placeholder="Descrição amigável que os usuários verão no email..."
                    className="border-[#E8DCC4] h-40"
                  />
                  <p className="text-xs text-gray-500">
                    💡 Use a IA acima para gerar automaticamente uma descrição empolgante!
                  </p>
                </div>

                <div className="p-4 bg-blue-50 rounded-lg border-2 border-blue-200">
                  <p className="text-sm text-blue-800">
                    <strong>📧 Notificação Automática:</strong> Ao publicar ou agendar esta versão, 
                    <strong> TODOS os {stats.total} usuários</strong> cadastrados receberão um email profissional 
                    informando sobre a atualização com a descrição acima.
                  </p>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setShowVersionModal(false);
                      setVersionFormData({
                        versao: "",
                        tipo_release: "patch",
                        changelog: "",
                        mudancas_tecnicas: "",
                        arquivos_alterados: [],
                        data_agendada: "",
                      });
                    }}
                    className="flex-1"
                  >
                    Cancelar
                  </Button>
                  <Button
                    onClick={handleCreateVersion}
                    disabled={createVersionMutation.isPending}
                    className="flex-1 bg-gradient-to-r from-indigo-500 to-indigo-600 text-white"
                  >
                    {createVersionMutation.isPending ? 'Criando...' : 'Criar Versão'}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </AnimatePresence>

      {/* Banner Modal */}
      <AnimatePresence>
        {showBannerModal && (
          <Dialog open={showBannerModal} onOpenChange={setShowBannerModal}>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="font-serif text-2xl flex items-center gap-2">
                  <Megaphone className="w-6 h-6 text-purple-600" />
                  Criar Novo Banner/Anúncio
                </DialogTitle>
                <DialogDescription>
                  Crie um banner que será exibido como pop-up para os usuários
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4 py-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Título *</Label>
                    <Input
                      value={bannerFormData.titulo}
                      onChange={(e) => setBannerFormData({...bannerFormData, titulo: e.target.value})}
                      placeholder="Ex: Promoção Imperdível!"
                      className="border-[#E8DCC4]"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Tipo de Banner *</Label>
                    <Select 
                      value={bannerFormData.tipo_banner} 
                      onValueChange={(v) => setBannerFormData({...bannerFormData, tipo_banner: v})}
                    >
                      <SelectTrigger className="border-[#E8DCC4]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="informativo">Informativo</SelectItem>
                        <SelectItem value="promocional">Promocional</SelectItem>
                        <SelectItem value="urgente">Urgente</SelectItem>
                        <SelectItem value="aviso">Aviso</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Descrição *</Label>
                  <Textarea
                    value={bannerFormData.descricao}
                    onChange={(e) => setBannerFormData({...bannerFormData, descricao: e.target.value})}
                    placeholder="Descreva o anúncio de forma clara e atrativa..."
                    className="border-[#E8DCC4] h-32"
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>URL da Imagem (opcional)</Label>
                    <Input
                      value={bannerFormData.imagem}
                      onChange={(e) => setBannerFormData({...bannerFormData, imagem: e.target.value})}
                      placeholder="https://..."
                      className="border-[#E8DCC4]"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Link de Ação (opcional)</Label>
                    <Input
                      value={bannerFormData.link_acao}
                      onChange={(e) => setBannerFormData({...bannerFormData, link_acao: e.target.value})}
                      placeholder="https://..."
                      className="border-[#E8DCC4]"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Texto do Botão</Label>
                    <Input
                      value={bannerFormData.texto_botao}
                      onChange={(e) => setBannerFormData({...bannerFormData, texto_botao: e.target.value})}
                      placeholder="Ex: Saiba Mais"
                      className="border-[#E8DCC4]"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Duração Mínima (segundos) *</Label>
                    <Input
                      type="number"
                      min="5"
                      value={bannerFormData.duracao_minima}
                      onChange={(e) => setBannerFormData({...bannerFormData, duracao_minima: parseInt(e.target.value) || 5})}
                      className="border-[#E8DCC4]"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Prioridade</Label>
                    <Input
                      type="number"
                      min="1"
                      value={bannerFormData.prioridade}
                      onChange={(e) => setBannerFormData({...bannerFormData, prioridade: parseInt(e.target.value) || 1})}
                      className="border-[#E8DCC4]"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Público Alvo *</Label>
                    <Select 
                      value={bannerFormData.publico_alvo} 
                      onValueChange={(v) => setBannerFormData({...bannerFormData, publico_alvo: v})}
                    >
                      <SelectTrigger className="border-[#E8DCC4]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="todos">Todos os Usuários</SelectItem>
                        <SelectItem value="paciente">Todos os Pacientes</SelectItem>
                        <SelectItem value="profissional">Todos os Profissionais</SelectItem>
                        <SelectItem value="paciente-light">Pacientes Light+</SelectItem>
                        <SelectItem value="paciente-gold">Pacientes Gold+</SelectItem>
                        <SelectItem value="paciente-vip">Pacientes VIP</SelectItem>
                        <SelectItem value="profissional-light">Profissionais Light+</SelectItem>
                        <SelectItem value="profissional-gold">Profissionais Gold+</SelectItem>
                        <SelectItem value="profissional-vip">Profissionais VIP</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Status *</Label>
                    <Select 
                      value={bannerFormData.status} 
                      onValueChange={(v) => setBannerFormData({...bannerFormData, status: v})}
                    >
                      <SelectTrigger className="border-[#E8DCC4]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ativo">Ativo (exibir agora)</SelectItem>
                        <SelectItem value="inativo">Inativo</SelectItem>
                        <SelectItem value="agendado">Agendado</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Data de Início (opcional)</Label>
                    <Input
                      type="datetime-local"
                      value={bannerFormData.data_inicio}
                      onChange={(e) => setBannerFormData({...bannerFormData, data_inicio: e.target.value})}
                      className="border-[#E8DCC4]"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Data de Fim (opcional)</Label>
                    <Input
                      type="datetime-local"
                      value={bannerFormData.data_fim}
                      onChange={(e) => setBannerFormData({...bannerFormData, data_fim: e.target.value})}
                      className="border-[#E8DCC4]"
                    />
                  </div>
                </div>

                <div className="p-4 bg-purple-50 rounded-lg border-2 border-purple-200">
                  <p className="text-sm text-purple-800">
                    <strong>💡 Dica:</strong> O banner será exibido automaticamente para todos os usuários do público-alvo que ainda não o visualizaram. 
                    O usuário só poderá fechar após {bannerFormData.duracao_minima} segundos.
                  </p>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setShowBannerModal(false);
                      setBannerFormData({
                        titulo: "",
                        descricao: "",
                        imagem: "",
                        link_acao: "",
                        texto_botao: "",
                        duracao_minima: 5,
                        tipo_banner: "informativo",
                        publico_alvo: "todos",
                        status: "ativo",
                        data_inicio: "",
                        data_fim: "",
                        prioridade: 1
                      });
                    }}
                    className="flex-1"
                  >
                    Cancelar
                  </Button>
                  <Button
                    onClick={handleCreateBanner}
                    disabled={createBannerMutation.isPending}
                    className="flex-1 bg-gradient-to-r from-purple-500 to-purple-600 text-white"
                  >
                    {createBannerMutation.isPending ? 'Criando...' : 'Criar Banner'}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </AnimatePresence>

      {/* Test Account Modal */}
      <AnimatePresence>
        {showTestAccountModal && (
          <Dialog open={showTestAccountModal} onOpenChange={setShowTestAccountModal}>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="font-serif text-2xl flex items-center gap-2">
                  <UserPlus className="w-6 h-6 text-green-600" />
                  Criar Conta Teste (7 dias)
                </DialogTitle>
                <DialogDescription>
                  Crie uma conta com acesso temporário de 7 dias. Após este período, o usuário será notificado e a conta suspensa.
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4 py-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Nome Completo *</Label>
                    <Input
                      value={testAccountFormData.full_name}
                      onChange={(e) => setTestAccountFormData({...testAccountFormData, full_name: e.target.value})}
                      placeholder="Ex: João Silva"
                      className="border-[#E8DCC4]"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Email *</Label>
                    <Input
                      type="email"
                      value={testAccountFormData.email}
                      onChange={(e) => setTestAccountFormData({...testAccountFormData, email: e.target.value})}
                      placeholder="email@exemplo.com"
                      className="border-[#E8DCC4]"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Telefone/WhatsApp</Label>
                    <Input
                      value={testAccountFormData.telefone}
                      onChange={(e) => setTestAccountFormData({...testAccountFormData, telefone: e.target.value})}
                      placeholder="(00) 00000-0000"
                      className="border-[#E8DCC4]"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Senha *</Label>
                    <Input
                      type="text"
                      value={testAccountFormData.password}
                      onChange={(e) => setTestAccountFormData({...testAccountFormData, password: e.target.value})}
                      placeholder="Senha temporária"
                      className="border-[#E8DCC4]"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Tipo de Usuário *</Label>
                  <Select 
                    value={testAccountFormData.tipo_usuario} 
                    onValueChange={(v) => setTestAccountFormData({...testAccountFormData, tipo_usuario: v})}
                  >
                    <SelectTrigger className="border-[#E8DCC4]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="visitante">Visitante</SelectItem>
                      <SelectItem value="paciente">Paciente</SelectItem>
                      <SelectItem value="profissional">Profissional</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="p-4 bg-green-50 rounded-lg border-2 border-green-200">
                  <h4 className="font-semibold text-green-800 mb-2">Planos de Acesso</h4>
                  <p className="text-sm text-green-700 mb-3">
                    Selecione os planos que esta conta teste terá acesso:
                  </p>
                  
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label className="text-green-700">Club da Beleza</Label>
                      <Select 
                        value={testAccountFormData.clube_plano} 
                        onValueChange={(v) => setTestAccountFormData({...testAccountFormData, clube_plano: v})}
                      >
                        <SelectTrigger className="border-green-300">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">Sem Plano</SelectItem>
                          <SelectItem value="light">Light</SelectItem>
                          <SelectItem value="gold">Gold</SelectItem>
                          <SelectItem value="vip">VIP</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-green-700">Clube+ (Beauty Club)</Label>
                      <Select 
                        value={testAccountFormData.beauty_club_plano} 
                        onValueChange={(v) => setTestAccountFormData({...testAccountFormData, beauty_club_plano: v})}
                      >
                        <SelectTrigger className="border-green-300">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">Sem Plano</SelectItem>
                          <SelectItem value="basic">Basic</SelectItem>
                          <SelectItem value="pro">Pro</SelectItem>
                          <SelectItem value="exclusive">Exclusive</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-green-700">EdBeauty</Label>
                      <Select 
                        value={testAccountFormData.edbeauty_plano} 
                        onValueChange={(v) => setTestAccountFormData({...testAccountFormData, edbeauty_plano: v})}
                      >
                        <SelectTrigger className="border-green-300">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">Sem Plano</SelectItem>
                          <SelectItem value="basic">Basic</SelectItem>
                          <SelectItem value="pro">Pro</SelectItem>
                          <SelectItem value="premium">Premium</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 p-3 bg-purple-50 rounded-lg">
                  <input
                    type="checkbox"
                    id="test_golden_doctor"
                    checked={testAccountFormData.is_golden_doctor}
                    onChange={(e) => setTestAccountFormData({...testAccountFormData, is_golden_doctor: e.target.checked})}
                    className="w-4 h-4"
                  />
                  <Label htmlFor="test_golden_doctor" className="cursor-pointer">
                    ⭐ Marcar como Golden Doctor
                  </Label>
                </div>

                <div className="p-4 bg-yellow-50 rounded-lg border-2 border-yellow-200">
                  <p className="text-sm text-yellow-800">
                    <strong>⏰ Importante:</strong> Esta conta expirará automaticamente em <strong>7 dias</strong>. 
                    O usuário receberá um email de boas-vindas com as credenciais e, após a expiração, 
                    será notificado por email com instruções de como continuar usando a plataforma.
                  </p>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setShowTestAccountModal(false);
                      setTestAccountFormData({
                        full_name: "",
                        email: "",
                        telefone: "",
                        password: "",
                        tipo_usuario: "paciente",
                        clube_plano: "none",
                        beauty_club_plano: "none",
                        edbeauty_plano: "none",
                        is_golden_doctor: false
                      });
                    }}
                    className="flex-1"
                  >
                    Cancelar
                  </Button>
                  <Button
                    onClick={handleCreateTestAccount}
                    disabled={createTestAccountMutation.isPending}
                    className="flex-1 bg-gradient-to-r from-green-500 to-green-600 text-white"
                  >
                    {createTestAccountMutation.isPending ? 'Criando...' : 'Criar Conta Teste'}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </AnimatePresence>

      {/* User Details Modal */}
      {showDetailsModal && selectedUser && (
        <UserDetailsModal
          user={selectedUser}
          onClose={() => {
            setShowDetailsModal(false);
            setSelectedUser(null);
          }}
        />
      )}
    </div>
  );
}