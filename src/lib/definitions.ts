import { z } from "zod";

export const signUpStepOneSchema = z.object({
    email: z.string().email("Hibás e-mail cím formátum!"),
    role: z.string().nonempty("Szerepkör megadása kötelező!"),
});
export type SignUpStepOneDTO = z.infer<typeof signUpStepOneSchema>;

export const competitionSchema = z.object({
    title: z.string().min(3, "Túl rövid a verseny neve"),
    startDate: z.string().min(3, "From is too short"),
    endDate: z.string().min(3, "To is too short"),
    typeId: z.string(),
    
});
export type CompetitionDTO = z.infer<typeof competitionSchema>;

export const signUpSchoolSkeletonSchema = z.object({
    email: z.string().email("Hibás e-mail cím formátum!"),
    name: z.string().nonempty("Iskolanév megadása kötelező!").min(3, "Iskolanév túl rövid!"),
    om: z.string().refine(
        (val) => val === "" || val.length >= 6,
        "Az OM azonosító legalább 6 karakter hosszú kell legyen!"
    ).optional(),
    region: z.string().nonempty("Megye megadása kötelező!"),
    postalCode: z.string().nonempty("Irányítószám megadása kötelező!"),
    city: z.string().nonempty("Város megadása kötelező!"),
    address: z.string().nonempty("Cím megadása kötelező!"),
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