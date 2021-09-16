export interface Repository<T> {
  getAll(): Promise<T[]>;
  getById(id: string): Promise<T>;
  save(t: T): Promise<any>;
}