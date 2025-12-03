#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Create dist folder
const distDir = path.join(__dirname, 'dist');
if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir);
}

// Copy everything from src to dist for now
function copyDir(src, dest) {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }

  fs.readdirSync(src).forEach(file => {
    const srcFile = path.join(src, file);
    const destFile = path.join(dest, file);

    if (fs.lstatSync(srcFile).isDirectory()) {
      copyDir(srcFile, destFile);
    } else if (file.endsWith('.jsx') || file.endsWith('.js') || file.endsWith('.css')) {
      let content = fs.readFileSync(srcFile, 'utf-8');
      
      // Fix relative imports to include .jsx extension
      content = content.replace(/from ['"]\.\/([^'"]+)['"];/g, (match, p1) => {
        if (!p1.endsWith('.jsx') && !p1.endsWith('.js') && !p1.endsWith('.css')) {
          return `from './${p1}.jsx';`;
        }
        return match;
      });

      fs.writeFileSync(destFile, content);
    }
  });
}

copyDir(path.join(__dirname, 'src'), distDir);

// Create main entry point
const mainContent = fs.readFileSync(path.join(__dirname, 'src', 'index.js'), 'utf-8');
fs.writeFileSync(path.join(distDir, 'index.js'), mainContent);

// Create package.json for distribution
const pkg = JSON.parse(fs.readFileSync(path.join(__dirname, 'package.json'), 'utf-8'));
pkg.main = 'index.js';
pkg.module = 'index.js';
delete pkg.scripts;
fs.writeFileSync(path.join(distDir, 'package.json'), JSON.stringify(pkg, null, 2));

console.log('Build complete!');
