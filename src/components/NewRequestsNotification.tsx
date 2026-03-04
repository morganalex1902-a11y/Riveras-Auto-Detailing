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

  if (newRequestCount === 0) return null;

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
          {newRequestCount}
        </motion.div>

        {/* Tooltip */}
        <div className="absolute bottom-full mb-2 px-3 py-1 bg-gray-900 text-white text-xs rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
          {newRequestCount} new request{newRequestCount > 1 ? "s" : ""}
        </div>
      </motion.button>

      {/* New Requests List Modal */}
      <Dialog open={showListModal} onOpenChange={setShowListModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl">New Requests</DialogTitle>
            <DialogDescription>
              You have {newRequestCount} new service request{newRequestCount > 1 ? "s" : ""}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 max-h-96 overflow-y-auto">
            {newRequests.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">No new requests</p>
            ) : (
              newRequests.map((request) => (
                <motion.div
                  key={request.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  whileHover={{ x: 4 }}
                >
                  <Card
                    className="p-4 cursor-pointer hover:bg-accent hover:border-primary transition-all group"
                    onClick={() => {
                      onRequestSelect(request);
                      setShowListModal(false);
                    }}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold text-lg">{request.requestNumber}</h3>
                          <Badge variant="destructive" className="animate-pulse">
                            New
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">
                          <span className="font-medium">{request.year} {request.make} {request.model}</span>
                          {request.color && <span> • {request.color}</span>}
                        </p>
                        <p className="text-sm">
                          Requested by: <span className="font-medium">{request.requestedBy}</span>
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {new Date(request.dateRequested).toLocaleDateString()}
                        </p>
                      </div>
                      <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors mt-1" />
                    </div>
                  </Card>
                </motion.div>
              ))
            )}
          </div>

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
