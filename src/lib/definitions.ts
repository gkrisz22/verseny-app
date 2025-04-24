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
    shortDescription: z.string().optional(),
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


export const categoryEligibilitySchema = z.object({
  categoryId: z.string({
    required_error: "Kategória azonosító megadása kötelező!",
  }),
  grades: z.string()
}).refine((val) => {
  const grades = val.grades.split(",").map((grade) => parseInt(grade));
  return grades.length > 0;
})
export type CategoryEligibilityDTO = z.infer<typeof categoryEligibilitySchema>;


export const createStudentSchema = z.object({
    name: z.string().nonempty("Név megadása kötelező!"),
    grade: z.string().nonempty("Osztály megadása kötelező!"),
}).refine((val) => {
    const grade = parseInt(val.grade);
    return grade >= 1 && grade <= 12;
}, {
    message: "Az osztály értéke 1 és 12 között kell legyen!"
})
export type CreateStudentDTO = z.infer<typeof createStudentSchema>;


export const editStageSchema = z.object({
    name: z.string().nonempty("Név megadása kötelező!"),
    description: z.string().nonempty("Leírás megadása kötelező!"),
    startDate: z.string().nonempty("Kezdő dátum megadása kötelező!"),
    endDate: z.string().nonempty("Befejező dátum megadása kötelező!"),
    stageId: z.string().nonempty("Forduló azonosító megadása kötelező!"),
});
export type EditStageDTO = z.infer<typeof editStageSchema>;

export const closeStageSchema = z.object({
    points: z.string().nonempty("Pontszám megadása kötelező!"),
    confirm: z.string().nonempty("Kérem, erősítse meg a lezárási szándékát!"),
    stageId: z.string().nonempty("Forduló azonosító megadása kötelező!"),
});
export type CloseStageDTO = z.infer<typeof closeStageSchema>;

export const openStageSchema = z.object({
    stageId: z.string().nonempty("Forduló azonosító megadása kötelező!"),
    accessDate: z.string({ required_error: "Hozzáférési dátum megadása kötelező!" }),
    confirm: z.string().nonempty("Kérem, erősítse meg a nyitási szándékát!"),
});
export type OpenStageDTO = z.infer<typeof openStageSchema>;

export const inviteOrgUserSchema = z.object({
    email: z.string().email("Hibás e-mail cím formátum!"),
    name: z.string().nonempty("Név megadása kötelező!"),
    roles: z.string().nonempty("Szerepkör megadása kötelező!"),
}).refine((val) => {
    const roles = val.roles.split("&").map((role) => role.trim());
    return roles.length > 0;
}, {
    message: "Legalább egy szerepkör megadása kötelező!",
}).refine((val) => {
    const roles = val.roles.split("&").map((role) => role.trim());
    return roles.every((role) => ["admin", "contact", "trusted", "teacher"].includes(role));
}, {
    message: "Hibás szerepkör megadva!",
});
export type InviteOrgUserDTO = z.infer<typeof inviteOrgUserSchema>;

export const signUpTeacherSchema = z.object({
    userId: z.string().nonempty("Felhasználói azonosító megadása kötelező!"),
    subjects: z.string().optional(),
});
export type SignUpTeacherDTO = z.infer<typeof signUpTeacherSchema>;

export const signUpSkeletonSchema = z.object({
    name: z.string().nonempty("Név megadása kötelező!"),
    email: z.string().email("Hibás e-mail cím formátum!"),
    password: z.string().min(8, "A jelszó legalább 8 karakter hosszú legyen!"),
    passwordConfirm: z.string().min(8, "A jelszó legalább 8 karakter hosszú legyen!"),
    orgId: z.string().optional(),
}).refine((val) => {
    const password = val.password;
    const passwordConfirm = val.passwordConfirm;
    return password === passwordConfirm;
}
, {
    message: "A jelszavaknak meg kell egyezniük!",
});
export type SignUpSkeletonDTO = z.infer<typeof signUpSkeletonSchema>;

export const createTaskGroupSchema = z.object({
    title: z.string().nonempty("Feladatcsoportnév megadása kötelező!"),
    stageId: z.string().nonempty("Forduló azonosító megadása kötelező!")
});
export type CreateTaskGroupDTO = z.infer<typeof createTaskGroupSchema>;

export const updateCompetitionSignUpDateSchema = z.object({
    id: z.string().nonempty("Verseny azonosító megadása kötelező!"),
    signUpStartDate: z.string().nonempty("Jelentkezési kezdő dátum megadása kötelező!"),
    signUpEndDate: z.string().nonempty("Jelentkezési befejező dátum megadása kötelező!"),
});
export type UpdateCompetitionSignUpDateDTO = z.infer<typeof updateCompetitionSignUpDateSchema>;

export const updateCompetitionDatesSchema = z.object({
    id: z.string().nonempty("Verseny azonosító megadása kötelező!"),
    competitionStartDate: z.string().nonempty("Verseny kezdődátumának megadása kötelező!"),
    competitionEndDate: z.string().nonempty("Verseny végének dátuma megadása kötelező!"),
});
export type UpdateCompetitionDatesDTO = z.infer<typeof updateCompetitionDatesSchema>;


export const updateCategoryMetadataSchema = z.object({
    categoryId: z.string().nonempty("Kategória azonosító hiányzik!"),
    name: z.string().nonempty("Kategórianév megadása kötelező!"),
    description: z.string().optional(),
    published: z.string()
}).refine((val) => {
    const published = val.published;
    return published === "true" || published === "false";
}, {
    message: "Kategória láthatóságának megadása kötelező!",
});
export type UpdateCategoryMetadataDTO = z.infer<typeof updateCategoryMetadataSchema>;

export const handleAcademicYearSchema = z.object({
    id: z.string().optional(),
    name: z.string().nonempty("Tanév megadása kötelező!"),
    startDate: z.string().nonempty("Kezdő dátum megadása kötelező!"),
    endDate: z.string().nonempty("Befejező dátum megadása kötelező!"),
}).refine((val) => {
    const startDate = new Date(val.startDate);
    const endDate = new Date(val.endDate);
    return startDate < endDate;
}
, {
    message: "A kezdő dátumnak korábbinak kell lennie, mint a befejező dátum!",
});
export type HandleAcademicYearDTO = z.infer<typeof handleAcademicYearSchema>;

export const inviteUserSchema = z.object({
    email: z.string().email("Hibás e-mail cím formátum!"),
    name: z.string().nonempty("Név megadása kötelező!"),
    superAdmin: z.string().optional(),
}).refine((val) => {
    const superAdmin = val.superAdmin;
    return superAdmin === "true" || superAdmin === "false";
}
, {
    message: "Szerepkör megadása kötelező!",
});
export type InviteUserDTO = z.infer<typeof inviteUserSchema>;

export const updateUserSchema = z.object({
    id: z.string().nonempty("Felhasználói azonosító megadása kötelező!"),
    name: z.string().nonempty("Név megadása kötelező!"),
    email: z.string().email("Hibás e-mail cím formátum!"),
    superAdmin: z.string().optional(),
    isActive: z.string().optional(),
}).refine((val) => {
    const superAdmin = val.superAdmin;
    return superAdmin === "true" || superAdmin === "false";
}, {
    message: "Szerepkör megadása kötelező!",
}).refine((val) => {
    const isActive = val.isActive;
    return isActive === "true" || isActive === "false";
}, {
    message: "A felhasználó aktiválása kötelező!",
});
export type UpdateUserDTO = z.infer<typeof updateUserSchema>;