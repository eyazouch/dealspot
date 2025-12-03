import { useEffect } from 'react';
import { CheckCircle, XCircle, AlertTriangle } from 'lucide-react';

// Popup de notification (succès/erreur) - semi-transparent, disparaît automatiquement
export function NotificationPopup({ message, type = 'success', onClose }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const config = {
    success: {
      bg: 'bg-green-500/90',
      icon: <CheckCircle className="w-6 h-6" />,
    },
    error: {
      bg: 'bg-red-500/90',
      icon: <XCircle className="w-6 h-6" />,
    },
    warning: {
      bg: 'bg-orange-500/90',
      icon: <AlertTriangle className="w-6 h-6" />,
    },
  };

  const { bg, icon } = config[type] || config.success;

  return (
    <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 animate-fade-in">
      <div className={`${bg} text-white px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3 backdrop-blur-sm`}>
        {icon}
        <span className="font-medium">{message}</span>
      </div>
    </div>
  );
}

// Popup de confirmation - opaque avec boutons
export function ConfirmPopup({ message, onConfirm, onCancel }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onCancel}
      />
      
      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl p-6 max-w-md w-full mx-4 animate-scale-in">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
            <AlertTriangle className="w-6 h-6 text-orange-600" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Confirmation</h3>
            <p className="text-gray-600">{message}</p>
          </div>
        </div>
        
        <div className="flex gap-3 mt-6 justify-end">
          <button
            onClick={onCancel}
            className="px-5 py-2.5 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
          >
            Annuler
          </button>
          <button
            onClick={onConfirm}
            className="px-5 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );
}

// Hook personnalisé pour gérer les popups
import { useState, useCallback } from 'react';

export function usePopup() {
  const [notification, setNotification] = useState(null);
  const [confirm, setConfirm] = useState(null);

  const showNotification = useCallback((message, type = 'success') => {
    setNotification({ message, type });
  }, []);

  const hideNotification = useCallback(() => {
    setNotification(null);
  }, []);

  const showConfirm = useCallback((message) => {
    return new Promise((resolve) => {
      setConfirm({
        message,
        onConfirm: () => {
          setConfirm(null);
          resolve(true);
        },
        onCancel: () => {
          setConfirm(null);
          resolve(false);
        },
      });
    });
  }, []);

  const PopupComponents = () => (
    <>
      {notification && (
        <NotificationPopup
          message={notification.message}
          type={notification.type}
          onClose={hideNotification}
        />
      )}
      {confirm && (
        <ConfirmPopup
          message={confirm.message}
          onConfirm={confirm.onConfirm}
          onCancel={confirm.onCancel}
        />
      )}
    </>
  );

  return {
    showNotification,
    showConfirm,
    PopupComponents,
  };
}
