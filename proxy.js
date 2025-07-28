```javascript
const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const SERPSTAT_API_URL = 'https://api.serpstat.com/v3';
const SERPSTAT_TOKEN = process.env.SERPSTAT_TOKEN;

app.post('/proxy', async (req, res) => {
    if (!SERPSTAT_TOKEN) {
        console.error('Proxy error: SERPSTAT_TOKEN not set');
        return res.status(500).json({ error: 'Server configuration error: API token missing' });
    }

    try {
        console.log('Request body:', JSON.stringify(req.body, null, 2));

        const requestBody = {
            id: req.body.id,
            method: req.body.method,
            params: {
                ...req.body.params,
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
        console.log('Serpstat response:', JSON.stringify(data, null, 2));

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
    console.log(`Proxy server running on port ${port}`);
});
```