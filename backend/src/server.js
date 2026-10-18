require('dotenv').config();
const app = require('./app');
const { initDB } = require('./config/db');

const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    // Attempt database initialization
    await initDB();

    const server = app.listen(PORT, () => {
      console.log(`=========================================`);
      console.log(` 🚀 CloudCart Backend API Running`);
      console.log(` 📡 Port: ${PORT}`);
      console.log(` 🌐 Health: http://localhost:${PORT}/health`);
      console.log(` 📦 Products: http://localhost:${PORT}/api/products`);
      console.log(`=========================================`);
    });

    // Graceful shutdown
    process.on('SIGTERM', () => {
      console.log('SIGTERM signal received: closing HTTP server');
      server.close(() => {
        console.log('HTTP server closed');
      });
    });
  } catch (err) {
    console.error('Failed to start CloudCart server:', err);
    process.exit(1);
  }
}

startServer();
