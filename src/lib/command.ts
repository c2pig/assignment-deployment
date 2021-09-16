import process from 'process';

type Args = {
  [key: string]: string;
};

const noop = (a: any) => (a)

export default class Command {
  private _options: string[];
  private _values: string[];
  //TODO: change any to specific type
  private _args: any;

  constructor() {
    this._options= []; 
    const [, , ...rest] = process.argv;  
    this._values = rest;
    this._args = {}

  }
  addOption(opt: string, typeConverter = noop) {
    this._options.push(opt);
    this._args[opt] = typeConverter(this._values[Object.keys(this._args).length]);
    return this;
  }

  //TODO: change any to specific type
  execute(fn: (arg: any) => void) {
    fn(this._args)
    return this;
  };
}