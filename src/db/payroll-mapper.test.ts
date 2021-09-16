import { when } from 'jest-when';
import { Model } from 'sequelize/types';
import { EmployeePayroll } from '../lib/payroll';
import { modelToDO, DOToModelQuery } from './payroll-mapper'

describe("Payroll Mapper", () => {

  const dataValueMock = jest.fn();
  const model = {
    getDataValue: dataValueMock
  } as any as Model

  it("should convert data object to model query", () => {
    const dataObject: EmployeePayroll = {
      "displayName": "tax-payer",
      "grossMonthlyIncome": 10,
      "monthlyIncomeTax": 1,
      "netMonthlyIncome": 9
    }
    const model = DOToModelQuery(dataObject);
    expect(model).toEqual({
      timestamp: expect.any(Date),
      employeeName: expect.any(String),
      annualSalary: expect.any(Number),
      monthlyIncomeTax: expect.any(Number),
    })
  })

  it("should convert model to data object", () => {

    when(dataValueMock).calledWith("employeeName").mockReturnValue('tax-payer')
    when(dataValueMock).calledWith("annualSalary").mockReturnValue('120')
    when(dataValueMock).calledWith("monthlyIncomeTax").mockReturnValue('1')

    const dataObject: EmployeePayroll = modelToDO(model);
    expect(dataObject).toEqual({
      "displayName": "tax-payer",
      "grossMonthlyIncome": 10,
      "monthlyIncomeTax": 1,
      "netMonthlyIncome": 9,
    });

  })
})