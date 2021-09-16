import { Repository } from "./repository";
import { createPayrollModel } from './payroll';
import { Sequelize } from 'sequelize';
import { EmployeePayroll } from "../lib/payroll";
import { DOToModelQuery, modelToDO } from './payroll-mapper';

export default class PayrollSQLRepo implements Repository<EmployeePayroll> {

  private sequelize!: Sequelize;

  constructor() {
    this.sequelize = new Sequelize('sqlite::memory');
    createPayrollModel(this.sequelize)
  }

  async getAll(): Promise<EmployeePayroll[]> {
    const { Payroll } = this.sequelize.models;
    const records = await Payroll.findAll();
    console.log(records);
    return records.map((record) => (modelToDO(record)));
  }

  async getById(id: string): Promise<EmployeePayroll> {
    const { Payroll } = this.sequelize.models;
    const record = await Payroll.findByPk(id);
    if(record === null) {
      throw new Error(`${id} record not found`);
    }
    return modelToDO(record);
  }

  async save(d: EmployeePayroll): Promise<number> {
    const { Payroll } = this.sequelize.models;
    const model = await Payroll.create(DOToModelQuery(d), { isNewRecord:true });
    return model.getDataValue('id');
  }
}