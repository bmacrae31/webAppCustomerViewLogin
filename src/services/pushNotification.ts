import { notificationApi } from './api/notifications';

export async function setupPushNotifications() {
  try {
    if (!('Notification' in window)) {
      console.log('This browser does not support notifications');
      return;
    }

    let permission = Notification.permission;

    if (permission === 'default') {
      permission = await Notification.requestPermission();
    }

    if (permission !== 'granted') {
      console.log('Notification permission not granted');
      return;
    }

    const registration = await navigator.serviceWorker.register('/sw.js');
    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: import.meta.env.VITE_VAPID_PUBLIC_KEY
    });

    await notificationApi.registerPushToken(JSON.stringify(subscription));
    
    return subscription;
  } catch (error) {
    console.error('Error setting up push notifications:', error);
    return null;
  }
}