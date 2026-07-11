// import React, { useState } from "react";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogDescription,
//   DialogFooter,
// } from "@/components/ui/dialog";
// import { Button } from "@/components/ui/button";
// import { Label } from "@/components/ui/label";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { Download, Send, AlertCircle, Loader2 } from "lucide-react";
// import { useHR } from "@/hooks/useHR";

// export function PayrollSubmissionDialog({ open, onOpenChange }) {
//   const { downloadSalaryReport, submitPayrollForApproval, loading } = useHR();
  
//   const [selectedMonth, setSelectedMonth] = useState(
//     new Date().toLocaleString('default', { month: 'long' })
//   );
//   const [selectedYear, setSelectedYear] = useState(
//     new Date().getFullYear().toString()
//   );

//   const months = [
//     "January", "February", "March", "April", "May", "June",
//     "July", "August", "September", "October", "November", "December"
//   ];
//   const years = ["2024", "2025", "2026", "2027"];

//   // Step 1: Report Download karega (GET /api/v1/hr/salary/report)
//   const handleDownload = async () => {
//     await downloadSalaryReport({ 
//       month: selectedMonth, 
//       year: parseInt(selectedYear) 
//     });
//   };

//   // Step 2: Finance ko Submit karega (POST /api/v1/hr/salary/report/submit-for-approval)
//   const handleSubmit = async () => {
//     const success = await submitPayrollForApproval({ 
//       month: selectedMonth, 
//       year: parseInt(selectedYear) 
//     });
//     if (success) {
//       onOpenChange(false); // Modal close on success
//     }
//   };

//   return (
//     <Dialog open={open} onOpenChange={onOpenChange}>
//       <DialogContent className="sm:max-w-[450px]">
//         <DialogHeader>
//           <DialogTitle>Monthly Payroll Processing</DialogTitle>
//           <DialogDescription>
//             Pehle report generate karke download karein, verify hone ke baad Finance ko submit karein.
//           </DialogDescription>
//         </DialogHeader>

//         <div className="grid gap-4 py-4">
//           <div className="flex items-start gap-2 text-sm text-amber-700 bg-amber-50 p-3 rounded-md border border-amber-200">
//             <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
//             <span>Kripya Finance ko submit karne se pehle downloaded Excel sheet ka data carefully verify kar lein.</span>
//           </div>
          
//           <div className="grid grid-cols-4 items-center gap-4">
//             <Label className="text-right">Month</Label>
//             <Select value={selectedMonth} onValueChange={setSelectedMonth}>
//               <SelectTrigger className="col-span-3">
//                 <SelectValue placeholder="Select Month" />
//               </SelectTrigger>
//               <SelectContent>
//                 {months.map(m => <SelectItem key={m} value={m}>{m}</SelectItem>)}
//               </SelectContent>
//             </Select>
//           </div>
          
//           <div className="grid grid-cols-4 items-center gap-4">
//             <Label className="text-right">Year</Label>
//             <Select value={selectedYear} onValueChange={setSelectedYear}>
//               <SelectTrigger className="col-span-3">
//                 <SelectValue placeholder="Select Year" />
//               </SelectTrigger>
//               <SelectContent>
//                 {years.map(y => <SelectItem key={y} value={y}>{y}</SelectItem>)}
//               </SelectContent>
//             </Select>
//           </div>
//         </div>

//         <DialogFooter className="flex flex-col sm:flex-row gap-2 sm:justify-between w-full">
//           {/* Action 1: Generate & Download */}
//           <Button 
//             variant="outline" 
//             onClick={handleDownload} 
//             disabled={loading}
//             className="w-full sm:w-auto"
//           >
//             <Download className="mr-2 h-4 w-4" />
//             Preview Excel
//           </Button>
          
//           {/* Action 2: Submit to Finance */}
//           <Button 
//             onClick={handleSubmit} 
//             disabled={loading}
//             className="w-full sm:w-auto"
//           >
//             {loading ? (
//               <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//             ) : (
//               <Send className="mr-2 h-4 w-4" />
//             )}
//             {loading ? "Processing..." : "Submit to Finance"}
//           </Button>
//         </DialogFooter>
//       </DialogContent>
//     </Dialog>
//   );
// }




import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Download, Send, AlertCircle, Loader2 } from "lucide-react";
import { useHR } from "@/hooks/useHR";

export function PayrollSubmissionDialog({ open, onOpenChange }) {
  const { downloadSalaryReport, submitPayrollForApproval, loading } = useHR();
  
  const [selectedMonth, setSelectedMonth] = useState(
    new Date().toLocaleString('default', { month: 'long' })
  );
  const [selectedYear, setSelectedYear] = useState(
    new Date().getFullYear().toString()
  );

  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  const years = ["2024", "2025", "2026", "2027"];

  // Step 1: Generate and download report (GET /api/v1/hr/salary/report)
  const handleDownload = async () => {
    await downloadSalaryReport({ 
      month: selectedMonth, 
      year: parseInt(selectedYear) 
    });
  };

  // Step 2: Submit to Finance for approval (POST /api/v1/hr/salary/report/submit-for-approval)
  const handleSubmit = async () => {
    const success = await submitPayrollForApproval({ 
      month: selectedMonth, 
      year: parseInt(selectedYear) 
    });
    if (success) {
      onOpenChange(false); // Close modal on success
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[450px]">
        <DialogHeader>
          <DialogTitle>Monthly Payroll Processing</DialogTitle>
          <DialogDescription>
            Please generate and download the report first. After verification, submit it to the Finance department.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="flex items-start gap-2 text-sm text-amber-700 bg-amber-50 p-3 rounded-md border border-amber-200">
            <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
            <span>Please carefully verify the downloaded Excel sheet data before submitting to Finance.</span>
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">Month</Label>
            <Select value={selectedMonth} onValueChange={setSelectedMonth}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select Month" />
              </SelectTrigger>
              <SelectContent>
                {months.map(m => <SelectItem key={m} value={m}>{m}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">Year</Label>
            <Select value={selectedYear} onValueChange={setSelectedYear}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select Year" />
              </SelectTrigger>
              <SelectContent>
                {years.map(y => <SelectItem key={y} value={y}>{y}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter className="flex flex-col sm:flex-row gap-2 sm:justify-between w-full">
          {/* Action 1: Generate & Download */}
          <Button 
            variant="outline" 
            onClick={handleDownload} 
            disabled={loading}
            className="w-full sm:w-auto"
          >
            <Download className="mr-2 h-4 w-4" />
            Preview Excel
          </Button>
          
          {/* Action 2: Submit to Finance */}
          <Button 
            onClick={handleSubmit} 
            disabled={loading}
            className="w-full sm:w-auto"
          >
            {loading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Send className="mr-2 h-4 w-4" />
            )}
            {loading ? "Processing..." : "Submit to Finance"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}