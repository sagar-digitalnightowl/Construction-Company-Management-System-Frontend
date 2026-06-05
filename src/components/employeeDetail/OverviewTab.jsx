import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/helpers";

export function OverviewTab({ employee }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Basic Info */}
      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>
              <span className="font-medium">Employee ID:</span>{" "}
              {employee.employeeId || "—"}
            </div>
            <div>
              <span className="font-medium">Status:</span>{" "}
              <Badge variant={employee.isActive ? "success" : "destructive"}>
                {employee.isActive ? "Active" : "Inactive"}
              </Badge>
            </div>
            <div>
              <span className="font-medium">Role:</span> {employee.role}
            </div>
            <div>
              <span className="font-medium">Department:</span>{" "}
              {employee.department?.name || "—"}
            </div>
            <div>
              <span className="font-medium">Department Code:</span>{" "}
              {employee.department?.code || "—"}
            </div>
            <div>
              <span className="font-medium">Joined:</span>{" "}
              {formatDate(employee.createdAt)}
            </div>
            <div>
              <span className="font-medium">Last Login:</span>{" "}
              {employee.lastLogin ? formatDate(employee.lastLogin) : "—"}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Job Details */}
      <Card>
        <CardHeader>
          <CardTitle>Job Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>
              <span className="font-medium">Designation:</span>{" "}
              {employee.jobDetails?.designation || "—"}
            </div>
            <div>
              <span className="font-medium">Employment Type:</span>{" "}
              {employee.jobDetails?.employmentType || "—"}
            </div>
            <div>
              <span className="font-medium">Joining Date:</span>{" "}
              {employee.jobDetails?.joiningDate
                ? formatDate(employee.jobDetails.joiningDate)
                : "—"}
            </div>
            <div>
              <span className="font-medium">Probation (months):</span>{" "}
              {employee.jobDetails?.probationPeriodMonths || "—"}
            </div>
            <div>
              <span className="font-medium">Shift Timing:</span>{" "}
              {employee.jobDetails?.shiftTiming?.start &&
              employee.jobDetails?.shiftTiming?.end
                ? `${employee.jobDetails.shiftTiming.start} - ${employee.jobDetails.shiftTiming.end}`
                : "—"}
            </div>
            <div>
              <span className="font-medium">Weekly Off:</span>{" "}
              {employee.jobDetails?.weeklyOff?.join(", ") || "—"}
            </div>
            <div>
              <span className="font-medium">Manager:</span>{" "}
              {employee.jobDetails?.manager?.name ||
                employee.jobDetails?.manager ||
                "—"}
            </div>
          </div>
          {employee.jobDetails?.salary && (
            <div className="mt-2 pt-2 border-t">
              <p className="font-medium mb-1">Salary Breakdown</p>
              <div className="grid grid-cols-2 gap-1 text-sm">
                <div>
                  Basic: ₹
                  {employee.jobDetails.salary.basic?.toLocaleString() || 0}
                </div>
                <div>
                  HRA: ₹{employee.jobDetails.salary.hra?.toLocaleString() || 0}
                </div>
                <div>
                  Allowances: ₹
                  {employee.jobDetails.salary.allowances?.toLocaleString() || 0}
                </div>
                <div>
                  Total CTC: ₹
                  {employee.jobDetails.salary.totalCTC?.toLocaleString() || 0}
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Personal Details */}
      <Card>
        <CardHeader>
          <CardTitle>Personal Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>
              <span className="font-medium">Date of Birth:</span>{" "}
              {employee.personalDetails?.dateOfBirth
                ? formatDate(employee.personalDetails.dateOfBirth)
                : "—"}
            </div>
            <div>
              <span className="font-medium">Gender:</span>{" "}
              {employee.personalDetails?.gender || "—"}
            </div>
            <div>
              <span className="font-medium">Blood Group:</span>{" "}
              {employee.personalDetails?.bloodGroup || "—"}
            </div>
            <div>
              <span className="font-medium">Marital Status:</span>{" "}
              {employee.personalDetails?.maritalStatus || "—"}
            </div>
            <div>
              <span className="font-medium">Father's Name:</span>{" "}
              {employee.personalDetails?.fatherName || "—"}
            </div>
            <div>
              <span className="font-medium">Mother's Name:</span>{" "}
              {employee.personalDetails?.motherName || "—"}
            </div>
            <div>
              <span className="font-medium">Aadhar Number:</span>{" "}
              {employee.personalDetails?.aadharNumber || "—"}
            </div>
            <div>
              <span className="font-medium">PAN Number:</span>{" "}
              {employee.personalDetails?.panNumber || "—"}
            </div>
            <div>
              <span className="font-medium">UAN Number:</span>{" "}
              {employee.personalDetails?.uanNumber || "—"}
            </div>
            <div>
              <span className="font-medium">ESIC Number:</span>{" "}
              {employee.personalDetails?.esicNumber || "—"}
            </div>
          </div>
          {employee.personalDetails?.emergencyContact && (
            <div className="mt-2 pt-2 border-t">
              <p className="font-medium">Emergency Contact</p>
              <div className="text-sm pl-2">
                <div>
                  Name: {employee.personalDetails.emergencyContact.name}
                </div>
                <div>
                  Phone: {employee.personalDetails.emergencyContact.phone}
                </div>
                <div>
                  Relation:{" "}
                  {employee.personalDetails.emergencyContact.relation || "—"}
                </div>
              </div>
            </div>
          )}
          {employee.personalDetails?.address && (
            <div className="mt-2 pt-2 border-t">
              <p className="font-medium">Address</p>
              <div className="text-sm pl-2">
                {employee.personalDetails.address.line1 && (
                  <div>{employee.personalDetails.address.line1}</div>
                )}
                {employee.personalDetails.address.city && (
                  <div>
                    {employee.personalDetails.address.city},{" "}
                    {employee.personalDetails.address.state}{" "}
                    {employee.personalDetails.address.pincode}
                  </div>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Bank Details */}
      {employee.bankDetails && (
        <Card>
          <CardHeader>
            <CardTitle>Bank Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div>
              <span className="font-medium">Bank Name:</span>{" "}
              {employee.bankDetails.bankName || "—"}
            </div>
            <div>
              <span className="font-medium">Account Number:</span>{" "}
              {employee.bankDetails.accountNumber || "—"}
            </div>
            <div>
              <span className="font-medium">IFSC Code:</span>{" "}
              {employee.bankDetails.ifscCode || "—"}
            </div>
            <div>
              <span className="font-medium">UPI ID:</span>{" "}
              {employee.bankDetails.upiId || "—"}
            </div>
            <div>
              <span className="font-medium">Account Holder:</span>{" "}
              {employee.bankDetails.accountHolderName || "—"}
            </div>
            <div>
              <span className="font-medium">Account Type:</span>{" "}
              {employee.bankDetails.accountType || "—"}
            </div>
            <div>
              <span className="font-medium">Branch:</span>{" "}
              {employee.bankDetails.branchName || "—"}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
