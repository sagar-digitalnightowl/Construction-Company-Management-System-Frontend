// src/components/project/OverviewTab/BudgetCard.jsx (replace with this)
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { IndianRupee, TrendingUp } from "lucide-react";
import { projectApi } from "@/api/projectApi";

export function BudgetCard({ project }) {
  const [budgetData, setBudgetData] = useState(null);

  useEffect(() => {
    if (project?._id) {
      projectApi
        .getBudgetUtilization(project._id)
        .then((res) => setBudgetData(res.data?.data))
        .catch(console.error);
    }
  }, [project]);

  if (!budgetData && !project?.budget) return null;

  const totalBudget = project?.budget || budgetData?.totalBudget || 0;
  const actualCost = budgetData?.actualCost || 0;
  const percentUsed =
    budgetData?.percentageUsed ||
    (totalBudget ? (actualCost / totalBudget) * 100 : 0);

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm flex items-center gap-2">
          <IndianRupee className="h-4 w-4" /> Budget
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-1">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Total Budget:</span>
          <span className="font-medium">₹{totalBudget.toLocaleString()}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Actual Cost:</span>
          <span>₹{actualCost.toLocaleString()}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Utilization:</span>
          <span>{percentUsed.toFixed(1)}%</span>
        </div>
        <div className="w-full bg-muted rounded-full h-1.5 mt-1">
          <div
            className="bg-primary h-1.5 rounded-full"
            style={{ width: `${Math.min(percentUsed, 100)}%` }}
          />
        </div>
        {budgetData?.variance !== undefined && (
          <div className="flex justify-between text-xs text-muted-foreground mt-1">
            <span>Variance:</span>
            <span
              className={
                budgetData.variance >= 0 ? "text-green-600" : "text-red-600"
              }
            >
              ₹{Math.abs(budgetData.variance).toLocaleString()}{" "}
              {budgetData.variance >= 0 ? "under" : "over"}
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
