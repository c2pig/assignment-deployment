import { Model } from 'sequelize';
import { EmployeePayroll } from '../lib/payroll';

const getGrossMonthlyIncome = (annualSalary: number): number => {
  return annualSalary / 12;
}

const getNetMonthlyIncome = (annualSalary: number, monthlyIncomeTax: number) => {
  return getGrossMonthlyIncome(annualSalary) - monthlyIncomeTax;
}

const getAnnualSalary = (grossMonthlyIncome: number) => {
  return grossMonthlyIncome * 12;
}

export const modelToDO = (model: Model): EmployeePayroll => ({
  displayName: model.getDataValue('employeeName'),
  grossMonthlyIncome: getGrossMonthlyIncome(model.getDataValue('annualSalary')),
  monthlyIncomeTax: parseInt(model.getDataValue('monthlyIncomeTax')),
  netMonthlyIncome:  getNetMonthlyIncome(model.getDataValue('annualSalary'), model.getDataValue('monthlyIncomeTax'))
});

export const DOToModelQuery = (d: EmployeePayroll): object => {
  return {
    timestamp: new Date(),
    employeeName: d.displayName,
    annualSalary: getAnnualSalary(d.grossMonthlyIncome),
    monthlyIncomeTax: d.monthlyIncomeTax, 
  }
}