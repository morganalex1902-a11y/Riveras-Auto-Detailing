import { useState } from "react";
import { ServiceRequest } from "@/contexts/AuthContext";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { X, Save, Trash2 } from "lucide-react";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";

interface RequestDetailModalProps {
  isOpen: boolean;
  request: ServiceRequest | null;
  onClose: () => void;
  onUpdate: (id: number, data: Partial<ServiceRequest>) => Promise<void>;
  onDelete: (id: number) => Promise<void>;
}

const STATUSES = ["Pending", "Completed"];

export function RequestDetailModal({
  isOpen,
  request,
  onClose,
  onUpdate,
  onDelete,
}: RequestDetailModalProps) {
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Form state
  const [editData, setEditData] = useState<Partial<ServiceRequest>>({});

  const handleStartEdit = () => {
    if (request) {
      setEditData({
        status: request.status,
        price: request.price,
        manager: request.manager,
        notes: request.notes,
        dueDate: request.dueDate,
        dueTime: request.dueTime,
        startDate: request.startDate,
        startTime: request.startTime,
      });
      setIsEditing(true);
    }
  };

  const handleSave = async () => {
    if (!request) return;
    setIsSaving(true);
    try {
      await onUpdate(request.id, editData);
      toast({
        title: "Success",
        description: "Request updated successfully.",
      });
      setIsEditing(false);
      onClose();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error?.message || "Failed to update request.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!request) return;
    if (!window.confirm("Are you sure you want to delete this request?")) return;

    setIsDeleting(true);
    try {
      await onDelete(request.id);
      toast({
        title: "Success",
        description: "Request deleted successfully.",
      });
      onClose();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error?.message || "Failed to delete request.",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  if (!request) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {request.requestNumber}
            <Badge variant={request.status === "Pending" ? "destructive" : "secondary"}>
              {request.status}
            </Badge>
          </DialogTitle>
          <DialogDescription>
            {request.year} {request.make} {request.model}
            {request.color && ` • ${request.color}`}
          </DialogDescription>
        </DialogHeader>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Vehicle Information */}
          <div>
            <h3 className="text-sm font-semibold mb-3 text-muted-foreground uppercase tracking-wide">
              Vehicle Information
            </h3>
            <Card className="p-4 bg-muted/50">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-muted-foreground">Stock VIN</p>
                  <p className="font-mono text-sm">{request.stockVin}</p>
                </div>
                {request.poNumber && (
                  <div>
                    <p className="text-xs text-muted-foreground">PO Number</p>
                    <p className="font-mono text-sm">{request.poNumber}</p>
                  </div>
                )}
                <div>
                  <p className="text-xs text-muted-foreground">Year</p>
                  <p className="font-medium">{request.year}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Make/Model</p>
                  <p className="font-medium">{request.make} {request.model}</p>
                </div>
              </div>
            </Card>
          </div>

          {/* Request Details */}
          <div>
            <h3 className="text-sm font-semibold mb-3 text-muted-foreground uppercase tracking-wide">
              Request Details
            </h3>
            <Card className="p-4 bg-muted/50">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-muted-foreground">Requested By</p>
                  <p className="font-medium">{request.requestedBy}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Date Requested</p>
                  <p className="font-medium">{new Date(request.dateRequested).toLocaleDateString()}</p>
                </div>
                {request.mainServices && request.mainServices.length > 0 && (
                  <div className="col-span-2">
                    <p className="text-xs text-muted-foreground mb-2">Main Services</p>
                    <div className="flex flex-wrap gap-2">
                      {request.mainServices.map((service, idx) => (
                        <Badge key={idx} variant="secondary">
                          {service}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
                {request.additionalServices && request.additionalServices.length > 0 && (
                  <div className="col-span-2">
                    <p className="text-xs text-muted-foreground mb-2">Additional Services</p>
                    <div className="flex flex-wrap gap-2">
                      {request.additionalServices.map((service, idx) => (
                        <Badge key={idx} variant="outline">
                          {service}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </Card>
          </div>

          {/* Admin Actions - Editing Section */}
          {!isEditing && (
            <Card className="p-4 border-primary/30 bg-primary/5">
              <h3 className="text-sm font-semibold mb-4 text-muted-foreground uppercase tracking-wide">
                Admin Actions
              </h3>
              <div className="space-y-3">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Current Status</p>
                  <p className="font-medium">{request.status}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Price</p>
                  <p className="font-medium">${request.price.toFixed(2)}</p>
                </div>
                {request.manager && (
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Manager</p>
                    <p className="font-medium">{request.manager}</p>
                  </div>
                )}
                {request.notes && (
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Notes</p>
                    <p className="text-sm whitespace-pre-wrap">{request.notes}</p>
                  </div>
                )}
              </div>
              <Button
                onClick={handleStartEdit}
                className="mt-4 w-full"
              >
                Edit Request
              </Button>
            </Card>
          )}

          {/* Editing Form */}
          {isEditing && (
            <Card className="p-4 border-primary bg-primary/5">
              <h3 className="text-sm font-semibold mb-4 text-muted-foreground uppercase tracking-wide">
                Edit Request
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-medium text-muted-foreground">Status</label>
                  <Select
                    value={editData.status as string}
                    onValueChange={(value) =>
                      setEditData((prev) => ({
                        ...prev,
                        status: value as ServiceRequest["status"],
                      }))
                    }
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {STATUSES.map((status) => (
                        <SelectItem key={status} value={status}>
                          {status}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-xs font-medium text-muted-foreground">Price</label>
                  <Input
                    type="number"
                    value={editData.price || 0}
                    onChange={(e) =>
                      setEditData((prev) => ({
                        ...prev,
                        price: parseFloat(e.target.value) || 0,
                      }))
                    }
                    className="mt-1"
                    min="0"
                    step="0.01"
                  />
                </div>

                <div>
                  <label className="text-xs font-medium text-muted-foreground">Manager</label>
                  <Input
                    value={editData.manager || ""}
                    onChange={(e) =>
                      setEditData((prev) => ({
                        ...prev,
                        manager: e.target.value,
                      }))
                    }
                    className="mt-1"
                    placeholder="Assign manager"
                  />
                </div>

                <div>
                  <label className="text-xs font-medium text-muted-foreground">Due Date</label>
                  <Input
                    type="date"
                    value={editData.dueDate || ""}
                    onChange={(e) =>
                      setEditData((prev) => ({
                        ...prev,
                        dueDate: e.target.value,
                      }))
                    }
                    className="mt-1"
                  />
                </div>

                <div>
                  <label className="text-xs font-medium text-muted-foreground">Notes</label>
                  <Textarea
                    value={editData.notes || ""}
                    onChange={(e) =>
                      setEditData((prev) => ({
                        ...prev,
                        notes: e.target.value,
                      }))
                    }
                    className="mt-1"
                    placeholder="Add notes..."
                  />
                </div>

                <div className="flex gap-2 pt-2">
                  <Button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="flex-1"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    {isSaving ? "Saving..." : "Save Changes"}
                  </Button>
                  <Button
                    onClick={() => setIsEditing(false)}
                    variant="outline"
                    className="flex-1"
                    disabled={isSaving}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </Card>
          )}

          {/* Dates Section */}
          {(request.dueDate || request.startDate || request.completionDate) && (
            <div>
              <h3 className="text-sm font-semibold mb-3 text-muted-foreground uppercase tracking-wide">
                Timeline
              </h3>
              <Card className="p-4 bg-muted/50">
                <div className="grid grid-cols-2 gap-4">
                  {request.dueDate && (
                    <div>
                      <p className="text-xs text-muted-foreground">Due Date</p>
                      <p className="font-medium">
                        {request.dueDate}
                        {request.dueTime && ` at ${request.dueTime}`}
                      </p>
                    </div>
                  )}
                  {request.startDate && (
                    <div>
                      <p className="text-xs text-muted-foreground">Start Date</p>
                      <p className="font-medium">
                        {request.startDate}
                        {request.startTime && ` at ${request.startTime}`}
                      </p>
                    </div>
                  )}
                  {request.completionDate && (
                    <div>
                      <p className="text-xs text-muted-foreground">Completion Date</p>
                      <p className="font-medium">
                        {request.completionDate}
                        {request.completionTime && ` at ${request.completionTime}`}
                      </p>
                    </div>
                  )}
                </div>
              </Card>
            </div>
          )}

          {/* Delete Button */}
          {!isEditing && (
            <Button
              onClick={handleDelete}
              disabled={isDeleting}
              variant="destructive"
              className="w-full"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              {isDeleting ? "Deleting..." : "Delete Request"}
            </Button>
          )}
        </motion.div>

        {/* Close Button */}
        <div className="flex gap-2 justify-end pt-4 border-t">
          <Button variant="outline" onClick={onClose}>
            {isEditing ? "Close" : "Done"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
