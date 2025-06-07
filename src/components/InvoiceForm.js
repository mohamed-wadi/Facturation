import React from 'react';
import { NumericFormat } from 'react-number-format';

const InvoiceForm = ({ invoiceData, onFormChange }) => {
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const updatedData = { ...invoiceData };
    
    // Gestion des champs imbriqués avec la notation dot (ex: "client.name")
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      updatedData[parent] = {
        ...updatedData[parent],
        [child]: value
      };
    } else {
      updatedData[name] = value;
    }
    
    onFormChange(updatedData);
  };

  const handleServiceChange = (index, field, value) => {
    const updatedServices = [...invoiceData.services];
    updatedServices[index] = {
      ...updatedServices[index],
      [field]: value
    };
    
    // Calcul automatique du total pour ce service
    if (field === 'nombreJours' || field === 'prixUnitaire') {
      const nombreJours = field === 'nombreJours' ? value : updatedServices[index].nombreJours;
      const prixUnitaire = field === 'prixUnitaire' ? value : updatedServices[index].prixUnitaire;
      
      // Conversion des valeurs en nombres pour le calcul
      const nombreJoursNum = parseFloat(nombreJours.replace(',', '.')) || 0;
      const prixUnitaireNum = parseFloat(prixUnitaire.replace(/\s/g, '')) || 0;
      
      updatedServices[index].total = nombreJoursNum * prixUnitaireNum;
    }
    
    onFormChange({
      ...invoiceData,
      services: updatedServices
    });
  };

  const addService = () => {
    onFormChange({
      ...invoiceData,
      services: [
        ...invoiceData.services,
        {
          designation: '',
          details: '',
          nombreJours: '',
          prixUnitaire: '',
          total: 0
        }
      ]
    });
  };

  const removeService = (index) => {
    if (invoiceData.services.length > 1) {
      const updatedServices = invoiceData.services.filter((_, i) => i !== index);
      onFormChange({
        ...invoiceData,
        services: updatedServices
      });
    }
  };

  const calculateTotal = () => {
    return invoiceData.services.reduce((sum, service) => sum + (service.total || 0), 0);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Numéro de facture</label>
          <input
            type="text"
            name="numeroFacture"
            value={invoiceData.numeroFacture}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Date de facture</label>
          <input
            type="date"
            name="dateFacture"
            value={invoiceData.dateFacture}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="border-t border-gray-200 pt-4">
        <h3 className="text-lg font-medium mb-2">Informations du client</h3>
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nom du client</label>
            <input
              type="text"
              name="nomClient"
              value={invoiceData.nomClient}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Adresse</label>
            <textarea
              name="adresseClient"
              value={invoiceData.adresseClient}
              onChange={handleInputChange}
              rows="3"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            ></textarea>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">ICE</label>
            <input
              type="text"
              name="iceClient"
              value={invoiceData.iceClient}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      <div className="border-t border-gray-200 pt-4">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-lg font-medium">Services</h3>
          <button
            type="button"
            onClick={addService}
            className="px-3 py-1 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
          >
            + Ajouter
          </button>
        </div>

        {invoiceData.services.map((service, index) => (
          <div key={index} className="p-4 border border-gray-200 rounded-md mb-3">
            <div className="flex justify-between mb-2">
              <h4 className="font-medium">Service #{index + 1}</h4>
              {invoiceData.services.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeService(index)}
                  className="text-red-600 hover:text-red-800"
                >
                  Supprimer
                </button>
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Désignation</label>
                <input
                  type="text"
                  value={service.designation}
                  onChange={(e) => handleServiceChange(index, 'designation', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Détails (optionnel)</label>
                <input
                  type="text"
                  value={service.details}
                  onChange={(e) => handleServiceChange(index, 'details', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nombre de jours</label>
                <input
                  type="text"
                  value={service.nombreJours}
                  onChange={(e) => handleServiceChange(index, 'nombreJours', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Prix unitaire (DH)</label>
                <NumericFormat
                  value={service.prixUnitaire}
                  onValueChange={(values) => handleServiceChange(index, 'prixUnitaire', values.value)}
                  thousandSeparator=" "
                  decimalSeparator=","
                  suffix=" "
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Total</label>
                <div className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50">
                  {service.total.toLocaleString('fr-FR')} DH
                </div>
              </div>
            </div>
          </div>
        ))}

        <div className="mt-4 text-right">
          <div className="text-lg font-bold">
            Total: {calculateTotal().toLocaleString('fr-FR')} DH
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoiceForm;