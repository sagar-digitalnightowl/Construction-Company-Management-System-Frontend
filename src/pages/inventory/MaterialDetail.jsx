// src/pages/inventory/MaterialDetail.jsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Package,
  TrendingUp,
  AlertTriangle,
  Warehouse,
  Plus,
  Minus,
  RefreshCw,
  Archive,
  Box,
  ClipboardList,
  Scan,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { formatINR, formatDate } from "@/lib/helpers";
import { inventoryApi } from "@/api";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

export default function MaterialDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [material, setMaterial] = useState(null);
  const [stock, setStock] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [counts, setCounts] = useState([]);
  const [lowStockAlerts, setLowStockAlerts] = useState([]);
  const [warehouses, setWarehouses] = useState([]);
  const [loading, setLoading] = useState(true);

  console.log("counts : ", counts);

  // Dialog states
  const [addStockOpen, setAddStockOpen] = useState(false);
  const [issueStockOpen, setIssueStockOpen] = useState(false);
  const [returnStockOpen, setReturnStockOpen] = useState(false);
  const [transferStockOpen, setTransferStockOpen] = useState(false);
  const [countDialogOpen, setCountDialogOpen] = useState(false);

  // Form states
  const [addStockForm, setAddStockForm] = useState({
    quantity: "",
    unitPrice: "",
    warehouseName: "",
    poNumber: "",
    remarks: "",
  });
  const [issueForm, setIssueForm] = useState({
    quantity: "",
    warehouseName: "",
    projectName: "",
    purpose: "",
    location: "",
    remarks: "",
  });
  const [returnForm, setReturnForm] = useState({
    quantity: "",
    warehouseName: "",
    reason: "",
    condition: "",
    remarks: "",
  });
  const [transferForm, setTransferForm] = useState({
    quantity: "",
    fromWarehouse: "",
    toWarehouse: "",
    reason: "",
  });
  const [countForm, setCountForm] = useState({ warehouse: "" });

  const fetchAllData = async () => {
    setLoading(true);
    try {
      const [
        materialRes,
        stockRes,
        transRes,
        countsRes,
        alertsRes,
        warehousesRes,
      ] = await Promise.all([
        inventoryApi.getMaterialById(id),
        inventoryApi.getStock({ materialId: id }),
        inventoryApi.getTransactions({ materialId: id }),
        inventoryApi.getCounts(),
        inventoryApi.getLowStockAlerts(),
        inventoryApi.getWarehouses(),
      ]);
      setMaterial(materialRes.data?.data);
      setStock(stockRes.data?.data || []);
      setTransactions(transRes.data?.data || []);
      setCounts(countsRes.data?.data || []);
      setLowStockAlerts(alertsRes.data?.data || []);
      setWarehouses(warehousesRes.data?.data || []);
    } catch (err) {
      toast.error("Failed to load material details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, [id]);

  const handleAddStock = async () => {
    if (!addStockForm.quantity) return toast.error("Quantity required");
    try {
      await inventoryApi.addStock({ materialId: id, ...addStockForm });
      toast.success("Stock added");
      setAddStockOpen(false);
      fetchAllData();
      setAddStockForm({
        quantity: "",
        unitPrice: "",
        warehouseName: "",
        poNumber: "",
        remarks: "",
      });
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to add stock");
    }
  };

  const handleIssueStock = async () => {
    if (!issueForm.quantity) return toast.error("Quantity required");
    try {
      await inventoryApi.issueStock({ materialId: id, ...issueForm });
      toast.success("Stock issued");
      setIssueStockOpen(false);
      fetchAllData();
      setIssueForm({
        quantity: "",
        warehouseName: "",
        projectName: "",
        purpose: "",
        location: "",
        remarks: "",
      });
    } catch (err) {
      toast.error(err.response?.data?.message || "Insufficient stock");
    }
  };

  const handleReturnStock = async () => {
    if (!returnForm.quantity) return toast.error("Quantity required");
    try {
      await inventoryApi.returnStock({ materialId: id, ...returnForm });
      toast.success("Stock returned");
      setReturnStockOpen(false);
      fetchAllData();
      setReturnForm({
        quantity: "",
        warehouseName: "",
        reason: "",
        condition: "",
        remarks: "",
      });
    } catch (err) {
      toast.error(err.response?.data?.message || "Return failed");
    }
  };

  const handleTransferStock = async () => {
    if (
      !transferForm.quantity ||
      !transferForm.fromWarehouse ||
      !transferForm.toWarehouse
    )
      return toast.error("All fields required");
    try {
      await inventoryApi.transferStock({ materialId: id, ...transferForm });
      toast.success("Stock transferred");
      setTransferStockOpen(false);
      fetchAllData();
      setTransferForm({
        quantity: "",
        fromWarehouse: "",
        toWarehouse: "",
        reason: "",
      });
    } catch (err) {
      toast.error(err.response?.data?.message || "Transfer failed");
    }
  };

  const handleStartCount = async () => {
    if (!countForm.warehouse) return toast.error("Select warehouse");
    try {
      await inventoryApi.startCount(countForm);
      toast.success("Inventory count started");
      setCountDialogOpen(false);
      fetchAllData();
      setCountForm({ warehouse: "" });
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to start count");
    }
  };

  const resolveAlert = async (alertId) => {
    try {
      await inventoryApi.resolveAlert(alertId);
      toast.success("Alert resolved");
      fetchAllData();
    } catch (err) {
      toast.error("Failed to resolve alert");
    }
  };

  if (loading) {
    return (
      <div className="space-y-5">
        <Skeleton className="h-8 w-48" />
        <div className="grid grid-cols-3 gap-3">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-24" />
          ))}
        </div>
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (!material) return null;

  const totalStock = stock.reduce((sum, s) => sum + s.quantity, 0);
  const totalValue = stock.reduce(
    (sum, s) => sum + s.quantity * s.unitPrice,
    0,
  );
  const isLowStock = totalStock <= (material.minStockLevel || 0);
  const materialAlert = lowStockAlerts.find(
    (a) => a.materialId?._id === id || a.materialId === id,
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <Button
          variant="ghost"
          size="sm"
          className="-ml-2 mb-3"
          onClick={() => navigate("/inventory/materials")}
        >
          <ArrowLeft className="h-4 w-4 mr-1" /> Back to Materials
        </Button>
        <div className="flex items-start justify-between flex-wrap gap-2">
          <div>
            <h1 className="text-2xl font-bold">{material.name}</h1>
            <p className="text-sm text-muted-foreground">
              Code: {material.code}
            </p>
          </div>
          <div className="flex gap-2">
            {isLowStock && (
              <Badge variant="destructive" className="gap-1">
                <AlertTriangle className="h-3 w-3" /> Low Stock
              </Badge>
            )}
            <Badge variant={isLowStock ? "destructive" : "success"}>
              {isLowStock ? "Reorder Needed" : "Adequate"}
            </Badge>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <Package className="h-5 w-5 text-primary" />
            <div>
              <p className="text-xs text-muted-foreground">Total Stock</p>
              <p className="text-xl font-semibold">
                {totalStock} {material.unit}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <TrendingUp className="h-5 w-5 text-emerald-500" />
            <div>
              <p className="text-xs text-muted-foreground">Total Value</p>
              <p className="text-xl font-semibold">{formatINR(totalValue)}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <Warehouse className="h-5 w-5 text-blue-500" />
            <div>
              <p className="text-xs text-muted-foreground">Locations</p>
              <p className="text-xl font-semibold">{stock.length} warehouses</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <ClipboardList className="h-5 w-5 text-orange-500" />
            <div>
              <p className="text-xs text-muted-foreground">Stock Alerts</p>
              <p className="text-xl font-semibold">{lowStockAlerts.length}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-2">
        <Dialog open={addStockOpen} onOpenChange={setAddStockOpen}>
          <DialogTrigger asChild>
            <Button size="sm">
              <Plus className="h-3 w-3 mr-1" /> Add Stock
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Stock</DialogTitle>
            </DialogHeader>
            <div className="space-y-3">
              <div>
                <Label>Quantity *</Label>
                <Input
                  type="number"
                  value={addStockForm.quantity}
                  onChange={(e) =>
                    setAddStockForm({
                      ...addStockForm,
                      quantity: e.target.value,
                    })
                  }
                />
              </div>
              <div>
                <Label>Unit Price</Label>
                <Input
                  type="number"
                  value={addStockForm.unitPrice}
                  onChange={(e) =>
                    setAddStockForm({
                      ...addStockForm,
                      unitPrice: e.target.value,
                    })
                  }
                />
              </div>
              <div>
                <Label>Warehouse</Label>
                <Select
                  value={addStockForm.warehouseName}
                  onValueChange={(v) =>
                    setAddStockForm({ ...addStockForm, warehouseName: v })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    {warehouses.map((w) => (
                      <SelectItem key={w._id} value={w.name}>
                        {w.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>PO Number</Label>
                <Input
                  value={addStockForm.poNumber}
                  onChange={(e) =>
                    setAddStockForm({
                      ...addStockForm,
                      poNumber: e.target.value,
                    })
                  }
                />
              </div>
              <div>
                <Label>Remarks</Label>
                <Textarea
                  rows={2}
                  value={addStockForm.remarks}
                  onChange={(e) =>
                    setAddStockForm({
                      ...addStockForm,
                      remarks: e.target.value,
                    })
                  }
                />
              </div>
              <Button onClick={handleAddStock}>Add Stock</Button>
            </div>
          </DialogContent>
        </Dialog>

        <Dialog open={issueStockOpen} onOpenChange={setIssueStockOpen}>
          <DialogTrigger asChild>
            <Button size="sm" variant="outline">
              <Minus className="h-3 w-3 mr-1" /> Issue Stock
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Issue Material to Site</DialogTitle>
            </DialogHeader>
            <div className="space-y-3">
              <div>
                <Label>Quantity *</Label>
                <Input
                  type="number"
                  value={issueForm.quantity}
                  onChange={(e) =>
                    setIssueForm({ ...issueForm, quantity: e.target.value })
                  }
                />
              </div>
              <div>
                <Label>Warehouse</Label>
                <Select
                  value={issueForm.warehouseName}
                  onValueChange={(v) =>
                    setIssueForm({ ...issueForm, warehouseName: v })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    {warehouses.map((w) => (
                      <SelectItem key={w._id} value={w.name}>
                        {w.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Project Name</Label>
                <Input
                  value={issueForm.projectName}
                  onChange={(e) =>
                    setIssueForm({ ...issueForm, projectName: e.target.value })
                  }
                />
              </div>
              <div>
                <Label>Purpose</Label>
                <Input
                  value={issueForm.purpose}
                  onChange={(e) =>
                    setIssueForm({ ...issueForm, purpose: e.target.value })
                  }
                />
              </div>
              <div>
                <Label>Location</Label>
                <Input
                  value={issueForm.location}
                  onChange={(e) =>
                    setIssueForm({ ...issueForm, location: e.target.value })
                  }
                />
              </div>
              <div>
                <Label>Remarks</Label>
                <Textarea
                  rows={2}
                  value={issueForm.remarks}
                  onChange={(e) =>
                    setIssueForm({ ...issueForm, remarks: e.target.value })
                  }
                />
              </div>
              <Button onClick={handleIssueStock}>Issue Stock</Button>
            </div>
          </DialogContent>
        </Dialog>

        <Dialog open={returnStockOpen} onOpenChange={setReturnStockOpen}>
          <DialogTrigger asChild>
            <Button size="sm" variant="outline">
              <RefreshCw className="h-3 w-3 mr-1" /> Return Stock
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Return Unused Material</DialogTitle>
            </DialogHeader>
            <div className="space-y-3">
              <div>
                <Label>Quantity *</Label>
                <Input
                  type="number"
                  value={returnForm.quantity}
                  onChange={(e) =>
                    setReturnForm({ ...returnForm, quantity: e.target.value })
                  }
                />
              </div>
              <div>
                <Label>Warehouse</Label>
                <Select
                  value={returnForm.warehouseName}
                  onValueChange={(v) =>
                    setReturnForm({ ...returnForm, warehouseName: v })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    {warehouses.map((w) => (
                      <SelectItem key={w._id} value={w.name}>
                        {w.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Reason</Label>
                <Input
                  value={returnForm.reason}
                  onChange={(e) =>
                    setReturnForm({ ...returnForm, reason: e.target.value })
                  }
                />
              </div>
              <div>
                <Label>Condition</Label>
                <Input
                  value={returnForm.condition}
                  onChange={(e) =>
                    setReturnForm({ ...returnForm, condition: e.target.value })
                  }
                />
              </div>
              <div>
                <Label>Remarks</Label>
                <Textarea
                  rows={2}
                  value={returnForm.remarks}
                  onChange={(e) =>
                    setReturnForm({ ...returnForm, remarks: e.target.value })
                  }
                />
              </div>
              <Button onClick={handleReturnStock}>Return Stock</Button>
            </div>
          </DialogContent>
        </Dialog>

        <Dialog open={transferStockOpen} onOpenChange={setTransferStockOpen}>
          <DialogTrigger asChild>
            <Button size="sm" variant="outline">
              <Archive className="h-3 w-3 mr-1" /> Transfer Stock
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Transfer Stock Between Warehouses</DialogTitle>
            </DialogHeader>
            <div className="space-y-3">
              <div>
                <Label>Quantity *</Label>
                <Input
                  type="number"
                  value={transferForm.quantity}
                  onChange={(e) =>
                    setTransferForm({
                      ...transferForm,
                      quantity: e.target.value,
                    })
                  }
                />
              </div>
              <div>
                <Label>From Warehouse</Label>
                <Select
                  value={transferForm.fromWarehouse}
                  onValueChange={(v) =>
                    setTransferForm({ ...transferForm, fromWarehouse: v })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    {warehouses.map((w) => (
                      <SelectItem key={w._id} value={w.name}>
                        {w.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>To Warehouse</Label>
                <Select
                  value={transferForm.toWarehouse}
                  onValueChange={(v) =>
                    setTransferForm({ ...transferForm, toWarehouse: v })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    {warehouses.map((w) => (
                      <SelectItem key={w._id} value={w.name}>
                        {w.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Reason</Label>
                <Input
                  value={transferForm.reason}
                  onChange={(e) =>
                    setTransferForm({ ...transferForm, reason: e.target.value })
                  }
                />
              </div>
              <Button onClick={handleTransferStock}>Transfer</Button>
            </div>
          </DialogContent>
        </Dialog>

        <Dialog open={countDialogOpen} onOpenChange={setCountDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm" variant="outline">
              <Box className="h-3 w-3 mr-1" /> Start Inventory Count
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Start Physical Inventory Count</DialogTitle>
            </DialogHeader>
            <div className="space-y-3">
              <div>
                <Label>Warehouse</Label>
                <Select
                  value={countForm.warehouse}
                  onValueChange={(v) =>
                    setCountForm({ ...countForm, warehouse: v })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    {warehouses.map((w) => (
                      <SelectItem key={w._id} value={w.name}>
                        {w.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={handleStartCount}>Start Count</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="stock">
        <TabsList className="flex-wrap">
          <TabsTrigger value="stock">Stock by Warehouse</TabsTrigger>
          <TabsTrigger value="transactions">Transaction History</TabsTrigger>
          <TabsTrigger value="counts">Inventory Counts</TabsTrigger>
          <TabsTrigger value="alerts">Low Stock Alerts</TabsTrigger>
          <TabsTrigger value="details">Material Details</TabsTrigger>
        </TabsList>

        {/* Stock Tab */}
        <TabsContent value="stock" className="mt-4">
          {stock.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center text-muted-foreground">
                No stock records found.
              </CardContent>
            </Card>
          ) : (
            <div className="rounded-lg border overflow-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Warehouse</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Unit Price</TableHead>
                    <TableHead>Total Value</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {stock.map((s) => (
                    <TableRow key={s._id}>
                      <TableCell>
                        {s.warehouse}
                      </TableCell>
                      <TableCell>
                        {s.quantity} {s.materialId.unit}   
                      </TableCell>
                      <TableCell>{formatINR(s.materialId.unitPrice)}</TableCell>
                      <TableCell>
                        {formatINR(s.quantity * s.materialId.unitPrice)}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            s.quantity <= (material.minStockLevel || 0)
                              ? "destructive"
                              : "secondary"
                          }
                        >
                          {s.quantity <= (material.minStockLevel || 0)
                            ? "Low"
                            : "In Stock"}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </TabsContent>

        {/* Transactions Tab */}
        <TabsContent value="transactions" className="mt-4">
          {transactions.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center text-muted-foreground">
                No transactions for this material.
              </CardContent>
            </Card>
          ) : (
            <div className="rounded-lg border overflow-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Unit Price</TableHead>
                    <TableHead>Warehouse</TableHead>
                    <TableHead>Reference</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transactions.transactions?.map((tx) => (
                    <TableRow key={tx._id}>
                      <TableCell>{formatDate(tx.createdAt)}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{tx.transactionType}</Badge>
                      </TableCell>
                      <TableCell>{tx.quantity}</TableCell>
                      <TableCell>{formatINR(tx.unitPrice)}</TableCell>
                      <TableCell>{tx.warehouse}</TableCell>
                      <TableCell>
                        {tx.reference || "-"}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </TabsContent>

        {/* Inventory Counts Tab */}
        <TabsContent value="counts" className="mt-4">
          {counts.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center text-muted-foreground">
                No inventory counts started yet.
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-3">
              {counts
                .filter((c) => c.items?.some((i) => i.materialId === id))
                .map((count) => (
                  <Card key={count._id}>
                    <CardContent className="p-4">
                      <div className="flex justify-between">
                        <div>
                          <p className="font-medium">
                            Count #{count.countNumber}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Warehouse: {count.warehouse}
                          </p>
                          <p className="text-xs">
                            Status:{" "}
                            <Badge variant="outline">{count.status}</Badge>
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs">
                            Started: {formatDate(count.createdAt)}
                          </p>
                          {count.completedAt && (
                            <p className="text-xs">
                              Completed: {formatDate(count.completedAt)}
                            </p>
                          )}
                        </div>
                      </div>
                      {count.items
                        ?.filter((i) => i.materialId === id)
                        .map((item) => (
                          <div
                            key={item._id}
                            className="mt-2 text-sm border-t pt-2"
                          >
                            <p>
                              System: {item.systemQuantity} | Physical:{" "}
                              {item.physicalQuantity} | Variance:{" "}
                              {item.variance}
                            </p>
                            {item.reason && (
                              <p className="text-xs text-muted-foreground">
                                Reason: {item.reason}
                              </p>
                            )}
                          </div>
                        ))}
                    </CardContent>
                  </Card>
                ))}
            </div>
          )}
        </TabsContent>

        {/* Low Stock Alerts Tab */}
        <TabsContent value="alerts" className="mt-4">
          {lowStockAlerts.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center text-muted-foreground">
                No low stock alerts for this material.
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-2">
              {lowStockAlerts
                .filter((a) => a.materialId?._id === id || a.materialId === id)
                .map((alert) => (
                  <Card key={alert._id}>
                    <CardContent className="p-4 flex justify-between items-center">
                      <div>
                        <p className="font-medium">
                          Current Stock: {alert.currentStock} {material.unit}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Threshold: {alert.threshold}
                        </p>
                        <p className="text-xs">Status: {alert.status}</p>
                      </div>
                      {alert.status === "pending" && (
                        <Button
                          size="sm"
                          onClick={() => resolveAlert(alert._id)}
                        >
                          Resolve
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                ))}
            </div>
          )}
        </TabsContent>

        {/* Material Details Tab */}
        <TabsContent value="details" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Material Specifications</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Type:</span>{" "}
                {material.type}
              </div>
              <div>
                <span className="text-muted-foreground">Unit:</span>{" "}
                {material.unit}
              </div>
              <div>
                <span className="text-muted-foreground">Unit Price:</span>{" "}
                {formatINR(material.unitPrice)}
              </div>
              <div>
                <span className="text-muted-foreground">Min Stock Level:</span>{" "}
                {material.minStockLevel}
              </div>
              <div>
                <span className="text-muted-foreground">Max Stock Level:</span>{" "}
                {material.maxStockLevel}
              </div>
              <div>
                <span className="text-muted-foreground">Description:</span>{" "}
                {material.description || "—"}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
