import { PrismaClient } from "@prisma/client";
import { db } from "@/lib/db";

export class Service {
  protected db: PrismaClient;

  constructor(prisma?: PrismaClient) {
    this.db = prisma || db;
  }
}

export interface CrudService<T> {
  create(data: T): Promise<T>;
  update(id: string, data: T): Promise<T>;
  delete(id: string): Promise<boolean>;
  get(id: string): Promise<T | null>;
  getAll(): Promise<T[]>; 
}