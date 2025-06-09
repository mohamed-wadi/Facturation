import React, { useRef } from 'react';

const InvoicePreview = ({ invoiceData }) => {
  const invoiceRef = useRef(null);

  const calculateTotal = () => {
    return invoiceData.services.reduce((sum, service) => sum + (service.total || 0), 0);
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' });
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

  // Fonction pour formater le montant en texte
  const formatMontantEnTexte = (montant) => {
    const partieEntiere = Math.floor(montant);
    const texte = nombreEnLettres(partieEntiere);
    return `${texte} dirhams`;
  };

  return (
    <div ref={invoiceRef} className="p-6 bg-white" id="invoice-to-print">
      {/* En-tête de la facture */}
      <div className="flex justify-between items-start mb-6">
        <div className="w-1/3">
          <img 
            src={process.env.PUBLIC_URL + '/Images/Logo_entrepreneur.png'} 
            alt="Logo Auto-Entrepreneur" 
            className="h-16 object-contain"
          />
        </div>
        <div className="w-1/3 text-right">
          <div className="border border-gray-300 p-1 mb-2 mx-auto" style={{maxWidth: '180px'}}>
            <div className="font-bold text-sm text-center">Facture numéro: {invoiceData.numeroFacture}</div>
            <div className="text-sm text-center">Date: {formatDate(invoiceData.dateFacture)}</div>
          </div>
        </div>
      </div>

      {/* Informations client et auto-entrepreneur */}
      <div className="mb-6">
        <div className="font-bold text-lg mb-2">{invoiceData.nomClient || 'LMC (Lead Management Consulting)'}</div>
        <div className="text-sm">
          <strong>Adresse:</strong> {invoiceData.adresseClient || 'Friendship Center 1er étage N°000 Bd Abdelmoumen Casablanca 20470'}
        </div>
        <div className="text-sm">
          <strong>ICE:</strong> {invoiceData.iceClient || '002258539000031'}
        </div>
      </div>

      {/* Tableau des services */}
      <div className="mb-6">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 p-2 text-left font-bold">Désignation</th>
              <th className="border border-gray-300 p-2 text-center font-bold w-20">Nbre jour</th>
              <th className="border border-gray-300 p-2 text-right font-bold w-24">Prix unitaire</th>
              <th className="border border-gray-300 p-2 text-right font-bold w-24">Total</th>
            </tr>
          </thead>
          <tbody>
            {invoiceData.services.map((service, index) => (
              <tr key={index}>
                <td className="border border-gray-300 p-2">
                  <div className="flex items-start">
                    <span className="mr-2">•</span>
                    <div>
                      <div className="font-bold">{service.designation || 'Formation Technique et commercial'}</div>
                      {service.details && <div className="text-xs mt-1">{service.details}</div>}
                    </div>
                  </div>
                </td>
                <td className="border border-gray-300 p-2 text-center">{service.nombreJours || '1'}</td>
                <td className="border border-gray-300 p-2 text-right">{service.prixUnitaire ? parseFloat(service.prixUnitaire).toLocaleString('fr-FR') : '2500'}</td>
                <td className="border border-gray-300 p-2 text-right">{service.total ? service.total.toLocaleString('fr-FR') : '2500'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Total */}
      <div className="flex justify-between mb-6">
        <div className="w-1/2">
          <div className="font-bold text-sm">Montant en dirhams exprimé le n° TVA*</div>
        </div>
        <div className="w-1/2">
          <div className="flex justify-between border border-gray-300 p-2">
            <div className="font-bold text-sm">Total Net à payer</div>
            <div className="font-bold text-sm">{calculateTotal().toLocaleString('fr-FR')}</div>
          </div>
        </div>
      </div>

      {/* Informations bancaires */}
      <div className="mb-6">
        <div className="font-bold text-sm mb-1 uppercase">ARRÊTÉ LA PRÉSENTE FACTURE À LA SOMME DE: {formatMontantEnTexte(calculateTotal())}</div>
        <div className="text-sm">
          <strong>Attijariwafa Bank RIB:</strong> {invoiceData.autoEntrepreneur?.rib || '007780000389800030411607'}
        </div>
      </div>

      {/* Signature */}
      <div className="text-right mb-8">
        <div className="mb-1 text-sm">Signature :</div>
        <img 
          src={process.env.PUBLIC_URL + '/Images/Signature.png'} 
          alt="Signature" 
          className="h-14 inline-block"
        />
      </div>

      {/* Pied de page */}
      <div className="text-xs text-gray-500 mt-16 border-t pt-2">
        <div className="mb-2">*Article 7 : n° de taxe incluse dans les régions.</div>
        
        <div className="grid grid-cols-3 gap-4">
          <div>
            <div className="font-bold">Auto Entrepreneur</div>
            <div>{invoiceData.autoEntrepreneur?.nom || 'WADI Youssef'}</div>
            <div>{invoiceData.autoEntrepreneur?.adresse || '14, Lalla Meriem Bloc 32 Casablanca'}</div>
          </div>
          <div>
            <div className="font-bold">CNIE</div>
            <div>{invoiceData.autoEntrepreneur?.cnie || '5172247'}</div>
            <div className="font-bold">Taxe Professionnelle N°</div>
            <div>{invoiceData.autoEntrepreneur?.taxeProfessionnelle || '37203522'}</div>
          </div>
          <div>
            <div className="font-bold">MAIL</div>
            <div>{invoiceData.autoEntrepreneur?.mail || 'youssef.wadi05@gmail.com'}</div>
            <div className="font-bold">TEL</div>
            <div>{invoiceData.autoEntrepreneur?.tel || '06 63 27 40 23'}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoicePreview;