const express = require('express');
const _ = require('lodash');
const moment = require('moment');
const request = require('request');
const debug = require('debug')('app');
const minimist = require('minimist');
const tar = require('tar');

const app = express();
const port = process.env.PORT || 3000;

// Parse command line arguments (using vulnerable minimist)
const args = minimist(process.argv.slice(2));

// Express middleware
app.use(express.json());
app.use(express.static('public'));

// Vulnerable lodash usage (prototype pollution risk)
app.use((req, res, next) => {
  // This demonstrates a potential prototype pollution vulnerability
  if (req.body && req.body.constructor) {
    _.merge({}, req.body);
  }
  next();
});

// Routes
app.get('/', (req, res) => {
  const now = moment().format('YYYY-MM-DD HH:mm:ss');
  
  res.json({
    message: 'Welcome to FOSSA CLI Training Demo',
    timestamp: now,
    vulnerable_packages: {
      express: '4.16.0 - Multiple vulnerabilities',
      lodash: '4.17.4 - Prototype pollution',
      moment: '2.19.0 - ReDoS vulnerability',
      request: '2.88.0 - Deprecated, security issues',
      minimist: '0.0.8 - Prototype pollution'
    },
    warning: 'This application intentionally uses vulnerable packages for training purposes!'
  });
});

app.get('/api/external', (req, res) => {
  const url = req.query.url || 'https://jsonplaceholder.typicode.com/posts/1';
  
  // Vulnerable request usage
  request(url, (error, response, body) => {
    if (error) {
      res.status(500).json({ error: error.message });
      return;
    }
    
    try {
      const data = JSON.parse(body);
      res.json({
        status: 'success',
        data: data,
        timestamp: moment().toISOString()
      });
    } catch (e) {
      res.status(500).json({ error: 'Failed to parse response' });
    }
  });
});

app.post('/api/merge', (req, res) => {
  try {
    // This demonstrates the lodash merge vulnerability
    const result = _.merge({}, req.body);
    res.json({
      message: 'Data merged successfully',
      result: result
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Error handling
app.use((err, req, res, next) => {
  debug('Error occurred:', err.message);
  res.status(500).json({ 
    error: 'Internal Server Error',
    debug: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

app.listen(port, () => {
  debug(`Server running on port ${port}`);
  console.log(`🚀 FOSSA CLI Training Demo running on http://localhost:${port}`);
  console.log(`⚠️  This application uses vulnerable packages for training purposes`);
  console.log(`📊 Run 'fossa analyze' to scan for vulnerabilities`);
});