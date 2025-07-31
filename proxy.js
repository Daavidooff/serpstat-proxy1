```javascript
const express = require('express');
const fetch = require('node-fetch');
const axios = require('axios');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

app.post('/proxy', async (req, res) => {
    try {
        const token = process.env.SERPSTAT_TOKEN;
        if (!token) {
            throw new Error('SERPSTAT_TOKEN not set in environment variables');
        }
        console.log('Request body:', req.body);
        const response = await fetch(`https://api.serpstat.com/v4/?token=${token}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(req.body)
        });
        const responseText = await response.text();
        console.log('Serpstat response:', responseText);
        if (!response.ok) {
            throw new Error(`Serpstat API error: ${response.status}. Details: ${responseText}`);
        }
        const data = JSON.parse(responseText);
        res.json(data);
    } catch (error) {
        console.error('Proxy error:', error.message);
        res.status(500).json({ error: error.message });
    }
});

app.post('/fetch-page', async (req, res) => {
    const { url } = req.body;
    try {
        const response = await axios.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            },
            timeout: 10000 // 10 секунд таймаут
        });
        res.send(response.data);
    } catch (error) {
        console.error(`Error fetching ${url}: ${error.message}`);
        res.status(500).json({ error: 'Не вдалося отримати сторінку' });
    }
});

const port = process.env.PORT || 10000;
app.listen(port, () => console.log(`Proxy running on port ${port}`));
```