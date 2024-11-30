import { useState, useEffect } from 'react';
import { setupPushNotifications } from '../services/pushNotification';

export const usePushNotifications = () => {
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkSupport = () => {
      const supported = 'Notification' in window && 'serviceWorker' in navigator;
      setIsSupported(supported);
      setIsLoading(false);
    };

    checkSupport();
  }, []);

  const subscribe = async () => {
    try {
      const subscription = await setupPushNotifications();
      setIsSubscribed(!!subscription);
      return true;
    } catch (error) {
      console.error('Failed to subscribe to push notifications:', error);
      return false;
    }
  };

  return {
    isSupported,
    isSubscribed,
    isLoading,
    subscribe
  };
};