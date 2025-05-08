const express = require('express');
const cors = require('cors');
const { exec } = require('child_process');
const path = require('path');

const app = express();
const port = 3001;

// Enable CORS for all routes
app.use(cors());
app.use(express.json());

// API endpoint to trigger the scraper
app.post('/api/v1/scraping/run/g2', (req, res) => {
  const { platforms } = req.body;

  // Check if G2 is in the platforms list
  if (!platforms || !platforms.includes('G2')) {
    return res.status(400).json({ success: false, error: 'G2 platform must be selected' });
  }

  console.log('Starting G2 scraper from API endpoint');
  
  // Get the path to the project root (3 directories up from the current file)
  const projectRoot = path.resolve(__dirname, '../../..');
  
  // Execute the command - run it exactly as the user manually runs it
  const cmd = `cd "${projectRoot}" && go run main.go`;
  
  console.log(`Executing command: ${cmd}`);
  
  // Send an initial response that scraping has started
  res.status(200).json({
    success: true,
    message: 'G2 scraping job started. Once complete, please refresh the page to see updated data.',
    jobId: Date.now().toString()
  });
  
  // Execute the command in the background
  exec(cmd, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error running G2 scraper: ${error}`);
      console.error(`Stderr: ${stderr}`);
      return;
    }
    console.log(`G2 scraper completed successfully`);
    console.log(`Output: ${stdout}`);
  });
});

// Simple health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date() });
});

// Start the server
app.listen(port, () => {
  console.log(`Local API server running at http://localhost:${port}`);
});