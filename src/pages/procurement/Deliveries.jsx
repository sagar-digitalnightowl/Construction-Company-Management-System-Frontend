import React, { useEffect } from "react";
import { PageHeader, EmptyState } from "@/components/common/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useProcurement } from "@/hooks/useProcurement";
import { Skeleton } from "@/components/ui/skeleton";
import { Truck, Package, Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Deliveries() {
  const { deliveries, fetchDeliveries, loading } = useProcurement();
  const navigate = useNavigate();

  useEffect(() => {
    fetchDeliveries();
  }, []);

  if (loading) return <Skeleton className="h-96" />;

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Procurement"
        title="Deliveries"
        description="Track incoming material shipments."
      />
      {deliveries.length === 0 ? (
        <EmptyState
          icon={Truck}
          title="No deliveries"
          description="Deliveries will appear once POs are shipped."
        />
      ) : (
        <div className="space-y-3">
          {deliveries.map((d) => (
            <Card key={d._id}>
              <CardContent className="p-4 flex justify-between items-center">
                <div>
                  <p className="font-medium">PO: {d.poNumber}</p>
                  <p className="text-sm text-muted-foreground">
                    Vendor: {d.vendor?.name || "Vendor"}
                  </p>
                  <p className="text-xs">Status: {d.status}</p>
                </div>
                <div className="flex gap-2">
                  <Badge
                    variant={d.status === "delivered" ? "success" : "warning"}
                  >
                    {d.status}
                  </Badge>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() =>
                      navigate(`/procurement/purchase-orders/${d._id}`)
                    }
                  >
                    <Eye className="h-3 w-3 mr-1" /> Track
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
