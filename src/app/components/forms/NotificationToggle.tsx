import React from 'react';
import { Bell } from 'lucide-react';

interface NotificationToggleProps {
  checked: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const NotificationToggle: React.FC<NotificationToggleProps> = ({ checked, onChange }) => {
  return (
    <div className="flex items-center p-4 bg-white rounded-lg border border-gray-200 shadow-sm hover:bg-gray-50 transition-colors">
      <input
        type="checkbox"
        id="sendNotifications"
        name="sendNotifications"
        checked={checked}
        onChange={onChange}
        className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
      />
      <div className="ml-3 flex items-center">
        <Bell className="h-5 w-5 text-primary-500 mr-2" />
        <label htmlFor="sendNotifications" className="text-sm text-gray-700">
          Enviar notificaciones cuando se realicen pagos
        </label>
      </div>
    </div>
  );
};