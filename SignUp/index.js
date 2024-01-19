const express = require('express');
const admin = require('firebase-admin');
const serveStatic = require('serve-static');

// Initialize Express.js app
const app = express();
const port = process.env.PORT || 3000;

admin.initializeApp({
  credential: admin.credential.cert('./megycall-1b17c-firebase-adminsdk-hf42b-a7f0631f3a.json'),
  databaseURL: "https://megycall-1b17c-default-rtdb.asia-southeast1.firebasedatabase.app"
});

const db = admin.firestore();

app.post('/signup', async (req, res) => {
  const { firstName, lastName, email, password, acceptTerms } = req.body;

  if (!firstName || !lastName || !email || !password || !acceptTerms) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    const userRecord = await admin.auth().createUser({
      email,
      password,
      displayName: `${firstName} ${lastName}`
    });

    const userDoc = db.collection('users').doc(userRecord.uid);
    await userDoc.set({
      firstName,
      lastName,
      email,
      acceptTerms,
      createdAt: new Date()
    });

    res.status(201).json({ message: 'User created successfully', uid: userRecord.uid });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.use(serveStatic('public'));

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
