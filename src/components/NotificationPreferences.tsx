import React from 'react';
import { Switch } from '@headlessui/react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { notificationApi } from '../services/api/notifications';
import { usePushNotifications } from '../hooks/usePushNotifications';
import { Bell, Mail, BadgeAlert, Gift, CreditCard } from 'lucide-react';

interface Props {
  isDarkMode: boolean;
}

export const NotificationPreferences: React.FC<Props> = ({ isDarkMode }) => {
  const queryClient = useQueryClient();
  const { isSupported, isSubscribed, subscribe } = usePushNotifications();

  const { data: preferences } = useQuery(
    'notificationPreferences',
    notificationApi.getPreferences
  );

  const { mutate: updatePreferences } = useMutation(
    notificationApi.updatePreferences,
    {
      onSuccess: () => {
        queryClient.invalidateQueries('notificationPreferences');
      }
    }
  );

  const handlePushToggle = async () => {
    if (!isSubscribed) {
      const success = await subscribe();
      if (success) {
        updatePreferences({ push: true });
      }
    } else {
      updatePreferences({ push: false });
    }
  };

  const togglePreference = (key: keyof typeof preferences) => {
    if (preferences) {
      updatePreferences({ [key]: !preferences[key] });
    }
  };

  if (!preferences) return null;

  return (
    <div className={`space-y-6 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Notification Channels</h3>
        
        <div className="space-y-4">
          {isSupported && (
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Bell className="w-5 h-5" />
                <div>
                  <p className="font-medium">Push Notifications</p>
                  <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    Receive notifications on your device
                  </p>
                </div>
              </div>
              <Switch
                checked={preferences.push}
                onChange={handlePushToggle}
                className={`${
                  preferences.push ? 'bg-rethink-blue' : isDarkMode ? 'bg-gray-600' : 'bg-gray-200'
                } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-rethink-blue focus:ring-offset-2`}
              >
                <span className={`${
                  preferences.push ? 'translate-x-6' : 'translate-x-1'
                } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`} />
              </Switch>
            </div>
          )}

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Mail className="w-5 h-5" />
              <div>
                <p className="font-medium">Email Notifications</p>
                <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  Receive updates via email
                </p>
              </div>
            </div>
            <Switch
              checked={preferences.email}
              onChange={() => togglePreference('email')}
              className={`${
                preferences.email ? 'bg-rethink-blue' : isDarkMode ? 'bg-gray-600' : 'bg-gray-200'
              } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-rethink-blue focus:ring-offset-2`}
            >
              <span className={`${
                preferences.email ? 'translate-x-6' : 'translate-x-1'
              } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`} />
            </Switch>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Notification Types</h3>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <CreditCard className="w-5 h-5" />
              <p className="font-medium">Payment Alerts</p>
            </div>
            <Switch
              checked={preferences.paymentAlerts}
              onChange={() => togglePreference('paymentAlerts')}
              className={`${
                preferences.paymentAlerts ? 'bg-rethink-blue' : isDarkMode ? 'bg-gray-600' : 'bg-gray-200'
              } relative inline-flex h-6 w-11 items-center rounded-full`}
            >
              <span className={`${
                preferences.paymentAlerts ? 'translate-x-6' : 'translate-x-1'
              } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`} />
            </Switch>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Gift className="w-5 h-5" />
              <p className="font-medium">Reward Alerts</p>
            </div>
            <Switch
              checked={preferences.rewardAlerts}
              onChange={() => togglePreference('rewardAlerts')}
              className={`${
                preferences.rewardAlerts ? 'bg-rethink-blue' : isDarkMode ? 'bg-gray-600' : 'bg-gray-200'
              } relative inline-flex h-6 w-11 items-center rounded-full`}
            >
              <span className={`${
                preferences.rewardAlerts ? 'translate-x-6' : 'translate-x-1'
              } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`} />
            </Switch>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <BadgeAlert className="w-5 h-5" />
              <p className="font-medium">System Alerts</p>
            </div>
            <Switch
              checked={preferences.systemAlerts}
              onChange={() => togglePreference('systemAlerts')}
              className={`${
                preferences.systemAlerts ? 'bg-rethink-blue' : isDarkMode ? 'bg-gray-600' : 'bg-gray-200'
              } relative inline-flex h-6 w-11 items-center rounded-full`}
            >
              <span className={`${
                preferences.systemAlerts ? 'translate-x-6' : 'translate-x-1'
              } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`} />
            </Switch>
          </div>
        </div>
      </div>
    </div>
  );
};