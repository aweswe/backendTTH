/**
 * Simple script to start the application
 */
const { spawn } = require('child_process');
const fs = require('fs');

// Check if we're building for production
const isProd = process.env.NODE_ENV === 'production';

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

console.log(`${colors.green}Starting Travel Tech Hub backend...${colors.reset}`);

// Set default port
const PORT = process.env.PORT || 3000;
console.log(`Port: ${PORT}`);

// Log environment
console.log(`Environment: ${isProd ? 'Production' : 'Development'}`);

// Check for dist folder
if (!fs.existsSync('./dist')) {
  console.log(`${colors.yellow}No build found. Please run 'npm run build' first.${colors.reset}`);
  process.exit(1);
}

// Start the application
console.log(`${colors.green}Application started!${colors.reset}`);
console.log(`${colors.blue}Main API: http://localhost:${PORT}/${colors.reset}`);
console.log(`${colors.blue}Swagger API Docs: http://localhost:${PORT}/docs${colors.reset}`);

// Choose which file to run
const child = spawn('node', ['dist/main.js'], { 
  stdio: 'inherit',
  env: {
    ...process.env,
    NODE_ENV: isProd ? 'production' : 'development',
    PORT
  }
});

// Handle process exit
child.on('exit', (code, signal) => {
  console.log(`Application exited with code ${code} and signal ${signal}`);
});

// Handle errors
child.on('error', (err) => {
  console.error('Failed to start application:', err);
});

// Handle signals to properly clean up child process
process.on('SIGINT', () => {
  child.kill('SIGINT');
});

process.on('SIGTERM', () => {
  child.kill('SIGTERM');
}); 