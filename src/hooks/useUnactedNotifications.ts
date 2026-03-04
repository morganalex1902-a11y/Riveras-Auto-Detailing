import { useState, useEffect, useCallback } from "react";
import { ServiceRequest } from "@/contexts/AuthContext";

interface UnactedNotification extends ServiceRequest {
  notificationId: string;
  notificationDate: string;
}

export function useUnactedNotifications() {
  const [unactedNotifications, setUnactedNotifications] = useState<UnactedNotification[]>([]);
  const [dismissedRequestIds, setDismissedRequestIds] = useState<Set<number>>(new Set());

  // Load unacted notifications from localStorage
  useEffect(() => {
    const stored = localStorage.getItem("unacted-notifications");
    const dismissedIds = localStorage.getItem("dismissed-request-ids");
    if (stored) {
      try {
        setUnactedNotifications(JSON.parse(stored));
      } catch (error) {
        console.error("Failed to parse unacted notifications:", error);
        setUnactedNotifications([]);
      }
    }
    if (dismissedIds) {
      try {
        setDismissedRequestIds(new Set(JSON.parse(dismissedIds)));
      } catch (error) {
        console.error("Failed to parse dismissed request IDs:", error);
      }
    }
  }, []);

  // Save unacted notifications to localStorage
  const saveNotifications = useCallback((notifications: UnactedNotification[]) => {
    localStorage.setItem("unacted-notifications", JSON.stringify(notifications));
    setUnactedNotifications(notifications);
  }, []);

  // Add a new unacted notification
  const addUnactedNotification = useCallback((request: ServiceRequest) => {
    setUnactedNotifications((prev) => {
      // Check if this request is already in the unacted list or has been dismissed
      const exists = prev.some((n) => n.id === request.id);
      if (exists || dismissedRequestIds.has(request.id)) return prev;

      const newNotification: UnactedNotification = {
        ...request,
        notificationId: `${request.id}-${Date.now()}`,
        notificationDate: new Date().toISOString(),
      };

      const updated = [...prev, newNotification];
      saveNotifications(updated);
      return updated;
    });
  }, [saveNotifications, dismissedRequestIds]);

  // Remove a notification when acted upon (request opened)
  const markAsActed = useCallback((requestId: number) => {
    setUnactedNotifications((prev) => {
      const updated = prev.filter((n) => n.id !== requestId);
      saveNotifications(updated);

      // Also add to dismissed IDs so it won't be re-added
      const newDismissedIds = new Set(dismissedRequestIds);
      newDismissedIds.add(requestId);
      localStorage.setItem("dismissed-request-ids", JSON.stringify(Array.from(newDismissedIds)));
      setDismissedRequestIds(newDismissedIds);

      return updated;
    });
  }, [saveNotifications, dismissedRequestIds]);

  // Clear all unacted notifications
  const clearAll = useCallback(() => {
    // Mark all current notification request IDs as dismissed
    const newDismissedIds = new Set(dismissedRequestIds);
    unactedNotifications.forEach((notification) => {
      newDismissedIds.add(notification.id);
    });

    localStorage.setItem("unacted-notifications", JSON.stringify([]));
    localStorage.setItem("dismissed-request-ids", JSON.stringify(Array.from(newDismissedIds)));
    setUnactedNotifications([]);
    setDismissedRequestIds(newDismissedIds);
  }, [unactedNotifications, dismissedRequestIds]);

  return {
    unactedNotifications,
    addUnactedNotification,
    markAsActed,
    clearAll,
  };
}
