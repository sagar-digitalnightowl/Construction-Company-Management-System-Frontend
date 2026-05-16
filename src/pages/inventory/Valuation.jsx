// src/pages/inventory/Valuation.jsx
import React, { useEffect } from 'react';
import { PageHeader, EmptyState } from '@/components/common/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useInventory } from '@/hooks/useInventory';
import { formatINR } from '@/lib/helpers';
import { Skeleton } from '@/components/ui/skeleton';

export default function Valuation() {
    const { valuation, fetchValuation, loading } = useInventory();

    useEffect(() => {
        fetchValuation();
    }, []);

    if (loading) return <Skeleton className="h-96 w-full" />;
    if (!valuation) return <EmptyState title="No data" description="Unable to load inventory valuation." />;

    return (
        <div className="space-y-6">
            <PageHeader eyebrow="Finance" title="Inventory Valuation" description="Current value of all stock across warehouses." />
            <div className="grid gap-4 md:grid-cols-2">
                <Card>
                    <CardHeader><CardTitle>Total Inventory Value</CardTitle></CardHeader>
                    <CardContent><p className="text-3xl font-bold">{formatINR(valuation.totalValue)}</p></CardContent>
                </Card>
                <Card>
                    <CardHeader><CardTitle>Number of Items</CardTitle></CardHeader>
                    <CardContent><p className="text-3xl font-bold">{valuation.itemCount}</p></CardContent>
                </Card>
            </div>
            <div className="rounded-lg border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Material</TableHead>
                            <TableHead>Quantity</TableHead>
                            <TableHead>Unit Price</TableHead>
                            <TableHead>Total Value</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {valuation.items?.map(item => (
                            <TableRow key={item.materialId}>
                                <TableCell>{item.materialName}</TableCell>
                                <TableCell>{item.quantity} {item.unit}</TableCell>
                                <TableCell>{formatINR(item.unitPrice)}</TableCell>
                                <TableCell>{formatINR(item.totalValue)}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}