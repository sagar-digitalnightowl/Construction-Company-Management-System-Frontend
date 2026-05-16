// src/pages/inventory/Materials.jsx
import React, { useState } from 'react';
import { PageHeader, EmptyState } from '@/components/common/PageHeader';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { MaterialTable } from '@/components/inventory/MaterialTable';
import { CreateMaterialDialog } from '@/components/inventory/CreateMaterialDialog';
import { useInventory } from '@/hooks/useInventory';
import { useAuthStore } from '@/store/authStore';
import { canMutate } from '@/data/permissions';
import { Skeleton } from '@/components/ui/skeleton';

export default function Materials() {
    const { current } = useAuthStore();
    const canEdit = canMutate(current?.role, 'inventory');
    const { materials, fetchMaterials, createMaterial, loading } = useInventory();
    const [dialogOpen, setDialogOpen] = useState(false);
    const [editing, setEditing] = useState(null);

    const handleSave = async (data) => {
        const success = await createMaterial(data);
        if (success) setDialogOpen(false);
    };

    return (
        <div className="space-y-6">
            <PageHeader
                eyebrow="Master Data"
                title="Materials"
                description="Manage all construction materials and their specifications."
                actions={canEdit && <Button onClick={() => { setEditing(null); setDialogOpen(true); }}><Plus className="h-4 w-4 mr-2" /> New Material</Button>}
            />

            {loading ? (
                <Skeleton className="h-96 w-full" />
            ) : materials.length === 0 ? (
                <EmptyState title="No materials" description="Create materials to start tracking inventory." />
            ) : (
                <MaterialTable materials={materials} onEdit={(m) => { setEditing(m); setDialogOpen(true); }} onDelete={() => { }} canEdit={canEdit} />
            )}

            <CreateMaterialDialog open={dialogOpen} onOpenChange={setDialogOpen} initialData={editing} onSave={handleSave} />
        </div>
    );
}