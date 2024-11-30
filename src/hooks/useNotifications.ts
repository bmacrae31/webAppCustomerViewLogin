import { useQuery, useMutation, useQueryClient } from 'react-query';
import { notificationApi } from '../services/api/notifications';
import { Notification } from '../types';

export const useNotifications = () => {
  const queryClient = useQueryClient();

  const { data: notifications = [], isLoading } = useQuery(
    'notifications',
    notificationApi.getNotifications,
    {
      staleTime: 1000 * 60, // 1 minute
      refetchInterval: 1000 * 60 * 5, // 5 minutes
      // Transform data to ensure proper serialization
      select: (data: Notification[]) => data.map(notification => ({
        ...notification,
        timestamp: new Date(notification.timestamp).toISOString(),
        metadata: notification.metadata ? {
          ...notification.metadata,
          amount: notification.metadata.amount ? Number(notification.metadata.amount) : undefined
        } : undefined
      })),
      // Add error handling
      onError: (error) => {
        console.error('Failed to fetch notifications:', error);
      }
    }
  );

  const { mutate: markAsRead } = useMutation(
    notificationApi.markAsRead,
    {
      onSuccess: (_, notificationId) => {
        queryClient.setQueryData<Notification[]>(
          'notifications',
          (old = []) => old.map(n => 
            n.id === notificationId ? { ...n, isRead: true } : n
          )
        );
      },
      onError: (error) => {
        console.error('Failed to mark notification as read:', error);
      }
    }
  );

  const { mutate: markAllAsRead } = useMutation(
    notificationApi.markAllAsRead,
    {
      onSuccess: () => {
        queryClient.setQueryData<Notification[]>(
          'notifications',
          (old = []) => old.map(n => ({ ...n, isRead: true }))
        );
      },
      onError: (error) => {
        console.error('Failed to mark all notifications as read:', error);
      }
    }
  );

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return {
    notifications,
    unreadCount,
    isLoading,
    markAsRead,
    markAllAsRead,
  };
};