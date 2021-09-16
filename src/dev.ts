import AWS from 'aws-sdk';
import { app } from './app'
import PayrollRepo from './db/payroll-repository-memory';
import { savePayrollRequestToDB } from './middleware';

const credentials = new AWS.SharedIniFileCredentials({profile: 'uv'});
AWS.config.credentials = credentials;

const payrollRepo = new PayrollRepo();
const port = 8080;

app.post('/v1/payroll', savePayrollRequestToDB(payrollRepo));

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
});
