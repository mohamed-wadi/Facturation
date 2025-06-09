import { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, BorderStyle, WidthType, AlignmentType } from 'docx';
import { saveAs } from 'file-saver';

export const generateWord = async (invoiceData) => {
  // Afficher un message de chargement
  const loadingMessage = document.createElement('div');
  loadingMessage.innerText = 'Génération du document Word en cours...';
  loadingMessage.style.position = 'fixed';
  loadingMessage.style.top = '50%';
  loadingMessage.style.left = '50%';
  loadingMessage.style.transform = 'translate(-50%, -50%)';
  loadingMessage.style.padding = '20px';
  loadingMessage.style.background = 'rgba(0, 0, 0, 0.7)';
  loadingMessage.style.color = 'white';
  loadingMessage.style.borderRadius = '5px';
  loadingMessage.style.zIndex = '9999';
  document.body.appendChild(loadingMessage);

  try {
    // Créer un nouveau document
    const doc = new Document({
      sections: [
        {
          properties: {},
          children: [
            // En-tête avec logo et informations de facture
            createHeader(invoiceData),
            
            // Informations client
            createClientInfo(invoiceData),
            
            // Tableau des services
            createServicesTable(invoiceData),
            
            // Total
            createTotalSection(invoiceData),
            
            // Informations bancaires
            createBankInfo(invoiceData),
            
            // Signature
            createSignature(),
            
            // Pied de page
            createFooter(invoiceData)
          ],
        },
      ],
    });

    // Générer le document et le télécharger
    const buffer = await Packer.toBuffer(doc);
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
    
    // Générer un nom de fichier avec la date actuelle
    const date = new Date();
    const fileName = `facture_${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}.docx`;
    
    saveAs(blob, fileName);
    console.log('Document Word généré avec succès');
  } catch (error) {
    console.error('Erreur lors de la génération du document Word:', error);
  } finally {
    // Supprimer le message de chargement
    document.body.removeChild(loadingMessage);
  }
};

// Fonction pour créer l'en-tête du document
const createHeader = (invoiceData) => {
  return new Paragraph({
    children: [
      new TextRun({
        text: `Facture numéro: ${invoiceData.numeroFacture}`,
        bold: true,
        size: 28
      }),
      new TextRun({
        text: `\nDate: ${formatDate(invoiceData.dateFacture)}`,
        size: 24,
        break: 1
      })
    ],
    alignment: AlignmentType.RIGHT
  });
};

// Fonction pour créer la section d'informations client
const createClientInfo = (invoiceData) => {
  return new Paragraph({
    children: [
      new TextRun({
        text: 'LMC (Lead Management Consulting)',
        bold: true,
        size: 28,
        break: 1
      }),
      new TextRun({
        text: `\nAdresse: ${invoiceData.adresseClient || 'Friendship Center 1er étage N°000 Bd Abdelmoumen Casablanca 20470'}`,
        size: 24,
        break: 1
      }),
      new TextRun({
        text: `\nICE: ${invoiceData.iceClient || '002258539000031'}`,
        size: 24,
        break: 1
      })
    ],
    spacing: {
      after: 400
    }
  });
};

// Fonction pour créer le tableau des services
const createServicesTable = (invoiceData) => {
  // Créer les lignes du tableau
  const rows = [
    // En-tête du tableau
    new TableRow({
      children: [
        new TableCell({
          children: [new Paragraph({ text: 'Désignation', alignment: AlignmentType.LEFT })],
          width: { size: 50, type: WidthType.PERCENTAGE },
          shading: { fill: 'EEEEEE' }
        }),
        new TableCell({
          children: [new Paragraph({ text: 'Nbre jour', alignment: AlignmentType.CENTER })],
          width: { size: 15, type: WidthType.PERCENTAGE },
          shading: { fill: 'EEEEEE' }
        }),
        new TableCell({
          children: [new Paragraph({ text: 'Prix unitaire', alignment: AlignmentType.RIGHT })],
          width: { size: 15, type: WidthType.PERCENTAGE },
          shading: { fill: 'EEEEEE' }
        }),
        new TableCell({
          children: [new Paragraph({ text: 'Total', alignment: AlignmentType.RIGHT })],
          width: { size: 20, type: WidthType.PERCENTAGE },
          shading: { fill: 'EEEEEE' }
        })
      ]
    }),
    // Lignes de données
    ...invoiceData.services.map(service => {
      return new TableRow({
        children: [
          new TableCell({
            children: [
              new Paragraph({
                text: `• ${service.designation || 'Formation Technique et commercial'}`,
                alignment: AlignmentType.LEFT
              }),
              service.details ? new Paragraph({
                text: service.details,
                alignment: AlignmentType.LEFT,
                size: 20
              }) : new Paragraph("")
            ],
            width: { size: 50, type: WidthType.PERCENTAGE }
          }),
          new TableCell({
            children: [new Paragraph({
              text: service.nombreJours || '1',
              alignment: AlignmentType.CENTER
            })],
            width: { size: 15, type: WidthType.PERCENTAGE }
          }),
          new TableCell({
            children: [new Paragraph({
              text: formatNumber(service.prixUnitaire) || '2500',
              alignment: AlignmentType.RIGHT
            })],
            width: { size: 15, type: WidthType.PERCENTAGE }
          }),
          new TableCell({
            children: [new Paragraph({
              text: formatNumber(service.total) || '2500',
              alignment: AlignmentType.RIGHT
            })],
            width: { size: 20, type: WidthType.PERCENTAGE }
          })
        ]
      });
    })
  ];

  return new Table({
    rows: rows,
    width: { size: 100, type: WidthType.PERCENTAGE },
    borders: {
      top: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
      bottom: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
      left: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
      right: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
      insideHorizontal: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
      insideVertical: { style: BorderStyle.SINGLE, size: 1, color: "000000" }
    }
  });
};

// Fonction pour créer la section du total
const createTotalSection = (invoiceData) => {
  const total = calculateTotal(invoiceData.services);
  
  return new Paragraph({
    children: [
      new TextRun({
        text: `\nTotal Net à payer: ${formatNumber(total)} DH`,
        bold: true,
        size: 28,
        break: 1
      }),
      new TextRun({
        text: `\nARRÊTÉ LA PRÉSENTE FACTURE À LA SOMME DE: ${formatMontantEnTexte(total)}`,
        bold: true,
        size: 24,
        break: 1
      })
    ],
    alignment: AlignmentType.RIGHT,
    spacing: {
      before: 400,
      after: 400
    }
  });
};

// Fonction pour créer la section des informations bancaires
const createBankInfo = (invoiceData) => {
  return new Paragraph({
    children: [
      new TextRun({
        text: `Attijariwafa Bank RIB: ${invoiceData.autoEntrepreneur?.rib || '007780000389800030411607'}`,
        size: 24
      })
    ],
    spacing: {
      after: 400
    }
  });
};

// Fonction pour créer la section de signature
const createSignature = () => {
  return new Paragraph({
    children: [
      new TextRun({
        text: 'Signature:',
        size: 24
      })
    ],
    alignment: AlignmentType.RIGHT,
    spacing: {
      after: 800
    }
  });
};

// Fonction pour créer le pied de page
const createFooter = (invoiceData) => {
  return new Paragraph({
    children: [
      new TextRun({
        text: '*Article 7 : n° de taxe incluse dans les régions.',
        size: 20,
        break: 1
      }),
      new TextRun({
        text: `\nAuto Entrepreneur: ${invoiceData.autoEntrepreneur?.nom || 'WADI Youssef'}`,
        size: 20,
        break: 1
      }),
      new TextRun({
        text: `Adresse: ${invoiceData.autoEntrepreneur?.adresse || '14, Lalla Meriem Bloc 32 Casablanca'}`,
        size: 20,
        break: 1
      }),
      new TextRun({
        text: `\nCNIE: ${invoiceData.autoEntrepreneur?.cnie || '5172247'}`,
        size: 20,
        break: 1
      }),
      new TextRun({
        text: `Taxe Professionnelle N°: ${invoiceData.autoEntrepreneur?.taxeProfessionnelle || '37203522'}`,
        size: 20,
        break: 1
      }),
      new TextRun({
        text: `\nMAIL: ${invoiceData.autoEntrepreneur?.mail || 'youssef.wadi05@gmail.com'}`,
        size: 20,
        break: 1
      }),
      new TextRun({
        text: `TEL: ${invoiceData.autoEntrepreneur?.tel || '06 63 27 40 23'}`,
        size: 20,
        break: 1
      })
    ],
    spacing: {
      before: 400
    }
  });
};

// Fonction utilitaire pour calculer le total
const calculateTotal = (services) => {
  return services.reduce((sum, service) => sum + (service.total || 0), 0);
};

// Fonction utilitaire pour formater les dates
const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' });
};

// Fonction utilitaire pour formater les nombres
const formatNumber = (number) => {
  if (!number) return '';
  return number.toLocaleString('fr-FR');
};

// Fonction utilitaire pour formater le montant en texte
const formatMontantEnTexte = (montant) => {
  const partieEntiere = Math.floor(montant);
  const texte = nombreEnLettres(partieEntiere);
  return `${texte} dirhams`;
};

// Fonction pour convertir un nombre en texte en français
const nombreEnLettres = (nombre) => {
  const unites = ['', 'un', 'deux', 'trois', 'quatre', 'cinq', 'six', 'sept', 'huit', 'neuf', 'dix', 'onze', 'douze', 'treize', 'quatorze', 'quinze', 'seize', 'dix-sept', 'dix-huit', 'dix-neuf'];
  const dizaines = ['', 'dix', 'vingt', 'trente', 'quarante', 'cinquante', 'soixante', 'soixante-dix', 'quatre-vingt', 'quatre-vingt-dix'];
  
  if (nombre === 0) return 'zéro';
  
  let texte = '';
  
  // Traitement des millions
  if (nombre >= 1000000) {
    const millions = Math.floor(nombre / 1000000);
    texte += (millions === 1) ? 'un million ' : nombreEnLettres(millions) + ' millions ';
    nombre %= 1000000;
  }
  
  // Traitement des milliers
  if (nombre >= 1000) {
    const milliers = Math.floor(nombre / 1000);
    texte += (milliers === 1) ? 'mille ' : nombreEnLettres(milliers) + ' mille ';
    nombre %= 1000;
  }
  
  // Traitement des centaines
  if (nombre >= 100) {
    const centaines = Math.floor(nombre / 100);
    texte += (centaines === 1) ? 'cent ' : nombreEnLettres(centaines) + ' cent ';
    nombre %= 100;
  }
  
  // Traitement des dizaines et unités
  if (nombre > 0) {
    if (nombre < 20) {
      texte += unites[nombre];
    } else {
      const dizaine = Math.floor(nombre / 10);
      const unite = nombre % 10;
      
      if (dizaine === 7 || dizaine === 9) {
        texte += dizaines[dizaine - 1] + '-';
        texte += (unite === 1) ? 'et-' + unites[unite + 10] : unites[unite + 10];
      } else {
        texte += dizaines[dizaine];
        if (unite > 0) {
          texte += (unite === 1 && dizaine !== 8) ? '-et-un' : '-' + unites[unite];
        } else if (dizaine === 8) {
          texte += 's';
        }
      }
    }
  }
  
  return texte.trim();
};