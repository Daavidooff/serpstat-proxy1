const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;
const API_TOKEN = 'bf37b1d58481e708c48ca6f3c0b6718d';  // Заміни на свій токен
const API_URL = 'https://api.serpstat.com/v4/';

app.use(cors());
app.use(express.json());

app.post('/serpstat', async (req, res) => {
  try {
    const response = await fetch(`${API_URL}?token=${API_TOKEN}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req.body),
    });
    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
