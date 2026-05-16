// src/pages/inventory/MaterialDetail.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Package, TrendingUp, AlertTriangle, Warehouse, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { formatINR, formatDate } from '@/lib/helpers';
import { inventoryApi } from '@/api/inventoryApi';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

export default function MaterialDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [material, setMaterial] = useState(null);
    const [stock, setStock] = useState([]);
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const [materialRes, stockRes, transRes] = await Promise.all([
                    inventoryApi.getMaterialById(id),
                    inventoryApi.getStock({ materialId: id }),
                    inventoryApi.getTransactions({ materialId: id })
                ]);
                setMaterial(materialRes.data?.data);
                setStock(stockRes.data?.data || []);
                setTransactions(transRes.data?.data || []);
            } catch (err) {
                toast.error('Failed to load material details');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id]);

    if (loading) {
        return (
            <div className="space-y-5">
                <Skeleton className="h-8 w-48" />
                <div className="grid grid-cols-3 gap-3">
                    {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-24" />)}
                </div>
                <Skeleton className="h-64 w-full" />
            </div>
        );
    }

    if (!material) return null;

    const totalStock = stock.reduce((sum, s) => sum + s.quantity, 0);
    const totalValue = stock.reduce((sum, s) => sum + (s.quantity * s.unitPrice), 0);
    const isLowStock = totalStock <= (material.minStockLevel || 0);

    return (
        <div className="space-y-6">
            <div>
                <Button variant="ghost" size="sm" className="-ml-2 mb-3" onClick={() => navigate('/inventory/materials')}>
                    <ArrowLeft className="h-4 w-4 mr-1" /> Back to Materials
                </Button>
                <div className="flex items-start justify-between">
                    <div>
                        <h1 className="text-2xl font-bold">{material.name}</h1>
                        <p className="text-sm text-muted-foreground">Code: {material.code}</p>
                    </div>
                    <Badge variant={isLowStock ? 'destructive' : 'success'}>
                        {isLowStock ? 'Low Stock' : 'Adequate Stock'}
                    </Badge>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                    <CardContent className="p-4 flex items-center gap-3">
                        <Package className="h-5 w-5 text-primary" />
                        <div>
                            <p className="text-xs text-muted-foreground">Total Stock</p>
                            <p className="text-xl font-semibold">{totalStock} {material.unit}</p>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4 flex items-center gap-3">
                        <TrendingUp className="h-5 w-5 text-emerald-500" />
                        <div>
                            <p className="text-xs text-muted-foreground">Total Value</p>
                            <p className="text-xl font-semibold">{formatINR(totalValue)}</p>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4 flex items-center gap-3">
                        <Warehouse className="h-5 w-5 text-blue-500" />
                        <div>
                            <p className="text-xs text-muted-foreground">Locations</p>
                            <p className="text-xl font-semibold">{stock.length} warehouses</p>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Tabs defaultValue="stock">
                <TabsList>
                    <TabsTrigger value="stock">Stock by Warehouse</TabsTrigger>
                    <TabsTrigger value="transactions">Transaction History</TabsTrigger>
                    <TabsTrigger value="details">Material Details</TabsTrigger>
                </TabsList>
                <TabsContent value="stock" className="mt-4">
                    {stock.length === 0 ? (
                        <Card><CardContent className="p-8 text-center text-muted-foreground">No stock records found.</CardContent></Card>
                    ) : (
                        <div className="rounded-lg border overflow-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Warehouse</TableHead>
                                        <TableHead>Quantity</TableHead>
                                        <TableHead>Unit Price</TableHead>
                                        <TableHead>Total Value</TableHead>
                                        <TableHead>Status</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {stock.map(s => (
                                        <TableRow key={s._id}>
                                            <TableCell>{s.warehouse?.name || s.warehouseName}</TableCell>
                                            <TableCell>{s.quantity} {s.unit}</TableCell>
                                            <TableCell>{formatINR(s.unitPrice)}</TableCell>
                                            <TableCell>{formatINR(s.quantity * s.unitPrice)}</TableCell>
                                            <TableCell>
                                                <Badge variant={s.quantity <= (material.minStockLevel || 0) ? 'destructive' : 'secondary'}>
                                                    {s.quantity <= (material.minStockLevel || 0) ? 'Low' : 'In Stock'}
                                                </Badge>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    )}
                </TabsContent>
                <TabsContent value="transactions" className="mt-4">
                    {transactions.length === 0 ? (
                        <Card><CardContent className="p-8 text-center text-muted-foreground">No transactions for this material.</CardContent></Card>
                    ) : (
                        <div className="rounded-lg border overflow-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Date</TableHead>
                                        <TableHead>Type</TableHead>
                                        <TableHead>Quantity</TableHead>
                                        <TableHead>Unit Price</TableHead>
                                        <TableHead>Warehouse</TableHead>
                                        <TableHead>Reference</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {transactions.map(tx => (
                                        <TableRow key={tx._id}>
                                            <TableCell>{formatDate(tx.createdAt)}</TableCell>
                                            <TableCell><Badge variant="outline">{tx.type}</Badge></TableCell>
                                            <TableCell>{tx.quantity}</TableCell>
                                            <TableCell>{formatINR(tx.unitPrice)}</TableCell>
                                            <TableCell>{tx.warehouseName}</TableCell>
                                            <TableCell>{tx.poNumber || tx.projectName || '-'}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    )}
                </TabsContent>
                <TabsContent value="details" className="mt-4">
                    <Card>
                        <CardHeader><CardTitle>Material Specifications</CardTitle></CardHeader>
                        <CardContent className="grid grid-cols-2 gap-4 text-sm">
                            <div><span className="text-muted-foreground">Type:</span> {material.type}</div>
                            <div><span className="text-muted-foreground">Unit:</span> {material.unit}</div>
                            <div><span className="text-muted-foreground">Unit Price:</span> {formatINR(material.unitPrice)}</div>
                            <div><span className="text-muted-foreground">Min Stock Level:</span> {material.minStockLevel}</div>
                            <div><span className="text-muted-foreground">Max Stock Level:</span> {material.maxStockLevel}</div>
                            <div><span className="text-muted-foreground">Description:</span> {material.description || '—'}</div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}