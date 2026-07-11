import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import http from 'http';
import { Server } from 'socket.io';
import sequelize from './config/db.js';

dotenv.config();

// Prevent crashes from uncaught errors
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception (server kept alive):', err.message);
});
process.on('unhandledRejection', (reason) => {
  console.error('Unhandled Rejection (server kept alive):', reason);
});

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});
const PORT = process.env.PORT || 5000;

// Socket.io Integration
io.on('connection', (socket) => {
  socket.on('join_chat', (userId) => {
    socket.join(userId.toString());
  });

  socket.on('send_message', (data) => {
    io.to(data.receiverId.toString()).emit('receive_message', data);
  });

  socket.on('disconnect', () => {});
});

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

import authRoutes from './routes/auth.js';
import jobRoutes from './routes/jobs.js';
import messageRoutes from './routes/messages.js';
import reviewRoutes from './routes/reviews.js';
import paymentRoutes from './routes/payments.js';
import applicationRoutes from './routes/applications.js';
import ragRoutes from './routes/rag.js';
import './models/index.js';

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/rag', ragRoutes);

app.get('/', (req, res) => {
  res.send('HyperLocal Connect API is running with MySQL...');
});

// Sync database and start server
sequelize.sync({ alter: true }) // Automatically updates database schema
  .then(() => {
    console.log('MySQL Database connected and synced');
    server.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('MySQL connection error:', err);
  });

export default app;
