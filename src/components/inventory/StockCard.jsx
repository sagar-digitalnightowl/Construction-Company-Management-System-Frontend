// src/components/inventory/StockCard.jsx
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Package, Warehouse, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { formatINR } from '@/lib/helpers';

export function StockCard({ item, onIssue, onReturn, onTransfer }) {
    const isLowStock = item.quantity <= (item.minStockLevel || 0);
    const usagePercent = ((item.quantityIssued || 0) / (item.quantityIssued + item.quantity) * 100) || 0;

    return (
        <Card className="group transition-all hover:-translate-y-0.5 hover:shadow-md">
            <CardContent className="p-4 space-y-3">
                <div className="flex items-start justify-between">
                    <div>
                        <p className="font-display font-semibold">{item.material?.name || item.materialName}</p>
                        <p className="text-xs text-muted-foreground">{item.material?.code}</p>
                    </div>
                    {isLowStock && (
                        <Badge variant="destructive" className="flex items-center gap-1">
                            <AlertTriangle className="h-3 w-3" /> Low Stock
                        </Badge>
                    )}
                </div>

                <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                        <span className="text-muted-foreground text-xs">In Stock</span>
                        <p className="font-medium">{item.quantity} {item.unit}</p>
                    </div>
                    <div>
                        <span className="text-muted-foreground text-xs">Unit Price</span>
                        <p className="font-medium">{formatINR(item.unitPrice)}</p>
                    </div>
                    <div className="col-span-2">
                        <span className="text-muted-foreground text-xs">Warehouse</span>
                        <p className="flex items-center gap-1 text-sm"><Warehouse className="h-3 w-3" /> {item.warehouseName || item.warehouse?.name}</p>
                    </div>
                </div>

                <div>
                    <div className="flex justify-between text-xs mb-1">
                        <span>Issued / Total</span>
                        <span>{usagePercent.toFixed(0)}%</span>
                    </div>
                    <Progress value={usagePercent} indicatorClassName="bg-primary" />
                </div>

                <div className="flex gap-2 pt-2">
                    <Button size="sm" variant="outline" onClick={() => onIssue(item)}>Issue</Button>
                    <Button size="sm" variant="outline" onClick={() => onReturn(item)}>Return</Button>
                    <Button size="sm" variant="outline" onClick={() => onTransfer(item)}>Transfer</Button>
                </div>
            </CardContent>
        </Card>
    );
}