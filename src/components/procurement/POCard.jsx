// // src/components/procurement/POCard.jsx
// import React from 'react';
// import { Card, CardContent } from '@/components/ui/card';
// import { Badge } from '@/components/ui/badge';
// import { Button } from '@/components/ui/button';
// import { Truck, Eye } from 'lucide-react';
// import { formatINR, formatDate } from '@/lib/helpers';

// const statusColors = {
//     draft: 'secondary',
//     confirmed: 'default',
//     shipped: 'info',
//     delivered: 'success',
//     cancelled: 'destructive',
// };

// export function POCard({ po, onView, onUpdateStatus }) {
//     return (
//         <Card>
//             <CardContent className="p-4 space-y-2">
//                 <div className="flex justify-between">
//                     <div>
//                         <p className="font-semibold">{po.poNumber}</p>
//                         <p className="text-xs text-muted-foreground">{po.vendor?.name}</p>
//                     </div>
//                     <Badge variant={statusColors[po.status]}>{po.status}</Badge>
//                 </div>
//                 <div className="text-sm">
//                     <span className="text-muted-foreground">Amount:</span> {formatINR(po.totalAmount)}
//                 </div>
//                 <div className="text-xs text-muted-foreground">Expected: {formatDate(po.expectedDeliveryDate)}</div>
//                 <div className="flex gap-2">
//                     <Button size="sm" variant="outline" onClick={() => onView(po)}>
//                         <Eye className="h-3 w-3 mr-1" /> View
//                     </Button>
//                     {po.status === 'confirmed' && (
//                         <Button size="sm" variant="outline" onClick={() => onUpdateStatus(po._id, 'shipped')}>
//                             <Truck className="h-3 w-3 mr-1" /> Mark Shipped
//                         </Button>
//                     )}
//                 </div>
//             </CardContent>
//         </Card>
//     );
// }

// src/components/procurement/POCard.jsx
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, Package, IndianRupee } from "lucide-react";
import { formatINR, formatDate } from "@/lib/helpers";

const statusConfig = {
  draft: { label: "Draft", variant: "secondary" },
  sent: { label: "Sent", variant: "default" },
  confirmed: { label: "Confirmed", variant: "success" },
  shipped: { label: "Shipped", variant: "warning" },
  delivered: { label: "Delivered", variant: "success" },
  cancelled: { label: "Cancelled", variant: "destructive" },
};

export function POCard({ po, onView, onUpdateStatus, markReceived }) {
  const handleStatusUpdate = async (newStatus) => {
    await onUpdateStatus(po._id, newStatus);
  };

  return (
    <Card
      className="cursor-pointer hover:shadow-md transition"
      onClick={() => onView(po._id)}
    >
      <CardContent className="p-4 space-y-3">
        <div className="flex justify-between items-start">
          <div>
            <p className="font-semibold">{po.poNumber}</p>
            <p className="text-xs text-muted-foreground">
              Vendor: {po.vendorId?.name || "N/A"}
            </p>
          </div>
          <Badge variant={statusConfig[po.status]?.variant}>
            {statusConfig[po.status]?.label || po.status}
          </Badge>
        </div>
        <div className="text-sm space-y-1">
          <div className="flex items-center gap-2">
            <Package className="h-3 w-3 text-muted-foreground" />
            <span>{po.items?.length || 0} item(s)</span>
          </div>
          <div className="flex items-center gap-2">
            <IndianRupee className="h-3 w-3 text-muted-foreground" />
            <span>{formatINR(po.totalAmount || 0)}</span>
          </div>
          <div className="text-xs text-muted-foreground">
            Expected: {formatDate(po.expectedDeliveryDate)}
          </div>
        </div>
        <div className="flex justify-end gap-2 pt-2">
          <Button
            size="sm"
            variant="outline"
            onClick={(e) => {
              e.stopPropagation();
              onView(po._id);
            }}
          >
            <Eye className="h-3 w-3 mr-1" /> Details
          </Button>
          {po.status === "draft" && (
            <Button
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                handleStatusUpdate("sent");
              }}
            >
              Send to Vendor
            </Button>
          )}
          {/* {po.status === "sent" && (
            <Button size="sm" variant="outline" onClick={(e) => { e.stopPropagation(); handleStatusUpdate("confirmed"); }}>
              Confirm
            </Button>
          )}
          {po.status === "confirmed" && (
            <Button size="sm" variant="outline" onClick={(e) => { e.stopPropagation(); handleStatusUpdate("shipped"); }}>
              Mark as Shipped
            </Button>
          )} */}
          {/* {po.status === "shipped" && (
            <Button size="sm" onClick={(e) => { e.stopPropagation(); handleStatusUpdate("delivered"); }}>
              Mark as Delivered
            </Button>
          )} */}

          {po.status === "shipped" && (
            <Button
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                markReceived(po?._id);
              }}
            >
              Receive
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
