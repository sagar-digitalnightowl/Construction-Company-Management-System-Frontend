


import React, { useState, useEffect, useRef } from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { projectApi, authApi } from "@/api";
import { bookingApi } from "@/api/bookingApi";
import { PAYMENT_MODE } from "@/data/constants/booking";
import { toast } from "sonner";
import { useLeadList } from "@/hooks/useLeadList";
import { Trash2, Plus, Info, Calculator, CalendarClock, Loader2, Search, UserCheck } from "lucide-react"; 

// ✅ Currency formatter (INR without L/Cr)
const formatCurrency = (val) => {
  if (val === null || val === undefined || isNaN(val)) return "₹0";
  return "₹" + Number(val).toLocaleString("en-IN");
};

// --- AMOUNT CALCULATOR COMPONENT ---
function AmountCalculatorDialog({ open, onOpenChange, onApply, remainingAmount }) {
  const [totalAmount, setTotalAmount] = useState(remainingAmount ? remainingAmount.toString() : "");
  const [numberOfInstallments, setNumberOfInstallments] = useState("3");
  const [firstInstallmentPercentage, setFirstInstallmentPercentage] = useState("");
  
  const [startDate, setStartDate] = useState("");
  const [frequency, setFrequency] = useState("monthly");
  
  const [calculatedInstallments, setCalculatedInstallments] = useState([]);

  useEffect(() => {
    if (remainingAmount) {
      setTotalAmount(remainingAmount.toString());
    }
  }, [remainingAmount, open]);

  const calculateDueDate = (startStr, index, freq) => {
    if (!startStr) return "";
    const date = new Date(startStr);
    if (isNaN(date.getTime())) return "";

    let monthsToAdd = 0;
    switch (freq) {
      case "monthly": monthsToAdd = 1; break;
      case "quarterly": monthsToAdd = 3; break;
      case "biannually": monthsToAdd = 6; break;
      case "annually": monthsToAdd = 12; break;
      default: monthsToAdd = 1;
    }

    date.setMonth(date.getMonth() + (index * monthsToAdd));
    return date.toISOString().split("T")[0];
  };

  const calculateInstallments = () => {
    const amount = parseFloat(totalAmount);
    const numInst = parseInt(numberOfInstallments);
    
    if (!amount || amount <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }
    if (!numInst || numInst < 1) {
      toast.error("Number of installments must be at least 1");
      return;
    }
    if (numInst > 300) { 
      toast.error("Maximum 300 installments allowed (25 years limit)");
      return;
    }

    const firstPct = parseFloat(firstInstallmentPercentage) || 0;
    const installments = [];
    let remaining = amount;
    let rowIndexForDate = 0;

    if (firstPct > 0 && firstPct <= 100) {
      const firstAmount = Math.round((amount * firstPct) / 100);
      installments.push({
        description: `1st Installment (${firstPct}%)`,
        amount: firstAmount,
        dueDate: calculateDueDate(startDate, rowIndexForDate, frequency),
        isFirst: true,
        isManual: false,
      });
      remaining -= firstAmount;
      rowIndexForDate++;
    }

    const equalAmount = Math.round(remaining / (numInst - (firstPct > 0 ? 1 : 0)));
    let adjustedRemaining = remaining;

    for (let i = firstPct > 0 ? 1 : 0; i < numInst; i++) {
      const isLast = i === numInst - 1;
      const installmentAmount = isLast ? adjustedRemaining : equalAmount;
      adjustedRemaining -= installmentAmount;
      
      installments.push({
        description: `${i + 1}${getOrdinalSuffix(i + 1)} Installment${isLast ? " (Balance)" : ""}`,
        amount: installmentAmount,
        dueDate: calculateDueDate(startDate, rowIndexForDate, frequency),
        isManual: false,
      });
      rowIndexForDate++;
    }

    setCalculatedInstallments(installments);
  };

  const handleManualAmountChange = (index, newAmountStr) => {
    const newAmount = newAmountStr === "" ? 0 : parseFloat(newAmountStr) || 0;
    const amount = parseFloat(totalAmount);
    
    let updatedInstallments = [...calculatedInstallments];
    updatedInstallments[index].amount = newAmount;
    updatedInstallments[index].isManual = true;

    let manualSum = 0;
    let autoCount = 0;
    let lastAutoIndex = -1;

    updatedInstallments.forEach((inst, i) => {
      if (inst.isManual) {
        manualSum += inst.amount;
      } else {
        autoCount++;
        lastAutoIndex = i;
      }
    });

    if (manualSum > amount) {
      toast.warning("Manual amounts exceed the total amount!");
    }

    const remainingBalance = amount - manualSum;
    
    if (autoCount > 0) {
      const equalShare = Math.max(0, Math.round(remainingBalance / autoCount));
      let adjustedRemaining = Math.max(0, remainingBalance);

      updatedInstallments.forEach((inst, i) => {
        if (!inst.isManual) {
          const isLastAuto = i === lastAutoIndex;
          inst.amount = isLastAuto ? adjustedRemaining : equalShare;
          adjustedRemaining -= inst.amount;
        }
      });
    }

    setCalculatedInstallments(updatedInstallments);
  };

  const handleManualDateChange = (index, newDate) => {
    let updatedInstallments = [...calculatedInstallments];
    updatedInstallments[index].dueDate = newDate;
    setCalculatedInstallments(updatedInstallments);
  };

  const getOrdinalSuffix = (num) => {
    const j = num % 10;
    const k = num % 100;
    if (j === 1 && k !== 11) return "st";
    if (j === 2 && k !== 12) return "nd";
    if (j === 3 && k !== 13) return "rd";
    return "th";
  };

  const handleApply = () => {
    if (calculatedInstallments.length === 0) {
      toast.error("Please calculate installments first");
      return;
    }
    
    const formattedInstallments = calculatedInstallments.map((inst, index) => ({
      installmentNumber: index + 1,
      description: inst.description,
      amount: inst.amount.toString(),
      dueDate: inst.dueDate || "",
    }));
    
    onApply(formattedInstallments);
    onOpenChange(false);
    toast.success("Installment plan applied!");
  };

  const totalCalculated = calculatedInstallments.reduce((sum, inst) => sum + inst.amount, 0);
  const difference = parseFloat(totalAmount) - totalCalculated;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5" />
            Installment Calculator
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="bg-muted/50 p-4 rounded-lg space-y-4">
            <div>
              <Label className="font-semibold">Total Amount to Distribute (Base) *</Label>
              <Input
                type="number"
                placeholder="Enter total amount"
                value={totalAmount}
                onChange={(e) => setTotalAmount(e.target.value)}
                className="text-lg font-bold mt-1 bg-white"
              />
              <span className="text-xs text-muted-foreground mt-1 block">
                Remaining target: {formatCurrency(remainingAmount)}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="font-semibold">Number of Installments *</Label>
                <Input
                  type="number"
                  placeholder="e.g. 24"
                  value={numberOfInstallments}
                  onChange={(e) => setNumberOfInstallments(e.target.value)}
                  min="1"
                  max="300"
                  className="mt-1 bg-white"
                />
                <span className="text-[10px] text-muted-foreground mt-1 block">Max 300 (25 Years)</span>
              </div>

              <div>
                <Label className="font-semibold">1st Installment % (Optional)</Label>
                <div className="flex items-center gap-2 mt-1">
                  <Input
                    type="number"
                    placeholder="e.g. 30"
                    value={firstInstallmentPercentage}
                    onChange={(e) => setFirstInstallmentPercentage(e.target.value)}
                    min="0"
                    max="100"
                    className="bg-white"
                  />
                  <span className="text-muted-foreground">%</span>
                </div>
              </div>
            </div>

            <div className="border-t border-muted-foreground/20 pt-3">
              <Label className="font-semibold flex items-center gap-2 mb-2 text-primary">
                <CalendarClock className="h-4 w-4" />
                Auto-Calculate Due Dates
              </Label>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-xs">Start Date (Optional)</Label>
                  <Input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="mt-1 bg-white"
                  />
                </div>
                <div>
                  <Label className="text-xs">Frequency</Label>
                  <Select value={frequency} onValueChange={setFrequency}>
                    <SelectTrigger className="mt-1 bg-white">
                      <SelectValue placeholder="Select Frequency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="monthly">Monthly</SelectItem>
                      <SelectItem value="quarterly">Quarterly (3 Months)</SelectItem>
                      <SelectItem value="biannually">Bi-annually (6 Months)</SelectItem>
                      <SelectItem value="annually">Annually (12 Months)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <Button 
              onClick={calculateInstallments} 
              className="w-full"
              variant="secondary"
            >
              <Calculator className="h-4 w-4 mr-2" />
              Generate Initial Plan
            </Button>
          </div>

          {calculatedInstallments.length > 0 && (
            <div className="space-y-3">
              <div className="flex justify-between items-end">
                <div>
                  <h4 className="font-semibold text-sm flex items-center gap-2">
                    Adjust Plan
                    <span className="text-xs font-normal text-muted-foreground">
                      (Edit amounts or dates manually)
                    </span>
                  </h4>
                </div>
                <div className="text-xs text-right">
                  <span className="text-muted-foreground block mb-1">Total Allocated: </span>
                  <span className="font-bold text-base">{formatCurrency(totalCalculated)}</span>
                  {difference !== 0 && (
                    <span className={`ml-2 block ${difference > 0 ? "text-amber-600" : "text-red-600"}`}>
                      ({difference > 0 ? "-" : "+"}{formatCurrency(Math.abs(difference))})
                    </span>
                  )}
                </div>
              </div>

              <div className="max-h-60 overflow-y-auto space-y-3 pr-2">
                {calculatedInstallments.map((inst, index) => (
                  <div 
                    key={index} 
                    className={`p-3 bg-white border rounded-md transition-colors space-y-3 ${inst.isManual ? 'border-primary shadow-sm' : ''}`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1 mr-4">
                        <p className="text-sm font-medium">{inst.description}</p>
                        <p className="text-xs text-muted-foreground flex items-center gap-2">
                          Installment #{index + 1}
                          {inst.isManual && (
                            <span className="text-[10px] bg-primary/10 text-primary px-1.5 py-0.5 rounded font-semibold">
                              Locked
                            </span>
                          )}
                        </p>
                      </div>
                      
                      <div className="w-1/3 min-w-[120px]">
                        <Input
                          type="number"
                          value={inst.amount === 0 ? "" : inst.amount}
                          onChange={(e) => handleManualAmountChange(index, e.target.value)}
                          className={`text-right font-bold h-9 ${inst.isManual ? 'bg-primary/5' : ''}`}
                          placeholder="Amount"
                        />
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3 bg-muted/20 p-2 rounded border border-muted/50">
                      <Label className="text-xs text-muted-foreground w-16">Due Date</Label>
                      <Input 
                        type="date" 
                        value={inst.dueDate} 
                        onChange={(e) => handleManualDateChange(index, e.target.value)} 
                        className="h-8 text-xs flex-1 bg-white" 
                      />
                    </div>
                  </div>
                ))}
              </div>

              <Button onClick={handleApply} className="w-full">
                Apply This Plan
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

// --- MAIN PARENT COMPONENT ---
export function BookingFormDialog({
  open,
  onOpenChange,
  onSuccess,
  editBooking,
}) {
  const [projects, setProjects] = useState([]);
  const [towers, setTowers] = useState([]);
  const [floors, setFloors] = useState([]);
  const [flats, setFlats] = useState([]);
  const [selectedFlat, setSelectedFlat] = useState(null);
  
  const [loading, setLoading] = useState(false);
  const [fetchingDetails, setFetchingDetails] = useState(false);
  const [searchingCustomer, setSearchingCustomer] = useState(false);

  const [showExtraDetails, setShowExtraDetails] = useState(false);

  const [teamManagers, setTeamManagers] = useState([]);
  const [calculatorOpen, setCalculatorOpen] = useState(false);

  const [projectsLoaded, setProjectsLoaded] = useState(false);
  const editInitialized = useRef(false);

  const initialForm = {
    clientId: "", 
    projectId: "",
    towerName: "",
    floor: "",
    flatId: "",

    bookingAmount: "", 
    paymentMode: "",
    agreementDate: "",
    nomineeName: "",
    nomineeRelation: "",

    keyNumber: "",
    businessCode: "",
    businessName: "",
    teamManager: "",
    remarks: "",
    transactionId: "",

    leadId: "",
    clientName: "",
    clientEmail: "",
    clientPhone: "",
    clientPassword: "",

    dateOfBirth: "",
    gender: "",
    bloodGroup: "",
    maritalStatus: "",
    aadharNumber: "",
    panNumber: "",
    fatherName: "",
    motherName: "",
    emergencyContactName: "",
    emergencyContactPhone: "",
    emergencyContactRelation: "",
    addressLine1: "",
    city: "",
    state: "",
    country: "India",
    pincode: "",

    bankName: "",
    accountNumber: "",
    ifscCode: "",
    upiId: "",
    accountHolderName: "",
    accountType: "",
    branchName: "",

    useCustomPlan: false,
    installments: [],
  };

  const [form, setForm] = useState(initialForm);
  const isEdit = Boolean(editBooking);

  // ---- GST Helper Functions ----
  const getGSTPercentage = () => {
    if (!selectedFlat) return 0;
    const flatPrice = selectedFlat.price || 0;
    return flatPrice >= 4500000 ? 5 : 1;
  };

  const getFlatBasePrice = () => selectedFlat?.price || 0;
  const getTotalFlatGST = () => Math.round((getFlatBasePrice() * getGSTPercentage()) / 100);
  const getGrandTotal = () => getFlatBasePrice() + getTotalFlatGST();

  const getBookingBase = () => parseFloat(form.bookingAmount) || 0;
  const getBookingGST = () => Math.round((getBookingBase() * getGSTPercentage()) / 100);
  const getTotalPayableToday = () => getBookingBase() + getBookingGST();

  const getInstallmentTargetBase = () => getFlatBasePrice() - getBookingBase();
  const getInstallmentTargetGST = () => getTotalFlatGST() - getBookingGST();
  const getInstallmentTargetTotal = () => getInstallmentTargetBase() + getInstallmentTargetGST();

  // ---- Edit Initialization ----
  useEffect(() => {
    const fetchFullBookingDetails = async () => {
      if (!editBooking || !open) return;
      if (!projectsLoaded) return;
      if (editInitialized.current) return;

      try {
        editInitialized.current = true;
        setFetchingDetails(true);
        
        const res = await bookingApi.getBookingById(editBooking._id);
        const fullBooking = res.data?.data?.booking;

        if (!fullBooking) {
          toast.error("Could not fetch full booking details");
          return;
        }

        const projectId = fullBooking.projectId?._id || fullBooking.projectId;
        const towerName = fullBooking.flatSnapshot?.towerName || "";
        const floor = fullBooking.flatSnapshot?.floor || "";
        const flatId = fullBooking.flatId;

        const project = projects.find((p) => p._id === projectId);
        if (project?.towers) setTowers(project.towers);

        const tower = project?.towers?.find((t) => t.towerName === towerName);
        if (tower?.floors) setFloors(tower.floors);

        const floorObj = tower?.floors?.find((f) => String(f.floorNumber) === String(floor));
        if (floorObj?.flats) setFlats(floorObj.flats);

        const flatObj = floorObj?.flats?.find((f) => f._id === flatId);
        if (flatObj) setSelectedFlat(flatObj);

        const pDetails = fullBooking.personalDetails || {};
        const bDetails = fullBooking.bankDetails || {};
        const client = fullBooking.clientId || {};
        const permAddress = pDetails.permanentAddress || pDetails.address?.permanentAddress || {}; 
        const emergency = pDetails.emergencyContact || {};
        const nominee = fullBooking.nominee || {};

        setForm({
          ...initialForm,
          clientId: client._id || fullBooking.clientId || "", 
          projectId: projectId || "",
          towerName: towerName,
          floor: floor.toString(),
          flatId: flatId || "",
          
          bookingAmount: fullBooking.bookingBaseAmount ? fullBooking.bookingBaseAmount.toString() : (fullBooking.bookingAmount ? fullBooking.bookingAmount.toString() : ""),
          paymentMode: fullBooking.paymentMode || "",
          
          agreementDate: fullBooking.agreementDate 
            ? fullBooking.agreementDate.slice(0, 10) 
            : fullBooking.agreementDocument?.signedAt 
              ? fullBooking.agreementDocument.signedAt.slice(0, 10) 
              : "",
              
          nomineeName: nominee.name || fullBooking.nomineeName || "",
          nomineeRelation: nominee.relation || fullBooking.nomineeRelation || "",
          keyNumber: fullBooking.keyNumber || "",
          businessCode: fullBooking.businessCode || "",
          businessName: fullBooking.businessName || "",
          teamManager: fullBooking.teamManager?._id || fullBooking.teamManager || "",
          remarks: fullBooking.remarks || "",
          transactionId: fullBooking.transactionId || "",
          
          leadId: fullBooking.leadId?._id || fullBooking.leadId || "",

          clientName: client.name || fullBooking.clientName || "",
          clientEmail: client.email || fullBooking.clientEmail || "",
          clientPhone: client.phone || fullBooking.clientPhone || "",
          clientPassword: "",

          dateOfBirth: pDetails.dateOfBirth ? pDetails.dateOfBirth.slice(0, 10) : "",
          gender: pDetails.gender || "",
          bloodGroup: pDetails.bloodGroup || "",
          maritalStatus: pDetails.maritalStatus || "",
          aadharNumber: pDetails.aadharNumber || "",
          panNumber: pDetails.panNumber || "",
          fatherName: pDetails.fatherName || "",
          motherName: pDetails.motherName || "",
          emergencyContactName: emergency.name || "",
          emergencyContactPhone: emergency.phone || "",
          emergencyContactRelation: emergency.relation || "",
          
          addressLine1: typeof permAddress === "string" ? permAddress : (permAddress.line1 || permAddress.addressLine1 || ""),
          city: permAddress.city || "",
          state: permAddress.state || "",
          country: permAddress.country || "India",
          pincode: permAddress.pincode || "",

          bankName: bDetails.bankName || "",
          accountNumber: bDetails.accountNumber || "",
          ifscCode: bDetails.ifscCode || "",
          upiId: bDetails.upiId || "",
          accountHolderName: bDetails.accountHolderName || "",
          accountType: bDetails.accountType || "",
          branchName: bDetails.branchName || "",

          useCustomPlan: Boolean(fullBooking.installmentPlan?.length),
          installments: fullBooking.installmentPlan?.length
            ? fullBooking.installmentPlan.map((inst) => ({
                installmentNumber: inst.installmentNumber,
                description: inst.description,
                amount: inst.baseAmount || inst.amount,
                dueDate: inst.dueDate ? inst.dueDate.slice(0, 10) : "",
              }))
            : [],
        });
      } catch (error) {
        console.error("Error fetching full booking details:", error);
        toast.error("Failed to load complete booking details.");
      } finally {
        setFetchingDetails(false);
      }
    };

    if (open) {
      if (isEdit) {
        fetchFullBookingDetails();
      }
    } else {
      resetForm();
    }
  }, [editBooking, open, projectsLoaded, projects, isEdit]);

  const resetForm = () => {
    setForm(initialForm);
    setShowExtraDetails(false);
    setTowers([]);
    setFloors([]);
    setFlats([]);
    setSelectedFlat(null);
    setProjectsLoaded(false);
    editInitialized.current = false;
  };

  const unlinkCustomer = () => {
    setForm((prev) => ({
      ...prev,
      clientId: "",
      clientName: "",
      clientEmail: "",
      clientPhone: "",
      clientPassword: "",
      dateOfBirth: "",
      gender: "",
      bloodGroup: "",
      maritalStatus: "",
      aadharNumber: "",
      panNumber: "",
      fatherName: "",
      motherName: "",
      emergencyContactName: "",
      emergencyContactPhone: "",
      emergencyContactRelation: "",
      addressLine1: "",
      city: "",
      state: "",
      country: "India",
      pincode: "",
      bankName: "",
      accountNumber: "",
      ifscCode: "",
      upiId: "",
      accountHolderName: "",
      accountType: "",
      branchName: ""
    }));
    setShowExtraDetails(false);
  };

  const { leads } = useLeadList();

  const fetchProjects = async () => {
    try {
      const res = await projectApi.getAll();
      if (res.data.success) {
        setProjects(res.data.data?.projects || []);
        setProjectsLoaded(true);
      }
    } catch (err) {
      toast.error("Failed to load projects");
    }
  };

  const fetchTeamManagers = async () => {
    try {
      const res = await authApi.getUsers();
      if (res.data.success) {
        const managers = res.data.data?.users?.filter(
          (user) =>
            user.role?.includes("manager") ||
            user.role === "manager" ||
            user.role === "admin"
        );
        setTeamManagers(managers || []);
      }
    } catch (err) {
      console.error("Failed to fetch team managers", err);
    }
  };

  useEffect(() => {
    if (open) {
      fetchProjects();
      fetchTeamManagers();
    } else {
      resetForm();
    }
  }, [open]);

  useEffect(() => {
    if (form.projectId) {
      const project = projects.find((p) => p._id === form.projectId);
      if (project?.towers?.length) {
        setTowers(project.towers);
        const towerExists = form.towerName && project.towers.some((t) => t.towerName === form.towerName);
        if (!towerExists) {
          setForm((prev) => ({ ...prev, towerName: "", floor: "", flatId: "" }));
          setFloors([]);
          setFlats([]);
          setSelectedFlat(null);
        }
      } else {
        setTowers([]);
        setFloors([]);
        setFlats([]);
        setSelectedFlat(null);
      }
    } else {
      setTowers([]);
      setFloors([]);
      setFlats([]);
      setSelectedFlat(null);
    }
  }, [form.projectId, projects]);

  useEffect(() => {
    if (form.towerName) {
      const tower = towers.find((t) => t.towerName === form.towerName);
      if (tower) {
        setFloors(tower.floors || []);
        const floorExists = form.floor && tower.floors.some((f) => String(f.floorNumber) === String(form.floor));
        if (!floorExists) {
          setForm((prev) => ({ ...prev, floor: "", flatId: "" }));
          setFlats([]);
          setSelectedFlat(null);
        }
      } else {
        setFloors([]);
        setFlats([]);
        setSelectedFlat(null);
      }
    } else {
      setFloors([]);
      setFlats([]);
      setSelectedFlat(null);
    }
  }, [form.towerName, towers]);

  useEffect(() => {
    if (form.floor !== "" && form.floor !== undefined) {
      const floor = floors.find((f) => String(f.floorNumber) === String(form.floor));
      if (floor) {
        setFlats(floor.flats || []);
        const flatExists = form.flatId && floor.flats.some((f) => f._id === form.flatId);
        if (!flatExists) {
          setForm((prev) => ({ ...prev, flatId: "" }));
          setSelectedFlat(null);
        }
      } else {
        setFlats([]);
        setSelectedFlat(null);
      }
    } else {
      setFlats([]);
      setSelectedFlat(null);
    }
  }, [form.floor, floors]);

  useEffect(() => {
    if (form.flatId && flats.length) {
      const flat = flats.find((f) => f._id === form.flatId);
      setSelectedFlat(flat || null);
    } else {
      setSelectedFlat(null);
    }
  }, [form.flatId, flats]);

  const updateForm = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const addInstallment = () => {
    const newNumber = form.installments.length + 1;
    const newInstallment = {
      installmentNumber: newNumber,
      description: "",
      amount: "",
      dueDate: "",
    };
    setForm((prev) => ({
      ...prev,
      installments: [...prev.installments, newInstallment],
    }));
  };

  const removeInstallment = (index) => {
    if (form.installments.length <= 1) {
      toast.warning("At least one installment is required");
      return;
    }
    const updated = form.installments.filter((_, i) => i !== index);
    const renumbered = updated.map((inst, idx) => ({ ...inst, installmentNumber: idx + 1 }));
    setForm((prev) => ({ ...prev, installments: renumbered }));
  };

  const updateInstallment = (index, field, value) => {
    const updated = [...form.installments];
    updated[index][field] = value;
    setForm((prev) => ({ ...prev, installments: updated }));
  };

  const getTotalInstallmentAmount = () => {
    return form.installments.reduce((sum, inst) => sum + (parseFloat(inst.amount) || 0), 0);
  };

  const handleCalculatorApply = (calculatedInstallments) => {
    setForm((prev) => ({
      ...prev,
      installments: calculatedInstallments,
      useCustomPlan: true,
    }));
  };

  const searchExistingCustomer = async (searchTerm) => {
    if (!searchTerm || searchTerm.length < 5) return;
    try {
      setSearchingCustomer(true);
      const res = await bookingApi.searchCustomer(searchTerm);
      
      if (res.data?.success && res.data?.data?.customer) {
        const customer = res.data.data.customer;
        const pDetails = customer.personalDetails || {};
        const bDetails = customer.bankDetails || {};
        const permAddress = pDetails.address?.permanentAddress || pDetails.permanentAddress || {};
        const emergency = pDetails.emergencyContact || {};

        setForm((prev) => ({
          ...prev,
          clientId: customer._id, 
          clientName: customer.name || prev.clientName,
          clientEmail: customer.email || prev.clientEmail,
          clientPhone: customer.phone || prev.clientPhone,

          dateOfBirth: pDetails.dateOfBirth ? pDetails.dateOfBirth.slice(0, 10) : prev.dateOfBirth,
          gender: pDetails.gender || prev.gender,
          bloodGroup: pDetails.bloodGroup || prev.bloodGroup,
          maritalStatus: pDetails.maritalStatus || prev.maritalStatus,
          aadharNumber: pDetails.aadharNumber || prev.aadharNumber,
          panNumber: pDetails.panNumber || prev.panNumber,
          fatherName: pDetails.fatherName || prev.fatherName,
          motherName: pDetails.motherName || prev.motherName,

          emergencyContactName: emergency.name || prev.emergencyContactName,
          emergencyContactPhone: emergency.phone || prev.emergencyContactPhone,
          emergencyContactRelation: emergency.relation || prev.emergencyContactRelation,

          addressLine1: typeof permAddress === "string" ? permAddress : (permAddress.line1 || permAddress.addressLine1 || prev.addressLine1),
          city: permAddress.city || prev.city,
          state: permAddress.state || prev.state,
          country: permAddress.country || prev.country,
          pincode: permAddress.pincode || prev.pincode,

          bankName: bDetails.bankName || prev.bankName,
          accountNumber: bDetails.accountNumber || prev.accountNumber,
          ifscCode: bDetails.ifscCode || prev.ifscCode,
          upiId: bDetails.upiId || prev.upiId,
          accountHolderName: bDetails.accountHolderName || prev.accountHolderName,
          accountType: bDetails.accountType || prev.accountType,
          branchName: bDetails.branchName || prev.branchName,
        }));

        setShowExtraDetails(false); 
        toast.success(`Welcome back, ${customer.name}! Details auto-filled and linked.`);
      }
    } catch (err) {
      console.log("Customer not found - assuming this is a new booking.");
    } finally {
      setSearchingCustomer(false);
    }
  };

  useEffect(() => {
    if (!isEdit && !form.clientId && form.clientPhone && form.clientPhone.length === 10) {
      searchExistingCustomer(form.clientPhone);
    }
  }, [form.clientPhone, isEdit]);

  const buildPersonalDetails = () => {
    const pDetails = {};
    if (form.dateOfBirth) pDetails.dateOfBirth = form.dateOfBirth;
    if (form.gender) pDetails.gender = form.gender;
    if (form.bloodGroup) pDetails.bloodGroup = form.bloodGroup;
    if (form.maritalStatus) pDetails.maritalStatus = form.maritalStatus;
    if (form.aadharNumber) pDetails.aadharNumber = form.aadharNumber;
    if (form.panNumber) pDetails.panNumber = form.panNumber;
    if (form.fatherName) pDetails.fatherName = form.fatherName;
    if (form.motherName) pDetails.motherName = form.motherName;
    if (form.emergencyContactName) pDetails.emergencyContactName = form.emergencyContactName;
    if (form.emergencyContactPhone) pDetails.emergencyContactPhone = form.emergencyContactPhone;
    if (form.emergencyContactRelation) pDetails.emergencyContactRelation = form.emergencyContactRelation;

    if (form.addressLine1 || form.city || form.state || form.pincode) {
      pDetails.permanentAddress = {
        line1: form.addressLine1 || undefined,
        city: form.city || undefined,
        state: form.state || undefined,
        country: form.country || "India",
        pincode: form.pincode || undefined,
      };
    }
    return pDetails;
  };

  const buildBankDetails = () => {
    const bDetails = {};
    if (form.bankName) bDetails.bankName = form.bankName;
    if (form.accountNumber) bDetails.accountNumber = form.accountNumber;
    if (form.ifscCode) bDetails.ifscCode = form.ifscCode;
    if (form.upiId) bDetails.upiId = form.upiId;
    if (form.accountHolderName) bDetails.accountHolderName = form.accountHolderName;
    if (form.accountType) bDetails.accountType = form.accountType;
    if (form.branchName) bDetails.branchName = form.branchName;
    return bDetails;
  };

  const handleSubmit = async () => {
    if (!form.projectId || !form.towerName || !form.floor || !form.flatId) {
      toast.error("Project, Tower, Floor, and Flat are required");
      return;
    }

    if (form.useCustomPlan) {
      if (form.installments.length === 0) {
        toast.error("Please add at least one installment");
        return;
      }
      const invalid = form.installments.some((inst) => !inst.description || !inst.amount);
      if (invalid) {
        toast.error("All installment fields (description, amount) are required");
        return;
      }
    }

    setLoading(true);

    const payload = {
      agreementDate: form.agreementDate || undefined,
      keyNumber: form.keyNumber || undefined,
      businessCode: form.businessCode || undefined,
      businessName: form.businessName || undefined,
      teamManager: form.teamManager || undefined,
      remarks: form.remarks || undefined,
    };

    if (!isEdit) {
      payload.projectId = form.projectId;
      payload.flatId = form.flatId;
      payload.bookingAmount = Number(form.bookingAmount); 
      payload.paymentMode = form.paymentMode || undefined;
      payload.transactionId = form.transactionId || undefined;
      payload.nomineeName = form.nomineeName || undefined;
      payload.nomineeRelation = form.nomineeRelation || undefined;
    }

    if (form.useCustomPlan && form.installments.length > 0) {
      payload.installmentPlan = {
        installments: form.installments.map((inst) => ({
          installmentNumber: inst.installmentNumber,
          description: inst.description,
          amount: Number(inst.amount),
          dueDate: inst.dueDate || undefined,
        }))
      };
    }

    // 🔥 SMART CLIENT LOGIC (Shared for both flows) 🔥
    if (isEdit) {
      payload.clientName = form.clientName;
      if (form.clientEmail) payload.clientEmail = form.clientEmail;
      if (form.clientPhone) payload.clientPhone = form.clientPhone;
      
      const pd = buildPersonalDetails();
      if (Object.keys(pd).length) payload.personalDetails = pd;
      
      const bd = buildBankDetails();
      if (Object.keys(bd).length) payload.bankDetails = bd;
    } else {
      if (form.leadId) {
        payload.leadId = form.leadId;
      } else if (form.clientId) {
        payload.clientId = form.clientId; 
      } else {
        payload.clientName = form.clientName;
        if (form.clientEmail) payload.clientEmail = form.clientEmail;
        payload.clientPhone = form.clientPhone;
        if (form.clientPassword) payload.clientPassword = form.clientPassword;

        const pd = buildPersonalDetails();
        if (Object.keys(pd).length) payload.personalDetails = pd;

        const bd = buildBankDetails();
        if (Object.keys(bd).length) payload.bankDetails = bd;
      }
    }

    try {
      let res;
      if (isEdit) {
        res = await bookingApi.updateBooking(editBooking._id, payload);
      } else {
        res = await bookingApi.createBooking(payload);
      }
      toast.success(isEdit ? "Booking updated" : "Booking created");
      onSuccess?.(res.data?.data);
      onOpenChange(false);
      resetForm();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to save booking");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {isEdit ? "Edit Booking" : "Create New Booking"}
            {fetchingDetails && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />}
          </DialogTitle>
        </DialogHeader>
        
        <div className={`space-y-6 p-1 transition-opacity ${fetchingDetails ? "opacity-50 pointer-events-none" : "opacity-100"}`}>
          {/* Flat Selection */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Label>Project *</Label>
              <Select value={form.projectId} disabled={isEdit} onValueChange={(v) => { updateForm("projectId", v); updateForm("towerName", ""); updateForm("floor", ""); updateForm("flatId", ""); }}>
                <SelectTrigger><SelectValue placeholder="Select project" /></SelectTrigger>
                <SelectContent>
                  {projects.map((p) => (<SelectItem key={p._id} value={p._id}>{p.name}</SelectItem>))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Tower *</Label>
              <Select value={form.towerName} disabled={!form.projectId || towers.length === 0 || isEdit} onValueChange={(v) => { updateForm("towerName", v); updateForm("floor", ""); updateForm("flatId", ""); }}>
                <SelectTrigger><SelectValue placeholder="Select tower" /></SelectTrigger>
                <SelectContent>
                  {towers.map((t) => (<SelectItem key={t.towerName} value={t.towerName}>{t.towerName}</SelectItem>))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Floor *</Label>
              <Select value={form.floor.toString()} disabled={!form.towerName || floors.length === 0 || isEdit} onValueChange={(v) => { updateForm("floor", v); updateForm("flatId", ""); }}>
                <SelectTrigger><SelectValue placeholder="Select floor" /></SelectTrigger>
                <SelectContent>
                  {floors.map((f) => (<SelectItem key={f.floorNumber} value={f.floorNumber.toString()}>Floor {f.floorNumber}</SelectItem>))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Flat *</Label>
              <Select value={form.flatId} disabled={!form.floor || flats.length === 0 || isEdit} onValueChange={(v) => updateForm("flatId", v)}>
                <SelectTrigger><SelectValue placeholder="Select flat" /></SelectTrigger>
                <SelectContent>
                  {flats.map((f) => (
                    <SelectItem key={f._id} value={f._id} disabled={f.status !== "available" && !isEdit}>
                      {f.flatNumber} - {f.bedrooms} BHK - {formatCurrency(f.price || 0)} - ({f.status})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Flat & GST Summary */}
          {selectedFlat && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 p-4 bg-primary/5 border border-primary/20 rounded-md">
              <div>
                <Label className="text-xs text-muted-foreground">Flat Price</Label>
                <p className="text-sm font-semibold">{formatCurrency(getFlatBasePrice())}</p>
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">GST Slab</Label>
                <p className="text-sm font-semibold">{getGSTPercentage()}%</p>
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">Total GST</Label>
                <p className="text-sm font-semibold">{formatCurrency(getTotalFlatGST())}</p>
              </div>
              <div>
                <Label className="text-xs text-primary font-bold">Total Flat Value</Label>
                <p className="text-base font-bold text-primary">{formatCurrency(getGrandTotal())}</p>
              </div>
            </div>
          )}

          {/* Lead Selection */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Lead (Optional)</Label>
              <Select value={form.leadId || "none"} disabled={isEdit} onValueChange={(v) => updateForm("leadId", v === "none" ? "" : v)}>
                <SelectTrigger><SelectValue placeholder="Select lead" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None (Create new buyer)</SelectItem>
                  {leads?.map((lead) => (
                    <SelectItem key={lead._id} value={lead._id}>
                      {lead.clientName} {lead.clientPhone ? `(${lead.clientPhone})` : ""}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Booking & Payment Details */}
          <div className="border-t pt-4">
            <h3 className="font-semibold text-lg flex items-center gap-2">
              Booking Details
              <Info className="h-4 w-4 text-muted-foreground" />
            </h3>
            <p className="text-xs text-muted-foreground mb-4">
              Enter the Booking Amount (Base). GST will be automatically calculated based on the flat's GST slab.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Payment Calculator Box */}
            <div className="md:col-span-2">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-4 bg-muted/40 rounded-lg border">
                <div>
                  <Label className="font-semibold text-foreground">Booking Amount (Base) *</Label>
                  <Input
                    type="number"
                    value={form.bookingAmount}
                    onChange={(e) => updateForm("bookingAmount", e.target.value)}
                    placeholder="e.g. 150000"
                    className="font-bold text-lg mt-1"
                    disabled={isEdit} 
                  />
                  <span className="text-xs text-muted-foreground block mt-1">Amount excluding GST</span>
                </div>

                <div className="flex flex-col justify-center">
                  <Label className="text-sm text-muted-foreground mb-1">
                    + Auto-Calculated GST ({getGSTPercentage()}%)
                  </Label>
                  <div className="text-xl font-bold text-amber-600">
                    {formatCurrency(getBookingGST())}
                  </div>
                </div>

                <div className="flex flex-col justify-center">
                  <Label className="text-sm text-muted-foreground mb-1">
                    = Client Pays Today
                  </Label>
                  <div className="text-2xl font-black text-green-600">
                    {formatCurrency(getTotalPayableToday())}
                  </div>
                </div>
              </div>
            </div>

            <div>
              <Label>Payment Mode</Label>
              <Select value={form.paymentMode} disabled={isEdit} onValueChange={(v) => updateForm("paymentMode", v)}>
                <SelectTrigger><SelectValue placeholder="Select payment mode" /></SelectTrigger>
                <SelectContent>
                  {Object.values(PAYMENT_MODE || {
                    CASH: 'Cash', CHEQUE: 'Cheque', BANK_TRANSFER: 'Bank Transfer', 
                    CARD: 'Card', NEFT: 'NEFT', RTGS: 'RTGS', TRF: 'TRF', L_NEFT: 'L-NEFT'
                  }).map((mode) => (
                    <SelectItem key={mode} value={mode}>{mode}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Transaction ID</Label>
              <Input placeholder="Optional" value={form.transactionId} disabled={isEdit} onChange={(e) => updateForm("transactionId", e.target.value)} />
            </div>
            <div>
              <Label>Agreement Date</Label>
              <Input
                type="date"
                value={form.agreementDate}
                onChange={(e) => updateForm("agreementDate", e.target.value)}
                /* Editable allowed by backend */
              />
            </div>
            <div>
              <Label>Nominee Name</Label>
              <Input
                placeholder="Optional"
                value={form.nomineeName}
                onChange={(e) => updateForm("nomineeName", e.target.value)}
                disabled={isEdit}
              />
            </div>
            <div>
              <Label>Nominee Relation</Label>
              <Input
                placeholder="Optional"
                value={form.nomineeRelation}
                onChange={(e) => updateForm("nomineeRelation", e.target.value)}
                disabled={isEdit}
              />
            </div>
            <div>
              <Label>Key Number (KYC ID)</Label>
              <Input placeholder="Optional" value={form.keyNumber} onChange={(e) => updateForm("keyNumber", e.target.value)} />
            </div>
            <div>
              <Label>Business Code</Label>
              <Input placeholder="Optional" value={form.businessCode} onChange={(e) => updateForm("businessCode", e.target.value)} />
            </div>
            <div>
              <Label>Business Name</Label>
              <Input placeholder="Optional" value={form.businessName} onChange={(e) => updateForm("businessName", e.target.value)} />
            </div>
            <div>
              <Label>Team Manager</Label>
              <Select value={form.teamManager} onValueChange={(v) => updateForm("teamManager", v)}>
                <SelectTrigger><SelectValue placeholder="Select manager" /></SelectTrigger>
                <SelectContent>
                  {teamManagers.map((mgr) => (
                    <SelectItem key={mgr._id} value={mgr._id}>
                      {mgr.name || mgr.email} ({mgr.role})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="md:col-span-2">
              <Label>Remarks</Label>
              <Input placeholder="Optional" value={form.remarks} onChange={(e) => updateForm("remarks", e.target.value)} />
            </div>
          </div>

          {/* Installment Plan Section */}
          <div className="border-t pt-4">
            <div className="flex items-center gap-3 mb-2 flex-wrap">
              <h3 className="font-semibold text-lg">Installment Plan</h3>
              <label className="flex items-center gap-2 text-sm cursor-pointer ml-4 p-2 bg-muted/50 rounded-md">
                <input
                  type="checkbox"
                  checked={form.useCustomPlan}
                  onChange={(e) => {
                    const checked = e.target.checked;
                    if (checked && form.installments.length === 0) {
                      addInstallment();
                    }
                    updateForm("useCustomPlan", checked);
                  }}
                  className="w-4 h-4"
                />
                <span className="font-medium">Use Custom Plan</span>
              </label>
              <span className="text-xs text-muted-foreground">(If unchecked, system creates equal installments)</span>
              {form.useCustomPlan && selectedFlat && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setCalculatorOpen(true)}
                  className="ml-auto gap-2"
                >
                  <Calculator className="h-4 w-4" />
                  Amount Calculator
                </Button>
              )}
            </div>

            {form.useCustomPlan && (
              <div className="space-y-4">
                {/* Visual Target Tracker */}
                {selectedFlat && (
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-muted/30 p-4 border rounded-md">
                    <div className="space-y-1 w-full md:w-auto text-sm">
                      <div className="flex justify-between md:justify-start gap-4 text-muted-foreground">
                        <span>Remaining Target:</span> 
                        <span className="font-mono">{formatCurrency(getInstallmentTargetBase())}</span>
                      </div>
                      <div className="flex justify-between md:justify-start gap-4 text-muted-foreground">
                        <span>Remaining GST:</span> 
                        <span className="font-mono">{formatCurrency(getInstallmentTargetGST())}</span>
                      </div>
                      <div className="flex justify-between md:justify-start gap-4 font-bold text-foreground">
                        <span>Total (Payable):</span> 
                        <span className="font-mono text-primary">{formatCurrency(getInstallmentTargetTotal())}</span>
                      </div>
                    </div>
                    
                    <div className="flex-1 flex justify-end">
                      {(() => {
                        const diff = getInstallmentTargetBase() - getTotalInstallmentAmount();
                        return (
                          <div className={`px-4 py-2 rounded-md font-bold text-sm ${diff === 0 ? "bg-green-100 text-green-700" : diff > 0 ? "bg-amber-100 text-amber-700" : "bg-red-100 text-red-700"}`}>
                            {diff === 0 
                              ? "✅ Amounts matched perfectly!" 
                              : diff > 0 
                                ? `⚠️ Add ${formatCurrency(diff)} more.` 
                                : `⚠️ Amount exceeds by ${formatCurrency(Math.abs(diff))}.`}
                          </div>
                        );
                      })()}
                    </div>

                    <Button type="button" variant="default" size="sm" onClick={addInstallment} className="gap-1">
                      <Plus className="h-4 w-4" /> Add Row
                    </Button>
                  </div>
                )}

                {/* Installment Rows */}
                <div className="space-y-3 max-h-[350px] overflow-y-auto pr-2">
                  {form.installments.map((inst, index) => {
                    const instBase = parseFloat(inst.amount) || 0;
                    const instGST = Math.round((instBase * getGSTPercentage()) / 100);
                    const instTotal = instBase + instGST;

                    return (
                      <div key={index} className="grid grid-cols-12 gap-3 items-start p-3 bg-white border shadow-sm rounded-md relative">
                        <div className="col-span-12 md:col-span-1 flex items-center justify-center font-bold text-muted-foreground h-10 bg-muted/40 rounded">
                          #{inst.installmentNumber}
                        </div>
                        
                        <div className="col-span-12 md:col-span-3">
                          <Label className="text-xs mb-1 block">Description</Label>
                          <Input placeholder="e.g. 1st Installment" value={inst.description} onChange={(e) => updateInstallment(index, "description", e.target.value)} />
                        </div>
                        
                        <div className="col-span-12 md:col-span-4 bg-primary/5 p-2 rounded border border-primary/10">
                          <Label className="text-xs font-semibold text-primary mb-1 block">Amount (Base) *</Label>
                          <Input type="number" placeholder="Enter Amount" value={inst.amount} onChange={(e) => updateInstallment(index, "amount", e.target.value)} className="font-bold bg-white" />
                          <div className="text-[11px] text-muted-foreground mt-2 flex justify-between font-mono">
                            <span>+ GST: {formatCurrency(instGST)}</span>
                            <span className="font-bold text-foreground">= Total: {formatCurrency(instTotal)}</span>
                          </div>
                        </div>

                        <div className="col-span-12 md:col-span-3">
                          <Label className="text-xs mb-1 block">Due Date</Label>
                          <Input type="date" value={inst.dueDate} onChange={(e) => updateInstallment(index, "dueDate", e.target.value)} />
                        </div>
                        
                        <div className="col-span-12 md:col-span-1 flex justify-end items-center h-full">
                          <Button type="button" variant="ghost" onClick={() => removeInstallment(index)} className="text-destructive hover:bg-destructive/10" disabled={form.installments.length <= 1}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* 🔥 DYNAMIC UI: Edit / New Client Fields 🔥 */}
          {(!form.leadId || isEdit) && (
            <div className="bg-muted/10 border rounded-lg p-4 mt-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold text-lg">Buyer Details</h3>
                
                {/* Search Bar visible only if not editing and no client linked */}
                {!isEdit && !form.clientId && (
                  <div className="flex gap-2">
                    <Input 
                      placeholder="Phone or Email to auto-fill" 
                      className="h-8 w-56 text-xs bg-white"
                      value={form.clientPhone || form.clientEmail || ""}
                      onChange={(e) => {
                        const val = e.target.value;
                        if (val.includes('@')) updateForm("clientEmail", val);
                        else updateForm("clientPhone", val);
                      }}
                    />
                    <Button 
                      type="button" 
                      variant="outline" 
                      size="sm" 
                      onClick={() => searchExistingCustomer(form.clientPhone || form.clientEmail)}
                      disabled={searchingCustomer || (!form.clientPhone && !form.clientEmail)}
                      className="border-primary text-primary hover:bg-primary hover:text-white h-8"
                    >
                      {searchingCustomer ? <Loader2 className="h-3 w-3 animate-spin mr-1"/> : <Search className="h-3 w-3 mr-1"/>}
                      Search
                    </Button>
                  </div>
                )}
              </div>

              {form.clientId ? (
                <div className="bg-green-50/60 border border-green-200 p-4 rounded-md flex items-center justify-between shadow-sm">
                  <div>
                    <p className="font-semibold text-green-800 flex items-center gap-2">
                      <UserCheck className="h-4 w-4" />
                      Customer Linked Successfully
                    </p>
                    <p className="text-sm text-green-700 mt-1">
                      <strong>{form.clientName}</strong> | {form.clientPhone} {form.clientEmail ? `| ${form.clientEmail}` : ""}
                    </p>
                    <p className="text-xs text-green-600 mt-0.5">
                      All personal and bank details are securely attached to this booking.
                    </p>
                  </div>
                  <div className="flex flex-col gap-2">
                    <Button 
                      type="button"
                      variant="outline" 
                      size="sm" 
                      className="bg-white border-green-300 text-green-800 hover:bg-green-100 h-8"
                      onClick={() => setShowExtraDetails(!showExtraDetails)}
                    >
                      {showExtraDetails ? "Hide Details" : "View/Edit Details"}
                    </Button>
                    {!isEdit && (
                      <Button 
                        type="button"
                        variant="ghost" 
                        size="sm" 
                        className="text-red-500 hover:text-red-700 hover:bg-red-50 h-7"
                        onClick={unlinkCustomer}
                      >
                        Unlink
                      </Button>
                    )}
                  </div>
                </div>
              ) : (
                <p className="text-xs text-muted-foreground mb-4">
                  Enter a 10-digit phone number or email to automatically fetch existing customer data.
                </p>
              )}

              {/* Input details to be shown if New Client OR editing existing Client Details */}
              {(!form.clientId || showExtraDetails) && (
                <div className="space-y-6 mt-4 animate-in fade-in slide-in-from-top-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input placeholder="Buyer Name" value={form.clientName} onChange={(e) => updateForm("clientName", e.target.value)} />
                    <Input type="email" placeholder="Email" value={form.clientEmail} onChange={(e) => updateForm("clientEmail", e.target.value)} />
                    <Input placeholder="Phone (10 digits)" value={form.clientPhone} onChange={(e) => updateForm("clientPhone", e.target.value)} />
                    {!isEdit && (
                      <Input type="password" placeholder="Password (leave blank for auto-generate)" value={form.clientPassword} onChange={(e) => updateForm("clientPassword", e.target.value)} />
                    )}
                  </div>

                  <div className="border-t pt-4">
                    <h3 className="font-semibold text-lg text-muted-foreground">Personal Details</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input type="date" placeholder="Date of Birth" value={form.dateOfBirth} onChange={(e) => updateForm("dateOfBirth", e.target.value)} />
                    <Select value={form.gender} onValueChange={(v) => updateForm("gender", v)}>
                      <SelectTrigger><SelectValue placeholder="Gender" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Male">Male</SelectItem>
                        <SelectItem value="Female">Female</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select value={form.bloodGroup} onValueChange={(v) => updateForm("bloodGroup", v)}>
                      <SelectTrigger><SelectValue placeholder="Blood Group" /></SelectTrigger>
                      <SelectContent>
                        {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map((bg) => (
                          <SelectItem key={bg} value={bg}>{bg}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Select value={form.maritalStatus} onValueChange={(v) => updateForm("maritalStatus", v)}>
                      <SelectTrigger><SelectValue placeholder="Marital Status" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Single">Single</SelectItem>
                        <SelectItem value="Married">Married</SelectItem>
                        <SelectItem value="Divorced">Divorced</SelectItem>
                        <SelectItem value="Widowed">Widowed</SelectItem>
                        <SelectItem value="Separated">Separated</SelectItem>
                      </SelectContent>
                    </Select>
                    <Input placeholder="Aadhar Number" value={form.aadharNumber} onChange={(e) => updateForm("aadharNumber", e.target.value)} />
                    <Input placeholder="PAN Number" value={form.panNumber} onChange={(e) => updateForm("panNumber", e.target.value)} />
                    <Input placeholder="Father's Name" value={form.fatherName} onChange={(e) => updateForm("fatherName", e.target.value)} />
                    <Input placeholder="Mother's Name" value={form.motherName} onChange={(e) => updateForm("motherName", e.target.value)} />
                  </div>

                  <div className="border-t pt-4">
                    <h3 className="font-semibold text-lg text-muted-foreground">Emergency Contact</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input placeholder="Emergency Contact Name" value={form.emergencyContactName} onChange={(e) => updateForm("emergencyContactName", e.target.value)} />
                    <Input placeholder="Emergency Contact Phone" value={form.emergencyContactPhone} onChange={(e) => updateForm("emergencyContactPhone", e.target.value)} />
                    <Input placeholder="Relationship" value={form.emergencyContactRelation} onChange={(e) => updateForm("emergencyContactRelation", e.target.value)} />
                  </div>

                  <div className="border-t pt-4">
                    <h3 className="font-semibold text-lg text-muted-foreground">Permanent Address</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input placeholder="Address Line 1" value={form.addressLine1} onChange={(e) => updateForm("addressLine1", e.target.value)} />
                    <Input placeholder="City" value={form.city} onChange={(e) => updateForm("city", e.target.value)} />
                    <Input placeholder="State" value={form.state} onChange={(e) => updateForm("state", e.target.value)} />
                    <Input placeholder="Country" value={form.country} onChange={(e) => updateForm("country", e.target.value)} />
                    <Input placeholder="Pincode" value={form.pincode} onChange={(e) => updateForm("pincode", e.target.value)} />
                  </div>

                  <div className="border-t pt-4">
                    <h3 className="font-semibold text-lg text-muted-foreground">Bank Details</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input placeholder="Bank Name" value={form.bankName} onChange={(e) => updateForm("bankName", e.target.value)} />
                    <Input placeholder="Account Number" value={form.accountNumber} onChange={(e) => updateForm("accountNumber", e.target.value)} />
                    <Input placeholder="IFSC Code" value={form.ifscCode} onChange={(e) => updateForm("ifscCode", e.target.value)} />
                    <Input placeholder="UPI ID" value={form.upiId} onChange={(e) => updateForm("upiId", e.target.value)} />
                    <Input placeholder="Account Holder Name" value={form.accountHolderName} onChange={(e) => updateForm("accountHolderName", e.target.value)} />
                    <Select value={form.accountType} onValueChange={(v) => updateForm("accountType", v)}>
                      <SelectTrigger><SelectValue placeholder="Account Type" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Savings">Savings</SelectItem>
                        <SelectItem value="Current">Current</SelectItem>
                        <SelectItem value="Salary">Salary</SelectItem>
                      </SelectContent>
                    </Select>
                    <Input placeholder="Branch Name" value={form.branchName} onChange={(e) => updateForm("branchName", e.target.value)} />
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        <DialogFooter className="bg-muted/30 p-4 border-t mt-6">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={loading || fetchingDetails} size="lg">
            {loading ? "Saving..." : isEdit ? "Update Booking" : "Create Booking"}
          </Button>
        </DialogFooter>
      </DialogContent>

      {/* Amount Calculator Dialog */}
      <AmountCalculatorDialog
        open={calculatorOpen}
        onOpenChange={setCalculatorOpen}
        onApply={handleCalculatorApply}
        remainingAmount={getInstallmentTargetBase()}
      />
    </Dialog>
  );
}