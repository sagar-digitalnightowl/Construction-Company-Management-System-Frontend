// src/pages/procurement/RFQs.jsx
import React, { useState, useEffect } from "react";
import { PageHeader, EmptyState } from "@/components/common/PageHeader";
import { Button } from "@/components/ui/button";
import { Plus, FileText } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RFQCard } from "@/components/procurement/RFQCard";
import { RFQDetailDialog } from "@/components/procurement/RFQDetailDialog";
import { CreateRfqDialog } from "@/components/procurement/CreateRfqDialog";
import { useProcurement } from "@/hooks/useProcurement";
import { useAuthStore } from "@/store/authStore";
import { canMutate } from "@/data/permissions";
import { Skeleton } from "@/components/ui/skeleton";

export default function RFQs() {
  const { current } = useAuthStore();

  const canEdit = canMutate(current.role, "procurement");
  const canOperationsEdit = canMutate(current.role, "procurement-operations");

  const { rfqs, fetchRfqs, sendRfq, createRfq, loading } = useProcurement();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [selectedRfqId, setSelectedRfqId] = useState(null);

  useEffect(() => {
    fetchRfqs();
  }, []);

  const filtered = rfqs.filter((rfq) => {
    const matchStatus = statusFilter === "all" || rfq.status === statusFilter;
    const matchSearch =
      !search || rfq.title.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchSearch;
  });

  const handleSend = async (id) => {
    await sendRfq(id);
  };

  const handleView = (id) => {
    setSelectedRfqId(id);
    setDetailDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Procurement"
        title="Request for Quotations (RFQs)"
        description="Create RFQs, invite vendors, and compare quotations."
        actions={
          canEdit && (
            <Button onClick={() => setDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" /> Create RFQ
            </Button>
          )
        }
      />
      <div className="flex flex-col sm:flex-row gap-3 justify-between">
        <Tabs value={statusFilter} onValueChange={setStatusFilter}>
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="draft">Draft</TabsTrigger>
            <TabsTrigger value="sent">Sent</TabsTrigger>
            <TabsTrigger value="expired">Expired</TabsTrigger>
            <TabsTrigger value="closed">Closed</TabsTrigger>
          </TabsList>
        </Tabs>
        <div className="relative w-full sm:w-72">
          <Input
            placeholder="Search RFQs..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-48" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={FileText}
          title="No RFQs"
          description="Create your first RFQ to start procurement."
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((rfq) => (
            <RFQCard
              key={rfq._id}
              rfq={rfq}
              onSend={handleSend}
              onView={handleView}
            />
          ))}
        </div>
      )}
      <CreateRfqDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onCreate={createRfq}
      />
      <RFQDetailDialog
        open={detailDialogOpen}
        onOpenChange={setDetailDialogOpen}
        rfqId={selectedRfqId}
        onSend={sendRfq}
      />
    </div>
  );
}
