const express = require('express');
const fetch = require('node-fetch');
const app = express();

app.use(express.json());

app.post('/proxy', async (req, res) => {
    try {
        const response = await fetch(`https://api.serpstat.com/v4/?token=${req.query.token}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(req.body)
        });
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Serpstat API error: ${response.status}. Details: ${errorText}`);
        }
        const data = await response.json();
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Proxy running on port ${port}`));