import { z } from "zod";

export const signUpStepOneSchema = z.object({
    role: z.enum(["school", "teacher", "student"]).refine((val) => !!val, {
        message: "Szerepkör megadása kötelező!",
    }),
});
export type SignUpStepOneDTO = z.infer<typeof signUpStepOneSchema>;

export const competitionSchema = z.object({
    title: z.string().min(3, "Túl rövid a verseny neve"),
    startDate: z.string().min(3, ""),
    endDate: z.string().min(3, ""),
});
export type CompetitionDTO = z.infer<typeof competitionSchema>;

export const competitionUpdateMetadataSchema = z.object({
    title: z.string().min(3, "Túl rövid a verseny neve"),
    description: z.string().min(3, "Túl rövid a verseny leírása"),
    id: z.string(),
});
export type CompetitionUpdateMetadataDTO = z.infer<typeof competitionUpdateMetadataSchema>;

export const signUpSchoolSkeletonSchema = z.object({
    name: z.string().nonempty("Iskolanév megadása kötelező!").min(3, "Iskolanév túl rövid!"),
    om: z.string().refine(
        (val) => val === "" || val.length >= 6,
        "Az OM azonosító legalább 6 karakter hosszú kell legyen!"
    ).optional(),
    region: z.string().nonempty("Megye megadása kötelező!"),
    postalCode: z.string().nonempty("Irányítószám megadása kötelező!"),
    city: z.string().nonempty("Város megadása kötelező!"),
    address: z.string().nonempty("Cím megadása kötelező!"),
    auth: z.enum(["email", "google", "github"]).refine((val) => !!val, {
        message: "Szerepkör megadása kötelező!",
    }),
});
export type SignUpSchoolSkeletonDTO = z.infer<typeof signUpSchoolSkeletonSchema>;

export const organizationSchema = z.object({
    name: z.string().nonempty("Szervezetnév megadása kötelező!").min(3, "Szervezetnév túl rövid!"),
    om: z.string().refine(
        (val) => val === "" || val.length >= 6,
        "Az OM azonosító legalább 6 karakter hosszú kell legyen!"
    ).optional(),
    region: z.string().nonempty("Megye megadása kötelező!"),
    postalCode: z.string().nonempty("Irányítószám megadása kötelező!"),
    city: z.string().nonempty("Város megadása kötelező!"),
    address: z.string().nonempty("Cím megadása kötelező!"),
});
export type OrganizationDTO = z.infer<typeof organizationSchema>;

export const organizationContactSchema = z.object({
    id: z.string(),
    name: z.string().nonempty("Név megadása kötelező!"),
    email: z.string().email("Hibás e-mail cím formátum!"),
    phone: z.string().nonempty("Telefonszám megadása kötelező!"),
});
export type OrganizationContactDTO = z.infer<typeof organizationContactSchema>;

export const signUpEmailSchema = z.object({
    email: z.string().email("Hibás e-mail cím formátum!"),
    name: z.string().nonempty("Név megadása kötelező!"),
    orgId: z.string().optional(),

});
export type SignUpEmailDTO = z.infer<typeof signUpEmailSchema>;

export const signUpSkeletonComplete = z.object({
    password: z.string().min(8, "A jelszó legalább 8 karakter hosszú legyen!"),
    passwordConfirm: z.string().min(8, "A jelszó legalább 8 karakter hosszú legyen!"),
    orgId: z.string().optional(),
    userId: z.string().nonempty("Felhasználói azonosító megadása kötelező!")
}).refine(data => data.password === data.passwordConfirm, {
    message: "A jelszavaknak meg kell egyezniük!",
    path: ["passwordConfirm"],
});

export type SignUpSkeletonCompleteDTO = z.infer<typeof signUpSkeletonComplete>;

export const signInSchema = z.object({
    email: z.string().email("Hibás e-mail cím formátum!"),
    password: z.string().nonempty("Jelszó megadása kötelező!"),
    remember: z.boolean().optional(),
});
export type SignInDTO = z.infer<typeof signInSchema>;