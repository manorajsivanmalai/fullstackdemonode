// Backend: server.js

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path=require('path');
const fs = require('fs');

const app = express();
const port = 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Route to handle form data
app.post('/formdata', (req, res) => {
  const formData = req.body;
  console.log('Received form data:', formData);
  
  // Send a response back to the client
  res.json({ message: 'Form data received successfully', data: formData });
  
  const dataToWrite = `Name: ${formData.name}\nEmail: ${formData.email}\n\n`;

  // Write the form data to mano.txt
  fs.appendFile('mano.txt', dataToWrite, (err) => {
    if (err) {
      console.error('Error writing to file', err);
      res.status(500).json({ message: 'Failed to write to file' });
    } else {
      console.log('Form data written to mano.txt');
      res.json({ message: 'Form data received and written to file', data: formData });
    }
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
