import toast from 'react-hot-toast';

export const showPaymentNotification = (status: 'success' | 'error', message: string) => {
  if (status === 'success') {
    toast.success(message, {
      duration: 5000,
      position: 'top-right',
      style: {
        background: '#ffffff',
        color: '#1a1a1a',
        borderRadius: '0.75rem',
        boxShadow: '0 4px 20px -4px rgba(0,0,0,0.1)',
      },
    });
  } else {
    toast.error(message, {
      duration: 5000,
      position: 'top-right',
      style: {
        background: '#ffffff',
        color: '#1a1a1a',
        borderRadius: '0.75rem',
        boxShadow: '0 4px 20px -4px rgba(0,0,0,0.1)',
      },
    });
  }
};