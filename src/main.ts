#!/usr/bin/env node

import Command from './lib/command';
import Payroll from './lib/payroll';
import { LineRecordFormatter } from './lib/formatter';
import RecordWriter from './lib/record-writer';

const cli = new Command();

cli
  .addOption('employeeName')
  .addOption('annumSalary', (v) => (parseInt(v)))
  .execute(({ employeeName, annumSalary }) => {
    const payroll = new Payroll();
    const recordWriter = new RecordWriter();
    payroll.name(employeeName)
    payroll.annumSalary(annumSalary);
    const record = payroll.create();
    recordWriter.toConsole(LineRecordFormatter(record));
  });
