import { useState, useMemo } from "react";
import { useAuth, ServiceRequest } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Edit2, Download, DollarSign, Clock, CheckCircle2, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const STATUSES = ["Pending", "In Progress", "Completed"];

export default function Dashboard() {
  const { requests, updateRequestStatus, updateRequestPrice, user } = useAuth();
  const [statusFilter, setStatusFilter] = useState("All");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingPrice, setEditingPrice] = useState<number>(0);
  const [editingStatus, setEditingStatus] = useState<string>("");

  // Filter requests
  const filteredRequests = useMemo(() => {
    return statusFilter === "All"
      ? requests
      : requests.filter((r) => r.status === statusFilter);
  }, [requests, statusFilter]);

  // Calculate stats
  const stats = useMemo(() => {
    const total = requests.length;
    const pending = requests.filter((r) => r.status === "Pending").length;
    const inProgress = requests.filter((r) => r.status === "In Progress").length;
    const completed = requests.filter((r) => r.status === "Completed").length;
    const revenue = requests.filter((r) => r.status === "Completed").reduce((sum, r) => sum + r.price, 0);

    return { total, pending, inProgress, completed, revenue };
  }, [requests]);

  const handleSavePrice = (id: number, newPrice: number) => {
    updateRequestPrice(id, newPrice);
    setEditingId(null);
  };

  const handleSaveStatus = (id: number, newStatus: string) => {
    updateRequestStatus(id, newStatus as ServiceRequest["status"]);
    setEditingId(null);
  };

  const handleExport = () => {
    // Simple export to CSV format
    const headers = [
      "ID",
      "Requested By",
      "Service Type",
      "Vehicle",
      "VIN",
      "Due Date/Time",
      "Status",
      "Price",
      "Notes",
    ];
    const rows = filteredRequests.map((r) => [
      r.id,
      r.requestedBy,
      r.service,
      `${r.year} ${r.make} ${r.model}`,
      r.vin,
      r.due,
      r.status,
      `$${r.price.toFixed(2)}`,
      r.notes,
    ]);

    const csv = [
      headers.join(","),
      ...rows.map((row) => row.map((cell) => `"${cell}"`).join(",")),
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `requests-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
  };

  return (
    <main className="min-h-screen pt-20 pb-12">
      <div className="container">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <div className="w-12 h-[2px] bg-primary mb-6" />
          <h1 className="text-5xl md:text-6xl font-display uppercase tracking-wider mb-2">
            Dashboard
          </h1>
          <p className="text-muted-foreground uppercase tracking-widest text-sm">
            Service Requests Management
          </p>
          <div className="w-12 h-[2px] bg-primary mt-6" />
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-12"
        >
          {/* Total Requests */}
          <div className="glass-card p-6 group hover:border-primary/50 transition-all duration-300">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-xs font-display uppercase tracking-wider text-muted-foreground mb-2">
                  Total Requests
                </p>
                <p className="text-4xl font-display text-foreground">{stats.total}</p>
              </div>
              <AlertCircle className="w-10 h-10 text-primary/20" />
            </div>
            <div className="w-8 h-[1px] bg-primary" />
          </div>

          {/* Pending */}
          <div className="glass-card p-6 group hover:border-primary/50 transition-all duration-300">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-xs font-display uppercase tracking-wider text-muted-foreground mb-2">
                  Pending
                </p>
                <p className="text-4xl font-display text-foreground">{stats.pending}</p>
              </div>
              <Clock className="w-10 h-10 text-primary/20" />
            </div>
            <div className="w-8 h-[1px] bg-primary" />
          </div>

          {/* In Progress */}
          <div className="glass-card p-6 group hover:border-primary/50 transition-all duration-300">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-xs font-display uppercase tracking-wider text-muted-foreground mb-2">
                  In Progress
                </p>
                <p className="text-4xl font-display text-foreground">{stats.inProgress}</p>
              </div>
              <AlertCircle className="w-10 h-10 text-primary/20" />
            </div>
            <div className="w-8 h-[1px] bg-primary" />
          </div>

          {/* Completed */}
          <div className="glass-card p-6 group hover:border-primary/50 transition-all duration-300">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-xs font-display uppercase tracking-wider text-muted-foreground mb-2">
                  Completed
                </p>
                <p className="text-4xl font-display text-foreground">{stats.completed}</p>
              </div>
              <CheckCircle2 className="w-10 h-10 text-primary/20" />
            </div>
            <div className="w-8 h-[1px] bg-primary" />
          </div>

          {/* Revenue */}
          <div className="glass-card p-6 group hover:border-primary/50 transition-all duration-300">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-xs font-display uppercase tracking-wider text-muted-foreground mb-2">
                  Revenue
                </p>
                <p className="text-3xl font-display text-primary gold-gradient-text">
                  ${stats.revenue.toLocaleString()}
                </p>
              </div>
              <DollarSign className="w-10 h-10 text-primary/20" />
            </div>
            <div className="w-8 h-[1px] bg-primary" />
          </div>
        </motion.div>

        {/* Filters and Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-col sm:flex-row gap-4 mb-8"
        >
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-48 bg-card/50 border-border/30 text-foreground">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-card border-border/30">
              <SelectItem value="All">All Statuses</SelectItem>
              {STATUSES.map((status) => (
                <SelectItem key={status} value={status}>
                  {status}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="flex gap-2 ml-auto">
            <Button
              onClick={handleExport}
              className="bg-primary hover:bg-primary text-primary-foreground font-display uppercase tracking-widest text-xs"
            >
              <Download className="w-4 h-4 mr-2" />
              Export CSV
            </Button>
          </div>
        </motion.div>

        {/* Requests Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <div className="glass-card overflow-hidden">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="border-b border-border/30">
                  <TableRow className="hover:bg-transparent">
                    <TableHead className="font-display uppercase tracking-wider text-xs text-muted-foreground">
                      ID
                    </TableHead>
                    <TableHead className="font-display uppercase tracking-wider text-xs text-muted-foreground">
                      Requested By
                    </TableHead>
                    <TableHead className="font-display uppercase tracking-wider text-xs text-muted-foreground">
                      Service Type
                    </TableHead>
                    <TableHead className="font-display uppercase tracking-wider text-xs text-muted-foreground">
                      Vehicle
                    </TableHead>
                    <TableHead className="font-display uppercase tracking-wider text-xs text-muted-foreground">
                      Due Date/Time
                    </TableHead>
                    <TableHead className="font-display uppercase tracking-wider text-xs text-muted-foreground">
                      Status
                    </TableHead>
                    <TableHead className="font-display uppercase tracking-wider text-xs text-muted-foreground">
                      Price
                    </TableHead>
                    <TableHead className="font-display uppercase tracking-wider text-xs text-muted-foreground">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRequests.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-12 text-muted-foreground">
                        No requests found
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredRequests.map((request) => (
                      <TableRow
                        key={request.id}
                        className="border-b border-border/20 hover:bg-card/50 transition-colors"
                      >
                        <TableCell className="font-display text-sm text-primary">
                          #{request.id}
                        </TableCell>
                        <TableCell className="text-xs text-muted-foreground">
                          {request.requestedBy}
                        </TableCell>
                        <TableCell className="text-xs text-foreground">{request.service}</TableCell>
                        <TableCell className="text-xs text-foreground">
                          {request.year} {request.make} {request.model}
                        </TableCell>
                        <TableCell className="text-xs text-foreground">{request.due}</TableCell>
                        <TableCell>
                          {editingId === request.id ? (
                            <div className="flex gap-1">
                              <Select
                                defaultValue={request.status}
                                onValueChange={(value) => setEditingStatus(value)}
                              >
                                <SelectTrigger className="w-32 h-7 text-xs bg-card/50 border-border/30">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="bg-card border-border/30">
                                  {STATUSES.map((status) => (
                                    <SelectItem key={status} value={status}>
                                      {status}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() =>
                                  handleSaveStatus(request.id, editingStatus || request.status)
                                }
                                className="h-7 px-2 text-primary hover:bg-card"
                              >
                                ✓
                              </Button>
                            </div>
                          ) : (
                            <span
                              className={`text-xs font-display uppercase tracking-wider px-3 py-1 rounded-sm inline-block ${
                                request.status === "Completed"
                                  ? "bg-primary/20 text-primary"
                                  : request.status === "In Progress"
                                    ? "bg-card/50 text-primary border border-primary/30"
                                    : "bg-card/50 text-muted-foreground border border-border/30"
                              }`}
                            >
                              {request.status}
                            </span>
                          )}
                        </TableCell>
                        <TableCell>
                          {editingId === request.id ? (
                            <div className="flex gap-1">
                              <Input
                                type="number"
                                value={editingPrice}
                                onChange={(e) => setEditingPrice(parseFloat(e.target.value) || 0)}
                                className="w-20 h-7 text-xs bg-card/50 border-border/30"
                              />
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleSavePrice(request.id, editingPrice)}
                                className="h-7 px-2 text-primary hover:bg-card"
                              >
                                ✓
                              </Button>
                            </div>
                          ) : (
                            <span className="font-display text-sm text-primary">
                              ${request.price.toFixed(2)}
                            </span>
                          )}
                        </TableCell>
                        <TableCell>
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => {
                                  setEditingId(request.id);
                                  setEditingPrice(request.price);
                                  setEditingStatus(request.status);
                                }}
                                className="h-7 px-2 text-primary hover:bg-card"
                              >
                                <Edit2 className="w-4 h-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="bg-card border-border/30">
                              <DialogHeader>
                                <DialogTitle className="font-display text-xl uppercase tracking-wider">
                                  Request Details
                                </DialogTitle>
                                <DialogDescription className="text-muted-foreground">
                                  View details for request #{request.id}
                                </DialogDescription>
                              </DialogHeader>
                              <div className="space-y-4">
                                <div>
                                  <p className="text-xs font-display uppercase tracking-wider text-muted-foreground mb-2">
                                    Notes
                                  </p>
                                  <p className="text-sm text-foreground bg-background/50 p-3 rounded-sm border border-border/30">
                                    {request.notes || "No notes provided"}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-xs font-display uppercase tracking-wider text-muted-foreground mb-2">
                                    VIN
                                  </p>
                                  <p className="text-sm text-foreground">{request.vin}</p>
                                </div>
                              </div>
                            </DialogContent>
                          </Dialog>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </motion.div>
      </div>
    </main>
  );
}
