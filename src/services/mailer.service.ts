import { Category, Competition, Organization, Prisma, Stage } from "@prisma/client";
import { Service } from "./service";
import { Mailer } from "@/lib/mailer.lib";

export class MailerService extends Service {
    private mailer = new Mailer();
    constructor() {
        super();
    }

    async sendVerificationEmail(to: string, token: string) {
        const subject = 'Fiók megerősítése';
        const html = `
          <p>A regisztráció folytatásához, kérjük folytassa az alábbi linken:</p>
          <a href="${process.env.URL}/sign-up/verify/${token}">Megerősítés</a>
        `;
        return await this.mailer.sendEmail(to, subject, html);
    }

    async sendInviteEmail(to: string, token: string) {
        const subject = 'Meghívás';
        const html = `
          <p>Ön meghívást kapott a(z) ${process.env.URL} weboldalra.</p>
          <p>A regisztráció folytatásához, kérjük folytassa az alábbi linken:</p>
          <a href="${process.env.URL}/sign-up/verify/${token}">Megerősítés</a>

          <p>Amennyiben Google vagy GitHub fiókkal folytatja, mely ezen e-mailhez kötött, már be is jelentkezhet:</p>
          <a href="${process.env.URL}/sign-in">Bejelentkezés</a>
        `;
        return await this.mailer.sendEmail(to, subject, html);
    }

    async sendNewCompetitionEmail(competition: Competition) {
        const subject = 'Új verseny';
        const html = `
          <p>Új verseny érkezett:</p>
          
          <p>Neve: ${competition.title}</p>
          <p>Kezdete: ${competition.startDate}</p>
          <p>Vége: ${competition.endDate}</p>
          <p>Jelentkezés kezdete: ${competition.signUpStartDate}</p>
          <p>Jelentkezés vége: ${competition.signUpEndDate}</p>

          <p>Jelentkezéshez kattintson az alábbi linkre, vagy látogasson el a webalkalmazáshoz.</p>
          <a href="${process.env.URL}/org/versenyek">Megtekintés</a>
        `;
        // Minden aktív felhasználónak küldjük el az emailt
        const users = await this.db.user.findMany({
            where: {
                status: "ACTIVE",
                email: {
                    not: null
                }
            }
        });
        const recipients = users.map(user => user.email!);
        if (recipients.length === 0) {
            return;
        }
        return await this.mailer.sendEmail(recipients, subject, html);
    }

    async sendStageStartEmail(competition:Competition, category:Category, stage:Stage) {
        const subject = 'Új forduló kezdődöt a(z) ' + competition.title + ' versenyen';
        const html = `
          <p>Új forduló kezdődöt a(z) ${category.name} kategóriában:</p>
          <p>Neve: ${stage.name}</p>
          <p>Az adminisztrátorok ${ stage.accessStartDate ? new Date(stage.accessStartDate).toLocaleDateString() : ' [még nincs meghatározva]' } naptól kezdve tölthetik le a feladatokat.</p>`;
        
        const competitionOrgs = await this.db.competitionOrganization.findMany({
            where: {
                competitionId: competition.id
            },
            include: {
                organization: true
            }
        });
        const recipients = competitionOrgs.map(org => org.organization.contactEmail!);
        if (recipients.length === 0) {
            return;
        }
        return await this.mailer.sendEmail(recipients, subject, html);
    }

    async sendStageEndEmail(competition:Competition, category:Category, stage:Stage) {
        const subject = 'A(z)'+ competition.title +' versenyen a(z) '+ category.name +' kategóriában véget ért a(z) '+ stage.name +' forduló';
        const html = `
          <p>A(z) ${stage.name} forduló véget ért a(z) ${category.name} kategóriában.</p>
          <p>Az eredményekért látogasson el a webalkalmazáshoz.</p>
          <p>Ponthatár továbbjutáshoz: ${stage.minPoints}</p>`;

        const competitionOrgs = await this.db.competitionOrganization.findMany({
            where: {
                competitionId: competition.id
            },
            include: {
                organization: true
            }
        });
        const recipients = competitionOrgs.map(org => org.organization.contactEmail!);
        if (recipients.length === 0) {
            return;
        }
        return await this.mailer.sendEmail(recipients, subject, html);
    }
    
    async sendOrganizationAcceptedEmail(organization:Organization) {

        const subject = 'Szervezet jóváhagyva';
        const html = `
          <p>A(z) ${organization.name} szervezet regisztrációját elfogadtuk. Kérjük, jelentkezzen be a rendszerbe:</p>
          <a href="${process.env.URL}/sign-in">Bejelentkezés</a>
        `;
        return await this.mailer.sendEmail(organization.contactEmail!, subject, html);
    }

}

const mailerService = new MailerService();
export default mailerService;

