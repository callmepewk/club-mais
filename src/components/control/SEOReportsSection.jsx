import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BarChart3, TrendingUp, Users, MousePointer, Eye, Clock, Globe, Smartphone, FileDown } from "lucide-react";

const generateSEOPDF = (stats) => {
  const html = `<!DOCTYPE html><html><head><title>Relatório SEO - Club da Beleza</title><style>
    body{font-family:Arial,sans-serif;margin:30px;color:#333}
    h1{color:#D4AF37;border-bottom:2px solid #D4AF37;padding-bottom:10px}
    h2{color:#666;margin-top:30px}
    .stats-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:15px;margin:20px 0}
    .stat-box{background:#f5f5f5;padding:15px;border-radius:8px;text-align:center}
    .stat-value{font-size:24px;font-weight:bold;color:#D4AF37}
    .stat-label{font-size:12px;color:#666}
    table{width:100%;border-collapse:collapse;margin:15px 0}
    th,td{border:1px solid #ddd;padding:10px;text-align:left}
    th{background:#D4AF37;color:white}
    .bar{height:20px;background:linear-gradient(to right,#D4AF37,#C8A882);border-radius:4px}
    .footer{margin-top:40px;text-align:center;color:#999;font-size:11px}
  </style></head><body>
    <h1>📊 Relatório SEO e Analytics</h1>
    <p>Gerado em: ${new Date().toLocaleString('pt-BR')}</p>
    
    <h2>Métricas Principais</h2>
    <div class="stats-grid">
      <div class="stat-box"><div class="stat-value">${stats.pageViews.toLocaleString()}</div><div class="stat-label">Visualizações</div></div>
      <div class="stat-box"><div class="stat-value">${stats.uniqueVisitors.toLocaleString()}</div><div class="stat-label">Visitantes Únicos</div></div>
      <div class="stat-box"><div class="stat-value">${stats.bounceRate}%</div><div class="stat-label">Taxa de Rejeição</div></div>
      <div class="stat-box"><div class="stat-value">${Math.floor(stats.avgSessionDuration/60)}m ${stats.avgSessionDuration%60}s</div><div class="stat-label">Tempo Médio</div></div>
    </div>

    <h2>Páginas Mais Visitadas</h2>
    <table><tr><th>#</th><th>Página</th><th>Visualizações</th><th>Variação</th></tr>
    ${stats.topPages.map((p,i) => `<tr><td>${i+1}</td><td>${p.page}</td><td>${p.views}</td><td>${p.change}</td></tr>`).join('')}
    </table>

    <h2>Fontes de Tráfego</h2>
    <table><tr><th>Fonte</th><th>Porcentagem</th><th>Gráfico</th></tr>
    ${stats.trafficSources.map(s => `<tr><td>${s.source}</td><td>${s.percentage}%</td><td><div class="bar" style="width:${s.percentage*2}px"></div></td></tr>`).join('')}
    </table>

    <h2>Dispositivos</h2>
    <table><tr><th>Dispositivo</th><th>Porcentagem</th></tr>
    <tr><td>Mobile</td><td>${stats.deviceStats.mobile}%</td></tr>
    <tr><td>Desktop</td><td>${stats.deviceStats.desktop}%</td></tr>
    <tr><td>Tablet</td><td>${stats.deviceStats.tablet}%</td></tr>
    </table>

    <h2>Visitas da Semana</h2>
    <table><tr><th>Dia</th><th>Visitas</th></tr>
    ${stats.dailyVisits.map(d => `<tr><td>${d.day}</td><td>${d.visits}</td></tr>`).join('')}
    </table>

    <div class="footer"><p>Club da Beleza © ${new Date().getFullYear()} - Relatório Confidencial para Administradores</p></div>
  </body></html>`;
  const w = window.open('', '_blank'); w.document.write(html); w.document.close(); w.print();
};

export default function SEOReportsSection() {
  const [stats, setStats] = useState({
    pageViews: 0,
    uniqueVisitors: 0,
    bounceRate: 0,
    avgSessionDuration: 0,
    topPages: [],
    deviceStats: { desktop: 0, mobile: 0, tablet: 0 },
    trafficSources: [],
    dailyVisits: []
  });

  useEffect(() => {
    // Simulated analytics data - in production would come from real analytics
    const storedViews = parseInt(localStorage.getItem('total_page_views') || '0');
    const storedClicks = parseInt(localStorage.getItem('total_clicks') || '0');
    
    setStats({
      pageViews: storedViews + Math.floor(Math.random() * 500) + 1000,
      uniqueVisitors: Math.floor((storedViews + 1000) * 0.7),
      bounceRate: Math.floor(Math.random() * 30) + 20,
      avgSessionDuration: Math.floor(Math.random() * 180) + 120,
      topPages: [
        { page: "Home", views: Math.floor(Math.random() * 500) + 300, change: "+12%" },
        { page: "Mapa da Estética", views: Math.floor(Math.random() * 400) + 200, change: "+8%" },
        { page: "Dr. Beleza", views: Math.floor(Math.random() * 300) + 150, change: "+15%" },
        { page: "Planos", views: Math.floor(Math.random() * 200) + 100, change: "+5%" },
        { page: "EdBeauty", views: Math.floor(Math.random() * 150) + 80, change: "+3%" },
      ],
      deviceStats: {
        desktop: Math.floor(Math.random() * 20) + 30,
        mobile: Math.floor(Math.random() * 20) + 50,
        tablet: Math.floor(Math.random() * 10) + 5
      },
      trafficSources: [
        { source: "Busca Orgânica", percentage: 45, color: "bg-green-500" },
        { source: "Direto", percentage: 25, color: "bg-blue-500" },
        { source: "Redes Sociais", percentage: 20, color: "bg-purple-500" },
        { source: "Referência", percentage: 10, color: "bg-orange-500" },
      ],
      dailyVisits: Array.from({ length: 7 }, (_, i) => ({
        day: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'][i],
        visits: Math.floor(Math.random() * 200) + 100
      }))
    });

    // Track page view
    localStorage.setItem('total_page_views', String(storedViews + 1));
  }, []);

  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  return (
    <div className="space-y-6">
      <Card className="border-[#E8DCC4]">
        <CardHeader className="bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-t-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <BarChart3 className="w-6 h-6" />
              <CardTitle>Relatórios SEO e Analytics</CardTitle>
            </div>
            <Button onClick={() => generateSEOPDF(stats)} className="bg-white text-orange-600 hover:bg-white/90">
              <FileDown className="w-4 h-4 mr-2" /> Exportar PDF
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          {/* Main Stats */}
          <div className="grid md:grid-cols-4 gap-4 mb-8">
            <Card className="border-blue-200 bg-gradient-to-br from-blue-50 to-white">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                    <Eye className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-blue-600">{stats.pageViews.toLocaleString()}</p>
                    <p className="text-xs text-gray-500">Visualizações</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-green-200 bg-gradient-to-br from-green-50 to-white">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
                    <Users className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-green-600">{stats.uniqueVisitors.toLocaleString()}</p>
                    <p className="text-xs text-gray-500">Visitantes Únicos</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-purple-200 bg-gradient-to-br from-purple-50 to-white">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-purple-600">{stats.bounceRate}%</p>
                    <p className="text-xs text-gray-500">Taxa de Rejeição</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-orange-200 bg-gradient-to-br from-orange-50 to-white">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center">
                    <Clock className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-orange-600">{formatDuration(stats.avgSessionDuration)}</p>
                    <p className="text-xs text-gray-500">Tempo Médio</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Top Pages */}
            <Card className="border-gray-200">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Globe className="w-5 h-5 text-[#D4AF37]" />
                  Páginas Mais Visitadas
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {stats.topPages.map((page, i) => (
                    <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <span className="w-6 h-6 bg-[#D4AF37] text-white rounded-full flex items-center justify-center text-xs font-bold">{i + 1}</span>
                        <span className="font-medium">{page.page}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-gray-600">{page.views}</span>
                        <Badge className="bg-green-100 text-green-700 text-xs">{page.change}</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Traffic Sources */}
            <Card className="border-gray-200">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <MousePointer className="w-5 h-5 text-[#D4AF37]" />
                  Fontes de Tráfego
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {stats.trafficSources.map((source, i) => (
                    <div key={i} className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span className="font-medium">{source.source}</span>
                        <span className="text-gray-600">{source.percentage}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className={`${source.color} h-2 rounded-full transition-all`} style={{ width: `${source.percentage}%` }}></div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Device Stats */}
            <Card className="border-gray-200">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Smartphone className="w-5 h-5 text-[#D4AF37]" />
                  Dispositivos
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-around">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                      <span className="text-xl font-bold text-blue-600">{stats.deviceStats.mobile}%</span>
                    </div>
                    <p className="text-sm text-gray-600">Mobile</p>
                  </div>
                  <div className="text-center">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                      <span className="text-xl font-bold text-green-600">{stats.deviceStats.desktop}%</span>
                    </div>
                    <p className="text-sm text-gray-600">Desktop</p>
                  </div>
                  <div className="text-center">
                    <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
                      <span className="text-xl font-bold text-purple-600">{stats.deviceStats.tablet}%</span>
                    </div>
                    <p className="text-sm text-gray-600">Tablet</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Weekly Chart */}
            <Card className="border-gray-200">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-[#D4AF37]" />
                  Visitas da Semana
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-end justify-between h-32 gap-2">
                  {stats.dailyVisits.map((day, i) => (
                    <div key={i} className="flex flex-col items-center flex-1">
                      <div className="w-full bg-gradient-to-t from-[#D4AF37] to-[#C8A882] rounded-t transition-all" style={{ height: `${(day.visits / 300) * 100}%` }}></div>
                      <span className="text-xs text-gray-500 mt-1">{day.day}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}