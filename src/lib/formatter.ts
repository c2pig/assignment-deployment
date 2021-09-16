import { EmployeePayroll } from "./payroll";

export const LineRecordFormatter = 
  ({displayName, grossMonthlyIncome, monthlyIncomeTax, netMonthlyIncome}: EmployeePayroll): string => {
  return `
    Monthly Payslip for: "${displayName}"
    Gross Monthly Income: $${grossMonthlyIncome}
    Monthly Income Tax: $${monthlyIncomeTax}
    Net Monthly Income: $${netMonthlyIncome}
  `
}