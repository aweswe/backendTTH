const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

// ANSI color codes for better output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  cyan: '\x1b[36m'
};

// Function to execute commands and return output
function runCommand(command, options = {}) {
  console.log(`${colors.bright}${colors.cyan}> ${command}${colors.reset}`);
  try {
    return execSync(command, { 
      stdio: 'inherit',
      ...options
    });
  } catch (error) {
    if (options.ignoreErrors) {
      console.log(`${colors.yellow}Command failed but continuing...${colors.reset}`);
      return null;
    }
    console.error(`${colors.red}Failed to execute: ${command}${colors.reset}`);
    console.error(error.toString());
    process.exit(1);
  }
}

// Display banner
console.log(`${colors.bright}${colors.green}
=========================================
    Travel Tech Hub Backend Deployer    
=========================================
${colors.reset}`);

// Check minimal required environment variables
console.log(`${colors.bright}Checking environment variables...${colors.reset}`);
const minimalEnvVars = [
  'NODE_ENV',
  'PORT'
];

let missingVars = [];
for (const envVar of minimalEnvVars) {
  if (!process.env[envVar]) {
    missingVars.push(envVar);
  }
}

if (missingVars.length > 0) {
  console.log(`${colors.yellow}Missing environment variables: ${missingVars.join(', ')}${colors.reset}`);
  console.log(`${colors.yellow}Using default values...${colors.reset}`);
  process.env.NODE_ENV = process.env.NODE_ENV || 'development';
  process.env.PORT = process.env.PORT || '3000';
}

// Step 1: Install dependencies
console.log(`${colors.bright}Installing dependencies...${colors.reset}`);
runCommand('npm install');

// Step 2: Build the application
console.log(`${colors.bright}Building the application...${colors.reset}`);
runCommand('npm run build');

// Step 3: Start the minimal application
console.log(`${colors.bright}${colors.green}Starting the minimal application...${colors.reset}`);
const port = process.env.PORT || 3000;
console.log(`${colors.green}Application will be available at:${colors.reset}`);
console.log(`${colors.cyan}Main API: http://localhost:${port}/${colors.reset}`);
console.log(`${colors.cyan}Swagger API Docs: http://localhost:${port}/docs${colors.reset}`);

// Use the minimal app
if (process.platform === 'win32') {
  runCommand('set NODE_ENV=production && set USE_MINIMAL_APP=true && node dist/minimal.js');
} else {
  runCommand('NODE_ENV=production USE_MINIMAL_APP=true node dist/minimal.js');
}