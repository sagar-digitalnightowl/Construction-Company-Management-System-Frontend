import React, { useEffect, useState } from "react";
import { useLead } from "@/hooks/useLead";
import { useAuthStore } from "@/store/authStore";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Search, RefreshCw, UserPlus } from "lucide-react";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";

const EmployeeLeadsPage = () => {
  const { employees, employeeLoading, fetchEmployees, convertEmployeeToLead } =
    useLead();
  const { current } = useAuthStore();
  const role = current?.role;
  const canConvert = [
    "admin",
    "director",
    "hr_manager",
    "project_manager",
  ].includes(role);

  // Filter states
  const [search, setSearch] = useState("");
  const [departmentId, setDepartmentId] = useState("");
  const [status, setStatus] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [page, setPage] = useState(1);
  const [limit] = useState(10);

  // Fetch on filter change
  useEffect(() => {
    fetchEmployees({
      search: search || undefined,
      departmentId: departmentId || undefined,
      status: status || undefined,
      role: roleFilter || undefined,
      page,
      limit,
    });
  }, [search, departmentId, status, roleFilter, page, limit, fetchEmployees]);

  const handleSearch = (e) => {
    e.preventDefault();
    // effect triggers
  };

  const handleConvert = async (employeeId) => {
    if (!canConvert) {
      toast.error("You do not have permission to convert employees to leads");
      return;
    }
    await convertEmployeeToLead(employeeId);
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const renderSkeleton = (key) => (
    <TableRow key={key}>
      <TableCell>
        <Skeleton className="h-4 w-20" />
      </TableCell>
      <TableCell>
        <Skeleton className="h-4 w-32" />
      </TableCell>
      <TableCell>
        <Skeleton className="h-4 w-24" />
      </TableCell>
      <TableCell>
        <Skeleton className="h-4 w-28" />
      </TableCell>
      <TableCell>
        <Skeleton className="h-4 w-20" />
      </TableCell>
      <TableCell>
        <Skeleton className="h-4 w-16" />
      </TableCell>
      <TableCell>
        <Skeleton className="h-8 w-24" />
      </TableCell>
    </TableRow>
  );

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Employees as Potential Leads</CardTitle>
          <CardDescription>
            Browse employees from HR and convert them to leads for booking
            opportunities. Employees already converted are marked.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <form onSubmit={handleSearch} className="flex flex-wrap gap-4 mb-6">
            <div className="flex-1 min-w-[200px]">
              <Input
                placeholder="Search by name, email, ID, phone..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full"
              />
            </div>
            <Select value={departmentId} onValueChange={setDepartmentId}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="All Departments" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Departments</SelectItem>
                {/* Replace with dynamic department list if available */}
                <SelectItem value="dept1">Department 1</SelectItem>
                <SelectItem value="dept2">Department 2</SelectItem>
              </SelectContent>
            </Select>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="Inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="All Roles" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="site_engineer">Site Engineer</SelectItem>
                <SelectItem value="project_manager">Project Manager</SelectItem>
                <SelectItem value="employee">Employee</SelectItem>
              </SelectContent>
            </Select>
            <Button type="submit" variant="outline" size="icon">
              <Search className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={() => {
                setSearch("");
                setDepartmentId("");
                setStatus("");
                setRoleFilter("");
                setPage(1);
              }}
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
          </form>

          {/* Stats summary */}
          {employees.stats && (
            <div className="flex gap-4 mb-4 text-sm">
              <span>
                Active: <strong>{employees.stats.totalActive || 0}</strong>
              </span>
              <span>
                Total (excl. admin):{" "}
                <strong>{employees.pagination?.total || 0}</strong>
              </span>
            </div>
          )}

          {/* Table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Employee</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Employee ID</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {employeeLoading ? (
                  Array.from({ length: 5 }).map((_, i) => renderSkeleton(i))
                ) : employees.employees.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={7}
                      className="text-center py-8 text-muted-foreground"
                    >
                      No employees found
                    </TableCell>
                  </TableRow>
                ) : (
                  employees.employees.map((emp) => (
                    <TableRow key={emp._id}>
                      <TableCell className="font-medium">
                        {emp.name || "N/A"}
                      </TableCell>
                      <TableCell>{emp.email || "N/A"}</TableCell>
                      <TableCell>{emp.employeeId || "N/A"}</TableCell>
                      <TableCell>{emp.department?.name || "N/A"}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{emp.role || "N/A"}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={emp.isActive ? "default" : "secondary"}
                          className={
                            emp.isActive
                              ? "bg-green-100 text-green-800"
                              : "bg-gray-100"
                          }
                        >
                          {emp.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        {emp.isAlreadyLead ? (
                          <Badge
                            variant="secondary"
                            className="bg-blue-100 text-blue-800"
                          >
                            Already Lead
                          </Badge>
                        ) : (
                          <Button
                            size="sm"
                            variant="default"
                            onClick={() => handleConvert(emp._id)}
                            disabled={!canConvert}
                            className="flex items-center gap-1"
                          >
                            <UserPlus className="h-3 w-3" />
                            Convert
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          <div className="mt-4 flex justify-between items-center">
            <div className="text-sm text-muted-foreground">
              Showing {employees.pagination?.total || 0} employees
            </div>
            {employees.pagination && (
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  gap: "8px",
                  marginTop: "20px",
                }}
              >
                <button
                  onClick={() => handlePageChange(page - 1)}
                  disabled={page === 1}
                  style={{
                    padding: "6px 12px",
                    cursor: page === 1 ? "not-allowed" : "pointer",
                  }}
                >
                  Previous
                </button>

                {Array.from(
                  { length: Math.ceil(employees.pagination?.total / limit) },
                  (_, i) => i + 1,
                ).map((p) => (
                  <button
                    key={p}
                    onClick={() => handlePageChange(p)}
                    style={{
                      padding: "6px 12px",
                      fontWeight: p === page ? "bold" : "normal",
                      backgroundColor: p === page ? "#0070f3" : "transparent",
                      color: p === page ? "#fff" : "#000",
                      border: "1px solid #ccc",
                      borderRadius: "4px",
                      cursor: "pointer",
                    }}
                  >
                    {p}
                  </button>
                ))}

                <button
                  onClick={() => handlePageChange(page + 1)}
                  disabled={page === Math.ceil(employees.pagination?.total / limit)}
                  style={{
                    padding: "6px 12px",
                    cursor:
                      page === Math.ceil(employees.pagination?.total / limit)
                        ? "not-allowed"
                        : "pointer",
                  }}
                >
                  Next
                </button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EmployeeLeadsPage;
