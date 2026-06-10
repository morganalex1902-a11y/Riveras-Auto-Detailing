import { useState, useEffect, useCallback } from "react";
import { ServiceRequest } from "@/contexts/AuthContext";
import { useAuth } from "@/contexts/AuthContext";

interface UnactedNotification extends ServiceRequest {
  notificationId: string;
  notificationDate: string;
}

const getStorageKey = (userId: string) => `viewed_notifications_${userId}`;

function loadDismissedIds(userId: string): Set<number> {
  try {
    const raw = localStorage.getItem(getStorageKey(userId));
    if (!raw) return new Set();
    return new Set(JSON.parse(raw) as number[]);
  } catch {
    return new Set();
  }
}

function saveDismissedIds(userId: string, ids: Set<number>) {
  try {
    localStorage.setItem(getStorageKey(userId), JSON.stringify([...ids]));
  } catch {
    // ignore storage errors
  }
}

export function useUnactedNotifications() {
  const [unactedNotifications, setUnactedNotifications] = useState<UnactedNotification[]>([]);
  const [dismissedRequestIds, setDismissedRequestIds] = useState<Set<number>>(new Set());
  const [isLoaded, setIsLoaded] = useState(false);
  const { user } = useAuth();

  // Load dismissed notification IDs from localStorage
  useEffect(() => {
    if (!user?.id) {
      setIsLoaded(true);
      return;
    }
    const ids = loadDismissedIds(user.id);
    setDismissedRequestIds(ids);
    setIsLoaded(true);
  }, [user?.id]);

  const addUnactedNotification = useCallback((request: ServiceRequest) => {
    setUnactedNotifications((prev) => {
      const exists = prev.some((n) => n.id === request.id);
      if (exists || dismissedRequestIds.has(request.id)) return prev;

      const newNotification: UnactedNotification = {
        ...request,
        notificationId: `${request.id}-${Date.now()}`,
        notificationDate: new Date().toISOString(),
      };

      return [...prev, newNotification];
    });
  }, [dismissedRequestIds]);

  const markAsActed = useCallback(async (requestId: number) => {
    setUnactedNotifications((prev) => prev.filter((n) => n.id !== requestId));

    setDismissedRequestIds((prev) => {
      const updated = new Set(prev);
      updated.add(requestId);
      if (user?.id) saveDismissedIds(user.id, updated);
      return updated;
    });
  }, [user?.id]);

  const clearAll = useCallback(async () => {
    setUnactedNotifications((notifications) => {
      const updated = new Set(dismissedRequestIds);
      notifications.forEach((n) => updated.add(n.id));
      if (user?.id) saveDismissedIds(user.id, updated);
      setDismissedRequestIds(updated);
      return [];
    });
  }, [user?.id, dismissedRequestIds]);

  return {
    unactedNotifications,
    addUnactedNotification,
    markAsActed,
    clearAll,
    isLoaded,
  };
}
