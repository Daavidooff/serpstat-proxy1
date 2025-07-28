const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const SERPSTAT_API_URL = 'https://api.serpstat.com/v4';
const SERPSTAT_TOKEN = process.env.SERPSTAT_TOKEN;

// Логування для перевірки токена
console.log('🛠️ Loaded SERPSTAT_TOKEN:', SERPSTAT_TOKEN ? '✅ OK' : '❌ MISSING');

app.post('/proxy', async (req, res) => {
    if (!SERPSTAT_TOKEN) {
        console.error('Proxy error: SERPSTAT_TOKEN not set');
        return res.status(500).json({ error: 'Server configuration error: API token missing. Please check Render Environment Variables.' });
    }

    try {
        console.log('📩 Request body:', JSON.stringify(req.body, null, 2));

        const requestBody = {
            id: req.body.id,
            method: req.body.method,
            params: {
                ...(req.body.params || {}),
                token: SERPSTAT_TOKEN
            }
        };

        const response = await fetch(SERPSTAT_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(requestBody)
        });

        const data = await response.json();
        console.log('📬 Serpstat response:', JSON.stringify(data, null, 2));

        if (data?.error?.code === 32000) {
            console.error('API error: Missing or invalid token');
            return res.status(400).json({ error: 'Invalid or missing API token. Please verify SERPSTAT_TOKEN.' });
        }

        if (data?.result?.remaining_credits === 0) {
            console.warn('No remaining credits');
            return res.status(429).json({ error: 'Ліміт запитів до API вичерпано. Спробуйте пізніше.' });
        }

        if (!response.ok) {
            console.error(`Proxy error: HTTP ${response.status}, Response: ${JSON.stringify(data)}`);
            return res.status(response.status).json(data);
        }

        res.json(data);
    } catch (error) {
        console.error('Proxy error:', error.message, 'Stack:', error.stack);
        res.status(500).json({ error: `Proxy error: ${error.message}` });
    }
});

app.listen(port, () => {
    console.log(`🚀 Proxy server running on port ${port}`);
});