import React, { useState } from 'react';
import InvoiceForm from './components/InvoiceForm';
import InvoicePreview from './components/InvoicePreview';
import { generatePDF } from './utils/pdfGenerator';
import { generateWord } from './utils/wordGenerator';

function App() {
  const [invoiceData, setInvoiceData] = useState({
    numeroFacture: `${new Date().getMonth() + 1}/${new Date().getFullYear()}`,
    dateFacture: new Date().toISOString().split('T')[0],
    nomClient: '',
    adresseClient: '',
    iceClient: '',
    services: [
      {
        designation: '',
        details: '',
        nombreJours: '',
        prixUnitaire: '',
        total: 0
      }
    ],
    autoEntrepreneur: {
      nom: 'WADI Youssef',
      adresse: '14, Lalla Meriem Bloc 32 Casablanca',
      ice: '003577171000054',
      if: '48987006',
      cnie: '5172247',
      taxeProfessionnelle: '37203522',
      mail: 'youssef.wadi05@gmail.com',
      tel: '06 63 27 40 23',
      rib: '007780000389800030411607'
    }
  });

  const [exportFormat, setExportFormat] = useState('pdf');

  const handleFormChange = (updatedData) => {
    setInvoiceData(updatedData);
  };

  const handleFormatChange = (e) => {
    setExportFormat(e.target.value);
  };

  const handleGenerateDocument = () => {
    if (exportFormat === 'pdf') {
      generatePDF(invoiceData);
    } else if (exportFormat === 'word') {
      generateWord(invoiceData);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
      <div className="relative py-3 sm:max-w-7xl sm:mx-auto">
        <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-10">
          <h1 className="text-3xl font-bold text-center text-invoice-blue mb-8">Facturation Auto-Entrepreneur</h1>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-gray-50 p-6 rounded-lg">
              <h2 className="text-xl font-semibold mb-4">Formulaire</h2>
              <InvoiceForm invoiceData={invoiceData} onFormChange={handleFormChange} />
            </div>
            
            <div>
              <h2 className="text-xl font-semibold mb-4">Aperçu de la facture</h2>
              <div className="bg-white border border-gray-200 rounded-lg">
                <InvoicePreview invoiceData={invoiceData} />
              </div>
              <div className="mt-4 flex justify-end items-center space-x-4">
                <div className="flex items-center">
                  <label htmlFor="format-select" className="mr-2 text-gray-700">Format:</label>
                  <select
                    id="format-select"
                    value={exportFormat}
                    onChange={handleFormatChange}
                    className="border border-gray-300 rounded-md px-3 py-1 focus:outline-none focus:ring-2 focus:ring-invoice-blue"
                  >
                    <option value="pdf">PDF</option>
                    <option value="word">Word</option>
                  </select>
                </div>
                <button 
                  onClick={handleGenerateDocument}
                  className="bg-invoice-blue text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                >
                  Générer {exportFormat.toUpperCase()}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;