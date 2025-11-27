// Minimal test server to verify basic functionality
console.log('Starting minimal test server...');

import express from 'express';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

app.get('/', (req, res) => {
  res.send('Skedadel Fleet Management - Test Server Running');
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`✓ Test server running on port ${PORT}`);
  console.log(`✓ Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`✓ DB_HOST: ${process.env.DB_HOST || 'not set'}`);
});
