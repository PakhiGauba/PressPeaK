// app.js
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc } from 'firebase/firestore';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyBXGQLqOrp2jMLBhxc4UGqGAZiETVsj8Yc",
  authDomain: "presspeak-120ec.firebaseapp.com",
  projectId: "presspeak-120ec",
  storageBucket: "presspeak-120ec.appspot.com",  // fixed typo
  messagingSenderId: "417373950517",
  appId: "1:417373950517:web:3018ce099356715410d77c",
  measurementId: "G-PDPKDMQ00F"
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);

// Middleware
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const htmlPages = [
  'shimmer', 'index', 'about', 'author', 'business', 'contact', 'error-404', 'footer', 'sharePopup', 'cta', 'lifestyle', 'nav', 'sports', 'team', 'technology', 'under-construction',
  'post-format-audio', 'post-format-gallery', 'post-format-quote',
  'post-format-standard', 'post-format-text-only', 'post-format-video',
  'post-layout-five', 'post-layout-four', 'post-layout-three',
  'post-layout-two', 'post-layout-one', 'alba-mcvicar-reyes', 'annabel-gowling', 'hannah-combs', 'isobel-slocombe', 'kasamba-chipo-maango', 'oladolapo-oladogba', 'richa', 'sharmili-sanjeev', 'shifa-mehra', 'terrel-mollel', 'ai-for-creative-industries', 'balancing-acts', 'future-of-nigeria-business', 'incels-signs-and-dog-whistles', 'producing-in-zed', 'rediscovering-your-queer-self', 'sinners', 'the-next-frontier-in-fintech', 'the-politics-of-performance', 'the-test-of-legacy-parties', 'todays-hip-hop-music', 'unspoken-heroes-of-the-battlefield', 'warfare-goes-viral', 'womens-football', 'politics'
];

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

htmlPages.forEach(page => {
  app.get(`/${page}.html`, (req, res) => {
    res.sendFile(path.join(__dirname, `${page}.html`));
  });
});

app.post('/contact', async (req, res) => {
  const { name, email, category, message } = req.body;
  const contactData = { name, email, category, message };

  try {
    await addDoc(collection(db, 'contacts'), contactData);
    res.json({ message: 'Contact data saved successfully!' });
  } catch (error) {
    console.error('Error saving contact:', error);
    res.status(500).json({ message: 'Error saving contact data' });
  }
});

app.post('/submit-story', async (req, res) => {
  console.log('Received form data:', req.body);

  const { name, email, phone, languages, topics, content } = req.body;
  const storyData = {
    name,
    email,
    phone,
    languages,
    topics,
    content,
    submissionDate: new Date()
  };

  try {
    await addDoc(collection(db, 'stories'), storyData);
    res.json({ message: 'Your story submission was successful!' });
  } catch (error) {
    console.error('Detailed error:', error.message, error.code);
    res.status(500).json({
      message: 'Error submitting your story.',
      error: error.message
    });
  }
});

const postRoutes = [
  'post-format-standard',
  'post-format-gallery',
  'post-format-quote',
  'post-format-text-only',
  'post-format-video',
  'post-layout-five',
  'post-layout-four',
  'post-layout-three',
  'post-layout-two',
  'post-layout-one',
  'ai-for-creative-industries',
  'balancing-acts',
  'future-of-nigeria-business',
  'incels-signs-and-dog-whistles',
  'producing-in-zed',
  'rediscovering-your-queer-self',
  'sinners',
  'the-next-frontier-in-fintech',
  'the-politics-of-performance',
  'the-test-of-legacy-parties',
  'todays-hip-hop-music',
  'unspoken-heroes-of-the-battlefield',
  'warfare-goes-viral',
  'womens-football',
];

postRoutes.forEach(route => {
  app.post(`/${route}`, async (req, res) => {
    const { name, email, message } = req.body;
    const contactData = { name, email, message };

    try {
      await addDoc(collection(db, 'reply'), contactData);
      res.json({ message: 'Contact data saved successfully!' });
    } catch (error) {
      console.error(`Error saving reply on ${route}:`, error);
      res.status(500).json({ message: 'Error saving contact data' });
    }
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
