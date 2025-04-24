"use server";

import { actionHandler } from "@/lib/action.handler";
import {
    InviteUserDTO,
    inviteUserSchema,
} from "@/lib/definitions";
import userService from "@/services/user.service";
import { ActionResponse } from "@/types/form/action-response";
import { revalidatePath } from "next/cache";

export async function inviteUser(
    prevState: ActionResponse<InviteUserDTO>,
    formData: FormData
): Promise<ActionResponse<InviteUserDTO>> {
    return actionHandler<InviteUserDTO>(
        inviteUserSchema,
        formData,
        async (data) => {
            try {
                const { name, email, superAdmin } = data;
                const existingUser = await userService.getWhere({
                    email,
                });
                if (existingUser.length > 0) {
                    const res = await userService.update(existingUser[0].id, {
                        superAdmin: superAdmin ? true : false,
                    });
                    if (res) {
                        revalidatePath("/admin/felhasznalok");
                        return {
                            success: true,
                            message: "Sikeresen adminisztrátori pozícióba léptette a felhasználót!",
                        };
                    } else {
                        return {
                            success: false,
                            message: "Hiba történt a felhasználó frissítése során!",
                        };
                    }
                }
                const res = await userService.create({
                    name,
                    email,
                    superAdmin: superAdmin ? true : false,
                });
                if (res) {
                    revalidatePath("/admin/felhasznalok");
                    return {
                        success: true,
                        message: "Sikeresen létrehozta a felhasználót!",
                    };
                }
                return {
                    success: false,
                    message: "Hiba történt a felhasználó létrehozása során!",
                };
                
            } catch (error) {
                console.error(
                    "Hiba történt a felhasználó létrehozása/frissítése során: ",
                    error
                );
                return {
                    success: false,
                    message:
                        "Hiba történt a felhasználó létrehozása/frissítése során!",
                };
            }
        }
    );
}
