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