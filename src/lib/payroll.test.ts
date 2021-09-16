import Payroll from './payroll';

describe("When payroll use default tax bracket", () => {

  test("it should return payroll record", () => {

    const payroll = new Payroll();
    payroll.name('employee1');
    payroll.annumSalary(60000);
    const record = payroll.create();

    expect(record).toEqual({
      displayName: expect.any(String),
      grossMonthlyIncome: expect.any(Number),
      monthlyIncomeTax: expect.any(Number),
      netMonthlyIncome: expect.any(Number)
    });
  });

  test("incomplete parameter payroll should throw exception", () => {
    const payroll = new Payroll();
    payroll.name('employee2');
    expect(() => payroll.create()).toThrow();

  });

});