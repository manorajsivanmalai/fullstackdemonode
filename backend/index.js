const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');
const { exec } = require('child_process');
const path = require('path');

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Route to handle form data
app.post('/formdata', (req, res) => {
  const formData = req.body;
  console.log('Received form data:', formData);

  // Convert formData to a string format
  const dataToWrite = `Name: ${formData.name}\nEmail: ${formData.email}\n\n`;

  // Path to the file where data will be written
  const filePath = path.join(__dirname, 'mano.txt');

  // Append data to mano.txt
  fs.appendFile(filePath, dataToWrite, (err) => {
    if (err) {
      console.error('Error writing to file', err);
      res.status(500).json({ message: 'Failed to write to file' });
      return;
    }

    // Commit the changes to the Git repository
    exec(`git add ${filePath} && git commit -m "Add form data" && git push`, { cwd: __dirname }, (err, stdout, stderr) => {
      if (err) {
        console.error('Error committing to Git', err);
        res.status(500).json({ message: 'Failed to commit to Git', error: stderr });
        return;
      }
      console.log('Form data committed to Git:', stdout);
      res.json({ message: 'Form data received and written to file', data: formData });
    });
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
