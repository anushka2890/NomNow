process.on('uncaughtException', (err) => {
  console.error('🔥 Uncaught Exception:', err);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('🔥 Unhandled Rejection:', reason);
});

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const dialogflow = require('@google-cloud/dialogflow');
const uuid = require('uuid');

const app = express();
app.use(bodyParser.json());
app.use(cors({ origin: 'http://localhost:4200' }));

// Load service account key
const CREDENTIALS = require('./nombot-pxjs-00682845052c.json');
const PROJECT_ID = CREDENTIALS.project_id;

const sessionClient = new dialogflow.SessionsClient({
  credentials: {
    private_key: CREDENTIALS.private_key,
    client_email: CREDENTIALS.client_email,
  },
});
app.use((req, res, next) => {
  console.log(`➡️ Received ${req.method} request to ${req.url}`);
  next();
});
app.get('/ping', (req, res) => {
  console.log('✅ /ping route hit');
  res.send('pong');
});

app.post('/chat', async (req, res) => {
    console.log('📨 Body:', req.body);
  console.log('📨 Headers:', req.headers);
  const { message } = req.body;
  if (!message) {
    return res.status(400).json({ error: 'Message is required' });
  }

  const sessionId = uuid.v4();
  const sessionPath = `projects/${PROJECT_ID}/agent/sessions/${sessionId}`;

  const request = {
    session: sessionPath,
    queryInput: {
      text: {
        text: message,
        languageCode: 'en-US',
      },
    },
  };

  try {
    const responses = await sessionClient.detectIntent(request);
    const result = responses[0].queryResult;
    res.json({
      reply: result.fulfillmentText,
      details: {
        responseMessages: result.fulfillmentMessages || []
      }
    });

    console.log('🎯 Full Dialogflow response:', JSON.stringify(result, null, 2));

  } catch (err) {
    console.error('🛑 Dialogflow Error:');
  console.dir(err, { depth: null });
  res.status(500).json({ error: 'Dialogflow error', details: err });
    }
});

const PORT = process.env.PORT || 5007;
app.listen(PORT, () => {
  console.log(`🟢 Dialogflow Proxy running on port ${PORT}`);
});
console.log("👂 Express server initialized and listening...");