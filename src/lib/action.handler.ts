"use server";

import { z, ZodSchema } from "zod";
import { ActionResponse } from "@/types/form/action-response";
import { Middleware } from "@/middlewares/middleware";
import { logger } from "./logger";

export async function actionHandler<T>(
  schema: ZodSchema<T>,
  formData: FormData,
  handler: (data: T) => Promise<ActionResponse<T>>,
  middlewares?: Middleware<T>[]
)
  : Promise<ActionResponse<T>> {

    const rawData = Object.fromEntries(formData.entries()); 

    if(middlewares) {
      for (const middleware of middlewares) {
        const result = await middleware.handle(formData);
        if (result) {
          return result;
        }
      } 
    }
    const validatedData = schema.safeParse(rawData);

    if (!validatedData.success) {
      return {
        success: false,
        message: "Validációs hiba történt!",
        errors: validatedData.error.flatten().fieldErrors as { [K in keyof T]?: string[] },
        inputs: rawData as T,
      };
    }

    return handler(validatedData.data);
}