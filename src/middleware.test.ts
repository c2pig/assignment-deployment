import { postPayrollRequest, savePayrollRequestToDB } from "./middleware";
import { EmployeePayroll } from "./lib/payroll";
import { Repository } from './db/repository'

describe("Middleware", () => {
  const goodReq = {
    body: {
      employeeName: 'ren',
      annumSalary: '80150'
    }
  } as any;

  const badReq = {
    body: {
      employeeName: 'ren',
    }
  } as any;

  const mock = jest.fn();
  const next = jest.fn();
  const res = {
    json: jest.fn(),
    status: jest.fn().mockReturnValue({json: mock})
  } as any;

  const mockedRepo = {
    getAll: () => {},
    getById:  (id: string) => {},
    save: mock
  } as any as Repository<EmployeePayroll>

  beforeEach(() => {
    mock.mockReset();
    next.mockReset();
  })

  test("it should return payroll response", () => {
    postPayrollRequest(goodReq, res, next);
    expect(res.json).toBeCalledWith({
      displayName: expect.any(String),
      grossMonthlyIncome: expect.any(Number), 
      monthlyIncomeTax: expect.any(Number),
      netMonthlyIncome: expect.any(Number)
    });
    expect(res.json).toBeCalledTimes(1);
    expect(mock).toBeCalledTimes(0);
    expect(next).toBeCalledTimes(1);


  });

  test("it should return 400 status code", () => {
    postPayrollRequest(badReq, res, next);
    expect(res.status).toHaveBeenNthCalledWith(1, 400);
    expect(mock).toBeCalledTimes(2);
  });

  test("it should write payroll db", () => {
    savePayrollRequestToDB(mockedRepo)(goodReq, res, next)
    expect(mock).toBeCalledTimes(1);
    expect(mock).toBeCalledWith({
      displayName: expect.any(String),
      grossMonthlyIncome: expect.any(Number), 
      monthlyIncomeTax: expect.any(Number),
      netMonthlyIncome: expect.any(Number)
    });
  });
});
