import { Session } from "next-auth";
import { ActionResponse } from "@/types/form/action-response";

export interface Middleware<T> {
    handle(formData: FormData, session?: Session): Promise<ActionResponse<T> | void>;
}
