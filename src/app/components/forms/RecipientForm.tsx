import React, { useState, useEffect } from 'react';
import { Mail, User, Wallet, Building2, MapPin, Search } from 'lucide-react';
import { FormField } from './FormField';
import { FormSection } from './FormSection';
import { NotificationToggle } from './NotificationToggle';
import { SubmitButton } from './SubmitButton';
import { BankSelector } from './BankSelector';
import { Modal } from '../modals/Modal';
import { AdvancedBankSearch } from './AdvancedBankSearch';
import { PAYMENT_TYPES_CONFIG, COUNTRIES, US_STATES, MOCK_BANKS } from './constants';
import { validateEmail } from './utils';

interface FormData {
  displayName: string;
  email: string;
  sendNotifications: boolean;
  paymentType: string;
  bankId: string;
  accountFields: Record<string, string>;
  wireBeneficiary: string;
  achName: string;
  achId: string;
  country: string;
  address1: string;
  address2: string;
  city: string;
  state: string;
  zip: string;
}

const RecipientForm = () => {
  const [formData, setFormData] = useState<FormData>({
    displayName: '',
    email: '',
    sendNotifications: false,
    paymentType: '',
    bankId: '',
    accountFields: {},
    wireBeneficiary: '',
    achName: '',
    achId: '',
    country: '',
    address1: '',
    address2: '',
    city: '',
    state: '',
    zip: ''
  });

  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isAdvancedSearchOpen, setIsAdvancedSearchOpen] = useState(false);

  // Validation function
  const validateField = (name: string, value: string): string => {
    switch (name) {
      case 'displayName':
        return !value.trim() ? 'El nombre es requerido' : '';
      case 'email':
        return !value.trim() 
          ? 'El email es requerido'
          : !validateEmail(value)
          ? 'Email inválido'
          : '';
      case 'country':
        return !value.trim() ? 'El país es requerido' : '';
      case 'address1':
        return !value.trim() ? 'La dirección es requerida' : '';
      case 'city':
        return !value.trim() ? 'La ciudad es requerida' : '';
      case 'state':
        return !value.trim() ? 'El estado es requerido' : '';
      case 'zip':
        return !value.trim() ? 'El código postal es requerido' : '';
      default:
        return '';
    }
  };

  // Effect to validate fields when they change
  useEffect(() => {
    const newErrors: Record<string, string> = {};
    Object.keys(touched).forEach(field => {
      if (touched[field]) {
        const value = formData[field as keyof FormData];
        if (typeof value === 'string') {
          const error = validateField(field, value);
          if (error) newErrors[field] = error;
        }
      }
    });
    setErrors(newErrors);
  }, [formData, touched]);

  // Effect to handle bank selection and auto-fill payment fields
  useEffect(() => {
    if (formData.bankId && formData.paymentType) {
      const selectedBank = MOCK_BANKS.find(bank => bank.id === formData.bankId);
      
      if (selectedBank) {
        const newAccountFields = { ...formData.accountFields };

        switch (formData.paymentType) {
          case 'ACH':
            newAccountFields.routingNumber = selectedBank.ach.routing;
            setFormData(prev => ({
              ...prev,
              accountFields: newAccountFields,
              achName: selectedBank.ach.name
            }));
            break;
          case 'WIRE':
            newAccountFields.swiftCode = selectedBank.swift;
            setFormData(prev => ({
              ...prev,
              accountFields: newAccountFields
            }));
            break;
          case 'SEPA':
            newAccountFields.iban = selectedBank.iban;
            setFormData(prev => ({
              ...prev,
              accountFields: newAccountFields
            }));
            break;
        }
      }
    }
  }, [formData.bankId, formData.paymentType]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
  };

  const handleBankSelect = (bankId: string) => {
    setFormData(prev => ({ ...prev, bankId }));
    setTouched(prev => ({ ...prev, bankId: true }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Mark all fields as touched
    const allFields = Object.keys(formData).reduce((acc, field) => ({
      ...acc,
      [field]: true
    }), {});
    setTouched(allFields);

    // Validate all fields
    const newErrors: Record<string, string> = {};
    Object.keys(formData).forEach(field => {
      const value = formData[field as keyof FormData];
      if (typeof value === 'string') {
        const error = validateField(field, value);
        if (error) newErrors[field] = error;
      }
    });

    if (Object.keys(newErrors).length === 0) {
      // Get selected bank details
      const selectedBank = MOCK_BANKS.find(bank => bank.id === formData.bankId);
      
      // Prepare the submission data
      const submissionData = {
        ...formData,
        bankDetails: selectedBank ? {
          name: selectedBank.name,
          address: selectedBank.address,
          swift: selectedBank.swift,
          ach: selectedBank.ach,
          iban: selectedBank.iban
        } : null,
        submittedAt: new Date().toISOString()
      };

      // Log the complete submission data
      console.group('Form Submission Data');
      console.log('Basic Information:', {
        displayName: submissionData.displayName,
        email: submissionData.email,
        sendNotifications: submissionData.sendNotifications
      });
      console.log('Payment Information:', {
        paymentType: submissionData.paymentType,
        bankDetails: submissionData.bankDetails,
        accountFields: submissionData.accountFields
      });
      console.log('Recipient Details:', {
        wireBeneficiary: submissionData.wireBeneficiary,
        achName: submissionData.achName,
        achId: submissionData.achId
      });
      console.log('Address Information:', {
        country: submissionData.country,
        address1: submissionData.address1,
        address2: submissionData.address2,
        city: submissionData.city,
        state: submissionData.state,
        zip: submissionData.zip
      });
      console.log('Submission Timestamp:', submissionData.submittedAt);
      console.groupEnd();

      // Here you would typically send the data to your API
      alert('Form submitted successfully! Check the console for the complete data.');
    } else {
      setErrors(newErrors);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="px-8 py-10">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Nuevo Recipient</h2>
              <p className="text-sm text-gray-600">Complete los datos del destinatario</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-10">
              <FormSection title="Información Básica">
                <div className="grid grid-cols-1 gap-6">
                  <FormField
                    id="displayName"
                    name="displayName"
                    label="Nombre para mostrar"
                    value={formData.displayName}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={errors.displayName}
                    required
                    icon={<User className="h-5 w-5 text-gray-400" />}
                  />

                  <FormField
                    id="email"
                    name="email"
                    label="Email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={errors.email}
                    required
                    icon={<Mail className="h-5 w-5 text-gray-400" />}
                  />

                  <NotificationToggle
                    checked={formData.sendNotifications}
                    onChange={handleChange}
                  />
                </div>
              </FormSection>

              <FormSection title="Información Bancaria">
                <div className="space-y-6">
                  <FormField
                    id="paymentType"
                    name="paymentType"
                    label="Tipo de Pago"
                    type="select"
                    value={formData.paymentType}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={errors.paymentType}
                    required
                    icon={<Wallet className="h-5 w-5 text-gray-400" />}
                    options={Object.entries(PAYMENT_TYPES_CONFIG).map(([key, config]) => ({
                      value: key,
                      label: config.label
                    }))}
                  />

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="block text-sm font-medium text-gray-700">
                        Banco <span className="text-red-500">*</span>
                      </label>
                      <button
                        type="button"
                        onClick={() => setIsAdvancedSearchOpen(true)}
                        className="text-sm text-primary-600 hover:text-primary-700 flex items-center"
                      >
                        <Search className="h-4 w-4 mr-1" />
                        Búsqueda avanzada
                      </button>
                    </div>
                    <BankSelector
                      value={formData.bankId}
                      onChange={handleBankSelect}
                      error={errors.bankId}
                    />
                  </div>

                  {formData.paymentType && PAYMENT_TYPES_CONFIG[formData.paymentType].fields.map(field => (
                    <FormField
                      key={field.name}
                      id={field.name}
                      name={`accountFields.${field.name}`}
                      label={field.label}
                      type={field.type}
                      value={formData.accountFields[field.name] || ''}
                      onChange={(e) => {
                        setFormData(prev => ({
                          ...prev,
                          accountFields: {
                            ...prev.accountFields,
                            [field.name]: e.target.value
                          }
                        }));
                      }}
                      onBlur={handleBlur}
                      error={errors[`accountFields.${field.name}`]}
                      required={field.required}
                      options={field.options}
                      icon={<Building2 className="h-5 w-5 text-gray-400" />}
                    />
                  ))}
                </div>
              </FormSection>

              <FormSection title="Detalles del Recipient">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    id="wireBeneficiary"
                    name="wireBeneficiary"
                    label="Wire Beneficiary"
                    value={formData.wireBeneficiary}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={errors.wireBeneficiary}
                    icon={<User className="h-5 w-5 text-gray-400" />}
                  />

                  <FormField
                    id="achName"
                    name="achName"
                    label="ACH Name"
                    value={formData.achName}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={errors.achName}
                    icon={<User className="h-5 w-5 text-gray-400" />}
                  />

                  <FormField
                    id="achId"
                    name="achId"
                    label="ACH ID"
                    value={formData.achId}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={errors.achId}
                    icon={<User className="h-5 w-5 text-gray-400" />}
                  />
                </div>
              </FormSection>

              <FormSection title="Dirección">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    id="country"
                    name="country"
                    label="País"
                    type="select"
                    value={formData.country}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={errors.country}
                    required
                    options={COUNTRIES}
                    icon={<MapPin className="h-5 w-5 text-gray-400" />}
                  />

                  <FormField
                    id="address1"
                    name="address1"
                    label="Dirección 1"
                    value={formData.address1}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={errors.address1}
                    required
                    icon={<MapPin className="h-5 w-5 text-gray-400" />}
                  />

                  <FormField
                    id="address2"
                    name="address2"
                    label="Dirección 2"
                    value={formData.address2}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={errors.address2}
                    icon={<MapPin className="h-5 w-5 text-gray-400" />}
                  />

                  <FormField
                    id="city"
                    name="city"
                    label="Ciudad"
                    value={formData.city}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={errors.city}
                    required
                    icon={<MapPin className="h-5 w-5 text-gray-400" />}
                  />

                  <FormField
                    id="state"
                    name="state"
                    label="Estado"
                    type="select"
                    value={formData.state}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={errors.state}
                    required
                    options={US_STATES}
                    icon={<MapPin className="h-5 w-5 text-gray-400" />}
                  />

                  <FormField
                    id="zip"
                    name="zip"
                    label="Código Postal"
                    value={formData.zip}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={errors.zip}
                    required
                    icon={<MapPin className="h-5 w-5 text-gray-400" />}
                  />
                </div>
              </FormSection>

              <SubmitButton disabled={Object.keys(errors).length > 0}>
                Crear Recipient
              </SubmitButton>
            </form>

            <Modal
              isOpen={isAdvancedSearchOpen}
              onClose={() => setIsAdvancedSearchOpen(false)}
              title="Búsqueda Avanzada de Bancos"
            >
              <AdvancedBankSearch
                onSelectBank={handleBankSelect}
                onClose={() => setIsAdvancedSearchOpen(false)}
              />
            </Modal>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecipientForm;