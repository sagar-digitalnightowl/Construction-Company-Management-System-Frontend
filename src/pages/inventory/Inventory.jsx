import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader, EmptyState } from '@/components/common/PageHeader';
import { Input } from '@/components/ui/input';
import { Search, Package, Plus, Settings, Warehouse as WarehouseIcon } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { StockCard } from '@/components/inventory/StockCard';
import { IssueStockDialog } from '@/components/inventory/IssueStockDialog';
import { ReturnStockDialog } from '@/components/inventory/ReturnStockDialog';
import { TransferStockDialog } from '@/components/inventory/TransferStockDialog';
import { useInventory } from '@/hooks/useInventory';
import { useAuthStore } from '@/store/authStore';
import { canMutate } from '@/data/permissions';
import { Skeleton } from '@/components/ui/skeleton';
import { projectApi } from '@/api';
import { toast } from 'sonner';

export default function Inventory() {
    const navigate = useNavigate();
    const { current } = useAuthStore();
    const canEdit = canMutate(current?.role, 'inventory');
    const {
        stockData,
        fetchStock,
        warehouses,
        fetchWarehouses,
        issueStock,
        returnStock,
        transferStock,
        loading,
    } = useInventory();
    const [search, setSearch] = useState('');
    const [tab, setTab] = useState('all');
    const [selectedStock, setSelectedStock] = useState(null);
    const [dialog, setDialog] = useState({ issue: false, return: false, transfer: false });
    const [projects, setProjects] = useState([]);

    // Fetch projects for issue dialog
    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const res = await projectApi.getAll();
                const list = res?.data?.data?.projects ?? res?.data?.data ?? res?.data ?? [];
                setProjects(Array.isArray(list) ? list : []);
            } catch (err) {
                console.error('Failed to load projects');
            }
        };
        fetchProjects();
        fetchWarehouses(); // ensure warehouses are loaded for transfer dialog
    }, [fetchWarehouses]);

    const filteredStock = stockData.filter((item) => {
        const matchTab =
            tab === 'all' || (tab === 'low' && item.quantity <= (item.minStockLevel || 0));
        const matchSearch =
            !search ||
            item.material?.name?.toLowerCase().includes(search.toLowerCase()) ||
            item.material?.code?.toLowerCase().includes(search.toLowerCase());
        return matchTab && matchSearch;
    });

    const handleAddStock = () => {
        // Placeholder: can link to procurement or open a dialog
        // For now, navigate to purchase orders or show toast
        toast.info('Add stock via Purchase Orders or manual entry coming soon');
    };

    return (
        <div className="space-y-6">
            <PageHeader
                eyebrow="Inventory"
                title="Stock Management"
                description="Monitor material stock, issue, return, and transfer across warehouses."
                actions={
                    <div className="flex gap-2">
                        {canEdit && (
                            <Button onClick={handleAddStock}>
                                <Plus className="h-4 w-4 mr-2" /> Add Stock
                            </Button>
                        )}
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline">
                                    <Settings className="h-4 w-4 mr-2" /> Manage
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => navigate('/inventory/materials')}>
                                    Materials Master
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => navigate('/inventory/warehouses')}>
                                    Warehouses
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => navigate('/inventory/transactions')}>
                                    Stock Transactions
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => navigate('/inventory/alerts')}>
                                    Low Stock Alerts
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => navigate('/inventory/valuation')}>
                                    Inventory Valuation
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => navigate('/inventory/counts')}>
                                    Physical Counts
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                }
            />

            <div className="flex flex-col sm:flex-row gap-3 justify-between">
                <Tabs value={tab} onValueChange={setTab}>
                    <TabsList>
                        <TabsTrigger value="all">All Materials</TabsTrigger>
                        <TabsTrigger value="low">Low Stock</TabsTrigger>
                    </TabsList>
                </Tabs>
                <div className="relative w-full sm:w-72">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        className="pl-9"
                        placeholder="Search material..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
            </div>

            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[...Array(6)].map((_, i) => (
                        <Skeleton key={i} className="h-48" />
                    ))}
                </div>
            ) : filteredStock.length === 0 ? (
                <EmptyState
                    icon={Package}
                    title="No stock items"
                    description="Add materials or receive stock from purchase orders."
                />
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredStock.map((item) => (
                        <StockCard
                            key={item._id}
                            item={item}
                            onIssue={() => {
                                setSelectedStock(item);
                                setDialog({ ...dialog, issue: true });
                            }}
                            onReturn={() => {
                                setSelectedStock(item);
                                setDialog({ ...dialog, return: true });
                            }}
                            onTransfer={() => {
                                setSelectedStock(item);
                                setDialog({ ...dialog, transfer: true });
                            }}
                        />
                    ))}
                </div>
            )}

            {selectedStock && (
                <>
                    <IssueStockDialog
                        open={dialog.issue}
                        onOpenChange={(v) => setDialog({ ...dialog, issue: v })}
                        stockItem={selectedStock}
                        projects={projects}
                        onIssue={issueStock}
                    />
                    <ReturnStockDialog
                        open={dialog.return}
                        onOpenChange={(v) => setDialog({ ...dialog, return: v })}
                        stockItem={selectedStock}
                        onReturn={returnStock}
                    />
                    <TransferStockDialog
                        open={dialog.transfer}
                        onOpenChange={(v) => setDialog({ ...dialog, transfer: v })}
                        stockItem={selectedStock}
                        warehouses={warehouses}
                        onTransfer={transferStock}
                    />
                </>
            )}
        </div>
    );
}