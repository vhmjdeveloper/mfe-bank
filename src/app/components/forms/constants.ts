export const PAYMENT_TYPES_CONFIG = {
  ACH: {
    label: 'ACH (US Bank Transfer)',
    fields: [
      {
        name: 'routingNumber',
        label: 'Routing Number',
        type: 'text',
        required: true,
        validation: (value: string) => value.length === 9 ? '' : 'Routing number debe tener 9 dígitos'
      },
      {
        name: 'accountNumber',
        label: 'Account Number',
        type: 'text',
        required: true,
        validation: (value: string) => value.length >= 4 ? '' : 'Account number debe tener al menos 4 dígitos'
      },
      {
        name: 'accountType',
        label: 'Account Type',
        type: 'select',
        required: true,
        options: [
          { value: 'checking', label: 'Checking' },
          { value: 'savings', label: 'Savings' }
        ]
      }
    ]
  },
  WIRE: {
    label: 'Wire Transfer',
    fields: [
      {
        name: 'swiftCode',
        label: 'SWIFT Code',
        type: 'text',
        required: true,
        validation: (value: string) => value.length >= 8 && value.length <= 11 ? '' : 'SWIFT code debe tener entre 8 y 11 caracteres'
      },
      {
        name: 'accountNumber',
        label: 'IBAN/Account Number',
        type: 'text',
        required: true,
        validation: (value: string) => value.length >= 4 ? '' : 'Account number debe tener al menos 4 caracteres'
      }
    ]
  },
  SEPA: {
    label: 'SEPA Transfer',
    fields: [
      {
        name: 'iban',
        label: 'IBAN',
        type: 'text',
        required: true,
        validation: (value: string) => value.length >= 15 ? '' : 'IBAN debe tener al menos 15 caracteres'
      }
    ]
  }
};

export const MOCK_BANKS = [
  {
    id: '1',
    name: 'Bank of America',
    address: '100 North Tryon Street, Charlotte, NC 28255',
    swift: 'BOFAUS3N',
    ach: {
      routing: '026009593',
      name: 'Bank of America, N.A'
    },
    iban: 'US45BOFA1234567890'
  },
  {
    id: '2',
    name: 'Chase',
    address: '383 Madison Avenue, New York, NY 10179',
    swift: 'CHASUS33',
    ach: {
      routing: '021000021',
      name: 'JPMorgan Chase Bank, N.A'
    },
    iban: 'US66CHAS9876543210'
  },
  {
    id: '3',
    name: 'Wells Fargo',
    address: '420 Montgomery Street, San Francisco, CA 94104',
    swift: 'WFBIUS6S',
    ach: {
      routing: '121000248',
      name: 'Wells Fargo Bank, N.A'
    },
    iban: 'US89WFBG5432109876'
  },
  {
    id: '4',
    name: 'Citibank',
    address: '388 Greenwich Street, New York, NY 10013',
    swift: 'CITIUS33',
    ach: {
      routing: '021000089',
      name: 'Citibank, N.A'
    },
    iban: 'US12CITI3456789012'
  }
];

export const COUNTRIES = [
  { value: 'US', label: 'United States' },
  { value: 'CA', label: 'Canada' },
  { value: 'MX', label: 'Mexico' },
  { value: 'GB', label: 'United Kingdom' },
  { value: 'ES', label: 'Spain' },
  { value: 'FR', label: 'France' },
  { value: 'DE', label: 'Germany' },
  { value: 'IT', label: 'Italy' },
];

export const US_STATES = [
  { value: 'AL', label: 'Alabama' },
  { value: 'AK', label: 'Alaska' },
  { value: 'AZ', label: 'Arizona' },
  { value: 'AR', label: 'Arkansas' },
  { value: 'CA', label: 'California' },
  { value: 'CO', label: 'Colorado' },
  { value: 'CT', label: 'Connecticut' },
  { value: 'DE', label: 'Delaware' },
  { value: 'FL', label: 'Florida' },
  { value: 'GA', label: 'Georgia' },
  { value: 'HI', label: 'Hawaii' },
  { value: 'ID', label: 'Idaho' },
  { value: 'IL', label: 'Illinois' },
  { value: 'IN', label: 'Indiana' },
  { value: 'IA', label: 'Iowa' },
  { value: 'KS', label: 'Kansas' },
  { value: 'KY', label: 'Kentucky' },
  { value: 'LA', label: 'Louisiana' },
  { value: 'ME', label: 'Maine' },
  { value: 'MD', label: 'Maryland' },
  { value: 'MA', label: 'Massachusetts' },
  { value: 'MI', label: 'Michigan' },
  { value: 'MN', label: 'Minnesota' },
  { value: 'MS', label: 'Mississippi' },
  { value: 'MO', label: 'Missouri' },
  { value: 'MT', label: 'Montana' },
  { value: 'NE', label: 'Nebraska' },
  { value: 'NV', label: 'Nevada' },
  { value: 'NH', label: 'New Hampshire' },
  { value: 'NJ', label: 'New Jersey' },
  { value: 'NM', label: 'New Mexico' },
  { value: 'NY', label: 'New York' },
  { value: 'NC', label: 'North Carolina' },
  { value: 'ND', label: 'North Dakota' },
  { value: 'OH', label: 'Ohio' },
  { value: 'OK', label: 'Oklahoma' },
  { value: 'OR', label: 'Oregon' },
  { value: 'PA', label: 'Pennsylvania' },
  { value: 'RI', label: 'Rhode Island' },
  { value: 'SC', label: 'South Carolina' },
  { value: 'SD', label: 'South Dakota' },
  { value: 'TN', label: 'Tennessee' },
  { value: 'TX', label: 'Texas' },
  { value: 'UT', label: 'Utah' },
  { value: 'VT', label: 'Vermont' },
  { value: 'VA', label: 'Virginia' },
  { value: 'WA', label: 'Washington' },
  { value: 'WV', label: 'West Virginia' },
  { value: 'WI', label: 'Wisconsin' },
  { value: 'WY', label: 'Wyoming' },
];