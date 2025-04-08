import { File } from "@prisma/client";

export interface CompetitionFormData {
  title: string;
  startDate: string;
  endDate: string;
}

export interface CategoryFormData {
  competitionId: string;
  name: string;
}

export interface StageFormData {
  categoryId: string;
  name: string;
}

export interface TaskFormData {
  stageId: string;
  files: File
}
