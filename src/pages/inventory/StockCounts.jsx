// src/pages/inventory/StockCounts.jsx
import React, { useEffect, useState } from 'react';
import { PageHeader, EmptyState } from '@/components/common/PageHeader';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ClipboardList, Plus, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { useInventory } from '@/hooks/useInventory';
import { Skeleton } from '@/components/ui/skeleton';
import { formatDate } from '@/lib/helpers';
import { StockCountDialog } from '@/components/inventory/StockCountDialog';
import { toast } from 'sonner';

export default function StockCounts() {
    const { stockCounts, warehouses, fetchStockCounts, startCount, completeCount, approveCount, loading } = useInventory();
    const [dialogOpen, setDialogOpen] = useState(false);
    const [actionLoading, setActionLoading] = useState(null);

    useEffect(() => {
        fetchStockCounts();
    }, []);

    const handleComplete = async (countId) => {
        setActionLoading(countId);
        const success = await completeCount(countId);
        setActionLoading(null);
        if (success) fetchStockCounts();
    };

    const handleApprove = async (countId) => {
        setActionLoading(countId);
        const success = await approveCount(countId);
        setActionLoading(null);
        if (success) fetchStockCounts();
    };

    if (loading) return <Skeleton className="h-96 w-full" />;

    return (
        <div className="space-y-6">
            <PageHeader
                eyebrow="Audit"
                title="Physical Stock Counts"
                description="Manage periodic inventory verification."
                actions={
                    <Button onClick={() => setDialogOpen(true)}>
                        <Plus className="h-4 w-4 mr-2" /> Start Count
                    </Button>
                }
            />
            {stockCounts.length === 0 ? (
                <EmptyState icon={ClipboardList} title="No counts yet" description="Start a physical count to reconcile stock." />
            ) : (
                <div className="space-y-3">
                    {stockCounts.map(count => (
                        <Card key={count._id}>
                            <CardContent className="p-4">
                                <div className="flex items-start justify-between">
                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <p className="font-semibold">{count.warehouse?.name}</p>
                                            <Badge variant="outline">{count.status}</Badge>
                                        </div>
                                        <p className="text-sm text-muted-foreground">Started: {formatDate(count.createdAt)}</p>
                                        {count.completedAt && <p className="text-sm text-muted-foreground">Completed: {formatDate(count.completedAt)}</p>}
                                        {count.approvedAt && <p className="text-sm text-muted-foreground">Approved: {formatDate(count.approvedAt)}</p>}
                                        {count.notes && <p className="text-sm mt-2">{count.notes}</p>}
                                    </div>
                                    <div className="flex gap-2">
                                        {count.status === 'in_progress' && (
                                            <Button size="sm" variant="outline" onClick={() => handleComplete(count._id)} disabled={actionLoading === count._id}>
                                                {actionLoading === count._id ? <Loader2 className="h-3 w-3 animate-spin mr-1" /> : null}
                                                Complete
                                            </Button>
                                        )}
                                        {count.status === 'completed' && (
                                            <Button size="sm" variant="outline" onClick={() => handleApprove(count._id)} disabled={actionLoading === count._id}>
                                                {actionLoading === count._id ? <Loader2 className="h-3 w-3 animate-spin mr-1" /> : null}
                                                Approve
                                            </Button>
                                        )}
                                        {count.status === 'approved' && (
                                            <Badge variant="success"><CheckCircle className="h-3 w-3 mr-1" /> Approved</Badge>
                                        )}
                                    </div>
                                </div>
                                {count.items && count.items.length > 0 && (
                                    <div className="mt-3 pt-3 border-t">
                                        <p className="text-xs font-medium mb-2">Counted Items: {count.items.length}</p>
                                        <div className="text-xs text-muted-foreground space-y-1">
                                            {count.items.slice(0, 3).map((item, idx) => (
                                                <div key={idx}>{item.materialName}: {item.physicalQuantity} (expected {item.systemQuantity})</div>
                                            ))}
                                            {count.items.length > 3 && <div>+{count.items.length - 3} more</div>}
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
            <StockCountDialog open={dialogOpen} onOpenChange={setDialogOpen} warehouses={warehouses} onStartCount={startCount} />
        </div>
    );
}