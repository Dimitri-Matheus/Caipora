const admin = require('../config/firebase');
const db = admin.firestore();

// Service: O coração do sistema. Contém toda a regra de negócio e a 
// comunicação direta com o banco de dados (Firestore).

exports.criar = async (data) => {
  const { sensor_id, lat, lng, tipo, confianca, status } = data;

  // 1. Prepara o objeto de histórico do evento
  const novoAlerta = {
    sensor_id,
    tipo_som: tipo,
    precisao: confianca,
    timestamp: admin.firestore.FieldValue.serverTimestamp(),
    resolvido: false
  };

  // 2. Salva o alerta na coleção e captura a referência (ID) gerada pelo Firebase
  const alertRef = await db.collection('historico_eventos').add(novoAlerta);

  // 3. Atualiza o status do sensor correspondente no mapa (coleção 'sensores').
  // O uso do { merge: true } garante que não vamos apagar outros dados do sensor acidentalmente.
  await db.collection('sensores').doc(sensor_id).set({
    localizacao: new admin.firestore.GeoPoint(lat, lng),
    status_atual: status,
    ultima_atualizacao: admin.firestore.FieldValue.serverTimestamp(),
    ultimo_alerta_id: alertRef.id
  }, { merge: true });

  return { success: true, id: alertRef.id };
};

exports.resolver = async (alertaId, data) => {
    const { sensor_id } = data;

    // 1. Marca o evento específico como resolvido no histórico e registra o horário
    await db.collection('historico_eventos').doc(alertaId).update({
        resolvido: true,
        data_resolucao: admin.firestore.FieldValue.serverTimestamp()
    });

    // 2. Normaliza o pino do sensor no mapa do Front-end (volta a ficar verde/normal)
    if (sensor_id) {
        await db.collection('sensores').doc(sensor_id).update({
            status_atual: 'normal',
            ultima_atualizacao: admin.firestore.FieldValue.serverTimestamp()
        });
    }
    
    return true;
};