import React from 'react';

interface SubmitButtonProps {
  disabled?: boolean;
  children: React.ReactNode;
}

export const SubmitButton: React.FC<SubmitButtonProps> = ({ disabled, children }) => {
  return (
    <button
      type="submit"
      disabled={disabled}
      className="w-full flex justify-center py-4 px-6 border border-transparent rounded-xl shadow-md text-base font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98]"
    >
      {children}
    </button>
  );
};