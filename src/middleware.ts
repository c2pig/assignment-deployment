import { Request, Response, NextFunction } from 'express'
import { Repository } from './db/repository';
import Payroll, { EmployeePayroll } from './lib/payroll';

interface PayrollParam {
  employeeName: string;
  annumSalary: number;
}

interface ErrorRequest {
  error?: string;
}

const validateEmployeePayroll = (p: Payroll): ErrorRequest => {
  if(!p || !p.getAnnumSalary() || !p.getName()) {
    return {
      error: `Expect parameter employeeName(${p.getName()}) and annumSalary(${p.getAnnumSalary()})`
    };
  }
  return {};
}

const createPayroll = ({ employeeName, annumSalary }: PayrollParam): Payroll => {
  const payroll = new Payroll();
  payroll.name(employeeName)
  payroll.annumSalary(annumSalary);
  return payroll;
}

export const postPayrollRequest = (
  req: Request,
  res: Response,
  next: NextFunction
  ) => {
  try {
    const payroll = createPayroll(req.body);
    const validation = validateEmployeePayroll(payroll);
    if(validation.hasOwnProperty('error')) {
      res.status(400).json(validation);
    }
    res.json(payroll.create());
    next();
  } catch(e) {
    console.log(e);
    res.status(400).json({error: e});
  }
}

export const savePayrollRequestToDB = (repo: Repository<EmployeePayroll>) => async(
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const payroll = createPayroll(req.body);
  const validation = validateEmployeePayroll(payroll);
  if(validation.hasOwnProperty('error')) {
    console.log(`[ERROR] Unable write payroll to DataStore due to: ${validation.error}`);
    next();
  }
  try {
    repo.save(payroll.create());
    next();
  } catch(e) {
    console.log(e);
  }
}

export const getPayrollFromDB = (repo: Repository<EmployeePayroll>) => async(
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
  const pid = req.params.pid
    if(pid) {
      const data = await repo.getById(pid);
      res.json({ data });
    }
    next();
  } catch(e) {
    console.log(e);
    res.status(500).json({ error: "DB operation error"});
  }
}

export const getAllPayrollFromDB = (repo: Repository<EmployeePayroll>) => async(
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const data = await repo.getAll();
    res.json({ data });
    next();
  } catch(e) {
    console.log(e);
    res.status(500).json({ error: "DB operation error"});
  }
}