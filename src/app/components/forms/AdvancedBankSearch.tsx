import React, { useState } from 'react';
import { Search, MapPin, Building2 } from 'lucide-react';
import { FormField } from './FormField';
import { COUNTRIES, US_STATES, MOCK_BANKS } from './constants';

interface AdvancedBankSearchProps {
  onSelectBank: (bankId: string) => void;
  onClose: () => void;
}

export const AdvancedBankSearch: React.FC<AdvancedBankSearchProps> = ({ onSelectBank, onClose }) => {
  const [filters, setFilters] = useState({
    country: '',
    state: '',
    routingNumber: ''
  });

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const filteredBanks = MOCK_BANKS.filter(bank => {
    const matchesRouting = !filters.routingNumber || bank.ach.routing.includes(filters.routingNumber);
    // In a real application, you would have country and state data for each bank
    // For this example, we'll assume all banks are in the US
    const matchesCountry = !filters.country || filters.country === 'US';
    const matchesState = !filters.state || bank.address.includes(filters.state);
    
    return matchesRouting && matchesCountry && matchesState;
  });

  const handleBankSelect = (bankId: string) => {
    onSelectBank(bankId);
    onClose();
  };

  return (
    <div className="space-y-6">
      {/* Search Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <FormField
          id="country"
          name="country"
          label="País"
          type="select"
          value={filters.country}
          onChange={handleFilterChange}
          onBlur={() => {}}
          options={COUNTRIES}
          icon={<MapPin className="h-5 w-5 text-gray-400" />}
        />

        <FormField
          id="state"
          name="state"
          label="Estado"
          type="select"
          value={filters.state}
          onChange={handleFilterChange}
          onBlur={() => {}}
          options={US_STATES}
          icon={<MapPin className="h-5 w-5 text-gray-400" />}
        />

        <FormField
          id="routingNumber"
          name="routingNumber"
          label="Routing Number"
          value={filters.routingNumber}
          onChange={handleFilterChange}
          onBlur={() => {}}
          icon={<Search className="h-5 w-5 text-gray-400" />}
        />
      </div>

      {/* Results */}
      <div className="space-y-4">
        <h4 className="font-medium text-gray-900">Resultados</h4>
        <div className="max-h-96 overflow-y-auto space-y-3">
          {filteredBanks.map(bank => (
            <div
              key={bank.id}
              className="p-4 rounded-lg border border-gray-200 hover:border-primary-500 cursor-pointer transition-colors"
              onClick={() => handleBankSelect(bank.id)}
            >
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center">
                    <Building2 className="h-5 w-5 text-primary-600" />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">{bank.name}</p>
                  <p className="text-sm text-gray-500 truncate">{bank.address}</p>
                  <div className="mt-1 grid grid-cols-2 gap-2 text-xs text-gray-500">
                    <div>
                      <span className="font-medium">SWIFT:</span> {bank.swift}
                    </div>
                    <div>
                      <span className="font-medium">ACH:</span> {bank.ach.routing}
                    </div>
                    <div className="col-span-2">
                      <span className="font-medium">IBAN:</span> {bank.iban}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {filteredBanks.length === 0 && (
            <div className="text-center py-8">
              <Building2 className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No se encontraron bancos</h3>
              <p className="mt-1 text-sm text-gray-500">
                Intenta con otros criterios de búsqueda
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};