import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useHR } from "@/hooks/useHR";
import { toast } from "sonner";

export function EditEmployeeDialog({
  open,
  onOpenChange,
  employee,
  onSuccess,
}) {
  const { updateEmployee, departments, fetchDepartments, loading } = useHR();
  const [form, setForm] = useState({
    name: "",
    phone: "",
    department: "",
    personalDetails: {
      dateOfBirth: "",
      gender: "",
      bloodGroup: "",
      address: {
        line1: "",
        city: "",
        state: "",
        pincode: "",
      },
      emergencyContact: {
        name: "",
        phone: "",
        relation: "",
      },
    },
    jobDetails: {
      designation: "",
      joiningDate: "",
      employmentType: "Full-Time",
      salary: {
        basic: "",
        hra: "",
        allowances: "",
        totalCTC: "",
      },
      shiftTiming: {
        start: "09:00",
        end: "18:00",
      },
      weeklyOff: ["Sunday"],
      probationPeriodMonths: 3,
    },
  });

  useEffect(() => {
    if (open) fetchDepartments();
    if (employee) {
      setForm({
        name: employee.name || "",
        phone: employee.phone || "",
        department: employee.department?._id || "",
        personalDetails: {
          dateOfBirth:
            employee.personalDetails?.dateOfBirth?.split("T")[0] || "",
          gender: employee.personalDetails?.gender || "",
          bloodGroup: employee.personalDetails?.bloodGroup || "",
          address: {
            line1: employee.personalDetails?.address?.line1 || "",
            city: employee.personalDetails?.address?.city || "",
            state: employee.personalDetails?.address?.state || "",
            pincode: employee.personalDetails?.address?.pincode || "",
          },
          emergencyContact: {
            name: employee.personalDetails?.emergencyContact?.name || "",
            phone: employee.personalDetails?.emergencyContact?.phone || "",
            relation:
              employee.personalDetails?.emergencyContact?.relation || "",
          },
        },
        jobDetails: {
          designation: employee.jobDetails?.designation || "",
          joiningDate: employee.jobDetails?.joiningDate?.split("T")[0] || "",
          employmentType: employee.jobDetails?.employmentType || "Full-Time",
          salary: {
            basic: employee.jobDetails?.salary?.basic || "",
            hra: employee.jobDetails?.salary?.hra || "",
            allowances: employee.jobDetails?.salary?.allowances || "",
            totalCTC: employee.jobDetails?.salary?.totalCTC || "",
          },
          shiftTiming: {
            start: employee.jobDetails?.shiftTiming?.start || "09:00",
            end: employee.jobDetails?.shiftTiming?.end || "18:00",
          },
          weeklyOff: employee.jobDetails?.weeklyOff || ["Sunday"],
          probationPeriodMonths:
            employee.jobDetails?.probationPeriodMonths || 3,
        },
      });
    }
  }, [employee, open]);

  const handleSubmit = async () => {
    if (!form.name || !form.phone) {
      toast.error("Name and phone are required");
      return;
    }
    const payload = {
      name: form.name,
      phone: form.phone,
      department: form.department || undefined,
      personalDetails: {
        dateOfBirth: form.personalDetails.dateOfBirth || undefined,
        gender: form.personalDetails.gender || undefined,
        bloodGroup: form.personalDetails.bloodGroup || undefined,
        address: {
          line1: form.personalDetails.address.line1 || undefined,
          city: form.personalDetails.address.city || undefined,
          state: form.personalDetails.address.state || undefined,
          pincode: form.personalDetails.address.pincode || undefined,
        },
        emergencyContact: {
          name: form.personalDetails.emergencyContact.name || undefined,
          phone: form.personalDetails.emergencyContact.phone || undefined,
          relation: form.personalDetails.emergencyContact.relation || undefined,
        },
      },
      jobDetails: {
        designation: form.jobDetails.designation || undefined,
        joiningDate: form.jobDetails.joiningDate || undefined,
        employmentType: form.jobDetails.employmentType || undefined,
        salary: {
          basic: form.jobDetails.salary.basic
            ? Number(form.jobDetails.salary.basic)
            : undefined,
          hra: form.jobDetails.salary.hra
            ? Number(form.jobDetails.salary.hra)
            : undefined,
          allowances: form.jobDetails.salary.allowances
            ? Number(form.jobDetails.salary.allowances)
            : undefined,
          totalCTC: form.jobDetails.salary.totalCTC
            ? Number(form.jobDetails.salary.totalCTC)
            : undefined,
        },
        shiftTiming: {
          start: form.jobDetails.shiftTiming.start || undefined,
          end: form.jobDetails.shiftTiming.end || undefined,
        },
        weeklyOff:
          form.jobDetails.weeklyOff.length > 0
            ? form.jobDetails.weeklyOff
            : undefined,
        probationPeriodMonths:
          form.jobDetails.probationPeriodMonths || undefined,
      },
    };
    const success = await updateEmployee(employee._id, payload);
    if (success) {
      toast.success("Employee updated");
      onSuccess?.();
      onOpenChange(false);
    }
  };

  const handleWeeklyOffChange = (day) => {
    const current = form.jobDetails.weeklyOff;
    setForm({
      ...form,
      jobDetails: {
        ...form.jobDetails,
        weeklyOff: current.includes(day)
          ? current.filter((d) => d !== day)
          : [...current, day],
      },
    });
  };

  const weekdays = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Employee Details</DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          {/* Basic Info */}
          <div className="space-y-3 border-b pb-3">
            <h3 className="font-medium">Basic Information</h3>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Full Name *</Label>
                <Input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
              </div>
              <div>
                <Label>Phone *</Label>
                <Input
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                />
              </div>
              <div>
                <Label>Department</Label>
                <Select
                  value={form.department}
                  onValueChange={(v) => setForm({ ...form, department: v })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent>
                    {departments.map((d) => (
                      <SelectItem key={d._id} value={d._id}>
                        {d.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Personal Details */}
          <div className="space-y-3 border-b pb-3">
            <h3 className="font-medium">Personal Details</h3>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Date of Birth</Label>
                <Input
                  type="date"
                  value={form.personalDetails.dateOfBirth}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      personalDetails: {
                        ...form.personalDetails,
                        dateOfBirth: e.target.value,
                      },
                    })
                  }
                />
              </div>
              <div>
                <Label>Gender</Label>
                <Select
                  value={form.personalDetails.gender}
                  onValueChange={(v) =>
                    setForm({
                      ...form,
                      personalDetails: { ...form.personalDetails, gender: v },
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Male">Male</SelectItem>
                    <SelectItem value="Female">Female</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Blood Group</Label>
                <Select
                  value={form.personalDetails.bloodGroup}
                  onValueChange={(v) =>
                    setForm({
                      ...form,
                      personalDetails: {
                        ...form.personalDetails,
                        bloodGroup: v,
                      },
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    {["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"].map(
                      (bg) => (
                        <SelectItem key={bg} value={bg}>
                          {bg}
                        </SelectItem>
                      ),
                    )}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label>Address Line 1</Label>
              <Input
                value={form.personalDetails.address.line1}
                onChange={(e) =>
                  setForm({
                    ...form,
                    personalDetails: {
                      ...form.personalDetails,
                      address: {
                        ...form.personalDetails.address,
                        line1: e.target.value,
                      },
                    },
                  })
                }
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>City</Label>
                <Input
                  value={form.personalDetails.address.city}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      personalDetails: {
                        ...form.personalDetails,
                        address: {
                          ...form.personalDetails.address,
                          city: e.target.value,
                        },
                      },
                    })
                  }
                />
              </div>
              <div>
                <Label>State</Label>
                <Input
                  value={form.personalDetails.address.state}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      personalDetails: {
                        ...form.personalDetails,
                        address: {
                          ...form.personalDetails.address,
                          state: e.target.value,
                        },
                      },
                    })
                  }
                />
              </div>
              <div>
                <Label>Pincode</Label>
                <Input
                  value={form.personalDetails.address.pincode}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      personalDetails: {
                        ...form.personalDetails,
                        address: {
                          ...form.personalDetails.address,
                          pincode: e.target.value,
                        },
                      },
                    })
                  }
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Emergency Contact</Label>
              <div className="grid grid-cols-2 gap-3">
                <Input
                  placeholder="Name"
                  value={form.personalDetails.emergencyContact.name}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      personalDetails: {
                        ...form.personalDetails,
                        emergencyContact: {
                          ...form.personalDetails.emergencyContact,
                          name: e.target.value,
                        },
                      },
                    })
                  }
                />
                <Input
                  placeholder="Phone"
                  value={form.personalDetails.emergencyContact.phone}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      personalDetails: {
                        ...form.personalDetails,
                        emergencyContact: {
                          ...form.personalDetails.emergencyContact,
                          phone: e.target.value,
                        },
                      },
                    })
                  }
                />
                <Input
                  placeholder="Relation"
                  value={form.personalDetails.emergencyContact.relation}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      personalDetails: {
                        ...form.personalDetails,
                        emergencyContact: {
                          ...form.personalDetails.emergencyContact,
                          relation: e.target.value,
                        },
                      },
                    })
                  }
                />
              </div>
            </div>
          </div>

          {/* Job Details */}
          <div className="space-y-3 border-b pb-3">
            <h3 className="font-medium">Job Details</h3>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Designation</Label>
                <Input
                  value={form.jobDetails.designation}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      jobDetails: {
                        ...form.jobDetails,
                        designation: e.target.value,
                      },
                    })
                  }
                />
              </div>
              <div>
                <Label>Joining Date</Label>
                <Input
                  type="date"
                  value={form.jobDetails.joiningDate}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      jobDetails: {
                        ...form.jobDetails,
                        joiningDate: e.target.value,
                      },
                    })
                  }
                />
              </div>
              <div>
                <Label>Employment Type</Label>
                <Select
                  value={form.jobDetails.employmentType}
                  onValueChange={(v) =>
                    setForm({
                      ...form,
                      jobDetails: { ...form.jobDetails, employmentType: v },
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Full-Time">Full-Time</SelectItem>
                    <SelectItem value="Part-Time">Part-Time</SelectItem>
                    <SelectItem value="Contract">Contract</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label>Salary Details</Label>
              <div className="grid grid-cols-2 gap-3 mt-2">
                <Input
                  placeholder="Basic"
                  type="number"
                  value={form.jobDetails.salary.basic}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      jobDetails: {
                        ...form.jobDetails,
                        salary: {
                          ...form.jobDetails.salary,
                          basic: e.target.value,
                        },
                      },
                    })
                  }
                />
                <Input
                  placeholder="HRA"
                  type="number"
                  value={form.jobDetails.salary.hra}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      jobDetails: {
                        ...form.jobDetails,
                        salary: {
                          ...form.jobDetails.salary,
                          hra: e.target.value,
                        },
                      },
                    })
                  }
                />
                <Input
                  placeholder="Allowances"
                  type="number"
                  value={form.jobDetails.salary.allowances}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      jobDetails: {
                        ...form.jobDetails,
                        salary: {
                          ...form.jobDetails.salary,
                          allowances: e.target.value,
                        },
                      },
                    })
                  }
                />
                <Input
                  placeholder="Total CTC"
                  type="number"
                  value={form.jobDetails.salary.totalCTC}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      jobDetails: {
                        ...form.jobDetails,
                        salary: {
                          ...form.jobDetails.salary,
                          totalCTC: e.target.value,
                        },
                      },
                    })
                  }
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Shift Start</Label>
                <Input
                  type="time"
                  value={form.jobDetails.shiftTiming.start}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      jobDetails: {
                        ...form.jobDetails,
                        shiftTiming: {
                          ...form.jobDetails.shiftTiming,
                          start: e.target.value,
                        },
                      },
                    })
                  }
                />
              </div>
              <div>
                <Label>Shift End</Label>
                <Input
                  type="time"
                  value={form.jobDetails.shiftTiming.end}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      jobDetails: {
                        ...form.jobDetails,
                        shiftTiming: {
                          ...form.jobDetails.shiftTiming,
                          end: e.target.value,
                        },
                      },
                    })
                  }
                />
              </div>
            </div>
            <div>
              <Label>Weekly Off</Label>
              <div className="flex flex-wrap gap-2 mt-1">
                {weekdays.map((day) => (
                  <Button
                    key={day}
                    type="button"
                    size="sm"
                    variant={
                      form.jobDetails.weeklyOff.includes(day)
                        ? "default"
                        : "outline"
                    }
                    onClick={() => handleWeeklyOffChange(day)}
                  >
                    {day.slice(0, 3)}
                  </Button>
                ))}
              </div>
            </div>
            <div>
              <Label>Probation Period (months)</Label>
              <Input
                type="number"
                value={form.jobDetails.probationPeriodMonths}
                onChange={(e) =>
                  setForm({
                    ...form,
                    jobDetails: {
                      ...form.jobDetails,
                      probationPeriodMonths: parseInt(e.target.value),
                    },
                  })
                }
              />
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={loading}>
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
