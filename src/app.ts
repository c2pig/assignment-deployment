import express from 'express';
import cors from 'cors';
import PayrollRepo from './db/payroll-repository-s3';
import { savePayrollRequestToDB, postPayrollRequest, getAllPayrollFromDB, getPayrollFromDB } from './middleware'

const bucket = "c2pig-db"; 
const payrollRepo = new PayrollRepo(bucket);
const app = express();

app.use(cors());
app.use(express.urlencoded());
//TODO: reduce repeat usage of payrollRepo
app.post('/v1/payroll', savePayrollRequestToDB(payrollRepo));
app.post('/v1/payroll', postPayrollRequest);
app.get('/v1/payroll/:pid', getPayrollFromDB(payrollRepo));
app.get('/v1/payroll', getAllPayrollFromDB(payrollRepo));

export { app }
