// src/pages/procurement/Quotations.jsx
import React, { useState, useEffect } from "react";
import { PageHeader, EmptyState } from "@/components/common/PageHeader";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { QuotationCard } from "@/components/procurement/QuotationCard";
import { QuotationDetailDialog } from "@/components/procurement/QuotationDetailDialog";
import { RejectQuotationDialog } from "@/components/procurement/RejectQuotationDialog";
import { useProcurement } from "@/hooks/useProcurement";
import { useAuthStore } from "@/store/authStore";
import { canMutate } from "@/data/permissions";
import { Skeleton } from "@/components/ui/skeleton";

export default function Quotations() {
  const { current } = useAuthStore();
  const canAccept = canMutate(current?.role, "procurement");
  const {
    quotations,
    fetchQuotations,
    acceptQuotation,
    rejectQuotation,
    loading,
  } = useProcurement();
  const [statusFilter, setStatusFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [selectedQuotationId, setSelectedQuotationId] = useState(null);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [pendingRejectId, setPendingRejectId] = useState(null);

  useEffect(() => {
    fetchQuotations();
  }, []);

  const filtered = quotations.filter((q) => {
    const matchStatus = statusFilter === "all" || q.status === statusFilter;
    const matchSearch =
      !search ||
      (q.vendor?.name || q.vendorId?.name || "")
        .toLowerCase()
        .includes(search.toLowerCase());
    return matchStatus && matchSearch;
  });

  const handleAccept = async (id) => {
    await acceptQuotation(id);
    await fetchQuotations(); // refresh
  };

  const handleRejectClick = (id) => {
    setPendingRejectId(id);
    setRejectDialogOpen(true);
  };

  const handleRejectConfirm = async (id, reason) => {
    const success = await rejectQuotation(id, reason);
    if (success) {
      await fetchQuotations();
      return true;
    }
    return false;
  };

  const handleViewDetails = (id) => {
    setSelectedQuotationId(id);
    setDetailDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Procurement"
        title="Vendor Quotations"
        description="Review, accept, or reject quotations from vendors."
      />
      <div className="flex flex-col sm:flex-row gap-3 justify-between">
        <Tabs value={statusFilter} onValueChange={setStatusFilter}>
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="accepted">Accepted</TabsTrigger>
            <TabsTrigger value="rejected">Rejected</TabsTrigger>
          </TabsList>
        </Tabs>
        <Input
          placeholder="Search vendor..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full sm:w-72"
        />
      </div>
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Skeleton className="h-40" />
          <Skeleton className="h-40" />
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState
          title="No quotations"
          description="Quotations submitted by vendors will appear here."
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((q) => (
            <QuotationCard
              key={q._id}
              quotation={q}
              canAccept={canAccept}
              onAccept={handleAccept}
              onReject={handleRejectClick}
              onView={handleViewDetails}
            />
          ))}
        </div>
      )}

      <QuotationDetailDialog
        open={detailDialogOpen}
        onOpenChange={setDetailDialogOpen}
        quotationId={selectedQuotationId}
        onAccept={handleAccept}
        onReject={handleRejectClick}
      />

      <RejectQuotationDialog
        open={rejectDialogOpen}
        onOpenChange={setRejectDialogOpen}
        quotationId={pendingRejectId}
        onReject={handleRejectConfirm}
      />
    </div>
  );
}
