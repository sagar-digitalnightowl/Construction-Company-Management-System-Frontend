// src/pages/inventory/StockTransactions.jsx
import React, { useEffect, useState } from 'react';
import { PageHeader, EmptyState } from '@/components/common/PageHeader';
import { Input } from '@/components/ui/input';
import { Search, Calendar } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { formatDate, formatINR } from '@/lib/helpers';
import { useInventory } from '@/hooks/useInventory';
import { Skeleton } from '@/components/ui/skeleton';

export default function StockTransactions() {
    const { transactions, fetchTransactions, loading } = useInventory();
    const [search, setSearch] = useState('');

    useEffect(() => {
        fetchTransactions();
    }, []);

    const typeColors = {
        purchase: 'success',
        issue: 'warning',
        return: 'info',
        transfer: 'secondary',
        adjustment: 'destructive',
    };

    if (loading) return <Skeleton className="h-96 w-full" />

    return (
        <div className="space-y-6">
            <PageHeader eyebrow="Audit" title="Stock Transactions" description="Complete history of all inventory movements." />
            <div className="relative w-full sm:w-72">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input className="pl-9" placeholder="Search by material..." value={search} onChange={(e) => setSearch(e.target.value)} />
            </div>
            {loading ? (
                <Skeleton className="h-96 w-full" />
            ) : transactions.transactions?.length === 0 ? (
                <EmptyState title="No transactions" description="Stock movements will appear here." />
            ) : (
                <div className="rounded-lg border overflow-auto">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Date</TableHead>
                                <TableHead>Type</TableHead>
                                <TableHead>Material</TableHead>
                                <TableHead>Warehouse</TableHead>
                                <TableHead>Quantity</TableHead>
                                <TableHead>Unit Price</TableHead>
                                <TableHead>Total Value</TableHead>
                                <TableHead>Reference</TableHead>
                                <TableHead>Remarks</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {transactions.transactions?.map(tx => (
                                <TableRow key={tx._id}>
                                    <TableCell className={"text-nowrap"}>{formatDate(tx.createdAt)}</TableCell>
                                    <TableCell><Badge variant={typeColors[tx.transactionType]}>{tx.transactionType}</Badge></TableCell>
                                    <TableCell>{tx.materialName}</TableCell>
                                    <TableCell>{tx.warehouse}</TableCell>
                                    <TableCell>{tx.quantity} {tx.unit}</TableCell>
                                    <TableCell>{formatINR(tx.unitPrice)}</TableCell>
                                    <TableCell>{formatINR(tx.totalValue)}</TableCell>
                                    <TableCell>{tx.reference || '-'}</TableCell>
                                    <TableCell className="max-w-xs truncate">{tx.remarks}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            )}
        </div>
    );
}