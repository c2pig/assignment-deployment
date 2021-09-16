
import Command from './command';
import process from 'process';

describe("When CLI has option pass in", () => {

  process.argv = ['node', 'cli-name', 'value1', 'value2', '2'];
  const cli = new Command();
  const parseCli = cli.addOption('opt1').addOption('opt2');

  test("it should pass kvp object to caller", () => {
    parseCli.execute(({opt1, opt2}) => {
      expect(opt1).toBe('value1');
      expect(opt2).toBe('value2');
    })
  });

  test("it should pass kvp object(number value) to caller", () => {
    parseCli
      .addOption('opt3', (v) => (parseInt(v)))
      .execute(({opt1, opt2, opt3}) => {
        expect(opt1).toBe('value1');
        expect(opt2).toBe('value2');
        expect(opt3).toBe(2);
    })
  });

});

describe("When CLI pass in option is incomplete", () => {
  process.argv = ['node', 'cli-name'];
  const cli = new Command();
  const parseCli = cli.addOption('opt1').addOption('opt2')
  test("it should pass partial kvp object to caller", () => {
    parseCli.execute(({opt1, opt2}) => {
      expect(opt1).toBe(undefined);
      expect(opt2).toBe(undefined);
    })
  });
});
