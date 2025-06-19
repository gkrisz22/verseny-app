import { auth } from "@/auth";
import { Middleware } from "./middleware";
import { logger } from "@/lib/logger";
import { getSessionRole } from "@/lib/utilities";

class RoleMiddleware<T> implements Middleware<T> {
    public async handle(data: { role: string }) {
        try
        {
            const session = await auth();
            if(!data.role) {
                return {
                    success: false,
                    message: "Nincs kiválasztva szerepkör.",
                }
            }
            const sessionRole = await getSessionRole();
            
            if (!session?.user?.superAdmin && (!sessionRole || sessionRole !== data.role)) {
                throw new Error("Ezzel a szerepkörrel nem hajtható végre a művelet.");
            }
        }
        catch(e) {
            logger.error("Hiba történt a munkamenet ellenőrzése közben.");
            return {
                success: false,
                message: e instanceof Error ? e.message : "Hiba történt a munkamenet ellenőrzése közben.",
            }
        }
        
    }
}

const roleMiddleware = new RoleMiddleware();
export default roleMiddleware;