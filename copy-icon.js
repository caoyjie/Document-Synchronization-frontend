const fs = require('fs');
const path = require('path');

// Ensure the build directory exists
const buildDir = path.join(__dirname, 'build');
if (!fs.existsSync(buildDir)) {
  fs.mkdirSync(buildDir, { recursive: true });
}

// Copy icon files from public to build
const filesToCopy = ['icon.png', 'icon.svg', 'favicon.ico'];
filesToCopy.forEach(file => {
  const sourcePath = path.join(__dirname, 'public', file);
  const destPath = path.join(buildDir, file);
  
  if (fs.existsSync(sourcePath)) {
    fs.copyFileSync(sourcePath, destPath);
    console.log(`Copied ${file} to build directory`);
  } else {
    console.warn(`Warning: ${file} not found in public directory`);
  }
});

console.log('Icon files copied successfully'); 