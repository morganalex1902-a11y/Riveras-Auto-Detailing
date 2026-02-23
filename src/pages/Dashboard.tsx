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
    <main className="min-h-screen bg-gray-50 pt-24 pb-12">
      <div className="container">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600 mt-2">Manage service requests and track performance</p>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8"
        >
          {/* Total Requests */}
          <Card className="p-6 border-0 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Total Requests</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stats.total}</p>
              </div>
              <AlertCircle className="w-12 h-12 text-blue-100" />
            </div>
          </Card>

          {/* Pending */}
          <Card className="p-6 border-0 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Pending</p>
                <p className="text-3xl font-bold text-yellow-600 mt-2">{stats.pending}</p>
              </div>
              <Clock className="w-12 h-12 text-yellow-100" />
            </div>
          </Card>

          {/* In Progress */}
          <Card className="p-6 border-0 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">In Progress</p>
                <p className="text-3xl font-bold text-blue-600 mt-2">{stats.inProgress}</p>
              </div>
              <AlertCircle className="w-12 h-12 text-blue-100" />
            </div>
          </Card>

          {/* Completed */}
          <Card className="p-6 border-0 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Completed</p>
                <p className="text-3xl font-bold text-green-600 mt-2">{stats.completed}</p>
              </div>
              <CheckCircle2 className="w-12 h-12 text-green-100" />
            </div>
          </Card>

          {/* Revenue */}
          <Card className="p-6 border-0 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Revenue</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  ${stats.revenue.toLocaleString()}
                </p>
              </div>
              <DollarSign className="w-12 h-12 text-green-100" />
            </div>
          </Card>
        </motion.div>

        {/* Filters and Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-col sm:flex-row gap-4 mb-6"
        >
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-48 border-gray-300">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
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
              variant="outline"
              className="border-gray-300 hover:bg-gray-100"
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
          <Card className="border-0 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-gray-50 border-b border-gray-200">
                  <TableRow className="hover:bg-gray-50">
                    <TableHead className="font-semibold text-gray-900">ID</TableHead>
                    <TableHead className="font-semibold text-gray-900">Requested By</TableHead>
                    <TableHead className="font-semibold text-gray-900">Service Type</TableHead>
                    <TableHead className="font-semibold text-gray-900">Vehicle</TableHead>
                    <TableHead className="font-semibold text-gray-900">Due Date/Time</TableHead>
                    <TableHead className="font-semibold text-gray-900">Status</TableHead>
                    <TableHead className="font-semibold text-gray-900">Price</TableHead>
                    <TableHead className="font-semibold text-gray-900">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRequests.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                        No requests found
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredRequests.map((request) => (
                      <TableRow key={request.id} className="hover:bg-gray-50 border-b border-gray-100">
                        <TableCell className="font-semibold text-gray-900">#{request.id}</TableCell>
                        <TableCell className="text-sm text-gray-600">{request.requestedBy}</TableCell>
                        <TableCell className="text-sm text-gray-600">{request.service}</TableCell>
                        <TableCell className="text-sm text-gray-600">
                          {request.year} {request.make} {request.model}
                        </TableCell>
                        <TableCell className="text-sm text-gray-600">{request.due}</TableCell>
                        <TableCell>
                          {editingId === request.id ? (
                            <div className="flex gap-1">
                              <Select
                                defaultValue={request.status}
                                onValueChange={(value) => setEditingStatus(value)}
                              >
                                <SelectTrigger className="w-32 h-8 text-xs">
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
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() =>
                                  handleSaveStatus(request.id, editingStatus || request.status)
                                }
                                className="h-8 px-2"
                              >
                                ✓
                              </Button>
                            </div>
                          ) : (
                            <span
                              className={`text-xs font-semibold px-3 py-1 rounded-full ${
                                request.status === "Completed"
                                  ? "bg-green-100 text-green-800"
                                  : request.status === "In Progress"
                                    ? "bg-blue-100 text-blue-800"
                                    : "bg-yellow-100 text-yellow-800"
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
                                className="w-24 h-8 text-xs border-gray-300"
                              />
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleSavePrice(request.id, editingPrice)}
                                className="h-8 px-2"
                              >
                                ✓
                              </Button>
                            </div>
                          ) : (
                            <span className="font-semibold text-gray-900">
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
                                className="h-8 px-2"
                              >
                                <Edit2 className="w-4 h-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Request Details</DialogTitle>
                                <DialogDescription>
                                  View and edit details for request #{request.id}
                                </DialogDescription>
                              </DialogHeader>
                              <div className="space-y-4">
                                <div>
                                  <p className="text-sm font-semibold text-gray-900">Notes</p>
                                  <p className="text-sm text-gray-600 mt-1 bg-gray-50 p-3 rounded">
                                    {request.notes || "No notes provided"}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-sm font-semibold text-gray-900">VIN</p>
                                  <p className="text-sm text-gray-600 mt-1">{request.vin}</p>
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
          </Card>
        </motion.div>
      </div>
    </main>
  );
}
