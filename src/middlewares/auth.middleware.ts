import { Session } from "next-auth";
import { Middleware } from "./middleware";
import userService from "@/services/user.service";
import { logger } from "@/lib/logger";

class AuthMiddleware<T> implements Middleware<T> {
    public async handle(_: FormData, session?: Session) {
        if (!session) {
            logger.error("Nincs bejelentkezve.");
            return {
                success: false,
                message: "Nincs bejelentkezve."
            } 
        }

        if (!session.user || !session.user.id) {
            return {
                success: false,
                message: "Érvénytelen munkamenet."
            } 
        }
        const isUserValid = await this.isUserValid(session.user.id);

        if (!isUserValid) {
            return {
                success: false,
                message: "Felhasználó nem található."
            }
        }
    }

    private async isUserValid(id: string) {
        const user = userService.get(id);

        if (!user) {
            return false;
        }
    }
}

const authMiddleware = new AuthMiddleware();
export default authMiddleware;