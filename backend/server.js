const express = require('express');
const cors = require('cors');
require('dotenv').config();

const generateRoute = require('./routes/generateRoute');

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.use('/api', generateRoute);

// Simple healthcheck
app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

app.listen(port, () => {
  console.log(`Backend server listening on port ${port}`);
});
