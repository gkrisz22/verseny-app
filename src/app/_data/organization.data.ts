import organizationService from "@/services/organization.service";

const getSchoolData = async (organizationId: string) => {
    const school = await organizationService.getWhere({
        id: organizationId
    });

    return school;
}