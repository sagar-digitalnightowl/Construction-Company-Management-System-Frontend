// src/pages/vendor/VendorDashboard.jsx
import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PageHeader } from "@/components/common/PageHeader";
import { VendorRFQs } from "./VendorRFQs";
import { VendorQuotations } from "./VendorQuotations";
import { VendorPurchaseOrders } from "./VendorPurchaseOrders";

export default function VendorDashboard() {
  const [activeTab, setActiveTab] = useState("rfqs");

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Vendor Portal"
        title="Vendor Dashboard"
        description="View RFQs, submit quotations, and track purchase orders."
      />
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full max-w-md grid-cols-3">
          <TabsTrigger value="rfqs">Available RFQs</TabsTrigger>
          <TabsTrigger value="quotations">My Quotations</TabsTrigger>
          <TabsTrigger value="purchaseOrders">Purchase Orders</TabsTrigger>
        </TabsList>
        <TabsContent value="rfqs" className="mt-6">
          <VendorRFQs />
        </TabsContent>
        <TabsContent value="quotations" className="mt-6">
          <VendorQuotations />
        </TabsContent>
        <TabsContent value="purchaseOrders" className="mt-6">
          <VendorPurchaseOrders />
        </TabsContent>
      </Tabs>
    </div>
  );
}
