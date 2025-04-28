import fs from "fs";
import path from "path";
import { NextRequest, NextResponse } from "next/server";
import mediaService from "@/services/media.service";
import { getSecureCookie, setSecureCookie } from "@/lib/utilities";

export async function GET(req: NextRequest) {
    try {
        const fileId = await getSecureCookie("downloadToken");

        if (!fileId) {
            return NextResponse.json({ success: false, message: "Érvénytelen kérés." }, { status: 400 });
        }

        const file = await mediaService.findFileById(fileId);
        if (!file) {
            return NextResponse.json({ success: false, message: "Fájl nem található a rendszerben." }, { status: 404 });
        }

        const fullPath = path.join(process.cwd(), "public", file.path);
        if (!fs.existsSync(fullPath)) {
            return NextResponse.json({ success: false, message: "Fájl nem található a tárhelyen." }, { status: 404 });
        }

        const fileStream = fs.createReadStream(fullPath);
        const stream = new ReadableStream({
            start(controller) {
                fileStream.on("data", (chunk) => controller.enqueue(chunk));
                fileStream.on("end", () => controller.close());
                fileStream.on("error", (err) => controller.error(err));
            },
        });

        const safeFileName = file.name.replace(/[^a-z0-9_.-]/gi, "_");
        return new NextResponse(stream, {
            status: 200,
            headers: {
                "Content-Type": file.type,
                "Content-Disposition": `attachment; filename="${safeFileName}"`,
            },
        });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ success: false, message: "Lejárt a fájl kiszolgálási ideje." }, { status: 500 });
    }
    finally {
        await setSecureCookie({
            name: "downloadToken",
            value: "",
            time: { minutes: 0 },
        });
    }
}