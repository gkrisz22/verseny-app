import { Middleware } from "./middleware";
import userService from "@/services/user.service";
import { logger } from "@/lib/logger";
import { auth, signOut } from "@/auth";

class AuthMiddleware<T> implements Middleware<T> {
    public async handle(_: FormData | object) {
        const session = await auth();
        console.log("Running auth middleware.");

        try{
            if (!session) {
                logger.error("Nincs bejelentkezve.");
                throw new Error("Nincs bejelentkezve.");
            }
    
            if (!session.user || !session.user.id) {
                throw new Error("Érvénytelen munkamenet.");
            }
            
            const isUserValid = await this.isUserValid(session.user.id);
            if (!isUserValid) {
                throw new Error("Az Önhöz tartozó felhasználói fiók inaktívált vagy nem található.");
            }
        }
        catch(e) {
            await signOut();
            logger.error("Hiba történt a munkamenet ellenőrzése közben.");
            return {
                success: false,
                message: e instanceof Error ? e.message : "Hiba történt a munkamenet ellenőrzése közben.",
            }
        }
        
    }

    private async isUserValid(id: string) {
        const user = await userService.get(id);

        if (!user || user.status == "INACTIVE") {
            return false;
        }
        return true;
    }
}

const authMiddleware = new AuthMiddleware();
export default authMiddleware;