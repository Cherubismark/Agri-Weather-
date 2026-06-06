require('dotenv').config();
const express = require('express');
const multer = require('multer');

const app = express();
const upload = multer();
const PORT = process.env.PORT || 3000;
const API_KEY = process.env.WEATHER_API_KEY;

// for public folder
app.use(express.static('public'));


app.get('/weather', async (req, res) => {
  const { lat, lon } = req.query;

  if (!lat || !lon) {
    return res.status(400).json({ error: 'lat and lon are required' });
  }

  try {
    const response = await fetch(
      `https://api.weather-ai.co/v1/weather?lat=${lat}&lon=${lon}&days=7&units=metric`,
      { headers: { Authorization: `Bearer ${API_KEY}` } }
    );
    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch weather data' });
  }
});

// Tree/canopy analysis
app.post('/trees', upload.single('image'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No image uploaded' });
  }

  try {
    const formData = new FormData();
    const blob = new Blob([req.file.buffer], { type: req.file.mimetype });
    formData.append('image', blob, req.file.originalname);

    // Optional fields if user filled them
    if (req.body.county) formData.append('county', req.body.county);
    if (req.body.landAcres) formData.append('landAcres', req.body.landAcres);

    const response = await fetch('https://api.weather-ai.co/v1/trees/analyze', {
      method: 'POST',
      headers: { Authorization: `Bearer ${API_KEY}` },
      body: formData,
    });
    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to analyze image' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});