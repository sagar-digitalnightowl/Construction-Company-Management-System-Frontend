// src/pages/vendor/VendorDashboard.jsx
import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PageHeader } from "@/components/common/PageHeader";
import { ExportButtons } from "@/components/common/ExportButtons";
import { VendorRFQs } from "./VendorRFQs";
import { VendorQuotations } from "./VendorQuotations";
import { VendorPurchaseOrders } from "./VendorPurchaseOrders";

// The export matches the list shown in each tab
const TAB_EXPORT = {
  rfqs: { url: "/procurement/rfq", params: { status: "sent" }, name: "rfqs" },
  quotations: { url: "/procurement/quotations", params: {}, name: "quotations" },
  purchaseOrders: { url: "/procurement/purchase-orders", params: {}, name: "purchase-orders" },
};

export default function VendorDashboard() {
  const [activeTab, setActiveTab] = useState("rfqs");
  const exportTab = TAB_EXPORT[activeTab];

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Vendor Portal"
        title="Vendor Dashboard"
        description="View RFQs, submit quotations, and track purchase orders."
        actions={<ExportButtons url={exportTab.url} params={exportTab.params} name={exportTab.name} />}
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
