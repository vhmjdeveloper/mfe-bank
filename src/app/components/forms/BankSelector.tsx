import React, { useState, useRef, useEffect } from 'react';
import { Search, Building2, MapPin, CreditCard, ChevronDown } from 'lucide-react';
import { MOCK_BANKS } from './constants';

interface BankSelectorProps {
  value: string;
  onChange: (bankId: string) => void;
  error?: string;
}

export const BankSelector: React.FC<BankSelectorProps> = ({ value, onChange, error }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedBank = MOCK_BANKS.find(bank => bank.id === value);

  const filteredBanks = MOCK_BANKS.filter(bank =>
    bank.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    bank.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
    bank.swift.toLowerCase().includes(searchQuery.toLowerCase()) ||
    bank.ach.routing.includes(searchQuery) ||
    bank.iban.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Selected Bank Display / Trigger Button */}
      <div
        className={`relative w-full p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
          error
            ? 'border-red-300 text-red-900'
            : isOpen
            ? 'border-primary-500 ring-2 ring-primary-200'
            : 'border-gray-200 hover:border-primary-300'
        }`}
        onClick={() => setIsOpen(!isOpen)}
      >
        {selectedBank ? (
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0">
              <Building2 className="h-5 w-5 text-primary-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-base font-medium text-gray-900">{selectedBank.name}</p>
              <p className="text-sm text-gray-500 truncate">{selectedBank.address}</p>
            </div>
          </div>
        ) : (
          <div className="flex items-center text-gray-500">
            <Building2 className="h-5 w-5 mr-2" />
            <span>Seleccione un banco</span>
          </div>
        )}
        <ChevronDown className={`absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 transition-transform ${isOpen ? 'transform rotate-180' : ''}`} />
      </div>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute z-50 w-full mt-2 bg-white rounded-lg shadow-xl border border-gray-200 max-h-[80vh] overflow-hidden">
          {/* Search Input */}
          <div className="p-3 border-b border-gray-200">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                placeholder="Buscar por nombre, dirección, SWIFT, ACH o IBAN..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onClick={(e) => e.stopPropagation()}
              />
            </div>
          </div>

          {/* Bank Cards List */}
          <div className="overflow-y-auto max-h-[60vh] p-3 space-y-2">
            {filteredBanks.map((bank) => (
              <div
                key={bank.id}
                className={`p-3 rounded-lg border transition-all duration-200 cursor-pointer hover:bg-gray-50 ${
                  bank.id === value ? 'border-primary-500 bg-primary-50' : 'border-gray-200'
                }`}
                onClick={(e) => {
                  e.stopPropagation();
                  onChange(bank.id);
                  setIsOpen(false);
                }}
              >
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center">
                      <Building2 className="h-5 w-5 text-primary-600" />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-base font-medium text-gray-900 mb-1">{bank.name}</h4>
                    <div className="space-y-1">
                      <p className="text-sm text-gray-600 flex items-center">
                        <MapPin className="h-4 w-4 mr-1 text-gray-400 flex-shrink-0" />
                        <span className="truncate">{bank.address}</span>
                      </p>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <p className="font-medium text-gray-700">SWIFT</p>
                          <p className="text-gray-600">{bank.swift}</p>
                        </div>
                        <div>
                          <p className="font-medium text-gray-700">ACH Routing</p>
                          <p className="text-gray-600">{bank.ach.routing}</p>
                        </div>
                      </div>
                      <p className="text-sm">
                        <span className="font-medium text-gray-700">IBAN: </span>
                        <span className="text-gray-600">{bank.iban}</span>
                      </p>
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
                  No hay resultados para tu búsqueda. Intenta con otros términos.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {error && (
        <p className="text-sm text-red-600 mt-2 flex items-center">
          <CreditCard className="h-4 w-4 mr-1" />
          {error}
        </p>
      )}
    </div>
  );
};