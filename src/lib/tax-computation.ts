export interface BracketBreakdown {
  rate: number;
  taxableAmount: number;
  totalTax: number;
}

export interface Bracket {
  name: string;
  upper: number;
  lower: number;
  rate: number;
}

export interface BracketCalculation {
  getBracketBreakdown: (salary: number) => BracketBreakdown[]
}

export class TaxComputation implements BracketCalculation {

  private brackets: Bracket[];

  constructor(brackets: Bracket[]) {
    this.brackets = brackets;
  }

  getBracketBreakdown(salary: number) {

    let remain = salary;
    let taxableAmount = 0;
    let totalTax = 0;
    const bracketBreakdown: BracketBreakdown[] = [];

    for(const bracket of this.brackets) {

      const { upper, lower, rate } = bracket;

      if(remain <= upper && remain > lower ) {
        taxableAmount = remain - bracket.lower;
        remain -= taxableAmount;
        totalTax = taxableAmount * (rate / 100);
        bracketBreakdown.push({
          rate,
          totalTax,
          taxableAmount
        }) 
      }
    }

    return bracketBreakdown;

  }

}
