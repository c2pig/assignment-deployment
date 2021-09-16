import { Sequelize, DataTypes } from 'sequelize';


export const createPayrollModel = (sequelize: Sequelize) => {
  return sequelize.define('Payroll', {
    timestamp: {
      type: DataTypes.DATE,
      allowNull: false
    },
    employeeName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    annualSalary: {
      type: DataTypes.DECIMAL,
      allowNull: false
    },
    monthlyIncomeTax: {
      type: DataTypes.DECIMAL,
      allowNull: false
    },
  }).sync({force: true});
}