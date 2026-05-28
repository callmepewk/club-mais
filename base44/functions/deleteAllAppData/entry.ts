import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);

    const entities = [
      'CartaoSolicitacao',
      'PageView',
      'NewsArticle',
      'EventRegistration',
      'CardAccount',
      'CardEvent',
      'PixTransaction',
      'AppVersion',
      'EstabelecimentoParceiro',
      'EdBeautyContent',
      'AvatarData',
      'Evento',
      'UpdateNotification',
      'Banner',
    ];

    const results = {};

    for (const entityName of entities) {
      try {
        const records = await base44.asServiceRole.entities[entityName].list();
        const deletePromises = records.map(r => 
          base44.asServiceRole.entities[entityName].delete(r.id).catch(() => {})
        );
        await Promise.all(deletePromises);
        results[entityName] = `${records.length} registros excluídos`;
      } catch (e) {
        results[entityName] = `Erro: ${e.message}`;
      }
    }

    return Response.json({ 
      status: 'concluido', 
      mensagem: 'Exclusão total executada com sucesso.',
      timestamp: new Date().toISOString(),
      detalhes: results
    });

  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});