
import Taxation, { Tax } from './taxation';
import brackets from '../../data/brackets.json';

export interface EmployeePayroll {
  displayName: string;
  grossMonthlyIncome: number;
  monthlyIncomeTax: number;
  netMonthlyIncome: number;
}

interface PayrollCriteria {
  name: (name: string) => void;
  annumSalary: (salary: number) => void;
}

interface Buildable {
  create: () => EmployeePayroll;
}

export default class Payroll implements PayrollCriteria, Buildable {

  private _name!: string;
  private _salary!: number;
  private _taxation: Taxation;

  constructor() {
    this._taxation = new Taxation(brackets);
  }

  name(name: string) {
    this._name = name;
  }

  getName() {
    return this._name;
  }

  annumSalary(salary: number) {
    this._salary = salary;
  }

  getAnnumSalary() {
    return this._salary;
  }

  create() {
    if( !this._name || !this._salary ) {
      throw new Error(`name or salary parameter is not given`);
    }

    const dp = 2;
    const taxComputation: Tax = this._taxation.getTaxComputationFromSalary(this._salary);
    const { totalTaxableAmount, totalTax } = taxComputation;
    const monthlyIncomeTax = parseFloat((totalTax / 12).toFixed(dp));
    const netMonthlyIncome = parseFloat(((totalTaxableAmount / 12) - monthlyIncomeTax).toFixed(dp));

    return {
      displayName: this._name,
      grossMonthlyIncome: totalTaxableAmount,
      monthlyIncomeTax,
      netMonthlyIncome
    }
  }
}