import authService from "@/services/auth.service";

export const validateToken = async (token: string) => {
    const t = await authService.validateToken(token);
   
    if(!t) {
        return {
            success: false,
            message: "Érvénytelen token."
        }
    }

    const user = await authService.getWithOrg(t.userId);
    if(!user) {
        return {
            success: false,
            message: "Felhasználó nem található."
        }
    }

    return {
        success: true,
        data: {
            user
        }
    }
};