import React, { useState, useEffect } from 'react'
import { Box } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles';
import { 
  Button,
  TextField,
  Table,
  TableContainer,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper
} from '@material-ui/core';
import axios from 'axios';
import qs from 'qs';

const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
  root: {
    background: 'linear-gradient(154deg, #FE6B8B 30%, #f50057 85%)',
    border: 0,
    borderRadius: 3,
    boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
    color: 'white',
    height: 48,
    padding: '0 30px',
  },
  wrapper: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    marginTop: '20%',
    marginBottom: '5%',
    gap: '2%', 
  }
});

const EmployeeList = ({data}) => {
  const classes = useStyles();

  if(!data || data?.data?.length === 0) {
    return <div />
  }

  return (
    <TableContainer component={Paper}>
      <Table className={classes.table} size="small" aria-label="a dense table">
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell align="right">Gross Monthly Income</TableCell>
            <TableCell align="right">Monthly Income Tax</TableCell>
            <TableCell align="right">Net Monthly Income</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data?.data?.map((row) => (
            <TableRow key={row.name}>
              <TableCell component="th" scope="row">
                {row.displayName}
              </TableCell>
              <TableCell align="right">{row.grossMonthlyIncome}</TableCell>
              <TableCell align="right">{row.monthlyIncomeTax}</TableCell>
              <TableCell align="right">{row.netMonthlyIncome}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

const Index = () => {
  const [ name, setName] = useState("");
  const [ annualSalary, setAnnualSalary ] = useState(0);
  const [ refresh, setRefresh ] = useState(0);
  const [ tableData, setTableData ] = useState([]);
  const classes = useStyles();

  useEffect(async () => {
    const resp = await axios.get(`http://localhost:8080/v1/payroll`);
    setTableData(resp.data)
  }, [refresh]);

  const addPayroll = async () => {
    if(/^[0-9]+$/.test(annualSalary)) {
      await axios.post(`http://localhost:8080/v1/payroll`, qs.stringify({
        employeeName: name,
        annumSalary: annualSalary
      }), {
        headers: { 
          'Content-Type': 'application/x-www-form-urlencoded'
        },
      })
    }
  }

  return (
    <Box>
      <Box className={classes.wrapper}>
        <TextField label="Name" onChange={e => setName(e.target.value)} />
        <TextField label="Annual Salary" onChange={e => { 
          const salary = e.target.value;
            setAnnualSalary(salary)
        }} />
        <Button
          className={classes.root}
          onClick={() => { 
            addPayroll();
            setName('');
            setAnnualSalary(''); 
            setRefresh(refresh+1);
          }}
        >
          Add Payroll
        </Button>
      </Box>
      <EmployeeList data={tableData} />
    </Box>
  )
}

export default Index;