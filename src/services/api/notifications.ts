import { api } from './config';
import { Notification, NotificationPreferences } from '../../types';

export const notificationApi = {
  getNotifications: () => 
    api.get<Notification[]>('/notifications'),

  markAsRead: (notificationId: string) =>
    api.post<{ success: boolean }>(`/notifications/${notificationId}/read`),

  markAllAsRead: () =>
    api.post<{ success: boolean }>('/notifications/read-all'),

  deleteNotification: (notificationId: string) =>
    api.delete<{ success: boolean }>(`/notifications/${notificationId}`),

  getPreferences: () =>
    api.get<NotificationPreferences>('/notifications/preferences'),

  updatePreferences: (preferences: Partial<NotificationPreferences>) =>
    api.patch<NotificationPreferences>('/notifications/preferences', preferences),

  registerPushToken: (token: string) =>
    api.post<{ success: boolean }>('/notifications/push-token', { token }),
};