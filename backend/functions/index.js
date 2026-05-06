const functions = require('firebase-functions');
const app = require('./src/app');

// Ponto de entrada do Google Cloud Functions. 
// Empacota toda a aplicação Express e a expõe através de uma infraestrutura serverless.
exports.api = functions.https.onRequest(app);