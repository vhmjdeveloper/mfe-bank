import React, { useState, useRef, useEffect } from 'react';
import { AlertCircle, ChevronDown, Search } from 'lucide-react';

interface FormFieldProps {
  id: string;
  name: string;
  label: string;
  type?: string;
  value: string;
  error?: string;
  required?: boolean;
  placeholder?: string;
  icon?: React.ReactNode;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  onBlur: (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => void;
  options?: Array<{ value: string; label: string }>;
  searchable?: boolean;
}

export const FormField: React.FC<FormFieldProps> = ({
  id,
  name,
  label,
  type = 'text',
  value,
  error,
  required,
  placeholder,
  icon,
  onChange,
  onBlur,
  options,
  searchable
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const filteredOptions = options?.filter(option =>
    option.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectedOption = options?.find(option => option.value === value);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelectOption = (optionValue: string) => {
    const syntheticEvent = {
      target: {
        name,
        value: optionValue
      }
    } as React.ChangeEvent<HTMLSelectElement>;
    
    onChange(syntheticEvent);
    setIsOpen(false);
    setSearchQuery('');
  };

  const baseInputClasses = `block w-full pl-10 pr-3 py-3 rounded-lg border transition-all duration-200 ${
    error
      ? 'border-red-300 text-red-900 placeholder-red-300 focus:ring-red-500 focus:border-red-500'
      : 'border-gray-300 focus:ring-primary-500 focus:border-primary-500 hover:border-primary-400'
  } text-sm shadow-sm`;

  const renderSearchableSelect = () => (
    <div className="relative" ref={dropdownRef}>
      <div
        className={`${baseInputClasses} cursor-pointer flex items-center justify-between`}
        onClick={() => {
          setIsOpen(!isOpen);
          setTimeout(() => searchInputRef.current?.focus(), 0);
        }}
      >
        <span className={`block truncate ${!selectedOption ? 'text-gray-500' : ''}`}>
          {selectedOption ? selectedOption.label : placeholder || 'Seleccione una opción'}
        </span>
        <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
          <ChevronDown className={`h-5 w-5 text-gray-400 transition-transform ${isOpen ? 'transform rotate-180' : ''}`} />
        </span>
      </div>

      {isOpen && (
        <div className="absolute z-10 mt-1 w-full rounded-md bg-white shadow-lg">
          <div className="p-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                ref={searchInputRef}
                type="text"
                className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-primary-500"
                placeholder="Buscar..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onClick={(e) => e.stopPropagation()}
              />
            </div>
          </div>
          <ul className="max-h-60 overflow-auto py-1">
            {filteredOptions?.map((option) => (
              <li
                key={option.value}
                className={`relative cursor-pointer select-none py-2 pl-3 pr-9 text-sm ${
                  option.value === value
                    ? 'bg-primary-100 text-primary-900'
                    : 'text-gray-900 hover:bg-gray-50'
                }`}
                onClick={() => handleSelectOption(option.value)}
              >
                {option.label}
              </li>
            ))}
            {filteredOptions?.length === 0 && (
              <li className="relative cursor-default select-none py-2 pl-3 pr-9 text-sm text-gray-500">
                No se encontraron resultados
              </li>
            )}
          </ul>
        </div>
      )}
    </div>
  );

  return (
    <div className="space-y-2">
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className="relative rounded-md shadow-sm">
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            {icon}
          </div>
        )}
        {type === 'select' ? (
          searchable ? (
            renderSearchableSelect()
          ) : (
            <select
              id={id}
              name={name}
              value={value}
              onChange={onChange}
              onBlur={onBlur}
              className={`${baseInputClasses} appearance-none bg-no-repeat bg-right pr-10`}
              style={{
                backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                backgroundPosition: `right 0.5rem center`,
                backgroundSize: `1.5em 1.5em`
              }}
            >
              <option value="">{placeholder || 'Seleccione una opción'}</option>
              {options?.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          )
        ) : (
          <input
            type={type}
            id={id}
            name={name}
            value={value}
            onChange={onChange}
            onBlur={onBlur}
            placeholder={placeholder}
            className={baseInputClasses}
          />
        )}
        {error && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
            <AlertCircle className="h-5 w-5 text-red-500" />
          </div>
        )}
      </div>
      {error && (
        <p className="text-sm text-red-600 mt-2 flex items-center">
          <AlertCircle className="h-4 w-4 mr-1" />
          {error}
        </p>
      )}
    </div>
  );
};