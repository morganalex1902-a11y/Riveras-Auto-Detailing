import { useState } from "react";
import { ServiceRequest } from "@/contexts/AuthContext";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Bell, X, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";

interface UnactedNotification extends ServiceRequest {
  notificationId: string;
  notificationDate: string;
}

interface NewRequestsNotificationProps {
  newRequestCount: number;
  newRequests: ServiceRequest[];
  unactedNotifications: UnactedNotification[];
  onDismiss: () => void;
  onRequestSelect: (request: ServiceRequest) => Promise<void>;
  onClearAll: () => Promise<void>;
}

export function NewRequestsNotification({
  newRequestCount,
  newRequests,
  unactedNotifications,
  onDismiss,
  onRequestSelect,
  onClearAll,
}: NewRequestsNotificationProps) {
  const [showListModal, setShowListModal] = useState(false);
  const [isClearing, setIsClearing] = useState(false);

  if (unactedNotifications.length === 0) return null;

  // Sort unacted notifications by date (oldest first)
  const sortedNotifications = [...unactedNotifications].sort(
    (a, b) => new Date(a.notificationDate).getTime() - new Date(b.notificationDate).getTime()
  );

  // Get the date of the first notification to display at the top
  const notificationDate = sortedNotifications.length > 0
    ? new Date(sortedNotifications[0].notificationDate).toLocaleDateString()
    : new Date().toLocaleDateString();

  return (
    <>
      {/* Floating Notification Button - Eye Catching Red Badge */}
      <div className="relative inline-flex items-center justify-center group pt-3 pr-3">
        <motion.button
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowListModal(true)}
          className="relative inline-flex items-center justify-center"
        >
        {/* Pulsing background */}
        <motion.div
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute inset-0 bg-destructive rounded-full opacity-40"
        />

        {/* Main badge */}
        <div className="relative bg-destructive hover:bg-destructive/90 text-white rounded-full w-14 h-14 flex items-center justify-center shadow-lg hover:shadow-xl transition-all cursor-pointer border-2 border-destructive/50">
          <Bell className="w-6 h-6" />
        </div>

        {/* Number badge */}
        <motion.div
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 0.5, repeat: Infinity }}
          className="absolute -top-2 -right-2 bg-white text-destructive rounded-full w-7 h-7 flex items-center justify-center text-xs font-bold shadow-lg border-2 border-destructive"
        >
          {unactedNotifications.length}
        </motion.div>

          {/* Tooltip */}
          <div className="absolute bottom-full mb-2 px-3 py-1 bg-gray-900 text-white text-xs rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
            {unactedNotifications.length} unacted request{unactedNotifications.length > 1 ? "s" : ""}
          </div>
        </motion.button>
      </div>

      {/* Unacted Notifications Modal */}
      <Dialog open={showListModal} onOpenChange={setShowListModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl">Pending Notifications</DialogTitle>
            <DialogDescription>
              {unactedNotifications.length} unacted request{unactedNotifications.length > 1 ? "s" : ""} from {notificationDate}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 max-h-96 overflow-y-auto">
            {sortedNotifications.map((notification) => {
              const isServiceRequest = notification.requestType === "service";

              return (
                <motion.div
                  key={notification.notificationId}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  whileHover={{ x: 4 }}
                >
                  <Card
                    className={`p-4 cursor-pointer transition-all group border-2 ${
                      isServiceRequest
                        ? "bg-blue-950/20 border-blue-500/50 hover:bg-blue-950/30 hover:border-blue-400"
                        : "bg-background hover:bg-accent hover:border-primary border-border"
                    }`}
                    onClick={async () => {
                      await onRequestSelect(notification);
                      setShowListModal(false);
                    }}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold text-lg">{notification.requestNumber}</h3>
                          <Badge
                            variant="destructive"
                            className="animate-pulse"
                          >
                            Pending
                          </Badge>
                          <Badge
                            variant={isServiceRequest ? "secondary" : "outline"}
                            className={isServiceRequest ? "bg-blue-500 text-white font-semibold" : ""}
                          >
                            {isServiceRequest ? "SERVICE" : "SALES"}
                          </Badge>
                        </div>

                        {/* RO Number for Service Requests */}
                        {isServiceRequest && notification.roNumber && (
                          <p className="text-xs font-mono bg-blue-500/20 text-blue-300 px-2 py-1 rounded mb-2 inline-block">
                            RO #{notification.roNumber}
                          </p>
                        )}

                        <p className="text-sm text-muted-foreground mb-2">
                          <span className="font-medium">{notification.year} {notification.make} {notification.model}</span>
                          {notification.color && <span> • {notification.color}</span>}
                        </p>
                        <p className="text-sm">
                          Requested by: <span className="font-medium">{notification.requestedBy}</span>
                        </p>
                      </div>
                      <ChevronRight className={`w-5 h-5 transition-colors mt-1 ${
                        isServiceRequest
                          ? "text-blue-400 group-hover:text-blue-300"
                          : "text-muted-foreground group-hover:text-primary"
                      }`} />
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </div>

          <div className="flex gap-2 justify-between pt-4 border-t">
            <Button
              variant="destructive"
              onClick={async () => {
                setIsClearing(true);
                try {
                  await onClearAll();
                  setShowListModal(false);
                } finally {
                  setIsClearing(false);
                }
              }}
              disabled={isClearing}
              className="text-xs"
            >
              {isClearing ? "Clearing..." : "Clear All Notifications"}
            </Button>
            <Button variant="outline" onClick={() => setShowListModal(false)} disabled={isClearing}>
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
