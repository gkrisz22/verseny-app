import { Middleware } from "./middleware";
import userService from "@/services/user.service";
import { logger } from "@/lib/logger";
import { auth } from "@/auth";

class AuthMiddleware<T> implements Middleware<T> {
    public async handle(_: FormData) {
        const session = await auth();
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
        const user = await userService.get(id);

        if (!user || user.status == "INACTIVE") {
            return false;
        }
    }
}

const authMiddleware = new AuthMiddleware();
export default authMiddleware;