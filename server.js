const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();

// Import Tweet model
const Tweet = require('./models/Tweet');

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(cors());

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

// Routes
app.get('/', (req, res) => {
  res.send('Hello World!');
});

// Add the following code to handle fetching tweets
app.get('/tweets', async (req, res) => {
  try {
    const tweets = await Tweet.find().sort({ createdAt: -1 });
    res.json(tweets);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching tweets' });
  }
});

// Add the following code to handle posting tweets
app.post('/tweets', async (req, res) => {
  const { content } = req.body;
  if (!content) {
    return res.status(400).json({ message: 'Content is required' });
  }

  try {
    const newTweet = new Tweet({ content });
    await newTweet.save();
    res.status(201).json(newTweet);
  } catch (error) {
    res.status(500).json({ message: 'Error posting tweet' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});