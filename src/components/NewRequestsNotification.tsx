import { useState } from "react";
import { ServiceRequest } from "@/contexts/AuthContext";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Bell, X, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";

interface NewRequestsNotificationProps {
  newRequestCount: number;
  newRequests: ServiceRequest[];
  onDismiss: () => void;
  onRequestSelect: (request: ServiceRequest) => void;
}

export function NewRequestsNotification({
  newRequestCount,
  newRequests,
  onDismiss,
  onRequestSelect,
}: NewRequestsNotificationProps) {
  const [showListModal, setShowListModal] = useState(false);

  if (newRequestCount === 0 || newRequests.length === 0) return null;

  // Get only the latest request
  const latestRequest = newRequests.reduce((latest, current) => {
    return new Date(current.dateRequested) > new Date(latest.dateRequested) ? current : latest;
  });

  return (
    <>
      {/* Floating Notification Button - Eye Catching Red Badge */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setShowListModal(true)}
        className="relative inline-flex items-center justify-center group"
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
          1
        </motion.div>

        {/* Tooltip */}
        <div className="absolute bottom-full mb-2 px-3 py-1 bg-gray-900 text-white text-xs rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
          1 new request
        </div>
      </motion.button>

      {/* New Request Detail Modal */}
      <Dialog open={showListModal} onOpenChange={setShowListModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl">New Request</DialogTitle>
            <DialogDescription>
              Latest service request
            </DialogDescription>
          </DialogHeader>

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <Card
              className="p-4 cursor-pointer hover:bg-accent hover:border-primary transition-all"
              onClick={() => {
                onRequestSelect(latestRequest);
                setShowListModal(false);
              }}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-semibold text-lg">{latestRequest.requestNumber}</h3>
                    <Badge variant="destructive" className="animate-pulse">
                      New
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">
                    <span className="font-medium">{latestRequest.year} {latestRequest.make} {latestRequest.model}</span>
                    {latestRequest.color && <span> • {latestRequest.color}</span>}
                  </p>
                  <p className="text-sm">
                    Requested by: <span className="font-medium">{latestRequest.requestedBy}</span>
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {new Date(latestRequest.dateRequested).toLocaleDateString()}
                  </p>
                </div>
                <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors mt-1" />
              </div>
            </Card>
          </motion.div>

          <div className="flex gap-2 justify-end pt-4 border-t">
            <Button variant="outline" onClick={() => setShowListModal(false)}>
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
