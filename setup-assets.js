const fs = require('fs');
const path = require('path');

// Créer les dossiers nécessaires dans public
const publicDir = path.join(__dirname, 'public');
const publicImagesDir = path.join(publicDir, 'Images');
const publicFontsDir = path.join(publicDir, 'fonts');

// Créer le dossier public s'il n'existe pas
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir);
  console.log('Dossier public créé');
}

// Créer le dossier Images dans public s'il n'existe pas
if (!fs.existsSync(publicImagesDir)) {
  fs.mkdirSync(publicImagesDir);
  console.log('Dossier public/Images créé');
}

// Créer le dossier fonts dans public s'il n'existe pas
if (!fs.existsSync(publicFontsDir)) {
  fs.mkdirSync(publicFontsDir);
  console.log('Dossier public/fonts créé');
}

// Copier les images du dossier Images vers public/Images
const sourceImagesDir = path.join(__dirname, 'Images');
if (fs.existsSync(sourceImagesDir)) {
  const imageFiles = fs.readdirSync(sourceImagesDir);
  imageFiles.forEach(file => {
    const sourcePath = path.join(sourceImagesDir, file);
    const destPath = path.join(publicImagesDir, file);
    fs.copyFileSync(sourcePath, destPath);
    console.log(`Image ${file} copiée vers public/Images`);
  });
}

// Copier les polices du dossier fonts vers public/fonts
const sourceFontsDir = path.join(__dirname, 'fonts');
if (fs.existsSync(sourceFontsDir)) {
  const fontFiles = fs.readdirSync(sourceFontsDir);
  fontFiles.forEach(file => {
    const sourcePath = path.join(sourceFontsDir, file);
    const destPath = path.join(publicFontsDir, file);
    fs.copyFileSync(sourcePath, destPath);
    console.log(`Police ${file} copiée vers public/fonts`);
  });
}

console.log('Configuration des ressources terminée');