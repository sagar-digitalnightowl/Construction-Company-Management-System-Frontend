// src/pages/booking/MyInstallments.jsx
import React, { useEffect, useState } from "react";
import { PageHeader, EmptyState } from "@/components/common/PageHeader";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { InstallmentTable } from "@/components/booking/InstallmentTable";
import { PayInstallmentDialog } from "@/components/booking/PayInstallmentDialog";
import { useBooking } from "@/hooks/useBooking";
import { useAuthStore } from "@/store/authStore";

export default function MyInstallments() {
  const { current } = useAuthStore();
  const {
    myInstallments,
    fetchMyInstallments,
    installmentSummary,
    payInstallment,
    loading,
  } = useBooking();
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedInstallment, setSelectedInstallment] = useState(null);
  const [payDialogOpen, setPayDialogOpen] = useState(false);

  useEffect(() => {
    fetchMyInstallments({
      status: statusFilter === "all" ? undefined : statusFilter,
    });
  }, [statusFilter]);

  const handlePay = (inst) => {
    setSelectedInstallment(inst);
    setPayDialogOpen(true);
  };

  const handlePaySuccess = async (instId, data) => {
    const result = await payInstallment(instId, data);
    if (result) {
      await fetchMyInstallments({
        status: statusFilter === "all" ? undefined : statusFilter,
      });
    }
    return !!result;
  };

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Payments"
        title="My Installments"
        description="Track and pay your installment schedule."
      />
      <Tabs value={statusFilter} onValueChange={setStatusFilter}>
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="overdue">Overdue</TabsTrigger>
          <TabsTrigger value="paid">Paid</TabsTrigger>
        </TabsList>
      </Tabs>
      {loading ? (
        <Skeleton className="h-64" />
      ) : myInstallments.length === 0 ? (
        <EmptyState
          title="No installments"
          description="Your installments will appear here."
        />
      ) : (
        <InstallmentTable
          installments={myInstallments}
          onPay={handlePay}
          canPay={current?.role === "client"}
        />
      )}
      <PayInstallmentDialog
        open={payDialogOpen}
        onOpenChange={setPayDialogOpen}
        installment={selectedInstallment}
        onPay={handlePaySuccess}
      />
    </div>
  );
}
