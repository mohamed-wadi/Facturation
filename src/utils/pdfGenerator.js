import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

export const generatePDF = async () => {
  const invoiceElement = document.getElementById('invoice-to-print');
  
  if (!invoiceElement) {
    console.error("Élément d'aperçu de facture non trouvé");
    return;
  }

  // Afficher un message de chargement
  const loadingMessage = document.createElement('div');
  loadingMessage.innerText = 'Génération du PDF en cours...';
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
    // Convertir l'élément HTML en canvas
    const canvas = await html2canvas(invoiceElement, {
      scale: 3, // Augmenter la qualité
      useCORS: true,
      logging: false,
      letterRendering: true,
      allowTaint: true
    });
    
    // Créer un PDF au format A4
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });
    
    // Ajouter l'image du canvas au PDF avec des marges réduites
    const imgWidth = 210; // mm (A4 width)
    const pageHeight = 297; // mm (A4 height)
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    const marginX = 0; // Réduire les marges horizontales
    
    pdf.addImage(
      canvas.toDataURL('image/jpeg', 1.0),
      'JPEG',
      marginX,
      0,
      imgWidth - (marginX * 2),
      Math.min(imgHeight, pageHeight)
    );
    
    // Générer un nom de fichier avec la date actuelle
    const date = new Date();
    const fileName = `facture_${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}.pdf`;
    
    // Télécharger le PDF
    pdf.save(fileName);
    
    console.log('PDF généré avec succès');
  } catch (error) {
    console.error('Erreur lors de la génération du PDF:', error);
  } finally {
    // Supprimer le message de chargement
    document.body.removeChild(loadingMessage);
  }
};