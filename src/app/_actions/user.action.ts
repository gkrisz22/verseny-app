"use server";

import { actionHandler } from "@/lib/action.handler";
import {
    InviteUserDTO,
    inviteUserSchema,
    UpdateUserDTO,
    UpdateUserProfileDTO,
    updateUserProfileSchema,
    updateUserSchema,
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

export async function updateUser(
    prevState: ActionResponse<UpdateUserDTO>,
    formData: FormData
): Promise<ActionResponse<UpdateUserDTO>> {
    return actionHandler<UpdateUserDTO>(
        updateUserSchema,
        formData,
        async (data) => {
            try {
                const { name, email, superAdmin } = data;
                const res = await userService.update(data.id, {
                    name,
                    email,
                    superAdmin: superAdmin === "true" ? true : false,
                    status: data.isActive ? "ACTIVE" : "INACTIVE",
                });
                if (res) {
                    revalidatePath("/admin/felhasznalok");
                    return {
                        success: true,
                        message: "Sikeresen frissítette a felhasználót!",
                    };
                }
                return {
                    success: false,
                    message: "Hiba történt a felhasználó frissítése során!",
                };
            } catch (error) {
                console.error(
                    "Hiba történt a felhasználó frissítése során: ",
                    error
                );
                return {
                    success: false,
                    message:
                        "Hiba történt a felhasználó frissítése során!",
                };
            }
        }
    );
}

export async function updateUserProfile(
    prevState: ActionResponse<UpdateUserProfileDTO>,
    formData: FormData
): Promise<ActionResponse<UpdateUserProfileDTO>> {
    return actionHandler<UpdateUserProfileDTO>(
        updateUserProfileSchema,
        formData,
        async (data) => {
            try {
                const { id, name, email, password } = data;
                
                let encryptedPassword = null;
                if(password) {
                    encryptedPassword = await userService.hashPassword(password);
                }
                
                await userService.update(data.id, {
                    name,
                    email,
                    ...(encryptedPassword && { password: encryptedPassword }),
                });
            } catch (error) {
                console.error(
                    "Hiba történt a felhasználó frissítése során: ",
                    error
                );
                return {
                    success: false,
                    message:
                        "Hiba történt a felhasználó frissítése során!",
                };
            }

            revalidatePath("/select/fiok");
            return {
                success: true,
                message: "Sikeresen frissítette a felhasználói fiókját!",
            };
        }
    );
}