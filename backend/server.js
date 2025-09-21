require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');

const app = express();

const cors = require('cors');
app.use(cors());

// Connect to MongoDB
connectDB();

// Middleware to parse JSON bodies
app.use(express.json());

// Simple test route
app.get('/', (req, res) => {
  res.send('API is running...');
});

const authRoutes = require('./routes/authRoutes');
app.use('/api/users', authRoutes);

const expenseRoutes = require('./routes/expenseRoutes');
app.use('/api/expenses', expenseRoutes);



const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

module.exports = app;
