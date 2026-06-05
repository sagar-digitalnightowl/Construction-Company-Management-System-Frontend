import React, { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLead } from "@/hooks/useLead";

const LeadStatsPage = () => {
  const {
    leadStats,
    fetchLeadStats,
    assignmentStats,
    fetchAssignmentStats,
    agentPerformance,
    fetchAgentPerformance,
  } = useLead();

  useEffect(() => {
    fetchLeadStats();
    fetchAssignmentStats();
    fetchAgentPerformance();
  }, []);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Leads</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {leadStats?.totalLeads || 0}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Converted Leads
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {leadStats?.convertedLeads || 0}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Conversion Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {leadStats?.conversionRate || 0}%
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Assignment Statistics</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between">
              <span>Total Assigned:</span>
              <span className="font-semibold">
                {assignmentStats?.totalAssigned || 0}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Total Unassigned:</span>
              <span className="font-semibold">
                {assignmentStats?.totalUnassigned || 0}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Total Converted:</span>
              <span className="font-semibold">
                {assignmentStats?.totalConverted || 0}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Connection Rate:</span>
              <span className="font-semibold">
                {assignmentStats?.connectionRate || 0}%
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Lead Sources</CardTitle>
          </CardHeader>
          <CardContent>
            {leadStats?.bySource ? (
              <div className="space-y-2">
                {Object.entries(leadStats.bySource).map(([source, count]) => (
                  <div key={source} className="flex justify-between">
                    <span className="capitalize">{source}:</span>
                    <span className="font-semibold">{count}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">No source data available</p>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Agent Performance</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/50">
                <tr className="border-b">
                  <th className="text-left p-3">Agent</th>
                  <th className="text-left p-3">Total Calls</th>
                  <th className="text-left p-3">Connected</th>
                  <th className="text-left p-3">Converted</th>
                  <th className="text-left p-3">Connection Rate</th>
                  <th className="text-left p-3">Conversion Rate</th>
                </tr>
              </thead>
              <tbody>
                {agentPerformance.map((agent) => (
                  <tr key={agent.agentId} className="border-b">
                    <td className="p-3 font-medium">{agent.agentName}</td>
                    <td className="p-3">{agent.totalCalls || 0}</td>
                    <td className="p-3">{agent.connectedCalls || 0}</td>
                    <td className="p-3">{agent.convertedCalls || 0}</td>
                    <td className="p-3">{agent.connectionRate || 0}%</td>
                    <td className="p-3">{agent.conversionRate || 0}%</td>
                  </tr>
                ))}
                {agentPerformance.length === 0 && (
                  <tr>
                    <td
                      colSpan={6}
                      className="p-8 text-center text-muted-foreground"
                    >
                      No agent performance data available
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LeadStatsPage;
