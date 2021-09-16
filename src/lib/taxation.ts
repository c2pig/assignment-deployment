import { TaxComputation, Bracket, BracketBreakdown } from './tax-computation';

export interface Tax {
  totalTaxableAmount: number;
  totalTax: number;
  bracketBreakdown: BracketBreakdown[];
}

export default class Taxation {

  private taxComputation: TaxComputation;

  constructor(brackets: Bracket[]) {
    this.taxComputation = new TaxComputation(brackets);
  }

  public getTaxComputationFromSalary(salary: number): Tax {
    const bracketBreakdown = this.taxComputation.getBracketBreakdown(salary);
    
    const getTotalTax= () => {
      return bracketBreakdown.map(({totalTax}) => (totalTax)).reduce((prev,  curr) => {
        return prev + curr;
      }, 0);
    }
    const getTotalTaxableAmount = () => {
      return bracketBreakdown.map(({taxableAmount}) => (taxableAmount)).reduce((prev,  curr) => {
        return prev + curr;
      }, 0);
    }

    return {
      totalTax: getTotalTax(),
      totalTaxableAmount: getTotalTaxableAmount(),
      bracketBreakdown
    }
  }
}