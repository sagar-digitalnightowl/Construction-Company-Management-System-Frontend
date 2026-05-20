// src/components/procurement/POCard.jsx
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Truck, Eye } from 'lucide-react';
import { formatINR, formatDate } from '@/lib/helpers';

const statusColors = {
    draft: 'secondary',
    confirmed: 'default',
    shipped: 'info',
    delivered: 'success',
    cancelled: 'destructive',
};

export function POCard({ po, onView, onUpdateStatus }) {
    return (
        <Card>
            <CardContent className="p-4 space-y-2">
                <div className="flex justify-between">
                    <div>
                        <p className="font-semibold">{po.poNumber}</p>
                        <p className="text-xs text-muted-foreground">{po.vendor?.name}</p>
                    </div>
                    <Badge variant={statusColors[po.status]}>{po.status}</Badge>
                </div>
                <div className="text-sm">
                    <span className="text-muted-foreground">Amount:</span> {formatINR(po.totalAmount)}
                </div>
                <div className="text-xs text-muted-foreground">Expected: {formatDate(po.expectedDeliveryDate)}</div>
                <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => onView(po)}>
                        <Eye className="h-3 w-3 mr-1" /> View
                    </Button>
                    {po.status === 'confirmed' && (
                        <Button size="sm" variant="outline" onClick={() => onUpdateStatus(po._id, 'shipped')}>
                            <Truck className="h-3 w-3 mr-1" /> Mark Shipped
                        </Button>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}