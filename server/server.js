const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const vehicleRoutes = require('./routes/vehicleRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const app = express();

app.use(cors({
  origin: ['https://vehlyxgo.vercel.app', 'http://localhost:3000'],
  credentials: true
}));
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/vehicles', vehicleRoutes);
app.use('/api/bookings', bookingRoutes);
app.get('/', (req, res) => {
  res.json({ message: 'VehlyxGo API is running!' });
});

mongoose.connect(process.env.MONGO_URI, {
  serverSelectionTimeoutMS: 10000,
  family: 4
})
  .then(() => {
    console.log('MongoDB connected successfully!');
    app.listen(process.env.PORT, () => {
      console.log(`Server chal raha hai port ${process.env.PORT} pe`);
    });
  })
  .catch((err) => {
    console.log('DB Error:', err.message);
  });