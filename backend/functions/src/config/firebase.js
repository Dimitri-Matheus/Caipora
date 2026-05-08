const admin = require('firebase-admin');


// Inicializa a conexão com o Firebase usando as credenciais nativas do Google Cloud.
// Manter isso em um arquivo separado evita que o Firebase seja inicializado mais de uma vez.
admin.initializeApp();

module.exports = admin;