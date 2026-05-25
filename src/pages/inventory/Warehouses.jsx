// src/pages/inventory/Warehouses.jsx
import React, { useState } from 'react';
import { PageHeader, EmptyState } from '@/components/common/PageHeader';
import { Button } from '@/components/ui/button';
import { Plus, MapPin } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { CreateWarehouseDialog } from '@/components/inventory/CreateWarehouseDialog';
import { useInventory } from '@/hooks/useInventory';
import { Skeleton } from '@/components/ui/skeleton';

export default function Warehouses() {
    const { warehouses, fetchWarehouses, createWarehouse, loading } = useInventory();
    const [dialogOpen, setDialogOpen] = useState(false);

    if (loading) return <Skeleton className="h-96 w-full" />;

    return (
        <div className="space-y-6">
            <PageHeader
                eyebrow="Facilities"
                title="Warehouses"
                description="Manage storage locations for construction materials."
                actions={<Button onClick={() => setDialogOpen(true)}><Plus className="h-4 w-4 mr-2" /> New Warehouse</Button>}
            />
            {warehouses.length === 0 ? (
                <EmptyState title="No warehouses" description="Create warehouses to organize inventory." />
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                    {warehouses.map(wh => (
                        <Card key={wh._id}>
                            <CardContent className="p-4 space-y-2">
                                <div className="flex items-start justify-between">
                                    <div>
                                        <p className="font-semibold">{wh.name}</p>
                                        <p className="text-xs text-muted-foreground">{wh.code}</p>
                                    </div>
                                    <MapPin className="h-4 w-4 text-muted-foreground" />
                                </div>
                                <p className="text-sm">{wh.location}</p>
                                <p className="text-xs text-muted-foreground">Manager: {wh.manager} | Capacity: {wh.capacity}</p>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
            <CreateWarehouseDialog open={dialogOpen} onOpenChange={setDialogOpen} onSave={createWarehouse} />
        </div>
    );
}