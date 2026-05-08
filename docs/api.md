# **Como funciona o sistema de alertas?**

<details>
  <summary><strong>Alerta criado pelo ESP32</strong></summary>

- O dispositivo envia um POST para:
  ```
  https://api-cvehu2aruq-uc.a.run.app/alertas
  ```
- O sistema registra o alerta na coleção `historico_eventos` com:
  - `resolvido: false` (inicialmente não resolvido).
  - O sensor muda seu status para `'alertando'`.

</details>

<details>
  <summary><strong>Alerta resolvido pelo frontend</strong></summary>

- O usuário (ou app) envia um PATCH para:
  ```
  https://api-cvehu2aruq-uc.a.run.app/alertas/:id_do_alerta/resolver
  ```
- No corpo da requisição, envia:
  ```json
  { "sensor_id": "CAI-01" }
  ```
- O sistema atualiza:
  - `resolvido: true` no alerta.
  - Adiciona `data_resolucao` (horário da resolução).
  - O sensor volta para `'normal'` (se necessário).

</details>

---

### **Estrutura dos dados**

#### Coleção sensores

| **Campo**        | **Tipo**               | **Descrição**                            |
| ---------------------- | ---------------------------- | ------------------------------------------------ |
| `localizacao`        | `{ latitude, longitude }`  | Coordenadas geográficas (GeoPoint do Firebase). |
| `status_atual`       | `normal/alertando/offline` | Estado atual do sensor.                          |
| `ultima_atualizacao` | `Firebase Timestamp`       | Horário da última atualização.               |
| `ultimo_alerta_id`   | `string`                   | ID do alerta mais recente que alterou o status.  |

#### Coleção historico_eventos

| **Campo** | **Tipo**         | **Descrição**                                               |
| --------------- | ---------------------- | ------------------------------------------------------------------- |
| `sensor_id`   | `string`             | ID do sensor que gerou o evento.                                    |
| `resolvido`   | `boolean`            | Estado inicial:`false` (atualiza para `true` ao ser resolvido). |
| `timestamp`   | `Firebase Timestamp` | Momento em que o evento foi registrado.                             |

### **Endpoints da API RESTful**

#### **Rotas para Consulta (GET)**

- **`GET /alertas`**:
  Retorna uma lista de todos os alertas armazenados em `historico_eventos`, podendo filtrar por `sensor_id` (ex: `GET /alertas?sensor_id=CAI-01`).
- **`GET /alertas/:id`**:
  Retorna detalhes específicos de um alerta (ex: `GET /alertas/AL123`), incluindo:

  - `tipo_som`, `precisao`, `timestamp`, `resolvido`, e `data_resolucao` (se aplicável).

#### **Rotas para Ação (POST/PATCH)**

- **`POST /alertas`**:
  Criado pelo ESP32 para enviar um novo alerta (ex: `sensor_id`, `tipo_som`, `precisao`).
- **`PATCH /alertas/:id_do_alerta/resolver`**:
  Usado pelo frontend para marcar um alerta como resolvido. O corpo da requisição deve conter:

  ```json
  { "sensor_id": "CAI-01" }
  ```
  Após resolver, o campo `resolvido` passa para `true` e `data_resolucao` é adicionado automaticamente.
