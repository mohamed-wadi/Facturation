# Application de Facturation pour Auto-Entrepreneur

Cette application web permet de générer des factures pour un auto-entrepreneur marocain. Elle offre une interface intuitive pour saisir les informations de facturation et générer des PDF professionnels.

## Fonctionnalités

- Interface utilisateur moderne avec Tailwind CSS
- Formulaire dynamique pour saisir les informations de facturation
- Ajout/suppression dynamique de services
- Calcul automatique des totaux
- Aperçu en temps réel de la facture
- Génération de PDF
- Personnalisation avec logo et signature

## Installation

1. Clonez ce dépôt
2. Installez les dépendances :

```bash
npm install
```

3. Lancez l'application en mode développement :

```bash
npm start
```

## Structure du projet

```
├── public/
│   ├── index.html
│   ├── manifest.json
│   ├── robots.txt
│   └── Images/
│       ├── Logo_entrepreneur.png
│       └── Signature.png
├── src/
│   ├── components/
│   │   ├── InvoiceForm.js
│   │   └── InvoicePreview.js
│   ├── utils/
│   │   └── pdfGenerator.js
│   ├── App.js
│   ├── index.js
│   ├── index.css
│   └── reportWebVitals.js
├── package.json
├── tailwind.config.js
└── postcss.config.js
```

## Déploiement

Pour déployer l'application sur Netlify :

1. Créez un compte sur [Netlify](https://www.netlify.com/)
2. Connectez votre dépôt GitHub
3. Configurez les paramètres de build :
   - Build command: `npm run build`
   - Publish directory: `build`

## Personnalisation

Vous pouvez personnaliser l'application en modifiant :

- Les informations de l'auto-entrepreneur dans `App.js`
- Le logo et la signature dans le dossier `public/Images/`
- Les styles dans `index.css` et `tailwind.config.js`

## Technologies utilisées

- React.js
- Tailwind CSS
- html2canvas
- jsPDF
- react-number-format

## Licence

MIT