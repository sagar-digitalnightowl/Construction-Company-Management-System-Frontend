// src/pages/procurement/Quotations.jsx
import React, { useState, useEffect } from 'react';
import { PageHeader, EmptyState } from '@/components/common/PageHeader';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { QuotationCard } from '@/components/procurement/QuotationCard';
import { useProcurement } from '@/hooks/useProcurement';
import { useAuthStore } from '@/store/authStore';
import { canMutate } from '@/data/permissions';
import { Skeleton } from '@/components/ui/skeleton';

export default function Quotations() {
    const { current } = useAuthStore();
    const canAccept = canMutate(current?.role, 'procurement');
    const { quotations, fetchQuotations, acceptQuotation, rejectQuotation, loading } = useProcurement();
    const [statusFilter, setStatusFilter] = useState('all');
    const [search, setSearch] = useState('');

    useEffect(() => {
        fetchQuotations();
    }, []);

    const filtered = quotations.filter(q => {
        const matchStatus = statusFilter === 'all' || q.status === statusFilter;
        const matchSearch = !search || (q.vendor?.name || '').toLowerCase().includes(search.toLowerCase());
        return matchStatus && matchSearch;
    });

    const handleAccept = async (id) => {
        await acceptQuotation(id);
    };
    const handleReject = async (id) => {
        const reason = prompt('Reason for rejection:');
        if (reason) await rejectQuotation(id, reason);
    };

    return (
        <div className="space-y-6">
            <PageHeader eyebrow="Procurement" title="Vendor Quotations" description="Review, accept, or reject quotations from vendors." />
            <div className="flex flex-col sm:flex-row gap-3 justify-between">
                <Tabs value={statusFilter} onValueChange={setStatusFilter}>
                    <TabsList>
                        <TabsTrigger value="all">All</TabsTrigger>
                        <TabsTrigger value="pending">Pending</TabsTrigger>
                        <TabsTrigger value="accepted">Accepted</TabsTrigger>
                        <TabsTrigger value="rejected">Rejected</TabsTrigger>
                    </TabsList>
                </Tabs>
                <Input placeholder="Search vendor..." value={search} onChange={e => setSearch(e.target.value)} className="w-full sm:w-72" />
            </div>
            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4"><Skeleton className="h-40" /><Skeleton className="h-40" /></div>
            ) : filtered.length === 0 ? (
                <EmptyState title="No quotations" description="Quotations submitted by vendors will appear here." />
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filtered.map(q => (
                        <QuotationCard key={q._id} quotation={q} canAccept={canAccept} onAccept={handleAccept} onReject={handleReject} onView={() => { }} />
                    ))}
                </div>
            )}
        </div>
    );
}