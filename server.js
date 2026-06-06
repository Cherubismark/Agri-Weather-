require('dotenv').config();
const express = require('express');
const multer = require('multer');

const app = express();
const upload = multer();
const PORT = process.env.PORT || 3000;
const API_KEY = process.env.WEATHER_API_KEY;


app.use(express.json());
app.use(express.static('public'));

const recentAlerts = [];

// Route to fetch weather data
app.get('/weather', async (req, res) => {
  const { lat, lon } = req.query;
  if (!lat || !lon) return res.status(400).json({ error: 'lat and lon are required' });

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

// Tree/Canopy analysis
app.post('/trees', upload.single('image'), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No image uploaded' });

  try {
    const formData = new FormData();
    const blob = new Blob([req.file.buffer], { type: req.file.mimetype });
    formData.append('image', blob, req.file.originalname);
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


// ── Webhook settings (stored in memory) ────────────────────
let webhookSettings = {
  city: '',
  lat: null,
  lon: null,
  alerts: {
    heavy_rain: false,
    storm: false,
    extreme_heat: false,
    frost: false,
    high_windspeed: false,
  }
};

// Save settings + register with WeatherAI
app.post('/webhook/settings', async (req, res) => {
  const { city, lat, lon, alerts } = req.body;

  if (!lat || !lon) return res.status(400).json({ error: 'Location is required' });

  // Save to memory
  webhookSettings = { city, lat, lon, alerts };
  console.log('Webhook settings saved:', webhookSettings);

  try {
    // Register with WeatherAI
    const response = await fetch('https://api.weather-ai.co/v1/webhooks', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        url: `${req.protocol}://${req.get('host')}/webhook`,
        lat,
        lon,
        alerts,
      }),
    });

    const data = await response.json();
    res.json({ success: true, settings: webhookSettings, apiResponse: data });
  } catch (error) {
    // Still save settings even if API registration fails
    res.json({ success: true, settings: webhookSettings, warning: 'Saved locally but WeatherAI registration failed' });
  }
});

app.get('/webhook/settings', (req, res) => {
  res.json(webhookSettings);
});


// WeatherAI calls this URL when a weather alert is triggered
app.post('/webhook', (req, res) => {
  const alert = req.body;
  console.log('Webhook alert received:', JSON.stringify(alert, null, 2));


  recentAlerts.unshift({
    ...alert,
    receivedAt: new Date().toLocaleString()
  });

// Keep only the last 10 alerts
  if (recentAlerts.length > 10) recentAlerts.pop();
  res.status(200).json({ received: true });
});


app.get('/alerts', (req, res) => {
  res.json(recentAlerts);
});

// Visit http://localhost:3000/webhook/test in your browser to test
app.get('/webhook/test', (req, res) => {
  const fakeAlert = {
    type: 'heavy_rain',
    location: 'Nairobi, Kenya',
    severity: 'high',
    message: 'Heavy rainfall expected. Avoid low-lying farm areas.',
    timestamp: new Date().toISOString(),
    receivedAt: new Date().toLocaleString()
  };

  recentAlerts.unshift(fakeAlert);
  if (recentAlerts.length > 10) recentAlerts.pop();
  console.log('Test webhook triggered:', fakeAlert);
  res.json({ success: true, alert: fakeAlert });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});