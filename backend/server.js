require('dotenv').config();
const express = require('express');
const path = require('path');
const cors = require('cors');

const connectDB = require('./db'); // ✅ FIXED
const Customer = require('./models/Customer');
const apiRoutes = require('./routes/apiRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Serve frontend (optional)
const frontendPath = path.join(__dirname, '..', 'frontend');
app.use(express.static(frontendPath));

app.get('/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

app.get('/api/demo', (req, res) => {
  res.json({
    success: true,
    message: 'AI Customer Service API is running. Backend Connected!'
  });
});

// API routes
app.use('/api', apiRoutes);

app.get('/api/customers', async (req, res) => {
  try {
    const customers = await Customer.find()
      .sort({ createdAt: -1 })
      .limit(50)
      .lean();
    res.json({ success: true, data: customers });
  } catch (err) {
    console.error('API /api/customers error:', err);
    res.status(500).json({ success: false, message: 'Failed to fetch customers' });
  }
});

// 404
app.use((req, res) => {
  res.status(404).json({ message: 'Not found' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ message: 'Internal server error' });
});

const seedCustomers = async () => {
  const count = await Customer.countDocuments();
  if (count === 0) {
    await Customer.insertMany([
      { name: 'Dr. Sharma Clinic', phone: '+919876543210', businessType: 'clinic' },
      { name: 'Raj Salon', phone: '+919876543211', businessType: 'salon' },
      { name: 'Mohan Kirana', phone: '+919876543212', businessType: 'kirana' }
    ]);
    console.log('Seeded 3 sample customers');
  }
};

const start = async () => {
  try {
    await connectDB();       // ✅ DB connect
    await seedCustomers();   // ✅ seed once
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
      console.log(`Health: http://localhost:${PORT}/health`);
      console.log(`API Demo: http://localhost:${PORT}/api/demo`);
      console.log(`API Customers: http://localhost:${PORT}/api/customers`);
    });
  } catch (err) {
    console.error('Failed to start server:', err.message);
    process.exit(1);
  }
};

start();
