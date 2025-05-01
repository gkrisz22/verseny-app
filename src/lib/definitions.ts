import { z } from "zod";

export const signUpStepOneSchema = z.object({
    role: z.enum(["school"]).refine((val) => !!val, {
        message: "Szerepkör megadása kötelező!",
    }),
});
export type SignUpStepOneDTO = z.infer<typeof signUpStepOneSchema>;

export const competitionSchema = z.object({
    title: z.string().min(3, "Túl rövid a verseny neve"),
    startDate: z.string().min(3, ""),
    endDate: z.string().min(3, ""),
}).refine((val) => {
    const startDate = new Date(val.startDate);
    const endDate = new Date(val.endDate);
    return startDate < endDate;
}, {
    message: "A verseny kezdődátumának korábbinak kell lennie, mint a verseny végének dátuma!",
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
    contactEmail: z.string().nonempty("Kapcsolattartó e-mail cím megadása kötelező!").email("Hibás e-mail cím formátum!"),
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
    contactEmail: z.string().nonempty("Kapcsolattartó e-mail cím megadása kötelező!").email("Hibás e-mail cím formátum!"),
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
    id: z.string().optional(),
    name: z.string().optional().refine((val) => {
        return val === undefined || val === "" || val.length >= 2;
    }, "A név legalább 2 karakter hosszú kell legyen!"),
    grade: z.string().refine((val) => {
        const grade = parseInt(val);
        return val === undefined || val === "0" || (!isNaN(grade) && grade >= 1 && grade <= 13);
    }, "Az osztály értéke 1 és 13 között kell legyen!"),
    uniqueId: z.string().optional().refine((val) => {
        return val === undefined || val === "" || val.length === 6;
    }, "Az egyedi azonosító pontosan 6 karakter hosszú kell legyen!"),
}).refine((val) => {
    const hasName = val.name !== undefined && val.name !== "";
    const hasGrade = val.grade !== undefined && val.grade !== "0";
    const hasUniqueId = val.uniqueId !== undefined && val.uniqueId !== "";

    if(hasUniqueId && !val.id)
    {
        return true;
    }
    if((hasGrade && !hasName) || (hasName &&!hasGrade)) {
        return false;
    }
    return hasName && hasGrade
}, {
    message: "Legalább egy mező megadása kötelező! A név és az osztály vagy az egyedi azonosító megadása kötelező!",
});
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
}).refine((val) => {
    const points = val.points;
    return points !== "";
}, {
    message: "Pontszám megadása kötelező!",
    path: ["points"],
}).refine((val) => {
    const confirm = val.confirm;
    return confirm === "true";
}, {
    message: "Kérem, erősítse meg a lezárási szándékát!",
    path: ["confirm"],
});
export type CloseStageDTO = z.infer<typeof closeStageSchema>;

export const openStageSchema = z.object({
    stageId: z.string().nonempty("Forduló azonosító megadása kötelező!"),
    accessStartDate: z.string({ required_error: "Hozzáférési dátum megadása kötelező!" }),
    confirm: z.string({ required_error: "Kérem, erősítse meg a nyitási szándékát!" }).nonempty(),
}).refine((val) => {
    const confirm = val.confirm;
    return confirm === "true";
}, {
    message: "Kérem, erősítse meg a nyitási szándékát!",
    path: ["confirm"],
}).refine((val) => {
    const accessStartDate = val.accessStartDate;
    return accessStartDate !== "";
}, {
    message: "Hozzáférési dátum megadása kötelező!",
    path: ["accessStartDate"],
});
export type OpenStageDTO = z.infer<typeof openStageSchema>;

export const handleOrgUserSchema = z.object({
    email: z.string().email("Hibás e-mail cím formátum!"),
    name: z.string().nonempty("Név megadása kötelező!"),
    roles: z.string().nonempty("Szerepkör megadása kötelező!"),
    userId: z.string().optional(),
    isActive: z.string().optional(),
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
export type HandleOrgUserDTO = z.infer<typeof handleOrgUserSchema>;

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

export const updateUserProfileSchema = z.object({
    id: z.string().nonempty("Felhasználói azonosító megadása kötelező!"),
    name: z.string().nonempty("Név megadása kötelező!"),
    email: z.string().email("Hibás e-mail cím formátum!"),
    password: z.string().optional().refine((val) => {
        return val === undefined || val === "" || val.length >= 8;
    }, "A jelszó legalább 8 karakter hosszú kell legyen!"),
    passwordConfirm: z.string().optional().refine((val) => {
        return val === undefined || val === "" || val.length >= 8;
    }, "A jelszó legalább 8 karakter hosszú kell legyen!"),
}).refine((val) => {
    const password = val.password;
    const passwordConfirm = val.passwordConfirm;
    return password === passwordConfirm;
}
, {
    message: "A jelszavaknak meg kell egyezniük!",
});
export type UpdateUserProfileDTO = z.infer<typeof updateUserProfileSchema>;

export const updateCompetitionSettingsSchema = z.object({
    id: z.string().nonempty("Verseny azonosító megadása kötelező!"),
    competitionStartDate: z.string().nonempty("Verseny kezdődátumának megadása kötelező!"),
    competitionEndDate: z.string().nonempty("Verseny végének dátuma megadása kötelező!"),
    signUpStartDate: z.string().nonempty("Jelentkezési kezdő dátum megadása kötelező!"),
    signUpEndDate: z.string().nonempty("Jelentkezési befejező dátum megadása kötelező!"),
    published: z.string()
}).refine((val) => {
    const published = val.published;
    return published === "true" || published === "false";
},
{
    message: "Verseny láthatóságának megadása kötelező!",
}).refine((val) => {
    const competitionStartDate = new Date(val.competitionStartDate);
    const competitionEndDate = new Date(val.competitionEndDate);
    return competitionStartDate < competitionEndDate;
},
{
    message: "A verseny kezdődátumának korábbinak kell lennie, mint a verseny végének dátuma!",
}).refine((val) => {
    const signUpStartDate = new Date(val.signUpStartDate);
    const signUpEndDate = new Date(val.signUpEndDate);
    return signUpStartDate < signUpEndDate;
}, {
    message: "A jelentkezési iőszak kezdődátumának korábbinak kell lennie, mint a jelentkezési időszak végének dátuma!",
}).refine((val) => {
    const signUpStartDate = new Date(val.signUpStartDate);
    const competitionStartDate = new Date(val.competitionStartDate);
    return signUpStartDate < competitionStartDate;
}, {
    message: "A jelentkezési időszak kezdődátumának korábbinak kell lennie, mint a verseny kezdődátuma!",
}).refine((val) => {
    const signUpEndDate = new Date(val.signUpEndDate);
    const competitionEndDate = new Date(val.competitionEndDate);
    return signUpEndDate < competitionEndDate;
}, {
    message: "A jelentkezési befejező dátumának korábbinak kell lennie, mint a verseny végének dátuma!",
});
export type UpdateCompetitionSettingsDTO = z.infer<typeof updateCompetitionSettingsSchema>;

export const updateOngoingStageSchema = z.object({
    id: z.string().nonempty("Forduló azonosító megadása kötelező!"),
    accessStartDate: z.string().nonempty("Hozzáférési kezdődátum megadása kötelező!"),
    accessEndDate: z.string().optional(),
    evaluationStartDate: z.string().optional(),
    evaluationEndDate: z.string().optional(),
}).refine((val) => {
    if (val.accessEndDate) {
        const accessStartDate = new Date(val.accessStartDate);
        const accessEndDate = new Date(val.accessEndDate);
        return accessStartDate < accessEndDate;
    }
    return true;
}, {
    message: "A hozzáférési időszak kezdődátumának korábbinak kell lennie, mint a hozzáférési időszak végének dátuma!",
}).refine((val) => {
    if (val.evaluationStartDate && val.evaluationEndDate) {
        const evaluationStartDate = new Date(val.evaluationStartDate);
        const evaluationEndDate = new Date(val.evaluationEndDate);
        return evaluationStartDate < evaluationEndDate;
    }
    return true;
}, {
    message: "Az értékelési időszak kezdődátumának korábbinak kell lennie, mint az értékelési időszak végének dátuma!",
})
export type UpdateOngoingStageDTO = z.infer<typeof updateOngoingStageSchema>;

export const saveEvaluationSchema = z
    .array(
        z.object({
            taskId: z.string().nonempty("Feladat azonosító megadása kötelező!"),
            studentId: z.string().nonempty("Diák azonosító megadása kötelező!"),
            value: z.number().min(0, "A pontszám nem lehet negatív!"),
        })
    )
    .refine(
        (val) => {
            return val.length > 0;
        },
        {
            message: "Nincs megadott értékelt feladat!",
        }
    );

export type SaveEvaluationDTO = z.infer<typeof saveEvaluationSchema>;


export const organizationUpdateSchema = organizationSchema.extend({
    website: z.string().optional(),
    contactName: z.string().nonempty("Kapcsolattartó név megadása kötelező!"),
    contactEmail: z.string().nonempty("Kapcsolattartó e-mail cím megadása kötelező!").email("Hibás e-mail cím formátum!"),
    phoneNumber: z.string().optional().refine((val) => {
        if (!val || val === "") return true;    
        const phoneRegex = /^\+?[1-9]\d{1,14}$/;
        return phoneRegex.test(val);
    },
    {
        message: "A telefonszám formátuma hibás! Jó formátum: +36 1 234 5678.",
    }),
    id: z.string().optional(),
    isActive: z.string().optional(),
}).refine((val) => {
    const website = val.website;
    return website === "" || website?.startsWith("http://") || website?.startsWith("https://");
});
export type OrganizationUpdateDTO = z.infer<typeof organizationUpdateSchema>;

export const mediaUploadSchema = z.object({
    files: z.any()
});
export type MediaUploadDTO = z.infer<typeof mediaUploadSchema>;
