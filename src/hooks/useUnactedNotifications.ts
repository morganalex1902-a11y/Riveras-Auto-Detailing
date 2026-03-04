import { useState, useEffect, useCallback } from "react";
import { ServiceRequest } from "@/contexts/AuthContext";

interface UnactedNotification extends ServiceRequest {
  notificationId: string;
  notificationDate: string;
}

export function useUnactedNotifications() {
  const [unactedNotifications, setUnactedNotifications] = useState<UnactedNotification[]>([]);

  // Load unacted notifications from localStorage
  useEffect(() => {
    const stored = localStorage.getItem("unacted-notifications");
    if (stored) {
      try {
        setUnactedNotifications(JSON.parse(stored));
      } catch (error) {
        console.error("Failed to parse unacted notifications:", error);
        setUnactedNotifications([]);
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
      // Check if this request is already in the unacted list
      const exists = prev.some((n) => n.id === request.id);
      if (exists) return prev;

      const newNotification: UnactedNotification = {
        ...request,
        notificationId: `${request.id}-${Date.now()}`,
        notificationDate: new Date().toISOString(),
      };

      const updated = [...prev, newNotification];
      saveNotifications(updated);
      return updated;
    });
  }, [saveNotifications]);

  // Remove a notification when acted upon (request opened)
  const markAsActed = useCallback((requestId: number) => {
    setUnactedNotifications((prev) => {
      const updated = prev.filter((n) => n.id !== requestId);
      saveNotifications(updated);
      return updated;
    });
  }, [saveNotifications]);

  // Clear all unacted notifications
  const clearAll = useCallback(() => {
    saveNotifications([]);
  }, [saveNotifications]);

  return {
    unactedNotifications,
    addUnactedNotification,
    markAsActed,
    clearAll,
  };
}
