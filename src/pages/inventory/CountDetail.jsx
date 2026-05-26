// src/pages/inventory/CountDetail.jsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Save, CheckCircle, Loader2, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { formatDate } from "@/lib/helpers";
import { useInventory } from "@/hooks/useInventory";
import { useAuthStore } from "@/store/authStore";
import { canMutate } from "@/data/permissions";

const statusConfig = {
  draft: { label: "Draft", variant: "secondary" },
  in_progress: { label: "In Progress", variant: "default" },
  completed: { label: "Completed", variant: "warning" },
  approved: { label: "Approved", variant: "success" },
};

export default function CountDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { current } = useAuthStore();
  const canManageCounts = canMutate(current?.role, "inventory");
  const canApprove = canMutate(current?.role, "inventory");
  const {
    getCountById,
    beginCount,
    updateCountItems,
    completeCount,
    approveCount,
  } = useInventory();

  const [count, setCount] = useState(null);
  const [items, setItems] = useState([]);
  const [updating, setUpdating] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);

  const fetchData = async () => {
    setFetchLoading(true);
    const data = await getCountById(id);
    if (data) {
      setCount(data);
      setItems(
        data.items?.map((i) => ({
          ...i,
          physicalQuantity: i.physicalQuantity ?? i.systemQuantity,
          _changed: false,
        })) || [],
      );
    }
    setFetchLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  const handleBeginCount = async () => {
    if (
      window.confirm(
        "Start this physical count? You will be able to enter quantities.",
      )
    ) {
      setUpdating(true);
      const success = await beginCount(id);
      setUpdating(false);
      if (success) await fetchData();
    }
  };

  const handleQuantityChange = (index, value) => {
    const newItems = [...items];
    newItems[index].physicalQuantity = value === "" ? 0 : Number(value);
    newItems[index]._changed = true;
    setItems(newItems);
  };

  const handleReasonChange = (index, value) => {
    const newItems = [...items];
    newItems[index].reason = value;
    newItems[index]._changed = true;
    setItems(newItems);
  };

  const handleSave = async () => {
    const changedItems = items
      .filter((i) => i._changed)
      .map((i) => ({
        materialId: i.materialId,
        physicalQuantity: i.physicalQuantity,
        reason: i.reason || "",
      }));
    if (changedItems.length === 0) {
      toast.info("No changes to save");
      return;
    }
    setUpdating(true);
    const success = await updateCountItems(id, changedItems);
    setUpdating(false);
    if (success) {
      await fetchData();
      toast.success("Count updated");
    }
  };

  const handleComplete = async () => {
    if (
      window.confirm(
        "Mark this count as completed? You will not be able to change quantities after this.",
      )
    ) {
      setUpdating(true);
      const success = await completeCount(id);
      setUpdating(false);
      if (success) await fetchData();
    }
  };

  const handleApprove = async () => {
    if (
      window.confirm(
        "Approve this count? This will adjust stock levels accordingly.",
      )
    ) {
      setUpdating(true);
      const success = await approveCount(id);
      setUpdating(false);
      if (success) {
        toast.success("Stock levels updated");
        navigate("/inventory/counts");
      }
    }
  };

  if (fetchLoading) return <Skeleton className="h-96 w-full" />;
  if (!count) return <div className="text-center py-12">Count not found</div>;

  const isDraft = count.status === "draft";
  const isInProgress = count.status === "in_progress";
  const isCompleted = count.status === "completed";
  const isApproved = count.status === "approved";
  const canEdit = (isDraft || isInProgress) && canManageCounts;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap justify-between items-center gap-3">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate("/inventory/counts")}
          className="-ml-2"
        >
          <ArrowLeft className="h-4 w-4 mr-1" /> Back
        </Button>
        <div className="flex gap-2">
          {isDraft && canManageCounts && (
            <Button
              variant="default"
              onClick={handleBeginCount}
              disabled={updating}
            >
              <Play className="h-4 w-4 mr-1" /> Begin Count
            </Button>
          )}
          {canEdit && (
            <>
              <Button
                variant="default"
                onClick={handleSave}
                disabled={updating}
              >
                <Save className="h-4 w-4 mr-1" /> Save Changes
              </Button>
              <Button
                variant="outline"
                onClick={handleComplete}
                disabled={updating}
              >
                <CheckCircle className="h-4 w-4 mr-1" /> Complete Count
              </Button>
            </>
          )}
          {isCompleted && canApprove && (
            <Button
              variant="default"
              onClick={handleApprove}
              disabled={updating}
            >
              <CheckCircle className="h-4 w-4 mr-1" /> Approve & Update Stock
            </Button>
          )}
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Count Details</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-muted-foreground">Count Number:</span>{" "}
            {count.countNumber}
          </div>
          <div>
            <span className="text-muted-foreground">Status:</span>{" "}
            <Badge variant={statusConfig[count.status]?.variant}>
              {statusConfig[count.status]?.label}
            </Badge>
          </div>
          <div>
            <span className="text-muted-foreground">Warehouse:</span>{" "}
            {typeof count.warehouse === "string"
              ? count.warehouse
              : count.warehouse?.name}
          </div>
          <div>
            <span className="text-muted-foreground">Initiated By:</span>{" "}
            {count.initiatedBy?.name || "System"}
          </div>
          <div>
            <span className="text-muted-foreground">Started:</span>{" "}
            {formatDate(count.createdAt)}
          </div>
          {count.completedAt && (
            <div>
              <span className="text-muted-foreground">Completed:</span>{" "}
              {formatDate(count.completedAt)}
            </div>
          )}
          {count.approvedAt && (
            <div>
              <span className="text-muted-foreground">Approved:</span>{" "}
              {formatDate(count.approvedAt)}
            </div>
          )}
          {count.notes && (
            <div className="col-span-2">
              <span className="text-muted-foreground">Notes:</span>{" "}
              {count.notes}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Count Items</CardTitle>
        </CardHeader>
        <CardContent className="overflow-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted">
              <tr>
                <th className="px-3 py-2 text-left">Material</th>
                <th className="px-3 py-2 text-right">System Qty</th>
                <th className="px-3 py-2 text-right">Physical Qty</th>
                <th className="px-3 py-2 text-right">Difference</th>
                <th className="px-3 py-2 text-left">Reason</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, idx) => {
                const diff =
                  (item.physicalQuantity || 0) - (item.systemQuantity || 0);
                return (
                  <tr key={idx} className="border-t">
                    <td className="px-3 py-2">{item.materialName}</td>
                    <td className="px-3 py-2 text-right">
                      {item.systemQuantity}
                    </td>
                    <td className="px-3 py-2">
                      {canEdit ? (
                        <Input
                          type="number"
                          value={item.physicalQuantity}
                          onChange={(e) =>
                            handleQuantityChange(idx, e.target.value)
                          }
                          className="w-24 text-right"
                        />
                      ) : (
                        <span className="text-right block">
                          {item.physicalQuantity}
                        </span>
                      )}
                    </td>
                    <td className="px-3 py-2 text-right">
                      <span
                        className={
                          diff !== 0 ? "font-semibold text-orange-600" : ""
                        }
                      >
                        {diff !== 0 ? diff : "-"}
                      </span>
                    </td>
                    <td className="px-3 py-2">
                      {canEdit ? (
                        <Input
                          value={item.reason || ""}
                          onChange={(e) =>
                            handleReasonChange(idx, e.target.value)
                          }
                          placeholder="Variance reason"
                          className="w-48"
                        />
                      ) : (
                        <span>{item.reason || "-"}</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {items.length === 0 && (
            <p className="text-center py-4 text-muted-foreground">
              No items to count
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
