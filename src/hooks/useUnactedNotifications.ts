import { useState, useEffect, useCallback } from "react";
import { ServiceRequest } from "@/contexts/AuthContext";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";

interface UnactedNotification extends ServiceRequest {
  notificationId: string;
  notificationDate: string;
}

export function useUnactedNotifications() {
  const [unactedNotifications, setUnactedNotifications] = useState<UnactedNotification[]>([]);
  const [dismissedRequestIds, setDismissedRequestIds] = useState<Set<number>>(new Set());
  const [isLoaded, setIsLoaded] = useState(false);
  const { user } = useAuth();

  // Load dismissed requests from Supabase
  useEffect(() => {
    const loadDismissedRequests = async () => {
      try {
        if (!user?.id) {
          setIsLoaded(true);
          return;
        }

        const { data, error } = await supabase
          .from("dismissed_requests")
          .select("request_id")
          .eq("user_id", user.id);

        if (error) throw error;

        const dismissedIds = new Set((data || []).map((d: any) => d.request_id));
        setDismissedRequestIds(dismissedIds);
      } catch (error) {
        console.error("Failed to load dismissed requests from database:", error);
      } finally {
        setIsLoaded(true);
      }
    };

    loadDismissedRequests();
  }, [user?.id]);

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

      return [...prev, newNotification];
    });
  }, [dismissedRequestIds]);

  // Remove a notification when acted upon (request opened)
  const markAsActed = useCallback(async (requestId: number) => {
    try {
      if (!user?.id) return;

      // Save to database
      await supabase
        .from("dismissed_requests")
        .insert({
          user_id: user.id,
          request_id: requestId,
        })
        .select()
        .maybeSingle();

      // Update local state
      setUnactedNotifications((prev) => prev.filter((n) => n.id !== requestId));

      // Add to dismissed IDs so it won't be re-added
      const newDismissedIds = new Set(dismissedRequestIds);
      newDismissedIds.add(requestId);
      setDismissedRequestIds(newDismissedIds);
    } catch (error) {
      console.error("Failed to mark request as acted:", error);
    }
  }, [user?.id, dismissedRequestIds]);

  // Clear all unacted notifications
  const clearAll = useCallback(async () => {
    try {
      if (!user?.id) return;

      // Prepare request IDs to dismiss
      const requestIdsToDissmiss = unactedNotifications
        .filter((n) => !dismissedRequestIds.has(n.id))
        .map((n) => ({ user_id: user.id, request_id: n.id }));

      // Save all to database
      if (requestIdsToDissmiss.length > 0) {
        await supabase
          .from("dismissed_requests")
          .insert(requestIdsToDissmiss)
          .select();
      }

      // Update local state
      const newDismissedIds = new Set(dismissedRequestIds);
      unactedNotifications.forEach((notification) => {
        newDismissedIds.add(notification.id);
      });

      setUnactedNotifications([]);
      setDismissedRequestIds(newDismissedIds);
    } catch (error) {
      console.error("Failed to clear all notifications:", error);
    }
  }, [user?.id, unactedNotifications, dismissedRequestIds]);

  return {
    unactedNotifications,
    addUnactedNotification,
    markAsActed,
    clearAll,
    isLoaded,
  };
}
