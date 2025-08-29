#!/usr/bin/env node

/**
 * @fileoverview Development server script with port detection
 * @author Ramses Martinez
 * @version 1.0.0
 */

const { spawn } = require('child_process');
const net = require('net');

/**
 * Checks if a port is available
 * @param {number} port - Port to check
 * @returns {Promise<boolean>} true if port is available
 */
function isPortAvailable(port) {
  return new Promise((resolve) => {
    const server = net.createServer();
    
    server.listen(port, () => {
      server.once('close', () => {
        resolve(true);
      });
      server.close();
    });
    
    server.on('error', () => {
      resolve(false);
    });
  });
}

/**
 * Finds an available port starting from a given port
 * @param {number} startPort - Starting port to check
 * @returns {Promise<number>} Available port
 */
async function findAvailablePort(startPort = 3000) {
  let port = startPort;
  
  while (port < 65535) {
    if (await isPortAvailable(port)) {
      return port;
    }
    port++;
  }
  
  throw new Error('No available ports found');
}

/**
 * Starts live-server with an available port
 */
async function startDevServer() {
  try {
    console.log('🔍 Checking for available ports...');
    
    // Try common development ports first
    const preferredPorts = [3000, 8080, 3001, 8081, 4000, 5000];
    let availablePort = null;
    
    for (const port of preferredPorts) {
      console.log(`  Checking port ${port}...`);
      if (await isPortAvailable(port)) {
        availablePort = port;
        console.log(`  ✅ Port ${port} is available`);
        break;
      } else {
        console.log(`  ❌ Port ${port} is in use`);
      }
    }
    
    if (!availablePort) {
      console.log('⚠️  No preferred ports available, searching for any free port...');
      availablePort = await findAvailablePort(3000);
      console.log(`  ✅ Found available port: ${availablePort}`);
    }
    
    console.log('');
    console.log(`✅ Starting development server on port ${availablePort}`);
    console.log(`🌐 URL: http://localhost:${availablePort}`);
    console.log(`📁 Serving: ${process.cwd()}`);
    console.log('🔄 Live reload enabled');
    console.log('⏹️  Press Ctrl+C to stop');
    console.log('');
    
    // Start live-server with better error handling
    const liveServer = spawn('npx', [
      'live-server',
      '--port=' + availablePort,
      '--open=/index.html',
      '--no-browser',
      '--quiet'
    ], {
      stdio: 'inherit',
      shell: true
    });
    
    // Handle process termination
    process.on('SIGINT', () => {
      console.log('\n🛑 Stopping development server...');
      liveServer.kill('SIGINT');
      process.exit(0);
    });
    
    process.on('SIGTERM', () => {
      console.log('\n🛑 Stopping development server...');
      liveServer.kill('SIGTERM');
      process.exit(0);
    });
    
    // Handle live-server exit
    liveServer.on('close', (code) => {
      if (code !== 0) {
        console.error(`❌ Development server exited with code ${code}`);
        process.exit(code);
      }
    });
    
    // Handle live-server errors
    liveServer.on('error', (error) => {
      console.error('❌ Error starting live-server:', error.message);
      process.exit(1);
    });
    
  } catch (error) {
    console.error('❌ Error starting development server:', error.message);
    process.exit(1);
  }
}

// Start the development server
startDevServer();
