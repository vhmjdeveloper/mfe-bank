import React from 'react';

interface FormSectionProps {
  title: string;
  children: React.ReactNode;
}

export const FormSection: React.FC<FormSectionProps> = ({ title, children }) => {
  return (
    <div className="bg-gray-50 px-8 py-6 rounded-xl border border-gray-100 shadow-sm">
      <h3 className="text-xl font-semibold text-gray-900 mb-6 pb-3 border-b border-gray-200">{title}</h3>
      <div className="space-y-6">
        {children}
      </div>
    </div>
  );
};