app.post('/signin', async (req, res) => {
    const { idToken } = req.body;
  
    if (!idToken) {
      return res.status(400).json({ error: 'ID token is required' });
    }
  
    try {
      const decodedIdToken = await admin.auth().verifyIdToken(idToken);
      const userRecord = await admin.auth().getUser(decodedIdToken.uid);
  
      // Create a session for the user
      // For example, by storing their user ID in a HTTP-only cookie
  
      res.status(200).json({ message: 'User signed in successfully' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });