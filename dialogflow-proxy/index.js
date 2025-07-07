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
const axios = require('axios');

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
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ error: 'Message is required' });
  }

  // const sessionId = uuid.v4();
  // Try to get sessionId from request header, fallback to random
const sessionId = req.headers['x-session-id'] || uuid.v4();

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

    const intentName = result.intent?.displayName;
    const fulfillment = result.fulfillmentText;
    const orderId = result.parameters?.fields?.['order-id']?.stringValue;

    console.log('🎯 Matched Intent:', intentName);
    console.log('🧠 Fulfillment:', fulfillment);

    // Handle real-time order status
    if (intentName === 'Track Order - Order ID Provided' && orderId) {
      console.log(`🔍 Fetching real-time status for Order ID: ${orderId}`);
      try {
        const orderResponse = await axios.get(`http://localhost:8080/api/orders/status/${orderId}`);
        console.log('✅ Raw response from backend:', orderResponse.data);
        const status = orderResponse.data || 'Unknown';
        return res.json({
          reply: `Order ${orderId} is currently: ${status}.`,
          details: {
            responseMessages: result.fulfillmentMessages || []
          }
        });
      } catch (apiErr) {
        console.error('❌ Order API Error:', apiErr.message);
        return res.json({
          reply: `Sorry, I couldn’t fetch the status of order ${orderId}. Please try again later.`,
          details: {
            responseMessages: result.fulfillmentMessages || []
          }
        });
      }
    }

    if (intentName === 'CancelOrder - Order ID Provided') {

      if (orderId) {
        try {
          const statusResponse = await axios.get(`http://localhost:8080/api/orders/status/${orderId}`);
          const status = statusResponse.data || 'Unknown';

          if (['PREPARING', 'OUT_FOR_DELIVERY', 'DELIVERED'].includes(status)) {
            return res.json({
              reply: `Sorry, order #${orderId} is already ${status} and cannot be cancelled.`,
            });
          }

          // Cancel order
          await axios.post(`http://localhost:8080/api/orders/${orderId}/cancel`);

          return res.json({
            reply: `Order #${orderId} has been successfully cancelled.`,
          });

        } catch (error) {
          console.error('❌ Cancel Error:', error.message);
          return res.json({
            reply: `Couldn't cancel order #${orderId}. Please try again later.`,
          });
        }
      } else {
        return res.json({ reply: 'Please provide a valid order ID.' });
      }
    }


    res.json({
      reply: fulfillment,
      sessionId,
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
