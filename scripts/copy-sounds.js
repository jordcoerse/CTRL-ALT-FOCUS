const fs = require('fs');
const path = require('path');

// Create scripts directory if it doesn't exist
if (!fs.existsSync('scripts')) {
  fs.mkdirSync('scripts');
}

// Copy sound files to build directory
const soundFiles = [
  'sound-ping-43757.mp3',
  'sound-din-ding-89718.mp3',
  'sound-sonar-ping-290188.mp3'
];

soundFiles.forEach(file => {
  const sourcePath = path.join(__dirname, '..', file);
  const destPath = path.join(__dirname, '..', 'build', file);
  
  if (fs.existsSync(sourcePath)) {
    fs.copyFileSync(sourcePath, destPath);
    console.log(`Copied ${file} to build directory`);
  } else {
    console.error(`Warning: ${file} not found`);
  }
}); 