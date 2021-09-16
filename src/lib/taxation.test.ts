import Taxation, { Tax } from './taxation';

const simpleBracket = [
  { 
    "name": "rate50",
    "upper": 999999999,
    "lower": 20000,
    "rate": 50
  },
  {
    "name": "rate0",
    "upper": 20000,
    "lower": 0,
    "rate": 0
  }
];

describe("When simple bracket in used", () => {
  const taxation = new Taxation(simpleBracket);
  test("it should no impost tax", () => {
    const tax: Tax = taxation.getTaxComputationFromSalary(10000);
    expect(tax.totalTax).toEqual(0);
    expect(tax.totalTaxableAmount).toEqual(10000);
    expect(tax.bracketBreakdown).toHaveLength(1);
  });

  test("it should impost tax", () => {
    const tax: Tax = taxation.getTaxComputationFromSalary(30000);
    expect(tax.totalTax).toEqual(5000);
    expect(tax.totalTaxableAmount).toEqual(30000);
    expect(tax.bracketBreakdown).toHaveLength(2);
  });
});

describe("When no bracket in used", () => {
  const taxation = new Taxation([]);
  test("it should no impost tax", () => {
    const tax: Tax = taxation.getTaxComputationFromSalary(100000);
    expect(tax.totalTax).toEqual(0);
    expect(tax.totalTaxableAmount).toEqual(0);
    expect(tax.bracketBreakdown).toHaveLength(0);
  });

  test("it should impost tax", () => {
    const tax: Tax = taxation.getTaxComputationFromSalary(30000);
    expect(tax.totalTax).toEqual(0);
    expect(tax.totalTaxableAmount).toEqual(0);
    expect(tax.bracketBreakdown).toHaveLength(0);
  });
});