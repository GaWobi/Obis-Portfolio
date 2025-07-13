const express = require('express');
const path = require('path');
const multer = require('multer');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Set up multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = 'public/uploads/';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage: storage });

// Routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// API route for downloading CV
app.get('/api/download-cv', (req, res) => {
  const cvPath = path.join(__dirname, 'public', 'assets', 'cv.pdf');
  
  if (fs.existsSync(cvPath)) {
    res.download(cvPath, 'John_Doe_CV.pdf', (err) => {
      if (err) {
        console.error('Error downloading CV:', err);
        res.status(500).json({ error: 'Error downloading CV' });
      }
    });
  } else {
    res.status(404).json({ error: 'CV not found' });
  }
});

// API route for contact form
app.post('/api/contact', (req, res) => {
  const { name, email, message } = req.body;
  
  // In a real application, you would save this to a database
  // or send an email. For demo purposes, we'll just log it.
  console.log('Contact form submission:', { name, email, message });
  
  res.json({ success: true, message: 'Thank you for your message!' });
});

// API route for project data
app.get('/api/projects', (req, res) => {
  const projects = [
    {
      id: 1,
      title: 'Machine Problem',
      description: 'A comprehensive machine learning solution for data analysis and prediction.',
      features: [
        'Data preprocessing and cleaning',
        'Multiple ML algorithms implementation',
        'Real-time prediction capabilities',
        'Interactive data visualization'
      ],
      technologies: ['Python', 'TensorFlow', 'Pandas', 'NumPy', 'Matplotlib'],
      screenshots: [
        '/images/machine-problem-1.jpg',
        '/images/machine-problem-2.jpg',
        '/images/machine-problem-3.jpg'
      ],
      githubUrl: 'https://github.com/yourusername/machine-problem',
      liveUrl: 'https://machine-problem-demo.com'
    },
    {
      id: 2,
      title: 'Capstone Project',
      description: 'Final year capstone project showcasing full-stack development skills.',
      features: [
        'User authentication and authorization',
        'Real-time data synchronization',
        'Responsive web design',
        'RESTful API integration',
        'Database optimization'
      ],
      technologies: ['Node.js', 'React', 'MongoDB', 'Express.js', 'Socket.io'],
      screenshots: [
        '/images/capstone-1.jpg',
        '/images/capstone-2.jpg',
        '/images/capstone-3.jpg'
      ],
      hardware: [
        'Raspberry Pi 4',
        'Arduino Uno',
        'Sensors (Temperature, Humidity)',
        'LED Display Module'
      ],
      githubUrl: 'https://github.com/yourusername/capstone-project',
      liveUrl: 'https://capstone-demo.com'
    }
  ];
  
  res.json(projects);
});

// Start server
app.listen(PORT, () => {
  console.log(`Portfolio server running on http://localhost:${PORT}`);
});

module.exports = app;