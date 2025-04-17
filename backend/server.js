const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const axios = require('axios');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());
app.use('/uploads', express.static('uploads')); // Serve uploaded images

// Configure multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = './uploads';
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
    }
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

// In-memory database
let petsDatabase = [];

// Chatbot route
app.post('/api/chat', async (req, res) => {
  const { messages } = req.body;

  try {
    const response = await axios.post(
      'https://api.groq.com/openai/v1/chat/completions',
      {
        model: 'llama3-8b-8192',
        messages: messages,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const reply = response.data.choices[0].message;
    res.json({ message: reply });
  } catch (error) {
    console.error('Error from Groq:', error.response?.data || error.message);
    res.status(500).json({ error: 'Something went wrong with the LLaMA service.' });
  }
});

// Get all pets
app.get('/api/pets', (req, res) => {
  res.json(petsDatabase);
});

// Upload pet image + data
app.post('/api/pets', upload.single('image'), (req, res) => {
  const { name, description, price } = req.body;
  const image = req.file ? `/uploads/${req.file.filename}` : null;

  if (!name || !description || !price || !image) {
    return res.status(400).json({ error: 'Missing required pet data or image' });
  }

  const newPet = { name, description, price, image };
  petsDatabase.push(newPet);

  res.status(201).json({ message: 'Pet added successfully', pet: newPet });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
