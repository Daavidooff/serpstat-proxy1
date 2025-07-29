const express = require('express');
const fetch = require('node-fetch');
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

const port = process.env.PORT || 50000;
app.listen(port, () => console.log(`Proxy running on port ${port}`));