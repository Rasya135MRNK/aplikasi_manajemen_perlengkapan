const https = require('https');

const WAHA_API_URL = process.env.WAHA_API_URL || 'http://localhost:3002';
const WAHA_API_KEY = process.env.WAHA_API_KEY || '';

async function sendMessage(to, message) {
  try {
    const url = new URL('/api/sendText', WAHA_API_URL);
    const body = JSON.stringify({
      session: 'default',
      chatId: to.includes('@') ? to : `${to}@c.us`,
      text: message,
    });

    const response = await fetch(url.toString(), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': WAHA_API_KEY,
      },
      body,
    });

    if (!response.ok) {
      throw new Error(`Waha API error: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Failed to send WhatsApp message:', error.message);
    return null;
  }
}

module.exports = { sendMessage };
