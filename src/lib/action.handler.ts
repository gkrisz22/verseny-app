"use server";

import { z, ZodSchema } from "zod";
import { ActionResponse } from "@/types/form/action-response";
import { Middleware } from "@/middlewares/middleware";
import { logger } from "./logger";
import authMiddleware from "@/middlewares/auth.middleware";

export async function actionHandler<T>(
  schema: ZodSchema<T>,
  formData: FormData | object,
  handler: (data: T) => Promise<ActionResponse<T>>,
  middlewares?: Middleware<T>[]
): Promise<ActionResponse<T>> {

  const defaultMiddlewares: Middleware<T>[] = [
    {
      async handle(formData: FormData | object) {
        if (!formData) {
          return {
            success: false,
            message: "Nincs adat.",
          };
        }
      },
    },
  ];

  if (!middlewares) {
    middlewares = defaultMiddlewares;
  }
  else {
    middlewares = [...defaultMiddlewares, ...middlewares];
  }
  formData = formData || {};
  if (formData instanceof FormData) {
    formData = Object.fromEntries(formData.entries());
  }
  logger.debug('[action] formData: ', formData);

  if (middlewares) {
    for (const middleware of middlewares) {
      const result = await middleware.handle(formData);
      if (result) {
        return result;
      }
    }
  }
  const validatedData = schema.safeParse(formData);

  if (!validatedData.success) {
    const msgObj = JSON.parse(validatedData.error.message);

    return {
      success: false,
      message: msgObj.length > 0 ? msgObj[0].message : "Validációs hiba történt!",
      errors: validatedData.error.flatten().fieldErrors as { [K in keyof T]?: string[] },
      inputs: formData as T,
    };
  }

  return handler(validatedData.data);
}