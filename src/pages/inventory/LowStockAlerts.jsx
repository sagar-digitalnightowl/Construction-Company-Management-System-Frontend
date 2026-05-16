// // src/pages/inventory/LowStockAlerts.jsx
// import React, { useEffect } from 'react';
// import { PageHeader, EmptyState } from '@/components/common/PageHeader';
// import { Card, CardContent } from '@/components/ui/card';
// import { Button } from '@/components/ui/button';
// import { AlertTriangle, CheckCircle } from 'lucide-react';
// import { useInventory } from '@/hooks/useInventory';
// import { Skeleton } from '@/components/ui/skeleton';
// import { formatINR } from '@/lib/helpers';

// export default function LowStockAlerts() {
//     const { lowStockAlerts, fetchLowStockAlerts, resolveAlert, loading } = useInventory();

//     useEffect(() => {
//         fetchLowStockAlerts();
//     }, []);

//     if (loading) return <Skeleton className="h-96 w-full" />;

//     return (
//         <div className="space-y-6">
//             <PageHeader eyebrow="Monitoring" title="Low Stock Alerts" description="Materials that have fallen below minimum stock levels." />
//             {lowStockAlerts.length === 0 ? (
//                 <EmptyState icon={CheckCircle} title="All stock levels are healthy" description="No low stock alerts at the moment." />
//             ) : (
//                 <div className="space-y-3">
//                     {lowStockAlerts.map(alert => (
//                         <Card key={alert._id}>
//                             <CardContent className="p-4 flex items-center justify-between">
//                                 <div className="flex items-center gap-3">
//                                     <AlertTriangle className="h-5 w-5 text-destructive" />
//                                     <div>
//                                         <p className="font-medium">{alert.material?.name}</p>
//                                         <p className="text-sm text-muted-foreground">Current stock: {alert.currentStock} {alert.unit} (Min: {alert.threshold})</p>
//                                     </div>
//                                 </div>
//                                 <Button size="sm" onClick={() => resolveAlert(alert._id)}>Resolve</Button>
//                             </CardContent>
//                         </Card>
//                     ))}
//                 </div>
//             )}
//         </div>
//     );
// }




// src/pages/inventory/LowStockAlerts.jsx

import React, { useEffect } from 'react';
import { PageHeader, EmptyState } from '@/components/common/PageHeader';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, CheckCircle } from 'lucide-react';
import { useInventory } from '@/hooks/useInventory';
import { Skeleton } from '@/components/ui/skeleton';
import { formatINR } from '@/lib/helpers';
import dayjs from 'dayjs';

export default function LowStockAlerts() {
    const { lowStockAlerts, fetchLowStockAlerts, resolveAlert, loading } = useInventory();

    useEffect(() => {
        fetchLowStockAlerts();
    }, []);

    if (loading) return <Skeleton className="h-96 w-full" />;

    return (
        <div className="space-y-6">

            <PageHeader
                eyebrow="Monitoring"
                title="Low Stock Alerts"
                description="Materials that have fallen below minimum stock levels."
            />

            {lowStockAlerts.length === 0 ? (
                <EmptyState
                    icon={CheckCircle}
                    title="All stock levels are healthy"
                    description="No low stock alerts at the moment."
                />
            ) : (
                <div className="space-y-3">

                    {lowStockAlerts.map((alert) => {
                        const material = alert.materialId;

                        return (
                            <Card key={alert._id} className="hover:shadow-md transition">

                                <CardContent className="p-5 flex items-center justify-between">

                                    {/* LEFT SECTION */}
                                    <div className="flex items-start gap-4">

                                        <AlertTriangle className="h-6 w-6 text-destructive mt-1" />

                                        <div className="space-y-1">

                                            {/* NAME + CODE */}
                                            <div className="flex items-center gap-2">
                                                <p className="font-semibold text-base">
                                                    {material?.name}
                                                </p>
                                                <Badge variant="outline">
                                                    {material?.code}
                                                </Badge>
                                            </div>

                                            {/* TYPE + UNIT */}
                                            <p className="text-xs text-muted-foreground">
                                                {material?.type} • {material?.unit}
                                            </p>

                                            {/* STOCK INFO */}
                                            <p className="text-sm">
                                                Current Stock:
                                                <span className="font-semibold text-destructive ml-1">
                                                    {alert.currentStock}
                                                </span>
                                                {" "} / Min:
                                                <span className="ml-1">
                                                    {alert.threshold}
                                                </span>
                                            </p>

                                            {/* PRICE */}
                                            <p className="text-xs text-muted-foreground">
                                                Price: {formatINR(material?.unitPrice)}
                                            </p>

                                            {/* TIME */}
                                            <p className="text-xs text-muted-foreground">
                                                Alerted: {dayjs(alert.notifiedAt).format("DD MMM YYYY, hh:mm A")}
                                            </p>

                                        </div>
                                    </div>

                                    {/* RIGHT SECTION */}
                                    <div className="flex flex-col items-end gap-2">

                                        {/* STATUS */}
                                        <Badge
                                            variant={
                                                alert.status === "pending"
                                                    ? "secondary"
                                                    : "default"
                                            }
                                        >
                                            {alert.status}
                                        </Badge>

                                        {/* ACTION */}
                                        <Button
                                            size="sm"
                                            onClick={() => resolveAlert(alert._id)}
                                        >
                                            Resolve
                                        </Button>

                                    </div>

                                </CardContent>

                            </Card>
                        );
                    })}
                </div>
            )}
        </div>
    );
}