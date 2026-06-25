// import React, { useState } from "react";
// import { Plus, Pencil, Trash2, Receipt, ArrowDownToLine } from "lucide-react";
// import { toast } from "sonner";
// import { PageHeader, StatCard } from "@/components/common/PageHeader";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Card, CardContent } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// import { ConfirmDialog } from "@/components/common/ConfirmDialog";
// import { useFinanceStore, useProjectsStore } from "@/store/dataStore";
// import { useAuthStore } from "@/store/authStore";
// import { canMutate } from "@/data/permissions";
// import { formatINR, formatDate } from "@/lib/helpers";

// const INV_STATUS = {
//     draft: "muted", sent: "default", paid: "success", overdue: "destructive"
// };

// export default function Finance() {
//     const { invoices, expenses, addInvoice, updateInvoice, removeInvoice, addExpense, removeExpense } = useFinanceStore();
//     const projects = useProjectsStore((s) => s.projects);
//     const { current } = useAuthStore();
//     const canEdit = canMutate(current.role, "finance");

//     const [open, setOpen] = useState(false); const [editing, setEditing] = useState(null);
//     const empty = {
//         code: `INV-${new Date().getFullYear()}-${String(invoices.length + 1).padStart(4, "0")}`, projectId: "", clientName: "", amount: 0, gst: 0, total: 0, status: "draft", issuedOn: new Date().toISOString().slice(0, 10), dueOn: ""
//     };
//     const [form, setForm] = useState(empty);
//     const [confirmId, setConfirmId] = useState(null);

//     const [expOpen, setExpOpen] = useState(false);
//     const expEmpty = {
//         projectId: "", category: "Material", note: "", amount: 0, date: new Date().toISOString().slice(0, 10)
//     };
//     const [expForm, setExpForm] = useState(expEmpty);

//     const totals = {
//         billed: invoices.reduce((a, i) => a + i.total, 0),
//         paid: invoices.filter(i => i.status === "paid").reduce((a, i) => a + i.total, 0),
//         overdue: invoices.filter(i => i.status === "overdue").reduce((a, i) => a + i.total, 0),
//         expenses: expenses.reduce((a, e) => a + e.amount, 0),
//     };

//     const startCreate = () => { setEditing(null); setForm(empty); setOpen(true); };
//     const startEdit = (i) => { setEditing(i); setForm({ ...i }); setOpen(true); };
//     const save = () => {
//         const amount = Number(form.amount); const gst = Number(form.gst); const total = amount + gst;
//         const p = { ...form, amount, gst, total };
//         if (editing) { updateInvoice(editing.id, p); toast.success("Invoice updated"); }
//         else {
//             addInvoice(p); toast.success("Invoice raised");
//         }
//         setOpen(false);
//     };
//     const saveExp = () => {
//         addExpense({ ...expForm, amount: Number(expForm.amount) }); toast.success("Expense logged"); setExpOpen(false); setExpForm(expEmpty);
//     };

//     return (
//         <div className="space-y-6">
//             < PageHeader eyebrow="Business" title="Finance & Billing" description="GST invoices, project P&L, expense ledger and outstanding receivables."
//                 actions={canEdit && <Button onClick={startCreate}><Plus className="h-4 w-4" /> New invoice</Button>
//                 } />

//             < div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
//                 < StatCard label="Billed (incl. GST)" value={formatINR(totals.billed)} icon={Receipt} accent="primary" />
//                 < StatCard label="Collected" value={formatINR(totals.paid)} icon={ArrowDownToLine} accent="success" />
//                 < StatCard label="Overdue" value={formatINR(totals.overdue)} icon={Receipt} accent="warning" deltaTone={totals.overdue ? "down" : "up"} delta={totals.overdue ? "Action required" : "Clear"} />
//                 < StatCard label="Project Expenses" value={formatINR(totals.expenses)} icon={Receipt} />
//             </div >

//             <Tabs defaultValue="invoices">
//                 < TabsList >
//                     <TabsTrigger value="invoices">Invoices</TabsTrigger>
//                     < TabsTrigger value="expenses">Expense Ledger</TabsTrigger>
//                 </TabsList >

//                 <TabsContent value="invoices">
//                     < Card > <CardContent className="p-0">
//                         < Table >
//                             <TableHeader><TableRow>
//                                 <TableHead>Invoice #</TableHead><TableHead>Project</TableHead><TableHead>Client</TableHead>
//                                 <TableHead className="text-right">Amount</TableHead><TableHead className="text-right">GST</TableHead><TableHead className="text-right">Total</TableHead>
//                                 < TableHead > Status</TableHead ><TableHead>Due</TableHead><TableHead className="text-right w-[90px]">Actions</TableHead>
//                             </TableRow ></TableHeader >
//                             <TableBody>
//                                 {invoices.map((i) => (
//                                     <TableRow key={i.id} data-testid={`inv-${i.code}`}>
//                                         <TableCell className="font-mono text-xs">{i.code}</TableCell>
//                                         <TableCell className="text-sm">{projects.find(p => p.id === i.projectId)?.code || "—"}</TableCell>
//                                         <TableCell className="text-sm">{i.clientName}</TableCell>
//                                         < TableCell className="text-right tabular-nums">{formatINR(i.amount)}</TableCell>
//                                         < TableCell className="text-right tabular-nums text-muted-foreground">{formatINR(i.gst)}</TableCell>
//                                         < TableCell className="text-right tabular-nums font-medium">{formatINR(i.total)}</TableCell>
//                                         < TableCell > <Badge variant={INV_STATUS[i.status]}>{i.status}</Badge></TableCell >
//                                         <TableCell className="text-sm">{formatDate(i.dueOn)}</TableCell>
//                                         < TableCell className="text-right">{canEdit && <div className="flex justify-end gap-1"><Button variant="ghost" size="icon" onClick={() => startEdit(i)}><Pencil className="h-4 w-4" /></Button><Button variant="ghost" size="icon" className="text-destructive" onClick={() => setConfirmId(i.id)}><Trash2 className="h-4 w-4" /></Button></div>}</TableCell>
//                                     </TableRow >
//                                 ))}
//                             </TableBody >
//                         </Table >
//                     </CardContent ></Card >
//                 </TabsContent >

//                 <TabsContent value="expenses">
//                     < div className="flex justify-end mb-3">{canEdit && <Button variant="outline" onClick={() => setExpOpen(true)}><Plus className="h-4 w-4" /> Log expense</Button>}</div>
//                     < Card > <CardContent className="p-0">
//                         < Table >
//                             <TableHeader><TableRow><TableHead>Date</TableHead><TableHead>Project</TableHead><TableHead>Category</TableHead><TableHead>Note</TableHead><TableHead className="text-right">Amount</TableHead><TableHead className="text-right w-[80px]"></TableHead></TableRow ></TableHeader >
//                             <TableBody>
//                                 {expenses.map(e => (
//                                     <TableRow key={e.id}>
//                                         <TableCell className="text-sm">{formatDate(e.date)}</TableCell>
//                                         <TableCell className="text-sm">{projects.find(p => p.id === e.projectId)?.code || "—"}</TableCell>
//                                         <TableCell><Badge variant="outline">{e.category}</Badge></TableCell >
//                                         <TableCell className="text-sm">{e.note}</TableCell>
//                                         < TableCell className="text-right tabular-nums font-medium">{formatINR(e.amount)}</TableCell>
//                                         < TableCell className="text-right">{canEdit && <Button variant="ghost" size="icon" className="text-destructive" onClick={() => { removeExpense(e.id); toast.success("Expense removed"); }}><Trash2 className="h-4 w-4" /></Button>}</TableCell>
//                                     </TableRow >
//                                 ))}
//                             </TableBody >
//                         </Table >
//                     </CardContent ></Card >
//                 </TabsContent >
//             </Tabs >

//             <Dialog open={open} onOpenChange={setOpen}>
//                 <DialogContent>
//                     <DialogHeader><DialogTitle>{editing ? "Edit invoice" : "Raise GST invoice"}</DialogTitle></DialogHeader>
//                     <div className="grid grid-cols-2 gap-3">
//                         <div className="space-y-1.5"><Label>Invoice #</Label><Input value={form.code} onChange={e => setForm({ ...form, code: e.target.value })} /></div>
//                         <div className="space-y-1.5"><Label>Status</Label>
//                             <Select value={form.status} onValueChange={v => setForm({ ...form, status: v })}>
//                                 <SelectTrigger><SelectValue /></SelectTrigger>
//                                 <SelectContent>{Object.keys(INV_STATUS).map(k => (<SelectItem key={k} value={k}>{k}</SelectItem>))}</SelectContent>
//                             </Select>
//                         </div>
//                         <div className="space-y-1.5"><Label>Project</Label>
//                             < Select value={form.projectId} onValueChange={v => setForm({ ...form, projectId: v })} >
//                                 <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
//                                 <SelectContent>{projects.map(p => (<SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>))}</SelectContent>
//                             </Select >
//                         </div >
//                         <div className="space-y-1.5"><Label>Client name</Label><Input value={form.clientName} onChange={e => setForm({ ...form, clientName: e.target.value })} /></div>
//                         < div className="space-y-1.5"><Label>Amount (₹)</Label><Input type="number" value={form.amount} onChange={e => setForm({ ...form, amount: e.target.value })} /></div>
//                         < div className="space-y-1.5"><Label>GST (₹)</Label><Input type="number" value={form.gst} onChange={e => setForm({ ...form, gst: e.target.value })} /></div>
//                         < div className="space-y-1.5"><Label>Issued</Label><Input type="date" value={form.issuedOn} onChange={e => setForm({ ...form, issuedOn: e.target.value })} /></div>
//                         < div className="space-y-1.5"><Label>Due</Label><Input type="date" value={form.dueOn} onChange={e => setForm({ ...form, dueOn: e.target.value })} /></div>
//                     </div >
//                     <DialogFooter><Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button><Button onClick={save}>{editing ? "Save" : "Raise"}</Button></DialogFooter >
//                 </DialogContent >
//             </Dialog >

//             <Dialog open={expOpen} onOpenChange={setExpOpen}>
//                 <DialogContent>
//                     <DialogHeader><DialogTitle>Log project expense</DialogTitle></DialogHeader>
//                     <div className="grid grid-cols-2 gap-3">
//                         <div className="space-y-1.5"><Label>Project</Label>
//                             <Select value={expForm.projectId} onValueChange={v => setExpForm({ ...expForm, projectId: v })}>
//                                 <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
//                                 <SelectContent>{projects.map(p => (<SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>))}</SelectContent>
//                             </Select>
//                         </div>
//                         <div className="space-y-1.5"><Label>Category</Label>
//                             <Select value={expForm.category} onValueChange={v => setExpForm({ ...expForm, category: v })}>
//                                 <SelectTrigger><SelectValue /></SelectTrigger>
//                                 <SelectContent><SelectItem value="Material">Material</SelectItem><SelectItem value="Labour">Labour</SelectItem><SelectItem value="Consultancy">Consultancy</SelectItem><SelectItem value="Logistics">Logistics</SelectItem><SelectItem value="Other">Other</SelectItem></SelectContent>
//                             </Select >
//                         </div >
//                         <div className="col-span-2 space-y-1.5"><Label>Note</Label><Input value={expForm.note} onChange={e => setExpForm({ ...expForm, note: e.target.value })} /></div>
//                         < div className="space-y-1.5"><Label>Amount (₹)</Label><Input type="number" value={expForm.amount} onChange={e => setExpForm({ ...expForm, amount: e.target.value })} /></div>
//                         < div className="space-y-1.5"><Label>Date</Label><Input type="date" value={expForm.date} onChange={e => setExpForm({ ...expForm, date: e.target.value })} /></div>
//                     </div >
//                     <DialogFooter><Button variant="outline" onClick={() => setExpOpen(false)}>Cancel</Button><Button onClick={saveExp}>Log</Button></DialogFooter >
//                 </DialogContent >
//             </Dialog >
//             <ConfirmDialog open={!!confirmId} onOpenChange={(v) => !v && setConfirmId(null)} title="Delete invoice?" onConfirm={() => { removeInvoice(confirmId); toast.success("Invoice deleted"); setConfirmId(null); }} />
//         </div >
//     );
// }

import React, { useState } from "react";
import {
  Plus,
  Pencil,
  Trash2,
  Receipt,
  ArrowDownToLine,
  Banknote,
  ShoppingCart,
  Users,
  Home,
  TrendingUp,
  DollarSign,
} from "lucide-react";
import { toast } from "sonner";
import { PageHeader, StatCard } from "@/components/common/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import {
  useFinanceStore,
  useProjectsStore,
} from "@/store/dataStore";
import { useAuthStore, useUsersStore } from "@/store/authStore";
import { canMutate } from "@/data/permissions";
import { formatINR, formatDate } from "@/lib/helpers";
import { Separator } from "@/components/ui/separator";

// ----------------------------------------------------------------------
// Dummy data (used directly in the store, kept here for brevity)
// These arrays will be fed into the store’s initial state.
// (Real implementation: store slice updates)
// ----------------------------------------------------------------------

const INV_STATUS = {
  draft: "muted",
  sent: "default",
  paid: "success",
  overdue: "destructive",
};

export default function Finance() {
  const {
    invoices,
    expenses,
    payroll,
    sales,
    procurement,
    bookings,
    addInvoice,
    updateInvoice,
    removeInvoice,
    addExpense,
    removeExpense,
    addPayrollEntry,
    removePayrollEntry,
    addSale,
    removeSale,
    addProcurementOrder,
    removeProcurementOrder,
    addBooking,
    removeBooking,
  } = useFinanceStore();

  const projects = useProjectsStore((s) => s.projects);
  const users = useUsersStore((s) => s.users);
  const { current } = useAuthStore();
  const canEdit = canMutate(current.role, "finance");

  // State for dialogs
  const [invOpen, setInvOpen] = useState(false);
  const [editingInv, setEditingInv] = useState(null);
  const [invForm, setInvForm] = useState(getEmptyInvoice());
  const [confirmId, setConfirmId] = useState(null);

  const [expOpen, setExpOpen] = useState(false);
  const [expForm, setExpForm] = useState(getEmptyExpense());

  const [payOpen, setPayOpen] = useState(false);
  const [payForm, setPayForm] = useState(getEmptyPayroll());

  const [saleOpen, setSaleOpen] = useState(false);
  const [saleForm, setSaleForm] = useState(getEmptySale());

  const [procOpen, setProcOpen] = useState(false);
  const [procForm, setProcForm] = useState(getEmptyProcurement());

  const [bookOpen, setBookOpen] = useState(false);
  const [bookForm, setBookForm] = useState(getEmptyBooking());

  // --- Aggregate figures (dynamic) ---
  const totals = {
    billed: invoices.reduce((a, i) => a + i.total, 0),
    paid: invoices
      .filter((i) => i.status === "paid")
      .reduce((a, i) => a + i.total, 0),
    overdue: invoices
      .filter((i) => i.status === "overdue")
      .reduce((a, i) => a + i.total, 0),
    expenses: expenses.reduce((a, e) => a + e.amount, 0),
    payroll: payroll.reduce((a, p) => a + p.netPay, 0),
    sales: sales.reduce((a, s) => a + s.saleAmount, 0),
    procurement: procurement.reduce((a, o) => a + o.totalCost, 0),
    bookings: bookings.reduce((a, b) => a + b.paidAmount, 0),
    pendingBookings: bookings
      .filter((b) => b.status === "pending")
      .reduce((a, b) => a + b.dueAmount, 0),
  };

  // --- Helper to reset forms ---
  function getEmptyInvoice() {
    return {
      code: `INV-${new Date().getFullYear()}-${String(invoices.length + 1).padStart(4, "0")}`,
      projectId: "",
      clientName: "",
      amount: 0,
      gst: 0,
      total: 0,
      status: "draft",
      issuedOn: new Date().toISOString().slice(0, 10),
      dueOn: "",
    };
  }

  function getEmptyExpense() {
    return {
      projectId: "",
      category: "Material",
      note: "",
      amount: 0,
      date: new Date().toISOString().slice(0, 10),
    };
  }

  function getEmptyPayroll() {
    return {
      employeeId: "",
      month: new Date().toISOString().slice(0, 7),
      basic: 0,
      allowances: 0,
      deductions: 0,
      netPay: 0,
      paidOn: "",
    };
  }

  function getEmptySale() {
    return {
      projectId: "",
      unitNo: "",
      buyerName: "",
      saleAmount: 0,
      date: new Date().toISOString().slice(0, 10),
      paymentMode: "bank",
    };
  }

  function getEmptyProcurement() {
    return {
      projectId: "",
      item: "",
      quantity: 0,
      unitPrice: 0,
      totalCost: 0,
      orderDate: new Date().toISOString().slice(0, 10),
      received: false,
    };
  }

  function getEmptyBooking() {
    return {
      projectId: "",
      unitNo: "",
      customerName: "",
      totalAmount: 0,
      paidAmount: 0,
      dueAmount: 0,
      status: "pending",
      bookingDate: new Date().toISOString().slice(0, 10),
    };
  }

  // --- Invoice handlers ---
  const startCreateInvoice = () => {
    setEditingInv(null);
    setInvForm(getEmptyInvoice());
    setInvOpen(true);
  };

  const startEditInvoice = (i) => {
    setEditingInv(i);
    setInvForm({ ...i });
    setInvOpen(true);
  };

  const saveInvoice = () => {
    const amount = Number(invForm.amount);
    const gst = Number(invForm.gst);
    const total = amount + gst;
    const payload = { ...invForm, amount, gst, total };
    if (editingInv) {
      updateInvoice(editingInv.id, payload);
      toast.success("Invoice updated");
    } else {
      addInvoice(payload);
      toast.success("Invoice raised");
    }
    setInvOpen(false);
  };

  // --- Expense handlers ---
  const saveExpense = () => {
    addExpense({ ...expForm, amount: Number(expForm.amount) });
    toast.success("Expense logged");
    setExpOpen(false);
    setExpForm(getEmptyExpense());
  };

  // --- Payroll handlers ---
  const savePayroll = () => {
    const basic = Number(payForm.basic);
    const allowances = Number(payForm.allowances);
    const deductions = Number(payForm.deductions);
    const netPay = basic + allowances - deductions;
    addPayrollEntry({ ...payForm, basic, allowances, deductions, netPay });
    toast.success("Payroll entry added");
    setPayOpen(false);
    setPayForm(getEmptyPayroll());
  };

  // --- Sales handlers ---
  const saveSale = () => {
    addSale({ ...saleForm, saleAmount: Number(saleForm.saleAmount) });
    toast.success("Sale recorded");
    setSaleOpen(false);
    setSaleForm(getEmptySale());
  };

  // --- Procurement handlers ---
  const saveProcurement = () => {
    const quantity = Number(procForm.quantity);
    const unitPrice = Number(procForm.unitPrice);
    const totalCost = quantity * unitPrice;
    addProcurementOrder({ ...procForm, quantity, unitPrice, totalCost });
    toast.success("Procurement order placed");
    setProcOpen(false);
    setProcForm(getEmptyProcurement());
  };

  // --- Booking handlers ---
  const saveBooking = () => {
    const totalAmount = Number(bookForm.totalAmount);
    const paidAmount = Number(bookForm.paidAmount);
    const dueAmount = totalAmount - paidAmount;
    addBooking({ ...bookForm, totalAmount, paidAmount, dueAmount });
    toast.success("Booking recorded");
    setBookOpen(false);
    setBookForm(getEmptyBooking());
  };

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Business"
        title="Finance & Billing"
        description="GST invoices, payroll, sales, procurement, bookings, and expense ledger."
        actions={
          canEdit && (
            <div className="flex gap-2 flex-wrap">
              <Button onClick={startCreateInvoice}>
                <Plus className="h-4 w-4" /> Invoice
              </Button>
              <Button variant="outline" onClick={() => setPayOpen(true)}>
                <Plus className="h-4 w-4" /> Payroll
              </Button>
              <Button variant="outline" onClick={() => setSaleOpen(true)}>
                <Plus className="h-4 w-4" /> Sale
              </Button>
              <Button variant="outline" onClick={() => setProcOpen(true)}>
                <Plus className="h-4 w-4" /> Procurement
              </Button>
              <Button variant="outline" onClick={() => setBookOpen(true)}>
                <Plus className="h-4 w-4" /> Booking
              </Button>
            </div>
          )
        }
      />

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Billed (Invoices)"
          value={formatINR(totals.billed)}
          icon={Receipt}
          accent="primary"
        />
        <StatCard
          label="Collected"
          value={formatINR(totals.paid)}
          icon={ArrowDownToLine}
          accent="success"
        />
        <StatCard
          label="Sales Revenue"
          value={formatINR(totals.sales)}
          icon={TrendingUp}
          accent="success"
        />
        <StatCard
          label="Payroll"
          value={formatINR(totals.payroll)}
          icon={Users}
          accent="warning"
        />
        <StatCard
          label="Expenses"
          value={formatINR(totals.expenses)}
          icon={DollarSign}
          accent="destructive"
        />
        <StatCard
          label="Procurement"
          value={formatINR(totals.procurement)}
          icon={ShoppingCart}
          accent="info"
        />
        <StatCard
          label="Bookings (Paid)"
          value={formatINR(totals.bookings)}
          icon={Home}
          accent="info"
        />
        <StatCard
          label="Overdue"
          value={formatINR(totals.overdue)}
          icon={Receipt}
          accent="destructive"
        />
      </div>

      <Tabs defaultValue="invoices">
        <TabsList className="flex-wrap">
          <TabsTrigger value="invoices">Invoices</TabsTrigger>
          <TabsTrigger value="expenses">Expenses</TabsTrigger>
          <TabsTrigger value="payroll">Payroll</TabsTrigger>
          <TabsTrigger value="sales">Sales</TabsTrigger>
          <TabsTrigger value="procurement">Procurement</TabsTrigger>
          <TabsTrigger value="bookings">Bookings</TabsTrigger>
          <TabsTrigger value="pl">P&L Summary</TabsTrigger>
        </TabsList>

        {/* Invoices Tab */}
        <TabsContent value="invoices">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Invoice #</TableHead>
                    <TableHead>Project</TableHead>
                    <TableHead>Buyer</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                    <TableHead className="text-right">GST</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Due</TableHead>
                    <TableHead className="text-right w-[90px]">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {invoices.map((i) => (
                    <TableRow key={i.id}>
                      <TableCell className="font-mono text-xs">
                        {i.code}
                      </TableCell>
                      <TableCell className="text-sm">
                        {projects.find((p) => p.id === i.projectId)?.name ||
                          "—"}
                      </TableCell>
                      <TableCell className="text-sm">{i.clientName}</TableCell>
                      <TableCell className="text-right tabular-nums">
                        {formatINR(i.amount)}
                      </TableCell>
                      <TableCell className="text-right tabular-nums text-muted-foreground">
                        {formatINR(i.gst)}
                      </TableCell>
                      <TableCell className="text-right tabular-nums font-medium">
                        {formatINR(i.total)}
                      </TableCell>
                      <TableCell>
                        <Badge variant={INV_STATUS[i.status]}>{i.status}</Badge>
                      </TableCell>
                      <TableCell className="text-sm">
                        {formatDate(i.dueOn)}
                      </TableCell>
                      <TableCell className="text-right">
                        {canEdit && (
                          <div className="flex justify-end gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => startEditInvoice(i)}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-destructive"
                              onClick={() => setConfirmId(i.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Expenses Tab */}
        <TabsContent value="expenses">
          <div className="flex justify-end mb-3">
            {canEdit && (
              <Button variant="outline" onClick={() => setExpOpen(true)}>
                <Plus className="h-4 w-4" /> Log expense
              </Button>
            )}
          </div>
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Project</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Note</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                    <TableHead className="text-right w-[80px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {expenses.map((e) => (
                    <TableRow key={e.id}>
                      <TableCell className="text-sm">
                        {formatDate(e.date)}
                      </TableCell>
                      <TableCell className="text-sm">
                        {projects.find((p) => p.id === e.projectId)?.name ||
                          "—"}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{e.category}</Badge>
                      </TableCell>
                      <TableCell className="text-sm">{e.note}</TableCell>
                      <TableCell className="text-right tabular-nums font-medium">
                        {formatINR(e.amount)}
                      </TableCell>
                      <TableCell className="text-right">
                        {canEdit && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-destructive"
                            onClick={() => {
                              removeExpense(e.id);
                              toast.success("Expense removed");
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Payroll Tab */}
        <TabsContent value="payroll">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Employee</TableHead>
                    <TableHead>Month</TableHead>
                    <TableHead className="text-right">Basic</TableHead>
                    <TableHead className="text-right">Allowances</TableHead>
                    <TableHead className="text-right">Deductions</TableHead>
                    <TableHead className="text-right">Net Pay</TableHead>
                    <TableHead>Paid On</TableHead>
                    <TableHead className="text-right w-[80px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {payroll.map((p) => {
                    const emp = users.find((u) => u.id === p.employeeId);
                    return (
                      <TableRow key={p.id}>
                        <TableCell>{emp?.name || "—"}</TableCell>
                        <TableCell>{p.month}</TableCell>
                        <TableCell className="text-right">
                          {formatINR(p.basic)}
                        </TableCell>
                        <TableCell className="text-right">
                          {formatINR(p.allowances)}
                        </TableCell>
                        <TableCell className="text-right">
                          {formatINR(p.deductions)}
                        </TableCell>
                        <TableCell className="text-right font-medium">
                          {formatINR(p.netPay)}
                        </TableCell>
                        <TableCell>{formatDate(p.paidOn)}</TableCell>
                        <TableCell className="text-right">
                          {canEdit && (
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-destructive"
                              onClick={() => {
                                removePayrollEntry(p.id);
                                toast.success("Payroll entry removed");
                              }}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Sales Tab */}
        <TabsContent value="sales">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Project</TableHead>
                    <TableHead>Unit</TableHead>
                    <TableHead>Buyer</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                    <TableHead>Mode</TableHead>
                    <TableHead className="text-right w-[80px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sales.map((s) => (
                    <TableRow key={s.id}>
                      <TableCell>{formatDate(s.date)}</TableCell>
                      <TableCell>
                        {projects.find((p) => p.id === s.projectId)?.name ||
                          "—"}
                      </TableCell>
                      <TableCell>{s.unitNo}</TableCell>
                      <TableCell>{s.buyerName}</TableCell>
                      <TableCell className="text-right font-medium">
                        {formatINR(s.saleAmount)}
                      </TableCell>
                      <TableCell className="capitalize">
                        {s.paymentMode}
                      </TableCell>
                      <TableCell className="text-right">
                        {canEdit && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-destructive"
                            onClick={() => {
                              removeSale(s.id);
                              toast.success("Sale removed");
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Procurement Tab */}
        <TabsContent value="procurement">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order Date</TableHead>
                    <TableHead>Project</TableHead>
                    <TableHead>Item</TableHead>
                    <TableHead className="text-right">Qty</TableHead>
                    <TableHead className="text-right">Unit Price</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                    <TableHead>Received</TableHead>
                    <TableHead className="text-right w-[80px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {procurement.map((o) => (
                    <TableRow key={o.id}>
                      <TableCell>{formatDate(o.orderDate)}</TableCell>
                      <TableCell>
                        {projects.find((p) => p.id === o.projectId)?.name ||
                          "—"}
                      </TableCell>
                      <TableCell>{o.item}</TableCell>
                      <TableCell className="text-right">{o.quantity}</TableCell>
                      <TableCell className="text-right">
                        {formatINR(o.unitPrice)}
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        {formatINR(o.totalCost)}
                      </TableCell>
                      <TableCell>
                        <Badge variant={o.received ? "success" : "secondary"}>
                          {o.received ? "Yes" : "No"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        {canEdit && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-destructive"
                            onClick={() => {
                              removeProcurementOrder(o.id);
                              toast.success("Procurement order removed");
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Bookings Tab */}
        <TabsContent value="bookings">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Booking Date</TableHead>
                    <TableHead>Project</TableHead>
                    <TableHead>Unit</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead className="text-right">Total Amount</TableHead>
                    <TableHead className="text-right">Paid</TableHead>
                    <TableHead className="text-right">Due</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right w-[80px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {bookings.map((b) => (
                    <TableRow key={b.id}>
                      <TableCell>{formatDate(b.bookingDate)}</TableCell>
                      <TableCell>
                        {projects.find((p) => p.id === b.projectId)?.name ||
                          "—"}
                      </TableCell>
                      <TableCell>{b.unitNo}</TableCell>
                      <TableCell>{b.customerName}</TableCell>
                      <TableCell className="text-right">
                        {formatINR(b.totalAmount)}
                      </TableCell>
                      <TableCell className="text-right">
                        {formatINR(b.paidAmount)}
                      </TableCell>
                      <TableCell className="text-right font-medium text-destructive">
                        {formatINR(b.dueAmount)}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            b.status === "paid"
                              ? "success"
                              : b.status === "pending"
                                ? "warning"
                                : "destructive"
                          }
                        >
                          {b.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        {canEdit && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-destructive"
                            onClick={() => {
                              removeBooking(b.id);
                              toast.success("Booking removed");
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* P&L Summary Tab (simple) */}
        <TabsContent value="pl">
          <Card>
            <CardContent className="p-6 grid grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Income</h3>
                <div className="flex justify-between">
                  <span>Sales Revenue</span>
                  <span>{formatINR(totals.sales)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Bookings Collected</span>
                  <span>{formatINR(totals.bookings)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Invoices Paid</span>
                  <span>{formatINR(totals.paid)}</span>
                </div>
                <Separator />
                <div className="flex justify-between font-bold">
                  <span>Total Income</span>
                  <span>
                    {formatINR(totals.sales + totals.bookings + totals.paid)}
                  </span>
                </div>
              </div>
              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Expenses</h3>
                <div className="flex justify-between">
                  <span>Procurement</span>
                  <span>{formatINR(totals.procurement)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Payroll</span>
                  <span>{formatINR(totals.payroll)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Other Expenses</span>
                  <span>{formatINR(totals.expenses)}</span>
                </div>
                <Separator />
                <div className="flex justify-between font-bold">
                  <span>Total Expenses</span>
                  <span>
                    {formatINR(
                      totals.procurement + totals.payroll + totals.expenses,
                    )}
                  </span>
                </div>
              </div>
              <div className="col-span-2 border-t pt-4 flex justify-between text-lg font-bold">
                <span>Net Profit / Loss</span>
                <span
                  className={
                    totals.sales +
                      totals.bookings +
                      totals.paid -
                      (totals.procurement + totals.payroll + totals.expenses) >=
                    0
                      ? "text-success"
                      : "text-destructive"
                  }
                >
                  {formatINR(
                    totals.sales +
                      totals.bookings +
                      totals.paid -
                      (totals.procurement + totals.payroll + totals.expenses),
                  )}
                </span>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Invoice Dialog */}
      <Dialog open={invOpen} onOpenChange={setInvOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingInv ? "Edit invoice" : "Raise GST invoice"}
            </DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Invoice #</Label>
              <Input
                value={invForm.code}
                onChange={(e) =>
                  setInvForm({ ...invForm, code: e.target.value })
                }
              />
            </div>
            <div className="space-y-1.5">
              <Label>Status</Label>
              <Select
                value={invForm.status}
                onValueChange={(v) => setInvForm({ ...invForm, status: v })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.keys(INV_STATUS).map((k) => (
                    <SelectItem key={k} value={k}>
                      {k}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Project</Label>
              <Select
                value={invForm.projectId}
                onValueChange={(v) => setInvForm({ ...invForm, projectId: v })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  {projects.map((p) => (
                    <SelectItem key={p.id} value={p.id}>
                      {p.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Buyer name</Label>
              <Input
                value={invForm.clientName}
                onChange={(e) =>
                  setInvForm({ ...invForm, clientName: e.target.value })
                }
              />
            </div>
            <div className="space-y-1.5">
              <Label>Amount (₹)</Label>
              <Input
                type="number"
                value={invForm.amount}
                onChange={(e) =>
                  setInvForm({ ...invForm, amount: e.target.value })
                }
              />
            </div>
            <div className="space-y-1.5">
              <Label>GST (₹)</Label>
              <Input
                type="number"
                value={invForm.gst}
                onChange={(e) =>
                  setInvForm({ ...invForm, gst: e.target.value })
                }
              />
            </div>
            <div className="space-y-1.5">
              <Label>Issued</Label>
              <Input
                type="date"
                value={invForm.issuedOn}
                onChange={(e) =>
                  setInvForm({ ...invForm, issuedOn: e.target.value })
                }
              />
            </div>
            <div className="space-y-1.5">
              <Label>Due</Label>
              <Input
                type="date"
                value={invForm.dueOn}
                onChange={(e) =>
                  setInvForm({ ...invForm, dueOn: e.target.value })
                }
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setInvOpen(false)}>
              Cancel
            </Button>
            <Button onClick={saveInvoice}>
              {editingInv ? "Save" : "Raise"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Expense Dialog */}
      <Dialog open={expOpen} onOpenChange={setExpOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Log project expense</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Project</Label>
              <Select
                value={expForm.projectId}
                onValueChange={(v) => setExpForm({ ...expForm, projectId: v })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  {projects.map((p) => (
                    <SelectItem key={p.id} value={p.id}>
                      {p.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Category</Label>
              <Select
                value={expForm.category}
                onValueChange={(v) => setExpForm({ ...expForm, category: v })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Material">Material</SelectItem>
                  <SelectItem value="Labour">Labour</SelectItem>
                  <SelectItem value="Consultancy">Consultancy</SelectItem>
                  <SelectItem value="Logistics">Logistics</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="col-span-2 space-y-1.5">
              <Label>Note</Label>
              <Input
                value={expForm.note}
                onChange={(e) =>
                  setExpForm({ ...expForm, note: e.target.value })
                }
              />
            </div>
            <div className="space-y-1.5">
              <Label>Amount (₹)</Label>
              <Input
                type="number"
                value={expForm.amount}
                onChange={(e) =>
                  setExpForm({ ...expForm, amount: e.target.value })
                }
              />
            </div>
            <div className="space-y-1.5">
              <Label>Date</Label>
              <Input
                type="date"
                value={expForm.date}
                onChange={(e) =>
                  setExpForm({ ...expForm, date: e.target.value })
                }
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setExpOpen(false)}>
              Cancel
            </Button>
            <Button onClick={saveExpense}>Log</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Payroll Dialog */}
      <Dialog open={payOpen} onOpenChange={setPayOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add payroll entry</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Employee</Label>
              <Select
                value={payForm.employeeId}
                onValueChange={(v) => setPayForm({ ...payForm, employeeId: v })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  {users.map((u) => (
                    <SelectItem key={u.id} value={u.id}>
                      {u.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Month</Label>
              <Input
                type="month"
                value={payForm.month}
                onChange={(e) =>
                  setPayForm({ ...payForm, month: e.target.value })
                }
              />
            </div>
            <div className="space-y-1.5">
              <Label>Basic (₹)</Label>
              <Input
                type="number"
                value={payForm.basic}
                onChange={(e) =>
                  setPayForm({ ...payForm, basic: e.target.value })
                }
              />
            </div>
            <div className="space-y-1.5">
              <Label>Allowances (₹)</Label>
              <Input
                type="number"
                value={payForm.allowances}
                onChange={(e) =>
                  setPayForm({ ...payForm, allowances: e.target.value })
                }
              />
            </div>
            <div className="space-y-1.5">
              <Label>Deductions (₹)</Label>
              <Input
                type="number"
                value={payForm.deductions}
                onChange={(e) =>
                  setPayForm({ ...payForm, deductions: e.target.value })
                }
              />
            </div>
            <div className="space-y-1.5">
              <Label>Paid On</Label>
              <Input
                type="date"
                value={payForm.paidOn}
                onChange={(e) =>
                  setPayForm({ ...payForm, paidOn: e.target.value })
                }
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setPayOpen(false)}>
              Cancel
            </Button>
            <Button onClick={savePayroll}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Sale Dialog */}
      <Dialog open={saleOpen} onOpenChange={setSaleOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Record Sale</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Project</Label>
              <Select
                value={saleForm.projectId}
                onValueChange={(v) =>
                  setSaleForm({ ...saleForm, projectId: v })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  {projects.map((p) => (
                    <SelectItem key={p.id} value={p.id}>
                      {p.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Unit No</Label>
              <Input
                value={saleForm.unitNo}
                onChange={(e) =>
                  setSaleForm({ ...saleForm, unitNo: e.target.value })
                }
              />
            </div>
            <div className="space-y-1.5">
              <Label>Buyer Name</Label>
              <Input
                value={saleForm.buyerName}
                onChange={(e) =>
                  setSaleForm({ ...saleForm, buyerName: e.target.value })
                }
              />
            </div>
            <div className="space-y-1.5">
              <Label>Sale Amount (₹)</Label>
              <Input
                type="number"
                value={saleForm.saleAmount}
                onChange={(e) =>
                  setSaleForm({ ...saleForm, saleAmount: e.target.value })
                }
              />
            </div>
            <div className="space-y-1.5">
              <Label>Payment Mode</Label>
              <Select
                value={saleForm.paymentMode}
                onValueChange={(v) =>
                  setSaleForm({ ...saleForm, paymentMode: v })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bank">Bank Transfer</SelectItem>
                  <SelectItem value="cash">Cash</SelectItem>
                  <SelectItem value="cheque">Cheque</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Date</Label>
              <Input
                type="date"
                value={saleForm.date}
                onChange={(e) =>
                  setSaleForm({ ...saleForm, date: e.target.value })
                }
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSaleOpen(false)}>
              Cancel
            </Button>
            <Button onClick={saveSale}>Record</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Procurement Dialog */}
      <Dialog open={procOpen} onOpenChange={setProcOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Procurement Order</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Project</Label>
              <Select
                value={procForm.projectId}
                onValueChange={(v) =>
                  setProcForm({ ...procForm, projectId: v })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  {projects.map((p) => (
                    <SelectItem key={p.id} value={p.id}>
                      {p.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Item</Label>
              <Input
                value={procForm.item}
                onChange={(e) =>
                  setProcForm({ ...procForm, item: e.target.value })
                }
                placeholder="e.g., Cement"
              />
            </div>
            <div className="space-y-1.5">
              <Label>Quantity</Label>
              <Input
                type="number"
                value={procForm.quantity}
                onChange={(e) =>
                  setProcForm({ ...procForm, quantity: e.target.value })
                }
              />
            </div>
            <div className="space-y-1.5">
              <Label>Unit Price (₹)</Label>
              <Input
                type="number"
                value={procForm.unitPrice}
                onChange={(e) =>
                  setProcForm({ ...procForm, unitPrice: e.target.value })
                }
              />
            </div>
            <div className="space-y-1.5">
              <Label>Order Date</Label>
              <Input
                type="date"
                value={procForm.orderDate}
                onChange={(e) =>
                  setProcForm({ ...procForm, orderDate: e.target.value })
                }
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setProcOpen(false)}>
              Cancel
            </Button>
            <Button onClick={saveProcurement}>Create</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Booking Dialog */}
      <Dialog open={bookOpen} onOpenChange={setBookOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Record Booking</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Project</Label>
              <Select
                value={bookForm.projectId}
                onValueChange={(v) =>
                  setBookForm({ ...bookForm, projectId: v })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  {projects.map((p) => (
                    <SelectItem key={p.id} value={p.id}>
                      {p.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Unit No</Label>
              <Input
                value={bookForm.unitNo}
                onChange={(e) =>
                  setBookForm({ ...bookForm, unitNo: e.target.value })
                }
              />
            </div>
            <div className="space-y-1.5">
              <Label>Customer Name</Label>
              <Input
                value={bookForm.customerName}
                onChange={(e) =>
                  setBookForm({ ...bookForm, customerName: e.target.value })
                }
              />
            </div>
            <div className="space-y-1.5">
              <Label>Total Amount (₹)</Label>
              <Input
                type="number"
                value={bookForm.totalAmount}
                onChange={(e) =>
                  setBookForm({ ...bookForm, totalAmount: e.target.value })
                }
              />
            </div>
            <div className="space-y-1.5">
              <Label>Paid Amount (₹)</Label>
              <Input
                type="number"
                value={bookForm.paidAmount}
                onChange={(e) =>
                  setBookForm({ ...bookForm, paidAmount: e.target.value })
                }
              />
            </div>
            <div className="space-y-1.5">
              <Label>Booking Date</Label>
              <Input
                type="date"
                value={bookForm.bookingDate}
                onChange={(e) =>
                  setBookForm({ ...bookForm, bookingDate: e.target.value })
                }
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setBookOpen(false)}>
              Cancel
            </Button>
            <Button onClick={saveBooking}>Record</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={!!confirmId}
        onOpenChange={(v) => !v && setConfirmId(null)}
        title="Delete invoice?"
        onConfirm={() => {
          removeInvoice(confirmId);
          toast.success("Invoice deleted");
          setConfirmId(null);
        }}
      />
    </div>
  );
}
