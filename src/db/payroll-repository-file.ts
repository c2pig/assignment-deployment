import { Repository } from "./repository";
import { createPayrollModel } from './payroll';
import { Sequelize } from 'sequelize';
import { EmployeePayroll } from "../lib/payroll";
import { DOToModelQuery, modelToDO } from './payroll-mapper';
import path from 'path';
import fse from 'fs-extra';

export default class PayrollFileRepo implements Repository<EmployeePayroll> {

  private sequelize!: Sequelize;
  dbFilename = 'db.sqlite';
  dbPath = path.resolve('/tmp/efs');
  dbFile = path.resolve(this.dbPath, this.dbFilename);

  constructor() {
    if (!fse.existsSync(this.dbPath)) {
      fse.ensureDirSync(this.dbPath)
      fse.ensureFileSync(this.dbFile)
    }
    this.sequelize = new Sequelize({
      dialect: 'sqlite',
      storage: this.dbFile 
    });
    createPayrollModel(this.sequelize)
  }

  async getAll(): Promise<EmployeePayroll[]> {
    const { Payroll } = this.sequelize.models;
    const records = await Payroll.findAll();
    return records.map((record) => (modelToDO(record)));
  }

  async getById(id: string): Promise<EmployeePayroll> {
    const { Payroll } = this.sequelize.models;
    const record = await Payroll.findOne({ 
      where: { id }
    });
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