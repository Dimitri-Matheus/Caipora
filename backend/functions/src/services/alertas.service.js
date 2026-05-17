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

exports.listar = async () => {
  const snapshot = await db.collection('historico_eventos').orderBy('timestamp', 'desc').limit(5).get();
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

exports.obterPorId = async (alertaId) => {
  const doc = await db.collection('historico_eventos').doc(alertaId).get();
  if (!doc.exists) throw new Error('Alerta não encontrado ʕ•́ᴥ•̀ʔっ');
  return { id: doc.id, ...doc.data() };
};

exports.obterDadosAnalytics = async () => {
    // 1. Busca todos os alertas (substitua 'alertas' pelo nome exato da sua coleção se for diferente, ex: 'historico_eventos')
    const snapshot = await db.collection('historico_eventos').orderBy('timestamp', 'desc').limit(15).get(); 
    const alertas = snapshot.docs.map(doc => doc.data());

    const contagemPorDia = {};

    // 2. Agrupa os alertas pela data (DD/MM)
    alertas.forEach(alerta => {
        if (!alerta.timestamp) return;

        // Converte o timestamp do Firebase para objeto Date
        const data = new Date(alerta.timestamp._seconds * 1000);
        
        // Formata para "DD/MM" para ficar elegante no eixo X do gráfico
        const dia = data.getDate().toString().padStart(2, '0');
        const mes = (data.getMonth() + 1).toString().padStart(2, '0');
        const diaMes = `${dia}/${mes}`;

        // Soma +1 no dia correspondente
        contagemPorDia[diaMes] = (contagemPorDia[diaMes] || 0) + 1;
    });

    // 3. Transforma o objeto num array estruturado
    const resultado = Object.keys(contagemPorDia).map(data => ({
        data: data,
        total: contagemPorDia[data]
    }));

    // Retorna algo como: [ { data: '14/05', total: 3 }, { data: '15/05', total: 8 } ]
    return resultado;
};

