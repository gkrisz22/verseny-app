import { PrismaClient } from "@prisma/client";

export class Service<T extends Service<T>> {
    private static instances = new Map<Function, Service<any>>();
    protected db: PrismaClient;

    protected constructor(prisma: PrismaClient) {
        this.db = prisma;
    }

    public static getInstance<T extends Service<T>>(this: new (prisma: PrismaClient) => T, prisma: PrismaClient): T {
        if (!Service.instances.has(this)) {
            Service.instances.set(this, new this(prisma));
        }
        return Service.instances.get(this) as T;
    }
}
