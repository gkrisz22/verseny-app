"use server";

import { z } from "zod";
import { db } from "@/lib/db";
import { UserService } from "@/services/user.service";
import { ActionResponse } from "@/types/form/action-response";
import { SignUpFirstStepData, SignUpTeacherData } from "@/types/form/auth";
import { signIn } from "@/auth";
import { redirect } from "next/navigation";

// Services
const userService = UserService.getInstance(db);

// Actions
export const signUpFirstStep = async (prevState: ActionResponse<SignUpFirstStepData>, formData: FormData) : Promise<ActionResponse<SignUpFirstStepData>> => {
    
    const rawData = Object.fromEntries(formData.entries());

    const schema = z.object({
        email: z.string().email("Hibás e-mail cím formátum!"),
        role: z.string().nonempty("Szerepkör megadása kötelező!"),
    });

    const validatedData = schema.safeParse(rawData);

    if (!validatedData.success) {
        return {
            success: false,
            message: "Validációs hibák történtek.",
            errors: validatedData.error.flatten().fieldErrors,
            inputs: validatedData.data,
        };
    }

    const { email, role } = validatedData.data;
    const res = await userService.findUserByEmail(email);

    if (res) {
        return {
            success: false,
            message: "Validációs hibák történtek.",
            errors: {
                email: ["Ezzel az e-mail címmel már regisztráltak."],
            }
        };
    }

    const encodedEmail = encodeURIComponent(email);
    redirect(`/sign-up/details?email=${encodedEmail}&role=${role}`);
};

export const signInGithub = async () => {
    await signIn("github");
};
export const signInGoogle = async () => {
    await signIn("google");
};


export const signUpTeacher = async (prevState: ActionResponse<SignUpTeacherData>, formData: FormData) : Promise<ActionResponse<SignUpTeacherData>> => {

    const rawData = Object.fromEntries(formData.entries());
    const schema = z.object({
        email: z.string().email("Hibás e-mail cím formátum!"),
        name: z.string().nonempty("Név megadása kötelező!"),
        password: z.string().min(8, "A jelszó legalább 8 karakter hosszú legyen!"),
        passwordConfirm: z.string().refine((data) => data === rawData.password, {
            message: "A két jelszó nem egyezik meg!",
        }),
        subjects: z.string().nonempty("Tantárgyak megadása kötelező!"),
    });

    const validatedData = schema.safeParse(rawData);
    
    if(!validatedData.success) {
        return {
            success: false,
            message: "Validációs hibák történtek.",
            errors: validatedData.error.flatten().fieldErrors,
            inputs: validatedData.data,
        };
    }

    const { email, name, password, subjects } = validatedData.data;
    const res = await userService.findUserByEmail(email);

    if (res) {
        return {
            success: false,
            message: "Validációs hibák történtek.",
            errors: {
                email: ["Ezzel az e-mail címmel már regisztráltak."],
            }
        };
    }

    return {
        success: true,
        message: "Sikeres regisztráció"
    };

};